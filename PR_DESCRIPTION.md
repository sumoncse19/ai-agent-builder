## Summary

Complete overhaul of the AI Agent Builder from a buggy, monolithic React component into a polished, performant drag-and-drop interface. Fixed **10 bugs** (8 intentional + 2 additional), replaced all dropdown selects with a drag-and-drop builder using @dnd-kit, applied modern styling with Tailwind CSS v4, and split the 410-line monolith into 20+ focused components.

**DESIGN LINK** = _No Figma design was created for this submission._

**CV:** [`public/frontend_engineer_md_sumon_resume.pdf`](public/frontend_engineer_md_sumon_resume.pdf)

## Bugs Found & Fixed

### Bug 1: Direct State Mutation (`App.tsx:122-124`)
**Problem:** `handleLayerSelect` used `.push()` on the state array, then passed the same reference to `setSelectedLayers`. React compares by reference (`Object.is`), sees the same array, and **skips the re-render entirely**. Layers visually never appeared.
```js
// BEFORE (broken)
selectedLayers.push(layerId)
setSelectedLayers(selectedLayers)

// AFTER (fixed in useAgentBuilder.ts)
setSelectedLayers(prev => [...prev, layerId])
```

### Bug 2: Unnecessary `fetchAPI()` on Every Selection (`App.tsx:128, 138, 209`)
**Problem:** Every time a user selected a profile, skill, or layer, `fetchAPI()` was called. The fetch had a **random 1-3 second artificial delay**, replacing the entire UI with a loading spinner on every single interaction. The data is static — there's zero reason to re-fetch.
**Fix:** Removed all `fetchAPI()` calls from selection handlers. Data is fetched exactly once on mount in `useAgentData.ts`, with a `refetch` function exposed only for the manual reload button.

### Bug 3: Stale Closure in Analytics Heartbeat (`App.tsx:81-89`)
**Problem:** The analytics `useEffect` had an empty dependency array `[]` but referenced `agentName` inside the interval callback. The closure captured the initial value `''`, so the heartbeat **always** logged "unnamed agent" regardless of what the user typed.
**Fix:** Used `useRef` to track the current `agentName` value, synced via a separate `useEffect`. The interval reads `agentNameRef.current` which always reflects the latest value.

### Bug 4: Session Timer Re-renders Entire App (`App.tsx:59-66`)
**Problem:** `setSessionTime` fired every 1 second inside the monolithic 410-line component. Every tick triggered a **full re-render of the entire component tree** — all dropdowns, lists, saved agents, and every inline style object recreated.
**Fix:** Extracted `SessionTimer` into its own component inside `Header.tsx`. The 1-second state update now only re-renders the small timer display, leaving the rest of the tree untouched.

### Bug 5: Initial Loading State is `false` (`App.tsx:40`)
**Problem:** `loading` started as `false` but `fetchAPI()` was called on mount. Between the initial render and the point where `fetchAPI` set `loading = true`, the condition `!data && !loading && !error` was true, causing a **flash of "No data loaded"** before the loading indicator appeared.
**Fix:** Initialized `loading` to `true` in `useAgentData.ts` since data is always fetched on mount.

### Bug 6: Inline Style Objects Recreated Every Render (Throughout `App.tsx`)
**Problem:** Every `style={{...}}` expression created a new JavaScript object on each render. The monolithic component had dozens of these. Combined with the 1-second timer (Bug 4), this meant **dozens of new objects allocated and garbage collected every second**.
**Fix:** Replaced all inline styles with Tailwind CSS v4 utility classes. Class strings are primitive values and don't cause unnecessary object allocations.

### Bug 7: Duplicate `.find()` Calls (`App.tsx:275-277`)
**Problem:** `data.agentProfiles.find(p => p.id === selectedProfile)` was called **twice in adjacent lines** — once for `?.name` and once for `?.description`.
**Fix:** Single variable assignment + upgraded all `.find()` O(n) lookups to `Map.get()` O(1) lookups using pre-built Maps (`profileMap`, `skillMap`, `layerMap`) created in `useAgentData.ts`.

### Bug 8: Monolithic Component (~410 lines, single file)
**Problem:** Everything was in a single `App` component with zero component extraction. **Every state change** (including the 1-second timer) triggered a re-render of the entire tree. No memoization was possible because there were no child component boundaries.
**Fix:** Split into 20+ focused components across a proper directory structure with custom hooks for data fetching, persistence, and builder state management.

