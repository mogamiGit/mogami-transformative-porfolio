# Quickstart: Validating the Highlight Points Section

**Feature**: `001-highlight-points-design` | **Date**: 2026-09-06

How to prove this feature works once it is built. Scenarios map to the requirements in
[`spec.md`](./spec.md); shapes and guarantees are in
[`contracts/highlight-points-block.md`](./contracts/highlight-points-block.md).

---

## Prerequisites

**Blocker — must be cleared first.** `node_modules/` in this checkout is owned by `root` and empty, so
every install fails with `Permission denied` and no suite can run:

```bash
sudo rm -rf node_modules
corepack pnpm install --ignore-workspace
```

Note that `corepack` resolves pnpm `12.3.4` while `package.json` `engines` pins `^9 || ^10`. If that
mismatch causes trouble, pin explicitly with `corepack pnpm@10 install --ignore-workspace`.

Then:

```bash
cp .env.example .env          # if absent; set PAYLOAD_SECRET and DATABASE_URL
corepack pnpm generate:types  # required — the schema changed
```

`.env.example` documents `DATABASE_URL` as a MongoDB/Postgres string while `src/payload.config.ts`
configures the SQLite adapter. This mismatch is known debt recorded in the constitution
(`TODO(DATABASE_TARGET)`); for local work point `DATABASE_URL` at a file path.

---

## Scenario 1 — Schema round-trips (FR-013, FR-015 · G1, G3)

The only part that can fail against a real database.

```bash
corepack pnpm test:int
```

**Expected**: green, including two new cases in `tests/int/`:

1. A page whose layout contains a `highlightPointsBlock` with `label`, `title`, and points saves and
   reads back with all three intact.
2. A page whose block carries `points` only — no `label`, no `title` — still validates and saves.
   This is FR-015's regression test; it fails if either field is made required.

---

## Scenario 2 — Rendering behaviour (FR-002, FR-005, FR-006, FR-007, FR-010)

```bash
corepack pnpm test:int   # tests/unit/ is collected by the same Vitest run
```

Component specs live under `tests/unit/**/*.unit.spec.{ts,tsx}`. That glob was added to
`vitest.config.mts` as part of this work — before it, no component spec was collected by anything.

**Expected**: green, covering

| Assertion | Requirement |
|---|---|
| Each point renders one `dt` (label) and one `dd` (figure), `dt` first in the DOM | FR-007 · G4 |
| `points: []` and `points: undefined` both render nothing | FR-006 |
| Column class matches the count mapping for 1, 2, 3, 4, 5, and 6 points | FR-005 · research R6 |
| Neither `label` nor `title` produces no heading element and no empty wrapper | FR-014 |
| `label` alone, and `title` alone, each render without an empty sibling slot | G-contract table |
| The card resolves to `flex-col-reverse`, not `flex-col` | research R7 merge-order dependency |
| Figure carries `text-primary`; label does not | FR-002 · G6 |

The `flex-col-reverse` case is the one most worth keeping: it depends on tailwind-merge resolving a
conflict inside the `Card` atom, and it breaks silently — the section still renders, just with the
label above the figure.

---

## Scenario 3 — Seeds still load (Constitution: Development Workflow)

A schema change is incomplete until every seed entry point still succeeds against a **fresh**
database. Both new fields are optional, so none of these can break — confirm rather than assume.

```bash
rm -f mogami-transformative-porfolio.db
corepack pnpm seed:admin
corepack pnpm seed:data
```

**Expected**: both exit clean. `src/scripts/seed-data.ts` now seeds this block with `label` and
`title` alongside its three points.

The third entry point is the SeedButton in the admin dashboard (`POST /next/seed`,
`src/app/(frontend)/next/seed/route.ts`). It seeds the original template home page and does not use
this block, so it is unaffected — but exercise it once to confirm.

---

## Scenario 4 — Visual check (FR-001, FR-003, FR-011, FR-016 · SC-001, SC-005)

