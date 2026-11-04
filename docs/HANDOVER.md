# Handover

> Rewrite this whole file at the end of every session. A new agent with no chat history must be able to continue from here.

**Last updated:** 2026-11-04 · **By:** Session 1 (Claude Code, claude-opus-5-5) · **Branch:** `main` (local only, no remote yet)

## Current state
- Phase 0 steps 1–4 are done and **waiting for owner review** (the owner asked to stop here).
- `legacy/` holds the Vite prototype, copied unchanged from the owner's `Downloads/SussanProject/StudySathi` (its `dist/` build was not copied). Its source is minified onto a few long lines; to read it, format a **copy** elsewhere (never edit `legacy/`).
- Next.js 16.4.5, React 19.3, Tailwind 4.3, Vitest 5, Prettier 3. `next.config.ts` keeps the Next 16 defaults: `cacheComponents`, `partialPrefetching`, `reactCompiler` (ADR-008).
- `src/app/globals.css`: tokens (`:root`) → Tailwind `@theme inline` mapping → the **whole** prototype stylesheet in original order inside `@layer components`.
- Root layout renders skip link, `Header` (Logo + Navbar), `<main id="main">`, `Footer`. Home is a placeholder.
- Firebase and Vercel are not connected yet.

## Things the next agent must know
- **Read `AGENTS.md`**: this Next.js version differs from older training data. Check `node_modules/next/dist/docs/` before using a Next API. `next dev` re-creates `AGENTS.md`; keep it committed.
- **Cache Components rules:** no raw `new Date()`, `Math.random()` etc. in prerendered server components (use `'use cache'` + `cacheLife`, or `connection()` + `<Suspense>`). Client components using `usePathname`/`useSearchParams` need a `<Suspense>` boundary (see `Header.tsx`).
- **CSS class names:** the prototype's `.container` is now `.site-container` (Tailwind's `.container` utility overrode it). Use `site-container` in every ported page. Other prototype class names were checked; none collide with generated utilities.
- The ported CSS styles **every** `<nav>`, `<header>` and `<footer>` element globally. Don't use `<nav>` for non-header link groups (the footer uses `<div>`s).
- Tailwind utilities can override ported CSS (it is layered), e.g. `mt-4` on a `<p>`. Tailwind does not scan `legacy/` or `docs/`.
- Prettier ignores `*.md` so docs stay as authored. `.gitattributes` forces LF.
- Guest bookmarks: `src/lib/saved/use-saved-ids.ts` is **read-only** (Navbar badge). Save/unsave, same-tab updates, the toast and the storage error notice come with the "Keep localStorage behaviour" task. `parseSavedIds` should then also drop unknown resource IDs (TODO in `parse.ts`).
- On `next start`/`dev`, 404s for `/resources`, `/about` etc. are expected: link prefetches to pages not built yet.
- Visual check method used: serve the prototype's built `dist/` (in the owner's SussanProject folder) with `npx http-server` and screenshot both apps with `playwright-core` + installed Edge, from a scratch folder (not a project dependency).

## In progress
- Nothing. Waiting for owner review of steps 1–4.

## Next steps (in order)
1. Owner review. Apply feedback.
2. Copy data into `src/data/seed/` (`resources.json`, `learningPaths.ts`) and types into `src/types/`; port `filters.ts` with unit tests.
3. Port shared components: CategoryIcon, ResourceCard, FilterPanel, Empty, LearningArt, PathCard.
4. Port pages one by one (Home first), checking each against the prototype at 360/768/1280 px.

## Open questions (defaults in use until the owner answers)
| Question | Default in use |
| --- | --- |
| Can students aged 13–16 sign up themselves, or must every student be created by a parent? | Parent-created only |
| Where are course images/PDFs hosted? (Firebase Storage needs the paid Blaze plan) | Image URLs + YouTube/Vimeo embeds; Cloudinary free tier proposed in ADR-004 (pending) |
| Should the UI be bilingual (English/Nepali) from the start? | English first; keep strings in one place for later translation |
| Do volunteers/teachers need "classes" to group students? | Not in v1 |
| Footer still says "© year StudySathi · SIP prototype". Keep it now that this is the real app? | Kept for parity with the prototype |
| GitHub remote for this repo? | None; local commits only |

## Known issues / risks
- Firestore free-tier quotas: keep reads low (see ARCHITECTURE §6).
- `next build` warns about a stray `package-lock.json` in `C:\Users\DELL\Downloads` (outside the repo). Harmless; deleting that file or setting `turbopack.root` would silence it.
- Fonts are now variable fonts, so weights like 650/750 render exactly. The prototype used static 400–800 cuts, so a few headings may look very slightly bolder or lighter. Not visible in the screenshots taken.

## Environment notes
- Node 24.14, npm 11. Required env vars are listed in `README.md` and `.env.example` (not needed until Phase 1).
- Commands: `npm run dev | build | lint | typecheck | test | format`.
