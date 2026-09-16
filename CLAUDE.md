# Project: mogami-transformative-portfolio

## Docs

- Payload CMS full docs: https://payloadcms.com/llms-full.txt

## Stack

- Next.js 16 (App Router) with React 19 — Server Components are the default; a component becomes a
  Client Component only when it needs state, effects, or browser APIs.
- Payload CMS 3 — all `@payloadcms/*` packages and `payload` itself stay pinned to the exact same
  version; upgrading one means upgrading all of them in a single change.
- TypeScript (`strict`)
- Tailwind CSS v4 via `@tailwindcss/postcss` — ad-hoc global CSS files are prohibited; shared design
  decisions belong in the Tailwind layer or in `src/components/ui/`.
- pnpm, per the `engines` field. Node must satisfy `^18.20.2 || >=20.9.0`. Never introduce
  `package-lock.json` or `yarn.lock`.

New runtime dependencies must be justified in the change that adds them: what it does, and why an
existing dependency or the platform cannot. A dependency added for a single utility function should
be replaced by that function in `src/utilities/`.

### Persistence is provisional

Development runs on `@payloadcms/db-sqlite` against a local, gitignored `*.db` file. The production
target is undecided.

- Do not depend on SQLite-specific behavior: no raw SQL, no reliance on type affinity, collation or
  `LIKE` case-sensitivity, no assumptions about autoincrement id semantics. Query through Payload's
  Local API so the adapter stays swappable.
- The local database file is disposable. It must not be committed, and it must not be the only place
  any content exists — anything that must survive a reset belongs in `src/endpoints/seed/`.
- Known debt: `.env.example` documents `DATABASE_URL` as a MongoDB or Postgres connection string
  while `src/payload.config.ts` configures the SQLite adapter. Reconcile this in the same change that
  decides the target.

## Core Principles

### Payload-first content modeling

Every piece of user-visible content originates from a Payload collection, global, or block schema.
Components render content; they do not author it. Adding a content surface means adding or extending
a collection under `src/collections/`, a global (`src/Header`, `src/Footer`), or a block under
`src/blocks/` — never hardcoding copy, lists, or media paths into a React component. Any schema
change is followed by `pnpm generate:types`, with the regenerated `payload-types` committed alongside
it.

The portfolio's value is that its owner can edit it without a deploy. Content baked into components
silently revokes that.

### Atomic Design component boundaries

Presentational components live under `src/components/` in exactly four tiers:

- `atoms/` — primitives (Toggle, Logo, MainButton, BackgroundGlow)
- `molecules/` — composed atoms (Media, Card, Link, Pagination, PageRange, AdminBar, HighlightCard)
- `organisms/` — complex sections (CollectionArchive, RichText, ViewToggle)
- `ui/` — shadcn/ui primitives, which must not be relocated or restructured

A component imports peers through the `@/components/<tier>/...` alias, never by relative traversal
across tiers. Components requiring browser APIs or hooks carry the `.client.tsx` suffix. Payload
admin components belong in `src/payload/components/` (BeforeDashboard, BeforeLogin,
LivePreviewListener, PayloadRedirects), not in the atomic tiers. Blocks live in `src/blocks/`.

The alias makes a component's tier visible at every point of use, which keeps the dependency
direction (atoms ← molecules ← organisms) enforceable and lets a single index-wide search enumerate
every consumer before a change.

### Type safety is enforced, not advisory

Payload document shapes are consumed via the generated types from `payload-types`, never re-declared
by hand. `any` is prohibited in committed code; where a type genuinely cannot be expressed, use
`unknown` plus a narrowing guard and a comment naming the reason. `pnpm lint` passes with zero errors
before a change is complete.

Generated types are the only mechanism keeping the CMS schema and the rendering layer in agreement.

### Explicit access control

Every collection and global declares its `access` explicitly using the shared helpers in
`src/access/` (`anyone`, `authenticated`, `authenticatedOrPublished`). Relying on Payload's defaults
is prohibited. Draft and unpublished content must not be reachable without authentication or a valid
`PREVIEW_SECRET`. Secrets (`PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET`, `DATABASE_URL`) are
read from the environment only; they must not appear in source, seed data, or committed
configuration, and any new secret is added to `.env.example` with a placeholder value.

This is a publicly deployed CMS with an admin panel. An unset access rule is a public read, and an
omitted `.env.example` entry is a production outage or a leak.

### Verified before merged

Behavior changes are covered at the level where they can actually fail: Payload collection, access,
and endpoint behavior by Vitest integration tests under `tests/int/`; navigation, admin login, and
rendered-page behavior by Playwright specs under `tests/e2e/`. A change that alters either surface
leaves `pnpm test` green. Bug fixes add the regression test that reproduces the bug before the fix
lands. Purely presentational styling changes are exempt from new tests but must not break existing
ones.

## Development Workflow

- Before a change is complete: `pnpm lint` passes, `pnpm generate:types` has been run if any Payload
  schema changed, and `pnpm test` passes for behavior changes.
- Seed data stays loadable through every entry point that exposes it. There are three, and a schema
  change is incomplete until all three still succeed against a fresh database:
  - `pnpm seed:admin` — `src/scripts/seed-admin.ts`, creates the first admin user.
  - `pnpm seed:data` — `src/scripts/seed-data.ts`, loads content.
  - `POST /next/seed` — `src/app/(frontend)/next/seed/route.ts`, invoked by the SeedButton in
    `src/payload/components/BeforeDashboard/`, sharing the fixtures in `src/endpoints/seed/`.

  There is deliberately no combined "seed all" command. If one is introduced, it must compose the
  existing scripts rather than duplicate their logic, and this list must be amended.

## Git Commits

- No commit description/body — subject line only
- No Co-Authored-By footer

## Codebase Search and Exploration

The `code-index` MCP server is the required entry point for locating anything in this repository.
Before editing, extending, or removing code, locate the relevant files and symbols through it rather
than by shell traversal:

- `find_files` — files by glob or filename
- `search_code_advanced` — usages, identifiers, and text across the repository
- `get_file_summary` / `get_symbol_body` — a single function, type, or class

Native shell search and traversal — `find`, `grep`/`rg`, `ls -R`, `cat` for discovery — are NOT the
first move. They are a declared fallback, permitted only when the index genuinely cannot answer the
query (untracked build output, git history, paths outside the indexed project root), and the response
that relies on one should say which limitation forced it. This restricts exploration only; the shell
stays unrestricted inside scripts, tooling, and `package.json`, where it is part of the program rather
than a way of reading it.

Do not read whole files just to confirm a method signature, type, or import — request the symbol.
Read a file in full only when the change actually spans it.

The index is state, not truth: run `refresh_index` after adding, renaming, moving, or deleting files,
and re-verify against the file any result that contradicts the working tree.

This repository's structure is its main source of ambiguity — four component tiers, generated
`payload-types`, blocks, collections and globals all contain similarly named symbols. An indexed
symbol lookup answers "where is this defined and who consumes it" in one step, where recursive text
search returns generated duplicates and near-matches that invite edits to the wrong tier or to a
regenerated file.
