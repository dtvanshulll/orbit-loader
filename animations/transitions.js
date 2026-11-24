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
      width: 150,
      height: 44,
      background: "#33312c",
      borderRadius: 8,
      content: "Save changes",
      fontSize: 14,
      color: "#faf9f5"
    },
    options: {
      radius: 8,
      durationMs: 1100,
      color: "#d97757"
    }
  },

  {
    name: "Toast Countdown",
    style: "toast",
    note: "The toast's remaining lifetime drains along its bottom edge. No number needed.",
    box: {
      width: 220,
      height: 52,
      background: "#262420",
      borderRadius: 8,
      content: "File uploaded",
      fontSize: 13,
      color: "#faf9f5",
      padding: "14px 16px"
    },
    options: {
      thickness: 3,
      durationMs: 3200,
      restMs: 1200,
      color: "#788c5d"
    }
  },

  {
    name: "Path Progress",
    style: "progress",
    note: "Determinate progress that traces any path: here a circle filling toward 100%",
    box: { width: 96, height: 96 },
    options: {
      d: { shape: "circle", args: [96] },
      viewBox: "0 0 96 96",
      strokeWidth: 2.5,
      headRadius: 3,
      color: "#6a9bcc",
      guideOpacity: 0.3
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
    box: { width: 150, height: 44, background: "#33312c", borderRadius: 8, content: "Save changes", fontSize: 14, color: "#faf9f5" },
    options: {
      variant: "fill",
      durationMs: 1100,
      color: "#788c5d"
    }
  },

  {
    name: "Button Ripple",
    style: "button",
    note: "A circle ripples out from the press point. Click the button to feel it.",
    box: { width: 150, height: 44, background: "#33312c", borderRadius: 8, content: "Press me", fontSize: 14, color: "#faf9f5" },
    options: {
      variant: "ripple",
      durationMs: 1100,
      color: "#d97757"
    }
  },

  {
    name: "Toast Bar",
    style: "toast",
    note: "An inset countdown bar with a faint track drops in and drains. Hovering pauses it.",
    box: { width: 220, height: 52, background: "#262420", borderRadius: 8, content: "File uploaded", fontSize: 13, color: "#faf9f5", padding: "14px 16px" },
    options: {
      variant: "bar",
      enter: "drop",
      durationMs: 3200,
      restMs: 1200,
      color: "#788c5d"
    }
  },

  {
    name: "Toast Ring",
    style: "toast",
    note: "A ring in the corner drains clockwise while the toast pops in",
    box: { width: 220, height: 52, background: "#262420", borderRadius: 8, content: "Scheduled for 9:00", fontSize: 13, color: "#faf9f5", padding: "14px 16px" },
    options: {
      variant: "ring",
      enter: "pop",
      durationMs: 3200,
      restMs: 1200,
      color: "#6a9bcc"
    }
  },

  {
    name: "Progress Ring",
    style: "progress",
    note: "A circular ring fills toward 100% with the head dot riding the frontier",
    box: { width: 96, height: 96 },
    options: {
      variant: "ring",
      size: 64,
      strokeWidth: 3,
      headRadius: 3.5,
      color: "#d97757"
    }
  },

  {
    name: "Progress Steps",
    style: "progress",
    note: "Fill quantizes to four steps, and each new step pops the head dot",
    box: { width: 220, height: 24 },
    options: {
      variant: "steps",
      steps: 4,
      d: "M0,3 L220,3",
      viewBox: "0 0 220 6",
      strokeWidth: 4,
      color: "#788c5d"
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
  }
  );
})(typeof window !== "undefined" ? window : this);
