/*!
 * TraceLoop — SCENE CONFIGS, part seven: the missing chrome — navbars,
 * sidebars, buttons, skeleton screens, breadcrumbs, pagination and a
 * command palette. Same contract as scenes.js; icons are sourced Lucide
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
  var SEARCH = "<circle cx='11' cy='11' r='8'/><path d='m21 21l-4.34-4.34'/>";
  var BELL = "M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326";
  var USER = "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2";
  var CHEVD = "m6 9l6 6l6-6";
  var CHEVR = "m9 18 6-6-6-6";
  var PLUS = "M5 12h14m-7-7v14";
  var HOME = "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z";
  var GEAR = "M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915";
  var FOLDER = "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z";
  var CHECK = "M20 6L9 17l-5-5";

  function ic(d, w, h, color, extra) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true' fill='none' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'>" + (extra || "") + "<path d='" + d + "'/></svg>";
  }
  function navLink(label) {
    return "<span style='" + DISPLAY + "font-size:11px;font-weight:500;color:#b0aea5'>" + label + "</span>";
  }
  function skelLine(w, h, r) {
    return "<span style='display:block;width:" + w + "px;height:" + h + "px;border-radius:" + (r || 4) + "px;background:#262420'></span>";
  }

  list.push(
  {
    name: "Navbar Search",
    category: "Navbar",
    style: "search",
    note: "A navbar search that widens from its magnifier when it's needed",
    box: {
      width: 320, height: 60,
      html: "<div style='display:flex;align-items:center;gap:14px;height:52px;padding:0 16px;background:#1c1b19;border-bottom:1px solid #33312c;box-sizing:border-box'>" +
            "<span style='width:9px;height:9px;border-radius:3px;background:#d97757;flex:none'></span>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5;flex:none'>TraceLoop</span>" +
            "<span style='display:flex;gap:12px;flex:none'>" + navLink("Styles") + navLink("Docs") + "</span>" +
            "<span class='tl-navsearch' style='position:relative;height:30px;margin-left:auto;flex:none'></span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "search", el: ".tl-navsearch",
        options: { collapsedWidth: 28, expandedWidth: 130, placeholder: "Search docs", durationMs: 420, restMs: 1600, color: "#d97757" } }
    ]
  },
  {
    name: "Navbar Account",
    category: "Navbar",
    style: "dropdown",
    note: "An account menu dropping from the navbar's avatar, its border tracing as it lands",
    box: {
      width: 320, height: 196,
      html: "<div style='display:flex;align-items:center;gap:14px;height:52px;padding:0 16px;background:#1c1b19;border-bottom:1px solid #33312c;box-sizing:border-box'>" +
            "<span style='width:9px;height:9px;border-radius:3px;background:#d97757;flex:none'></span>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5;flex:none'>TraceLoop</span>" +
            "<span style='display:flex;gap:12px;flex:none'>" + navLink("Styles") + navLink("Docs") + "</span>" +
            "<span class='tl-account' style='position:relative;margin-left:auto;flex:none;display:flex;align-items:center'></span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "dropdown", el: ".tl-account",
        options: { items: ["Profile", "Settings", "API keys", "Sign out"], trigger: "mara.l", durationMs: 320, restMs: 1600, color: "#d97757", placement: "bottom" } }
    ]
  },
  {
    name: "Sidebar Icons",
    category: "Sidebar",
    style: "orbit",
    note: "An icon-only rail: the active tool's ring traces itself, the panel holds its skeleton",
    box: {
      width: 320, height: 176,
      html: "<div style='display:flex;height:100%;box-sizing:border-box'>" +
            "<div style='width:56px;background:#1c1b19;border-right:1px solid #33312c;padding:12px 0;flex:none;display:flex;flex-direction:column;align-items:center;gap:6px'>" +
            "<span style='width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:#8f8d84'>" + ic(HOME, 17, 17, "#8f8d84") + "</span>" +
            "<span class='tl-rail-active' style='position:relative;width:36px;height:36px;border-radius:9px;background:#262420;display:flex;align-items:center;justify-content:center;color:#d97757'>" + ic(FOLDER, 17, 17, "#d97757") + "</span>" +
            "<span style='width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:#8f8d84'>" + ic(PLUS, 17, 17, "#8f8d84") + "</span>" +
            "<span style='margin-top:auto;width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:#8f8d84'>" + ic(GEAR, 17, 17, "#8f8d84") + "</span>" +
            "</div>" +
            "<div style='flex:1;padding:16px;display:flex;flex-direction:column;gap:9px'>" +
            skelLine("40%", 10) + skelLine("72%", 8) + skelLine("58%", 8) + skelLine("65%", 8) +
            "</div></div>",
      styleCss: "position:relative;background:#141413;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";overflow:hidden;"
    },
    parts: [
      { style: "orbit", el: ".tl-rail-active",
        options: { d: { shape: "roundRect", args: [36, 36, 9] }, durationMs: 1800, restMs: 1600, strokeWidth: 2, color: "#d97757", guideOpacity: 0.3 } }
    ]
  },
  {
    name: "Settings Sidebar",
    category: "Sidebar",
    style: "accordion",
    note: "A settings nav whose group expands while its edge draws — the section opens to its items",
    box: {
      width: 320, height: 200,
      html: "<div style='padding:12px 14px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5;padding:2px 4px'>Settings</div>" +
            "<div style='background:#262420;border:1px solid #33312c;border-radius:8px;padding:9px 12px;display:flex;align-items:center;gap:8px'>" +
            "<span style='color:#8f8d84;display:flex'>" + ic(USER, 14, 14, "#8f8d84", "<circle cx='12' cy='7' r='4'/>") + "</span>" +
            "<span style='" + DISPLAY + "font-size:11.5px;font-weight:500;color:#b0aea5'>Profile</span></div>" +
            "<div class='tl-group' style='background:#262420;border:1px solid #33312c;border-radius:8px;overflow:hidden'>" +
            "<div style='height:36px;display:flex;align-items:center;gap:8px;padding:0 12px'>" +
            "<span style='color:#d97757;display:flex'>" + ic(GEAR, 14, 14, "#d97757") + "</span>" +
            "<span style='" + DISPLAY + "font-size:11.5px;font-weight:500;color:#faf9f5'>Workspace</span>" +
            "<span style='margin-left:auto;color:#8f8d84;display:flex'>" + ic(CHEVD, 13, 13, "#8f8d84") + "</span></div>" +
            "<div style='padding:2px 12px 10px;display:flex;flex-direction:column;gap:7px'>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#b0aea5'>Members &middot; 8</span>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#b0aea5'>Domains &middot; 3</span>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#b0aea5'>Usage limits</span></div></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "accordion", el: ".tl-group",
        options: { durationMs: 420, restMs: 1600, closedHeight: 36, color: "#d97757" } }
    ]
  },
  {
    name: "Button Loading",
    category: "Button",
    style: "button",
    note: "A submit button that fills with progress, then hands itself to a check",
    box: {
      width: 320, height: 88,
      html: "<div style='display:flex;align-items:center;justify-content:center;gap:12px;height:100%;box-sizing:border-box'>" +
            "<button class='tl-save' style='position:relative;" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5;background:#262420;border:1px solid #3f3d34;border-radius:8px;padding:9px 22px;cursor:pointer;overflow:hidden'>Save changes</button>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>fills, then confirms</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "button", el: ".tl-save",
        options: { variant: "fill", durationMs: 1400, color: "#d97757" } }
    ]
  },
  {
    name: "Icon Buttons",
    category: "Button",
    style: "pulse",
    note: "A toolbar of icon buttons; the live one breathes so the eye lands on it",
    box: {
      width: 320, height: 76,
      html: "<div style='display:flex;align-items:center;justify-content:center;gap:10px;height:100%;box-sizing:border-box'>" +
            iconBtn(BELL, false) +
            iconBtn(PLUS, false) +
            "<span class='tl-live-btn' style='position:relative;width:38px;height:38px;border-radius:9px;background:#262420;border:1px solid #3f3d34;display:flex;align-items:center;justify-content:center;color:#d97757'>" + ic(GEAR, 17, 17, "#d97757") + "</span>" +
            iconBtn(FOLDER, false) +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-live-btn",
        options: { rings: 1, durationMs: 2000, strokeWidth: 3, maxOpacity: 0.4, color: "#d97757" } }
    ]
  },
  {
    name: "Skeleton Card",
    category: "Skeleton",
    style: "shimmer",
    note: "The classic loading card: image and text placeholders under one passing sheen",
    box: {
      width: 320, height: 150,
      html: "<div style='padding:14px 16px;display:flex;gap:12px;height:100%;box-sizing:border-box'>" +
            "<span class='tl-sk-img' style='position:relative;width:110px;height:110px;border-radius:8px;background:#262420;flex:none'></span>" +
            "<div style='flex:1;display:flex;flex-direction:column;gap:9px;padding-top:4px'>" +
            "<span class='tl-sk-t' style='position:relative;display:block;width:80%;height:11px;border-radius:4px;background:#262420'></span>" +
            "<span class='tl-sk-b' style='position:relative;display:block;width:100%;height:8px;border-radius:4px;background:#262420'></span>" +
            "<span style='display:block;width:64%;height:8px;border-radius:4px;background:#262420'></span>" +
            "<span style='margin-top:auto;display:flex;gap:6px'>" +
            "<span style='width:54px;height:20px;border-radius:6px;background:#262420'></span>" +
            "<span style='width:40px;height:20px;border-radius:6px;background:#262420'></span></span>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "shimmer", el: ".tl-sk-img", options: { d: { shape: "underline", args: [110, 2] }, durationMs: 2600, strokeWidth: 4, color: "#faf9f5", guideOpacity: 0.08 } },
      { style: "shimmer", el: ".tl-sk-t", options: { d: { shape: "underline", args: [110, 2] }, durationMs: 2600, strokeWidth: 4, color: "#faf9f5", guideOpacity: 0.08 } },
      { style: "shimmer", el: ".tl-sk-b", options: { d: { shape: "underline", args: [130, 2] }, durationMs: 2600, strokeWidth: 4, color: "#faf9f5", guideOpacity: 0.08 } }
    ]
  },
  {
    name: "Skeleton List",
    category: "Skeleton",
    style: "shimmer",
    note: "Three loading rows — avatar, name line, meta line — each swept by the band",
    box: {
      width: 320, height: 150,
      html: "<div style='padding:10px 16px;display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box'>" +
            skelRow(1) + skelRow(2) + skelRow(3) +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "shimmer", el: ".tl-skl-1", options: { d: { shape: "underline", args: [230, 2] }, durationMs: 2600, strokeWidth: 4, color: "#faf9f5", guideOpacity: 0.08 } },
      { style: "shimmer", el: ".tl-skl-2", options: { d: { shape: "underline", args: [230, 2] }, durationMs: 2600, strokeWidth: 4, color: "#faf9f5", guideOpacity: 0.08 } },
      { style: "shimmer", el: ".tl-skl-3", options: { d: { shape: "underline", args: [230, 2] }, durationMs: 2600, strokeWidth: 4, color: "#faf9f5", guideOpacity: 0.08 } }
    ]
  },
  {
    name: "Breadcrumb Trail",
    category: "Breadcrumbs",
    style: "orbit",
    note: "A breadcrumb trail whose current page underlines itself",
    box: {
      width: 320, height: 60,
      html: "<div style='display:flex;align-items:center;gap:8px;height:100%;padding:0 18px;box-sizing:border-box'>" +
            "<span style='color:#8f8d84;display:flex'>" + ic(HOME, 13, 13, "#8f8d84") + "</span>" +
            "<span style='" + DISPLAY + "font-size:11.5px;color:#8f8d84'>Home</span>" +
            "<span style='color:#4a483f;display:flex'>" + ic(CHEVR, 11, 11, "#4a483f") + "</span>" +
            "<span style='" + DISPLAY + "font-size:11.5px;color:#8f8d84'>Library</span>" +
            "<span style='color:#4a483f;display:flex'>" + ic(CHEVR, 11, 11, "#4a483f") + "</span>" +
            "<span class='tl-crumb' style='position:relative;" + DISPLAY + "font-size:11.5px;font-weight:600;color:#faf9f5;padding-bottom:3px'>Orbit loader</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-crumb",
        options: { d: { shape: "underline", args: [74, 2] }, durationMs: 1400, restMs: 1800, strokeWidth: 2, color: "#d97757", guideOpacity: 0.3 } }
    ]
  },
  {
    name: "Pagination",
    category: "Pagination",
    style: "orbit",
    note: "A pager whose active page circle traces itself",
    box: {
      width: 320, height: 64,
      html: "<div style='display:flex;align-items:center;justify-content:center;gap:6px;height:100%;box-sizing:border-box'>" +
            "<span style='color:#4a483f;display:flex;padding:0 4px'>" + ic(CHEVR, 13, 13, "#4a483f") + "</span>" +
            page("1", false) +
            "<span class='tl-page' style='position:relative;width:28px;height:28px;border-radius:50%;background:#262420;display:flex;align-items:center;justify-content:center;" + DISPLAY + "font-size:11px;font-weight:600;color:#faf9f5'>2</span>" +
            page("3", false) +
            "<span style='" + DISPLAY + "font-size:11px;color:#4a483f;padding:0 2px'>&hellip;</span>" +
            page("8", false) +
            "<span style='color:#b0aea5;display:flex;padding:0 4px'>" + ic(CHEVR, 13, 13, "#b0aea5") + "</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-page",
        options: { d: { shape: "circle", args: [28] }, durationMs: 1500, restMs: 1800, strokeWidth: 2, color: "#d97757", guideOpacity: 0.3 } }
    ]
  },
  {
    name: "Command Palette",
    category: "Command",
    style: "search",
    note: "A command palette: the field takes the query while the result rows wait beneath",
    box: {
      width: 300, height: 190,
      html: "<div style='padding:12px 14px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box;background:#1c1b19;border:1px solid #3f3d34;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.4);box-sizing:border-box'>" +
            "<span class='tl-cmd' style='position:relative;height:32px;display:block'></span>" +
            "<div style='border-top:1px solid #33312c;padding-top:8px;display:flex;flex-direction:column;gap:2px'>" +
            cmdRow(SEARCH, "Go to styles", "G") +
            cmdRow(FOLDER, "Open playground", "P") +
            cmdRow(BELL, "Toggle notifications", "N") +
            "</div></div>",
      styleCss: "position:relative;"
    },
    parts: [
      { style: "search", el: ".tl-cmd",
        options: { collapsedWidth: 240, expandedWidth: 240, placeholder: "Type a command", durationMs: 500, restMs: 1700, color: "#d97757" } }
    ]
  }
  );

  function iconBtn(d, active) {
    return "<span style='width:38px;height:38px;border-radius:9px;background:#262420;border:1px solid #33312c;display:flex;align-items:center;justify-content:center;color:#8f8d84'>" + ic(d, 17, 17, "#8f8d84") + "</span>";
  }
  function skelRow(n) {
    return "<div style='display:flex;align-items:center;gap:10px'>" +
      "<span style='width:26px;height:26px;border-radius:50%;background:#262420;flex:none'></span>" +
      "<div style='flex:1;display:flex;flex-direction:column;gap:6px'>" +
      "<span class='tl-skl-" + n + "' style='position:relative;display:block;width:70%;height:8px;border-radius:4px;background:#262420'></span>" +
      "<span style='display:block;width:45%;height:7px;border-radius:4px;background:#262420'></span></div></div>";
  }
  function page(n) {
    return "<span style='width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;" + DISPLAY + "font-size:11px;color:#8f8d84'>" + n + "</span>";
  }
  function cmdRow(d, label, kbd) {
    return "<div style='display:flex;align-items:center;gap:9px;padding:6px 8px;border-radius:6px'>" +
      "<span style='color:#8f8d84;display:flex'>" + ic(d, 13, 13, "#8f8d84") + "</span>" +
      "<span style='" + DISPLAY + "font-size:11.5px;color:#b0aea5'>" + label + "</span>" +
      "<span style='margin-left:auto;" + DISPLAY + "font-size:9px;color:#8f8d84;border:1px solid #33312c;border-radius:4px;padding:1px 5px'>" + kbd + "</span></div>";
  }
})(typeof window !== "undefined" ? window : this);
