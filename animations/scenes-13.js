/*!
 * TraceLoop — SCENE CONFIGS, part thirteen: data components — stats,
 * gauges, polls, carts, theme switch, scrubber. Same contract as
 * scenes.js; icons are sourced Lucide paths (better-icons).
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var CARD_LIGHT = "background:#faf9f5;border:1px solid #dcd9d0;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";

  // Sourced Lucide paths (better-icons).
  var SUN = "M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41";
  var MOON = "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401";
  var CART = "m2.05 2.05l1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18";

  function ic(d, w, h, color, sw) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true' fill='none' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='" + (sw || 2) + "'><path d='" + d + "'/></svg>";
  }

  list.push(
  {
    name: "Stats Row",
    category: "Chart Card",
    style: "countup",
    note: "Three numbers counting up on offset clocks — a dashboard row arriving",
    box: {
      width: 320, height: 110,
      html: "<div style='display:flex;align-items:center;height:100%;padding:0 8px;box-sizing:border-box'>" +
            "<div style='flex:1;display:flex;flex-direction:column;gap:3px;padding:0 12px'>" +
            "<span style='" + DISPLAY + "font-size:9.5px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#8f8d84'>Traces</span>" +
            "<div class='tl-st1' style='" + DISPLAY + "font-size:20px;font-weight:600;color:#faf9f5;font-variant-numeric:tabular-nums'>0</div></div>" +
            "<span style='width:1px;height:44px;background:#33312c'></span>" +
            "<div style='flex:1;display:flex;flex-direction:column;gap:3px;padding:0 12px'>" +
            "<span style='" + DISPLAY + "font-size:9.5px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#8f8d84'>Styles</span>" +
            "<div class='tl-st2' style='" + DISPLAY + "font-size:20px;font-weight:600;color:#faf9f5;font-variant-numeric:tabular-nums'>0</div></div>" +
            "<span style='width:1px;height:44px;background:#33312c'></span>" +
            "<div style='flex:1;display:flex;flex-direction:column;gap:3px;padding:0 12px'>" +
            "<span style='" + DISPLAY + "font-size:9.5px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#8f8d84'>Stars</span>" +
            "<div class='tl-st3' style='" + DISPLAY + "font-size:20px;font-weight:600;color:#faf9f5;font-variant-numeric:tabular-nums'>0</div></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "countup", el: ".tl-st1",
        options: { value: 12840, durationMs: 2200, separator: ",", restMs: 2800 } },
      { style: "countup", el: ".tl-st2",
        options: { value: 23, durationMs: 1600, restMs: 2800, delayMs: 350 } },
      { style: "countup", el: ".tl-st3",
        options: { value: 3141, durationMs: 2000, separator: ",", restMs: 2800, delayMs: 700 } }
    ]
  },
  {
    name: "Storage Gauge",
    category: "Chart Card",
    style: "progress",
    note: "A semicircle gauge filling to 72% while the percentage counts up beneath it",
    box: {
      width: 320, height: 150,
      html: "<div style='display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2px;height:100%;padding:12px 0 14px;box-sizing:border-box'>" +
            "<div class='tl-gauge' style='position:relative;width:120px;height:66px'></div>" +
            "<div style='display:flex;align-items:baseline;gap:6px'>" +
            "<span class='tl-gauge-num' style='" + DISPLAY + "font-size:19px;font-weight:600;color:#faf9f5;font-variant-numeric:tabular-nums'>0%</span>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>of 50 GB used</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-gauge",
        options: { d: "M10,60 A50,50 0 0 1 110,60", viewBox: "0 0 120 70", strokeWidth: 9, headRadius: 4.5, color: "#d97757", guideOpacity: 0.15, to: 0.72 } },
      { style: "countup", el: ".tl-gauge-num",
        options: { value: 72, durationMs: 2000, suffix: "%", restMs: 2600 } }
    ]
  },
  {
    name: "Poll Results",
    category: "Poll",
    style: "progress",
    note: "Two options, two bars filling to their share — the gap widening as they draw",
    box: {
      width: 320, height: 150,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Which style next?</span>" +
            "<div style='display:flex;flex-direction:column;gap:4px'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:11px;font-weight:500;color:#faf9f5'>Page morph</span><span style='" + DISPLAY + "margin-left:auto;font-size:11px;font-weight:600;color:#6a9bcc'>62%</span></div>" +
            "<div class='tl-poll1' style='position:relative;width:100%;height:10px'></div></div>" +
            "<div style='display:flex;flex-direction:column;gap:4px'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:11px;font-weight:500;color:#faf9f5'>Scroll reveals</span><span style='" + DISPLAY + "margin-left:auto;font-size:11px;font-weight:600;color:#8f8d84'>38%</span></div>" +
            "<div class='tl-poll2' style='position:relative;width:100%;height:10px'></div></div>" +
            "<span style='" + DISPLAY + "margin-top:auto;font-size:10px;color:#8f8d84'>1,204 votes &middot; closes Friday</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-poll1",
        options: { d: "M2,5 H286", viewBox: "0 0 288 10", strokeWidth: 10, headRadius: 4, color: "#6a9bcc", guideOpacity: 0.15, to: 0.62 } },
      { style: "progress", el: ".tl-poll2",
        options: { d: "M2,5 H286", viewBox: "0 0 288 10", strokeWidth: 10, headRadius: 4, color: "#8f8d84", guideOpacity: 0.15, to: 0.38, delayMs: 450 } }
    ]
  },
  {
    name: "Add to Cart",
    category: "Checkout",
    style: "button",
    note: "The button fills while the cart badge counts the item in — purchase as one motion",
    box: {
      width: 320, height: 130,
      html: "<div style='display:flex;align-items:center;gap:13px;height:100%;padding:0 18px;box-sizing:border-box'>" +
            "<div style='flex:1;display:flex;flex-direction:column;gap:3px'>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>TraceLoop Pro</span>" +
            "<span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>$49.00 &middot; one-time</span></div>" +
            "<div class='tl-cart-badge' style='position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:#262420;border:1px solid #33312c;flex:none'>" +
            ic(CART, 16, 16, "#faf9f5") +
            "<span class='tl-cart-num' style='position:absolute;top:-6px;right:-6px;min-width:16px;height:16px;display:flex;align-items:center;justify-content:center;background:#d97757;border-radius:99px;" + DISPLAY + "font-size:9px;font-weight:600;color:#141413;padding:0 3px;box-sizing:border-box'>0</span></div>" +
            "<button class='tl-cart-btn' style='position:relative;width:104px;height:36px;background:#d97757;border:0;border-radius:8px;" + DISPLAY + "font-size:11.5px;font-weight:600;color:#141413;cursor:pointer;overflow:hidden;flex:none'>Add to cart</button>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "button", el: ".tl-cart-btn",
        options: { variant: "fill", durationMs: 1500, restMs: 2500, color: "#141413" } },
      { style: "countup", el: ".tl-cart-num",
        options: { value: 3, durationMs: 900, restMs: 3100, delayMs: 1600 } }
    ]
  },
  {
    name: "Theme Switch",
    category: "Settings",
    style: "swap",
    note: "The card turns over between dark and light — sun and moon trading places vertically",
    box: {
      width: 320, height: 150,
      html: "<div class='tl-theme' style='position:relative;height:100%'>" +
            "<div style='position:absolute;inset:0;display:flex;align-items:center;gap:13px;padding:0 20px;box-sizing:border-box'>" +
            "<span style='width:42px;height:42px;border-radius:50%;background:#262420;border:1px solid #3f3d34;display:flex;align-items:center;justify-content:center;flex:none'>" + ic(SUN, 19, 19, "#d97757") + "</span>" +
            "<div style='display:flex;flex-direction:column;gap:3px'>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Dark mode</span>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>on since 8:04 pm</span></div>" +
            "<span style='" + DISPLAY + "margin-left:auto;padding:5px 12px;border-radius:99px;background:#d97757;font-size:10.5px;font-weight:600;color:#141413'>On</span>" +
            "</div>" +
            "<div style='position:absolute;inset:0;display:flex;align-items:center;gap:13px;padding:0 20px;box-sizing:border-box'>" +
            "<span style='width:42px;height:42px;border-radius:50%;background:#33312c;display:flex;align-items:center;justify-content:center;flex:none'>" + ic(MOON, 19, 19, "#6a9bcc") + "</span>" +
            "<div style='display:flex;flex-direction:column;gap:3px'>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#141413'>Light mode</span>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>easier on daylight</span></div>" +
            "<span style='" + DISPLAY + "margin-left:auto;padding:5px 12px;border-radius:99px;background:#33312c;font-size:10.5px;font-weight:600;color:#faf9f5'>Off</span>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "swap", el: ".tl-theme",
        options: { axis: "y", exitMs: 170, durationMs: 300, restMs: 2600 } }
    ]
  },
  {
    name: "Video Scrubber",
    category: "Audio Player",
    style: "progress",
    note: "The playhead crawls along the timeline while the watched portion fills ahead of it",
    box: {
      width: 320, height: 120,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box;justify-content:center'>" +
            "<div style='display:flex;align-items:center;gap:9px'>" +
            "<span style='width:0;height:0;border-left:9px solid #faf9f5;border-top:6px solid transparent;border-bottom:6px solid transparent;flex:none'></span>" +
            "<span style='" + DISPLAY + "font-size:11.5px;font-weight:500;color:#faf9f5'>traceloop-in-90s.mp4</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10.5px;color:#8f8d84;font-variant-numeric:tabular-nums'>00:31 / 01:30</span></div>" +
            "<div class='tl-scrub' style='position:relative;width:100%;height:8px'></div>" +
            "<div style='display:flex;justify-content:space-between'>" +
            "<span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>intro</span>" +
            "<span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>the FLIP trick</span>" +
            "<span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>outro</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-scrub",
        options: { d: "M2,4 H286", viewBox: "0 0 288 8", strokeWidth: 8, headRadius: 4, color: "#d97757", guideOpacity: 0.18, to: 0.35 } }
    ]
  }
  );
})(typeof window !== "undefined" ? window : this);
