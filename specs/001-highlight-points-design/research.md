# Phase 0 Research: Highlight Points Section Design

**Feature**: `001-highlight-points-design` | **Date**: 2026-09-06

All findings below come from reading the repository at commit `9771e6b`. Nothing here was assumed
from convention alone; every claim names the file it was read from.

---

## R1: Which section-header pattern to follow

**Context**: Clarification C1 says the section gains `label` + `title` "matching the sibling
sections". Reading the code, there is no single sibling pattern — there are three, and they disagree.

| Pattern | Where | Field names | How it renders |
|---|---|---|---|
| Card-wrapped list | `SkillsBlock`, `ExperienceBlock` via `CardList` | `label`, `title` | Header lives *inside* a single `Card`, as `CardLabel` + `CardTitle`. There is no header above a grid — the whole section is one card. |
| Terminal section header | `ProjectsBlock/Component.tsx:24-40` | `sectionTitle` | A real header *above* a grid: a `NN / 07` counter, the title in uppercase mono accent, and a right-aligned shell-command line (`ls ./projects · N entries`), separated by a dashed bottom border. |
| Plain heading | `AboutBlock/Component.tsx:10` | `sectionTitle` | Bare `<h2 class="text-2xl font-bold">`. Unstyled, no design language. |

**Decision**: Take the **field names from the first pattern** (`label`, `title`) and the **visual
structure from the second** (a header above a grid).

**Rationale**: C1 chose `label` + `title` explicitly, and those names are the more descriptive pair.
But `CardList`'s *layout* cannot be reused here: it renders one card containing text lines, whereas
C2 requires a grid of cards. `ProjectsBlock` is the only existing example of a header sitting above a
grid, so it is the only pattern that answers the structural question. Splitting the two lets us honour
C1 without inventing a third header appearance.

**Alternatives considered**:

- *Reuse `CardList` wholesale* — rejected. It would make each highlight point a text line inside one
  shared card, which is the opposite of C2's "bordered card surface per point".
- *Adopt `sectionTitle` to match `ProjectsBlock` and `AboutBlock`* — rejected. Contradicts C1, and
  `sectionTitle` is a single field with no room for the small label the design calls for.
- *Copy `ProjectsBlock`'s header verbatim, counter included* — rejected, see R2.

---

## R2: The `NN / 07` counter and the shell-command line

**Context**: `ProjectsBlock/Component.tsx:26-28` hardcodes the string `03 / 07`, and line 36 builds
`ls ./projects · {n} entries`. Both are user-visible copy living in a React component.

**Decision**: Do **not** replicate either. The new header renders the optional `label` where
`ProjectsBlock` puts its counter, and the `title` where `ProjectsBlock` puts its section name.

**Rationale**: Constitution Principle I — "Every piece of user-visible content MUST originate from a
Payload collection, global, or block schema… never hardcoding copy". `03 / 07` is hardcoded copy that
also silently encodes a fixed number of sections; adding a fourth section makes it wrong with no
failure. Reproducing it in a new block would spread a known Principle I violation rather than
contain it. The editor-authored `label` occupies the same visual slot and is schema-backed, so the
design reads the same without the defect.

**Note for a later feature**: `ProjectsBlock`'s counter and command line are pre-existing Principle I
violations. They are out of scope here and are not being fixed by this change.

**Alternatives considered**:

- *Derive the counter from the block's index in the page layout* — rejected as scope creep; it needs
  `RenderBlocks` to pass positional context to every block.
- *Add a `counter` field to the schema* — rejected. It puts the burden of keeping `NN / 07` accurate
  on the editor, which is worse than not showing it.

---

## R3: Should `title` be required?

**Context**: `SkillsBlock/config.ts:12-16` and `ExperienceBlock/config.ts:13-20` both declare
`title` as `required: true` with a `defaultValue`. Copying that would make the new field required.

**Decision**: Both `label` and `title` are **optional** (`required` omitted). No `defaultValue` is set
on either.

**Rationale**: Three separate reasons, any one sufficient:

1. C1 states the fields "stay optional, so existing content keeps rendering unchanged". FR-015
   requires exactly this.
