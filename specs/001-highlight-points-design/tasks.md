---

description: "Task list for Highlight Points Section Design"
---

# Tasks: Highlight Points Section Design

**Input**: Design documents from `/specs/001-highlight-points-design/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/highlight-points-block.md),
[quickstart.md](./quickstart.md)

**Tests**: Test tasks are **included and required**. Clarification C1 turned this into a schema
change, so Constitution Principle V's "purely presentational" exemption no longer covers the feature.
Research R10 sets the two layers: integration for the schema, component for the rendering.

**Organization**: Grouped by user story so each is independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel — different files, no dependency on an incomplete task
- **[Story]**: US1, US2, US3 — maps to the user stories in `spec.md`
- Exact file paths are given in every task

## Path Conventions

Single Next.js + Payload application. Source under `src/`, tests under `tests/`, both at the
repository root. Paths below are repository-relative and match the tree in `plan.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Make the repository runnable and record what was already broken before this feature.

- [X] T001 Clear the root-owned `node_modules/` and install dependencies: `sudo rm -rf node_modules && corepack pnpm install --ignore-workspace`. Requires a human with sudo — the directory is owned by `root` and empty, so every install fails with `Permission denied`. Note `corepack` resolves pnpm `12.3.4` while `package.json` `engines` pins `^9 || ^10`; fall back to `corepack pnpm@10 install --ignore-workspace` if that mismatch bites.
- [ ] T002 Record the pre-change baseline by running `corepack pnpm lint`, `corepack pnpm test:int`, and `corepack pnpm test:e2e`, and writing the results into the implementation PR description. `tests/e2e/frontend.e2e.spec.ts` is expected to fail or pass depending on which seed populated the database (`plan.md` "Carried forward" item 3) — capturing that here is what stops it being misread as a regression later.

**Checkpoint**: Suites run, and the pre-existing e2e failure is on record.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Land the schema change and the regenerated types. Every user story renders fields that do
not exist until this phase completes.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Write the integration spec `tests/int/highlightPointsBlock.int.spec.ts` with two cases: (a) a page whose `layout` contains a `highlightPointsBlock` carrying `label`, `title`, and `points` saves and reads back with all three intact; (b) a page whose block carries `points` only — no `label`, no `title` — still validates and saves, which is FR-015's regression test. Expect both to fail before T004: the fields do not exist in the schema and are not in the generated types.
- [X] T004 Add two optional `text` fields, `label` then `title`, before the existing `points` array in `src/blocks/HighlightPointsBlock/config.ts`. Both **without** `required` and **without** `defaultValue` — see `research.md` R3 for why copying the siblings' `required: true` would leave the stored home page unsaveable and break `pnpm seed:data`. Give each an `admin.description` in the style of `src/blocks/ExperienceBlock/config.ts:9`. Do not change the block `slug` or `interfaceName`.
- [X] T005 Regenerate the Payload types with `corepack pnpm generate:types` and commit the updated `src/payload-types.ts` in the same change as T004, per Constitution Principle I. Confirm `HighlightPointsBlockType` gains `label?: string | null` and `title?: string | null`, and that `HighlightPointsBlockTypeSelect` gains the matching `label?: T` / `title?: T`.
- [ ] T006 Confirm T003 now passes (`corepack pnpm test:int`) and that a fresh database still seeds: `rm -f mogami-transformative-porfolio.db && corepack pnpm seed:admin && corepack pnpm seed:data`. Constitution Development Workflow requires all three seed entry points to keep working; the third (`POST /next/seed`) does not use this block but should be exercised once via the admin SeedButton.

**Checkpoint**: Schema landed, types regenerated, seeds load, integration coverage green. User stories can begin.

---

## Phase 3: User Story 1 - Visitor reads the credibility metrics at a glance (Priority: P1) 🎯 MVP

**Goal**: Each point becomes a bordered card with the figure dominant and accent-coloured, the section
gains its authored heading, and the figure/label pair is announced as one statement.

**Independent Test**: Load the home page at desktop width with the three seeded points. Each point is a
distinct bordered card; the figure is visually dominant over its label; the section is recognisably
part of the same visual system as the sections below. Delivers the section's core value with neither
US2 nor US3 implemented.

### Tests for User Story 1

> Write these first and confirm they fail before implementing.

- [X] T007 [P] [US1] Create `tests/unit/components/HighlightCard.unit.spec.tsx` asserting: the component renders exactly one `dt` (label) and one `dd` (figure); `dt` precedes `dd` in the DOM (FR-007, contract G4); the figure carries `text-primary` and the label does not (FR-002, G6); the rendered card resolves to `flex-col-reverse` rather than `flex-col`. That last case is the one guarding research R7's merge-order dependency — `Card` hardcodes `flex flex-col` and the override only wins because `Card` composes through `cn()`. It breaks silently: the section still renders, just with the label above the figure.
- [X] T008 [P] [US1] Create `tests/unit/blocks/HighlightPointsBlock.unit.spec.tsx` asserting the heading behaviour from the contract table: `label` and `title` both render when authored; neither authored produces no heading element and no empty wrapper (FR-014); `label` alone and `title` alone each render without an empty sibling slot. Treat `null`, `undefined`, and `''` as empty — Payload's generated optionals are `string | null | undefined`, so a check that only tests `undefined` passes on `null` and renders an empty heading.

