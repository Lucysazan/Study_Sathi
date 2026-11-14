# Roadmap

Work top to bottom. Tick `[x]` when done and verified. Don't start a phase until the previous one builds and its checks pass. If a task grows, split it here rather than doing it all at once.

## Current status (2026-11-05)
- [x] Production auth ERR_REQUIRE_ESM resolved in cec1ab3: scoped jwks-rsa/jose compatibility fix, restrictive import/RSA regression, 30 production browser cases; live setup/session JSON 400 and invalid-token 401 verified. Signed-in production acceptance remains separate.
- Phases 0-2: implementation complete; Vercel deployment remains outstanding.
- Phase 3: family accounts, profile, private library sync and merge implemented; browser acceptance checks remain.
- Phase 4: creator/admin flow, nine activity formats and stacked lessons implemented; cover/language/checklist implemented; browser acceptance remains.
- Phase 5: lesson rendering, transactional progress, course resume and session views implemented; browser/mobile acceptance remains.
- Phase 6: lesson/quiz rewards, levels, streaks, badges, dashboard and parent-consented leaderboards implemented; browser acceptance remains. Phase 7 analytics and shared loading/error recovery implemented; browser accessibility/e2e and deployment remain unfinished.
- Both local env files currently set NEXT_PUBLIC_USE_EMULATORS=false. Do not switch the app to emulators to hide production issues. Rules tests use their own demo project.
- Automated checks are recorded in HANDOVER; a passing build does not imply browser, live Firebase or deployment acceptance.

## Phase 0 — Repo setup and parity migration (no Firebase yet)
- [x] Move the Vite prototype into `legacy/` (read-only reference)
- [x] Scaffold Next.js (App Router, TypeScript strict, ESLint, `src/`, `@/` alias); add Prettier, Vitest
- [x] Port design tokens and styles from `legacy/src/style.css` into `src/app/globals.css`; load fonts with `next/font/google` (Plus Jakarta Sans, Inter)
- [x] Port layout components: Logo, Navbar (with mobile menu), Footer; render in root layout
- [x] Port shared components: ResourceCard, CategoryIcon, FilterPanel, Empty, LearningArt, PathCard
- [x] Port pages: Home, Resources (query-string filters), Resource details, Learning paths, Path details (incl. budget), Volunteers, Saved, About, Not found
- [x] Port `filters.ts` with unit tests (age overlap, language rules, combined filters)
- [x] Keep localStorage behaviour for guests (same keys)
- [x] `generateStaticParams` for resource and path detail pages; per-page metadata
- [x] Visual check vs prototype at 360px, 768px, 1280px
- [x] Existing Vercel site confirmed at https://studysathisip.vercel.app/ (user confirmed Git connection; current release tracked below)

## Phase 1 — Firebase foundation and auth
- [x] `firebase.json`, emulators config, `firestore.rules` (default deny), `firestore.indexes.json`
- [x] `lib/firebase/client.ts`, `lib/firebase/admin.ts` (server-only), env validation with zod
- [x] Session cookie route `/api/auth/session`, `getCurrentUser()`, `requireRole()`, `proxy.ts` (Next 16 name for middleware)
- [x] Login / signup pages (parent + creator applicant; student username login)
- [x] JSON account setup, interrupted-signup recovery, safe auth errors and production-mode parent/creator signup regression coverage
- [x] `scripts/set-role.ts`; first admin works end to end
- [x] Rules test harness with the emulator

## Phase 2 — Content in Firestore + admin basics
- [x] Seed script for resources, learning paths, badges
- [x] Public resource pages read Firestore at build/ISR (fall back to seed JSON if unavailable)
- [x] Admin layout + sidebar; admin resources CRUD; audit log entries (verified in-browser; request-time auth fix applied under Next 16)
- [x] Admin users list (search, role change, disable) (verified in-browser; role and access changes are working)

