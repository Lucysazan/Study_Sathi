# Implementation Log

Append-only record of code changes. One line per meaningful change, grouped by date. Link the commit hash when available.

Format: `- [phase.task] <what changed> — <files> — <why> (<commit>)`

---

## 2026-11-04
- [docs] Created project documentation and agent protocol — CLAUDE.md, README.md, docs/* — starting point for Next.js migration (no commit yet)
- [0.1] Copied Vite prototype into `legacy/` unchanged (dist/ excluded) — legacy/* — read-only reference for the port (bebf59c)
- [0.2] Scaffolded Next.js 16.4 (App Router, TS strict + noUncheckedIndexedAccess, src/, `@/` alias, Tailwind v4); added Prettier, Vitest, eslint-config-prettier; scripts dev/build/lint/typecheck/test/format — package.json, tsconfig.json, eslint.config.mjs, vitest.config.ts, .prettierrc.json, .gitattributes — Phase 0 foundation; `legacy/` excluded from TS/ESLint/Prettier
- [0.2] Added `mainNav` + `isActivePath()` with unit tests — src/lib/nav.ts — shared nav data for Navbar/Footer
- [0.3] Ported full prototype stylesheet into globals.css in original order; core + category colours, focus colour and heading font replaced by tokens; added LMS extension tokens and Tailwind `@theme inline` mapping (`bg-primary`, `text-muted`, `font-display`…) — src/app/globals.css — single source of truth for the look; whole file ported (not just base) because rule order matters
- [0.3] Fonts via next/font/google (Inter, Plus Jakarta Sans; self-hosted, `--font-inter`/`--font-jakarta`) and site metadata with title template — src/app/layout.tsx — replaces the Google Fonts <link> in legacy/index.html
