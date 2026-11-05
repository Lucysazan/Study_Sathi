# Handover

Last updated: 2026-11-05, Codex session 7. Branch: main.

## Current state
StudySathi is a Next.js 16.4.5 + Firebase LMS. Public pages, auth/session guards, admin resources/users, creator applications/drafts/review, and published learner courses are implemented. Phase 3 family/profile/private-library features and the seven-format Phase 5 player are implemented with automated regression coverage. Browser acceptance is still pending. ROADMAP now distinguishes implemented features from unchecked acceptance work.

The owner asked to continue toward all phases. Phases 6 (XP, streaks, badges, opt-in leaderboard) and 7 (analytics dashboards, accessibility/e2e, deployment) are NOT done. Phase 4 still needs sort/budget and stacked blocks/cover/language metadata. Current inline outlines have one content kind per lesson; do not claim full stacked-block support.

## Environment and tooling
- Both .env and .env.local currently have NEXT_PUBLIC_USE_EMULATORS=false. The old roadmap statement that local development uses emulators was wrong. Do not alter these flags or credentials to make the app appear to work.
- Use npm.cmd/npx.cmd in PowerShell; npm.ps1 is blocked by execution policy. Node is v26.13.0; repo .nvmrc asks for 24 (Firebase tooling emits an engine warning on 26).
- The incomplete node_modules installation was repaired with npm install --ignore-scripts --package-lock=false. No dependencies were added and no package manifest/lockfile changed.
- Sandbox blocks esbuild parent-directory lookup and Firebase CLI's external config. Tests passed with tool-approved execution outside sandbox.
- Rules tests are isolated to demo-studysathi-rules and do not clear live app data. No live account creation, password reset, course publishing, rules deploy or production deploy was performed.

## Session 7 implementation
- Fixed existing type/lint errors (editor array indexes, optional quiz answer, PortalWelcome children and audit action types).
- Fixed the major outline mismatch: save { modules: [...] }, accept old array outlines through readCourseOutline. Creator draft saves/submission are transactional and draft-only. New courses are always drafts even if a request supplies another status. Submission saves current edits before review. Published/review courses show an edit lock.
- Shared LessonContent renders escaped text, privacy-enhanced YouTube/Vimeo, safe HTTPS images/resources, practice quizzes, reflection notes and checkpoints. Creator preview uses the same renderer. Media and image descriptions are required at submission/publication; duplicate lesson IDs are rejected.
- Enrollment/completion are transactional and idempotent. Progress validates actual lesson membership. Course UI shows progress and resumes the first unfinished lesson; mobile completion controls are sticky. Historical counters are not backfilled.
- CourseView counts once per authenticated session-cookie lifetime/course through a SHA-256 digest event and atomic stats.views increment. courseViews has expiresAt but no TTL/cleanup policy was deployed.
- Parent can create student accounts (synthetic username email, student claim, parent link; leaderboard off by default), reset only a linked child's password and revoke sessions. Auth creation is compensated if Firestore linking fails. Family limit is 10. Student profiles use nickname and 12 fixed icon avatars, including existing yak; Firestore rules enforce the same IDs.
- Private account library uses users/{uid}/privateData/library for savedIds, path progress and notes. Authenticated server actions check expected uid; default-deny client rules remain. Client queues mutations, debounces notes and flushes pending work before navigation reloads. It keeps cloud data in memory separate from guest localStorage. Merge preserves existing account notes, is idempotent and only clears guest data after success. Limits bound the document size.

## Verified
- npm.cmd run lint: PASS (no warnings at final lint run).
- npm.cmd run typecheck: PASS.
- npm.cmd run test: 101 tests / 21 files PASS.
- npm.cmd run test:rules: 13 tests PASS (including private-data, forged view/progress writes and fixed avatars).
- npm.cmd run build: PASS. Public catalogue used bundled seed fallback; this does not verify live catalogue seeding.
- Browser host/native pipe unavailable through computer-use inventory; no browser/mobile/screenshots or cross-device acceptance claimed.

## Next steps in order
1. Browser verify Phase 3: parent add-child ? username login ? profile ? password reset; test merge, logout isolation, notes and saved items across devices; mobile at 360px.
2. Browser verify Phase 4/5: autosave rapid edits, review/publish, safe media, reflection persistence, course completion/replay/concurrent tabs and session view deduplication. In particular test client sync during navigation/sign-out/offline failures; automated tests cover server boundaries/pure merge logic rather than DOM interactions.
3. Finish Phase 4 sort/budget and multi-block lesson model with explicit compatibility/migration plan; do not silently replace existing inline courses.
4. Implement Phase 6 using ARCHITECTURE XP rules: pure date/level/streak/badge tests, transactional xpEvents, dashboard/celebrations and parent-consented leaderboards. Quizzes currently provide practice feedback, NOT server-graded mastery or XP.
5. Phase 7 creator/admin analytics using tracked stats, accessibility/mobile/e2e, then Vercel deployment and explicit live smoke checks.

## Code map and guardrails
Read AGENTS.md, CLAUDE.md, DESIGN.md, ROADMAP, recent session log and installed Next docs before changes. Session/cookie reads stay in Suspense-safe request-time contexts; layouts alone do not protect data. All actions re-check role/ownership; firebase-admin bypasses client rules.
Learner routes/actions: src/app/learn/courses; family actions: src/app/parent/actions.ts; profile: src/app/learn/profile; editor: src/app/creator/drafts; helpers: src/lib/course; private sync: src/lib/storage/{library,actions,account-store,guest-data} and components/layout/LibrarySync.tsx. ARCHITECTURE now documents actual current storage separately from planned storage.

## Working tree and checkpoint
Session began with extensive uncommitted earlier portal/course work, which was preserved and extended. The local checkpoint includes that related src/docs work together with this session's changes. scripts/ensure-admin-user.mjs was already untracked and is intentionally excluded. No env files, service-account files or secrets are included. No push/deploy was requested or performed.

Session 8 checkpoint in progress: sort/budget editors and players plus optional stacked blocks are implemented. Old single-kind lessons and array outlines remain readable. Lesson-level completion stays unchanged. Lint/typecheck and 114 tests pass. See current ROADMAP; cover/language and browser acceptance remain. Next work is Phase 6 rewards.
