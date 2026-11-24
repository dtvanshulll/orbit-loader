# 001 — Document the dropdown `placement: "bottom"` option

- **Status**: TODO
- **Commit**: 644f4f4
- **Severity**: MEDIUM
- **Category**: docs drift
- **Estimated scope**: 1 file, 1 table row

## Problem

`docs/STYLES.md:338` documents the DropdownLoader `placement` option as
`'auto' | "top"` only:

```
| `placement` | `'auto'` | `"top"` forces the menu to open upward (footer selectors near a card's bottom edge) |
```

But commit `501d070` added `"bottom"` to the source
(`src/styles/dropdown-loader.js`, `flipUp = placement === "top" ||
(placement !== "bottom" && ph > roomBelow)`) and to `src/index.d.ts`.
Three Navbar/Sidebar demos use it. The consumer docs are now behind the
source — a reader of STYLES.md cannot know `"bottom"` exists.

## Target

Replace the row at `docs/STYLES.md:338` with:

```
| `placement` | `'auto'` | `"top"` forces the menu to open upward (footer selectors near a card's bottom edge); `"bottom"` forces it downward (navbar rows near a card's top edge). Default `auto` flips by viewport room. |
```

## Repo conventions to follow

STYLES.md documents every option in a per-style table with backticked
values and a one-clause rationale — see the `placement` row itself and
neighboring rows in the Dropdown section. Match that voice; do not add
prose paragraphs.

## Verification

`grep -n '"bottom"' docs/STYLES.md` returns the updated row. No build
needed (docs only).