2. `required: true` does not retroactively populate rows. A `defaultValue` applies at *creation*, not
   to documents already stored. The home page already exists in the database with a
   `highlightPointsBlock` that has no `title`; making the field required means the next save of that
   page fails validation until the editor fills it in — a migration disguised as a default.
3. Constitution Development Workflow requires the seed to stay loadable through all three entry
   points. `src/scripts/seed-data.ts:355-362` seeds this block with `points` only. A required `title`
   breaks `pnpm seed:data` against a fresh database until the seed is edited, and the seed edit does
   nothing for databases already populated.

**Consequence**: This is a deliberate deviation from the sibling blocks' `required: true`. It is
recorded in `plan.md`'s Complexity Tracking.

**Alternatives considered**:

- *`required: true` + `defaultValue` + seed update* — rejected per reason 2 above; it leaves existing
  documents in an unsaveable state.
- *`required: true` on `title` only when `label` is present* — rejected. Payload conditional
  validation for this adds real complexity to buy nothing the optional pair does not already give.

---

## R4: Reusing the card primitive

**Context**: `src/components/atoms/Card/index.tsx` defines a `cva` primitive with three variants.

```
default   → bg-card border-card-border
primary   → bg-primary border-transparent
highlight → bg-card border-primary
```

Shared across all variants: `rounded-[var(--radius)] p-5 flex flex-col gap-3 font-mono border`.

**Decision**: Use the existing `Card` atom with **`variant="highlight"`** for each point. Introduce no
new variant and no new styling on the card itself.

**Rationale**: C2 asked for "a bordered card surface, with the figure in the accent colour".
`highlight` is literally `bg-card` + `border-primary` — the accent-bordered card. `--radius` is `0`
(`globals.css:105`), so the square-cornered look is inherited rather than re-specified, satisfying
FR-003 and FR-016 with zero new values.

**Confirmed compatible**: `--card` (`#102122`), `--card-border` (`#3D3D3D`) and `--primary`
(`#00D4AA`) are defined identically under `:root` and `[data-theme='dark']` in `globals.css:79-155`.
The card's appearance is therefore theme-invariant, which collapses FR-008's two-theme contrast check
into one measurement rather than two.

**Alternatives considered**:

- *`variant="default"` (grey border)* — rejected. C2 specified the accent, and a grey border on a
  near-black card is nearly invisible against the animated background.
- *A new `stat` variant* — rejected. It would duplicate `highlight` exactly.

---

## R5: Accent colour on the figure vs. on the border

**Context**: C2 puts the accent on the figure. `variant="highlight"` also puts the accent on the
border. Both at once risks the "visually heavy" outcome C2's own trade-off note warns about, and
FR-016 forbids.

**Decision**: Accent (`text-primary`) on the **figure**. Border stays `border-primary` per
`variant="highlight"`, but the label uses `text-card-foreground` at reduced opacity, matching how
`CardList` renders its item text (`molecules/CardList/index.tsx:26` — `text-card-foreground
text-[10px] opacity-60`).

**Rationale**: The weight problem C2 flags comes from every element competing at full strength.
Holding the label back is what makes the figure dominant (FR-002) and keeps the block from
outshouting the sections below (FR-016), without changing any colour value.

---

## R6: Grid column strategy for one to six points

**Context**: The current markup (`HighlightPointsBlock/Component.tsx:8`) is
`grid grid-cols-2 md:grid-cols-4`. The seed supplies three points
(`src/scripts/seed-data.ts:357-361`), so at `md` and above the third card sits alone on a second row
with an empty fourth cell — the exact defect FR-005 and SC-003 forbid.

**Decision**: Choose the column count from the number of points, via an explicit lookup, rather than a
fixed `md:grid-cols-4`.

| Points | Columns at `md`+ | Columns below `md` |
|---|---|---|
| 1 | 1 (constrained, not full-bleed) | 1 |
| 2 | 2 | 2 |
| 3 | 3 | 2 |
| 4 | 4 | 2 |
| 5 | 3 (3 + 2) | 2 |
| 6 | 3 (3 + 3) | 2 |
| 7+ | 4, wrapping | 2 |

