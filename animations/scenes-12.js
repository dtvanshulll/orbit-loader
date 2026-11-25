/*!
 * TraceLoop — SCENE CONFIGS, part twelve: lists that reorder (the
 * ShuffleLoader style) and a batch of everyday components — search
 * suggestions, ratings, downloads, notifications, checkout, follow.
 * Same contract as scenes.js; icons are sourced Lucide paths
 * (better-icons).
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";

  // Sourced Lucide paths (better-icons).
  var BELL = "M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326";
  var CHECK = "M20 6L9 17l-5-5";
  var DOWNLOAD = "M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4";
  // lucide star's polygon points, expressed as a path so the orbit
  // crawler can trace the outline
  var STAR = "M12,2 L15.09,8.26 L22,9.27 L17,14.14 L18.18,21.02 L12,17.77 L5.82,21.02 L7,14.14 L2,9.27 L8.91,8.26 Z";

  function ic(d, w, h, color, sw) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true' fill='none' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='" + (sw || 2) + "'><path d='" + d + "'/></svg>";
  }
  function row(label, chip, chipColor) {
    return "<div style='display:flex;align-items:center;gap:8px;background:#262420;border:1px solid #33312c;border-radius:8px;padding:8px 11px;box-sizing:border-box'>" +
      "<span style='" + DISPLAY + "font-size:11.5px;font-weight:500;color:#faf9f5;flex:1'>" + label + "</span>" +
      "<span style='" + DISPLAY + "font-size:9.5px;font-weight:600;padding:3px 8px;border-radius:99px;color:" + chipColor + ";background:rgba(255,255,255,0.04);border:1px solid #3f3d34'>" + chip + "</span></div>";
  }
  function fieldMock(label, value, accent) {
    return "<div style='position:relative;background:#262420;border:1px solid #33312c;border-radius:8px;height:40px;box-sizing:border-box'>" +
      "<span style='position:absolute;top:0;left:8px;transform:translateY(-50%);background:#262420;padding:0 5px;" + DISPLAY + "font-size:11px;font-weight:500;color:" + accent + "'>" + label + "</span>" +
      "<span style='position:absolute;left:13px;top:50%;transform:translateY(-50%);" + BODY + "font-size:12.5px;color:#faf9f5'>" + value + "</span></div>";
  }
  function starHook(n) {
    return "<span class='tl-star-" + n + "' style='position:relative;display:inline-flex;width:22px;height:22px;flex:none'></span>";
  }
  function dlRow(name, pct, cls) {
    return "<div style='display:flex;align-items:center;gap:9px'>" +
      "<span style='display:inline-flex;color:#8f8d84;flex:none'>" + ic(DOWNLOAD, 13, 13, "#8f8d84") + "</span>" +
      "<div style='flex:1;display:flex;flex-direction:column;gap:4px'>" +
      "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:11px;font-weight:500;color:#faf9f5'>" + name + "</span>" +
      "<span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>" + pct + "</span></div>" +
      "<div class='" + cls + "' style='position:relative;width:100%;height:6px'></div></div></div>";
  }

  list.push(
  {
    name: "Task Queue",
    category: "List",
    style: "shuffle",
    note: "A priority queue that keeps reshuffling itself — rows glide to their new spots, FLIP-style",
    box: {
      width: 320, height: 208,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:7px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Build queue</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>auto-prioritized</span></div>" +
            "<div class='tl-queue' style='display:flex;flex-direction:column;gap:6px;flex:1'>" +
            row("Fix drawer edge flash", "P0", "#d97757") +
            row("Docs pass on STYLES-UI", "P2", "#8f8d84") +
            row("Ship the counter style", "P1", "#6a9bcc") +
            row("Playground filter fade", "P3", "#788c5d") +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "shuffle", el: ".tl-queue",
        options: { intervalMs: 2800, durationMs: 520 } }
    ]
  },
  {
    name: "Race Standings",
    category: "List",
    style: "shuffle",
    note: "Between rounds the standings reshuffle — every row glides one slot, the leader drops back",
    box: {
      width: 320, height: 190,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:7px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Standings</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>after lap 42</span></div>" +
            "<div class='tl-race' style='display:flex;flex-direction:column;gap:6px;flex:1'>" +
            row("K. Virtanen", "+0.000", "#d97757") +
            row("M. Okafor", "+0.412", "#faf9f5") +
            row("J. Alvarez", "+0.877", "#faf9f5") +
            row("T. Lindqvist", "+1.203", "#faf9f5") +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "shuffle", el: ".tl-race",
        options: { intervalMs: 2600, durationMs: 480, moveFrom: "last" } }
    ]
  },
  {
    name: "Search Suggestions",
    category: "Search",
    style: "input",
    note: "The field types its query while the suggestion list waits below, top match highlighted",
    box: {
      width: 320, height: 190,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<div class='tl-sug-field' style='position:relative;background:#262420;border:1px solid #33312c;border-radius:8px;padding:13px 12px 11px;height:40px;box-sizing:border-box'></div>" +
            "<div style='display:flex;flex-direction:column;gap:2px'>" +
            "<div style='background:#33312c;border-radius:6px;padding:7px 10px;" + DISPLAY + "font-size:11px;font-weight:500;color:#faf9f5'>drawer-loader.js</div>" +
            "<div style='padding:7px 10px;" + DISPLAY + "font-size:11px;color:#b0aea5'>dot-loader.js</div>" +
            "<div style='padding:7px 10px;" + DISPLAY + "font-size:11px;color:#b0aea5'>docs/drawer.md</div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-sug-field",
        options: { label: "Search files", value: "drawer", durationMs: 300, restMs: 1800, color: "#6a9bcc" } }
    ]
  },
  {
    name: "Rating Stars",
    category: "Rating",
    style: "orbit",
    note: "Five sourced star outlines fill one after another — the rating drawing itself in",
    box: {
      width: 320, height: 110,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box;justify-content:center'>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5'>Rate this trace</span>" +
            "<div style='display:flex;gap:8px'>" + starHook(1) + starHook(2) + starHook(3) + starHook(4) + starHook(5) + "</div>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>4.8 &middot; 2,314 ratings</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-star-1", options: { d: STAR, viewBox: "0 0 24 24", durationMs: 700, restMs: 2400, strokeWidth: 1.8, color: "#d97757", guideOpacity: 0.25 } },
      { style: "orbit", el: ".tl-star-2", options: { d: STAR, viewBox: "0 0 24 24", durationMs: 700, restMs: 2400, strokeWidth: 1.8, color: "#d97757", guideOpacity: 0.25, delayMs: 350 } },
      { style: "orbit", el: ".tl-star-3", options: { d: STAR, viewBox: "0 0 24 24", durationMs: 700, restMs: 2400, strokeWidth: 1.8, color: "#d97757", guideOpacity: 0.25, delayMs: 700 } },
      { style: "orbit", el: ".tl-star-4", options: { d: STAR, viewBox: "0 0 24 24", durationMs: 700, restMs: 2400, strokeWidth: 1.8, color: "#d97757", guideOpacity: 0.25, delayMs: 1050 } },
      { style: "orbit", el: ".tl-star-5", options: { d: STAR, viewBox: "0 0 24 24", durationMs: 700, restMs: 2400, strokeWidth: 1.8, color: "#d97757", guideOpacity: 0.25, delayMs: 1400 } }
    ]
  },
  {
    name: "Download Manager",
    category: "Download",
    style: "progress",
    note: "Three files, three states: one done with a check, one filling, one still waiting",
    box: {
      width: 320, height: 180,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:11px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Downloads</span>" +
            dlRow("traceloop-2.0.zip", "done", "dl-b1") +
            dlRow("playground-assets.zip", "42%", "dl-b2") +
            dlRow("examples-bundle.zip", "queued", "dl-b3") +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".dl-b1",
        options: { d: "M2,3 H286", viewBox: "0 0 288 6", strokeWidth: 6, headRadius: 2.5, color: "#788c5d", guideOpacity: 0.15, to: 1 } },
      { style: "progress", el: ".dl-b2",
        options: { d: "M2,3 H286", viewBox: "0 0 288 6", strokeWidth: 6, headRadius: 2.5, color: "#6a9bcc", guideOpacity: 0.15, to: 0.42 } },
      { style: "progress", el: ".dl-b3",
        options: { d: "M2,3 H286", viewBox: "0 0 288 6", strokeWidth: 6, headRadius: 2.5, color: "#8f8d84", guideOpacity: 0.15, to: 0.02 } }
    ]
  },
  {
    name: "Notification Bell",
    category: "Notification",
    style: "shake",
    note: "Something arrived: the bell gives a polite damped judder while the badge breathes",
    box: {
      width: 320, height: 100,
      html: "<div style='display:flex;align-items:center;gap:13px;height:100%;padding:0 18px;box-sizing:border-box'>" +
            "<div class='tl-bell-tile' style='position:relative;width:42px;height:42px;border-radius:10px;background:#262420;border:1px solid #33312c;display:flex;align-items:center;justify-content:center;flex:none;color:#faf9f5'>" +
            ic(BELL, 19, 19, "#faf9f5") +
            "<span class='tl-bell-badge' style='position:absolute;top:-4px;right:-4px;width:15px;height:15px;display:flex;align-items:center;justify-content:center;background:#d97757;border-radius:50%;" + DISPLAY + "font-size:9px;font-weight:600;color:#141413'>3</span></div>" +
            "<div style='display:flex;flex-direction:column;gap:2px'>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5'>New activity</span>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>3 mentions since yesterday</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "shake", el: ".tl-bell-tile",
        options: { variant: "little", durationMs: 700, restMs: 2400 } },
      { style: "pulse", el: ".tl-bell-badge",
        options: { rings: 1, dot: false, durationMs: 1700, strokeWidth: 3, maxOpacity: 0.5, color: "#d97757" } }
    ]
  },
  {
    name: "Checkout Stepper",
    category: "Checkout",
    style: "swap",
    note: "Cart, payment, confirmation — three panels cycling through the checkout, dots tracking the step",
    box: {
      width: 320, height: 236,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;gap:6px;align-items:center'>" +
            "<span style='width:7px;height:7px;border-radius:50%;background:#d97757'></span>" +
            "<span style='width:7px;height:7px;border-radius:50%;background:#3f3d34'></span>" +
            "<span style='width:7px;height:7px;border-radius:50%;background:#3f3d34'></span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>checkout</span></div>" +
            "<div class='tl-checkout' style='position:relative;flex:1'>" +
            "<div style='position:absolute;inset:0;display:flex;flex-direction:column;gap:9px'>" +
            row("TraceLoop license", "$49", "#6a9bcc") +
            row("Team seats \u00d7 3", "$0", "#788c5d") +
            "<div style='display:flex;align-items:baseline;margin-top:auto'><span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>Total</span><span style='" + DISPLAY + "margin-left:auto;font-size:15px;font-weight:600;color:#faf9f5'>$49.00</span></div>" +
            "</div>" +
            "<div style='position:absolute;inset:0;display:flex;flex-direction:column;gap:9px'>" +
            fieldMock("Card number", "4242 4242 4242 4242", "#8f8d84") +
            "<div style='display:flex;gap:8px'>" + fieldMock("Expiry", "12/28", "#8f8d84") + fieldMock("CVC", "\u2022\u2022\u2022", "#8f8d84") + "</div>" +
            "<div style='margin-top:auto;height:36px;display:flex;align-items:center;justify-content:center;background:#d97757;border-radius:8px;" + DISPLAY + "font-size:12px;font-weight:600;color:#141413'>Pay $49.00</div>" +
            "</div>" +
            "<div style='position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px'>" +
            "<span class='tl-co-check' style='position:relative;display:inline-flex;width:44px;height:44px;align-items:center;justify-content:center;border-radius:50%;background:#262420;border:1px solid #3f3d34;color:#788c5d'></span>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Order confirmed</span>" +
            "<span style='" + BODY + "font-size:10.5px;color:#8f8d84'>receipt sent to your inbox</span>" +
            "</div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "swap", el: ".tl-checkout",
        options: { axis: "x", exitMs: 170, durationMs: 300, restMs: 2400 } },
      { style: "orbit", el: ".tl-co-check",
        options: { d: CHECK, viewBox: "0 0 24 24", durationMs: 900, restMs: 6200, strokeWidth: 2.5, color: "#788c5d", guideOpacity: 0.3, delayMs: 5470 } }
    ]
  },
  {
    name: "Follow Button",
    category: "Social",
    style: "button",
    note: "The follow button fills, then the check draws itself inside — followed, quietly",
    box: {
      width: 320, height: 110,
      html: "<div style='display:flex;align-items:center;gap:12px;height:100%;padding:0 18px;box-sizing:border-box'>" +
            "<span style='width:40px;height:40px;border-radius:50%;background:#33312c;display:flex;align-items:center;justify-content:center;" + DISPLAY + "font-size:13px;font-weight:600;color:#b0aea5;flex:none'>TV</span>" +
            "<div style='display:flex;flex-direction:column;gap:2px;flex:1'>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5'>traceloop</span>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>animation library</span></div>" +
            "<button class='tl-follow' style='position:relative;display:flex;align-items:center;justify-content:center;gap:7px;width:96px;height:34px;background:#d97757;border:0;border-radius:99px;" + DISPLAY + "font-size:11.5px;font-weight:600;color:#141413;cursor:pointer;overflow:hidden;flex:none'>" +
            "<span class='tl-follow-check' style='position:relative;display:inline-flex;width:13px;height:13px;flex:none'></span>" +
            "<span>Follow</span></button>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "button", el: ".tl-follow",
        options: { variant: "fill", durationMs: 1400, restMs: 2600, color: "#141413" } },
      { style: "orbit", el: ".tl-follow-check",
        options: { d: CHECK, viewBox: "0 0 24 24", durationMs: 700, restMs: 3300, strokeWidth: 3, color: "#141413", delayMs: 1500 } }
    ]
  }
  );
})(typeof window !== "undefined" ? window : this);
