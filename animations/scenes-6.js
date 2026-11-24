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
    name: "Shell Toast",
    category: "Application Shell",
    style: "toast",
    note: "An admin shell where a deploy notification drops in from the top edge",
    box: {
      width: 320, height: 190,
      styleCss: "position:relative;background:#141413;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";overflow:hidden;",
      html: "<div style='position:absolute;top:0;left:0;right:0;height:34px;background:#1c1b19;border-bottom:1px solid #33312c;display:flex;align-items:center;padding:0 12px;gap:8px'>" +
            "<span style='width:8px;height:8px;border-radius:2px;background:#d97757'></span>" +
            "<span style='" + DISPLAY + "font-size:11px;font-weight:500;color:#b0aea5'>Admin</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>Production</span></div>" +
            "<div style='" + DISPLAY + "position:absolute;top:46px;left:16px;font-size:11px;color:#8f8d84'>3 deploys today &middot; all green</div>" +
            "<div style='position:absolute;top:88px;left:16px;right:16px;border-top:1px solid #262420'>" +
            "<div style='display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #262420'>" +
            "<span style='width:7px;height:7px;border-radius:50%;background:#788c5d;flex:none'></span>" +
            "<span style='" + DISPLAY + "flex:1;font-size:11px;color:#b0aea5'>web-app &middot; main</span>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>14m ago</span></div>" +
            "<div style='display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #262420'>" +
            "<span style='width:7px;height:7px;border-radius:50%;background:#788c5d;flex:none'></span>" +
            "<span style='" + DISPLAY + "flex:1;font-size:11px;color:#b0aea5'>docs &middot; release</span>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>1h ago</span></div>" +
            "<div style='display:flex;align-items:center;gap:8px;padding:7px 0'>" +
            "<span style='width:7px;height:7px;border-radius:50%;background:#788c5d;flex:none'></span>" +
            "<span style='" + DISPLAY + "flex:1;font-size:11px;color:#b0aea5'>cli &middot; main</span>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>3h ago</span></div>" +
            "</div>" +
            "<div class='tl-shell-toast' style='position:absolute;top:44px;right:12px;width:170px'></div>"
    },
    parts: [
      { style: "toast", el: ".tl-shell-toast",
        options: { title: "Deploy succeeded", message: "api-service is live on production", enter: "drop", durationMs: 3400, restMs: 1600, color: "#788c5d" } }
    ]
  },
  );
})(typeof window !== "undefined" ? window : this);