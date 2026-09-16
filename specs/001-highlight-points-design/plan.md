# Implementation Plan: Highlight Points Section Design

**Branch**: `001-highlight-points-design` | **Date**: 2026-09-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-highlight-points-design/spec.md`

## Summary

`HighlightPointsBlock` is the only content block on the home page with no design implemented — three
unstyled `<span>` pairs in a `grid-cols-2 md:grid-cols-4`, which orphans the third of its three
seeded points and reads as body copy rather than as credentials.

The approach, following the two answered clarifications: give each point a **bordered card** built on
the existing `Card` atom's `highlight` variant (`bg-card` + `border-primary`), with the figure in the
accent colour and the label held back; add **optional `label` and `title`** section fields so the
block gets a heading like its siblings; derive the **column count from the number of points** so any
count from one to six lays out balanced; and render the group as a **`<dl>`** so each figure and its
label are announced as one statement.

Every colour, border, and corner value comes from an existing token. The one genuinely new file is a
`HighlightCard` molecule.

## Technical Context

**Language/Version**: TypeScript 5.7.3 (`strict`), React 19.2.4, Node `^18.20.2 || >=20.9.0`

**Primary Dependencies**: Next.js 16 App Router, Payload CMS 3.80.0 (all `@payloadcms/*` pinned
identically), Tailwind CSS v4 via `@tailwindcss/postcss`, `class-variance-authority`, `tailwind-merge`
via `@/utilities/ui`'s `cn()`

**Storage**: `@payloadcms/db-sqlite` locally against a gitignored `*.db`; production target undecided
(constitution `TODO(DATABASE_TARGET)`). This feature adds two optional columns and depends on no
adapter-specific behaviour.

**Testing**: Vitest 4.0.18 (`tests/int/**/*.int.spec.ts` and, newly collected,
`tests/unit/**/*.unit.spec.{ts,tsx}`); Playwright 1.58.2 (`tests/e2e/`, chromium only)

**Target Platform**: Server-rendered web, modern evergreen browsers, light and dark themes

**Project Type**: Web application — Next.js frontend and Payload CMS in one repository

**Performance Goals**: No runtime cost. The block stays a Server Component with no data fetching, no
client JS, and no new dependency.

**Constraints**: No new colour values, corner treatments, or border weights (FR-003, FR-016). Both new
schema fields optional so stored content needs no migration (FR-015). Content must originate from the
CMS, never hardcoded (Principle I). No horizontal overflow from 320px up (SC-002).

**Scale/Scope**: One block, 1–6 points typical. Four files edited, two created, one regenerated.

## Constitution Check

*GATE: evaluated before Phase 0, re-evaluated after Phase 1.*

| Principle | Gate | Verdict |
|---|---|---|
| **I. Payload-First Content Modeling** | All user-visible content from schema; `pnpm generate:types` run and committed | **PASS.** `label` and `title` become schema fields rather than hardcoded copy. Research R2 explicitly declines to replicate `ProjectsBlock`'s hardcoded `03 / 07` and `ls ./projects` strings, which are pre-existing violations of this principle. Regenerated `payload-types.ts` ships in the same commit. |
| **II. Atomic Design Component Boundaries** | Correct tier; `@/components/<tier>/...` alias; `.client.tsx` only where needed | **PASS.** New `HighlightCard` is a molecule (composes the `Card` atom) at `src/components/molecules/HighlightCard/`. Imported via alias. No client component — nothing needs state, effects, or browser APIs, so the block stays a Server Component. |
| **III. Type Safety Is Enforced** | `strict` on; generated types consumed, not re-declared; no `any`; `pnpm lint` clean | **PASS.** Props typed as `HighlightPointsBlockType` from `payload-types`. `HighlightCard`'s own props are a local presentational type, not a duplicate of a Payload shape. No `any`. |
| **IV. Explicit Access Control** | Collections/globals declare `access`; secrets from env only | **PASS — not engaged.** No collection, global, endpoint, or secret is touched. The block inherits the `pages` collection's existing access. |
| **V. Verified Before Merged** | Payload behaviour covered by `tests/int/`; rendered behaviour by `tests/e2e/`; `pnpm test` green | **PASS with a recorded deviation.** Clarification C1 made this a schema change, so the "purely presentational" exemption no longer covers the whole feature. Integration tests cover the schema round-trip and the FR-015 regression; component tests cover rendering. See Complexity Tracking for the `pnpm test` caveat. |

**Technology Stack Constraints**: Server Components default — held. Payload packages untouched, so
version pinning is unaffected. No raw SQL, no SQLite-specific behaviour. No new runtime dependency. No
ad-hoc global CSS — all styling is Tailwind utilities over existing tokens.

**Development Workflow**: Commit subject line only, no body, no `Co-Authored-By`. `pnpm generate:types`
required. Seed must stay loadable through all three entry points (`quickstart.md` Scenario 3).

**Post-Phase 1 re-evaluation**: no gate changed. The design added no dependency, no client component,
no tier violation, and no hardcoded copy. The two deviations below were already known at Phase 0 and
neither is a principle violation.

## Project Structure

### Documentation (this feature)

```text
specs/001-highlight-points-design/
├── plan.md                              # This file
├── spec.md                              # Requirements + resolved clarifications C1, C2
├── research.md                          # Phase 0 — R1..R11
├── data-model.md                        # Phase 1 — schema delta, generated-type delta
├── quickstart.md                        # Phase 1 — 7 validation scenarios
├── contracts/
│   └── highlight-points-block.md        # Phase 1 — CMS + component contracts
└── tasks.md                             # Phase 2 — NOT created by /speckit-plan
```

### Source Code (repository root)

```text
src/
├── blocks/
│   └── HighlightPointsBlock/
│       ├── config.ts                    # MODIFY — add optional label + title
│       └── Component.tsx                # REWRITE — header, dl, count-derived columns
├── components/
│   ├── atoms/Card/index.tsx             # UNCHANGED — reused via variant="highlight"
│   └── molecules/
│       └── HighlightCard/
│           └── index.tsx                # NEW — one point as a bordered card
├── scripts/
│   └── seed-data.ts                     # MODIFY — seed label + title (line ~355)
└── payload-types.ts                     # REGENERATE — pnpm generate:types

