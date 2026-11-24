/*!
 * TraceLoop — SCENE CONFIGS, part ten: more of the auth family —
 * social login and password reset. Same contract as scenes.js; icons
 * are sourced Lucide paths (better-icons).
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";

  // Sourced Lucide paths (better-icons).
  var GITHUB = "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4";
  var MAIL = "m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7";
  var KEY = "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z";

  function ic(d, w, h, color, sw) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true' fill='none' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='" + (sw || 2) + "'><path d='" + d + "'/></svg>";
  }
  // A mock field: label notched into the top border, value inside —
  // the same look the live input loader renders.
  function mockField(label, value, accent) {
    return "<div style='position:relative;background:#262420;border:1px solid #33312c;border-radius:8px;height:40px;box-sizing:border-box'>" +
      "<span style='position:absolute;top:0;left:8px;transform:translateY(-50%);background:#262420;padding:0 5px;" + DISPLAY + "font-size:11px;font-weight:500;color:" + accent + "'>" + label + "</span>" +
      "<span style='position:absolute;left:13px;top:50%;transform:translateY(-50%);" + BODY + "font-size:12.5px;color:#faf9f5'>" + value + "</span></div>";
  }
  function socialBtn(icon, label, n) {
    return "<div class='tl-soc-" + n + "' style='position:relative;flex:1;height:38px;display:flex;align-items:center;justify-content:center;gap:8px;background:#262420;border:1px solid #3f3d34;border-radius:8px;" + DISPLAY + "font-size:11.5px;font-weight:500;color:#faf9f5;overflow:hidden'>" + icon + "<span>" + label + "</span></div>";
  }

  list.push(
  {
    name: "Social Login",
    category: "Auth",
    style: "button",
    note: "OAuth first: both provider buttons trace their borders while they wait, email sits below the divider",
    box: {
      width: 320, height: 210,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:13.5px;font-weight:600;color:#faf9f5'>Welcome back</span>" +
            "<div style='display:flex;gap:8px'>" +
            socialBtn(ic(GITHUB, 15, 15, "#faf9f5"), "GitHub", 1) +
            socialBtn(ic(MAIL, 15, 15, "#faf9f5"), "Email link", 2) +
            "</div>" +
            "<div style='display:flex;align-items:center;gap:8px'>" +
            "<span style='flex:1;height:1px;background:#33312c'></span>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>or with email</span>" +
            "<span style='flex:1;height:1px;background:#33312c'></span></div>" +
            mockField("Email", "hi@traceloop.dev", "#8f8d84") +
            "<div style='height:38px;display:flex;align-items:center;justify-content:center;background:#d97757;border-radius:8px;" + DISPLAY + "font-size:12.5px;font-weight:600;color:#141413'>Log in</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "button", el: ".tl-soc-1",
        options: { variant: "trace", durationMs: 1800, restMs: 2200, strokeWidth: 2, color: "#faf9f5" } },
      { style: "button", el: ".tl-soc-2",
        options: { variant: "trace", durationMs: 1800, restMs: 3400, strokeWidth: 2, color: "#faf9f5", delayMs: 900 } }
    ]
  },
  {
    name: "Forgot Password",
    category: "Auth",
    style: "input",
    note: "The reset flow: one email field types itself, the send button fills, a hint reassures below",
    box: {
      width: 320, height: 176,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:8px'>" +
            ic(KEY, 16, 16, "#6a9bcc") +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Reset your password</span></div>" +
            "<div class='tl-fp-field' style='position:relative;background:#262420;border:1px solid #33312c;border-radius:8px;padding:13px 12px 11px;height:40px;box-sizing:border-box'></div>" +
            "<button class='tl-fp-btn' style='position:relative;height:38px;background:#d97757;border:0;border-radius:8px;" + DISPLAY + "font-size:12.5px;font-weight:600;color:#141413;cursor:pointer;overflow:hidden'>Send reset link</button>" +
            "<div style='" + BODY + "font-size:10px;color:#8f8d84;text-align:center'>Link expires in 30 minutes</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-fp-field",
        options: { label: "Email", value: "hi@traceloop.dev", durationMs: 340, restMs: 1500, color: "#6a9bcc" } },
      { style: "button", el: ".tl-fp-btn",
        options: { variant: "fill", durationMs: 1600, restMs: 1800, color: "#141413", delayMs: 2000 } }
    ]
  }
  );
})(typeof window !== "undefined" ? window : this);
