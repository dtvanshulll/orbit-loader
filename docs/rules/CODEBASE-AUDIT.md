# UI Library — Comprehensive Codebase Audit Prompt

> **Standing rule.** This file is registered in `AGENTS.md` as an
> always-follow rule. Run this audit before any new development phase,
> whenever the roadmap is in doubt, and whenever this file or the
> codebase has changed since the last audit. The audit report it
> produces is the source of truth for all future component
> development.

**Role:** Act as a senior UI library architect, design-system engineer, frontend developer, and code auditor.

## Objective

I am developing my own UI component library. Some components and categories are already implemented.

Your task is to perform a **complete audit of the existing codebase** to understand exactly what has been built so far, what component types exist, their quality, completeness, consistency, and what is still missing.

**IMPORTANT:**
- Do NOT start building components.
- Do NOT modify, delete, rename, or refactor existing files.
- Do NOT assume the library is incomplete based on common libraries.
- Inspect the actual source code and verify everything.
- This is an audit-only task.

---

## Phase 1 — Scan the Entire Codebase

Inspect the entire project structure, including:

- Components
- UI elements
- Primitive components
- Composite components
- Layout components
- Form components
- Navigation components
- Data display components
- Feedback components
- Overlay components
- Utility components
- Hooks
- Styles
- Animations
- Theme system
- Variants
- Design tokens
- Types/interfaces
- Documentation
- Examples
- Tests
- Exports and index files

Identify the actual component implementation files, not just component names mentioned in documentation.

Exclude unrelated dependencies, build output, generated files, and vendor folders from the audit unless they affect the library architecture.

---

## Phase 2 — Create a Complete Component Inventory

Create a detailed inventory of every existing component.

For each component, record:

| Field | Description |
|---|---|
| Component name | Actual exported name |
| Category | Main component category |
| Subcategory | Specific type |
| File path | Exact source file location |
| Status | Complete, Partial, Experimental, Broken |
| Type | Primitive, Composite, Wrapper, Utility |
| Variants | Available styles or variations |
| Props | Important props and configuration |
| Dependencies | Components it depends on |
| Accessibility | Accessibility implementation status |
| Responsive | Mobile/tablet/desktop support |
| Documentation | Documented or undocumented |
| Tests | Tested, partially tested, or untested |
| Notes | Issues, limitations, missing features |

Verify the status by inspecting the actual implementation.

Do not mark a component complete simply because a file exists.

---

## Phase 3 — Categorize the Existing Components

Group all discovered components into a hierarchical category structure.

Use categories such as the following as a starting point, but do not restrict the audit to them.

### 1. Foundations
- Colors
- Typography
- Spacing
- Shadows
- Borders
- Radius
- Icons
- Tokens
- Theme utilities

### 2. Layout
- Container
- Stack
- Flex
- Grid
- Divider
- Spacer
- Aspect ratio
- Centering

### 3. Buttons & Actions
- Button
- Icon button
- Button group
- Toggle button
- Split button
- Floating action button

### 4. Forms & Inputs
- Text input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Slider
- Date input
- File input
- Form validation
- Input groups

### 5. Navigation
- Navbar
- Sidebar
- Tabs
- Breadcrumbs
- Pagination
- Menu
- Dropdown menu
- Navigation rail
- Stepper

### 6. Data Display
- Table
- Data grid
- List
- Card
- Badge
- Avatar
- Tooltip
- Tag
- Statistic
- Timeline
- Tree view

### 7. Feedback & Status
- Alert
- Toast
- Notification
- Progress bar
- Progress circle
- Skeleton
- Loading indicator
- Empty state
- Error state

### 8. Overlay & Popup
- Modal
- Dialog
- Drawer
- Popover
- Tooltip
- Dropdown
- Context menu
- Bottom sheet

### 9. Media
- Image
- Image gallery
- Video
- Audio player
- Carousel
- Lightbox
- Media preview

### 10. Date & Time
- Calendar
- Date picker
- Date range picker
- Time picker
- Clock

### 11. Charts & Visualization
- Charts
- Graphs
- Sparkline
- Gauges
- Data visualization elements

### 12. Advanced Interaction
- Drag and drop
- Sortable list
- Resizable panels
- Split panels
- Command palette
- Gesture interactions

### 13. Utilities & Specialized Components
- Clipboard
- Keyboard shortcuts
- Scroll utilities
- Focus management
- Portal
- Virtualization
- Other specialized components

Add other categories or subcategories if the actual codebase contains them or if the library architecture warrants them.

---

## Phase 4 — Audit Component Quality

Evaluate every existing component for:

