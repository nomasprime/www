# Repository Guidelines

## Project Overview

This is an Astro 6 static blog/template project using Tailwind CSS 4, React islands, shadcn-style UI components, MDX content collections, and the Cloudflare adapter.

## Common Commands

- `pnpm dev` starts the local development server on port `1234`.
- `pnpm build` runs `wrangler types`, `astro check`, and `astro build`.
- `pnpm test` runs Vitest followed by Playwright.
- `pnpm test:watch` starts Vitest in watch mode.
- `pnpm test:e2e` runs the Playwright suite.
- `pnpm prettier:check` checks formatting.
- `pnpm prettier` formats the project.

## Code Organization

- Pages live in `src/pages/`.
- Layouts live in `src/layouts/`.
- Astro and React components live in `src/components/`.
- Shared utilities live in `src/lib/`.
- Site configuration and navigation data live in `src/consts.ts`.
- Content collections live in `src/content/`.
- Global styles live in `src/styles/`.
- Unit and component tests live in `tests/`.

## Development Notes

- Prefer existing Astro, Tailwind, and shadcn-style patterns already present in the repo.
- Keep UI changes restrained and content-focused; this template favors minimal, readable blog interfaces.
- Use existing UI components from `src/components/ui/` before adding new primitives.
- For content changes, follow the schemas in `src/content.config.ts`.
- Do not edit generated Wrangler type files unless the user explicitly asks.
- Preserve unrelated user changes in the working tree.

## Verification

- For narrow component or utility changes, run the relevant Vitest test when possible.
- For routing, layout, or interaction changes, run `pnpm test:e2e` when practical.
- For broad changes, run `pnpm build` before handing off.
