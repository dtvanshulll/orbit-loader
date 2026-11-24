/*!
 * TraceLoop — COMPONENTS ANIMATION CONFIGS (playground data).
 *
 * Whole-component animations: search, modal, accordion, drawer, dropdown, input.
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
    name: "Search Bar",
    style: "search",
    note: "The field widens while its underline draws out from the left: open and close in one motion",
    box: { width: 260, height: 56, background: "#262420", borderRadius: 8, color: "#faf9f5" },
    options: {
      collapsedWidth: 44,
      expandedWidth: 260,
      durationMs: 450,
      restMs: 1400,
      color: "#6a9bcc"
    }
  },

  {
    name: "Modal Arrival",
    style: "modal",
    note: "The backdrop fades, the panel rises, and its border draws itself on arrival",
    box: { width: 220, height: 130, background: "#262420", borderRadius: 12, padding: "16px" },
    options: {
      radius: 12,
      durationMs: 480,
      restMs: 1600,
      color: "#d97757",
      backdropPosition: "absolute"
    }
  },

  {
    name: "Accordion Reveal",
    style: "accordion",
    note: "The header stays put while the body grows and the left edge draws downward, so the eye follows the reveal",
    box: {
      width: 240, background: "#262420",
      border: "1px solid #33312c", borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      color: "#788c5d",
      html: "<div style=\"height:48px;display:flex;align-items:center;justify-content:space-between;padding:0 14px\"><span style=\"font-size:13px;font-weight:500;color:#faf9f5\">Session details</span></div>" +
            "<div style=\"padding:2px 14px 14px;font-size:12px;line-height:1.55;color:#b0aea5\">Started 2:14 pm \u00b7 3 edits<br>Autosaved just now</div>"
    },
    options: { durationMs: 420, restMs: 1500, closedHeight: 48, color: "#788c5d" }
  },

  {
    name: "Drawer From Left",
    style: "drawer",
    note: "The panel slides in while its leading edge draws downward, and the eye rides the reveal",
    box: { position: "absolute", top: 16, bottom: 16, left: 16, width: 110, background: "#262420", borderRadius: "0 8px 8px 0", color: "#6a9bcc" },
    options: {
      side: "left",
      durationMs: 420,
      restMs: 1600,
      color: "#6a9bcc",
      backdropPosition: "absolute"
    }
  },

  {
    name: "Drawer From Right",
    style: "drawer",
    note: "Same reveal, mirrored: settings panels and carts usually live on this side",
    box: { position: "absolute", top: 16, bottom: 16, right: 16, width: 110, background: "#262420", borderRadius: "8px 0 0 8px", color: "#6a9bcc" },
    options: {
      side: "right",
      durationMs: 420,
      restMs: 1600,
      color: "#6a9bcc",
      backdropPosition: "absolute"
    }
  },

  {
    name: "Bottom Sheet",
    style: "drawer",
    note: "The sheet rises while its top edge draws across, finishing with a grab handle",
    box: { position: "absolute", left: 16, right: 16, bottom: 16, height: 64, background: "#262420", borderRadius: "12px 12px 0 0", color: "#788c5d" },
    options: {
      side: "bottom",
      durationMs: 440,
      restMs: 1600,
      color: "#788c5d",
      backdropPosition: "absolute"
    }
  },

  {
    name: "Dropdown Menu",
    style: "dropdown",
    note: "The menu drops while its border draws, items stagger in, and a check draws on the chosen row",
    box: {
      width: 210, height: 208, background: "#262420",
      border: "1px solid #33312c", borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      padding: "16px", color: "#6a9bcc"
    },
    options: {
      items: ["1080p \u00b7 Full HD", "720p \u00b7 HD", "480p \u00b7 SD", "Auto"],
      trigger: "Quality",
      durationMs: 320, restMs: 1400, color: "#6a9bcc"
    }
  },

  {
    name: "Input Focus",
    style: "input",
    note: "The underline draws as the label floats up, the value types itself in, then success hands the line to mint and draws a check",
    box: {
      width: 240, height: 56, background: "#262420",
      border: "1px solid #33312c", borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      padding: "14px 12px 12px", color: "#6a9bcc"
    },
    options: { label: "Email", value: "hi@traceloop.dev", durationMs: 360, restMs: 1500, color: "#6a9bcc" }
  },
  {
    name: "Input Search",
    style: "input",
    note: "Same field, different job: the underline takes the accent color and the value types a query",
    box: {
      width: 240, height: 56, background: "#262420",
      border: "1px solid #33312c", borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      padding: "14px 12px 12px", color: "#d97757"
    },
    options: { label: "Search docs", value: "orbit loader", durationMs: 360, restMs: 1500, color: "#d97757" }
  },
  {
    name: "Dropdown Actions",
    style: "dropdown",
    note: "An action menu instead of a picker \u2014 same border trace, different rhythm and color",
    box: {
      width: 190, height: 208, background: "#262420",
      border: "1px solid #33312c", borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      padding: "16px", color: "#d97757"
    },
    options: {
      items: ["Duplicate", "Rename", "Move", "Delete"],
      trigger: "Actions",
      durationMs: 320, restMs: 1400, color: "#d97757"
    }
  },
  {
    name: "Accordion FAQ",
    style: "accordion",
    note: "A question instead of a panel title \u2014 the body answers while the edge draws",
    box: {
      width: 240, background: "#262420",
      border: "1px solid #33312c", borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
      color: "#6a9bcc",
      html: "<div style=\"height:48px;display:flex;align-items:center;justify-content:space-between;padding:0 14px\"><span style=\"font-size:13px;font-weight:500;color:#faf9f5\">No bundler?</span></div>" +
            "<div style=\"padding:2px 14px 14px;font-size:12px;line-height:1.55;color:#b0aea5\">Yes \u2014 every style is a plain script tag. Load the UMD build and go.</div>"
    },
    options: { durationMs: 420, restMs: 1500, closedHeight: 48, color: "#6a9bcc" }
  }
);
})(typeof window !== "undefined" ? window : this);
