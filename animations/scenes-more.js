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
    name: "Pricing Popular",
    category: "Pricing",
    style: "pulse",
    note: "A plan card whose Popular badge breathes \u2014 the quiet pulse pulling the eye to the recommended tier",
    box: {
      width: 280, height: 224,
      html: "<div style='padding:18px 20px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:8px'>" +
            "<span style='" + DISPLAY + "font-size:15px;font-weight:600;color:#faf9f5'>Pro</span>" +
            "<span class='tl-badge' style='position:relative;margin-left:auto;width:74px;height:22px;display:flex;align-items:center;justify-content:center;border:1px solid #3f3d34;border-radius:999px;font-size:10px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#d97757;" + DISPLAY + "'>Popular</span></div>" +
            "<div style='" + DISPLAY + "font-size:24px;font-weight:600;color:#faf9f5'>$12<span style='font-size:12px;font-weight:400;color:#b0aea5'>/mo</span></div>" +
            "<div style='" + BODY + "font-size:11.5px;line-height:1.6;color:#b0aea5'>Everything in Starter, plus:<br>React adapter &middot; Commercial license<br>Priority fixes &middot; New styles first</div>" +
            "<div style='" + DISPLAY + "margin-top:auto;height:38px;display:flex;align-items:center;justify-content:center;background:#262420;border:1px solid #3f3d34;border-radius:8px;font-size:13px;font-weight:500;color:#faf9f5'>Choose Pro</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "pulse", el: ".tl-badge",
        options: { rings: 1, durationMs: 2200, strokeWidth: 10, maxOpacity: 0.35, color: "#d97757" } }
    ]
  },

  {
    name: "Newsletter Field",
    category: "Newsletter",
    style: "input",
    note: "A footer signup: the email field types itself in before the subscribe click",
    box: {
      width: 320, height: 164,
      html: "<div style='padding:18px 20px;display:flex;flex-direction:column;gap:12px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:15px;font-weight:600;color:#faf9f5'>Ship better interfaces</div>" +
            "<div style='" + BODY + "font-size:12px;line-height:1.5;color:#b0aea5'>One email a month on motion, paths and perf. No noise.</div>" +
            "<div style='display:flex;gap:8px;align-items:flex-end'>" +
            "<div class='tl-field' style='position:relative;flex:1;height:46px;background:#262420;border:1px solid #33312c;border-radius:8px'></div>" +
            "<div style='" + DISPLAY + "height:46px;display:flex;align-items:center;padding:0 16px;background:#d97757;border-radius:8px;font-size:13px;font-weight:500;color:#141413;flex:none'>Subscribe</div>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-field",
        options: { label: "Email", value: "dev@studio.co", durationMs: 360, restMs: 1500, color: "#d97757" } }
    ]
  },

  {
    name: "Testimonial Quote",
    category: "Testimonial",
    style: "chase",
    note: "A quote card with a formation of dashes chasing along the rule beneath the author \u2014 quiet proof the page is alive",
    box: {
      width: 320, height: 186,
      html: "<div style='padding:18px 20px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<svg viewBox='0 0 88 16' width='88' height='16' aria-hidden='true' fill='#d97757' style='flex:none'>" +
            "<path d='M2 14 L2 8 Q2 2 8 2 L8 6 Q5 6 5 8 L8 8 L8 14 Z'/><path d='M20 14 L20 8 Q20 2 26 2 L26 6 Q23 6 23 8 L26 8 L26 14 Z'/>" +
            "<g fill='none' stroke='#d97757' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>" +
            "<path d='M44 8 l3 3 6-6'/><path d='M62 8 l3 3 6-6'/><path d='M80 8 l3 3 6-6'/></g></svg>" +
            "<div style='" + BODY + "font-size:13px;line-height:1.6;color:#faf9f5'>The only loader library where the animation follows our logo instead of sitting next to it.</div>" +
            "<div style='display:flex;align-items:center;gap:10px;margin-top:auto'>" +
            "<span style='width:26px;height:26px;border-radius:50%;background:#788c5d;flex:none'></span>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:500;color:#faf9f5'>Mara Lindqvist</span>" +
            "<span style='" + DISPLAY + "font-size:11px;color:#8f8d84'>&middot; Design lead, Fjord</span></div>" +
            "<div class='tl-rule' style='position:relative;height:8px;width:200px'></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "chase", el: ".tl-rule",
        options: { d: { shape: "underline", args: [200, 4] }, segments: 3, segmentFraction: 0.1, durationMs: 2200, strokeWidth: 2, color: "#788c5d", guideOpacity: 0.25 } }
    ]
  },

  {
    name: "App Shell Drawer",
    category: "Application Shell",
    style: "drawer",
    note: "An admin shell: the sidebar slides in from the left while its leading edge draws down the nav",
    box: {
      width: 320, height: 190,
      styleCss: "position:relative;background:#141413;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";overflow:hidden;",
      html: "<div style='position:absolute;top:0;left:0;right:0;height:34px;background:#1c1b19;border-bottom:1px solid #33312c;display:flex;align-items:center;padding:0 12px;gap:8px'>" +
            "<span style='width:8px;height:8px;border-radius:2px;background:#d97757'></span>" +
            "<span style='" + DISPLAY + "font-size:11px;font-weight:500;color:#b0aea5'>Admin</span></div>" +
            "<div style='" + DISPLAY + "position:absolute;top:46px;left:16px;font-size:11px;color:#8f8d84'>Overview &middot; 4 projects synced</div>" +
            "<div class='tl-drawer' style='position:absolute;top:34px;bottom:0;left:0;width:118px;background:#1c1b19;border-right:1px solid #33312c;padding:14px 0;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "padding:6px 14px;font-size:11px;font-weight:500;color:#faf9f5;border-left:2px solid #d97757'>Dashboard</div>" +
            "<div style='" + DISPLAY + "padding:6px 14px;font-size:11px;color:#8f8d84'>Deployments</div>" +
            "<div style='" + DISPLAY + "padding:6px 14px;font-size:11px;color:#8f8d84'>Members</div>" +
            "<div style='" + DISPLAY + "padding:6px 14px;font-size:11px;color:#8f8d84'>Settings</div>" +
            "</div>"
    },
    parts: [
      { style: "drawer", el: ".tl-drawer",
        options: { side: "left", durationMs: 420, restMs: 1600, color: "#d97757", backdrop: false } }
    ]
  },

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
  );
})(typeof window !== "undefined" ? window : this);
