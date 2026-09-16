# Project: mogami-transformative-portfolio

## Docs

- Payload CMS full docs: https://payloadcms.com/llms-full.txt

## Stack

- Next.js 15 (App Router)
- Payload CMS 3
- TypeScript
- Tailwind CSS v4
- pnpm

## Component Architecture

Atomic Design pattern under `src/components/`:

- `atoms/` — primitives (Toggle, Logo, MainButton, BackgroundGlow)
- `molecules/` — composed atoms (Media, Card, Link, Pagination, PageRange, AdminBar)
- `organisms/` — complex sections (CollectionArchive, RichText, ViewToggle)
- `ui/` — shadcn/ui primitives, do not move

Payload CMS admin components live in `src/payload/components/`:
- BeforeDashboard, BeforeLogin, LivePreviewListener, PayloadRedirects

## Conventions

- Use `@/components/atoms/...`, `@/components/molecules/...`, `@/components/organisms/...` import paths
- Client components suffix: `Component.client.tsx`
- Blocks live in `src/blocks/`

## Git Commits

- No commit description/body — subject line only
- No Co-Authored-By footer

## Codebase Search and Exploration

See Constitution § Development Workflow → Codebase Search and Exploration.

- ALWAYS use the `code-index` MCP to locate files, functions, or classes before changing anything:
  - `find_files` — files by glob or filename
  - `search_code_advanced` — usages, identifiers, and text
  - `get_file_summary` / `get_symbol_body` — a single function, type, or class
- Native commands (`find`, `grep`/`rg`, `ls -R`, `cat` for discovery) are NOT the first move.
  They are a fallback, allowed only when the index cannot answer — untracked build output, git
  history, paths outside the indexed project root — and say which limitation forced it.
  This restricts exploration only; the shell stays unrestricted inside scripts, tooling, and
  `package.json`.
- Do not read whole files just to confirm a method or type — request the symbol. Read a file in
  full only when the change actually spans it.
- The index is state, not truth: run `refresh_index` after adding, renaming, moving, or deleting
  files, and re-verify against the file any result that contradicts the working tree.
