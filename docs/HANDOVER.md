# Handover

Last updated: 2026-11-05, Codex session 9. Branch: main.

## State
StudySathi is a Next.js 16.4.5 + Firebase LMS. Public/auth/admin, creator drafts/review, learner courses and family/private-library features are implemented. Lesson content supports nine formats and optional stacks. Phase 6 features now include lesson/quiz XP, levels, Kathmandu streaks/weeks, badges, dashboard and parent-consented weekly/all-time leaderboards. Browser acceptance is still pending; Phase 7 is not complete. ROADMAP is current.

## Session 9 changes
- submitQuiz checks current published course, student enrollment, parent lesson, selected quiz block (or legacy quiz) and stored answer options. The first correct pass earns 5 XP once; wrong answers/replays earn zero. A quiz event has a distinct hashed ledger key and awards the perfect-quiz badge. It does not alter daily streaks or lesson/course counts. Existing completion rewards stay atomic/idempotent.
- QuizPlayer uses server grading for student routes, local practice without points for creator preview, and retry feedback for transport/storage errors.
- Leaderboards at /learn/leaderboard support this week/all time, top 10 and your row beyond the top 10; tied XP shares rank. Only nickname/avatar/XP/rank/isYou cross the presentation boundary. Live consent/status/role are checked when rendering; no UID/email/parent link/private text is returned.
- A linked parent can turn visibility on/off in /parent. Off is the account default. Opt-in includes existing all-time/current-week XP; opt-out atomically deletes both current entries. Award writes share the consent transaction boundary, so an in-flight award cannot resurrect an opted-out child. Admin disable/role changes revoke consent/entries; account re-enable does not re-consent automatically.
- Minimal leaderboard entries hold XP only; archived week entries contain no names and have no student-facing read endpoint. Current-week rollover is lazy by Kathmandu Sunday date. No composite index required; queries use automatic single-field XP indexes.
- Added distinct digital-safety course category and canonical Safe Explorer rule; digital-skills does not qualify. Creator and catalogue share the category list. Existing courses and live badge docs were not rewritten. Runtime rewards use code-seeded badge definitions.

## Validation
- npm.cmd run lint, typecheck and build pass.
- Unit suite: 127 tests (25 files) PASS.
- Emulator suite: 28 tests across 3 files pass (14 rules + 7 reward/quiz + 7 leaderboard integration tests), including concurrent correct submissions, injected awards, missing enrollment, consent races, privacy, ties, beyond-top-ten ranks and administrative withdrawal.
- Browser/native host unavailable, rechecked this session. No click-through, mobile/screenshot or cross-device acceptance is claimed.
- No live user/consent/reward/course mutation, rules/index deployment or push/deploy performed. Build catalogue used bundled seed fallback; this does not prove live seeding.

## Environment
Both .env and .env.local still set NEXT_PUBLIC_USE_EMULATORS=false. Do not change credentials/environment to hide production issues. PowerShell uses npm.cmd/npx.cmd (npm.ps1 execution policy). .nvmrc is 24; host Node 26 works but Firebase CLI emits an engine warning. Tests requiring esbuild/Firebase CLI may need approved execution outside the sandbox.
Rules/reward/leaderboard integration tests strictly use loopback FIRESTORE_EMULATOR_HOST and dedicated disposable demo projects: demo-studysathi-rules, demo-studysathi-rewards-tests, demo-studysathi-leaderboard-tests. No real Firebase config is used in test writers.

## Next tasks
1. Browser acceptance across Phases 3-6: parent/child creation and reset, profile, sync/merge/logout isolation, editor/autosave/review/publish, stacked activities, quizzes/retries, XP/dashboard, weekly/all-time leaderboards and consent toggles; keyboard and 360px layout. Browser host needs to be available before claiming these verified.
2. Remaining Phase 4 cover/language metadata and checklist; recommendations/header avatar/XP are still polish work. Separate lesson-document storage is deferred behind the bounded inline model.
3. Phase 7 creator analytics (tracked views/enrollments/completions and per-lesson progress), admin analytics, accessibility/loading/error states, e2e smoke tests, then deployment/live smoke checks. Keep old catalogue seed fallback honest.

## Code map and invariants
Read AGENTS.md, CLAUDE.md, DESIGN, ROADMAP and logs. Next APIs: use installed docs. Data auth must run inside Suspense-safe request-time contexts; layouts alone do not protect reads. All admin writes bypass rules, so actions must validate session/role/ownership.
- src/lib/course/{draft,outline,learning,activities}: schemas/compatibility. Old array outlines and single-kind lessons still work; optional blocks (1-12) replace parent display content. IDs stay unique; serialized outlines are bounded at 700 KB. Completion/XP remain lesson-level.
- src/app/learn/courses/{actions,quiz,views}: progress/enrollment, trusted quiz action, session-digest view counter. Views have expiresAt but no deployed TTL cleanup; stats are prospective, with no historical backfill.
- src/lib/gamification/{stats,rewards,awards,dashboard,entries,leaderboard}: pure rules, transactional ledger writer, guarded data and consented XP mirrors. Lesson XP is 10 + first daily completion 5 + first course completion 50. Legacy completed lessons receive no replay/retroactive XP. Levels follow thresholds to 1000 then +350 each.
- src/app/parent/leaderboard-actions.ts: linked-parent consent. lib/admin/users.ts and lib/auth/accounts.ts withdraw entries on disable/role changes. entries.ts has no admin initialization and can be shared with trusted CLI scripts.
- Private library: users/{uid}/privateData/library; src/lib/storage and components/layout/LibrarySync implement account sync/guest merge. Existing account notes win conflicts and guest state clears only on confirmed merge. Browser/offline acceptance remains pending.

## Working tree
Previous checkpoints: 197a3e3, b8a77be, 3b5143a. Session 9 code/docs/tests are committed together locally. Pre-existing scripts/ensure-admin-user.mjs remains untracked and excluded. No env/service-account files are staged. No push/deploy performed.
