# AI Agent Profile Builder

## Project Overview

This is a **Vivasoft Nepal frontend hiring challenge**. The project is a partially built "AI Agent Builder" interface using React 19 + TypeScript + Vite 8. The codebase has **intentional bugs, React anti-patterns, and performance bottlenecks** that must be identified and fixed, plus the UI needs a complete overhaul with drag-and-drop functionality.

## Tech Stack

- **Framework**: React 19 with React Compiler (babel-plugin-react-compiler)
- **Language**: TypeScript (strict mode)
- **Bundler**: Vite 8
- **Linting**: ESLint with typescript-eslint, react-hooks, react-refresh plugins
- **Package Manager**: Bun (bun.lock present)

## Project Structure

```
src/
  App.tsx          # Main (currently monolithic) application component
  App.css          # App styles (currently empty)
  index.css        # Global styles (currently empty)
  main.tsx         # Entry point with StrictMode
public/
  data.json        # Static data: 10 profiles, 12 skills, 12 layers
  favicon.svg
  icons.svg
```

## Data Model

`data.json` provides three collections:
- **agentProfiles** (10 items): id, name, description — base personality templates
- **skills** (12 items): id, name, category (information|action), description — capabilities
- **layers** (12 items): id, name, type (reasoning|personality|context|formatting), description — behavior modifiers

Users build an agent by selecting 1 profile + N skills + N layers + 1 AI provider, naming it, and saving to localStorage.

## Known Bugs (Intentional — Must Fix)

### Critical
1. **Direct state mutation in `handleLayerSelect`** (App.tsx:122-124): Uses `.push()` on state array then passes same reference — React skips re-render. Fix: create new array with spread operator.
2. **Unnecessary `fetchAPI()` on every selection change** (App.tsx:128, 138, 209): Re-fetches static data with random 1-3s delay on every dropdown interaction. Fix: remove these calls entirely.
3. **Stale closure in analytics heartbeat** (App.tsx:81-89): Empty `[]` deps but reads `agentName` — always sees initial empty string. Fix: add `agentName` to deps or use a ref.

### Performance
4. **Session timer re-renders entire app every 1 second** (App.tsx:59-66): `setSessionTime` in monolithic component triggers full tree re-render every second. Fix: extract to own component or use ref.
5. **Monolithic component (~410 lines)**: Zero component extraction means every state change re-renders everything. Fix: split into focused components.
6. **Inline style objects recreated every render**: All `style={{...}}` create new objects each render cycle. Fix: use CSS classes (Tailwind).
7. **Duplicate `.find()` calls** (App.tsx:275-277): Same array search performed twice in adjacent lines. Fix: store result in variable.

### Minor
8. **Initial loading state is `false`** (App.tsx:40): Flash of "No data loaded" before fetch starts. Fix: initialize `loading` to `true`.

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server (Vite)
bun run build        # Type-check + build for production
bun run lint         # Run ESLint
bun run preview      # Preview production build
```

## Conventions

- Use **Tailwind CSS** for all styling (to be installed)
- Use **@dnd-kit** for drag-and-drop (to be installed)
- Component files: PascalCase (e.g., `AgentBuilder.tsx`)
- Custom hooks: `use` prefix in `hooks/` directory (e.g., `useAgentData.ts`)
- Types/interfaces: in `types/` directory
- Keep components small and focused — one responsibility per component
- Prefer `React.memo` for pure display components receiving stable props
- Use `useCallback`/`useMemo` only where profiling shows benefit (React Compiler handles most cases)
- No `any` types — use proper TypeScript generics and interfaces
- Use `const` assertions and discriminated unions where appropriate

## Task Requirements (from README)

1. **Fix all intentional bugs** and explain fixes in PR description
2. **Implement drag-and-drop UI** to replace select dropdowns (use @dnd-kit)
3. **Modern, responsive, polished design** with Tailwind CSS
4. **Put CV (PDF) in `public/` folder**
5. **Submit PR** against original repo with detailed description covering:
   - Bugs found and how they were fixed
   - Architectural decisions
   - AI tools used
   - Optional: Figma design link

## Architecture (Implemented)

```
src/
  components/
    layout/           # Header (with SessionTimer), Layout
    builder/          # DragDropBuilder, DraggableItem, DropZone, SortableItem, PalettePanel, PaletteSection, BuilderCanvas, DragOverlayContent
    agent/            # AgentPreview, SaveAgentForm, SavedAgentCard, SavedAgentsList
    ui/               # Badge, EmptyState
  hooks/
    useAgentData.ts   # Data fetching with proper loading/error states
    useLocalStorage.ts # Generic localStorage hook
    useAgentBuilder.ts # Central builder state management
  types/
    agent.ts          # All TypeScript interfaces
  utils/
    cn.ts             # Tailwind className utility
  App.tsx             # Thin shell composing components
  main.tsx
```
