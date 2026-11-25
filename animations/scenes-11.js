/*!
 * TraceLoop — SCENE CONFIGS, part eleven: more everyday components —
 * file upload, chat, onboarding checklist, sparkline stat and a
 * recording indicator. Same contract as scenes.js; icons are sourced
 * Lucide paths (better-icons).
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";

  // Sourced Lucide paths (better-icons).
  var UPLOAD = "M12 3v12m5-7l-5-5l-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4";
  var CHECK = "M20 6L9 17l-5-5";
  var SEND = "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z";

  function ic(d, w, h, color, sw) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true' fill='none' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='" + (sw || 2) + "'><path d='" + d + "'/></svg>";
  }
  function chatBubble(text, mine) {
    var align = mine ? "flex-end" : "flex-start";
    var bg = mine ? "#d97757" : "#262420";
    var color = mine ? "#141413" : "#faf9f5";
    return "<div style='display:flex;justify-content:" + align + "'><span style='max-width:78%;background:" + bg + ";border-radius:10px;padding:7px 10px;" + BODY + "font-size:11px;line-height:1.45;color:" + color + "'>" + text + "</span></div>";
  }

  list.push(
  {
    name: "File Upload",
    category: "Upload",
    style: "progress",
    note: "A dropzone: the upload arrow draws while the file's bar fills to 70%",
    box: {
      width: 320, height: 150,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:10px'>" +
            "<span class='tl-up-icon' style='position:relative;width:38px;height:38px;border-radius:9px;background:#262420;border:1px solid #33312c;display:flex;align-items:center;justify-content:center;color:#d97757;flex:none'></span>" +
            "<div style='display:flex;flex-direction:column;gap:2px;flex:1'>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5'>demo-loop.mp4</span>" +
            "<span style='" + DISPLAY + "font-size:10px;color:#8f8d84'>18.1 MB &middot; uploading</span></div>" +
            "<span style='" + DISPLAY + "font-size:11px;font-weight:600;color:#d97757'>70%</span></div>" +
            "<div class='tl-up-bar' style='position:relative;width:100%;height:8px'></div>" +
            "<div style='border:1.5px dashed #3f3d34;border-radius:8px;padding:8px;display:flex;align-items:center;justify-content:center;gap:7px;margin-top:auto'>" +
            ic(UPLOAD, 13, 13, "#8f8d84") +
            "<span style='" + DISPLAY + "font-size:10px;color:#8f8d84'>Drop more files here</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-up-icon",
        options: { d: "M19,10 v11 M15,14 l4,4 l4,-4 M5,21 v-11 M1,17 l4,-4 l4,4", viewBox: "0 0 24 26", durationMs: 1600, restMs: 2000, strokeWidth: 1.8, color: "#d97757", guideOpacity: 0.25 } },
      { style: "progress", el: ".tl-up-bar",
        options: { d: "M2,4 H316", strokeWidth: 8, headRadius: 3, color: "#d97757", guideOpacity: 0.18, to: 0.7 } }
    ]
  },
  {
    name: "Chat Conversation",
    category: "Chat",
    style: "typing",
    note: "A thread with the typing indicator alive at the bottom — three dots taking turns",
    box: {
      width: 320, height: 170,
      html: "<div style='padding:12px 14px;display:flex;flex-direction:column;gap:7px;height:100%;box-sizing:border-box'>" +
            chatBubble("Hey — did the new trace land?", false) +
            chatBubble("Just pushed it. The drawer edge draws now.", true) +
            chatBubble("Pulling it \u2014 one sec", false) +
            "<div class='tl-chat-typing' style='position:relative;margin-top:auto;width:100px;height:34px;background:#262420;border:1px solid #33312c;border-radius:10px;box-sizing:border-box'></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "typing", el: ".tl-chat-typing",
        options: { dots: 3, durationMs: 1000, staggerMs: 180, dotRadius: 4, color: "#d97757" } }
    ]
  },
  {
    name: "Onboarding Checklist",
    category: "Checklist",
    style: "orbit",
    note: "Setup steps: the first two are done, the third row's check draws itself right now",
    box: {
      width: 320, height: 160,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Get set up</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>2 of 4</span></div>" +
            checkRow("Create your account", true, "") +
            checkRow("Install the CLI", true, "") +
            checkRow("<span class='tl-check-live' style='position:relative;display:inline-flex;width:15px;height:15px;flex:none'></span>", false, "live") +
            checkRow("Invite your team", false, "") +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-check-live",
        options: { d: "M4,12 L9,17 L20,7", viewBox: "0 0 24 24", durationMs: 1400, restMs: 1800, strokeWidth: 2.5, color: "#788c5d", guideOpacity: 0.3 } }
    ]
  },
  {
    name: "Sparkline Stat",
    category: "Chart Card",
    style: "progress",
    note: "A stat card whose trend line plots itself up to the current number",
    box: {
      width: 320, height: 130,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:10.5px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#8f8d84'>Traces drawn</span>" +
            "<div style='display:flex;align-items:baseline;gap:8px'>" +
            "<span style='" + DISPLAY + "font-size:24px;font-weight:600;color:#faf9f5'>12,480</span>" +
            "<span style='" + DISPLAY + "font-size:11px;font-weight:600;color:#788c5d'>+18%</span></div>" +
            "<div class='tl-spark' style='position:relative;flex:1'></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-spark",
        options: { d: "M2,38 L34,30 L66,34 L98,20 L130,26 L162,12 L194,18 L226,6", viewBox: "0 0 228 42", durationMs: 2200, restMs: 1800, strokeWidth: 2, color: "#788c5d", guideOpacity: 0.2, headRadius: 2.5 } }
    ]
  },
  {
    name: "Rec Indicator",
    category: "Audio Player",
    style: "pulse",
    note: "A recording badge: the red dot breathes while the timer runs beside it",
    box: {
      width: 320, height: 76,
      html: "<div style='display:flex;align-items:center;gap:12px;height:100%;padding:0 18px;box-sizing:border-box'>" +
            "<div class='tl-rec' style='position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;flex:none'><span style='width:9px;height:9px;border-radius:50%;background:#d97757'></span></div>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:600;letter-spacing:0.08em;color:#d97757'>REC</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:13px;font-weight:500;color:#faf9f5;font-variant-numeric:tabular-nums'>00:34</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-rec",
        options: { rings: 1, dot: false, durationMs: 1600, strokeWidth: 3, maxOpacity: 0.45, color: "#d97757" } }
    ]
  }
  ,
  {
    name: "Handwritten Annotation",
    category: "Annotation",
    style: "orbit",
    note: "A note that annotates itself — a rough circle loops a phrase, a hand underline stamps the deadline",
    box: {
      width: 320, height: 150,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Sprint note</span>" +
            "<p style='" + BODY + "font-size:12px;line-height:1.6;color:#b0aea5;margin:0'>Ship the trace loop " +
            "<span class='tl-ann-circle' style='position:relative;padding:3px 6px;color:#faf9f5;font-weight:600'>before Friday</span>" +
            " — the launch " +
            "<span class='tl-ann-line' style='position:relative;padding:1px 2px;color:#faf9f5;font-weight:600'>demo needs it</span>" +
            ".</p>" +
            "<span style='" + DISPLAY + "margin-top:auto;font-size:10px;color:#8f8d84'>reviewed &middot; 2 comments</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-ann-circle",
        options: { d: "M50,2 C74,1 96,5 97,12 C98,19 76,22 50,23 C24,23 3,20 2,12 C1,5 24,2 50,2", viewBox: "0 0 100 24", durationMs: 2400, restMs: 2600, strokeWidth: 2, color: "#d97757", guideOpacity: 0.25 } },
      { style: "orbit", el: ".tl-ann-line",
        options: { d: "M2,6 C20,2 40,8 60,4 C75,2 88,7 98,5", viewBox: "0 0 100 10", durationMs: 1300, restMs: 3700, strokeWidth: 2, color: "#6a9bcc", guideOpacity: 0.25, delayMs: 1400 } }
    ]
  },
  {
    name: "Burst Confirm",
    category: "Confirmation",
    style: "orbit",
    note: "The check draws while two rings burst from the tile behind it — done, loudly",
    box: {
      width: 320, height: 140,
      html: "<div style='display:flex;align-items:center;gap:14px;height:100%;padding:0 20px;box-sizing:border-box'>" +
            "<div class='tl-burst-tile' style='position:relative;width:56px;height:56px;border-radius:50%;background:#262420;border:1px solid #33312c;display:flex;align-items:center;justify-content:center;flex:none;color:#788c5d'></div>" +
            "<div style='display:flex;flex-direction:column;gap:3px'>" +
            "<span style='" + DISPLAY + "font-size:13.5px;font-weight:600;color:#faf9f5'>Payment confirmed</span>" +
            "<span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>$49.00 &middot; just now</span></div>" +
            "<span style='" + DISPLAY + "margin-left:auto;" + BODY + "font-style:italic;font-size:10.5px;color:#788c5d'>receipt sent</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-burst-tile",
        options: { d: "M20,6 L9,17 L5,13", viewBox: "0 0 24 24", durationMs: 1200, restMs: 2400, strokeWidth: 2.5, color: "#788c5d", guideOpacity: 0.3 } },
      { style: "pulse", el: ".tl-burst-tile",
        options: { rings: 2, dot: false, durationMs: 2400, strokeWidth: 2, maxOpacity: 0.4, color: "#788c5d" } }
    ]
  },
  {
    name: "Price Strike",
    category: "Pricing",
    style: "orbit",
    note: "The old price is struck out in reverse — the stroke starts at the far end, like a hand crossing it off",
    box: {
      width: 320, height: 110,
      html: "<div style='display:flex;align-items:center;gap:12px;height:100%;padding:0 20px;box-sizing:border-box'>" +
            "<span class='tl-strike' style='position:relative;padding:2px 6px;" + DISPLAY + "font-size:17px;font-weight:600;color:#8f8d84;text-decoration:none'>$99</span>" +
            "<span style='" + DISPLAY + "font-size:26px;font-weight:600;color:#d97757'>$49</span>" +
            "<span style='" + DISPLAY + "padding:4px 9px;background:#262420;border:1px solid #3f3d34;border-radius:99px;font-size:10px;font-weight:500;color:#b0aea5'>launch week</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-strike",
        options: { d: "M3,8 C22,4 48,10 97,6", viewBox: "0 0 100 12", durationMs: 900, restMs: 3200, strokeWidth: 2.4, color: "#d97757", direction: "reverse" } }
    ]
  }

  ,
  {
    name: "Live Counter",
    category: "Chart Card",
    style: "countup",
    note: "The number counts itself up with an expo tail while the trend line plots beneath it",
    box: {
      width: 320, height: 140,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:6px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:10.5px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#8f8d84'>Requests today</span>" +
            "<div class='tl-live-num' style='" + DISPLAY + "font-size:26px;font-weight:600;color:#faf9f5;font-variant-numeric:tabular-nums'>0</div>" +
            "<div class='tl-live-spark' style='position:relative;flex:1'></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "countup", el: ".tl-live-num",
        options: { d: "M2,38 L34,30 L66,34 L98,20 L130,26 L162,12 L194,18 L226,6", viewBox: "0 0 228 42", durationMs: 2200, restMs: 2800, strokeWidth: 2, color: "#6a9bcc", guideOpacity: 0.2, headRadius: 2.5 } }
    ]
  },
  {
    name: "Invalid Field",
    category: "Form",
    style: "shake",
    note: "The field judders and settles while the reason underlines itself — a no that decays into stillness",
    box: {
      width: 320, height: 160,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Create account</span>" +
            "<div class='tl-bad-field' style='position:relative;background:#262420;border:1px solid #d97757;border-radius:8px;padding:13px 12px 11px;height:40px;box-sizing:border-box'>" +
            "<span style='position:absolute;top:0;left:8px;transform:translateY(-50%);background:#262420;padding:0 5px;" + DISPLAY + "font-size:11px;font-weight:500;color:#d97757'>Work email</span>" +
            "<span style='position:absolute;left:13px;top:50%;transform:translateY(-50%);" + BODY + "font-size:12.5px;color:#faf9f5'>hi@traceloop</span></div>" +
            "<span class='tl-why' style='position:relative;" + DISPLAY + "font-size:11px;color:#d97757;align-self:flex-start'>Missing a domain — add .com</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "shake", el: ".tl-bad-field",
        options: { variant: "default", durationMs: 650, restMs: 2600 } },
      { style: "orbit", el: ".tl-why",
        options: { d: "M2,6 C20,2 40,8 60,4 C75,2 88,7 98,5", viewBox: "0 0 100 10", durationMs: 1100, restMs: 3100, strokeWidth: 2, color: "#d97757", guideOpacity: 0.25, delayMs: 700 } }
    ]
  }

  ,
  {
    name: "Milestone Counter",
    category: "Chart Card",
    style: "countup",
    note: "The count lands and bounces — the Penner bounce easing lets the number settle like a dropped ball",
    box: {
      width: 320, height: 130,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:6px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:10.5px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#8f8d84'>Stars on GitHub</span>" +
            "<div style='display:flex;align-items:center;gap:10px'>" +
            "<div class='tl-mile-num' style='" + DISPLAY + "font-size:28px;font-weight:600;color:#faf9f5;font-variant-numeric:tabular-nums'>0</div>" +
            "<div class='mile-dot' style='position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center;flex:none'><span style='width:7px;height:7px;border-radius:50%;background:#d97757'></span></div>" +
            "</div>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>crossed 10k this morning</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "countup", el: ".tl-mile-num",
        options: { value: 10000, durationMs: 2400, easing: "easeOutBounce", separator: ",", restMs: 2600 } },
      { style: "pulse", el: ".mile-dot",
        options: { rings: 1, dot: false, durationMs: 1800, strokeWidth: 3, maxOpacity: 0.45, color: "#d97757" } }
    ]
  },
  {
    name: "Rough Chart",
    category: "Chart Card",
    style: "progress",
    note: "Hand-drawn bars: each wobbly stroke fills up its own amount, staggered left to right",
    box: {
      width: 320, height: 170,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Weekly traces</span>" +
            "<div style='display:flex;align-items:flex-end;gap:18px;flex:1;padding:0 6px'>" +
            "<div style='flex:1;display:flex;flex-direction:column;align-items:center;gap:5px'><div class='rc-b1' style='position:relative;width:100%;height:64px'></div><span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>Mon</span></div>" +
            "<div style='flex:1;display:flex;flex-direction:column;align-items:center;gap:5px'><div class='rc-b2' style='position:relative;width:100%;height:64px'></div><span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>Tue</span></div>" +
            "<div style='flex:1;display:flex;flex-direction:column;align-items:center;gap:5px'><div class='rc-b3' style='position:relative;width:100%;height:64px'></div><span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>Wed</span></div>" +
            "<div style='flex:1;display:flex;flex-direction:column;align-items:center;gap:5px'><div class='rc-b4' style='position:relative;width:100%;height:64px'></div><span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>Thu</span></div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".rc-b1",
        options: { d: "M20,60 C17,44 23,28 20,6", viewBox: "0 0 40 64", strokeWidth: 12, headRadius: 5, color: "#6a9bcc", guideOpacity: 0.15, to: 0.45 } },
      { style: "progress", el: ".rc-b2",
        options: { d: "M20,60 C23,42 18,24 21,6", viewBox: "0 0 40 64", strokeWidth: 12, headRadius: 5, color: "#6a9bcc", guideOpacity: 0.15, to: 0.7, delayMs: 300 } },
      { style: "progress", el: ".rc-b3",
        options: { d: "M20,60 C18,46 22,26 19,6", viewBox: "0 0 40 64", strokeWidth: 12, headRadius: 5, color: "#6a9bcc", guideOpacity: 0.15, to: 0.55, delayMs: 600 } },
      { style: "progress", el: ".rc-b4",
        options: { d: "M20,60 C22,40 17,22 20,6", viewBox: "0 0 40 64", strokeWidth: 12, headRadius: 5, color: "#d97757", guideOpacity: 0.15, to: 0.9, delayMs: 900 } }
    ]
  },
  {
    name: "Save Spinner",
    category: "Form",
    style: "button",
    note: "A Ladda-style save: the button's own border traces the wait while the label holds",
    box: {
      width: 320, height: 110,
      html: "<div style='display:flex;align-items:center;justify-content:center;height:100%;padding:0 20px;box-sizing:border-box'>" +
            "<button class='tl-save-btn' style='position:relative;display:flex;align-items:center;justify-content:center;gap:9px;width:200px;height:42px;background:#d97757;border:0;border-radius:8px;" + DISPLAY + "font-size:12.5px;font-weight:600;color:#141413;cursor:pointer;overflow:hidden'>" +
            "<span>Saving…</span></button>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "button", el: ".tl-save-btn",
        options: { variant: "trace", durationMs: 2400, restMs: 1600, strokeWidth: 2, color: "#141413" } }
    ]
  }

  );

  function checkRow(label, done, mode) {
    var icon = done
      ? "<span style='display:inline-flex;width:15px;height:15px;flex:none;color:#788c5d'>" + ic(CHECK, 15, 15, "#788c5d", 2.5) + "</span>"
      : (mode === "live"
        ? ""
        : "<span style='display:inline-flex;width:15px;height:15px;flex:none;border:1.5px solid #3f3d34;border-radius:3px;box-sizing:border-box'></span>");
    return "<div style='display:flex;align-items:center;gap:9px'>" +
      "<span style='display:inline-flex;width:15px;flex:none;justify-content:center'>" + icon + "</span>" +
      "<span style='" + DISPLAY + "font-size:11.5px;font-weight:500;color:" + (done ? "#b0aea5" : "#faf9f5") + "'>" + label + "</span></div>";
  }
})(typeof window !== "undefined" ? window : this);
