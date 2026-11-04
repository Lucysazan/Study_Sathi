# Handover

> Rewrite this whole file at the end of every session. A new agent with no chat history must be able to continue from here.

**Last updated:** 2026-11-05 · **By:** Session 3 (Claude Code, claude-opus-5-5) → handing over to another agent (Codex / ChatGPT)
**Branch:** `main`, pushed to `origin` = https://github.com/Lucysazan/Study_Sathi

## Current state
| Phase | Status |
| --- | --- |
| 0: Port the Vite prototype to Next.js | ✅ Done, except the Vercel preview deploy (needs the owner's Vercel + Firebase env vars) |
| 1: Firebase foundation and auth | ✅ Done and verified in the browser (25 scripted checks + Google sign-in) |
| 2: Content in Firestore + admin basics | ✅ Built, ⚠️ browser verification only partly done (see below) |
| 3–7 | Not started |

- Current repo status: lint ✅ · typecheck ✅ · build ✅.
- Current test status: `npm run test` ❌ (runner/config issue: `describe`/`it` are undefined before tests execute) and `npm run test:rules` ❌ (same Vitest runner problem under the emulator wrapper).
- The Cache Components auth bug has been fixed: the shared session helper no longer triggers the `Date.now()` prerender warning, and protected portal routes keep the App Router Suspense pattern rather than using the removed `dynamic = 'force-dynamic'` config.
- No real Firebase project yet. Everything runs on the local emulators (`demo-studysathi`).

### Phase 2 verification status (do this first)
| Feature | Unit/rules tests | Browser checked |
| --- | --- | --- |
| Seed script (add-missing, `--force`, `--prod` guard) | n/a | ✅ by running it |
| Public pages read Firestore; seed fallback when it's down | n/a | ✅ two builds (on/off) |
| Parent blocked from `/admin/*`, no admin data in the response | n/a | ✅ |
| Admin overview counts + recent activity | n/a | ✅ |
| Add / edit / delete resource, public site updates at once, delete blocked for path resources | form schema ✅ | ❌ **not yet**: the test script stopped on a selector bug in the script (not the app) |
| Users: search, approve creator applicant, turn off/on, self-protection | n/a | ❌ **not yet** |
| Admin pages at 360 px | n/a | ❌ not yet |

How to verify: start the emulators + seed, `npm run build && npx next start -p 3123`, then click through `/admin` as an admin (steps in "How to run it"). A Playwright script for this existed only in the previous agent's scratch folder. Re-create it under `tests/e2e/` if you want it in the repo (ROADMAP Phase 7 plans Playwright).

## How to run it
1. `.env.local` contains `NEXT_PUBLIC_USE_EMULATORS=true` (gitignored; create it on a new machine).
2. Terminal 1: `npm run emulators` (Auth 9099, Firestore 8080, UI http://localhost:4000). Needs Java 11+.
3. Terminal 2: `npm run seed`, then `npm run dev` → http://localhost:3000.
4. Sign up at `/signup` as a parent → `npm run set-role -- you@example.com admin` → log in again → `/admin`.
5. Never run the rules tests against your dev data by hand: use `npm run test:rules` (it uses project `demo-studysathi-rules`).

## Code map
- `src/app/`: routes.
  - Public: `/`, `/resources`, `/resources/[id]`, `/learning-paths`, `/learning-paths/[id]`, `/volunteers`, `/saved`, `/about`.
  - Auth: `(auth)/login`, `(auth)/signup`, `account`.
  - Portals: `admin/**` (real), `parent`, `creator`, `learn` (placeholders).
  - API: `api/auth/session`.
- `src/proxy.ts`: cookie-presence redirect for portal routes (Next 16 renamed middleware → proxy).
- `src/data/`:
  - `catalog.ts`: pure helpers plus `seedCatalog`;
  - `catalog.server.ts`: `getCatalog()`, Firestore + cache + seed fallback;
  - `seed/`: resources.json, learningPaths.ts, badges.ts.
- `src/lib/auth/`: roles, session (server-only), accounts (`setUpAccount`, `assignRole`), actions, client-flow, errors.
- `src/lib/admin/`: `guard.ts` (`requireAdmin`, `getAdmin`), `audit.ts`, `overview.ts`, `resources.ts`, `users.ts`. **Every read calls `requireAdmin()`.**
- `src/lib/validation/`: zod schemas (auth forms, resource form + Firestore docs).
- `src/lib/`: `filters.ts`, `budget.ts`, `categories.ts`, `storage/` (guest localStorage), `env/` (zod env), `firebase/` (client + admin).
- `src/components/`: `layout`, `resources`, `paths`, `home`, `ui`, `auth`, `portal` (`PortalShell`), `admin`.
- `scripts/`: `seed.ts`, `set-role.ts`, `lib/admin.ts`. Scripts use emulators unless `--prod`.
- `tests/rules/`: Firestore rules tests.

## Things the next agent must know
- **Read `AGENTS.md`**: this Next.js (16.4) differs from older training data. Check `node_modules/next/dist/docs/` before using a Next API.
- **Layouts don't protect pages** (ADR-011). Any new portal page must call a guarded data function or `requireRole()` itself. Every Server Action re-checks the user: validate with zod → check role → do the work → `updateTag`/`revalidatePath` → return `ActionResult`.
- **Cache Components:**
  - Anything that reads cookies or the session goes inside `<Suspense>`.
  - No raw `new Date()` in prerendered server components.
  - Client components using `useSearchParams` need a fallback that doesn't call it.
  - Visited pages stay mounted but hidden: use `useId()` for ids; in tests count `:visible` elements, and read errors from `.form-error` (Next has its own empty `role=alert`).
- **Catalogue:** public pages call `getCatalog()`. After changing resources or paths in a Server Action, call `updateTag(CATALOG_TAG)`.
- **CSS:**
  - Use `site-container`, not `container`.
  - The prototype CSS styles every `<nav>` like the header menu, so override it, as `.portal-sidebar nav` does.
  - New CSS goes in section 4 at the end of `globals.css`.
  - Bare headings are weight 400, so set a weight.
- **Header "Log in / My account"** reads a non-secret hint cookie (ADR-010). Never use it for access.
- Prettier ignores `*.md`; `.gitattributes` forces LF. Node ≥ 22.12 (`.nvmrc` 24). On Windows Git Bash, set `MSYS_NO_PATHCONV=1` when passing `/routes` as arguments.

## Next steps (in order)
1. **Finish Phase 2 browser verification** (table above). Fix anything found and log it.
2. Optional small wins: adult "Forgot password" by email; an admin page for learning paths (resources used by a path can't be deleted until paths are editable).
3. Owner tasks:
   - create the Firebase project (Spark) and service account;
   - set the Vercel env vars (README "Deploying to Vercel");
   - deploy rules: `npx firebase deploy --only firestore:rules,firestore:indexes`;
   - `npm run seed -- --prod`, then `npm run set-role -- <email> admin --prod`.
4. **Phase 3** (ROADMAP): parent dashboard + add child (username + password), student profile (nickname + 12 avatars), signed-in bookmarks/notes in Firestore with guest → account merge.

## Open questions (defaults in use until the owner answers)
| Question | Default in use |
| --- | --- |
| Creator applicants: account with no role + "what happens next" note until an admin approves? | Yes (ADR-010); approval = admin sets role "Creator" in Users |
| Starter badges (`src/data/seed/badges.ts`, 7 badges): names OK? | Seeded as written |
| Can students aged 13–16 sign up themselves? | No; parent-created only |
| Course images/PDFs hosting (Storage needs Blaze) | URLs + YouTube/Vimeo; Cloudinary proposed (ADR-004, pending) |
| Bilingual UI from the start? | English first |
| Classes for volunteers? | Not in v1 |
| `.nvmrc` 24 (was 20.9.0 in the Vercel commit) | Node 24; firebase-admin 14 needs ≥ 22 |

## Known issues / risks
- Admin users list shows the first 1,000 accounts (no paging yet).
- About says "No accounts or personal profiles are needed": revisit when student accounts arrive (Phase 3). The owner chose to keep the current About wording.
- Firestore free tier: public pages cost reads only when the cache refreshes. The admin overview costs ~3 reads plus the audit list.
- `npm run emulators` saves data to `.emulator-data/` only on a clean Ctrl+C exit.
- Harmless warnings: a stray `package-lock.json` in the owner's Downloads folder; firebase-tools `url.parse()` deprecation notices.
