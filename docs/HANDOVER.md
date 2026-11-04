# Handover

> Rewrite this whole file at the end of every session. A new agent with no chat history must be able to continue from here.

**Last updated:** 2026-11-04 · **By:** Session 1 (Claude Code, claude-opus-5-5) · **Branch:** `main` (local only, no remote yet)

## Current state
- **Phase 0 is complete except the Vercel preview deploy** (needs the owner's Vercel account). Waiting for owner review.
- All public pages are ported and match the prototype: `/`, `/resources` (query-string filters), `/resources/[id]`, `/learning-paths`, `/learning-paths/[id]` (progress, notes, NPR 500 budget), `/volunteers`, `/saved`, `/about`, not-found. All 29 routes prerender as static HTML.
- Guest data uses the prototype's localStorage keys (`studysathi-saved`, `-progress`, `-notes`), so existing visitors keep their data.
- Catalogue data comes from `src/data/seed/*` through `src/data/catalog.ts`. Phase 2 swaps Firestore in behind those functions.
- Next.js 16.4.5, React 19.3, Tailwind 4.3, Vitest 5, Prettier 3; Next 16 defaults kept (ADR-008). Firebase not connected yet.
- Checks: lint ✅ · typecheck ✅ · 28 unit tests ✅ · build ✅.

## Code map
- `src/app/**` — routes. Server Components except where noted.
- `src/components/layout/` — Header, Navbar (client), Footer, Logo, GuestFeedback (toast + storage notice, client).
- `src/components/resources/` — ResourceCard (server) with SaveButton (client leaf), ResourceGrid, ResourceLibrary + FilterPanel (client), SavedList (client), CategoryIcon.
- `src/components/paths/` — PathCard, PathSteps + BudgetActivity (client).
- `src/components/ui/` — Empty, PageTitle, SectionHeading, MissionBanner. `src/components/home/` — HomeHero, LearningArt.
- `src/lib/` — `filters.ts`, `budget.ts`, `categories.ts`, `nav.ts`, `storage/` (`createLocalStore`, parsers, `guest-data.ts`). Tests sit next to the code (`*.test.ts`).

## Things the next agent must know
- **Read `AGENTS.md`**: this Next.js version differs from older training data. Check `node_modules/next/dist/docs/` before using a Next API.
- **Cache Components:** no raw `new Date()`/`Math.random()` in prerendered server components (Footer uses `'use cache'`). Client components using `usePathname`/`useSearchParams` sit in `<Suspense>` with a same-markup fallback (Header, ResourceLibrary).
- **Visited pages stay mounted but hidden** (React Activity, `display: none`). Don't use fixed element ids in page components (use `useId()`), and in browser tests count `:visible` elements only.
- **Changing filters** uses `window.history.replaceState` (Next's recommended way to update search params without a server round trip). The search text is local state that follows the URL.
- **CSS:** `globals.css` = tokens → Tailwind `@theme inline` → the full prototype stylesheet inside `@layer components` → section 4 "Additions" at the end. Use `site-container`, not `container` (Tailwind's own `container` utility clashes). The ported CSS styles **every** `<nav>` element like the header menu, so breadcrumbs and footer link groups are `<div>`s.
- Prettier ignores `*.md`. `.gitattributes` forces LF.
- Visual check method: serve the prototype's `dist/` (owner's `Downloads/SussanProject/StudySathi/dist`) with `npx http-server . -p 3124 -s --proxy http://localhost:3124?`, run `next start -p 3123`, and screenshot both with `playwright-core` + installed Edge from a scratch folder. In Git Bash, set `MSYS_NO_PATHCONV=1` when passing `/routes` as arguments.

## Behaviour changes vs the prototype (intentional)
- Copy: "SIP prototype" removed from the footer (owner request). About and the library note no longer say "prototype"/"proposed" (see Open questions).
- Unknown saved IDs are dropped one by one (the prototype discarded the whole list).
- Small accessibility additions: Escape closes the mobile menu, `aria-current` on nav links, `aria-controls` on toggles, decorative icons hidden from screen readers, Not found uses an `h1` and returns HTTP 404.

## In progress
- Nothing. Waiting for owner review.

## Next steps (in order)
1. Owner review, including the About copy question below.
2. Owner connects the repo to GitHub + Vercel → preview deploy (last Phase 0 item).
3. Phase 1: `firebase.json` + emulators, `firestore.rules` (default deny), `lib/firebase/client.ts` + `admin.ts`, env validation with zod (zod is not installed yet; it's in the CLAUDE.md stack).

## Open questions (defaults in use until the owner answers)
| Question | Default in use |
| --- | --- |
| About page: OK to drop "proposed"/"this prototype" wording (intro, SDG paragraph, roadmap label "Available now", "interface is in English for now")? | Reworded; honesty statements (no impact claims, no partners) kept |
| Can students aged 13–16 sign up themselves, or must every student be created by a parent? | Parent-created only |
| Where are course images/PDFs hosted? (Firebase Storage needs the paid Blaze plan) | Image URLs + YouTube/Vimeo embeds; Cloudinary free tier proposed in ADR-004 (pending) |
| Should the UI be bilingual (English/Nepali) from the start? | English first; keep strings in one place for later translation |
| Do volunteers/teachers need "classes" to group students? | Not in v1 |
| GitHub remote / Vercel project? | None yet; local commits only |

## Known issues / risks
- Firestore free-tier quotas: keep reads low (see ARCHITECTURE §6).
- `next build` warns about a stray `package-lock.json` in `C:\Users\DELL\Downloads` (outside the repo). Harmless.
- About says "No accounts or personal profiles are needed". That stays true for the public site, but revisit the wording when accounts arrive in Phase 1.
- Fonts are variable fonts, so weights like 650/750 render exactly (the prototype used static cuts). No visible difference in the comparisons.

## Environment notes
- Node 24.14, npm 11. Env vars in `README.md` / `.env.example` aren't needed until Phase 1.
- Commands: `npm run dev | build | lint | typecheck | test | format`.