### Bug 9: Palette-to-Zone Drops Fail When Zone Has Items (Runtime Bug)
**Problem:** Dragging a palette item onto a drop zone that already contained items would silently fail. The `over` target resolved to a `SortableItem` inside the zone (not the zone itself), and `SortableItem` doesn't carry the zone's `type` in its data — so `overData?.type` was `undefined` and the drop was discarded.
**Fix:** When `dropType` is undefined, infer the zone type by checking which selected array (`selectedSkills` or `selectedLayers`) contains the `over.id`.

### Bug 10: Duplicate Agent Names Allowed (Validation Bug)
**Problem:** Users could save multiple agents with the same name, leading to confusing entries in the saved agents list with no way to distinguish them.
**Fix:** Added a case-insensitive duplicate name check in `saveAgent()` in `useAgentBuilder.ts`. If a name already exists, an error toast is shown and the save is blocked.

### Feature: Agent Update Support
**Problem:** After loading a saved agent and modifying its configuration, clicking Save would fail due to the duplicate name check — there was no way to update an existing agent.
**Fix:** Added `editingAgentId` state to `useAgentBuilder`. When an agent is loaded via "Load", the builder enters editing mode. The Save button changes to "Update" (amber color), and saving updates the existing agent in-place instead of creating a new one. The duplicate name check is scoped to exclude the agent being edited. Resetting the builder or deleting the loaded agent clears editing mode.

### Feature: Delete Confirmation Dialog
**Problem:** Clicking Delete or Clear All immediately destroyed data with no confirmation.
**Fix:** Created reusable `ConfirmDialog` component using native HTML `<dialog>` element. Both delete single agent and Clear All show a modal with blurred backdrop, warning icon, and Cancel/Confirm buttons. Closes on backdrop click and Escape key.

### UX: Drop Zone Focus During Drag
**Problem:** When dragging a palette item, users couldn't easily identify which canvas zone to target.
**Fix:** Matching drop zones now pulse with a violet dashed border, show "Drop here" label, and auto-scroll into view when a matching item is picked up. The zone icon and title also change color to violet.

### UX: Smart Save/Update Button State
**Problem:** Users could save empty agents (no selections), save without a name (only caught by toast), and the Update button was enabled even with no changes.
**Fix:** Save button is disabled until agent has a name AND at least one selection. Update button is disabled until the loaded agent has actual changes (dirty-checking against original snapshot). Enter key also respects the disabled state.

### UX: Mobile Tap-to-Add
**Problem:** On mobile (< 1024px), palette and canvas stack vertically. With ~39 items expanded, the palette was ~3000px tall, making drag-and-drop impossible.
**Fix:** Added tap-to-add alongside drag-and-drop. Clicking/tapping a palette item directly adds it to the correct zone — works on all screen sizes as a convenience. On mobile: palette height capped at 50vh with scroll, accordion sections (one open at a time, scrolls to top on toggle), hint text "Tap to add, or drag on desktop" shown. Uses dnd-kit's 5px activation distance to avoid click/drag conflicts.

### Storage: IndexedDB Instead of localStorage
**Problem:** localStorage has a ~5MB limit, is synchronous (blocks the main thread), and doesn't support structured data natively.
**Fix:** Replaced `useLocalStorage` with a custom `useIndexedDB` hook backed by the IndexedDB API. Same hook signature `[T, setter]` — one-line swap in `useAgentBuilder`. Uses a `agent-builder` database with a `keyval` object store. Reads are async on mount (starts with initial value, updates when DB load completes). Writes are fire-and-forget. No external libraries added.

### Dynamic Palette Height
**Problem:** On desktop, the palette's scroll area didn't adapt to the number of items in the canvas — adding many items caused the canvas to overflow below the viewport.
**Fix:** Palette max-height is dynamically computed via a CSS custom property: `calc(100vh - ${320 + canvasOffset}px)` where `canvasOffset` accounts for each item in the canvas (70px profile, 40px per skill/layer, 48px provider). The palette shrinks as the canvas grows, keeping both visible.

## Architecture

### Before
```
src/
  App.tsx          # 410-line monolith with everything
  App.css          # Empty
  index.css        # Empty
  main.tsx
```

