/*
 * scripts/smoke.js — the repo's `npm test` baseline. No dependencies.
 *
 * Catches the two failure classes that have actually shipped here:
 *   1. syntax errors in any library or scene source (node --check),
 *   2. scene files that pass a syntax check but throw at runtime and
 *      silently register nothing — the scenes-more.js "CHECK is not
 *      defined" bug that dropped 12 of 127 demos while everything
 *      looked green.
 *
 * Exits 0 with a SMOKE OK line, or 1 naming every failing file.
 */
"use strict";
var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var root = path.join(__dirname, "..");

/* Every source file the library or the playground loads. */
function collect(dir, out) {
  var entries = fs.readdirSync(path.join(root, dir), { withFileTypes: true });
  entries.forEach(function (e) {
    var rel = dir + "/" + e.name;
    if (e.isDirectory()) { collect(rel, out); return; }
    if (/\.js$/.test(e.name) && !/^dist\//.test(rel)) out.push(rel);
  });
  return out;
}

var files = []
  .concat(collect("src", []))
  .concat(collect("animations", []))
  .concat(collect("scripts", []).filter(function (f) { return f !== "scripts/smoke.js"; }))
  .concat(fs.readdirSync(root).filter(function (f) {
    return (/\.js$/.test(f) || /-loader\.js$/.test(f)) && fs.statSync(path.join(root, f)).isFile();
  }).map(function (f) { return f; }))
  .filter(function (f, i, a) { return a.indexOf(f) === i; })
  .sort();

var failures = [];

/* 1 — syntax gate. */
files.forEach(function (f) {
  var r = cp.spawnSync(process.execPath, ["--check", path.join(root, f)], { encoding: "utf8" });
  if (r.status !== 0) failures.push(f + " — syntax: " + (r.stderr || "").split("\n")[0]);
});

/* 2 — runtime gate for scene files: each must load under the DOM stub
 * and grow ORBIT_ANIMATIONS by at least one entry. */
var DOM_STUB =
  "global.window = { ORBIT_ANIMATIONS: [], matchMedia: function () { return { matches: false }; } };" +
  "global.document = {" +
  "  createElement: function () { return { style: {}, setAttribute: function () {}, appendChild: function () {} }; }," +
  "  createElementNS: function () { return { style: {}, setAttribute: function () {}, appendChild: function () {} }; }," +
  "  querySelector: function () { return null; }," +
  "  querySelectorAll: function () { return []; }," +
  "  addEventListener: function () {}" +
  "};";
var sceneFiles = files.filter(function (f) { return /^animations\//.test(f); });
var totalEntries = 0;
sceneFiles.forEach(function (f) {
  var probe = DOM_STUB +
    "var before = global.window.ORBIT_ANIMATIONS.length;" +
    "try { require(process.argv[1]); } catch (e) {" +
    "  console.error('RUNTIME ' + e.message); process.exit(2); }" +
    "var after = global.window.ORBIT_ANIMATIONS.length;" +
    "if (after <= before) { console.error('EMPTY ' + (after - before)); process.exit(3); }" +
    "console.log(after - before);";
  var r = cp.spawnSync(process.execPath, ["-e", probe, path.join(root, f)], { encoding: "utf8" });
  if (r.status !== 0) {
    var tag = r.status === 2 ? "runtime throw" : "registered nothing";
    failures.push(f + " — " + tag + ": " + (r.stderr || "").trim().split("\n")[0]);
  } else {
    totalEntries += parseInt((r.stdout || "0").trim(), 10) || 0;
  }
});

if (failures.length) {
  console.error("SMOKE FAILED — " + failures.length + " file(s):");
  failures.forEach(function (f) { console.error("  " + f); });
  process.exit(1);
}
console.log("SMOKE OK — " + files.length + " files checked, " +
  sceneFiles.length + " scene files, " + totalEntries + " animations registered");
