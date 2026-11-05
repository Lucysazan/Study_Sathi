# Handover

Last updated: 2026-11-05, Codex session 8. Branch: main.

## Current state
StudySathi is a Next.js 16.4.5 + Firebase LMS. Public/auth/admin, creator drafts/review and learner courses are implemented. Phase 3 family/profile/private-library features are implemented with browser acceptance pending. Phase 4/5 now support nine activity formats and stacked activities per lesson. Phase 6 core lesson XP, levels, streaks, baseline badges and dashboard are implemented. All phases are NOT complete: see ROADMAP for exact acceptance checks and outstanding scope.

## Session 8 changes
- Sort editor/player: 2-6 unique groups and 2-12 unique items, valid answer-group references, keyboard dropdowns and per-item practice feedback.
- Budget editor/player: fictional NPR whole rupees, total 1-1,000,000, 2-6 unique categories, remaining/overspend/balanced feedback. Neither practice activity claims mastery or awards client-controlled points.
- Optional blocks (1-12) per inline lesson; add/reorder/remove/change formats and shared student preview. Old single-format lessons and old array outlines remain compatible. Lesson-level progress IDs stay stable. Each block has its own ID. Validate nested readiness, unique IDs and a 700 KB serialized outline bound. Full separate lesson-document storage is deferred; no live migration was run.
- Pure gamification stats/rewards/time helpers; fixed 10 XP for a new lesson, +5 first lesson of a Kathmandu day and +50 first course completion. Ledger event keys hash course+lesson to avoid collisions. Progress, ledger and stats use one transaction. Preserve unrelated stats; reject malformed trusted totals rather than overwriting them. No retroactive XP on old completions/replays.
- Level thresholds follow ARCHITECTURE through 1000, then +350 per level. Streak/day and Sunday-week calculations use Asia/Kathmandu. Seeded first-lesson/course/streak/XP/category badge evaluation is in place; do not silently map the unmatched seed Digital Safety category to digital-skills. Quiz-perfect is not awarded until trusted grading exists.
- Learner dashboard replaces placeholder with level progress, XP, streak/habit, badges and current-course resume. All data access rechecks student role inside Suspense-safe request-time code. Completion feedback shows XP and static earned-badge cards. No confetti/motion is required.

## Environment and validation
- .env and .env.local both have NEXT_PUBLIC_USE_EMULATORS=false; the live app settings and credentials were not changed. Never switch these just to make tests pass.
- PowerShell uses npm.cmd/npx.cmd because npm.ps1 is blocked. Node 26 works here but .nvmrc remains 24; Firebase CLI has a Node-engine warning.
- Lint/typecheck and production build pass. Unit suite: 125 passing tests. Emulator suite: 16 passing tests (13 rules + 3 real concurrent completion/reward integration cases).
- Integration tests strictly require a loopback FIRESTORE_EMULATOR_HOST and use dedicated disposable demo-studysathi-rewards-tests. Rules use demo-studysathi-rules. No live user creation, reward write, publish, rules deploy or production deploy performed during checks.
- Browser/native host remains unavailable (rechecked this session). No desktop/mobile DOM or screenshot acceptance claimed. Public build used bundled catalogue fallback, which does not prove live Firestore seeding.

## Next work in order
1. Browser acceptance of Phases 3-6: family lifecycle, profile, sync/merge/logout isolation, autosave/review/publish, stacked sort/budget/reflection practice, completion/replay, reward feedback/dashboard, keyboard and 360px layout. Do not treat automated tests as visual acceptance.
2. Phase 4 cover/language metadata and submission checklist. Existing courses remain inline; split storage only with an explicit compatibility plan.
3. Phase 6 server-graded quiz XP/perfect badge, parent-consented weekly/all-time leaderboards (top 10 + you), parent toggle; reconcile category badges. Weekly totals are stored but no leaderboard entries/UI exist yet. Student header/recommendations remain polish work.
4. Phase 7 creator/admin analytics, accessibility/loading/error polish, e2e smoke tests and deployment/live verification.

## Code map and guardrails
Read AGENTS.md, CLAUDE.md, ROADMAP, DESIGN and logs; use installed Next docs before Next APIs. Auth/data checks remain in Suspense-safe request-time contexts; layouts alone do not protect data. Actions validate role/ownership; Firebase Admin bypasses client rules.
- src/lib/course/{draft,activities,learning,outline}: schemas, compatibility and pure feedback; components/course: shared player/editors including BlockStackEditor.
- src/app/learn/courses/actions.ts: transactional enrollment/completion; views.ts: session-digest view events. Counts are prospective, without historical backfill or a deployed view-event TTL cleanup policy.
- src/lib/gamification/{stats,rewards,awards,dashboard}: pure rules, trusted transactional writer and guarded dashboard data. Existing stats get default new fields.
- src/app/parent/actions.ts and learn/profile: linked student accounts/reset/profile; default leaderboard off. Fixed 12 icon avatars include yak.
- src/lib/storage/{library,actions,account-store,guest-data} and components/layout/LibrarySync: private library at users/{uid}/privateData/library; optimistic queued changes, debounced/flush notes, idempotent guest merge, cloud state separate from guest localStorage. Browser/offline acceptance still pending.

## Checkpoints
Session 7 checkpoint: 197a3e3. Session 8 lesson activities checkpoint: b8a77be. The Phase 6 checkpoint includes code/docs/tests together. scripts/ensure-admin-user.mjs was already untracked and remains excluded. No env/service-account files are staged; no push or deployment performed.