- Code quality
- Reusability
- API design
- Naming consistency
- Prop consistency
- Variant consistency
- Styling consistency
- Responsive behavior
- Accessibility
- Keyboard support
- State management
- Error handling
- Performance
- Unnecessary dependencies
- Duplication
- Maintainability
- Compatibility with the library's existing architecture

Identify:

- Duplicate components
- Components that perform the same function
- Components that should be merged (recommend only)
- Components with inconsistent APIs
- Components that are actually wrappers around another library
- Components that are only visual mockups
- Components missing important functionality
- Components with broken or incomplete implementation

Do not make changes.

---

## Phase 5 — Determine Missing Components and Categories

Compare the existing verified inventory with a comprehensive modern UI library component ecosystem.

Identify:

1. Completely missing component categories.
2. Missing individual components within existing categories.
3. Existing components that are only partially implemented.
4. Components that should be improved before adding new ones.
5. Components that are optional or niche and can be deferred.

Avoid suggesting components that already exist under a different name.

For every missing component, verify that it is genuinely absent from the codebase before listing it.

---

## Phase 6 — Prioritize the Remaining Work

Organize the missing components into these priorities:

### Priority 1 — Essential
Components expected in a core reusable UI library.

### Priority 2 — Important
Common components needed for a complete library.

### Priority 3 — Advanced
Complex components, advanced interactions, and specialized functionality.

### Priority 4 — Specialized
Rare, niche, or industry-specific components.

Explain the reason for each priority.

---

## Phase 7 — Create a Component Development Roadmap

Create a roadmap of all remaining components grouped by category.

The roadmap should make it possible to build the library progressively, **one category at a time**, without losing track of what has already been implemented.

Use a checklist format:

- [x] Existing and verified component
- [~] Partially implemented
- [ ] Missing
- [!] Needs repair or audit attention

Each component must appear only once in the roadmap, under its most appropriate primary category.

---

## Phase 8 — Identify Architecture Rules for Future Development

Inspect the existing code and determine the actual rules new components should follow, including:

- Framework and language
- File and folder structure
- Component naming conventions
- Export patterns
- Styling architecture
- CSS conventions
- Design tokens
- Theme integration
- Variant system
- Props patterns
- TypeScript rules
- Dependencies
- Accessibility approach
- Testing approach
- Documentation approach

Derive these rules from the existing codebase.

Do not invent a new architecture or recommend changing the existing architecture during this audit unless there is a serious issue. Document the current architecture and any important problems separately.

---

## Phase 9 — Audit Report Format

Produce the final report in this exact structure:

### A. Executive Summary
- Overall library status
- Total components found
- Complete components
- Partial components
- Broken/experimental components
- Total categories
- Overall maturity assessment

### B. Project Architecture
- Framework
- Technologies
- Folder structure
- Styling system
- Theme system
- Export architecture
- Testing/documentation system

### C. Complete Component Inventory
List all discovered components, grouped by category, with file paths and status.

### D. Category Coverage
For every category:
- Total existing components
- Complete components
- Partial components
- Missing components
- Coverage assessment

### E. Existing Component Quality Issues
List real issues found with component/file references and severity:

- Critical
- High
- Medium
- Low

### F. Missing Components
Detailed list of verified missing components grouped by category.

### G. Development Priority Roadmap
Organize all missing components into:
- Priority 1: Essential
- Priority 2: Important
- Priority 3: Advanced
- Priority 4: Specialized

### H. Recommended Development Order
Give the exact order in which categories should be developed, explaining why this order makes sense and identifying dependencies.

### I. Category-by-Category Progress Tracker
Create a master checklist that will be used in future development sessions to prevent duplicate work.

### J. Recommended Next Category
Recommend exactly **one next category** to implement.

Explain:
- Why it should be next
- Components included in that category
- Dependencies
- Expected complexity
- What should be excluded from that category to prevent scope creep

Do not implement it yet.

### K. Audit Limitations
Clearly identify anything you could not verify, including components that could not be tested, missing dependencies, inaccessible files, or incomplete source code.

---

## Final Rules

1. Audit the entire codebase before concluding.
2. Base every finding on actual code inspection.
3. Never count the same component twice.
4. Do not confuse examples, demos, and actual library components.
5. Do not treat a component as complete based on its name alone.
6. Identify components that are aliases, wrappers, or variants.
7. Track category coverage accurately.
8. Preserve the existing architecture.
9. Do not modify any code or files.
10. Do not build any component in this task.
11. Be exhaustive and detailed.
12. The final report must serve as the source of truth for all future component development.

**The goal is to understand precisely what already exists, what is missing, and establish a verified roadmap so we can subsequently build the remaining component categories one at a time.**
