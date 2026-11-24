/*!
 * TraceLoop — SCENE CONFIGS, part five: Inbox, Issue Tracker, Settings,
 * Order History, Integrations, Activity, File Manager, Empty State and
 * Search. Same contract as scenes.js; icons are sourced Lucide paths.
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";
  var MAIL = "<rect width='20' height='16' x='2' y='4' rx='2'/><path d='m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7'/>";
  var SEARCH = "m21 21l-4.34-4.34";
  var FOLDER = "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z";
  var ZAP = "M15.914 4a1.5 1.5 0 0 0-2.474-1.561l-9 9A1.5 1.5 0 0 0 5.5 14h4.002a.5.5 0 0 1 .471.666L8.086 20a1.5 1.5 0 0 0 2.475 1.56l9-9A1.5 1.5 0 0 0 18.5 10h-3.997a.5.5 0 0 1-.472-.667z";
  var OK = "m16 9l-5.5 5.5L8 12";
  var NO = "m15 9l-6 6m0-6l6 6";
  function lucide(d, w, h, color, fill) {
    return "<svg viewBox='0 0 24 24' width='" + w + "' height='" + h + "' aria-hidden='true'><path d='" + d + "' fill='" + (fill || "none") + "' stroke='" + color + "' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg>";
  }
  function field(sel, label) {
    return "<div class='" + sel + "' style='position:relative;height:42px;background:#262420;border:1px solid #33312c;border-radius:8px'></div>";
  }
  function listRow(left, title, sub, right, unread) {
    return "<div style='display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid #262420'>" +
      "<span style='width:8px;height:8px;border-radius:50%;background:" + (unread ? "#d97757" : "#3f3d34") + ";flex:none'></span>" +
      left +
      "<span style='flex:1;min-width:0'><span style='" + DISPLAY + "display:block;font-size:11.5px;font-weight:" + (unread ? "600" : "400") + ";color:" + (unread ? "#faf9f5" : "#b0aea5") + "'>" + title + "</span>" +
      "<span style='" + BODY + "display:block;font-size:10px;color:#8f8d84;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'>" + sub + "</span></span>" +
      "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84;flex:none'>" + right + "</span></div>";
  }

  list.push(
  {
    name: "Inbox Unread",
    category: "Inbox",
    style: "pulse",
    note: "A mail list where the unread dot breathes \u2014 the eye lands before the brain reads",
    box: {
      width: 320, height: 190,
      html: "<div style='padding:12px 16px;display:flex;flex-direction:column;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:7px;padding-bottom:8px'>" + "<svg viewBox='0 0 24 24' width='14' height='14' aria-hidden='true' fill='none' stroke='#8f8d84' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'>" + MAIL + "</svg>" +
            "<span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Inbox</span>" +
            "<span class='tl-unread' style='position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center;flex:none'><span style='" + DISPLAY + "font-size:9px;font-weight:600;color:#d97757'>3</span></span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:9.5px;color:#8f8d84'>Today</span></div>" +
            listRow("<span style='width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#d97757,#6a9bcc);flex:none'></span>", "Deploy finished", "trace-loop ran 42 checks \u2014 all green", "9:41", true) +
            listRow("<span style='width:22px;height:22px;border-radius:50%;background:#3f3d34;flex:none'></span>", "Weekly digest", "Your repo activity at a glance", "8:02", false) +
            listRow("<span style='width:22px;height:22px;border-radius:50%;background:#3f3d34;flex:none'></span>", "Invoice paid", "Stripe \u2014 $29.00 settled", "Yesterday", false) +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-unread",
        options: { rings: 1, durationMs: 2000, strokeWidth: 4, maxOpacity: 0.4, color: "#d97757" } }
    ]
  },

  {
    name: "Issue Tracker",
    category: "Issue List",
    style: "progress",
    note: "A sprint board header whose completion bar holds at 62%",
    box: {
      width: 320, height: 196,
      html: "<div style='padding:12px 16px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Sprint 14</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#788c5d'>62% done</span></div>" +
            "<div class='tl-sprint' style='position:relative;height:8px;width:100%'></div>" +
            issueRow("Path clipping rounds wrong on curves", "#d97757", "bug") +
            issueRow("Add reduced-motion collapse to drawer", "#6a9bcc", "feat") +
            issueRow("Docs: document the to option", "#788c5d", "docs") +
            issueRow("Ship the playground filter", "#6a9bcc", "feat") +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-sprint",
        options: { d: { shape: "underline", args: [288, 3] }, strokeWidth: 3, headRadius: 3, color: "#788c5d", guideOpacity: 0.3, to: 0.62 } }
    ]
  },

  {
    name: "Profile Settings",
    category: "Settings",
    style: "input",
    note: "A settings form where display name and URL type themselves in",
    box: {
      width: 320, height: 212,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:9px'><span style='width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#d97757,#6a9bcc)'></span>" +
            "<span><span style='" + DISPLAY + "display:block;font-size:12.5px;font-weight:600;color:#faf9f5'>Profile</span><span style='" + DISPLAY + "display:block;font-size:9.5px;color:#8f8d84'>Visible to your team</span></span></div>" +
            field("tl-pf-name") +
            field("tl-pf-url") +
            "<div style='" + DISPLAY + "margin-top:auto;height:36px;display:flex;align-items:center;justify-content:center;background:#262420;border:1px solid #3f3d34;border-radius:8px;font-size:12px;font-weight:500;color:#faf9f5'>Save changes</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-pf-name", options: { label: "Display name", value: "D. Van Schull", durationMs: 300, restMs: 1600, color: "#d97757" } },
      { style: "input", el: ".tl-pf-url", options: { label: "Website", value: "traceloop.dev", durationMs: 300, restMs: 1600, color: "#d97757" } }
    ]
  },

  {
    name: "Notification Toggles",
    category: "Settings",
    style: "pulse",
    note: "A preferences list where the enabled toggle breathes softly",
    box: {
      width: 320, height: 184,
      html: "<div style='padding:12px 16px;display:flex;flex-direction:column;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5;padding-bottom:8px'>Notifications</div>" +
            toggleRow("Deployment events", true) +
            toggleRow("Weekly digest", false) +
            toggleRow("Mentions only", true) +
            toggleRow("Product updates", false) +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-tog-on",
        options: { rings: 1, durationMs: 2200, strokeWidth: 4, maxOpacity: 0.35, color: "#788c5d" } }
    ]
  },

  {
    name: "Order Tracking",
    category: "Order History",
    style: "progress",
    note: "An order row whose shipment bar holds mid-route between hubs",
    box: {
      width: 320, height: 188,
      html: "<div style='padding:12px 16px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline'><span style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Order #1042</span><span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#d97757'>In transit</span></div>" +
            "<div class='tl-route' style='position:relative;height:8px;width:100%'></div>" +
            "<div style='display:flex;justify-content:space-between'><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>Warehouse</span><span style='" + DISPLAY + "font-size:9px;font-weight:500;color:#faf9f5'>Regional hub</span><span style='" + DISPLAY + "font-size:9px;color:#8f8d84'>You</span></div>" +
            "<div style='" + BODY + "font-size:10.5px;line-height:1.5;color:#b0aea5'>Arriving Thursday \u2014 2 items, signature not required.</div>" +
            "<div style='display:flex;align-items:center;gap:8px;border-top:1px solid #262420;padding-top:8px;margin-top:auto'>" +
            "<span style='width:7px;height:7px;border-radius:50%;background:#788c5d;flex:none'></span>" +
            "<span style='" + DISPLAY + "flex:1;font-size:10.5px;color:#b0aea5'>Picked up</span>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>Mon 9:14</span></div>" +
            "<div style='display:flex;align-items:center;gap:8px'>" +
            "<span style='width:7px;height:7px;border-radius:50%;background:#d97757;flex:none'></span>" +
            "<span style='" + DISPLAY + "flex:1;font-size:10.5px;font-weight:500;color:#faf9f5'>Out for delivery</span>" +
            "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>Thu 8:02</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-route",
        options: { d: { shape: "underline", args: [288, 3] }, strokeWidth: 3, headRadius: 3, color: "#d97757", guideOpacity: 0.3, to: 0.55 } }
    ]
  },

  {
    name: "Integrations Grid",
    category: "Integrations",
    style: "orbit",
    note: "Integration tiles where the connected app's badge traces itself",
    box: {
      width: 320, height: 216,
      html: "<div style='padding:12px 16px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Connect a tool</div>" +
            "<div style='display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;flex:1'>" +
            integTile("Stripe", "#6a9bcc", false) +
            integTile("GitHub", "#faf9f5", true) +
            integTile("Slack", "#d97757", false) +
            integTile("Figma", "#6a9bcc", false) +
            integTile("Vercel", "#faf9f5", false) +
            integTile("Notion", "#788c5d", false) +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-int-on",
        options: { d: { shape: "roundRect", args: [88, 74, 8] }, durationMs: 1800, restMs: 1600, strokeWidth: 2, color: "#788c5d", guideOpacity: 0.3 } }
    ]
  },

  {
    name: "Activity Timeline",
    category: "Activity",
    style: "orbit",
    note: "A changelog feed whose spine draws down through the events",
    box: {
      width: 320, height: 196,
      html: "<div style='padding:12px 16px;display:flex;flex-direction:column;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5;padding-bottom:8px'>Today</div>" +
            "<div style='display:flex;gap:10px'><div class='tl-spine' style='position:relative;width:10px;flex:none'></div>" +
            "<div style='flex:1;display:flex;flex-direction:column;gap:9px'>" +
            eventRow("v2.3.0 tagged", "main \u00b7 9:12") +
            eventRow("PR #88 merged", "grain-spanner \u00b7 8:44") +
            eventRow("Issue #91 opened", "reduced-motion \u00b7 8:01") +
            eventRow("Release published", "npm \u00b7 7:38") +
            "</div></div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-spine",
        options: { d: "M2,0 V150", durationMs: 2400, restMs: 1800, strokeWidth: 2, color: "#6a9bcc", guideOpacity: 0.25 } }
    ]
  },

  {
    name: "File Uploads",
    category: "File Manager",
    style: "progress",
    note: "An upload list where one file holds at 80% and the rest sit done",
    box: {
      width: 320, height: 190,
      html: "<div style='padding:12px 16px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:12.5px;font-weight:600;color:#faf9f5'>Uploads</div>" +
            fileRow("traceloop.zip", "4.2 MB", 1) +
            fileRow("assets/", "128 items", 1) +
            fileRow("demo-cut.mp4", "18.7 MB", 0) +
            fileRow("brand-kit.pdf", "1.1 MB", 1) +
            "<div class='tl-up-bar' style='position:relative;height:6px;width:100%;margin-top:2px'></div>" +
            "<div style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>3 of 4 complete &middot; 24 MB total</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-up-bar",
        options: { d: { shape: "underline", args: [288, 2] }, strokeWidth: 3, headRadius: 3, color: "#6a9bcc", guideOpacity: 0.3, to: 0.8 } }
    ]
  },

  {
    name: "Empty State",
    category: "Empty State",
    style: "orbit",
    note: "An empty state where the illustration circle keeps tracing \u2014 nothing to show, something to watch",
    box: {
      width: 320, height: 190,
      html: "<div style='padding:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;height:100%;box-sizing:border-box;text-align:center'>" +
            "<div class='tl-orb' style='position:relative;width:52px;height:52px;display:flex;align-items:center;justify-content:center'>" + lucide(FOLDER, 22, 22, "#6a655c") + "</div>" +
            "<div style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>No projects yet</div>" +
            "<div style='" + BODY + "font-size:10.5px;line-height:1.5;color:#8f8d84;max-width:210px'>Create your first project to start tracing paths.</div>" +
            "<div style='" + DISPLAY + "margin-top:4px;height:32px;padding:0 16px;display:flex;align-items:center;background:#d97757;border-radius:8px;font-size:12px;font-weight:600;color:#141413'>New project</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-orb",
        options: { d: { shape: "circle", args: [52] }, durationMs: 2600, restMs: 1200, strokeWidth: 2, color: "#d97757", guideOpacity: 0.3 } }
    ]
  },

  {
    name: "Search Results",
    category: "Search",
    style: "search",
    note: "A search field that widens while its underline draws, over result rows",
    box: {
      width: 320, height: 200,
      html: "<div style='padding:12px 16px;display:flex;flex-direction:column;gap:9px;height:100%;box-sizing:border-box'>" +
            "<div class='tl-search' style='position:relative;height:38px'></div>" +
            "<div style='" + DISPLAY + "font-size:9.5px;color:#8f8d84;text-transform:uppercase;letter-spacing:0.06em'>6 results</div>" +
            resultRow("wrap(container, options)", "orbit-loader.js") +
            resultRow("create(pathEl, options)", "orbit-loader.js") +
            resultRow("DotLoader", "dot-loader.js") +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "search", el: ".tl-search", options: { label: "Search docs", value: "wrap", durationMs: 320, restMs: 1500, color: "#d97757" } }
    ]
  },
  );

  function issueRow(title, color, tag) {
    return "<div style='display:flex;align-items:center;gap:8px;padding:7px 0;border-top:1px solid #262420'>" +
      "<span style='width:6px;height:6px;border-radius:50%;background:" + color + ";flex:none'></span>" +
      "<span style='" + BODY + "flex:1;font-size:10.5px;color:#b0aea5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'>" + title + "</span>" +
      "<span style='" + DISPLAY + "font-size:8.5px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:" + color + ";flex:none'>" + tag + "</span></div>";
  }
  function toggleRow(label, on) {
    return "<div style='display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #262420'>" +
      "<span style='" + DISPLAY + "flex:1;font-size:11.5px;color:" + (on ? "#faf9f5" : "#b0aea5") + "'>" + label + "</span>" +
      "<span class='" + (on ? "tl-tog-on" : "") + "' style='position:relative;width:34px;height:18px;border-radius:999px;background:" + (on ? "#26331f" : "#262420") + ";border:1px solid " + (on ? "#788c5d" : "#3f3d34") + ";flex:none'>" +
      "<span style='position:absolute;top:2px;" + (on ? "right:2px" : "left:2px") + ";width:12px;height:12px;border-radius:50%;background:" + (on ? "#788c5d" : "#4a483f") + "'></span></span></div>";
  }
  function integTile(name, color, on) {
    return "<div class='" + (on ? "tl-int-on" : "") + "' style='position:relative;background:#262420;border:1px solid #33312c;border-radius:8px;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px'>" +
      "<span style='width:22px;height:22px;border-radius:6px;background:" + color + ";opacity:0.85;display:flex;align-items:center;justify-content:center'>" + lucide(ZAP, 13, 13, "#141413") + "</span>" +
      "<span style='" + DISPLAY + "font-size:10px;font-weight:500;color:" + (on ? "#faf9f5" : "#b0aea5") + "'>" + name + "</span>" +
      "<span style='" + DISPLAY + "font-size:8.5px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:" + (on ? "#788c5d" : "#6a655c") + "'>" + (on ? "Connected" : "Connect") + "</span></div>";
  }
  function eventRow(title, meta) {
    return "<div><span style='" + DISPLAY + "display:block;font-size:11px;font-weight:500;color:#faf9f5'>" + title + "</span>" +
      "<span style='" + DISPLAY + "display:block;font-size:9.5px;color:#8f8d84'>" + meta + "</span></div>";
  }
  function fileRow(name, meta, done) {
    return "<div style='display:flex;align-items:center;gap:8px'>" +
      lucide(done ? OK : NO, 13, 13, done ? "#788c5d" : "#6a655c") +
      "<span style='" + DISPLAY + "flex:1;font-size:11px;color:" + (done ? "#b0aea5" : "#faf9f5") + "'>" + name + "</span>" +
      "<span style='" + DISPLAY + "font-size:9.5px;color:#8f8d84'>" + (done ? "Done" : "80%") + "</span></div>";
  }
  function resultRow(sig, file) {
    return "<div style='display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid #262420'>" +
      "<span style='" + BODY + "flex:1;font-size:10.5px;color:#b0aea5'>" + sig + "</span>" +
      "<span style='" + DISPLAY + "font-size:9px;color:#6a655c'>" + file + "</span></div>";
  }
})(typeof window !== "undefined" ? window : this);
