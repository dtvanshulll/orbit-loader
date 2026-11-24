/*!
 * build:css — concatenates the per-style CSS files (src/css/) into the
 * single dist/traceloop.css, in the same order the source files were
 * split from the old orbit-loader.css. The order matters: base tokens
 * first, then one block per style, variant overrides last.
 */
const fs = require("fs");
const order = [
  "base", "dot", "shimmer", "ripple", "dot-ghosts", "typing",
  "transitions", "search", "modal", "drawer", "accordion",
  "dropdown", "input", "variants"
];
fs.writeFileSync(
  "dist/traceloop.css",
  order.map(f => fs.readFileSync("src/css/" + f + ".css", "utf8")).join("")
);
console.log("dist/traceloop.css written (" + order.length + " parts)");
