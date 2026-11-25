/*!
 * TraceLoop — SCENE CONFIGS, part eight: third variants for the
 * single-demo families — navbars, sidebars, buttons, tables, charts,
 * empty states. Same contract as scenes.js; icons are sourced Lucide
 * paths (better-icons).
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";

  // Sourced Lucide paths (better-icons get lucide:<name>).
  var ARROW_UD = "m21 16l-4 4l-4-4m4 4V4M3 8l4-4l4 4M7 4v16";
  var CHECK = "M20 6L9 17l-5-5";

  function ic(d, w, h, color, sw) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true' fill='none' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='" + (sw || 2) + "'><path d='" + d + "'/></svg>";
  }

  list.push(
  {
    name: "Navbar Tabs",
    category: "Navbar",
    style: "tab",
    note: "A navbar whose section underline crawls to whichever tab you click",
    box: {
      width: 320, height: 64,
      html: "<div style='display:flex;align-items:center;gap:14px;height:52px;padding:0 16px;background:#1c1b19;border-bottom:1px solid #33312c;box-sizing:border-box'>" +
            "<span style='width:9px;height:9px;border-radius:3px;background:#d97757;flex:none'></span>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5;flex:none'>TraceLoop</span>" +
            "<span class='tl-navtabs' style='position:relative;height:30px;margin-left:auto;flex:none;width:170px;color:#b0aea5'></span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "tab", el: ".tl-navtabs",
        options: { tabs: 3, labels: ["Styles", "Docs", "Blog"], durationMs: 700, restMs: 1800, strokeWidth: 2, color: "#d97757" } }
    ]
  },
  {
    name: "Sidebar Badges",
    category: "Sidebar",
    style: "pulse",
    note: "A nav list with count badges; the row that needs you breathes",
    box: {
      width: 320, height: 170,
      html: "<div style='padding:12px 10px;display:flex;flex-direction:column;gap:2px;height:100%;box-sizing:border-box'>" +
            badgeRow("Overview", false, "") +
            badgeRow("Deployments", true, "3") +
            badgeRow("Members", false, "") +
            badgeRow("Usage", false, "12") +
            badgeRow("Settings", false, "") +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-badge-live",
        options: { rings: 1, dot: false, durationMs: 2000, strokeWidth: 3, maxOpacity: 0.4, color: "#d97757" } }
    ]
  },
  {
    name: "Destructive Button",
    category: "Button",
    style: "button",
    note: "A delete button whose border traces while it waits for the confirm click",
    box: {
      width: 320, height: 84,
      html: "<div style='display:flex;align-items:center;justify-content:center;gap:12px;height:100%;box-sizing:border-box'>" +
            "<button class='tl-del' style='position:relative;" + DISPLAY + "font-size:12.5px;font-weight:600;color:#d97757;background:#262420;border:1px solid #3f3d34;border-radius:8px;padding:9px 22px;cursor:pointer;overflow:hidden'>Delete workspace</button>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>border traces, then holds</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "button", el: ".tl-del",
        options: { variant: "trace", durationMs: 1600, restMs: 2000, strokeWidth: 2, color: "#d97757" } }
    ]
  },
  {
    name: "Sortable Table",
    category: "Data Table",
    style: "orbit",
    note: "A table whose active column's sort arrow draws itself in the header",
    box: {
      width: 320, height: 168,
      html: "<div style='padding:12px 16px;display:flex;flex-direction:column;gap:0;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;border-bottom:1px solid #33312c;padding-bottom:7px'>" +
            "<span style='" + DISPLAY + "flex:1;font-size:9.5px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8f8d84'>File</span>" +
            "<span class='tl-sort' style='position:relative;display:flex;align-items:center;gap:3px;width:88px;flex:none'>" +
            ic(ARROW_UD, 12, 12, "#d97757") +
            "<span style='" + DISPLAY + "font-size:9.5px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#d97757'>Size</span></span>" +
            "</div>" +
            tRow("intro.pdf", "2.4 MB") +
            tRow("demo-loop.mp4", "18.1 MB") +
            tRow("shapes.svg", "41 KB") +
            tRow("README.md", "9 KB") +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-sort",
        options: { d: "M17,3 v14 M13,13 l4,4 l4,-4 M7,21 v-14 M3,11 l4,-4 l4,4", durationMs: 1600, restMs: 2000, strokeWidth: 1.5, color: "#d97757", guideOpacity: 0.25 } }
    ]
  },
  {
    name: "Donut Chart",
    category: "Chart Card",
    style: "progress",
    note: "A donut that fills its own ring while the legend waits",
    box: {
      width: 320, height: 150,
      html: "<div style='padding:14px 16px;display:flex;align-items:center;gap:16px;height:100%;box-sizing:border-box'>" +
            "<div style='position:relative;width:96px;height:96px;flex:none;display:flex;align-items:center;justify-content:center'>" +
            "<span class='tl-donut' style='position:absolute;inset:0'></span>" +
            "<span style='" + DISPLAY + "font-size:15px;font-weight:600;color:#faf9f5'>68%</span></div>" +
            "<div style='display:flex;flex-direction:column;gap:8px'>" +
            legend("#d97757", "Video", "52%") +
            legend("#6a9bcc", "Docs", "31%") +
            legend("#788c5d", "Other", "17%") +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-donut",
        options: { d: { shape: "circle", args: [88] }, durationMs: 2200, restMs: 1600, strokeWidth: 7, color: "#d97757", guideOpacity: 0.15, headRadius: 0 } }
    ]
  },
  {
    name: "Bar Chart",
    category: "Chart Card",
    style: "progress",
    note: "Four bars fill from the baseline to this week's numbers",
    box: {
      width: 320, height: 168,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Deploys per day</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>This week</span></div>" +
            "<div style='flex:1;display:flex;align-items:flex-end;justify-content:space-between;padding:10px 6px 0;border-bottom:1px solid #33312c'>" +
            bar("M", 34, 0.55, 1) + bar("T", 46, 0.75, 2) + bar("W", 28, 0.45, 3) + bar("T", 58, 0.95, 4) + bar("F", 40, 0.65, 5) +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-bar-c1", options: { d: "M2,34 V2", strokeWidth: 12, headRadius: 0.1, color: "#d97757", guideOpacity: 0.2, to: 0.55 } },
      { style: "progress", el: ".tl-bar-c2", options: { d: "M2,46 V2", strokeWidth: 12, headRadius: 0.1, color: "#6a9bcc", guideOpacity: 0.2, to: 0.75 } },
      { style: "progress", el: ".tl-bar-c3", options: { d: "M2,28 V2", strokeWidth: 12, headRadius: 0.1, color: "#788c5d", guideOpacity: 0.2, to: 0.45 } },
      { style: "progress", el: ".tl-bar-c4", options: { d: "M2,58 V2", strokeWidth: 12, headRadius: 0.1, color: "#d97757", guideOpacity: 0.2, to: 0.95 } },
      { style: "progress", el: ".tl-bar-c5", options: { d: "M2,40 V2", strokeWidth: 12, headRadius: 0.1, color: "#6a9bcc", guideOpacity: 0.2, to: 0.65 } }
    ]
  },
  {
    name: "Empty Search",
    category: "Empty State",
    style: "orbit",
    note: "No results: the magnifier draws itself above the empty copy",
    box: {
      width: 320, height: 150,
      html: "<div style='display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;height:100%;box-sizing:border-box;padding:14px'>" +
            "<span class='tl-mag' style='position:relative;width:56px;height:56px;display:flex;align-items:center;justify-content:center;color:#8f8d84'></span>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>No matches</span>" +
            "<span style='" + BODY + "font-size:11.5px;color:#8f8d84;text-align:center'>Nothing in the library matches that query.<br>Try a style name or a category.</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-mag",
        options: { d: "M28,10 a18,18 0 1,0 0.01,0 M42,42 L33,33", durationMs: 1800, restMs: 2000, strokeWidth: 2, color: "#8f8d84", guideOpacity: 0.25 } }
    ]
  }
  );

  function badgeRow(label, live, count) {
    return "<div style='display:flex;align-items:center;padding:8px 12px;border-radius:8px;" + (live ? "background:#262420;" : "") + "'>" +
      "<span style='" + DISPLAY + "font-size:12px;font-weight:" + (live ? "600;color:#faf9f5" : "500;color:#b0aea5") + "'>" + label + "</span>" +
      (count ? "<span class='" + (live ? "tl-badge-live" : "") + "' style='position:relative;margin-left:auto;" + DISPLAY + "font-size:9.5px;font-weight:600;color:#d97757;background:#262420;border:1px solid #3f3d34;border-radius:999px;padding:2px 7px'>" + count + "</span>" : "") +
      "</div>";
  }
  function tRow(name, size) {
    return "<div style='display:flex;align-items:center;border-bottom:1px solid #262420;padding:8px 0'>" +
      "<span style='" + DISPLAY + "flex:1;font-size:11.5px;font-weight:500;color:#faf9f5'>" + name + "</span>" +
      "<span style='" + DISPLAY + "font-size:11px;color:#8f8d84;width:88px;text-align:right'>" + size + "</span></div>";
  }
  function legend(color, label, pct) {
    return "<div style='display:flex;align-items:center;gap:7px'>" +
      "<span style='width:8px;height:8px;border-radius:2px;background:" + color + ";flex:none'></span>" +
      "<span style='" + DISPLAY + "font-size:11px;color:#b0aea5'>" + label + "</span>" +
      "<span style='" + DISPLAY + "font-size:11px;font-weight:600;color:#faf9f5;margin-left:auto'>" + pct + "</span></div>";
  }
  function bar(day, h, frac, n) {
    return "<div style='display:flex;flex-direction:column;align-items:center;gap:6px'>" +
      "<span class='tl-bar-c" + n + "' style='position:relative;width:16px;height:" + h + "px'></span>" +
      "<span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>" + day + "</span></div>";
  }
})(typeof window !== "undefined" ? window : this);