### Implementation for User Story 1

- [X] T009 [US1] Create the molecule `src/components/molecules/HighlightCard/index.tsx` per the contract: props `figure`, `label`, optional `className`; renders `Card` with `variant="highlight"` and `flex-col-reverse`, containing `<dt>{label}</dt>` then `<dd>{figure}</dd>`. Props are named `figure`/`label`, not `title`/`subtitle`, to keep the point's figure distinct from the new section-level `title` (`data-model.md` naming hazard). Introduce no new colour, border, radius, or surface value — `variant="highlight"` already resolves to `bg-card` + `border-primary`, and `--radius` is `0` (FR-003, FR-016, G5).
- [X] T010 [US1] Rewrite `src/blocks/HighlightPointsBlock/Component.tsx` as a Server Component that renders a `<section className="container">`, the optional header, and a `<dl>` grid mapping each point onto `HighlightCard` (`points[].title` → `figure`, `points[].subtitle` → `label`, `points[].id` as the key). Take the header's visual treatment from `src/blocks/ProjectsBlock/Component.tsx:24-40` — `label` in the slot where that block hardcodes `03 / 07`, `title` in uppercase mono accent — but **do not** reproduce the `03 / 07` counter or the `ls ./projects · N entries` line; both are hardcoded copy and pre-existing Principle I violations (research R2). Drop the existing `py-16`: `RenderBlocks.tsx:56` already wraps every block in `my-16`, and keeping both double-spaces the section (research R8).
- [X] T011 [US1] Add `label` and `title` to the `highlightPointsBlock` entry in `src/scripts/seed-data.ts` (around line 355) so a fresh seed shows the finished design. Keep the three existing points unchanged.
- [X] T012 [US1] Compute and record the two contrast ratios in the implementation PR: `--primary` `#00D4AA` on `--card` `#102122` for the figure (≥ 4.5:1, or ≥ 3:1 if rendered ≥ 24px), and `--card-foreground` `#d0d0d0` at its chosen opacity on the same background for the label (≥ 4.5:1). Research R4 established these tokens are identical under `:root` and `[data-theme='dark']`, so two measurements cover both themes. If the label misses the threshold, raise its opacity — do not change the shared colour token (FR-008).

**Checkpoint**: User Story 1 is fully functional and demonstrable on its own.

---

## Phase 4: User Story 2 - Visitor on a phone reads the same metrics (Priority: P2)

**Goal**: The section stays legible and correctly paired down to 375px, with no horizontal overflow.

**Independent Test**: View the section at 375px wide with the three seeded points. Figures stay
legible, each label stays paired with its own figure, and the page gains no horizontal scrollbar.

**Note on scope**: T010 necessarily ships *some* responsive column behaviour, so this story is
narrower than it looks — it is verification plus whatever that verification turns up. It is kept
separate because the mobile result is what SC-002 is measured against, and because it can fail
independently of everything US1 asserts.

- [ ] T013 [US2] Verify the section across 320, 375, 768, 1280, and 1920px per `quickstart.md` Scenario 5, and correct `src/blocks/HighlightPointsBlock/Component.tsx` for anything found. Check specifically: no horizontal scrollbar at any width (SC-002), no clipped or overlapping text, every card in a row the same height (FR-010), and each label still visually paired with its own figure.
- [ ] T014 [US2] Confirm the section reflows rather than overlapping or clipping when the browser's base font size is increased substantially (spec edge case "Text scaling"), adjusting the card's typography scale in `src/components/molecules/HighlightCard/index.tsx` if it does not.

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Editor changes the points without breaking the layout (Priority: P3)

**Goal**: Any point count from one to six produces a balanced arrangement, and an empty list renders
nothing at all.

**Independent Test**: Render the section with 1, 2, 3, 4, 5, and 6 points in turn. Each count gives a
balanced arrangement with no orphaned card and no gap that reads as missing content; an empty list
renders nothing.

### Tests for User Story 3

- [X] T015 [US3] Extend `tests/unit/blocks/HighlightPointsBlock.unit.spec.tsx` with the layout cases: the applied column class matches the mapping in research R6 for each of 1, 2, 3, 4, 5, and 6 points; and `points: []`, `points: undefined`, and `points: null` each render nothing — not an empty `<section>`, not a bordered shell (FR-006). Same file as T008, so this is not parallel with it.

### Implementation for User Story 3

