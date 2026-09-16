# Contract: Highlight Points Block

**Feature**: `001-highlight-points-design` | **Date**: 2026-09-06

Two interfaces cross a boundary in this feature: the **CMS authoring contract** (what an editor sees
and fills in) and the **component contract** (what the block hands to the presentational tier). Both
are consumed by code outside the files this feature edits, so both are pinned here.

---

## 1. CMS authoring contract

**Block slug**: `highlightPointsBlock` — unchanged. Changing it would orphan every stored document
that references it.

**Interface name**: `HighlightPointsBlockType` — unchanged.

### Editor-visible fields, in admin order

| Order | Field | Type | Required | Editor sees |
|---|---|---|---|---|
| 1 | `label` | `text` | No | Small eyebrow line shown above the title. |
| 2 | `title` | `text` | No | Section heading. |
| 3 | `points` | `array` | Yes | The highlight figures. |
| 3.1 | `points[].title` | `text` | Yes | The figure — e.g. `+5`, `100%`. |
| 3.2 | `points[].subtitle` | `text` | Yes | What the figure counts — e.g. `Years of experience`. |

`label` and `title` are placed **before** `points`, matching the field order in
`SkillsBlock/config.ts` and `ExperienceBlock/config.ts`, so the three blocks read the same way in the
admin.

### Guarantees

- **G1** — A document saved before this change, carrying `points` and neither new field, remains
  valid and saveable with no editor action. (FR-015)
- **G2** — Both new fields accept empty. Neither has a `defaultValue`, so a newly created block starts
  blank rather than pre-filled with placeholder copy.
- **G3** — The block slug, the interface name, and the shape of `points` are unchanged, so no other
  block, seed, or query needs touching.

### Compatibility

Adding optional fields is backward compatible in both directions: older stored documents satisfy the
new schema, and a document authored with the new fields still renders under the old component (the
extra props are ignored). No coordinated deploy is required.

---

## 2. Component contract

### `HighlightPointsBlockComponent`

**Location**: `src/blocks/HighlightPointsBlock/Component.tsx` (Server Component — see research R9)

**Props**: `HighlightPointsBlockType`, from `@/payload-types`. Never re-declared by hand
(Constitution Principle III).

**Behaviour**:

| Input | Required output |
|---|---|
| `points` is a non-empty array | One card per point, in array order, inside a `<section>`. |
| `points` is `[]`, `null`, or `undefined` | Renders `null`. Not an empty `<section>`, not a bordered shell. (FR-006) |
| `label` and `title` both empty/`null` | Points render with no heading area and no residual gap. (FR-014) |
| `label` set, `title` empty | Label renders alone; no empty slot where the title would be. |
| `title` set, `label` empty | Title renders alone. |

"Empty" means `null`, `undefined`, or `''`. Payload's generated optionals are `string | null |
undefined`, so a check that only tests for `undefined` will pass on `null` and render an empty
heading.

**Column count** is derived from `points.length` per the table in research R6. The mapping must
produce complete literal class strings — a template such as `` `grid-cols-${n}` `` produces no CSS,
because Tailwind v4 scans source text.

### `HighlightCard`

**Location**: `src/components/molecules/HighlightCard/index.tsx` (new — molecule tier, Principle II)

**Props**:

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `figure` | `string` | Yes | The headline value. Maps from `points[].title`. |
| `label` | `string` | Yes | What the figure counts. Maps from `points[].subtitle`. |
| `className` | `string` | No | Merged onto the underlying `Card`. |

Named `figure`/`label` rather than `title`/`subtitle` deliberately: the block already has a
section-level `title`, and reusing that word one scope down is the naming hazard called out in
`data-model.md`.

**Rendered structure**:

```
<div>                          ← one dl row; grid child
  <Card variant="highlight" className="flex-col-reverse">
    <dt>{label}</dt>           ← DOM first, visually second
    <dd>{figure}</dd>          ← DOM second, visually first
  </Card>
</div>
```

**Guarantees**:

- **G4** — `dt` precedes `dd` in the DOM; the figure-first appearance comes from `flex-col-reverse`,
  a purely visual reorder that leaves the accessibility tree in reading order. (FR-007)
- **G5** — The card uses `variant="highlight"` with no added border, radius, or surface colour. Every
  colour resolves to an existing token. (FR-003, FR-016)
- **G6** — The figure is `text-primary`; the label is `text-card-foreground` at reduced opacity, so
  the figure dominates. (FR-002, research R5)
- **G7** — Cards in a row share a height. Grid stretch handles this; nothing sets an explicit height.
  (FR-010)

**Merge-order dependency**: `Card` hardcodes `flex flex-col` (`atoms/Card/index.tsx:5`).
`flex-col-reverse` arrives via `className` and wins only because `Card` composes through `cn()`
(tailwind-merge). This is a real dependency on merge behaviour, not on cascade order — it needs a test
that fails if `Card` stops using `cn()` or the class is dropped.

### Unchanged consumer

`src/blocks/RenderBlocks.tsx:36` maps `highlightPointsBlock` to this component and wraps every block
in `<div className="my-16">`. Neither the mapping nor the wrapper changes. The block drops its own
`py-16` and relies on that wrapper (research R8).

---

## 3. What this contract does not cover

- The `NN / 07` counter and the `ls ./projects · N entries` line in `ProjectsBlock` are pre-existing
  hardcoded copy (Principle I violations). Not replicated, not fixed here (research R2).
- The double vertical spacing (`my-16` wrapper plus per-block `py-16`) is fixed for this block only.
  `ProjectsBlock` and `AboutBlock` keep it (research R8).
- No repository-wide accessibility audit tooling is added. FR-008 is discharged by two hand-computed
  contrast ratios recorded in `quickstart.md` (research R11).
