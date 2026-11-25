/*!
 * TraceLoop — SCENE CONFIGS (playground data): the components library.
 *
 * Real-world blocks inspired by shadcnblocks' category map — navbar,
 * hero, login, stats, FAQ, feedback, cookie banner, CTA — built as
 * mockups and animated by the existing styles. A scene config carries
 * a `category` (its own playground section + sidebar group) and
 * `parts`: one loader per animated element inside box.html, bound by
 * selector. The loaders are the same ones the style sections demo —
 * scenes show them doing a real job. The rest live in scenes-2.js
 * (both files stay under the 400-line ceiling).
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];

  var SHADOW = "0 2px 8px rgba(0, 0, 0, 0.22)";
  var CARD = "background:#1c1b19;border:1px solid #33312c;border-radius:10px;box-shadow:" + SHADOW + ";";
  var SEND = "<svg viewBox='0 0 24 24' width='14' height='14' aria-hidden='true'><path d='M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11zm7.318-19.539l-10.94 10.939' fill='none' stroke='#141413' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg>";
  var COOKIE = "<svg viewBox='0 0 24 24' width='20' height='20' aria-hidden='true'><path d='M11 17h.01m.486-15c.324-.016.558.292.529.615a4 4 0 0 0 4.235 4.368a.713.713 0 0 1 .758.757a4 4 0 0 0 4.366 4.237c.323-.03.63.204.614.527a10 10 0 0 1-2.915 6.566A1 1 0 1 1 4.93 4.918A10 10 0 0 1 11.496 2M12 12h.01M16 16h.01M16 3h.01M21 4h.01M21 8h.01M7 14h.01M9 8h.01' fill='none' stroke='#d97757' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg>";
  var CHEVD = "<svg viewBox='0 0 24 24' width='15' height='15' aria-hidden='true'><path d='m6 9l6 6l6-6' fill='none' stroke='#8f8d84' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg>";
  var TREND = "<svg viewBox='0 0 24 24' width='12' height='12' aria-hidden='true'><path d='M16 7h6v6' fill='none' stroke='#788c5d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/><path d='m22 7l-8.5 8.5l-5-5L2 17' fill='none' stroke='#788c5d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg>";
  var DISPLAY = "font-family:var(--pg-font-head,Poppins,Arial,sans-serif);";
  var BODY = "font-family:var(--pg-font-body,Lora,Georgia,serif);";
  function rankRow(place, name, score, frac, color, n) {
    return "<div style='display:flex;align-items:center;gap:8px;border-top:1px solid #262420;padding:8px 0'>" +
      "<span style='" + DISPLAY + "width:16px;font-size:11px;font-weight:600;color:#8f8d84;flex:none'>" + place + "</span>" +
      "<span style='width:14px;height:14px;border-radius:50%;background:" + color + ";flex:none;opacity:0.85'></span>" +
      "<span style='" + DISPLAY + "flex:1;font-size:12px;font-weight:500;color:#faf9f5'>" + name + "</span>" +
      "<span style='width:110px;display:flex;align-items:center;gap:8px'>" +
      "<span class='tl-rank-" + n + "' style='position:relative;width:80px;height:8px;flex:none'></span>" +
      "<span style='" + DISPLAY + "font-size:11px;color:#8f8d84;width:30px;text-align:right'>" + score + "</span></span></div>";
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
    name: "Navbar Active",
    category: "Navbar",
    style: "tab",
    note: "A real navbar: the active underline crawls to whichever link you click",
    box: {
      width: 340, height: 56,
      html: "<div style='display:flex;align-items:center;height:100%;padding:0 16px;gap:14px'>" +
            "<span style='width:10px;height:10px;border-radius:3px;background:#d97757;flex:none'></span>" +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:600;color:#faf9f5;flex:none'>Acme</span>" +
            "<div class='tl-nav-tabs' style='flex:1;align-self:stretch;display:flex;flex-direction:column;justify-content:center'></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "tab", el: ".tl-nav-tabs",
        options: { labels: ["Product", "Docs", "Pricing", "Blog"], durationMs: 700, restMs: 1400, color: "#d97757" } }
    ]
  },

  {
    name: "Hero Flourish",
    category: "Hero",
    style: "orbit",
    note: "A hero headline with an ambient flourish tracing itself beneath it, forever",
    box: {
      width: 340, height: 172,
      html: "<div style='padding:20px 22px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<span style='" + DISPLAY + "align-self:flex-start;font-size:10px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#d97757;border:1px solid #3f3d34;border-radius:999px;padding:3px 10px'>New &middot; v2.0</span>" +
            "<div style='" + DISPLAY + "font-size:21px;font-weight:600;line-height:1.25;color:#faf9f5'>Ship interfaces<br>that <em style='font-style:normal;color:#d97757'>move</em></div>" +
            "<div class='tl-flourish' style='position:relative;height:12px;width:196px;margin:-4px 0 0 2px'></div>" +
            "<div style='" + BODY + "font-size:12px;color:#b0aea5'>Nineteen path-driven styles. Zero dependencies.</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "orbit", el: ".tl-flourish",
        options: { d: { shape: "underline", args: [190, 6] }, durationMs: 2600, segmentFraction: 0.3, strokeWidth: 2.5, color: "#d97757", guideOpacity: 0.3 } }
    ]
  },

  {
    name: "Login Field",
    category: "Login",
    style: "input",
    note: "A sign-in card: the email field focuses, the address types itself in, the line hands over to mint",
    box: {
      width: 300, height: 210,
      html: "<div style='padding:20px;display:flex;flex-direction:column;gap:12px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:15px;font-weight:600;color:#faf9f5'>Welcome back</div>" +
            "<div class='tl-field' style='position:relative;height:52px;background:#262420;border:1px solid #33312c;border-radius:8px'></div>" +
            "<div style='position:relative;height:44px;background:#262420;border:1px solid #33312c;border-radius:8px;padding:12px;font-size:12px;color:#8f8d84;" + DISPLAY + "'>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</div>" +
            "<div style='" + DISPLAY + "margin-top:auto;height:38px;display:flex;align-items:center;justify-content:center;background:#d97757;border-radius:8px;font-size:13px;font-weight:500;color:#141413'>Sign in</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "input", el: ".tl-field",
        options: { label: "Email", value: "hi@studio.co", durationMs: 360, restMs: 1500, color: "#6a9bcc" } }
    ]
  },

  {
    name: "Stat Ring",
    category: "Stats",
    style: "progress",
    note: "A dashboard stat card: the metric's donut fills along a 270-degree arc, head dot riding the frontier",
    box: {
      width: 300, height: 120,
      html: "<div style='padding:18px 20px;display:flex;align-items:center;justify-content:space-between;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;flex-direction:column;gap:6px'>" +
            "<span style='" + DISPLAY + "font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#b0aea5'>Weekly active</span>" +
            "<span style='" + DISPLAY + "font-size:26px;font-weight:600;color:#faf9f5'>12,480</span>" +
            "<span style='" + DISPLAY + "display:flex;align-items:center;gap:4px;font-size:11px;font-weight:500;color:#788c5d'>" + TREND + "8.2% vs last week</span>" +
            "</div>" +
            "<div class='tl-ring' style='position:relative;width:72px;height:72px;flex:none'></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-ring",
        options: { d: "M50,10 A40,40 0 1 1 10,50", viewBox: "0 0 100 100", strokeWidth: 6, headRadius: 4, color: "#788c5d", guideOpacity: 0.25 } }
    ]
  },

  {
    name: "FAQ Reveal",
    category: "FAQ",
    style: "accordion",
    note: "A support question: the header stays put while the answer grows and the edge draws down",
    box: {
      width: 320, height: 194,
      styleCss: CARD,
      html: "<div style='padding:14px 16px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box'>" +
            "<div style='" + DISPLAY + "font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#b0aea5'>Support</div>" +
            "<div class='tl-acc' style='position:relative;background:#262420;border:1px solid #33312c;border-radius:8px'>" +
            "<div style='height:44px;display:flex;align-items:center;padding:0 14px'><span style='" + DISPLAY + "font-size:13px;font-weight:500;color:#faf9f5'>Does it work without a bundler?</span></div>" +
            "<div style='padding:2px 14px 12px;font-size:12px;line-height:1.55;color:#b0aea5;" + BODY + "'>Yes &mdash; every style is a plain script tag.</div>" +
            "</div>" +
            "<div style='margin-top:auto;display:flex;align-items:center;justify-content:space-between;background:#262420;border:1px solid #33312c;border-radius:8px;height:44px;padding:0 14px'>" +
            "<span style='" + DISPLAY + "font-size:13px;font-weight:500;color:#faf9f5'>Can I restyle the trail?</span>" + CHEVD + "</div>" +
            "</div>"
    },
    parts: [
      { style: "accordion", el: ".tl-acc",
        options: { durationMs: 420, restMs: 1500, closedHeight: 44, color: "#6a9bcc" } }
    ]
  },

  {
    name: "Feedback Typing",
    category: "Feedback",
    style: "typing",
    note: "A support chat: your question sent, the agent online and already typing back",
    box: {
      width: 320, height: 226,
      html: "<div style='display:flex;flex-direction:column;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid #33312c'>" +
            "<span style='width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#d97757,#6a9bcc);flex:none'></span>" +
            "<span style='" + DISPLAY + "font-size:12px;font-weight:600;color:#faf9f5'>Support &middot; Anshul</span>" +
            "<span class='tl-online' style='position:relative;width:9px;height:9px;border-radius:50%;background:#788c5d;flex:none'></span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10px;color:#8f8d84'>now</span></div>" +
            "<div style='flex:1;padding:12px 16px;display:flex;flex-direction:column;gap:8px'>" +
            "<div style='align-self:flex-end;max-width:85%;background:#d97757;border-radius:12px 12px 4px 12px;padding:8px 12px;font-size:11.5px;line-height:1.45;color:#141413;" + BODY + "'>Hey &mdash; does the trail option work on letters too?</div>" +
            "<div style='display:flex;align-items:flex-end;gap:7px'>" +
            "<span style='width:20px;height:20px;border-radius:50%;background:#3f3d34;flex:none'></span>" +
            "<div class='tl-typing' style='position:relative;align-self:flex-start;width:60px;height:15px;box-sizing:content-box;background:#262420;border:1px solid #33312c;border-radius:12px 12px 12px 4px;padding:10px 14px'></div>" +
            "</div></div>" +
            "<div style='display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid #33312c'>" +
            "<span style='flex:1;height:32px;display:flex;align-items:center;background:#262420;border:1px solid #33312c;border-radius:999px;padding:0 12px;box-sizing:border-box;font-size:11px;color:#6a655c;" + BODY + "'>Write a message&hellip;</span>" +
            "<span style='width:30px;height:30px;border-radius:50%;background:#d97757;display:flex;align-items:center;justify-content:center;flex:none'>" + SEND + "</span>" +
            "</div></div>",
      styleCss: CARD
    },
    parts: [
      { style: "typing", el: ".tl-typing",
        options: { dots: 3, durationMs: 1000, staggerMs: 180, dotRadius: 5, color: "#d97757" } },
      { style: "pulse", el: ".tl-online",
        options: { rings: 1, durationMs: 2000, strokeWidth: 4, maxOpacity: 0.4, color: "#788c5d" } }
    ]
  },

  {
    name: "Cookie Consent",
    category: "Cookie Banner",
    style: "toast",
    note: "A consent banner that drops in, counts down to auto-dismiss, then leaves",
    box: {
      width: 320, height: 108,
      html: "<div style='display:flex;flex-direction:column;gap:7px;height:100%;padding:12px 14px;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:center;gap:9px'>" +
            COOKIE +
            "<span style='" + DISPLAY + "flex:1;font-size:11.5px;font-weight:600;color:#faf9f5'>We value your privacy</span>" +
            "<span style='" + DISPLAY + "font-size:10px;color:#8f8d84'>Learn more</span></div>" +
            "<div style='" + BODY + "font-size:10.5px;line-height:1.45;color:#8f8d84'>Cookies help us serve the demo. No tracking, no ads \u2014 just preferences.</div>" +
            "<div style='display:flex;gap:6px;justify-content:flex-end;margin-top:auto'>" +
            "<span style='display:flex;height:26px;padding:0 10px;align-items:center;border:1px solid #3f3d34;border-radius:6px;font-size:10.5px;font-weight:500;color:#b0aea5;" + DISPLAY + "'>Manage</span>" +
            "<span style='display:flex;height:26px;padding:0 12px;align-items:center;background:#d97757;border-radius:6px;font-size:10.5px;font-weight:600;color:#141413;" + DISPLAY + "'>Accept</span></div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "toast",
        options: { enter: "drop", thickness: 3, durationMs: 4200, restMs: 1600, color: "#d97757" } }
    ]
  },

  {
    name: "CTA Fill",
    category: "CTA",
    style: "button",
    note: "A pricing card's action: the fill sweeps while the upgrade 'processes', then drains on success",
    box: {
      width: 280, height: 200,
      html: "<div style='padding:18px 20px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline;gap:8px'>" +
            "<span style='" + DISPLAY + "font-size:15px;font-weight:600;color:#faf9f5'>Pro</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#d97757'>Popular</span></div>" +
            "<div style='" + DISPLAY + "font-size:24px;font-weight:600;color:#faf9f5'>$12<span style='font-size:12px;font-weight:400;color:#b0aea5'>/mo</span></div>" +
            "<div style='" + BODY + "font-size:11.5px;line-height:1.6;color:#b0aea5'>Unlimited paths &middot; React adapter<br>Commercial license &middot; Priority fixes</div>" +
            "<div class='tl-cta' style='margin-top:auto;position:relative;height:40px;display:flex;align-items:center;justify-content:center;background:#262420;border:1px solid #33312c;border-radius:8px;font-size:13px;font-weight:500;color:#faf9f5;" + DISPLAY + "'>Start free trial</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "button", el: ".tl-cta",
        options: { variant: "fill", durationMs: 1100, color: "#788c5d" } }
    ]
  },
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
        options: { d: { shape: "underline", args: [200, 4] }, segments: 3, segmentFraction: 0.1, durationMs: 2200, strokeWidth: 2.5, color: "#788c5d", guideOpacity: 0.5 } }
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
            "<div style='" + DISPLAY + "position:absolute;top:46px;left:134px;font-size:11px;color:#8f8d84'>Overview &middot; 4 projects synced</div>" +
            "<div style='position:absolute;top:68px;left:134px;right:14px;height:56px;background:#1c1b19;border:1px solid #33312c;border-radius:8px'></div>" +
            "<div style='position:absolute;top:132px;left:134px;right:14px;height:8px;background:#262420;border-radius:4px'></div>" +
            "<div style='position:absolute;top:148px;left:134px;width:120px;height:8px;background:#262420;border-radius:4px'></div>" +
            "<div style='position:absolute;top:164px;left:134px;width:88px;height:8px;background:#262420;border-radius:4px'></div>" +
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
    name: "Leaderboard Top",
    category: "Leaderboard",
    style: "progress",
    note: "Ranked rows whose score bars hold static fills \u2014 standings, not a demo loop",
    box: {
      width: 320, height: 190,
      html: "<div style='padding:14px 18px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box'>" +
            "<div style='display:flex;align-items:baseline;gap:8px'>" +
            "<span style='" + DISPLAY + "font-size:14px;font-weight:600;color:#faf9f5'>Top contributors</span>" +
            "<span style='" + DISPLAY + "font-size:10.5px;color:#8f8d84'>this month</span>" +
            "<span style='" + DISPLAY + "margin-left:auto;font-size:10.5px;color:#d97757'>View all</span></div>" +
            rankRow("1", "mara.l", "9,420", 0.92, "#d97757", 1) +
            rankRow("2", "t.omkar", "7,880", 0.74, "#6a9bcc", 2) +
            rankRow("3", "j.wu", "6,130", 0.58, "#788c5d", 3) +
            "<div style='" + DISPLAY + "margin-top:auto;font-size:10px;color:#8f8d84'>Scores update nightly</div>" +
            "</div>",
      styleCss: CARD
    },
    parts: [
      { style: "progress", el: ".tl-rank-1", options: { d: { shape: "underline", args: [110, 3] }, strokeWidth: 3, headRadius: 2.5, color: "#d97757", guideOpacity: 0.3, to: 0.92 } },
      { style: "progress", el: ".tl-rank-2", options: { d: { shape: "underline", args: [110, 3] }, strokeWidth: 3, headRadius: 2.5, color: "#6a9bcc", guideOpacity: 0.3, to: 0.74 } },
      { style: "progress", el: ".tl-rank-3", options: { d: { shape: "underline", args: [110, 3] }, strokeWidth: 3, headRadius: 2.5, color: "#788c5d", guideOpacity: 0.3, to: 0.58 } }
    ]
  },

  );
})(typeof window !== "undefined" ? window : this);
