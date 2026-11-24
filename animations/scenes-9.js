/*!
 * TraceLoop — SCENE CONFIGS, part nine: the text-field family — login,
 * signup, payment, verification codes and a comment composer. Same
 * contract as scenes.js; the input loader builds each field inside its
 * wrapper hook.
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";
  var FIELD = "position:relative;background:#262420;border:1px solid #33312c;border-radius:8px;padding:13px 12px 11px;box-sizing:border-box;";
  var SEND = "<svg viewBox='0 0 24 24' width='15' height='15' aria-hidden='true'><path d='M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z' fill='none' stroke='#141413' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg>";

  function field(cls, h) {
    return "<div class='" + cls + "' style='" + FIELD + "height:" + h + "px'></div>";
  }

  list.push(
  {
    name: "Login Form",
    category: "Login",
    style: "input",
    note: "Both fields fill themselves — email types, password dots follow, the button takes the submit",
    box: {
      width: 320, height: 196,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:13.5px;font-weight:600;color:#faf9f5'>Sign in</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>No account? <span style='color:#d97757'>Sign up</span></span></div>" +
            field("tl-lf-email", 40) +
            field("tl-lf-pass", 40) +
            "<button class='tl-lf-btn' style='position:relative;margin-top:auto;" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5;background:#d97757;border:0;border-radius:8px;padding:10px 0;cursor:pointer;overflow:hidden'>Sign in</button>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-lf-email", options: { label: "Email", value: "hi@traceloop.dev", durationMs: 340, restMs: 1500, color: "#d97757" } },
      { style: "input", el: ".tl-lf-pass", options: { label: "Password", value: "\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022", durationMs: 340, restMs: 1500, color: "#d97757" } },
      { style: "button", el: ".tl-lf-btn", options: { variant: "fill", durationMs: 1300, color: "#141413" } }
    ]
  },
  {
    name: "Signup Fields",
    category: "Signup",
    style: "input",
    note: "Onboarding fields in one accent: name types, then the work email",
    box: {
      width: 320, height: 150,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Create your account</div>" +
            field("tl-su-name", 40) +
            field("tl-su-email", 40) +
            "<div style='" + BODY + "font-size:10px;color:#8f8d84'>Free while you build &mdash; no card required.</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-su-name", options: { label: "Full name", value: "Mara Lindqvist", durationMs: 320, restMs: 1500, color: "#6a9bcc" } },
      { style: "input", el: ".tl-su-email", options: { label: "Work email", value: "mara@acme.co", durationMs: 320, restMs: 1500, color: "#6a9bcc" } }
    ]
  },
  {
    name: "Card Field",
    category: "Checkout",
    style: "input",
    note: "A payment field that groups its digits as it types, expiry and CVC waiting beside",
    box: {
      width: 320, height: 128,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:8px'>" +
            "<span style='width:28px;height:19px;border-radius:4px;background:linear-gradient(135deg,#6a9bcc,#3a5a7a);flex:none'></span>" +
            "<span style='" + DISPLAY + "font-size:11.5px;font-weight:500;color:#b0aea5'>Visa &middot; credit or debit</span></div>" +
            field("tl-card", 40) +
            "<div style='display:flex;gap:9px'>" +
            "<span style='" + FIELD + "flex:1;height:32px;" + DISPLAY + "font-size:11px;color:#8f8d84;line-height:19px'>MM / YY</span>" +
            "<span style='" + FIELD + "flex:1;height:32px;" + DISPLAY + "font-size:11px;color:#8f8d84;line-height:19px'>CVC</span>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-card", options: { label: "Card number", value: "4242 4242 4242 4242", durationMs: 420, restMs: 1600, color: "#6a9bcc" } }
    ]
  },
  {
    name: "OTP Code",
    category: "Verification",
    style: "input",
    note: "Four code boxes fill with the one-time pin, each underline drawing as its digit lands",
    box: {
      width: 320, height: 116,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5'>Enter the code</div>" +
            "<div style='display:flex;gap:8px;justify-content:center'>" +
            otpBox("tl-otp-1") + otpBox("tl-otp-2") + otpBox("tl-otp-3") + otpBox("tl-otp-4") +
            "</div>" +
            "<div style='" + DISPLAY + "font-size:10px;color:#8f8d84;text-align:center'>Sent to hi@traceloop.dev</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-otp-1", options: { label: "", value: "4", durationMs: 260, restMs: 1500, color: "#788c5d" } },
      { style: "input", el: ".tl-otp-2", options: { label: "", value: "8", durationMs: 260, restMs: 1500, color: "#788c5d" } },
      { style: "input", el: ".tl-otp-3", options: { label: "", value: "1", durationMs: 260, restMs: 1500, color: "#788c5d" } },
      { style: "input", el: ".tl-otp-4", options: { label: "", value: "6", durationMs: 260, restMs: 1500, color: "#788c5d" } }
    ]
  },
  {
    name: "Comment Field",
    category: "Contact",
    style: "input",
    note: "A composer row: the comment types itself, the send button arms beside it",
    box: {
      width: 320, height: 84,
      html: "<div style='display:flex;align-items:flex-end;gap:9px;height:100%;padding:14px 16px;box-sizing:border-box'>" +
            "<div class='tl-comment' style='" + FIELD + "flex:1;height:40px'></div>" +
            "<span style='width:40px;height:40px;border-radius:8px;background:#d97757;display:flex;align-items:center;justify-content:center;flex:none'>" + SEND + "</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-comment", options: { label: "Add a comment", value: "Beautiful trace!", durationMs: 340, restMs: 1500, color: "#d97757" } }
    ]
  }
  );

  function otpBox(cls) {
    return "<div class='" + cls + "' style='position:relative;width:44px;height:44px;background:#262420;border:1px solid #33312c;border-radius:8px;padding:13px 0 11px;box-sizing:border-box;text-align:center'></div>";
  }
})(typeof window !== "undefined" ? window : this);
