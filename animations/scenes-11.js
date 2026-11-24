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
    style: "orbit",
    note: "A stat card whose trend line draws itself up to the current number",
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
        options: { d: "M2,38 L34,30 L66,34 L98,20 L130,26 L162,12 L194,18 L226,6", viewBox: "0 0 228 42", durationMs: 2200, restMs: 1800, strokeWidth: 2, color: "#788c5d", guideOpacity: 0.2 } }
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