**Rationale**: An explicit mapping is directly testable — one component test per count asserts the
applied class — and it is the only approach that satisfies both FR-005 and the single-point edge case.

**Alternatives considered**:

- *`grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]`* — rejected. `auto-fit` collapses empty tracks,
  so a single point stretches to the full content width. The spec's single-point edge case explicitly
  forbids that. It also cannot produce the 5 → "3 + 2" balance.
- *Flexbox with `flex-wrap` and a fixed basis* — rejected. The trailing row left-aligns rather than
  balancing, and equal card heights (FR-010) then need extra work that `grid` gives for free.

**Tailwind caveat**: the column classes must appear as complete literal strings so the Tailwind v4
scanner can see them. A template like `` `grid-cols-${n}` `` produces no CSS. The lookup must map to
whole class names. `globals.css:32-38` already uses `@source inline(...)` for exactly this problem, so
that escape hatch exists if needed.

---

## R7: Semantic markup for the figure/label pair

**Context**: FR-007 requires each figure to be programmatically associated with its label. The current
markup is two sibling `<span>`s inside a `<div>` (`HighlightPointsBlock/Component.tsx:10-13`) — a
screen reader reads "plus five, years of experience" as two unrelated fragments with no relationship.

**Decision**: Render the list as a description list: `<dl>` for the group, and per point a wrapping
`<div>` containing `<dt>` (the label) and `<dd>` (the figure). Visual order is figure-first, achieved
with `flex flex-col-reverse` on the card, so the DOM keeps `dt` before `dd`.

**Rationale**: `<dl>` is the one native HTML construct for name/value pairs, and a `div` wrapping each
`dt`/`dd` pair is explicitly valid HTML5. It needs no ARIA and no generated ids, so nothing can drift
out of sync. `flex-col-reverse` is a visual reorder only; it does not touch the accessibility tree,
which is what keeps the reading order correct.

**Alternatives considered**:

- *`aria-labelledby` between two spans* — rejected. Requires a unique generated id per point, which
  is avoidable state for no benefit over `<dl>`.
- *Visually-hidden combined text* — rejected. Duplicates the content and drifts from what is shown.
- *Reordering with `order-` utilities* — rejected. `flex-col-reverse` on the container is one class
  instead of two, and cannot get out of step.

**Interaction with `Card`**: the `Card` atom hardcodes `flex flex-col` (`atoms/Card/index.tsx:5`).
`flex-col-reverse` must therefore be passed through `className`. `Card` composes with `cn()`
(tailwind-merge), so the later class wins — this works, but it is a conflict resolved by merge order
rather than by design, so it needs a test that pins it (see R9).

---

## R8: Vertical rhythm — a pre-existing double-spacing bug

**Context**: `RenderBlocks.tsx:56` wraps **every** block in `<div className="my-16">`. The highlight
block *also* applies `py-16` (`HighlightPointsBlock/Component.tsx:7`), and so do `ProjectsBlock` and
`AboutBlock`. Every block on the page therefore gets its own padding plus a 4rem margin from the
wrapper.

**Decision**: Drop `py-16` from this block and rely on the `my-16` wrapper. Keep `container` for the
horizontal gutter.

**Rationale**: FR-011 requires the spacing to "match the spacing convention the other sections already
use". The convention that actually applies to every block without exception is the `my-16` wrapper;
the per-block `py-16` is an inconsistent addition that only some blocks carry. Removing it here makes
this block's rhythm predictable and removes one instance of the duplication.

**Scope note**: this deliberately leaves `ProjectsBlock` and `AboutBlock` unchanged. Fixing the
duplication across all blocks is a separate change with page-wide visual consequences and belongs in
its own feature. Expect this section's outer spacing to differ slightly from `ProjectsBlock`'s until
that happens — a visible, intentional consequence worth confirming when reviewing the result.

---

## R9: Component tier and file layout

**Context**: Constitution Principle II fixes four tiers and requires the `@/components/<tier>/...`
alias. A card composed of a figure and a label is an atom composition, which is the definition of a
molecule.

