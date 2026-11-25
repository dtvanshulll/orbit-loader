/*!
 * TraceLoop — TRANSITIONS ANIMATION CONFIGS (playground data).
 *
 * One-shot UI transitions: tab, page, button, toast, progress.
 *
 * Part of the old animations.js, split one playground section per file:
 * add an animation by adding a block to the matching file. Each file
 * pushes onto the shared window.ORBIT_ANIMATIONS list in load order.
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];
  list.push(
  {
    name: "Tab Crawl",
    style: "tab",
    note: "The tab underline crawls to the tab you clicked, stretchy and alive",
    box: { width: 220, height: 48, color: "#faf9f5", padding: "12px 8px" },
    options: {
      labels: ["Home", "Files", "Shared", "Settings"],
      durationMs: 700,
      restMs: 1500,
      color: "#d97757"
    }
  },

  {
    name: "Page Traverse",
    style: "page",
    note: "The top progress bar trickles while a page loads, then sweeps done and fades",
    box: { width: 220, height: 110, background: "#262420", borderRadius: 8 },
    options: {
      thickness: 3,
      durationMs: 2600,
      restMs: 1400,
      color: "#6a9bcc"
    }
  },

  {
    name: "Button Trace",
    style: "button",
    note: "While the action pends, the button's own border is the progress track; it lights green on success",
    box: {
      width: 158, height: 44, background: "#262420",
      border: "1px solid #33312c", borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      fontSize: 13, fontWeight: 500, color: "#faf9f5",
      html: "<span style='display:inline-flex;align-items:center;gap:8px'><svg viewBox='0 0 24 24' width='15' height='15' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex:none'><path d='M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10.2z'/><path d='M17 21v-8H7v8'/><path d='M7 3v5h8'/></svg><span>Save changes</span></span>"
    },
    options: { radius: 8, durationMs: 1100, color: "#d97757" }
  },

  {
    name: "Toast Countdown",
    style: "toast",
    note: "The toast's remaining lifetime drains along its bottom edge. No number needed.",
    box: {
      width: 240, height: 56, background: "#262420",
      border: "1px solid #33312c", borderRadius: 10,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      color: "#faf9f5", padding: "10px 14px 12px",
      html: "<span style='display:flex;align-items:center;gap:10px;width:100%'><svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' fill='none' stroke='#788c5d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex:none'><circle cx='12' cy='12' r='10'/><path d='m9 12 2 2 4-4'/></svg><span style='display:flex;flex-direction:column;gap:2px;flex:1;min-width:0'><span style='font-size:13px;font-weight:500;color:#faf9f5'>File uploaded</span><span style='font-size:11px;color:#b0aea5'>report.pdf \u00b7 2.4 MB</span></span><svg viewBox='0 0 24 24' width='14' height='14' aria-hidden='true' fill='none' stroke='#8f8d84' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex:none'><path d='M18 6 6 18'/><path d='m6 6 12 12'/></svg></span>"
    },
    options: { thickness: 3, durationMs: 3200, restMs: 1200, color: "#788c5d" }
  },

  {
    name: "Path Progress",
    style: "progress",
    note: "Determinate progress that traces any path: here a circle filling toward 100%",
    box: { width: 96, height: 96 },
    options: {
      d: { shape: "circle", args: [96] },
      viewBox: "0 0 96 96",
      strokeWidth: 2.5, headRadius: 3,
      color: "#6a9bcc", guideOpacity: 0.3
    }
  },

  {
    name: "Page Curtain",
    style: "page",
    note: "Two panels close from the corners like theater curtains, then part to reveal the page",
    box: { width: 220, height: 110, background: "#262420", borderRadius: 8 },
    options: {
      variant: "curtain",
      durationMs: 2600,
      restMs: 1400,
      color: "#6a9bcc"
    }
  },

  {
    name: "Page Iris",
    style: "page",
    note: "A circle wipes open from the center of the page and closes back to nothing",
    box: { width: 220, height: 110, background: "#262420", borderRadius: 8 },
    options: {
      variant: "iris",
      durationMs: 2600,
      restMs: 1400,
      color: "#d97757"
    }
  },

  {
    name: "Page Slide",
    style: "page",
    note: "One panel sweeps fully across the page and off the far edge",
    box: { width: 220, height: 110, background: "#262420", borderRadius: 8 },
    options: {
      variant: "slide",
      durationMs: 2600,
      restMs: 1400,
      color: "#788c5d"
    }
  },

  {
    name: "Page Bars",
    style: "page",
    note: "Five vertical bars stagger down in sequence, then stagger away",
    box: { width: 220, height: 110, background: "#262420", borderRadius: 8 },
    options: {
      variant: "bars",
      durationMs: 2600,
      restMs: 1400,
      color: "#6a9bcc"
    }
  },

  {
    name: "Button Fill",
    style: "button",
    note: "A color fill sweeps across while the action runs, then drains away on success",
    box: {
      width: 158, height: 44, background: "#262420",
      border: "1px solid #33312c", borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      fontSize: 13, fontWeight: 500, color: "#faf9f5",
      html: "<span style='display:inline-flex;align-items:center;gap:8px'><svg viewBox='0 0 24 24' width='15' height='15' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex:none'><circle cx='12' cy='12' r='10'/><path d='m9 12 2 2 4-4'/></svg><span>Upgrade plan</span></span>"
    },
    options: { variant: "fill", durationMs: 1100, color: "#788c5d" }
  },

  {
    name: "Button Ripple",
    style: "button",
    note: "A circle ripples out from the press point. Click the button to feel it.",
    box: {
      width: 158, height: 44, background: "#262420",
      border: "1px solid #33312c", borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      fontSize: 13, fontWeight: 500, color: "#faf9f5",
      html: "<span style='display:inline-flex;align-items:center;gap:8px'><svg viewBox='0 0 24 24' width='15' height='15' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex:none'><path d='M5 12h14'/><path d='m12 5 7 7-7 7'/></svg><span>Press me</span></span>"
    },
    options: { variant: "ripple", durationMs: 1100, color: "#d97757" }
  },

  {
    name: "Toast Bar",
    style: "toast",
    note: "An inset countdown bar with a faint track drops in and drains. Hovering pauses it.",
    box: {
      width: 240, height: 56, background: "#262420",
      border: "1px solid #33312c", borderRadius: 10,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      color: "#faf9f5", padding: "10px 14px 12px",
      html: "<span style='display:flex;align-items:center;gap:10px;width:100%'><svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' fill='none' stroke='#788c5d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex:none'><circle cx='12' cy='12' r='10'/><path d='m9 12 2 2 4-4'/></svg><span style='display:flex;flex-direction:column;gap:2px;flex:1;min-width:0'><span style='font-size:13px;font-weight:500;color:#faf9f5'>File uploaded</span><span style='font-size:11px;color:#b0aea5'>report.pdf \u00b7 2.4 MB</span></span><svg viewBox='0 0 24 24' width='14' height='14' aria-hidden='true' fill='none' stroke='#8f8d84' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex:none'><path d='M18 6 6 18'/><path d='m6 6 12 12'/></svg></span>"
    },
    options: { variant: "bar", enter: "drop", durationMs: 3200, restMs: 1200, color: "#788c5d" }
  },

  {
    name: "Toast Ring",
    style: "toast",
    note: "A ring in the corner drains clockwise while the toast pops in",
    box: {
      width: 240, height: 56, background: "#262420",
      border: "1px solid #33312c", borderRadius: 10,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      color: "#faf9f5", padding: "10px 40px 12px 14px",
      html: "<span style='display:flex;align-items:center;gap:10px;width:100%'><svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' fill='none' stroke='#6a9bcc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex:none'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg><span style='display:flex;flex-direction:column;gap:2px;flex:1;min-width:0'><span style='font-size:13px;font-weight:500;color:#faf9f5'>Scheduled for 9:00</span><span style='font-size:11px;color:#b0aea5'>Calendar invite sent</span></span></span>"
    },
    options: { variant: "ring", enter: "pop", durationMs: 3200, restMs: 1200, color: "#6a9bcc" }
  },

  {
    name: "Progress Ring",
    style: "progress",
    note: "A 270\u00b0 ring fills clockwise with the head dot riding the frontier \u2014 the open gap keeps track and fill distinct",
    box: { width: 92, height: 92 },
    options: {
      d: "M50,10 A40,40 0 1 1 10,50",
      viewBox: "0 0 100 100",
      strokeWidth: 5, headRadius: 4,
      color: "#d97757", guideOpacity: 0.35
    }
  },

  {
    name: "Progress Steps",
    style: "progress",
    note: "Fill quantizes to four steps \u2014 tick marks sit on the track and the head pops at each one",
    box: { width: 240, height: 40 },
    options: {
      d: { shape: "underline", args: [240] },
      strokeWidth: 3, headRadius: 3.5, steps: 4,
      color: "#788c5d", guideOpacity: 0.3
    }
  },

  {
    name: "Progress Indeterminate",
    style: "progress",
    note: "A chunk slides along the track forever: the honest bar for unknown ETAs",
    box: { width: 220, height: 24 },
    options: {
      variant: "indeterminate",
      d: "M0,3 L220,3",
      viewBox: "0 0 220 6",
      strokeWidth: 4,
      color: "#6a9bcc"
    }
  },

  {
    name: "Route Wipe",
    style: "route",
    note: "A cover panel sweeps across and the page swaps underneath at the moment of full cover — the one-shot behind routers",
    box: { width: 240, height: 150, background: "#262420", borderRadius: 8, border: "1px solid #33312c" },
    options: {
      variant: "wipe",
      direction: "left",
      durationMs: 340,
      restMs: 2200,
      items: [
        "<div style='height:100%;display:flex;flex-direction:column;gap:8px;padding:16px'><div style='font:600 13px/1.2 Poppins,Arial,sans-serif;color:#faf9f5'>Workspace</div><div style='height:8px;width:70%;background:#33312c;border-radius:4px'></div><div style='height:8px;width:52%;background:#33312c;border-radius:4px'></div><div style='height:8px;width:63%;background:#33312c;border-radius:4px'></div><div style='margin-top:auto;font:400 11px/1.4 Lora,Georgia,serif;color:#8f8d84'>3 members · synced just now</div></div>",
        "<div style='height:100%;display:flex;flex-direction:column;gap:8px;padding:16px'><div style='font:600 13px/1.2 Poppins,Arial,sans-serif;color:#faf9f5'>Invitations</div><div style='display:flex;align-items:center;gap:8px'><div style='width:22px;height:22px;border-radius:50%;background:#d97757'></div><div style='height:8px;flex:1;background:#33312c;border-radius:4px'></div></div><div style='display:flex;align-items:center;gap:8px'><div style='width:22px;height:22px;border-radius:50%;background:#6a9bcc'></div><div style='height:8px;flex:1;background:#33312c;border-radius:4px'></div></div><div style='margin-top:auto;font:400 11px/1.4 Lora,Georgia,serif;color:#8f8d84'>2 pending invites</div></div>",
        "<div style='height:100%;display:flex;flex-direction:column;gap:8px;padding:16px'><div style='font:600 13px/1.2 Poppins,Arial,sans-serif;color:#faf9f5'>Activity</div><div style='height:8px;width:84%;background:#33312c;border-radius:4px'></div><div style='height:8px;width:41%;background:#33312c;border-radius:4px'></div><div style='margin-top:auto;font:400 11px/1.4 Lora,Georgia,serif;color:#788c5d'>All caught up</div></div>"
      ]
    }
  },

  {
    name: "Route Slide",
    style: "route",
    note: "The old page slides out toward the direction while the new one enters from the far side — paging forward and back",
    box: { width: 240, height: 150, background: "#262420", borderRadius: 8, border: "1px solid #33312c" },
    options: {
      variant: "slide",
      direction: "left",
      exitMs: 170,
      durationMs: 300,
      restMs: 2200,
      items: [
        "<div style='height:100%;display:flex;flex-direction:column;gap:8px;padding:16px'><div style='font:600 13px/1.2 Poppins,Arial,sans-serif;color:#6a9bcc'>Step 1 of 3</div><div style='height:8px;width:76%;background:#33312c;border-radius:4px'></div><div style='height:8px;width:58%;background:#33312c;border-radius:4px'></div><div style='margin-top:auto;font:400 11px/1.4 Lora,Georgia,serif;color:#8f8d84'>Account details</div></div>",
        "<div style='height:100%;display:flex;flex-direction:column;gap:8px;padding:16px'><div style='font:600 13px/1.2 Poppins,Arial,sans-serif;color:#6a9bcc'>Step 2 of 3</div><div style='height:8px;width:64%;background:#33312c;border-radius:4px'></div><div style='height:8px;width:71%;background:#33312c;border-radius:4px'></div><div style='margin-top:auto;font:400 11px/1.4 Lora,Georgia,serif;color:#8f8d84'>Preferences</div></div>",
        "<div style='height:100%;display:flex;flex-direction:column;gap:8px;padding:16px'><div style='font:600 13px/1.2 Poppins,Arial,sans-serif;color:#788c5d'>Step 3 of 3</div><div style='height:8px;width:48%;background:#33312c;border-radius:4px'></div><div style='margin-top:auto;font:400 11px/1.4 Lora,Georgia,serif;color:#8f8d84'>Review and finish</div></div>"
      ]
    }
  },

  {
    name: "PathWipe Wave Reveal",
    style: "pathwipe",
    note: "A shaped edge (a wave) sweeps across and unmasks content that is already there — reveal and conceal, no content swap",
    box: { width: 240, height: 150, background: "#262420", borderRadius: 8, border: "1px solid #33312c" },
    options: {
      shape: "wave",
      direction: "right",
      durationMs: 700,
      detail: 4,
      edgeColor: "#d97757",
      restMs: 2200
    }
  },

  {
    name: "PathWipe Zigzag",
    style: "pathwipe",
    note: "A zigzag edge sweeps down the panel — same mechanism, different profile",
    box: { width: 240, height: 150, background: "#262420", borderRadius: 8, border: "1px solid #33312c" },
    options: {
      shape: "zigzag",
      direction: "down",
      durationMs: 800,
      detail: 6,
      edgeColor: "#6a9bcc",
      restMs: 2200
    }
  }
  );
})(typeof window !== "undefined" ? window : this);