- [X] T016 [US3] Implement the count-to-columns lookup in `src/blocks/HighlightPointsBlock/Component.tsx` per research R6: 1→1 (constrained, not full-bleed), 2→2, 3→3, 4→4, 5→3, 6→3, 7+→4, with 2 columns below the `md` breakpoint. The lookup must map to **complete literal class strings** — Tailwind v4 scans source text, so `` `grid-cols-${n}` `` produces no CSS. `globals.css:32-38` already uses `@source inline(...)` for this problem if the scanner still misses them.
- [X] T017 [US3] Add the empty guard to `src/blocks/HighlightPointsBlock/Component.tsx`: return `null` when `points` is absent or empty. `points` is `required: true` in the schema, but a draft can still reach the renderer without it (FR-006).
- [ ] T018 [US3] Verify the content edge cases from `quickstart.md` Scenario 5 in the admin: a label noticeably longer than its neighbours keeps the row at a shared height (FR-010), and a long figure such as `10.000+` stays on one line without overflowing its card.

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T019 Run `corepack pnpm lint` and fix every error — Constitution Principle III requires zero errors before the change is complete. Confirm no `any` was introduced and that `HighlightPointsBlockType` is consumed from `src/payload-types.ts` rather than re-declared.
- [X] T020 Run the full suite with `corepack pnpm test` and compare against the T002 baseline. The only acceptable failure is the pre-existing `tests/e2e/frontend.e2e.spec.ts` one; anything else is a regression from this feature.
- [ ] T021 Walk `quickstart.md` Scenarios 4 and 6 end to end: the visual check against the rest of the page, then the DOM and screen-reader check that each point announces as one statement with no orphaned numbers (SC-007).
- [ ] T022 Confirm the visual consequence recorded in research R8 is acceptable in the real page: this section now relies on the `my-16` wrapper alone while `ProjectsBlock` and `AboutBlock` still add their own `py-16`, so its outer spacing differs slightly. If it reads wrong, raise a follow-up for the page-wide spacing fix rather than re-adding `py-16` here.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies. T001 blocks literally everything — no suite runs until it is done.
- **Phase 2 (Foundational)**: Depends on Phase 1. **Blocks all three user stories** — they render fields that do not exist until T004/T005 land.
- **Phase 3 (US1)**: Depends on Phase 2. No dependency on US2 or US3.
- **Phase 4 (US2)**: Depends on Phase 2. Verifies work T010 introduced, so in practice runs after US1.
- **Phase 5 (US3)**: Depends on Phase 2. Modifies the same component file as US1, so it does not run concurrently with Phase 3.
- **Phase 6 (Polish)**: Depends on every story being complete.

### Within Phase 2

Strictly sequential: T003 (failing test) → T004 (schema) → T005 (types) → T006 (verify). T003 will not
even typecheck against the generated types until T005, which is the intended failing state.

### Within Each User Story

- Tests are written and confirmed failing before implementation.
- US1: T007 and T008 in parallel → T009 (molecule) → T010 (block, consumes the molecule) → T011, T012.
- US3: T015 (test) → T016, T017 (both edit the same file, so sequential) → T018.

### Parallel Opportunities

Genuinely parallel work is limited here — this is a small feature touching few files, and most tasks
queue behind the schema change or edit the same component.

- **T007 and T008** — different spec files, no shared state. The only true parallel pair.
- **T011 and T012** — `seed-data.ts` and a contrast calculation; independent once T010 lands.
- **US2 and US3** could be staffed separately in principle, but both edit `HighlightPointsBlock/Component.tsx`, so they would conflict. Run them sequentially.

## Parallel Example: User Story 1

```bash
# The two component specs touch different files and can be written together:
Task: "Create tests/unit/components/HighlightCard.unit.spec.tsx"
Task: "Create tests/unit/blocks/HighlightPointsBlock.unit.spec.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 — Setup. T001 is a human step; nothing proceeds without it.
2. Phase 2 — Foundational. Schema, types, seeds verified.
3. Phase 3 — User Story 1.
4. **Stop and validate**: `quickstart.md` Scenario 4 at desktop width.
5. This is a shippable increment on its own — the section already looks designed and reads correctly
   to assistive technology.

### Incremental Delivery

1. Setup + Foundational → schema landed, nothing visible yet.
2. **+ US1 → MVP.** The section is designed, accessible, and seeded.
3. **+ US2** → verified down to 320px.
4. **+ US3** → survives editing to any point count.
5. Polish → lint, full suite, quickstart walkthrough.

Each step leaves the page in a shippable state.

---

## Notes

- Commit subject line only. No body, no `Co-Authored-By` — Constitution Development Workflow, which
  overrides the session default.
- `[P]` means different files and no dependency on an incomplete task.
- T001 needs sudo and cannot be done by an agent.
- Two deviations are already approved in `plan.md` Complexity Tracking and need no re-litigating
  during implementation: the new fields are optional where the siblings are required, and FR-008 is
  discharged by two hand-computed contrast ratios rather than an automated audit.
- Three pre-existing problems are deliberately **not** fixed here: `ProjectsBlock`'s hardcoded copy,
  the page-wide double spacing, and the stale frontend e2e spec. Do not fix them opportunistically —
  each changes behaviour outside this feature's scope.
