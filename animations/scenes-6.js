(function (global) {

  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";

  list.push(
  {
    name: "Now Playing",
    category: "Audio Player",
    style: "progress",
    note: "A player whose track bar holds its playhead at 38% \u2014 determinate, like real playback",
    box: {
      width: 320, height: 104,
      html: "<div style='display:flex;gap:12px;height:100%;padding:14px 16px;box-sizing:border-box;padding-bottom:20px'>" +
            "<div style='position:relative;width:56px;height:56px;border-radius:8px;background:#d97757;flex:none;display:flex;align-items:center;justify-content:center'>" +
            "<svg viewBox='0 0 24 24' width='16' height='16' aria-hidden='true'><path d='M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z' fill='#141413' stroke='#141413' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg></div>" +
            "<div style='flex:1;display:flex;flex-direction:column;gap:6px;min-width:0;padding-top:2px'>" +
            "<div style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>Pathwork</div>" +
            "<div style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>TraceLoop FM &middot; Ambient loops</div>" +
            "<div class='tl-track' style='position:relative;height:8px;width:180px'></div>" +
            "<div style='display:flex;justify-content:space-between;width:180px'>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>1:24</span>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>3:40</span></div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-track",
        options: { d: { shape: "underline", args: [180, 3] }, strokeWidth: 3, headRadius: 3.5, color: "#d97757", guideOpacity: 0.3, to: 0.38 } }
    ]
  },

  {
    name: "Contact Form",
    category: "Contact",
    style: "input",
    note: "A contact card where the visitor's details type themselves in before send",
    box: {
      width: 320, height: 214,
      html: "<div style='padding:16px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:14px;font-weight:600;color:#faf9f5'>Get in touch</div>" +
            "<div class='tl-cf-name' style='position:relative;height:44px;background:#262420;border:1px solid #33312c;border-radius:8px'></div>" +
            "<div class='tl-cf-mail' style='position:relative;height:44px;background:#262420;border:1px solid #33312c;border-radius:8px'></div>" +
            "<div style='" + DISPLAY + "margin-top:auto;height:38px;display:flex;align-items:center;justify-content:center;background:#d97757;border-radius:8px;font-size:13px;font-weight:600;color:#141413'>Send message</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-cf-name", options: { label: "Name", value: "Ada Lovelace", durationMs: 320, restMs: 1600, color: "#d97757" } },
      { style: "input", el: ".tl-cf-mail", options: { label: "Email", value: "ada@analytical.dev", durationMs: 320, restMs: 1600, color: "#d97757" } }
    ]
  },

  {
    name: "Notification Stack",
    category: "Toast",
    style: "toast",
    note: "Two notifications on their own clocks: the deploy bar drains while the mention edge counts down",
    box: {
      width: 320, height: 128,
      html: "<div style='padding:12px 14px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div class='tl-ns-1' style='position:relative;display:flex;align-items:center;gap:9px;background:#262420;border:1px solid #33312c;border-radius:8px;padding:9px 12px'>" +
            "<span style='display:flex;flex:none;color:#788c5d'><svg viewBox='0 0 24 24' width='14' height='14' aria-hidden='true'><path d='M20 6L9 17l-5-5' fill='none' stroke='#788c5d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5'/></svg></span>" +
            "<span style='" + DISPLAY + "flex:1;font-size:11.5px;font-weight:500;color:#faf9f5'>Deploy complete</span>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>now</span></div>" +
            "<div class='tl-ns-2' style='position:relative;display:flex;align-items:center;gap:9px;background:#262420;border:1px solid #33312c;border-radius:8px;padding:9px 12px'>" +
            "<span style='width:20px;height:20px;border-radius:50%;background:#6a9bcc;display:flex;align-items:center;justify-content:center;" + DISPLAY + "font-size:9px;font-weight:600;color:#141413;flex:none'>M</span>" +
            "<span style='" + DISPLAY + "flex:1;font-size:11.5px;font-weight:500;color:#faf9f5'>Mara commented</span>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>2m</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "toast", el: ".tl-ns-1",
        options: { variant: "bar", enter: "drop", durationMs: 3400, restMs: 900, color: "#788c5d" } },
      { style: "toast", el: ".tl-ns-2",
        options: { variant: "edge", enter: "drop", durationMs: 4100, restMs: 1400, color: "#6a9bcc" } }
    ]
  },
  {
    name: "Undo Toast",
    category: "Toast",
    style: "toast",
    note: "A snackbar whose countdown drains along its bottom edge while Undo waits",
    box: {
      width: 320, height: 88,
      html: "<div style='display:flex;flex-direction:column;justify-content:flex-end;height:100%;box-sizing:border-box;padding:0 14px 14px'>" +
            "<div class='tl-undo' style='position:relative;display:flex;align-items:center;gap:10px;background:#262420;border:1px solid #3f3d34;border-radius:8px;padding:10px 14px'>" +
            "<span style='" + DISPLAY + "flex:1;font-size:11.5px;font-weight:500;color:#faf9f5'>File moved to Archive</span>" +
            "<span style='" + DISPLAY + "font-size:11px;font-weight:600;color:#6a9bcc;flex:none'>Undo</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "toast", el: ".tl-undo",
        options: { variant: "bar", enter: "pop", durationMs: 3800, restMs: 1100, color: "#6a9bcc" } }
    ]
  },
  );
})(typeof window !== "undefined" ? window : this);