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
- [1.4] Login (`/login`: student username tab + parent/creator email or Google tab, `?next=`), sign-up (`/signup`: parent or creator applicant, email or Google), first-Google-login setup step, `/account` (redirects to role home; creator applicants see a pending note), header "Log in"/"My account" link via hint cookie; zod form schemas + friendly Firebase error copy with 9 tests — src/app/(auth)/*, src/app/account, src/components/auth/*, src/components/layout/AccountLink.tsx, src/lib/validation/auth.ts, src/lib/auth/{errors,client-flow}.ts, globals.css additions
- [1.4] Placeholder portals `/admin`, `/parent`, `/creator`, `/learn` behind `PortalShell` (Suspense + RoleGate → requireRole) with sign-out — src/app/{admin,parent,creator,learn}/*, src/components/portal/*
- [1.5] `scripts/set-role.ts` (`npm run set-role -- <email> <role> [--prod]`; refuses a real project without `--prod`) using shared `assignRole` — scripts/set-role.ts
- [1.5] Verified end to end with emulators + production build (25 scripted checks ×3 runs, plus Google sign-in via the emulator): sign-up → /parent, set-role → old session revoked → admin login with next → /admin, wrong-portal redirects, logout clears cookies, creator applicant pending, duplicate email, student wording, open-redirect blocked, cross-site POST 403, forged token 401, forged cookie → login — scratch scripts, not committed
- [docs] README local setup (one-line .env.local, set-role command, test:rules), ARCHITECTURE §2/§3 (proxy.ts, PortalShell, sign-up flow, cookies, user doc fields), CLAUDE.md §4 (proxy.ts)
- [chore] `.nvmrc` 20.9.0 → 24 and `engines.node` → `>=22.12`: firebase-admin 14 needs Node ≥ 22, Vitest 5 needs ≥ 22.12 — .nvmrc, package.json

## 2026-11-05 (Phase 2)
- [2.1] Seed script `npm run seed` (add-missing by default; `--force` emulators only; `--prod` never overwrites), validates before writing; starter badges (7, ARCHITECTURE §5 rule types); shared `scripts/lib/admin.ts` (emulators unless `--prod`), set-role refactored onto it — scripts/*, src/data/seed/badges.ts
- [2.2] Catalogue from Firestore: `getCatalog()` (`'use cache'`, tag `catalog`, `cacheLife('hours')`; seed fallback per collection with `cacheLife('minutes')` when Firestore is empty/unreachable/slower than 4 s); pure helpers take a `Catalog`; pages fetch on the server and pass resources to client components as props; bookmarks of removed resources pruned only against the live catalogue — src/data/catalog{,.server}.ts, src/app/**/page.tsx, src/components/resources/{ResourceLibrary,SavedList}.tsx, src/lib/storage/guest-data.ts
- [2.2] zod schemas for the admin resource form (derived age label, https-only links, allowed languages/formats/purposes) and Firestore docs, `slugify`; 9 tests incl. every seed resource round-tripping through the form — src/lib/validation/catalog.ts; shared option lists in src/lib/filters.ts
- [2.2] Verified: build with emulators off finishes (36 s) on seed data with 1 min revalidation; with emulators seeded, pages read Firestore with 1 h revalidation
- [chore] ESLint: allow `_`-prefixed unused vars and rest-sibling omission — eslint.config.mjs
- [2.3] Admin portal: sidebar layout, overview (resource/account/applicant counts, catalogue-source warning, recent audit activity), resources list/add/edit/delete (two-step confirm; delete blocked when used by a learning path; new ids from title slugs; `updateTag('catalog')`), audit log helper — src/app/admin/**, src/components/admin/*, src/lib/admin/{audit,guard,overview,resources}.ts, src/lib/actions.ts, src/components/ui/FormFields.tsx, globals.css portal styles (owner commit 646fa62)
- [2.4] Admin users: Firebase Auth list (no Firestore reads) + creator-applicant flag, search, role change via `assignRole` (approves applicants), turn off/on (revokes tokens), self-protection — src/app/admin/users/*, src/lib/admin/users.ts, src/components/admin/UserRowControls.tsx
- [2.3] Security fix found during build: auth checks moved into the admin data layer (`requireAdmin()` in every read) because layouts don't gate pages (ADR-011)
- [2.x] Rules tests isolated in project `demo-studysathi-rules` (they had wiped the dev emulator); new audit-log rules test (11 rules tests)
- [5.1] Added student course detail + enrollment flow and lesson page with a trusted completion action; link catalog cards to real course pages and record progress in `courseProgress` per user/course — src/app/learn/courses/**, src/lib/course/learning.ts, src/lib/course/learning.test.ts — closes the learner path from catalog to first lesson

## 2026-11-05 ? Session 6
- Learner actions: validated IDs, transactional enrollment/completion, lesson membership check, atomic idempotent progress and route refresh.
- Added LearningAction feedback and course completion/resume links; removed touched learner any casts and fixed catalog status typing.
- Added completion boundary regression tests and Firestore client-write denial coverage. Tests currently blocked at runner startup by missing picomatch.

## 2026-11-05 ? Session 7
- Restored incomplete npm installation; fixed existing creator array-index typing, audit action union and PortalWelcome children. Lint/typecheck now execute and pass.
- Fixed outline array/object mismatch with compatibility reader; transactional creator save/submit, forced draft creation, readiness validation, publish validation, actual shared preview and autosave cleanup.
- Added parent-created student accounts, ownership-checked password resets, profile editing and fixed-avatar validation/rules.
- Added private account library (bookmarks/progress/notes), transactional mutations, merge prompt and debounced client writes; public guest experience remains available.
- Added safe media renderer with video embeds, inline quiz practice and private reflection input; progress UI, session-view digest ledger and idempotent enrollment/completion counters.
- Added family, creator, library, media, view and completion regressions. Updated ROADMAP against actual code and corrected its stale emulator claim.

## 2026-11-05 - Session 8: lesson activities
- Added bounded sort/budget schemas, pure feedback helpers, accessible editor/player components and shared preview support.
- Added optional ordered blocks to lessons without rewriting existing data; completion remains at lesson level. Nested media readiness, unique IDs and a 700 KB outline bound prevent invalid or oversized submissions. Fixed nested quiz editing to update the selected block.
- Validation: lint/typecheck and 114 unit tests pass; activity-only production build passed; final stacked-lesson build remains to be run.

## 2026-11-05 - Session 8: Phase 6 foundation
- Added pure validated stats, level thresholds, Kathmandu calendar streaks/Sunday weeks and seeded baseline badge rules.
- Integrated hashed lesson xpEvents, daily/course bonuses and server stats writes into the same transaction as completion. Repeated or historical completions do not mint XP.
- Replaced learner placeholder with guarded dashboard, level progress ring, habit/badge/continue cards, and static completion reward feedback. Enrollment tracks currentCourseId.
- Added unit regressions and isolated real-Firestore concurrency integration tests. No cloud credentials/config were changed or live learner data mutated during testing.

## 2026-11-05 - Session 9
- Added server quiz grading with published-course/enrollment/lesson/block/answer checks; first successful pass gives +5 XP once, with level/weekly totals and perfect-quiz badge. Shared QuizPlayer separates preview practice from authenticated grading.
- Added minimal server-only leaderboard entries, current-week/all-time top ten + own rank, tied ranks, and presentation-only rows without IDs or private fields.
- Linked-parent consent writes entries atomically; awards read consent in their transaction so opt-out cannot be undone by a concurrent reward. Disable/role changes revoke visibility and remove current entries.
- Added explicit digital-safety course category and canonical safety badge rule; catalogue and creator use the same category list.
- Added emulator tests for authorization, double quiz awards, legacy quizzes, privacy, old-week reset, beyond-top-ten rank, ties, consent/reward races and administrative withdrawal.

## 2026-11-05 - Session 10
- Added authenticated creator analytics summary/list/detail and admin learning metrics. Queries scope creator ownership, paginate 20 courses and project list fields; independent sum aggregates preserve sparse legacy counters. Removed hard-coded creator workspace zero counts.
- Added transactional per-lesson completion counters using FieldPath for literal IDs and a versioned new-enrollment cohort for an honest completion rate. Replays/concurrency cannot inflate counts; historical enrollments are excluded from the new rate. No raw student records are read for creator analytics.
- Added semantic metric cards, relative per-lesson completion bars, clear tracking limitations, global loading/error recovery using Next 16 retry, and analytics-specific retry/not-found/empty states.
- Added pure metric tests and isolated emulator ownership, role, sparse aggregate, pagination, cohort and dotted-ID tests. 131 unit and 36 emulator tests pass; build/lint/typecheck pass. Browser host remains unavailable.

## 2026-11-05 - Session 11
- Added cover URL/alt and explicit teaching language to draft metadata, shared new/edit fields and image preview/failure fallback. New-course form now opens the created editor instead of offering a nonfunctional review-status selector.
- Draft metadata saves in the same transaction as its outline; status/ownership injection remains blocked. Combined autosave skips untouched initial data and surfaces validation messages. Shared checklist validates all course metadata and nested lesson readiness.
- Creator submission and transactional admin publishing enforce the same readiness contract; review UI shows cover/language/checklist and actual lesson previews without awarding points. Old published courses stay readable and show unspecified language when missing. Student catalogue/detail render optional metadata.
- Added metadata/legacy/security unit tests and isolated edit/submit/publish/race integration tests. 138 unit tests and 40 emulator tests pass; lint/typecheck/build pass. Browser host unavailable; no visual/mobile/live acceptance claimed.

## 2026-11-05 - Session 12 - Codex
Student account toolbar with request-scoped cached guarded reads and layout invalidation; bounded published-course discovery; parent summaries and ownership-guarded progress route; weekly lesson counter and Kathmandu rollover; reusable course progress summary. Added boundary and emulator ownership/discovery coverage.

## 2026-11-05 - Session 13 - Codex
Added shared PortalRecovery plus portal loading/error/not-found boundaries; preserved analytics overrides. Linked AccountForm field errors to inputs/selects and exposed busy state. Mobile menu Escape restores toggle focus; skip target accepts programmatic focus. Added scoped account controls, touch targets and text wrapping.

## 2026-11-05 - Session 14 - Codex
Added isolated Playwright desktop/mobile runner and 22 end-to-end cases; browser-discovered label, current-metadata save, failed-form retention and logout/offline recovery fixes. Added seven composite course indexes and read-only live query probe; reproducible Vercel install and release guide. Explicitly authorized production Rules API release succeeded, indexes denied by IAM. Existing domain already authorized; user authorized Git push.

## 2026-11-05 - Session 15 - Codex
Completed explicitly authorized production catalog seed (25 missing records) and verified counts; confirmed Vercel application release success; launched owner Firebase login for pending index deployment. No application code or env changes.

## 2026-11-05 - Session 16 - Codex
Deployed all seven checked-in course composite indexes with authenticated owner CLI credentials after earlier service-account permission denial; verifying index readiness with the existing read-only probe.

Session 16 result: verified seven READY indexes, ten passing live probes, successful Vercel app release 5017c40 and public/unsigned-route smoke checks.

## 2026-11-05 - Session 17 - Codex
Added same-origin JSON auth setup route and moved setup into server-only helper; auth client no longer imports a setup Server Action. Preserve matching Firebase user for interrupted signup retry; only deliberate public auth errors reach forms. Delay shared auth input enablement until hydration. Added signup/retry/forged-token/browser production-build support and unit regressions.

## 2026-11-05 - Session 18 - Codex
Confirmed Vercel ERR_REQUIRE_ESM from the supplied runtime logs; reproduced Firebase Admin auth import under --no-experimental-require-module. Added scoped jwks-rsa jose 5.10.0 override/lockfile and Node 24 pin; runtime import + RSA public-key/signature regression. Production-mode E2E starts the app with require(ESM) disabled to prevent localhost-only false acceptance.

Session 18 deployed result: verified cec1ab3 on the live domain; normal JSON validation and invalid-token rejection replace the previous auth module-load 500 errors.

## 2026-11-05 - Session 19 - Codex
Recovered local development server after dependency reorganization by restarting the verified project process tree; package resolution and login/signup HTTP checks pass. No product code change.

## 2026-11-05 - Session 20 - Codex
Added /safety-mission, bilingual authored scenario data, accessible leaf player, explanation/safer-action feedback, in-memory score/replay and safety-plan result. Added prominent homepage promo/hero entry, scoped responsive styling and authoritative guidance links. Data-integrity and production browser flow coverage added.

Session 20 release: 524b3f1 deployed and anonymous public mission language/feedback/mobile smoke verified on studysathisip.vercel.app.

## 2026-11-06 — Academic pilot: original learning and targeted revision
User requested the academic pivot in the current site. Added /study grade/subject/topic routes, three original Mathematics units, 24 questions, server grading, skill-linked revision, different follow-up sets, student-private saved summaries and linked-parent views. Homepage/About/navigation now prioritize academic learning. Admin textbook source publish/withdraw validates official hosts and permission reference, records an atomic audit, invalidates cache; lazy PDF reader retains original-source fallback. No actual PDF imported or approved, no provider key obtained, no new dependency/rules/index/env changes. See docs/ACADEMIC_PLAN.md for implementation limits and remaining work. Validation outcome follows in SESSION_LOG/HANDOVER.

## 2026-11-06 — Class-wise public school library
User clarified the UI/content requirement: Classes 1-12, subject classification, government PDF reading/save links and full in-site teaching playlists. Added a static metadata catalog with 79 HEAD-verified official PDFs and 56 owner-verified NCED Virtual playlists (3,270 distinct indexed videos). Replaced narrow grade picker with twelve class tiles, subject icon cards, Read/Watch material cards, PDF reader/page jump and full-playlist player with searchable lesson selection. Dynamic routes preserve existing Grade 9 practice paths and all account/course flows. Source/coverage pages state real gaps and index limits. Added tests and a bounded PDF-header maintenance checker. See SCHOOL_LIBRARY.md. No new dependency, credential, Firebase data/rules/index change or copied media.

Final catalog expansion: 137 government PDF records (all verified by HEAD/PDF content type), including core secondary texts and Grade 11-12 subjects. Provider access recovered on a later normal request; no access-control bypass. Corrected language/subject labels and preserved explicit edition notes. Final mobile test uses route-wait assertions to avoid selecting a repeated homepage link before SPA navigation completes.

## 2026-11-06 - Study discovery and chapter companions
- Added public /study search across all indexed book and video titles, with class, subject, material and language filters; edition text is searchable. Results cap at 30 and link to the selected video.
- Reader page jumps and selected playlist lessons persist locally with a continue link and explicit clear control. These are reading/selection preferences, not verified viewing completion or synced academic progress. Native PDF scrolling and YouTube playback timestamps cannot be observed by this implementation.
- Added English/Nepali study instructions, heading/breadcrumb/subject navigation and Read/Watch headings. This is a limited study-interface translation, not full-site translation; native-speaker review remains pending.
- Existing three original Grade 9 Maths topic pages now connect subject textbooks, title-matched videos and existing graded practice/revision. Exact official chapter/page mappings are unverified; no new all-grade chapter coverage is claimed.
- Original topic explanations/examples can be saved as small offline text files; no provider media caching, service worker or offline grading. A visual Sets activity offers immediate local feedback without points or persistence.
- Reader/player resource-help panels copy source details for sharing. They do not submit/store reports, and caption/sign-language support remains provider-dependent. Existing editions/check dates/source links remain visible.
- No dependencies, credentials, database rules/schema, production fixtures or OLE content added. Human teacher review, source permissions, native-speaker review and full assistive-technology/real-device acceptance remain external work.

Study player layout follow-up: keep resource-help inside the player column so the existing two-column player/lesson-browser layout remains intact.

## 2026-11-06 - PDF provider incident
User reported government-hosted embedded PDF ERR_EMPTY_RESPONSE. Reproduced in Chromium on Class 6 Maths cdc-113: iframe request fails net::ERR_EMPTY_RESPONSE; Node GET fails UND_ERR_SOCKET. Actual GETs for cdc-150 and cdc-570 also fail, while sampled HEAD checks return 200 application/pdf with no frame restrictions. This establishes a file-delivery failure on the tested connections, not proof of a global outage or embed-policy rejection. No working replacement verified. Added prominent reader help, official-listing link, manual retry and hide-viewer controls. Cross-origin native PDF load events cannot reliably distinguish rendered PDF from browser error; do not claim automatic failure detection. Maintenance checker now checks actual GET prefix and cancels the stream without saving media; stops on connection failures or access restrictions. Existing catalog counts are indexed links, not guaranteed currently readable files. Exact user book URL requested and pending.

PDF incident scope follow-up: user confirms all PDFs fail; all catalog PDF URLs share the affected host. Current publisher listing retains it. Added temporary availability notice on study home/subjects/sources; do not imply that fallback controls restore files. Published official legacy links tested return 404 or timeout. No working replacement established.

## Alternative provider reader (2026-11-06)
User requested the most efficient recovery. Standard partial-file GET also fails against the government file host. Verified public OLE grade-library navigation for Classes 1, 6, 9 and 12, including Class 6 Maths/Sets document page. Its actual publisher-hosted PDF returns HTTP 200 application/pdf and %PDF- prefix. Added an explicitly optional credited OLE grade-library iframe and original-page link in subject/read screens; no provider files are copied, proxied or rehosted, and no runtime API integration/key is claimed. It is a different collection, not an exact replacement for a selected CDC edition. Government iframe is off by default during the incident; explicit Retry loads the original. Provider iframe/browser compatibility and all-grade coverage still need acceptance.

## User-directed reader rollback (2026-11-06)
User rejected the optional embedded OLE library and requested direct PDF opening. Removed AlternativeLibrary from book/subject pages and deleted its component/style; restored the direct government PDF reader enabled by default with existing retry/source controls. No catalog URL changes or mismatched chapter-to-whole-book replacements. Asked whether new link means direct OLE chapter PDFs or the previous government links; answer pending. Actual government delivery remains unresolved. This supersedes the provider-library iframe product choice.

## 2026-11-09 - Guided resources and Play and Learn
User requested the proposed resource learning journeys, embedded permitted activities, progress, rewards and games section. Added /play with eight original guides/checks: fractions, balance, circuits, budget, digital safety, waste, reading and study habits. Three provider-hosted PhET simulations (fractions-intro, balancing-act, circuit-construction-kit-dc), three original interactive widgets and two guided reflection tasks. PhET official current licensing reviewed: CC BY-NC 4.0 for regular simulation files on a non-commercial site; exact required attribution displayed near each embed. No assets copied, API keys, dependency or OLE-browser iframe. Resources use category-related original guides, not invented provider summaries; unpermitted pages remain original links.
Server-only /api/study validates strict answers, session identity and same origin. Atomic progress/reward transaction records bounded best/latest/attempts/completed state; all-correct first check grants existing lesson reward (10 XP plus eligible daily 5), streak and badge logic with a separate study_ ledger. Replays/partial checks earn no XP; media/widget clicks never award. Study completions count in existing lesson/activity counters; dashboard/parent labels now say learning activities, not course lessons. No fake currentCourseId or completed-course increment. Consent-controlled leaderboard writes reuse the same user transaction. Students read their own saved progress through server API; linked parents read summaries only after current ownership guard. Private notes not fetched. Existing academic pilot still separate and awards no XP.
179 unit tests and 50 Firestore rules/integration tests passed, including concurrent idempotency and consent/privacy. Removed a duplicate account read in perfect-check transactions after initial suite; browser regression and final verification follow. No production test data written. Teacher/curriculum/native-speaker/assistive review remains pending; no measured learning-impact claim.

## 2026-11-09 - Game-first activity presentation
User explicitly requested automatic game loading, visible game preview and optional MCQs. PhET iframe is now rendered eagerly on activity entry with no Load simulation gate. Activity/task come first; long original explanations use a collapsed Need a hint disclosure. Questions are initially unmounted behind Check what I learned; only first opening fetches identity/progress. Hiding/reopening keeps answers/results without repeat identity requests. Credit remains visible below the game; provider help/licence details collapse. This supersedes the prior click-to-load preference for these games only. Trusted grading/XP/privacy rules are unchanged; opening a game never awards points.

Game layout polish: responsive aspect ratio removes excess portrait letterboxing; large fullscreen action uses native fullscreen with landscape/original fallback hint when unsupported. Provider attribution stays outside collapsed help.
