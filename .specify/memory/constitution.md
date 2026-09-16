<!--
SYNC IMPACT REPORT
Version change: 1.1.1 → 1.2.0
Rationale: MINOR. New materially expanded guidance — the Development Workflow
section gains a "Codebase Search and Exploration" subsection making the
`code-index` MCP server the required tool for locating files, symbols, and
usages in this repository, with native shell search demoted to a declared
fallback. No existing requirement was removed or redefined.

Prior history:
  1.1.1 — PATCH. Principle II rationale reworded; no requirement changed.
  1.1.0 — MINOR. Persistence recorded as provisional rather than a settled
    constraint; seed rule expanded from one entry point to all three.
  1.0.0 (2026-09-05) — initial ratification from the unresolved template
    scaffold.

Added sections (1.2.0):
  Development Workflow → Codebase Search and Exploration

Modified sections (1.2.0):
  Principle II. Atomic Design Component Boundaries — rationale now refers to an
    index-wide symbol search rather than "a single grep", to stay consistent
    with the new search rule. The rule itself is unchanged.

Modified sections (1.1.1):
  Principle II. Atomic Design Component Boundaries — rationale reworded; the
    rule itself is unchanged.

Modified sections (1.1.0):
  Technology Stack Constraints — "Payload 3 on the SQLite adapter" restated as
    a provisional local-development choice with an undecided target; the
    .env.example / payload.config.ts mismatch recorded as known debt.
  Development Workflow — seed rule expanded from `pnpm seed:data` alone to all
    three entry points (seed:admin, seed:data, POST /next/seed).

Principles (unchanged since 1.0.0):
  I. Payload-First Content Modeling
  II. Atomic Design Component Boundaries
  III. Type Safety Is Enforced, Not Advisory
  IV. Explicit Access Control
  V. Verified Before Merged

Removed sections: none

Deferred items:
  TODO(RATIFICATION_DATE): Recorded as 2026-09-05, the date this constitution
  was first adopted. The repository itself dates from 2026-03-22; if governance
  is considered to apply retroactively from first commit, amend this date.
  TODO(DATABASE_TARGET): The production persistence layer is undecided. SQLite
  is in use for local development only. Amend Technology Stack Constraints once
  the target is chosen, and reconcile .env.example in the same change.
-->

# Mogami Transformative Portfolio Constitution

## Core Principles

### I. Payload-First Content Modeling

Every piece of user-visible content MUST originate from a Payload collection, global, or block
schema. Components render content; they do not author it. Adding a content surface means adding
or extending a collection under `src/collections/`, a global (`src/Header`, `src/Footer`), or a
block under `src/blocks/` — never hardcoding copy, lists, or media paths into a React component.
Any schema change MUST be followed by `pnpm generate:types`, and the regenerated `payload-types`
committed alongside it.

Rationale: the portfolio's value is that its owner can edit it without a deploy. Content baked
into components silently revokes that capability and cannot be recovered without a refactor.

### II. Atomic Design Component Boundaries

Presentational components live under `src/components/` in exactly four tiers: `atoms/`
(primitives), `molecules/` (composed atoms), `organisms/` (complex sections), and `ui/`
(shadcn/ui primitives, which MUST NOT be relocated or restructured). A component MUST import
peers through the `@/components/<tier>/...` alias, never by relative traversal across tiers.
Components requiring browser APIs or hooks MUST carry the `.client.tsx` suffix. Payload admin
components belong in `src/payload/components/`, not in the atomic tiers.

Rationale: the alias makes a component's tier visible at every point of use, which keeps the
dependency direction (atoms ← molecules ← organisms) enforceable and lets a single index-wide
search enumerate every consumer before a change. Relative traversal across tiers hides both.

### III. Type Safety Is Enforced, Not Advisory

TypeScript `strict` mode MUST remain enabled. Payload document shapes MUST be consumed via the
generated types from `payload-types`, never re-declared by hand. `any` is prohibited in committed
code; where a type genuinely cannot be expressed, use `unknown` plus a narrowing guard and a
comment naming the reason. `pnpm lint` MUST pass with zero errors before a change is considered
complete.

Rationale: generated types are the only mechanism that keeps the CMS schema and the rendering
layer in agreement. A hand-written duplicate or an `any` breaks that link without failing a build.

### IV. Explicit Access Control

Every collection and global MUST declare its `access` explicitly using the shared helpers in
`src/access/` (`anyone`, `authenticated`, `authenticatedOrPublished`). Relying on Payload's
defaults is prohibited. Draft and unpublished content MUST NOT be reachable without
authentication or a valid `PREVIEW_SECRET`. Secrets (`PAYLOAD_SECRET`, `CRON_SECRET`,
`PREVIEW_SECRET`, `DATABASE_URL`) MUST be read from the environment only; they MUST NOT appear in
source, seed data, or committed configuration, and any new secret MUST be added to `.env.example`
with a placeholder value.

Rationale: this is a publicly deployed CMS with an admin panel. An unset access rule is a public
read, and an omitted `.env.example` entry is a production outage or a leak.

### V. Verified Before Merged

Behavior changes MUST be covered at the level where they can actually fail: Payload collection,
access, and endpoint behavior by Vitest integration tests under `tests/int/`; navigation, admin
login, and rendered-page behavior by Playwright specs under `tests/e2e/`. A change that alters
either surface MUST leave `pnpm test` green. Bug fixes MUST add the regression test that
reproduces the bug before the fix lands. Purely presentational styling changes are exempt from
new tests but MUST NOT break existing ones.

Rationale: the integration and e2e suites are the only checks that exercise the CMS and the
rendered site together, which is precisely where this stack's failures occur.

