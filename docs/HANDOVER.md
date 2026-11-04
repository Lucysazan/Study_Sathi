# Handover

> Rewrite this whole file at the end of every session. A new agent with no chat history must be able to continue from here.

**Last updated:** 2026-11-04 · **By:** Session 2 (Claude Code, claude-opus-5-5) · **Branch:** `main` (local only, no remote yet)

## Current state
- **Phase 0 done** (except the Vercel preview, which needs the owner's account). **Phase 1 done.** Waiting for owner review before Phase 2.
- Public site: all pages ported from the prototype and fully static.
- Auth works end to end on the emulators:
  - `/login`: student username tab, plus parent/creator tab with email or Google.
  - `/signup`: parent or course-creator applicant.
  - `/account`.
  - Placeholder portals `/admin`, `/parent`, `/creator`, `/learn`, each with sign-out.
  - `npm run set-role` creates the first admin.
- No real Firebase project or Vercel project yet. Local development uses only the emulators.
- Checks: lint ✅ · typecheck ✅ · `npm run test` 50 ✅ · `npm run test:rules` 10 ✅ · build ✅.

## How to run it
1. `.env.local` contains `NEXT_PUBLIC_USE_EMULATORS=true` (already created on the owner's machine; it's gitignored).
2. Terminal 1: `npm run emulators` (Auth 9099, Firestore 8080, UI 4000). It needs Java; the owner has Java 25.
3. Terminal 2: `npm run dev` → http://localhost:3000. Sign up as a parent, then `npm run set-role -- you@example.com admin`, then log in again → `/admin`.

## Code map
- `src/app/**`: routes. `(auth)/login`, `(auth)/signup`, `account`, portal folders, `api/auth/session/route.ts`.
- `src/proxy.ts`: cheap cookie-presence redirect for portal routes (Next 16 renamed middleware → proxy).
- `src/lib/auth/`:
  - `roles.ts`: role list, role homes, `safeNextPath` (tested).
  - `session.ts`: server-only; `createSession`, `clearSession`, `getCurrentUser`, `requireRole`, `requireUser`.
  - `accounts.ts`: `setUpAccount`, `assignRole`. It takes admin instances as arguments, so scripts can use it too.
  - `actions.ts`: `completeSignup` server action.
  - `client-flow.ts`: browser side of sign-in.
  - `errors.ts`: friendly Firebase error copy.
  - `constants.ts`.
- `src/lib/env/`: `schema.ts` holds the pure zod schemas (tested), `client.ts` / `server.ts` validate lazily, and `public-config.ts` holds the student login domain.
- `src/lib/firebase/`: `client.ts` (in-memory auth persistence, emulator aware) and `admin.ts` (server-only).
- `src/components/auth/*` (forms), `src/components/portal/*` (`PortalShell` = Suspense + `RoleGate`).
- `tests/rules/*`: rules tests, run inside `firebase emulators:exec` by `npm run test:rules`.
- Earlier (Phase 0): `src/components/{layout,resources,paths,ui,home}`, `src/lib/{filters,budget,categories,storage}`, `src/data/*`.

## Things the next agent must know
- **Read `AGENTS.md`**: this Next.js version differs from older training data. Check `node_modules/next/dist/docs/` first.
- **Cache Components:**
  - Anything that reads cookies or the session must be inside `<Suspense>`: use `PortalShell` for portal layouts, and put `getCurrentUser()` in components under it.
  - No raw `new Date()` in prerendered server components.
  - Client components using `useSearchParams` need a Suspense fallback that doesn't call it (see `LoginForm` vs `LoginFormFromUrl`).
- **Visited pages stay mounted (hidden):** use `useId()` for ids. In browser tests, count `:visible` elements, and look for form errors with `.form-error`, not `role=alert` (Next has its own empty `role=alert` route announcer).
- **Header "Log in" / "My account"** reads the non-secret `ss_signed_in` cookie in the browser so public pages stay static. Never use it for access decisions (ADR-010).
- **Roles:**
  - Only server code writes roles: `assignRole` updates the claim, the user doc and the audit log, then revokes tokens.
  - The session cookie carries the claims from when it was created, so a role change requires a fresh login. Revocation forces that.
- **firebase-admin can't be imported by scripts through `server-only` modules.** Put shared logic in modules that take `Auth` / `Firestore` as parameters, like `accounts.ts`.
- **CSS:**
  - Use `site-container`, not `container`.
  - Every `<nav>` gets header-menu styles, so use `<div>` for other link groups.
  - New CSS goes in section 4 ("Additions") at the end of `globals.css`.
  - Bare `h1`/`h2` have weight 400 after Tailwind's reset, so set a weight on new headings.
- Prettier ignores `*.md`. `.gitattributes` forces LF. In Git Bash, set `MSYS_NO_PATHCONV=1` when passing `/routes` to scripts.
- Visual/behaviour check method: `next start -p 3123` (production build) + `playwright-core` with installed Edge from a scratch folder. The prototype build for comparison is in the owner's `Downloads/SussanProject/StudySathi/dist`.

## In progress
- Nothing. Waiting for owner review.

## Next steps (in order)
1. Owner review of Phase 1 (try the "How to run it" steps above).
2. Owner: create the Firebase project (Spark) + GitHub repo + Vercel project; fill env vars (README §3–4, "Deploying to Vercel"). Then deploy rules (`npx firebase deploy --only firestore:rules,firestore:indexes`).
3. Phase 2:
   - seed script (`npm run seed`): resources, learning paths, badges;
   - resource pages read Firestore at build/ISR, falling back to the seed;
   - admin layout + sidebar;
   - admin resources CRUD with audit log;
   - admin users list.

## Open questions (defaults in use until the owner answers)
| Question | Default in use |
| --- | --- |
| Creator applicants: account with no role + "what happens next" note until an admin approves (Phase 4)? | Yes (ADR-010) |
| Can students aged 13–16 sign up themselves, or must every student be created by a parent? | Parent-created only (signup page says so) |
| Where are course images/PDFs hosted? (Firebase Storage needs the paid Blaze plan) | Image URLs + YouTube/Vimeo embeds; Cloudinary free tier proposed in ADR-004 (pending) |
| Should the UI be bilingual (English/Nepali) from the start? | English first; keep strings in one place for later translation |
| Do volunteers/teachers need "classes" to group students? | Not in v1 |
| Password reset for adults ("Forgot password?" by email)? | Not built yet; suggest adding in Phase 2 or 3 |
| GitHub remote / Vercel / Firebase project? | None yet; local only |

## Known issues / risks
- About says "No accounts or personal profiles are needed." Still true for the public site, but revisit when student accounts arrive (Phase 3). The owner chose to keep the current About wording.
- Firestore free-tier quotas: keep reads low (ARCHITECTURE §6). `/account` costs 1 read; the portal checks cost 0 reads (they use claims).
- `npm run emulators` saves data to `.emulator-data/` on a clean exit (Ctrl+C); it's gitignored.
- `next build` warns about a stray `package-lock.json` in `C:\Users\DELL\Downloads` (outside the repo). Harmless.
- firebase-tools prints `url.parse()` deprecation warnings on start. They come from its dependencies and are harmless.

## Environment notes
- Node 24.14, npm 11, Java 25 (Temurin). firebase-tools 15 is a dev dependency (`npx firebase …`).
- Commands: `npm run dev | build | lint | typecheck | test | test:rules | emulators | set-role | format`.
