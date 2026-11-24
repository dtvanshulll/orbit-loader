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
  var APPLE = "M12 6.528V3a1 1 0 0 1 1-1 M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10a3 3 0 0 0 3.648.648a5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21";
  var DOWNLOAD = "M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5";
  var STAR = "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z";
  var CHECK_ICON = "<svg viewBox='0 0 24 24' width='22' height='22' aria-hidden='true'><path d='M20 6L9 17l-5-5' fill='none' stroke='#788c5d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5'/></svg>";
  var SEND = "<svg viewBox='0 0 24 24' width='15' height='15' aria-hidden='true'><path d='M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z' fill='none' stroke='#141413' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg>";

  // Sourced Lucide path renderer (better-icons).
  function ic(d, w, h, color, sw) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true' fill='none' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='" + (sw || 2) + "'><path d='" + d + "'/></svg>";
  }

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
      { style: "input", el: ".tl-lf-email", options: { label: "Email", value: "••••••••", durationMs: 340, restMs: 1500, delayMs: 2400, color: "#d97757" } },
      { style: "input", el: ".tl-lf-pass", options: { label: "Password", value: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", durationMs: 340, restMs: 1500, delayMs: 2400, color: "#d97757" } },
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
      { style: "input", el: ".tl-su-email", options: { label: "Work email", value: "mara@acme.co", durationMs: 320, restMs: 1500, delayMs: 2400, color: "#6a9bcc" } }
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
      { style: "input", el: ".tl-otp-2", options: { label: "", value: "8", durationMs: 260, restMs: 1500, delayMs: 650, color: "#788c5d" } },
      { style: "input", el: ".tl-otp-3", options: { label: "", value: "1", durationMs: 260, restMs: 1500, delayMs: 1300, color: "#788c5d" } },
      { style: "input", el: ".tl-otp-4", options: { label: "", value: "6", durationMs: 260, restMs: 1500, delayMs: 1950, color: "#788c5d" } }
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
      { style: "input", el: ".tl-comment", options: { label: "Add a comment", value: "Beautiful trace!", durationMs: 340, restMs: 1500, delayMs: 2400, color: "#d97757" } }
    ]
  },
  {
    name: "Auth Card Flip",
    category: "Auth",
    style: "swap",
    note: "One card, two states: the log-in panel accelerates out while sign-up decelerates in, then back",
    box: {
      width: 320, height: 250,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<div class='tl-auth' style='position:relative;flex:1'>" +
            "<div style='display:flex;flex-direction:column;gap:9px;height:100%'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:13.5px;font-weight:600;color:#faf9f5'>Welcome back</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>No account? <span class='tl-go-signup' style='color:#d97757;font-weight:600;cursor:pointer'>Sign up</span></span></div>" +
            mockField("Email", "hi@traceloop.dev", "#8f8d84") +
            mockField("Password", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", "#8f8d84") +
            authBtn("Log in", "#d97757", "#141413") +
            "<div style='" + BODY + "font-size:10px;color:#8f8d84;text-align:center'>Trusted by 40,000 builders</div>" +
            "</div>" +
            "<div style='display:flex;flex-direction:column;gap:9px;height:100%'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:13.5px;font-weight:600;color:#faf9f5'>Create your account</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>Have one? <span class='tl-go-login' style='color:#d97757;font-weight:600;cursor:pointer'>Log in</span></span></div>" +
            mockField("Full name", "Mara Lindqvist", "#8f8d84") +
            mockField("Work email", "mara@acme.co", "#8f8d84") +
            authBtn("Create account", "#d97757", "#141413") +
            "<div style='" + BODY + "font-size:10px;color:#8f8d84;text-align:center'>Free while you build</div>" +
            "</div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "swap", el: ".tl-auth",
        options: { axis: "x", exitMs: 170, durationMs: 300, restMs: 2800,
          triggers: [{ sel: ".tl-go-signup", to: 1 }, { sel: ".tl-go-login", to: 0 }] } }
    ]
  },
  {
    name: "App Download",
    category: "Download",
    style: "button",
    note: "A store listing: the primary store button fills while it \u201Cdownloads\u201D, the rating sits beside",
    box: {
      width: 320, height: 150,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:11px'>" +
            "<span style='width:44px;height:44px;border-radius:11px;background:linear-gradient(135deg,#d97757,#a8543a);display:flex;align-items:center;justify-content:center;flex:none'>" +
            ic(DOWNLOAD, 20, 20, "#faf9f5") + "</span>" +
            "<div style='display:flex;flex-direction:column;gap:2px'>" +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>TraceLoop</span>" +
            "<span style='display:flex;align-items:center;gap:4px'>" +
            ic(STAR, 11, 11, "#d97757") +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#b0aea5'>4.9 \u00B7 2.1k ratings \u00B7 18 MB</span></span></div></div>" +
            "<div style='display:flex;gap:8px;margin-top:auto'>" +
            "<div class='tl-dl-main' style='position:relative;flex:1.4;height:38px;display:flex;align-items:center;justify-content:center;gap:7px;background:#d97757;border-radius:8px;" + DISPLAY + "font-size:12px;font-weight:600;color:#141413;overflow:hidden'>" +
            ic(APPLE, 14, 14, "#141413") + "<span>App Store</span></div>" +
            "<div style='flex:1;height:38px;display:flex;align-items:center;justify-content:center;gap:7px;background:#262420;border:1px solid #3f3d34;border-radius:8px;" + DISPLAY + "font-size:12px;font-weight:500;color:#faf9f5'>" +
            ic("M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z", 12, 12, "#faf9f5") + "<span>Google Play</span></div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "button", el: ".tl-dl-main",
        options: { variant: "fill", durationMs: 2200, restMs: 1400, color: "#141413" } }
    ]
  },
  {
    name: "Wizard Steps",
    category: "Auth",
    style: "swap",
    note: "Three panels cycling: account, workspace, done — the step dots track which one is live",
    box: {
      width: 320, height: 226,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:6px'>" +
            wizardDot(1) + wizardDot(2) + wizardDot(3) +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>Workspace setup</span></div>" +
            "<div class='tl-wiz' style='position:relative;flex:1'>" +
            "<div style='display:flex;flex-direction:column;gap:9px;height:100%'>" +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Your account</span>" +
            mockField("Email", "hi@traceloop.dev", "#8f8d84") +
            authBtn("Continue", "#d97757", "#141413") +
            "</div>" +
            "<div style='display:flex;flex-direction:column;gap:9px;height:100%'>" +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Your workspace</span>" +
            mockField("Workspace name", "Acme Studio", "#8f8d84") +
            authBtn("Continue", "#d97757", "#141413") +
            "</div>" +
            "<div style='display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;height:100%'>" +
            CHECK_ICON +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>You\u2019re all set</span>" +
            authBtn("Open dashboard", "#d97757", "#141413") +
            "</div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "swap", el: ".tl-wiz",
        options: { axis: "x", exitMs: 170, durationMs: 300, restMs: 2600 } }
    ]
  },
  {
    name: "Settings Flip",
    category: "Auth",
    style: "swap",
    note: "Settings and profile trading places in one card — vertical this time, so the trade reads as a page turn",
    box: {
      width: 320, height: 226,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:8px'>" +
            "<span class='tl-set-tab is-on' style='" + DISPLAY + "font-size:11px;font-weight:600;color:#faf9f5'>Settings</span>" +
            "<span class='tl-set-tab' style='" + DISPLAY + "font-size:11px;font-weight:500;color:#8f8d84'>Profile</span></div>" +
            "<div class='tl-set' style='position:relative;flex:1'>" +
            "<div style='display:flex;flex-direction:column;gap:7px;height:100%'>" +
            setRow("Email notifications", "On") +
            setRow("Weekly digest", "Off") +
            setRow("Two-factor auth", "On") +
            setRow("Public profile", "Off") +
            "</div>" +
            "<div style='display:flex;flex-direction:column;gap:9px;height:100%;align-items:center'>" +
            "<span style='width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#6a9bcc,#3a5a7a);display:flex;align-items:center;justify-content:center;" + DISPLAY + "font-size:15px;font-weight:600;color:#faf9f5'>ML</span>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Mara Lindqvist</span>" +
            "<span style='" + BODY + "font-size:11px;color:#8f8d84'>mara@acme.co</span>" +
            "<div style='width:100%;margin-top:auto'>" + authBtn("Edit profile", "#262420", "#faf9f5") + "</div>" +
            "</div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "swap", el: ".tl-set",
        options: { axis: "y", exitMs: 170, durationMs: 300, restMs: 2800 } }
    ]
  },
  );

  function otpBox(cls) {
    return "<div class='" + cls + "' style='position:relative;width:44px;height:44px;background:#262420;border:1px solid #33312c;border-radius:8px;padding:13px 0 11px;box-sizing:border-box;text-align:center'></div>";
  }


  // Mock field for the static auth panels: same notch look the live
  // input loader renders, no loop of its own (the swap hides panels;
  // loaders inside hidden panels would run out of sight).
  function mockField(label, value, accent) {
    return "<div style='position:relative;background:#262420;border:1px solid #33312c;border-radius:8px;height:40px;box-sizing:border-box'>" +
      "<span style='position:absolute;top:0;left:8px;transform:translateY(-50%);background:#262420;padding:0 5px;" + DISPLAY + "font-size:11px;font-weight:500;color:" + accent + "'>" + label + "</span>" +
      "<span style='position:absolute;left:13px;top:50%;transform:translateY(-50%);" + BODY + "font-size:12.5px;color:#faf9f5'>" + value + "</span></div>";
  }
  function authBtn(label, bg, color) {
    return "<div style='height:38px;display:flex;align-items:center;justify-content:center;background:" + bg + ";border-radius:8px;" + DISPLAY + "font-size:12.5px;font-weight:600;color:" + color + "'>" + label + "</div>";
  }

  // Step dot for the wizard header: filled = visited, ringed = ahead.
  function wizardDot(n) {
    var on = n === 1;
    return "<span style='width:8px;height:8px;border-radius:50%;" +
      (on ? "background:#d97757;" : "border:1.5px solid #3f3d34;") + "'></span>";
  }
  function setRow(label, state) {
    var on = state === "On";
    return "<div style='display:flex;align-items:center;background:#262420;border:1px solid #33312c;border-radius:8px;padding:9px 12px'>" +
      "<span style='" + DISPLAY + "font-size:11.5px;font-weight:500;color:#faf9f5'>" + label + "</span>" +
      "<span style='margin-left:auto;width:26px;height:15px;border-radius:999px;background:" + (on ? "#788c5d" : "#3f3d34") + ";position:relative;flex:none'>" +
      "<span style='position:absolute;top:2px;" + (on ? "right:2px" : "left:2px") + ";width:11px;height:11px;border-radius:50%;background:#faf9f5'></span></span></div>";

  }
})(typeof window !== "undefined" ? window : this);
