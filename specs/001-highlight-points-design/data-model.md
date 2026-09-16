# Phase 1 Data Model: Highlight Points Section Design

**Feature**: `001-highlight-points-design` | **Date**: 2026-09-06

This feature adds two optional section-level fields to an existing Payload block. No collection is
created, no relationship is added, and no stored document needs migrating.

---

## Entity: Highlight Points Section

The Payload block `highlightPointsBlock`, defined in `src/blocks/HighlightPointsBlock/config.ts` and
embedded in the `layout` array of the `pages` collection.

### Fields

| Field | Type | Required | Default | Change |
|---|---|---|---|---|
| `label` | `text` | No | none | **New** |
| `title` | `text` | No | none | **New** |
| `points` | `array` | Yes | none | Unchanged |

**`label`** — a short eyebrow line above the title. Occupies the slot where `ProjectsBlock` renders
its hardcoded `03 / 07` counter (see research R2). Admin description should state its purpose,
matching how `ExperienceBlock/config.ts:9` documents its own `label`.

**`title`** — the section's name. Rendered in uppercase mono accent, following the visual treatment in
`ProjectsBlock/Component.tsx:31-38`.

**Why both are optional**, against the sibling blocks' `required: true`: a required field does not
retroactively populate documents already in the database, so requiring `title` would leave the
existing home page unsaveable until an editor filled it in, and would break `pnpm seed:data` against
a fresh database. Full reasoning in research R3. FR-015 depends on this choice.

### Nested entity: Highlight Point

The `points` array. **Unchanged by this feature** — reproduced here because the renderer's contract
depends on it.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `text` | Yes | The figure — the headline value (`+5`, `100%`, `10.000+`). Free text, so prefixes and suffixes are editor-authored. |
| `subtitle` | `text` | Yes | The label naming what the figure counts. |
| `id` | `text` | auto | Payload-generated array row id. Used as the React key. |

**Naming hazard**: the array row's `title` is the *figure*, while the new section-level `title` is the
*heading*. Two different things one field name apart, both reachable in the same component scope.
Destructure the section fields explicitly at the block boundary and pass the point through as a whole
object rather than spreading it.

**Ordering** is meaningful and is the array's stored order. Nothing re-sorts it.

**No validation is added.** `points` stays `required: true` at the schema level; the renderer must
still tolerate an empty or absent array, because a draft can reach it (FR-006).

---

## Generated types

After `pnpm generate:types`, `src/payload-types.ts:933` changes from:

```ts
export interface HighlightPointsBlockType {
  points: { title: string; subtitle: string; id?: string | null }[]
  id?: string | null
  blockName?: string | null
  blockType: 'highlightPointsBlock'
}
```

to the same interface with two added optional fields:

```ts
  label?: string | null
  title?: string | null
```

`HighlightPointsBlockTypeSelect` gains the matching `label?: T` and `title?: T` entries, mirroring
`SkillsBlockTypeSelect` at `src/payload-types.ts:1791`.

Per Constitution Principle I the regenerated file is committed in the same change as the schema edit.
Per Principle III it is consumed as generated — never re-declared by hand.

**Note the `| null`**: Payload's generated optionals are `string | null | undefined`, not just
optional. The renderer's emptiness checks must treat `null`, `undefined`, and `''` alike; a plain
`!== undefined` check passes for `null` and renders an empty heading, which FR-014 forbids.

---

## Stored content affected

| Location | Current state | After |
|---|---|---|
| `pages` document `home`, `layout[1]` | `points` only | Unchanged until an editor adds a label or title. Renders exactly as before (FR-015). |
| `src/scripts/seed-data.ts:355-362` | `points` only | Gains `label` and `title` so a fresh seed shows the finished design. |
| `src/endpoints/seed/home.ts` | Does not use this block | Unchanged. |

**Both seed paths must still load.** Constitution Development Workflow names three entry points
(`pnpm seed:admin`, `pnpm seed:data`, `POST /next/seed`); a schema change is incomplete until all
three still succeed against a fresh database. Because both new fields are optional, none of them can
break — but this must be confirmed rather than assumed.

---

## No migration

Adding optional columns to a Payload block requires no data migration. The SQLite adapter creates the
columns on next boot; existing rows read back `null`, which FR-015 already requires the renderer to
handle. Nothing in this feature depends on SQLite-specific behaviour, per the Technology Stack
Constraint that keeps the adapter swappable.