## Phase 3 ? Parents and students
- [x] Parent dashboard with linked learner nicknames and usernames
- [x] Parent-created username/password accounts, student claims, family linking and cleanup on failed linking (unit tests)
- [x] Parent-owned child password reset and session revocation (unit tests)
- [x] Student nickname and fixed 12-avatar selector; matching server validation and rules
- [x] Signed-in bookmarks, path progress and private notes sync through authenticated server actions
- [x] Guest merge prompt; idempotent merge preserves account notes and clears guest copy after success
- [x] Chromium desktop/360px smoke: parent creates child, student login/profile, password reset and old-session revocation
- [x] Chromium separate-context library sync/guest merge/private-note exclusion/logout isolation; profile and logout offline retry
- [ ] Manual private-library offline editing/reconnect and real-device acceptance

## Phase 4 ? Creator portal and course builder
- [x] Creator studio, application and admin approval
- [x] Draft creation, list and module/lesson outline editor
- [x] Seven formats: text, video, image, resource, quiz, reflection and checkpoint
- [x] Readiness validation for media links, image descriptions and duplicate lesson IDs
- [x] Module/lesson ordering, debounced autosave and shared student-renderer preview
- [x] Submission saves current edits before review; creator cannot publish or edit a course under review/published
- [x] Admin review queue, notes and publish/return-to-draft actions
- [x] Canonical outline object saves with compatibility reads for previously saved array outlines
- [x] Sort activity editor/player and schema (validated groups/items, keyboard controls, practice feedback)
- [x] Budget activity editor/player and schema (fictional whole-rupee NPR plans and feedback)
- [x] Stacked activities per lesson, with legacy compatibility, ordering, removal and per-block readiness validation
- [x] Cover image URL/description, explicit teaching language, editable metadata and shared creator/admin readiness checklist
- Bounded inline storage remains in use; a lesson-document split is deferred unless size requires it.
- [ ] Browser verify metadata/cover/language, rapid edits/autosave, submit, return to draft and publish; mobile layout

## Phase 5 ? Learning experience
- [x] Published-only catalogue, category filter, course details and transactional enrollment
- [x] Shared nine-format lesson renderer, private reflection notes and inline practice quiz feedback
- [x] Privacy-enhanced YouTube/Vimeo embeds and safe HTTPS media links
- [x] Transactional, idempotent completion validates published course, actual lesson and enrollment
- [x] Course completion counts, progress bar, outline links, first-unfinished resume and review links
- [x] Per-authenticated-session course view deduplication; transactional enrollment/completion counters
- [ ] Browser verify learning play-through, refresh persistence, repeat/concurrent submissions and 360px sticky controls
- [x] Render sort/budget and stacked blocks through the shared learner/creator preview renderer

## Phase 6 — Gamification
- [x] `lib/gamification` pure functions + tests (lesson XP, levels, Kathmandu streaks, baseline badges)
- [x] Award transaction with idempotent `xpEvents`; emulator-tested concurrent completions
- [x] Student dashboard: level ring, streak, badges, continue card
- [x] Static XP feedback and earned badge cards (reduced-motion safe)
- [x] Server-graded first successful quiz pass (+5 XP once) and perfect-quiz badge; legacy and stacked quizzes supported
- [x] Explicit Digital Safety course category and canonical digital-safety badge rule; Digital Skills does not grant this badge
- [ ] Browser acceptance for awards, dashboard resume and static celebrations
- [x] Leaderboards (weekly + all-time, opt-in, top 10 + you, shared ranks for ties)
- [x] Linked-parent consent toggle; atomic opt-out and withdrawal on account disable/role changes
- [ ] Browser/mobile acceptance for quiz retries, leaderboard views and parent consent changes

