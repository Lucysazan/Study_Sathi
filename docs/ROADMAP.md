# Roadmap

Work top to bottom. Tick `[x]` when done and verified. Don't start a phase until the previous one builds and its checks pass. If a task grows, split it here rather than doing it all at once.

## Current status (2026-11-05)
- Phases 0-2: implementation complete; Vercel deployment remains outstanding.
- Phase 3: family accounts, profile, private library sync and merge implemented; browser acceptance checks remain.
- Phase 4: creator/admin flow, nine activity formats and stacked lessons implemented; cover/language and browser acceptance remain.
- Phase 5: lesson rendering, transactional progress, course resume and session views implemented; browser/mobile acceptance remains.
- Phase 6: lesson/quiz rewards, levels, streaks, badges, dashboard and parent-consented leaderboards implemented; browser acceptance remains. Phase 7 analytics/polish remain unfinished.
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
- [ ] Deploy preview to Vercel (needs the owner to connect the repo to a Vercel account)

## Phase 1 — Firebase foundation and auth
- [x] `firebase.json`, emulators config, `firestore.rules` (default deny), `firestore.indexes.json`
- [x] `lib/firebase/client.ts`, `lib/firebase/admin.ts` (server-only), env validation with zod
- [x] Session cookie route `/api/auth/session`, `getCurrentUser()`, `requireRole()`, `proxy.ts` (Next 16 name for middleware)
- [x] Login / signup pages (parent + creator applicant; student username login)
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
- [ ] Browser verify add child ? student login ? profile ? password reset at desktop/360px
- [ ] Browser verify sync across devices, merge, logout isolation and offline/retry feedback

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
- [ ] Cover/language metadata and checklist; evaluate splitting large inline course outlines into lesson documents if needed
- [ ] Browser verify rapid edits/autosave, submit, return to draft and publish; mobile layout

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
- [ ] Creator analytics (views, enrollments, completions, per-lesson drop-off)
- [ ] Admin overview cards
- [ ] Accessibility pass (keyboard, screen reader labels, focus, contrast)
- [ ] Error/empty/loading states on every route
- [ ] Playwright smoke tests: login per role, complete a lesson, publish a course
- [ ] Production deploy, rules deployed, seed run, authorized domains set

## Later (do not start without an ADR)
- Nepali UI translation · class/group leaderboards for volunteers · offline packs · certificates of completion · email notifications