### After
```
src/
  components/
    layout/        # Header (with isolated SessionTimer), Layout
    builder/       # DragDropBuilder, DraggableItem, DropZone, SortableItem,
                   # PalettePanel, PaletteSection, BuilderCanvas, DragOverlayContent
    agent/         # AgentPreview, SaveAgentForm, SavedAgentCard, SavedAgentsList
    ui/            # Badge, EmptyState, ConfirmDialog
  hooks/
    useAgentData.ts    # Data fetching with O(1) lookup Maps
    useAgentBuilder.ts # Central builder state management
    useIndexedDB.ts    # Generic typed IndexedDB persistence hook
  types/
    agent.ts       # All TypeScript interfaces
  utils/
    cn.ts          # clsx + tailwind-merge helper
    constants.ts   # Providers, category/type color mappings
  App.tsx          # Thin shell (~75 lines)
  index.css        # Tailwind v4 + custom theme
  main.tsx
```

### Key Architectural Decisions

1. **No global state library** — Two custom hooks (`useAgentData` + `useAgentBuilder`) with props provide clean, traceable data flow. The component tree is shallow (3-4 levels max); Context or Redux would add indirection without solving a real problem.

2. **React Compiler awareness** — `babel-plugin-react-compiler` is already configured. Explicit `useMemo`/`useCallback` is mostly unnecessary since the compiler handles it, but splitting into proper components is still essential because the compiler memoizes at component boundaries.

3. **@dnd-kit over react-beautiful-dnd** — `react-beautiful-dnd` is deprecated and doesn't support React 18+ concurrent features or React 19. `@dnd-kit` is actively maintained, supports keyboard/touch accessibility, and provides sortable reordering.

4. **Tailwind CSS v4** — Uses `@import "tailwindcss"` with the Vite plugin (no PostCSS, no `tailwind.config.js`). Custom theme colors via `@theme` directive for semantic category/type coloring.

5. **Map-based lookups** — Pre-built `Map<id, item>` for profiles, skills, and layers in `useAgentData` hook. All components use `Map.get()` O(1) instead of `.find()` O(n).

6. **Sonner for toasts** — Replaced all `alert()` and `confirm()` calls with sonner toast notifications for better UX.

## Tech Stack Changes

| Added | Purpose |
|-------|---------|
| `tailwindcss` + `@tailwindcss/vite` | Styling (replaces inline styles) |
| `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` | Drag-and-drop builder |
| `clsx` + `tailwind-merge` | Class composition utility |
| `sonner` | Toast notifications |
| `lucide-react` | Icons |

## Drag-and-Drop UX

- **Left panel (palette):** All available items grouped into collapsible sections (Profiles, Skills, Layers, Providers) with a search/filter input
- **Right panel (canvas):** 4 labeled drop zones — Profile (single), Skills (multi + sortable), Layers (multi + sortable), Provider (single)
- Items dragged from palette to canvas show a styled overlay following the cursor
- Valid drop zones highlight with violet border when a matching item is being dragged
- Already-placed items are dimmed with a checkmark in the palette and cannot be dragged again
- Items in multi-zones can be reordered by dragging and removed with the X button
- Saved agents section below the canvas with load/delete functionality and IndexedDB persistence

## AI Tools Used

- **Claude Code (CLI)** — Used for the entire implementation: bug analysis, architecture planning, component creation, code review, and optimization. All code was generated and iteratively refined through Claude Code with manual testing.

## Test Plan

- [ ] App loads without errors, data appears in palette
- [ ] Drag items from palette to all 4 canvas zones
- [ ] Add multiple skills and layers to their zones
- [ ] Reorder items within skills/layers zones by dragging
- [ ] Remove items from zones — they reappear available in palette
- [ ] Search/filter in palette narrows items across all sections
- [ ] Save an agent — toast appears, agent shows in saved list
- [ ] Reload page — saved agents persist from IndexedDB
- [ ] Load a saved agent — builder populates correctly with all selections
- [ ] Delete a saved agent — removed from list and IndexedDB
- [ ] Clear all saved agents — empties the list
- [ ] Reset builder — clears all selections
- [ ] Resize browser — responsive layout transitions (desktop 2-col, mobile 1-col)
- [ ] CV PDF exists at `public/frontend_engineer_md_sumon_resume.pdf`
- [ ] `bun run build` — production build succeeds with 0 TS errors
- [ ] `bun run lint` — 0 ESLint errors
