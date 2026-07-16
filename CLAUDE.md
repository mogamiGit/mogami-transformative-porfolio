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
