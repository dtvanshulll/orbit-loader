/*!
 * TraceLoop — SCENE CONFIGS, part two: Pricing, Newsletter, Testimonial,
 * Application Shell, Countdown, Onboarding, Feature Grid, Banner, Footer
 * and Data Table. Same contract as scenes.js; loaded right after it.
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";
  function planRow(label, free, pro) {
    var mark = function (on) {
      return on
        ? "<svg viewBox='0 0 16 16' width='13' height='13' aria-hidden='true'><path d='M3 8.5 L6.5 12 L13 4.5' fill='none' stroke='#788c5d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>"
        : "<span style='color:#4a483f;font-size:11px'>&mdash;</span>";
    };
    return "<div style='display:flex;align-items:center;gap:8px;border-top:1px solid #262420;padding:7px 0'>" +
      "<span style='" + BODY + "flex:1;font-size:11.5px;color:#b0aea5'>" + label + "</span>" +
      "<span style='width:60px;display:flex;justify-content:center'>" + mark(free) + "</span>" +
      "<span style='width:60px;display:flex;justify-content:center'>" + mark(pro) + "</span></div>";
  }
  function member(name, role, accent, n) {
    return "<div style='flex:1;background:#262420;border:1px solid #33312c;border-radius:8px;padding:10px;display:flex;align-items:center;gap:10px'>" +
      "<span class='tl-av-" + n + "' style='position:relative;width:30px;height:30px;flex:none;display:flex;align-items:center;justify-content:center'>" +
      "<span style='width:20px;height:20px;border-radius:50%;background:" + accent + "'></span></span>" +
      "<div style='min-width:0'><div style='" + DISPLAY + "font-size:11.5px;font-weight:600;color:#faf9f5;white-space:nowrap'>" + name + "</div>" +
      "<div style='" + DISPLAY + "font-size:10px;color:#8f8d84'>" + role + "</div></div></div>";
  }
  function tile(title, sub, accent) {
    return "<div style='flex:1;background:#262420;border:1px solid #33312c;border-radius:8px;padding:10px 8px;display:flex;flex-direction:column;gap:6px'>" +
      "<span class='tl-ic-" + (accent === "#d97757" ? 1 : accent === "#6a9bcc" ? 2 : 3) + "' style='position:relative;width:26px;height:26px;flex:none'></span>" +
      "<span style='" + DISPLAY + "font-size:11px;font-weight:600;color:#faf9f5'>" + title + "</span>" +
      "<span style='" + BODY + "font-size:10.5px;line-height:1.45;color:#8f8d84'>" + sub + "</span></div>";
  }
  function row(name, pct, frac, color) {
    var n = { "#d97757": 1, "#6a9bcc": 2, "#788c5d": 3 }[color];
    return "<div style='display:flex;align-items:center;border-bottom:1px solid #262420;padding:7px 0'>" +
      "<span style='" + DISPLAY + "flex:1;font-size:12px;font-weight:500;color:#faf9f5'>" + name + "</span>" +
      "<span style='width:110px;display:flex;align-items:center;gap:8px'>" +
      "<span class='tl-bar-" + n + "' style='position:relative;width:80px;height:8px;flex:none'></span>" +
      "<span style='" + DISPLAY + "font-size:11px;color:#8f8d84;width:26px;text-align:right'>" + pct + "</span></span></div>";
  }

  list.push(
  {
    name: "Deal Countdown",
    category: "Countdown",
    style: "toast",
    note: "A sale banner whose ring drains clockwise in the corner \u2014 urgency without a ticking number",
    box: {
      width: 320, height: 70,
      html: "<div style='display:flex;align-items:center;gap:12px;height:100%;padding:12px 16px;box-sizing:border-box;padding-right:48px'>" +
            "<span style='" + DISPLAY + "flex:1;font-size:13px;font-weight:600;color:#faf9f5'>Black Friday <span style='color:#d97757'>&middot; 40% off everything</span></span>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:500;color:#141413;background:#d97757;border-radius:6px;padding:6px 12px;flex:none'>View deals</span>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "toast",
        options: { variant: "ring", enter: "pop", durationMs: 3600, restMs: 1500, color: "#d97757" } }
    ]
  },

  {
    name: "Onboarding Steps",
    category: "Onboarding",
    style: "progress",
    note: "A setup card: the step line quantizes to four ticks as the user moves through setup",
    box: {
      width: 300, height: 196,
      html: "<div style='padding:18px 20px;display:flex;flex-direction:column;gap:12px;height:100%;box-sizing:border-box'>" +
            "<div class='tl-steps' style='position:relative;height:24px;width:240px'></div>" +
            "<div style='" + DISPLAY + "font-size:14px;font-weight:600;color:#faf9f5'>Create your profile</div>" +
            "<div style='" + BODY + "font-size:12px;line-height:1.55;color:#b0aea5'>Add your name and avatar so teammates can find you. You can change this anytime in settings.</div>" +
            "<div style='display:flex;gap:8px;margin-top:auto'>" +
            "<span style='" + DISPLAY + "font-size:11px;font-weight:500;color:#788c5d'>&#10003; Workspace</span>" +
            "<span style='" + DISPLAY + "font-size:11px;font-weight:500;color:#d97757'>Profile</span>" +
            "<span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>Invite</span>" +
            "<span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>Done</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-steps",
        options: { d: { shape: "underline", args: [240] }, strokeWidth: 3, headRadius: 3.5, steps: 4, color: "#788c5d", guideOpacity: 0.3 } }
    ]
  },
  {
    name: "Feature Icons",
    category: "Feature Grid",
    style: "orbit",
    note: "A feature row where each icon outline draws itself, one accent per card",
    box: {
      width: 300, height: 170,
      html: "<div style='display:flex;gap:6px;height:100%;padding:10px;box-sizing:border-box'>" +
            tile("Path-native", "Motion follows your shape", "#d97757") +
            tile("Zero deps", "One script tag, done", "#6a9bcc") +
            tile("React ready", "Thin adapter included", "#788c5d") +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-ic-1", options: { d: { shape: "roundRect", args: [26, 26, 6] }, durationMs: 1800, restMs: 1200, strokeWidth: 2, color: "#d97757", guideOpacity: 0.35 } },
      { style: "orbit", el: ".tl-ic-2", options: { d: { shape: "roundRect", args: [26, 26, 6] }, durationMs: 1800, restMs: 1200, strokeWidth: 2, color: "#6a9bcc", guideOpacity: 0.35 } },
      { style: "orbit", el: ".tl-ic-3", options: { d: { shape: "roundRect", args: [26, 26, 6] }, durationMs: 1800, restMs: 1200, strokeWidth: 2, color: "#788c5d", guideOpacity: 0.35 } }
    ]
  },

  {
    name: "Release Banner",
    category: "Banner",
    style: "shimmer",
    note: "An announcement bar with a shimmer sweeping its underline \u2014 noticed, not shouted",
    box: {
      width: 320, height: 64,
      html: "<div style='display:flex;align-items:center;gap:10px;height:100%;padding:12px 16px;box-sizing:border-box;padding-bottom:18px'>" +
            "<span style='" + DISPLAY + "font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#141413;background:#d97757;border-radius:999px;padding:3px 8px;flex:none'>New</span>" +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:500;color:#faf9f5'>TraceLoop 2.0 \u2014 drawers &amp; dropdowns</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:12px;font-weight:500;color:#d97757;flex:none'>Read \u2192</span>" +
            "</div>" +
            "<div class='tl-sweep' style='position:absolute;left:16px;bottom:12px;width:288px;height:10px'></div>",
      styleCss: CARD
    },
    parts: [
      { style: "shimmer", el: ".tl-sweep",
        options: { d: { shape: "underline", args: [288, 2] }, durationMs: 2600, strokeWidth: 5, color: "#d97757", guideOpacity: 0.2 } }
    ]
  },

  {
    name: "Footer Rule",
    category: "Footer",
    style: "orbit",
    note: "A site footer whose divider draws itself above the legal line",
    box: {
      width: 320, height: 186,
      html: "<div style='padding:16px 20px;display:flex;flex-direction:column;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;gap:28px'>" +
            "<div style='flex:1'><div style='display:flex;align-items:center;gap:7px'><span style='width:9px;height:9px;border-radius:3px;background:#d97757'></span><span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>TraceLoop</span></div>" +
            "<div style='" + BODY + "font-size:11px;line-height:1.5;color:#8f8d84;margin-top:6px'>Path-native loading<br>and transition motion.</div></div>" +
            "<div style='" + DISPLAY + "font-size:11px;line-height:2;color:#b0aea5'>Styles<br>Docs<br>GitHub</div>" +
            "<div style='" + DISPLAY + "font-size:11px;line-height:2;color:#b0aea5'>License<br>Changelog<br>Releases</div>" +
            "</div>" +
            "<div class='tl-rule' style='position:relative;height:6px;width:280px;margin-top:auto'></div>" +
            "<div style='" + DISPLAY + "font-size:10px;color:#8f8d84;margin-top:6px'>&copy; 2026 TraceLoop &middot; MIT</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-rule",
        options: { d: { shape: "underline", args: [280, 1.5] }, durationMs: 2000, restMs: 2400, strokeWidth: 1.5, color: "#8f8d84", guideOpacity: 0.4 } }
    ]
  },

  {
    name: "Usage Table",
    category: "Data Table",
    style: "progress",
    note: "A table whose usage bars hold static fills \u2014 data, not a demo loop",
    box: {
      width: 320, height: 190,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "display:flex;font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8f8d84;border-bottom:1px solid #33312c;padding-bottom:6px'><span style='flex:1'>Project</span><span style='width:110px'>Usage</span></div>" +
            row("Atlas", "42%", 0.42, "#d97757") +
            row("Beacon", "68%", 0.68, "#6a9bcc") +
            row("Cinder", "91%", 0.91, "#788c5d") +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-bar-1", options: { d: { shape: "underline", args: [110, 3] }, strokeWidth: 3, headRadius: 2.5, color: "#d97757", guideOpacity: 0.3, to: 0.42 } },
      { style: "progress", el: ".tl-bar-2", options: { d: { shape: "underline", args: [110, 3] }, strokeWidth: 3, headRadius: 2.5, color: "#6a9bcc", guideOpacity: 0.3, to: 0.68 } },
      { style: "progress", el: ".tl-bar-3", options: { d: { shape: "underline", args: [110, 3] }, strokeWidth: 3, headRadius: 2.5, color: "#788c5d", guideOpacity: 0.3, to: 0.91 } }
    ]
  },
  {
    name: "Plan Compare",
    category: "Pricing",
    style: "orbit",
    note: "A two-plan table where the recommended column's header underlines itself",
    box: {
      width: 300, height: 252,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:flex-end;gap:8px'>" +
            "<span style='flex:1'></span>" +
            "<div style='width:60px;text-align:center;padding-bottom:2px'>" +
            "<div style='" + DISPLAY + "font-size:11px;font-weight:500;color:#b0aea5'>Free</div>" +
            "<div style='" + DISPLAY + "font-size:16px;font-weight:600;color:#faf9f5'>$0</div></div>" +
            "<div style='width:60px;text-align:center;background:#262420;border:1px solid #3f3d34;border-bottom:none;border-radius:8px 8px 0 0;padding:6px 0 4px'>" +
            "<div style='" + DISPLAY + "font-size:11px;font-weight:600;color:#d97757'>Pro</div>" +
            "<div style='" + DISPLAY + "font-size:16px;font-weight:600;color:#faf9f5'>$12</div>" +
            "<div class='tl-pro' style='position:relative;height:6px;width:52px;margin:2px auto 0'></div></div>" +
            "</div>" +
            planRow("Styles", true, false) +
            planRow("React adapter", true, false) +
            planRow("Commercial use", true, true) +
            planRow("Priority fixes", false, true) +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-pro",
        options: { d: { shape: "underline", args: [52, 3] }, durationMs: 1600, restMs: 1600, strokeWidth: 2, color: "#d97757", guideOpacity: 0.3 } }
    ]
  },

  {
    name: "Team Presence",
    category: "Team",
    style: "orbit",
    note: "Teammate cards whose avatar rings trace themselves \u2014 presence you can see",
    box: {
      width: 300, height: 96,
      html: "<div style='display:flex;gap:8px;height:100%;padding:12px;box-sizing:border-box'>" +
            member("Mara Lindqvist", "Design lead", "#d97757", 1) +
            member("Tom Okafor", "Engineering", "#6a9bcc", 2) +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-av-1", options: { d: { shape: "circle", args: [30] }, durationMs: 2000, restMs: 1400, strokeWidth: 2, color: "#d97757", guideOpacity: 0.3 } },
      { style: "orbit", el: ".tl-av-2", options: { d: { shape: "circle", args: [30] }, durationMs: 2000, restMs: 1400, strokeWidth: 2, color: "#6a9bcc", guideOpacity: 0.3 } }
    ]
  },

  {
    name: "Video Testimonial",
    category: "Testimonial",
    style: "orbit",
    note: "A customer story card: the play button's ring traces itself before the quote",
    box: {
      width: 320, height: 120,
      html: "<div style='display:flex;gap:14px;height:100%;padding:14px 16px;box-sizing:border-box'>" +
            "<div style='position:relative;width:92px;border-radius:8px;background:#262420;border:1px solid #33312c;flex:none;display:flex;align-items:center;justify-content:center'>" +
            "<span class='tl-play' style='position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center'>" +
            "<svg viewBox='0 0 12 14' width='11' height='13' aria-hidden='true'><path d='M1,1 L11,7 L1,13 Z' fill='#faf9f5'/></svg></span></div>" +
            "<div style='flex:1;display:flex;flex-direction:column;gap:6px;min-width:0'>" +
            "<div style='" + BODY + "font-size:12px;line-height:1.55;color:#faf9f5'>We shipped our rebrand with TraceLoop underlines everywhere.</div>" +
            "<div style='display:flex;align-items:center;gap:8px;margin-top:auto'>" +
            "<span style='width:22px;height:22px;border-radius:50%;background:#6a9bcc;flex:none'></span>" +
            "<span style='" + DISPLAY + "font-size:11px;font-weight:500;color:#faf9f5'>Ana Duarte</span>" +
            "<span style='" + DISPLAY + "font-size:10px;color:#8f8d84'>&middot; 2:14</span></div></div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-play",
        options: { d: { shape: "circle", args: [40] }, durationMs: 2200, restMs: 1600, strokeWidth: 2, color: "#d97757", guideOpacity: 0.3 } }
    ]
  },
  {
    name: "Hero CTA",
    category: "Hero",
    style: "button",
    note: "A hero whose CTA traces its own border while it waits \u2014 the invite you cannot miss",
    box: {
      width: 320, height: 170,
      html: "<div style='padding:18px 20px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#d97757'>Now in beta</span>" +
            "<div style='" + DISPLAY + "font-size:19px;font-weight:600;line-height:1.25;color:#faf9f5'>Motion that follows<br>your product's lines</div>" +
            "<div style='" + BODY + "font-size:11.5px;line-height:1.55;color:#b0aea5'>Drop a path, get an animation. No keyframes, no library lock-in.</div>" +
            "<div class='tl-cta' style='position:relative;margin-top:auto;width:150px;height:40px;display:flex;align-items:center;justify-content:center;background:#d97757;border-radius:8px;" + DISPLAY + "font-size:13px;font-weight:600;color:#141413'>Start tracing</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "button", el: ".tl-cta",
        options: { variant: "trace", durationMs: 1400, restMs: 1800, strokeWidth: 2, color: "#faf9f5" } }
    ]
  },

  {
    name: "Footer Language",
    category: "Footer",
    style: "dropdown",
    note: "A site footer's language selector opening its menu in place",
    box: {
      width: 320, height: 120,
      html: "<div style='padding:16px 20px;display:flex;flex-direction:column;height:100%;box-sizing:border-box;gap:10px'>" +
            "<div style='display:flex;align-items:center;gap:7px'><span style='width:9px;height:9px;border-radius:3px;background:#d97757'></span><span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5'>TraceLoop</span>" +
            "<div class='tl-lang' style='position:relative;margin-left:auto;width:120px;height:30px'></div></div>" +
            "<div style='display:flex;gap:24px'>" +
            "<div style='" + DISPLAY + "font-size:10.5px;line-height:1.9;color:#8f8d84'>PRODUCT<br>Styles<br>Playground</div>" +
            "<div style='" + DISPLAY + "font-size:10.5px;line-height:1.9;color:#8f8d84'>COMPANY<br>About<br>License</div>" +
            "<div style='" + DISPLAY + "font-size:10.5px;line-height:1.9;color:#8f8d84'>CONNECT<br>GitHub<br>X</div>" +
            "</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "dropdown", el: ".tl-lang",
        options: { trigger: "English", items: ["English", "Deutsch", "Français", "日本語"], durationMs: 300, restMs: 1500, color: "#d97757" } }
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
            "<div style='" + DISPLAY + "position:absolute;top:64px;left:16px;font-size:11px;color:#8f8d84'>api-service &middot; main &middot; 2m ago</div>" +
            "<div class='tl-shell-toast' style='position:absolute;top:44px;right:12px;width:170px'></div>"
    },
    parts: [
      { style: "toast", el: ".tl-shell-toast",
        options: { title: "Deploy succeeded", message: "api-service is live on production", enter: "drop", durationMs: 3400, restMs: 1600, color: "#788c5d" } }
    ]
  },
  );
})(typeof window !== "undefined" ? window : this);