## Technology Stack Constraints

- Runtime and framework: Next.js 16 App Router with React 19. Server Components are the default;
  a component becomes a Client Component only when it needs state, effects, or browser APIs.
- CMS: Payload 3. All `@payloadcms/*` packages and `payload` itself MUST be pinned to the exact
  same version; upgrading one means upgrading all of them in a single change.
- Persistence is PROVISIONAL and is not a settled constraint of this project. Development
  currently runs on `@payloadcms/db-sqlite` against a local, gitignored database file
  (`*.db`); the production target is undecided — see TODO(DATABASE_TARGET). Because of this:
  - Code MUST NOT depend on SQLite-specific behavior. No raw SQL, no reliance on SQLite type
    affinity or its collation and `LIKE` case-sensitivity rules, no assumptions about autoincrement
    id semantics. Query through Payload's Local API and query layer so the adapter stays swappable.
  - The local database file is disposable. It MUST NOT be committed, and it MUST NOT be the only
    place any content exists — anything that must survive a reset belongs in the seed
    (`src/endpoints/seed/`).
  - `.env.example` currently documents `DATABASE_URL` as a MongoDB or Postgres connection string
    while `src/payload.config.ts` configures the SQLite adapter. This mismatch is known debt and
    MUST be reconciled in the same change that decides the target.
- Package manager: pnpm, per the `engines` field. Node MUST satisfy `^18.20.2 || >=20.9.0`.
  `package-lock.json` and `yarn.lock` MUST NOT be introduced.
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`. Ad-hoc global CSS files are prohibited;
  shared design decisions belong in the Tailwind layer or in `src/components/ui/`.
- New runtime dependencies MUST be justified in the change that adds them: what it does, why an
  existing dependency or the platform cannot. A dependency added for a single utility function
  SHOULD be replaced by that function in `src/utilities/`.

## Development Workflow

- Git commits use a subject line only — no body, no description, no `Co-Authored-By` footer.
- Before a change is complete: `pnpm lint` passes, `pnpm generate:types` has been run if any
  Payload schema changed, and `pnpm test` passes for behavior changes.
- Feature work follows the Spec Kit flow — `/speckit-specify` → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement`. Specs and plans are artifacts of record; a plan that
  diverges from what was built MUST be updated, not abandoned.
- Seed data MUST stay loadable through every entry point that exposes it. There are three, and a
  schema change is incomplete until all three still succeed against a fresh database:
  - `pnpm seed:admin` — `src/scripts/seed-admin.ts`, creates the first admin user.
  - `pnpm seed:data` — `src/scripts/seed-data.ts`, loads content.
  - `POST /next/seed` — `src/app/(frontend)/next/seed/route.ts`, invoked by the SeedButton in
    `src/payload/components/BeforeDashboard/`, sharing the fixtures in `src/endpoints/seed/`.

  There is deliberately no combined "seed all" command. If one is introduced, it MUST compose the
  existing scripts rather than duplicate their logic, and this list MUST be amended.

### Codebase Search and Exploration

The `code-index` MCP server is the required entry point for locating anything in this repository.
Before editing, extending, or removing code, the relevant files and symbols MUST be located
through it rather than by shell traversal:

- `find_files` to locate files by glob or filename.
- `search_code_advanced` to find usages, identifiers, and text across the repository.
- `get_file_summary` and `get_symbol_body` to inspect a single function, type, or class.

Native shell search and traversal — `find`, `grep`/`rg`, `ls -R`, `cat` for discovery — MUST NOT
be the first move. They are a declared fallback, permitted only when the index genuinely cannot
answer the query (for example searching untracked build output, git history, or files outside the
indexed project root), and the change or response that relies on one SHOULD say which limitation
forced it. This restricts exploration only; shell commands remain unrestricted inside scripts,
tooling, and `package.json` where they are part of the program rather than a way of reading it.

Whole files MUST NOT be read to confirm a single method signature, type, or import — request the
symbol. Reading a file in full is appropriate when the change actually spans it.

The index MUST be treated as state, not as ground truth. After files are added, renamed, moved, or
deleted, `refresh_index` MUST be run before trusting a subsequent search, and a result that
contradicts the working tree MUST be re-verified against the file before it is acted on.

Rationale: this repository's structure is its main source of ambiguity — four component tiers,
generated `payload-types`, blocks, collections, and globals all contain similarly named symbols.
An indexed symbol lookup answers "where is this actually defined and who consumes it" in one step,
where recursive text search returns generated duplicates and near-matches that invite edits to the
wrong tier or to a regenerated file. The fallback exists because an index that is stale or blind
to a path is worse than no index if it is trusted blindly.

## Governance

This constitution supersedes conflicting conventions in ad-hoc documentation, prior habit, or
tooling defaults. Where `CLAUDE.md` and this document overlap, they MUST agree; a change to one
that contradicts the other MUST update both in the same change.

Amendments are made by editing this file through `/speckit-constitution`. Every amendment MUST
carry a version bump and a Sync Impact Report at the top of the file. Versioning is semantic:
MAJOR for removing or redefining a principle in a backward-incompatible way, MINOR for adding a
principle or materially expanding guidance, PATCH for clarifications and wording that do not
change what is required.

Compliance is verified at review time. A change that violates a principle MUST either be revised
or accompanied by an explicit, written justification for the exception — and a recurring
exception is evidence the principle needs amending, not repeated waiving. Runtime development
guidance for agents lives in `CLAUDE.md`.

**Version**: 1.2.0 | **Ratified**: 2026-09-05 | **Last Amended**: 2026-09-16
