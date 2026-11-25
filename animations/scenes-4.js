/*!
 * TraceLoop — SCENE CONFIGS, part four: Blog, Gallery, Bento,
 * Shopping Cart, Checkout, Product Card, Signup and About. Same
 * contract as scenes.js; photo-shaped content uses gradient
 * placeholders, icons are sourced Lucide paths (better-icons).
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";
  var ARROW = "M7 7h10v10M7 17L17 7";
  var CHECK = "M20 6L9 17l-5-5";
  var MINUS = "M5 12h14";
  function lucide(d, w, h, color, fill) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true'><path d='" + d + "' fill='" + (fill || "none") + "' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg>";
  }
  function mark(on, color) {
    return "<span style='width:60px;display:flex;justify-content:center'>" +
      (on ? lucide(CHECK, 13, 13, color || "#788c5d") : "<span style='color:#4a483f;font-size:11px'>&mdash;</span>") + "</span>";
  }

  list.push(
  {
    name: "Gallery Focus",
    category: "Gallery",
    style: "orbit",
    note: "A photo grid where the focused tile draws its own selection ring",
    box: {
      width: 320, height: 190,
      html: "<div style='padding:12px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5'>Studio shots</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>24 items</span></div>" +
            "<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;flex:1'>" +
            tile("#3a3a35,#57544a") + focusTile() + tile("#4a3f35,#6a5a4a") +
            tile("#35443a,#4a5f4a") + tile("#3a3543,#4f485f") + tile("#43353a,#5f484f") +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-focus",
        options: { d: { shape: "roundRect", args: [88, 56, 8] }, durationMs: 1800, restMs: 1600, strokeWidth: 2, color: "#d97757", guideOpacity: 0.3 } }
    ]
  },

  {
    name: "Bento Live",
    category: "Bento",
    style: "pulse",
    note: "A bento grid whose live-status dot breathes inside the feature tile",
    box: {
      width: 320, height: 180,
      html: "<div style='display:grid;grid-template-columns:1.6fr 1fr;grid-template-rows:1fr 1fr;gap:8px;height:100%;padding:12px;box-sizing:border-box'>" +
            "<div style='grid-row:span 2;background:#262420;border:1px solid #33312c;border-radius:8px;padding:14px;display:flex;flex-direction:column;gap:8px'>" +
            "<div style='display:flex;align-items:center;gap:7px'><span class='tl-live' style='position:relative;width:18px;height:18px;display:flex;align-items:center;justify-content:center;flex:none'><span style='width:7px;height:7px;border-radius:50%;background:#788c5d'></span></span><span style='" + DISPLAY + "font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#788c5d'>Live</span></div>" +
            "<div style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Everything ships as one file</div>" +
            "<div style='" + BODY + "font-size:10.5px;line-height:1.5;color:#8f8d84'>Flat, script-tag friendly, no import graph to learn.</div></div>" +
            "<div style='background:#262420;border:1px solid #33312c;border-radius:8px;padding:12px'><div style='" + DISPLAY + "font-size:15px;font-weight:600;color:#d97757'>19</div><div style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>styles</div></div>" +
            "<div style='background:#262420;border:1px solid #33312c;border-radius:8px;padding:12px'><div style='" + DISPLAY + "font-size:15px;font-weight:600;color:#6a9bcc'>0</div><div style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>dependencies</div></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-live",
        options: { rings: 1, durationMs: 2000, strokeWidth: 4, maxOpacity: 0.4, color: "#788c5d" } }
    ]
  },

  {
    name: "Cart Summary",
    category: "Shopping Cart",
    style: "progress",
    note: "A cart whose free-shipping meter holds at 70% — the nudge, drawn",
    box: {
      width: 320, height: 200,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Your cart</span><span style='" + DISPLAY + "margin-left:auto;font-size:10.5px;color:#8f8d84'>2 items</span></div>" +
            cartRow("Trace Tee", "1 &times; $32", "#d97757") +
            cartRow("Path Mug", "2 &times; $18", "#6a9bcc") +
            "<div class='tl-ship' style='position:relative;height:8px;width:100%'></div>" +
            "<div style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>Add $12.40 for free shipping</div>" +
            "<div style='display:flex;align-items:baseline;margin-top:auto'><span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>Subtotal</span><span style='" + DISPLAY + "margin-left:auto;font-size:15px;font-weight:600;color:#faf9f5'>$68.00</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-ship",
        options: { d: { shape: "underline", args: [284, 3] }, strokeWidth: 3, headRadius: 3, color: "#788c5d", guideOpacity: 0.3, to: 0.7 } }
    ]
  },

  {
    name: "Checkout Pay",
    category: "Checkout",
    style: "input",
    note: "A checkout where the card number types itself, then the payment fills",
    box: {
      width: 320, height: 216,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:14px;font-weight:600;color:#faf9f5'>Checkout</div>" +
            "<div class='tl-card' style='position:relative;height:44px;background:#262420;border:1px solid #33312c;border-radius:8px'></div>" +
            "<div style='display:flex;gap:8px'>" +
            "<div style='flex:1;height:40px;background:#262420;border:1px solid #33312c;border-radius:8px;display:flex;align-items:center;padding:0 12px;box-sizing:border-box'><span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>12 / 28</span></div>" +
            "<div style='width:74px;height:40px;background:#262420;border:1px solid #33312c;border-radius:8px;display:flex;align-items:center;padding:0 12px;box-sizing:border-box'><span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>CVC</span></div>" +
            "</div>" +
            "<div class='tl-pay' style='position:relative;margin-top:auto;height:42px;display:flex;align-items:center;justify-content:center;background:#788c5d;border-radius:8px;" + DISPLAY + "font-size:13px;font-weight:600;color:#141413'>Pay $68.00</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-card", options: { label: "Card number", value: "4242 4242 4242 4242", durationMs: 300, restMs: 1500, color: "#788c5d" } },
      { style: "button", el: ".tl-pay", options: { variant: "fill", durationMs: 1100, color: "#141413" } }
    ]
  },

  {
    name: "Product Sale",
    category: "Product Card",
    style: "pulse",
    note: "A product tile whose Sale badge breathes while the price sits struck through",
    box: {
      width: 300, height: 200,
      html: "<div style='padding:12px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<div style='position:relative;height:86px;border-radius:8px;background:linear-gradient(135deg,#4a3f35 0%,#6a5a4a 60%,#d97757 140%)'>" +
            "<span class='tl-sale' style='position:absolute;top:8px;right:8px;width:52px;height:20px;display:flex;align-items:center;justify-content:center;background:#141413;border:1px solid #d97757;border-radius:999px;font-size:9px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#d97757;" + DISPLAY + "'>Sale</span></div>" +
            "<div style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Trace Tee</div>" +
            "<div style='display:flex;align-items:baseline;gap:7px'><span style='" + DISPLAY + "font-size:15px;font-weight:600;color:#faf9f5'>$32</span><span style='" + DISPLAY + "font-size:11px;color:#6a655c;text-decoration:line-through'>$40</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#788c5d'>In stock</span></div>" +
            "<div style='" + DISPLAY + "margin-top:auto;height:34px;display:flex;align-items:center;justify-content:center;background:#262420;border:1px solid #3f3d34;border-radius:8px;font-size:12px;font-weight:500;color:#faf9f5'>Add to cart</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-sale",
        options: { rings: 1, durationMs: 2200, strokeWidth: 4, maxOpacity: 0.4, color: "#d97757" } }
    ]
  },

  {
    name: "Signup Steps",
    category: "Signup",
    style: "input",
    note: "A signup where the step line quantizes while both fields type themselves",
    box: {
      width: 320, height: 232,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div class='tl-steps' style='position:relative;height:22px;width:260px'></div>" +
            "<div style='" + DISPLAY + "font-size:14px;font-weight:600;color:#faf9f5'>Create your account</div>" +
            "<div class='tl-su-mail' style='position:relative;height:42px;background:#262420;border:1px solid #33312c;border-radius:8px'></div>" +
            "<div class='tl-su-pass' style='position:relative;height:42px;background:#262420;border:1px solid #33312c;border-radius:8px'></div>" +
            "<div style='" + DISPLAY + "margin-top:auto;height:38px;display:flex;align-items:center;justify-content:center;background:#d97757;border-radius:8px;font-size:13px;font-weight:600;color:#141413'>Continue</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-steps", options: { d: { shape: "underline", args: [260] }, strokeWidth: 3, headRadius: 3.5, steps: 3, color: "#d97757", guideOpacity: 0.3, to: 0.34 } },
      { style: "input", el: ".tl-su-mail", options: { label: "Email", value: "dev@studio.co", durationMs: 320, restMs: 1500, color: "#d97757" } },
      { style: "input", el: ".tl-su-pass", options: { label: "Password", value: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", durationMs: 320, restMs: 1500, color: "#d97757" } }
    ]
  },

  {
    name: "About Story",
    category: "About",
    style: "chase",
    note: "An about block whose heading rule carries a formation of dashes",
    box: {
      width: 320, height: 192,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:15px;font-weight:600;color:#faf9f5'>Our story</div>" +
            "<div class='tl-rule' style='position:relative;height:6px;width:120px'></div>" +
            "<div style='" + BODY + "font-size:11.5px;line-height:1.6;color:#b0aea5'>We kept rebuilding the same loading spinners per project. So we built the thing that builds them — once, around real paths.</div>" +
            "<div style='" + BODY + "font-size:11.5px;line-height:1.6;color:#b0aea5'>One person, one MIT file, no roadmap committee.</div>" +
            "<div style='display:flex;gap:18px;margin-top:auto'>" +
            "<span><span style='" + DISPLAY + "font-size:14px;font-weight:600;color:#faf9f5'>19</span><span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'> styles</span></span>" +
            "<span><span style='" + DISPLAY + "font-size:14px;font-weight:600;color:#faf9f5'>0</span><span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'> deps</span></span>" +
            "<span><span style='" + DISPLAY + "font-size:14px;font-weight:600;color:#faf9f5'>MIT</span><span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'> forever</span></span>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "chase", el: ".tl-rule",
        options: { d: { shape: "underline", args: [120, 4] }, segments: 3, segmentFraction: 0.12, durationMs: 2200, strokeWidth: 2, color: "#d97757", guideOpacity: 0.25 } }
    ]
  },
  {
    name: "Vertical Stepper",
    category: "Stepper",
    style: "orbit",
    note: "Steps stacked vertically: the current circle traces itself while the line below it draws ahead",
    box: {
      width: 300, height: 224,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:13.5px;font-weight:600;color:#faf9f5'>Ship release</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>Step 2 of 4</span></div>" +
            "<div style='display:flex;flex-direction:column;margin-top:12px;flex:1'>" +
            vStep("Build", "done") +
            "<div style='display:flex;gap:10px;flex:1'><span style='width:20px;display:flex;justify-content:center'><span class='tl-vline' style='position:relative;width:2px;height:100%'></span></span><span style='flex:1'></span></div>" +
            vStep("Test", "current") +
            "<div style='display:flex;gap:10px;flex:1'><span style='width:20px;display:flex;justify-content:center'><span style='width:2px;height:100%;background:#3f3d34'></span></span><span style='flex:1'></span></div>" +
            vStep("Deploy", "todo") +
            "<div style='display:flex;gap:10px;flex:1'><span style='width:20px;display:flex;justify-content:center'><span style='width:2px;height:100%;background:#3f3d34'></span></span><span style='flex:1'></span></div>" +
            vStep("Announce", "todo") +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-vs-circle",
        options: { d: { shape: "circle", args: [20] }, durationMs: 1600, restMs: 1800, strokeWidth: 2, color: "#d97757", guideOpacity: 0.3 } },
      { style: "orbit", el: ".tl-vline",
        options: { d: "M1,0 V100", durationMs: 1400, restMs: 2000, strokeWidth: 2, color: "#788c5d", guideOpacity: 0.25 } }
    ]
  },
  {
    name: "Dots Stepper",
    category: "Stepper",
    style: "pulse",
    note: "A minimal dots rail: done dots fill in, the current one breathes",
    box: {
      width: 320, height: 92,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Profile setup</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>2 of 5</span></div>" +
            "<div style='display:flex;justify-content:space-between;padding:0 6px'>" +
            dot("Account", "done") + dot("Profile", "done") +
            "<div style='display:flex;flex-direction:column;align-items:center;gap:6px'><span class='tl-dot-now' style='position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center'><span style='width:10px;height:10px;border-radius:50%;background:#d97757'></span></span><span style='" + DISPLAY + "font-size:9px;font-weight:500;color:#d97757'>Photo</span></div>" +
            dot("Prefs", "todo") + dot("Done", "todo") +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-dot-now",
        options: { rings: 1, dot: false, durationMs: 2000, strokeWidth: 3, maxOpacity: 0.4, color: "#d97757" } }
    ]
  },
  {
    name: "Setup Progress",
    category: "Stepper",
    style: "progress",
    note: "One bar fills to how far onboarding has come, its frontier dot landing on the reached step",
    box: {
      width: 320, height: 104,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:12px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Complete your workspace</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>3 of 4 done</span></div>" +
            "<div class='tl-sp-bar' style='position:relative;width:100%;height:8px'></div>" +
            "<div style='display:flex;justify-content:space-between'>" +
            spLabel("Invite", true) + spLabel("Import", true) + spLabel("Connect", true) + spLabel("Launch", false) +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-sp-bar",
        options: { d: { shape: "underline", args: [284, 3] }, strokeWidth: 4, headRadius: 3, color: "#d97757", guideOpacity: 0.3, to: 0.75 } }
    ]
  },
  );

  function vStep(label, state) {
    var body;
    if (state === "done") body = "<span style='width:20px;height:20px;border-radius:50%;background:#788c5d;display:flex;align-items:center;justify-content:center;flex:none'>" + lucide(CHECK, 11, 11, "#faf9f5") + "</span>";
    else if (state === "current") body = "<span class='tl-vs-circle' style='position:relative;width:20px;height:20px;border-radius:50%;background:#d97757;display:flex;align-items:center;justify-content:center;flex:none;" + DISPLAY + "font-size:10px;font-weight:600;color:#141413'>2</span>";
    else body = "<span style='width:20px;height:20px;border-radius:50%;background:#262420;border:1px solid #3f3d34;display:flex;align-items:center;justify-content:center;flex:none;" + DISPLAY + "font-size:10px;font-weight:600;color:#8f8d84'></span>";
    var col = state === "done" ? "#788c5d" : state === "current" ? "#d97757" : "#8f8d84";
    var w = state === "current" ? "600" : "500";
    return "<div style='display:flex;align-items:center;gap:10px'><span style='width:20px;display:flex;justify-content:center;flex:none'>" + body + "</span><span style='" + DISPLAY + "font-size:11.5px;font-weight:" + w + ";color:" + col + "'>" + label + "</span></div>";
  }
  function dot(label, state) {
    var d = state === "done" ? "<span style='width:10px;height:10px;border-radius:50%;background:#788c5d'></span>"
      : "<span style='width:10px;height:10px;border-radius:50%;background:#262420;border:1px solid #3f3d34'></span>";
    var col = state === "done" ? "#788c5d" : "#8f8d84";
    return "<div style='display:flex;flex-direction:column;align-items:center;gap:6px'>" + d + "<span style='" + DISPLAY + "font-size:9px;color:" + col + "'>" + label + "</span></div>";
  }
  function spLabel(label, done) {
    return "<span style='" + DISPLAY + "font-size:9.5px;font-weight:" + (done ? "600;color:#788c5d" : "400;color:#8f8d84") + "'>" + label + "</span>";
  }

  function tile(grad) {
    return "<div style='border-radius:8px;background:linear-gradient(135deg," + grad + ")'></div>";
  }
  function focusTile() {
    return "<div class='tl-focus' style='position:relative;border-radius:8px;background:linear-gradient(135deg,#43413a,#5c5950)'></div>";
  }
  function cartRow(name, price, color) {
    return "<div style='display:flex;align-items:center;gap:9px'>" +
      "<span style='width:34px;height:34px;border-radius:6px;background:linear-gradient(135deg," + color + ",#3f3d34);flex:none'></span>" +
      "<span style='" + DISPLAY + "flex:1;font-size:12px;font-weight:500;color:#faf9f5'>" + name + "</span>" +
      "<span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>" + price + "</span></div>";
  }
})(typeof window !== "undefined" ? window : this);