```bash
corepack pnpm dev
```

Open `http://localhost:3000`. The section sits directly below the hero.

Confirm by eye:

- Each point is a **bordered card**: `--card` surface, `--primary` border, square corners (`--radius`
  is `0`). The figure is accent-coloured and clearly dominant; the label is held back.
- The section reads as belonging to the same system as the sections below. **No new colour appears** —
  every value resolves to a token from `globals.css:79-155`.
- The header shows the authored `label` and `title`, and **not** a `NN / 07` counter or an
  `ls ./… entries` line. Those are `ProjectsBlock`'s hardcoded copy and are deliberately not
  reproduced (research R2).
- **Expected difference**: this section's outer spacing will not exactly match `ProjectsBlock`'s. This
  block now relies on the `my-16` wrapper alone, while `ProjectsBlock` still adds its own `py-16` on
  top. Intentional — see research R8.

Then clear both fields in the admin and reload: the points must render with **no empty heading area
and no residual gap** (FR-014).

---

## Scenario 5 — Responsive and point-count behaviour (FR-004, FR-005 · SC-002, SC-003)

With `pnpm dev` running, use responsive mode.

**Widths** — at 320, 375, 768, 1280, and 1920px confirm: no horizontal scrollbar, no clipped text, no
overlap, and every card in a row the same height.

**Counts** — in the admin, vary the block between 1 and 6 points, reloading each time:

| Points | Expected at desktop width |
|---|---|
| 1 | One card, constrained — **not** stretched across the full content width |
| 2 | Two side by side |
| 3 | Three across, no empty fourth cell (the current defect) |
| 4 | Four across |
| 5 | Three then two |
| 6 | Three then three |

Then set a label noticeably longer than the others and confirm the row keeps a shared height
(FR-010), and enter a long figure such as `10.000+` and confirm it stays on one line without
overflowing (spec edge case).

---

## Scenario 6 — Accessibility (FR-007, FR-008 · SC-004, SC-007)

**Pairing** — inspect the DOM: the group is a `<dl>`, each point a `<div>` holding one `<dt>` and one
`<dd>`, with `dt` first. With a screen reader, each point announces as a single statement — no
orphaned numbers.

**Contrast** — R4 established the card's colours are identical under `:root` and `[data-theme='dark']`,
so there are exactly two ratios to compute, once:

| Foreground | Background | Threshold |
|---|---|---|
| `--primary` `#00D4AA` (figure) | `--card` `#102122` | ≥ 4.5:1, or ≥ 3:1 if rendered ≥ 24px |
| `--card-foreground` `#d0d0d0` at its chosen opacity (label) | `--card` `#102122` | ≥ 4.5:1 |

Record both measured ratios in the implementation PR. If the label misses 4.5:1, **raise its opacity**
— do not change the colour token, which is shared.

**Coverage limit, stated plainly**: SC-004 asks for an automated audit with zero violations. This
feature does not add one. `@axe-core/playwright` is not a dependency, and adding it would surface
pre-existing violations across the whole page that are unrelated to this section. Two hand-computed
ratios discharge FR-008 for this section; a repository-wide audit is deferred follow-up, recorded in
`plan.md`'s Complexity Tracking.

---

## Scenario 7 — Nothing else regressed (Constitution Principle V)

```bash
corepack pnpm lint          # must pass with zero errors (Principle III)
corepack pnpm test          # test:int then test:e2e
```

**Known pre-existing failure, not caused by this feature**: `tests/e2e/frontend.e2e.spec.ts` asserts
the home page title and `h1` are `Payload Website Template`. That copy comes from
`src/endpoints/seed/home.ts`, while `pnpm seed:data` seeds a portfolio home page whose heading is
"Building digital experiences that matter". The test therefore passes or fails depending on which seed
populated the database — following Scenario 3 will make it fail. Confirm this failure predates the
change (`git stash && corepack pnpm test:e2e`) rather than treating it as a regression.