## Phase 7 — Analytics and polish
- [x] Creator analytics: paginated owned courses, recorded views/enrollments/completions, new-enrollment completion rate and per-lesson completion funnel
- [ ] Browser acceptance of analytics, sparse/empty metrics and mobile completion charts
- [x] Admin overview learning metrics and real creator workspace status counts
- [x] Source-level accessibility fixes: account field errors/busy state, mobile Escape focus, skip target and portal/account touch targets
- [ ] Browser accessibility acceptance (keyboard, screen reader labels, focus, zoom, contrast)
- [x] Student learning account toolbar (XP/avatar/profile/logout), bounded published-course discovery and linked-parent progress summaries
- [ ] Browser acceptance of student toolbar, discovery and parent progress at desktop/360px
- [x] Shared root loading/error recovery plus analytics error/not-found and empty states
- [x] Portal-specific loading, retry and generic unavailable states (student/parent/creator/admin)
- [ ] Audit all route-specific loading/error/empty states in the browser (docs/ACCEPTANCE.md)
- [x] Playwright smoke tests: all-role login, stacked quiz/reward/completion, publish, family/reset/consent, offline forms/logout, private sync and analytics (30 production-build desktop/360px cases, including signup/retry/security)
- [x] Production rules deployed to studysathi-20d2c with explicit approval; existing Vercel Auth domain verified
- [x] Seven production course indexes deployed and READY; all ten live query probes PASS
- [x] Git-triggered Vercel app release 30f4e35 succeeded; production catalog seeded and counts verified (15 resources/3 paths/7 badges)
- [x] Verify Vercel app release 5017c40, public responses and signed-out portal redirects
- [ ] Authenticated live user play-through and remaining manual/assistive-technology acceptance

## User-requested USP - Public safety mission
- [x] Ship and verify three-scenario English/Nepali safety mission with homepage entry, explanations and local practice result (524b3f1; live anonymous mobile check PASS)
- [ ] Native-speaker review and learner pilot; no impact claim before evaluation

## Later (do not start without an ADR)
- Nepali UI translation · class/group leaderboards for volunteers · offline packs · certificates of completion · email notifications

## Active academic pivot (2026-11-06)
User requested academic focus in the existing site. This section takes priority over adding extra nonacademic features. Detailed plan: ACADEMIC_PLAN.md.
- [x] Grade 9 Mathematics pilot navigation and three original topic units with examples.
- [x] Server-graded topic checks, skill-linked revision and different follow-up questions.
- [x] Student-private latest-result saving and linked-parent summaries, separate from XP.
- [x] Admin official textbook source manager, audit and permission-controlled reader with fallback.
- [x] Academic homepage, About, navigation and transparent source/review status.
- [x] Verify academic checks: 164 unit tests, 38 production-browser desktop/mobile cases, Firestore integration suite, lint/typecheck/build; b241742 deployed and live anonymous academic flow verified.
- [ ] Teacher review, current CDC curriculum/edition and chapter/page mapping.
- [ ] Connect a real approved PDF and test actual provider embedding on devices.
- [ ] Obtain supported OLE API/feed and permission if offered; no public key flow confirmed.
- [ ] Extend creator/admin content authoring for academic taxonomy and versioned questions.
- [ ] Expand reviewed chapters/subjects/grades and evaluate with learners.

## Class-wise library expansion (2026-11-06 user clarification)
This is the active public-library priority; the original Grade 9 practice remains available.
- [x] Research and classify actual government PDFs and NCED Virtual teaching playlists across Classes 1-12.
- [x] Twelve class tiles, subject cards and Read/Watch material screens with real counts.
- [x] In-site native PDF reading, page jump and original-file open/save fallback.
- [x] Full-playlist YouTube embeds, selected lesson switching and searchable indexed lesson titles.
- [x] Preserve original practice routes and account/course tools; explain source/edition/coverage limits.
- [x] Final regression/build and live deployment verification: 8886a0e deployed; 169 unit /40 browser cases pass; anonymous live mobile library controls verified.
- [ ] Fill remaining subject/edition gaps through reviewed, permitted sources; do not claim complete syllabus coverage.
- [ ] Real-device PDF/full-playback audit and educational review.

