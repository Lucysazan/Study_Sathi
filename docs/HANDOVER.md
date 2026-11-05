# Handover

Last updated: 2026-11-05, Codex session 10. Branch: main.

## Current state
StudySathi is a Next.js 16.4.5 + Firebase LMS. Phases 0-6 feature implementation is largely present, with browser acceptance and Phase 4 cover/language metadata still pending. Phase 7 analytics and shared loading/error recovery are now implemented. Accessibility/mobile/e2e/deployment remain unfinished. ROADMAP distinguishes implementation from acceptance; do not claim all phases complete.

## Session 10 implementation
- Creator analytics at /creator/analytics and /creator/analytics/[id]: owned-course counts, recorded views/enrollments/completions, a comparable new-enrollment completion rate and per-lesson completion bars. List is paginated (20/page), selects only title/status/stats and totals remain independent of the selected page. Every data entry point checks creator/admin auth; detail returns no data for unowned IDs. No student identities, notes or individual progress are read for creator analytics.
- Creator studio uses real draft/review/published counts instead of hard-coded zeros and links to analytics. Admin overview includes guarded global learning metrics.
- Independent aggregate sums keep sparse older course documents from excluding unrelated stats. Creator workspace uses only three status counts. No new dependency or index/rules deployment.
- New enrollment documents have analyticsVersion=1. The same transaction increments stats.analyticsEnrollments. First course completion increments stats.analyticsCompletions only for that versioned cohort. This is the denominator/numerator of the new-enrollment completion rate; earlier enrollments are not relabeled/backfilled. Other cards still show prospective recorded totals. Per-lesson counts increment only on a new completion, using FieldPath for literal IDs (including dots). Completion/reward atomicity is preserved.
- Completion bars are relative to the largest recorded lesson count and explicitly do not infer abandonment. Missing old counters show no recorded events; invalid numeric counters fail rather than showing invented values.
- Root loading/error boundaries plus analytics error/not-found/empty states. Installed Next 16 docs specify retry(), not the older reset-only pattern. Recovery UI never displays raw server errors.

## Verification
- 131 unit tests / 26 files PASS.
- 36 emulator tests / 4 files PASS: includes ownership/role isolation, independent sparse sums, cursor pagination, empty cohorts, forged metrics/markers, dotted lesson IDs and concurrent/replayed counters, plus previous rewards/consent/privacy cases.
- Lint, typecheck and production build PASS. Public build used bundled catalogue fallback; it does not prove live seeding.
- Browser/native host is unavailable, rechecked this session. Visual/mobile, click-through, live query/index and cross-device acceptance remain unverified.
- No live mutations, credential/environment changes, rules/index deploy, push or Vercel deploy were performed.

## Environment and tests
Both .env and .env.local still set NEXT_PUBLIC_USE_EMULATORS=false; keep production parity. PowerShell uses npm.cmd/npx.cmd because npm.ps1 is blocked. .nvmrc is 24; host Node 26 works with a Firebase CLI engine warning.
Emulator tests strictly require loopback FIRESTORE_EMULATOR_HOST and disposable demo projects (rules, rewards, leaderboards, per-test demo-analytics-*). They never initialize from live app config. Tests needing esbuild/Firebase CLI config may require approved execution outside the sandbox.

## Next tasks
1. Browser acceptance across Phases 3-7: family/reset/profile, sync/merge/logout isolation, autosave/review/publish, stacked activities, quizzes/rewards, dashboard/leaderboard consent, analytics ownership/pagination/error recovery, keyboard and 360px layout. Browser host must be available before claiming these checked.
2. Finish cover/language metadata and checklist from Phase 4; header avatar/XP and recommendations are still polish work.
3. Continue Phase 7 accessibility and route-specific states audit, e2e smoke tests and deployment/live smoke checks. No real dropout instrument exists: current analytics are completion funnels only.

## Code map and invariants
Read AGENTS.md, CLAUDE.md, DESIGN, ROADMAP and logs. Consult installed Next docs before Next APIs. Session checks are request-time and Suspense-safe. Layouts alone do not guard data. Firebase Admin bypasses rules; actions/data functions must authorize roles/ownership.
- src/lib/analytics/{courses,metrics}, components/course/AnalyticsMetrics and creator/analytics routes: guarded aggregate analytics. Global admin metrics integrate in lib/admin/overview.ts. Lesson/cohort writers are in learn/courses/actions.ts.
- src/lib/course: nine formats and optional blocks (1-12), legacy array and single-format compatibility, unique IDs and 700 KB outline bound. Lesson IDs remain progress/XP units; blocks have their own practice/reflection IDs.
- src/lib/gamification: lesson XP 10, first daily lesson +5, first course completion +50; Kathmandu days/Sunday weeks; default level thresholds then +350 after 1000. Legacy completed lessons do not gain replay XP. Trusted quiz first-success +5 once, no daily/lesson-count bonus; seeded perfect-quiz badge. Digital Safety is explicit digital-safety; Digital Skills does not qualify.
- Leaderboard entries store XP only for all-time/current week; getLeaderboard returns presentation-only rows after live consent/status checks. Parent consent and reward writes share a transaction boundary; opt-out or admin disable/role change removes entries/revokes consent. Re-enable does not silently re-consent. Archived entries are server-only.
- Private library at users/{uid}/privateData/library; storage modules/LibrarySync implement queued account changes and idempotent guest merge. Account notes win conflicts; guest copy clears only after confirmed success. Browser/offline acceptance is pending.
- View counts use session/course digests; expiresAt exists but no TTL cleanup was deployed. All tracked metrics are prospective without historical backfill.

## Working tree/checkpoints
Earlier checkpoints: 197a3e3, b8a77be, 3b5143a, faf5409. Session 10 code/docs/tests form a local analytics checkpoint. Pre-existing scripts/ensure-admin-user.mjs stays untracked/excluded. No env/service-account files are staged. No push/deploy.