**Decision**:

- New molecule: `src/components/molecules/HighlightCard/index.tsx` — one point, built on the `Card`
  atom.
- `src/blocks/HighlightPointsBlock/Component.tsx` stays a Server Component: it maps points onto
  `HighlightCard` and renders the header.
- No `.client.tsx` file is introduced.

**Rationale**: Nothing here needs state, effects, or browser APIs, so Principle II's `.client.tsx`
rule does not trigger and the Technology Stack Constraint "Server Components are the default" holds.
`SkillsBlock` and `ExperienceBlock` use `.client.tsx` only because they were split for data fetching;
this block receives its content as props and needs no such split.

**Test placement**: `tests/unit/**/*.unit.spec.{ts,tsx}` is now collected by Vitest
(`vitest.config.mts`), and `vitest.setup.ts` calls Testing Library's `cleanup()` after each test.
Before this feature, no glob picked up component specs. This is the mechanism R7's merge-order test
and R6's column-mapping tests depend on.

---

## R10: What Principle V requires of this change

**Context**: Principle V requires Payload collection behaviour to be covered by Vitest integration
tests under `tests/int/`, and exempts *purely presentational* changes from new tests. C1 turned this
into a schema change, so the exemption no longer covers the whole feature.

**Decision**: Two layers.

1. **Integration** (`tests/int/`) — create a Page whose layout contains a `highlightPointsBlock` with
   `label`, `title`, and points; read it back and assert the fields round-trip. Separately create one
   with `points` only and assert it still validates, which is FR-015's regression test.
2. **Component** (`tests/unit/`) — the column mapping per point count (R6), the empty/absent points
   case (FR-006), the `dt`/`dd` pairing (R7), and the `flex-col-reverse` merge-order assumption (R7).

**Rationale**: The schema half can only fail against a real Payload instance, and the rendering half
can only be exercised cheaply in isolation. Splitting them puts each assertion where it can actually
fail.

**Known blocker**: `node_modules/` in this checkout is owned by `root` and empty, so `pnpm install`
fails with `Permission denied` and neither suite can currently be run. Clearing it
(`sudo rm -rf node_modules && corepack pnpm install --ignore-workspace`) is a prerequisite for
`/speckit-implement`, not a task within it. Note also that `corepack` resolves pnpm `12.3.4` while
`package.json` `engines` pins `^9 || ^10`.

---

## R11: Verifying the contrast requirement

**Context**: FR-008 and SC-004 require WCAG 2.1 AA contrast in both themes, verified by automated
audit with zero violations. No such tooling exists in the repository — `@axe-core/playwright` is not a
dependency, and there is no `test:a11y` script.

**Decision**: Compute the two ratios by hand as part of implementation and record them in the
quickstart. Do **not** add an axe dependency in this feature.

**Rationale**: R4 established that the card's colours are theme-invariant, so there are exactly two
pairs to check — figure and label, each against `--card`. Two hand-verified ratios settle FR-008
completely. Introducing `@axe-core/playwright` means a new devDependency, a new Playwright spec, and a
baseline triage of the whole existing page — which will surface pre-existing violations unrelated to
this section and would either block this feature or force the new check to ship already failing.

**Deferred**: a repository-wide accessibility check is worth having and is recorded as follow-up, not
dropped. SC-004's phrase "verified by automated contrast audit" is therefore only partially satisfied
by this feature; `plan.md` records the deviation.

**Reference values** to verify during implementation, from `globals.css:79-117`:

| Foreground | Background | Required |
|---|---|---|
| `--primary` `#00D4AA` (figure) | `--card` `#102122` | ≥ 4.5:1 (or ≥ 3:1 if rendered ≥ 24px) |
| `--card-foreground` `#d0d0d0` at the chosen opacity (label) | `--card` `#102122` | ≥ 4.5:1 |

The label's opacity is the one free variable. `CardList` uses `opacity-60`; if `#d0d0d0` at 60% over
`#102122` misses 4.5:1, raise the opacity for this block rather than change the colour token.