## Study journey additions (2026-11-06)
- [x] Search all indexed books/video titles with class/subject/material/language filters and edition keywords.
- [x] Browser-local reader/lesson selection, continue link and erase control.
- [x] Limited Nepali study navigation and instructions (native-speaker review pending).
- [x] Original topic companions: textbooks, title-matched videos, existing graded checks/revision and downloadable offline original notes.
- [x] Original visual Sets activity and source/accessibility help with copyable resource details.
- [x] Verify desktop/mobile regression and deploy: 9cee3fd /32bb391 Vercel success; anonymous live search/resume/language/practice and desktop player checks pass.
- [ ] Teacher-reviewed curriculum/chapter/page mapping beyond the three existing topic pilots.
- [ ] Complete Nepali localization, native-speaker review, accessible-resource audit and permitted provider offline packs.

## PDF availability incident (2026-11-06)
- [x] Reproduce actual file request failure despite successful HEAD metadata.
- [x] Prominent publisher-listing fallback, manual retry/hide controls and actual PDF-prefix maintenance checks.
- [x] Verify fallback regression and deployment: 16d5f78 Vercel success; desktop/mobile fallback tests pass.
- [ ] Confirm publisher file recovery or a verified official replacement; real PDF rendering remains unverified.

- [x] Implement optional attributed OLE class-library fallback without rehosting; verify a real alternative PDF response.
- [x] 52a1139 deployed; live 360px embedded Class 6 Maths/Sets navigation reaches actual PDF HTTP 200 with no page errors/outer overflow.

- [x] User-directed removal of alternate-library UI; restore direct-reader interaction.
- [x] User clarified: restore previous government PDF links; catalog unchanged. No direct OLE chapter replacement requested.

## Guided resources and Play and Learn (2026-11-09)
- [x] Eight simple original activity journeys and category-related resource guides.
- [x] Three attributed permitted PhET embeds, original widgets and server-graded follow-up checks.
- [x] Private best/latest progress, atomic one-time XP/streak/badges and existing consented leaderboard integration.
- [x] Student progress/dashboard discovery and ownership-guarded linked-parent summaries.
- [x] 496af04 deployed: 179 unit /50 rules-integration /48 browser cases pass; live anonymous mobile resource journey, feedback and real PhET rendering verified.
- [ ] Teacher/curriculum review, all-subject expansion, native-speaker and assistive-technology acceptance.

## Game-first presentation (2026-11-09)
- [x] Auto-load games and show activity before explanation.
- [x] Optional questions with lazy mount, saved answer continuity and collapsed hints.
- [x] Focused browser/build verification passes; included in live 4a69c2e release verified 2026-11-14.

## Visual activity discovery (2026-11-09)
- [x] Colourful original interactive previews, compact play cards, subject filters and fractions hero.
- [x] Retain auto-loaded full games and optional learning checks.
- [x] Desktop/mobile visuals and local preview/filter checks pass; 4a69c2e Vercel success and live 360px preview/filter/full-game/optional-questions journey verified 2026-11-14.


## Guided public discovery (2026-11-14)
- [x] Guided homepage with learning-mode doors, English reading entry and interactive circuit preview.
- [x] Original playful resource illustrations and mode shortcuts.
- [x] Numbered path trails and clickable roadmap with persistent completion.
- [x] Remove requested PDF error-help block; preserve reader/page/download controls.
- [x] Unit/lint/typecheck/build and four focused desktop/mobile production-browser checks.
- [x] d69a38f deployed successfully; anonymous live 360px home/circuit/roadmap/resources/PDF UI verified without page errors or outer overflow.
- [ ] Supported embed permission/integration for British Council/e-learning for Kids; no blocked or unlicensed whole-site embeds shipped.


## Resource detail adventures and provider trails (2026-11-14)
- [x] Replace passive detail banner with interactive original previews and shorter child-facing copy.
- [x] Add credited British Council English and e-learning for Kids maths four-stop trails, external provider links plus in-site practice.
- [x] Preserve saved participation/notes; test provider boundaries and desktop/mobile discovery.
- [x] a52b044 Vercel success; anonymous live mobile resource preview, English/maths links and saved guest participation verified.
