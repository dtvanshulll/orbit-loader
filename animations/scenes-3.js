/*!
 * TraceLoop — SCENE CONFIGS, part three: Logos, Sidebar, Dashboard,
 * Chart Card, Kanban and Calendar. Same contract as scenes.js; the
 * chart scenes draw their own data lines — the loader's guide IS the
 * chart, the segment traces it.
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";
  var TREND = "m22 7l-8.5 8.5l-5-5L2 17" + "M16 7h6v6";
  var CHEVL = "m15 18l-6-6l6-6";
  var CHEVR = "m9 18l6-6l-6-6";
  function lucide(d, w, h, color, fill) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true'><path d='" + d + "' fill='" + (fill || "none") + "' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg>";
  }
  function navItem(label, active, ind) {
    return "<div style='display:flex;align-items:center;gap:8px;padding:7px 12px;" +
      (active ? "background:#262420;" : "") + "'>" +
      "<span style='width:7px;height:7px;border-radius:2px;background:" + (active ? "#d97757" : "#4a483f") + ";flex:none'></span>" +
      (ind ? "<span class='tl-nav-ind' style='position:absolute;left:2px;width:4px;height:30px'></span>" : "") +
      "<span style='" + DISPLAY + "font-size:11px;font-weight:" + (active ? "600;color:#faf9f5" : "400;color:#8f8d84") + "'>" + label + "</span></div>";
  }

  list.push(
  {
    name: "Logo Strip",
    category: "Logos",
    style: "shimmer",
    note: "A trusted-by strip with a light band passing over the wordmarks",
    box: {
      width: 320, height: 96,
      html: "<div style='padding:14px 20px;display:flex;flex-direction:column;gap:14px;height:100%;box-sizing:border-box;padding-bottom:24px'>" +
            "<div style='" + DISPLAY + "font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#8f8d84'>Trusted by teams at</div>" +
            "<div class='tl-strip' style='position:relative;display:flex;align-items:center;justify-content:space-between;padding-bottom:6px'>" +
            "<span style='" + DISPLAY + "font-size:14px;font-weight:700;color:#b0aea5'>Acme</span>" +
            "<span style='" + BODY + "font-size:15px;font-style:italic;color:#8f8d84'>Fjord</span>" +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:600;letter-spacing:0.12em;color:#b0aea5'>NIMBUS</span>" +
            "<span style='" + BODY + "font-size:15px;color:#8f8d84'>Vertex</span>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "shimmer", el: ".tl-strip",
        options: { d: { shape: "underline", args: [280, 2] }, durationMs: 3000, strokeWidth: 9, color: "#faf9f5", guideOpacity: 0.1 } }
    ]
  },

  {
    name: "Sidebar Active",
    category: "Sidebar",
    style: "orbit",
    note: "A nav rail whose active item's accent bar draws itself top to bottom",
    box: {
      width: 320, height: 180,
      html: "<div style='display:flex;height:100%;box-sizing:border-box'>" +
            "<div style='width:118px;background:#1c1b19;border-right:1px solid #33312c;padding:14px 0;flex:none;display:flex;flex-direction:column;gap:2px'>" +
            navItem("Overview", true, 1) +
            navItem("Deployments", false, 0) +
            navItem("Members", false, 0) +
            navItem("Settings", false, 0) +
            "</div>" +
            "<div style='flex:1;padding:16px;display:flex;flex-direction:column;gap:8px'>" +
            "<div style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5'>Overview</div>" +
            "<div style='height:8px;width:70%;background:#262420;border-radius:4px'></div>" +
            "<div style='height:8px;width:55%;background:#262420;border-radius:4px'></div>" +
            "<div style='height:8px;width:62%;background:#262420;border-radius:4px'></div>" +
            "</div></div>",
      styleCss: "position:relative;background:#141413;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";overflow:hidden;"
    },
    parts: [
      { style: "orbit", el: ".tl-nav-ind",
        options: { d: "M2,0 V30", durationMs: 1400, restMs: 1800, strokeWidth: 2.5, color: "#d97757", guideOpacity: 0.3 } }
    ]
  },

  {
    name: "Dashboard Mini",
    category: "Dashboard",
    style: "orbit",
    note: "An admin overview: stat tiles over a revenue line the loader draws itself",
    box: {
      width: 320, height: 208,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Overview</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>Last 30 days</span></div>" +
            "<div style='display:flex;gap:8px'>" +
            "<div style='flex:1;background:#262420;border:1px solid #33312c;border-radius:8px;padding:10px'><div style='" + DISPLAY + "font-size:9.5px;color:#8f8d84;text-transform:uppercase;letter-spacing:0.06em'>MRR</div><div style='" + DISPLAY + "font-size:16px;font-weight:600;color:#faf9f5'>$12.4k <span style=\"font-size:10px;font-weight:500;color:#788c5d\">+8%</span></div></div>" +
            "<div style='flex:1;background:#262420;border:1px solid #33312c;border-radius:8px;padding:10px'><div style='" + DISPLAY + "font-size:9.5px;color:#8f8d84;text-transform:uppercase;letter-spacing:0.06em'>Users</div><div style='" + DISPLAY + "font-size:16px;font-weight:600;color:#faf9f5'>1,284 <span style=\"font-size:10px;font-weight:500;color:#788c5d\">+3%</span></div></div>" +
            "</div>" +
            "<div class='tl-chart' style='position:relative;flex:1;min-height:56px'>" +
            "<div style='position:absolute;left:0;right:0;top:25%;height:1px;background:#262420'></div>" +
            "<div style='position:absolute;left:0;right:0;top:55%;height:1px;background:#262420'></div>" +
            "<div style='position:absolute;left:0;right:0;top:85%;height:1px;background:#262420'></div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-chart",
        options: { d: "M0,44 C24,38 40,18 64,26 C88,34 104,12 128,20 C152,28 168,8 192,15 C216,22 240,6 264,11 L286,8",
                   viewBox: "0 0 288 56", durationMs: 3400, restMs: 2200, strokeWidth: 2, color: "#d97757", guideOpacity: 0.25 } }
    ]
  },

  {
    name: "Revenue Chart",
    category: "Chart Card",
    style: "orbit",
    note: "A chart card whose data line is the loader's path — the guide is the rest of the series",
    box: {
      width: 320, height: 212,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:10px;color:#8f8d84;text-transform:uppercase;letter-spacing:0.06em'>Revenue</span><span style='" + DISPLAY + "margin-left:auto;display:flex;align-items:center;gap:4px;font-size:10.5px;font-weight:500;color:#788c5d'>" + lucide(TREND, 12, 12, "#788c5d") + "12.4%</span></div>" +
            "<div style='" + DISPLAY + "font-size:22px;font-weight:600;color:#faf9f5'>$48,240</div>" +
            "<div class='tl-chart' style='position:relative;flex:1;min-height:80px'>" +
            "<div style='position:absolute;left:0;right:0;top:20%;height:1px;background:#262420'></div>" +
            "<div style='position:absolute;left:0;right:0;top:50%;height:1px;background:#262420'></div>" +
            "<div style='position:absolute;left:0;right:0;top:80%;height:1px;background:#262420'></div>" +
            "</div>" +
            "<div style='display:flex;justify-content:space-between'><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>Mon</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>Wed</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>Fri</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>Sun</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-chart",
        options: { d: "M0,78 C20,70 34,52 56,58 C78,64 92,30 116,38 C140,46 156,18 180,26 C204,34 222,10 246,20 C262,26 276,14 288,16",
                   viewBox: "0 0 288 88", durationMs: 3600, restMs: 2400, strokeWidth: 2, color: "#d97757", guideOpacity: 0.25 } }
    ]
  },

  {
    name: "Kanban Board",
    category: "Kanban",
    style: "orbit",
    note: "A board where the active column's header underlines itself",
    box: {
      width: 320, height: 190,
      html: "<div style='display:flex;gap:8px;height:100%;padding:12px;box-sizing:border-box'>" +
            kanCol("To do", 3, false) +
            kanCol("In progress", 2, true) +
            kanCol("Done", 5, false) +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-kan-ind",
        options: { d: { shape: "underline", args: [72, 2] }, durationMs: 1600, restMs: 1800, strokeWidth: 2, color: "#6a9bcc", guideOpacity: 0.3 } }
    ]
  },

  {
    name: "Month Calendar",
    category: "Calendar",
    style: "pulse",
    note: "A month grid where today's cell breathes — you never hunt for the date",
    box: {
      width: 320, height: 224,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center'><span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>October 2026</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;display:flex;gap:6px;color:#8f8d84'>" + lucide(CHEVL, 14, 14, "#8f8d84") + lucide(CHEVR, 14, 14, "#8f8d84") + "</span></div>" +
            "<div style='display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center'>" +
            dow() + calCells() +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-today",
        options: { rings: 1, durationMs: 2000, strokeWidth: 5, maxOpacity: 0.4, color: "#d97757" } }
    ]
  },
  );

  function kanCol(name, count, active) {
    var cards = "";
    for (var i = 0; i < 2; i++) {
      cards += "<div style='background:#262420;border:1px solid #33312c;border-radius:6px;padding:8px;margin-top:6px'>" +
        "<div style='height:6px;width:" + (i ? "70%" : "85%") + ";background:#3f3d34;border-radius:3px'></div>" +
        "<div style='display:flex;align-items:center;gap:5px;margin-top:7px'><span style='width:6px;height:6px;border-radius:50%;background:" +
        (active ? "#6a9bcc" : "#4a483f") + "'></span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>" +
        (active ? "Design" : "Queue") + "</span></div></div>";
    }
    return "<div style='flex:1;background:#1c1b19;border:1px solid #33312c;border-radius:8px;padding:8px;min-width:0'>" +
      "<div style='display:flex;align-items:center;position:relative;" + (active ? "" : "opacity:0.7") + "'>" +
      (active ? "<span class='tl-kan-ind' style='position:relative;height:8px;width:72px;margin-right:6px'></span>" : "") +
      "<span style='" + DISPLAY + "font-size:10.5px;font-weight:600;color:#faf9f5'>" + name + "</span>" +
      "<span style='" + DISPLAY + "margin-left:auto;font-size:9px;color:#8f8d84'>" + count + "</span></div>" +
      cards + "</div>";
  }
  function dow() {
    return "<span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>S</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>M</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>T</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>W</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>T</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>F</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>S</span>";
  }
  function calCells() {
    var out = "";
    for (var d = 1; d <= 28; d++) {
      if (d === 17) {
        out += "<span class='tl-today' style='position:relative;display:flex;align-items:center;justify-content:center;height:24px;border-radius:6px;background:#d97757;color:#141413;font-size:10px;font-weight:600;" + DISPLAY + "'>" + d + "</span>";
      } else {
        out += "<span style='display:flex;align-items:center;justify-content:center;height:24px;border-radius:6px;color:#b0aea5;font-size:10px;" + DISPLAY + (d % 7 === 6 || d % 7 === 0 ? ";color:#6a655c" : "") + "'>" + d + "</span>";
      }
    }
    return out;
  }
})(typeof window !== "undefined" ? window : this);
