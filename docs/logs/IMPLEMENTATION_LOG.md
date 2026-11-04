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
- [0.4] Ported Logo, Navbar (mobile menu closes on navigation and Escape, `aria-current`, `aria-controls`), Footer (year via `'use cache'`); root layout with skip link, header, `<main id="main">`, footer; placeholder home — src/components/layout/*, src/app/layout.tsx, src/app/page.tsx — Phase 0 shell
- [0.4] Read-only guest bookmark count from `studysathi-saved` via `useSyncExternalStore` + `parseSavedIds()` with tests — src/lib/saved/* — Navbar badge; save/unsave comes with the localStorage task
- [0.4] Ported CSS moved into `@layer components` so Tailwind utilities can override it; prototype `.container` renamed `.site-container` (Tailwind's own `.container` utility overrode it); Tailwind told not to scan legacy/ and docs/ — src/app/globals.css — found during visual check vs prototype
- [0.4] Removed "SIP prototype" from the footer copyright line (owner request) — src/components/layout/Footer.tsx
- [0.6] Copied seed data (`resources.json`, typed `learningPaths.ts`), added catalogue types and read helpers; ported `filters.ts` (identical behaviour) + field metadata and URL helpers, 13 new tests (age overlap, language rules, combined filters, URL round-trip) — src/data/*, src/types/catalog.ts, src/lib/filters.ts — Phase 0 data layer; Firestore swaps in behind `src/data/catalog.ts` in Phase 2
- [0.7] Guest storage: generic `createLocalStore` (useSyncExternalStore, cross-tab sync, in-memory fallback when storage is blocked) + stores for `studysathi-saved`/`-progress`/`-notes` (same keys as prototype), toast and storage notice; parsers with tests. Unknown saved IDs are now dropped individually (prototype discarded the whole list) — src/lib/storage/*, src/components/layout/GuestFeedback.tsx — guest bookmarks, progress and notes; replaces src/lib/saved/*
- [0.5] Shared components: CategoryIcon (+ category metadata), SaveButton, ResourceCard, ResourceGrid, PathCard, Empty, MissionBanner, SectionHeading, LearningArt (SVG extracted verbatim) — src/components/*, src/lib/categories.ts
- [0.5] Home page ported (hero, intro strip, categories, featured, paths, how it works, mission banner); same page height as prototype at 1280 and 360 px — src/app/page.tsx, src/components/home/*
- [0.5] Pages ported: Resources (query-string filters via native `history.replaceState`, local search state), Resource details, Learning paths, Path details (progress, notes, NPR 500 budget), Volunteers, Saved, About, Not found (real HTTP 404) — src/app/**, src/components/{resources,paths,ui}/* — Phase 0 parity
- [0.8] `generateStaticParams` + `generateMetadata` for resource and path details; per-page metadata; all 29 routes prerender as static — src/app/resources/[id], src/app/learning-paths/[id]
- [0.5] Budget maths extracted to pure functions with tests — src/lib/budget.ts
- [0.5] Copy: removed "prototype"/"proposed" wording (About intro, SDG paragraph, roadmap label "Available now", interface-language note, library catalogue note) following the owner's footer change; honesty statements kept — src/app/about/page.tsx, src/components/resources/ResourceLibrary.tsx
- [0.5] Filter panel id via `useId()`: Next 16 keeps visited pages mounted (hidden with React Activity), so fixed ids could repeat — src/components/resources/ResourceLibrary.tsx
- [0.9] Visual check: every page matches prototype height at 768 and 1280 px; 360 px matches except 17 px from the shorter catalogue note. Behaviour check (30 scripted checks, 3 runs): bookmarks + badge + toast, prototype data migration, search/filters/chips/reset, path progress/notes/budget persistence, blocked-storage notice — scratch scripts, not committed

## 2026-11-04 (Phase 1)
- [1.1] firebase.json (Auth 9099, Firestore 8080, UI 4000), .firebaserc (`demo-studysathi`), empty firestore.indexes.json, default-deny firestore.rules (public catalogue read; users read own doc and change only nickname/avatarId; server-only XP ledger; admin read-all); scripts `emulators`, `test:rules` — Phase 1 foundation
- [1.6] Rules test harness (`tests/rules`, `vitest.rules.config.mts`) with 10 tests run inside `firebase emulators:exec`; unit tests exclude them — tests/rules/*
- [1.2] Env validation with zod (client + server schemas, emulator defaults, private-key `\n` fix, refuses emulators in Vercel production) + 7 tests; lazy Firebase client (in-memory persistence, emulator connect) and server-only admin SDK (emulator hosts or service-account cert) — src/lib/env/*, src/lib/firebase/* — Phase 1 foundation; `.env.example` documents emulator-only local setup
- [1.3] Session layer: `createSession`/`clearSession` (httpOnly 7-day cookie, recent sign-in required, refresh tokens revoked on sign-out), `getCurrentUser` (verifySessionCookie with revocation check, request-deduped), `requireRole`/`requireUser`; `POST|DELETE /api/auth/session` (zod, same-origin check, returns role + needsSetup); `src/proxy.ts` cookie-presence redirect (Next 16 name for middleware) — src/lib/auth/*, src/app/api/auth/session/route.ts, src/proxy.ts
- [1.3] Pure role helpers + 6 tests: role homes, protected paths, open-redirect-safe `next` — src/lib/auth/roles.ts
- [1.4] Account writes shared by actions and scripts: `setUpAccount` (parent → role; creator applicant → no role + `requestedRole`), `assignRole` (claim + doc + audit log + token revocation); `completeSignup` server action — src/lib/auth/accounts.ts, src/lib/auth/actions.ts