tests/
├── int/
│   └── highlightPointsBlock.int.spec.ts # NEW — schema round-trip, FR-015 regression
└── unit/
    └── blocks/
        └── HighlightPointsBlock.unit.spec.tsx  # NEW — rendering behaviour
```

**Structure Decision**: The repository is a single Next.js + Payload application under `src/`, with
tests split by kind under `tests/`. This feature follows both conventions and introduces no new
top-level directory. `tests/unit/` is new as a directory but not as a concept — `vitest.config.mts`
was already extended to collect `tests/unit/**/*.unit.spec.{ts,tsx}`, and `vitest.setup.ts` to call
Testing Library's `cleanup()` after each test. Before that, no glob collected component specs at all,
which is why this feature is the first that can have them.

## Complexity Tracking

Neither entry below is a constitution violation. Both are deliberate deviations from a sibling
convention or from a success criterion, recorded so review does not have to rediscover them.

| Deviation | Why needed | Simpler alternative rejected because |
|---|---|---|
| `label` and `title` are **optional**, where `SkillsBlock` and `ExperienceBlock` declare `title` as `required: true` with a `defaultValue` | FR-015 requires stored content to keep rendering with no editor action and no migration | Copying `required: true` looks simpler but is not: `defaultValue` applies at document *creation*, so it never populates the home page already in the database. The next save of that page would fail validation until an editor filled the field in, and `pnpm seed:data` would break against a fresh database. Full reasoning in research R3. |
| SC-004 asks for contrast "verified by automated contrast audit with zero violations"; this feature verifies **two hand-computed ratios** instead | Adding `@axe-core/playwright` means a new devDependency plus a baseline triage of pre-existing violations across the entire page, unrelated to this section | Research R4 established the card's tokens are identical under `:root` and `[data-theme='dark']`, so there are exactly two ratios and hand-computing them settles FR-008 for this section completely. Shipping an audit that fails on day one for unrelated reasons is worse than not shipping one. A repository-wide audit is deferred follow-up, not dropped. |

### Carried forward, not fixed here

Three pre-existing problems were found while planning. Each is named in research so it is not
rediscovered, and each is deliberately left alone:

1. **`ProjectsBlock` hardcodes user-visible copy** — `03 / 07` and `ls ./projects · N entries`
   (`ProjectsBlock/Component.tsx:26-38`). A Principle I violation, and the counter silently encodes a
   fixed section count. Not replicated here (R2); not fixed here.
2. **Vertical spacing is doubled page-wide** — `RenderBlocks.tsx:56` wraps every block in `my-16`
   while several blocks also apply their own `py-16`. This block drops its `py-16`; `ProjectsBlock`
   and `AboutBlock` keep theirs, so the outer spacing will differ slightly until a page-wide fix (R8).
3. **`tests/e2e/frontend.e2e.spec.ts` is stale** — it asserts `Payload Website Template`, which only
   the `POST /next/seed` path produces, while `pnpm seed:data` seeds the portfolio home page. It
   passes or fails depending on which seed ran, so `pnpm test` is not reliably green independently of
   this feature. `quickstart.md` Scenario 7 says how to confirm the failure predates the change.

### Environment blocker

`node_modules/` in this checkout is owned by `root` and empty, so `pnpm install` fails with
`Permission denied` and neither suite can be run. Clearing it is a prerequisite for
`/speckit-implement`, not a task inside it:

```bash
sudo rm -rf node_modules && corepack pnpm install --ignore-workspace
```

`corepack` resolves pnpm `12.3.4` while `package.json` `engines` pins `^9 || ^10`.
