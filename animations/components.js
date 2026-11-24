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
    note: "The section grows while its left edge draws downward, so the eye follows the reveal",
    box: { width: 200, height: 120, background: "#262420", borderRadius: 8 },
    options: {
      durationMs: 420,
      restMs: 1500,
      color: "#788c5d"
    }
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
    box: { width: 200, height: 196, background: "#262420", borderRadius: 8, padding: "16px", color: "#6a9bcc" },
    options: {
      items: ["Small", "Medium", "Large"],
      trigger: "Size",
      durationMs: 320,
      restMs: 1400,
      color: "#6a9bcc"
    }
  },

  {
    name: "Input Focus",
    style: "input",
    note: "The underline draws as the label floats up; success hands the line to mint and draws a check",
    box: { width: 220, height: 56, background: "#262420", borderRadius: 8, padding: "14px 12px 12px", color: "#6a9bcc" },
    options: {
      label: "Email",
      durationMs: 360,
      restMs: 1500,
      color: "#6a9bcc"
    }
    }
,
  );
})(typeof window !== "undefined" ? window : this);
