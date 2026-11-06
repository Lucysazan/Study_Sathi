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
