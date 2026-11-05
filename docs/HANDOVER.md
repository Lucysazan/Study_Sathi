# Handover

Last updated: 2026-11-05, Codex session 11. Branch: main.

## Current state
StudySathi is a Next.js 16.4.5 + Firebase LMS. Core public/auth/admin/family/course flows, nine activity formats with stacked lessons, gamification/consented leaderboards and analytics are implemented. Cover/language metadata and submission checklist are now implemented. Browser/mobile acceptance, DESIGN polish, accessibility/e2e and deployment remain unfinished. ROADMAP is current; do not claim all phases complete.

## Session 11 changes
- Draft schema adds language, coverImageUrl and coverAlt. Language options are English/Nepali/English and Nepali (content labels only; UI remains English). Drafts can leave these blank; review/publishing require explicit language, HTTPS cover and a 2-240 character image description.
- Shared CourseMetadataFields and CourseCover power new/edit forms. New drafts always stay draft and open their editor after creation. Removed misleading review-status selection. CourseCover uses next/image unoptimized with scheme checks and a load-failure fallback; no upload/proxy/dependency added.
- Editor metadata and outline save atomically, with status forced draft and unknown/ownership fields stripped. Autosave skips untouched initial state; validation feedback is readable. Shared CourseChecklist validates all metadata and nested lesson readiness. Review submission saves current edits before validating the stored course.
- Admin review shows cover/language/checklist and shared actual lesson previews. Quiz preview gives no XP; no courseId is passed. Publishing now validates and updates in one transaction, blocking stale-check races with edits. Creator/student routes are revalidated after writes/status changes.
- Student course catalogue/detail show optional cover and teaching language. Legacy published courses stay readable without migration; missing language shows Not specified, never an inferred English label. Legacy drafts need new metadata before submission/republishing.

## Validation
- 138 unit tests / 27 files PASS.
- 40 emulator tests / 5 files PASS: includes metadata injection/ownership, incomplete review/publish rejection, legacy compatibility and an edit/publish race; all prior analytics, reward, quiz, consent and rules cases remain passing.
- Lint, typecheck, production build PASS. Public build used catalogue seed fallback; this does not prove live seeding.
- Browser/native host unavailable, rechecked. No visual/mobile, end-to-end click-through, cross-device or live index/query acceptance claimed.
- No live data/config mutation, env/service-account change, rules/index deployment, push or Vercel deploy performed.

## Environment
.env and .env.local retain NEXT_PUBLIC_USE_EMULATORS=false. Keep production parity. PowerShell uses npm.cmd/npx.cmd (npm.ps1 blocked). .nvmrc is 24; Node 26 host works with Firebase CLI engine warning. Some tests need approved execution outside sandbox for esbuild/CLI config.
All integration writers require loopback FIRESTORE_EMULATOR_HOST and dedicated disposable demo projects: rules, rewards, leaderboards, review and per-test analytics. They do not initialize from live app config.

## Next work
1. Browser acceptance of Phases 3-7: parent/child/reset/profile; private sync/merge/logout; metadata and stacked editor/autosave/review/publish; quizzes, XP/dashboard, leaderboard consent; analytics pagination/errors; keyboard and 360px layout. Browser host must be available for visual acceptance.
2. DESIGN polish: student header XP/avatar and recommendations; parent progress summaries. Audit route-specific empty/error/loading states and accessibility.
3. E2e smoke tests and final deployment/live smoke checks. No abandonment tracker exists: analytics show completion funnels only. No view-event TTL cleanup was deployed.

## Code map/invariants
Read AGENTS.md, CLAUDE.md, DESIGN, ROADMAP and logs. Use installed Next docs before APIs. Session checks must stay request-time/Suspense-safe; layouts alone do not protect data. Admin SDK bypasses client rules, so actions/data readers must check role/ownership.
- lib/course/{draft,metadata,outline,learning,activities}: schemas, metadata/checklist and legacy compatibility. Old array outlines and single-kind lessons remain supported; optional blocks (1-12), unique IDs and 700 KB outline bound. Progress/XP remain lesson-level.
- components/course/{CourseMetadataFields,CourseCover,CourseChecklist}; creator/new and drafts: metadata editor and combined save. lib/admin/courses: transactional publish and readiness; admin review preview omits courseId so it never awards XP.
- lib/analytics and creator/analytics: owned paginated aggregates, admin learning totals, relative lesson completion charts. No learner identities/private notes fetched. New enrollments have analyticsVersion=1; analyticsEnrollments/analyticsCompletions form the new-enrollment rate cohort. Earlier records are not relabeled/backfilled. lessonCompletions uses literal FieldPath IDs and idempotent increments.
- lib/gamification: fixed new-lesson XP 10 + first daily lesson 5 + first course completion 50; Kathmandu dates/Sunday weeks; levels then +350 after 1000. First trusted correct quiz pass +5 once, no daily/lesson bonus; Digital Safety badge matches digital-safety only. Replays/legacy completions never gain retroactive lesson XP.
- Leaderboard entries store XP only; guarded presentation returns nickname/avatar/rank/XP/isYou. Parent consent and award transactions share a boundary; opt-out/admin disable/role change revoke entries/consent. Re-enable never silently re-consents. Archived week entries are server-only.
- Private library at users/{uid}/privateData/library; queued account sync, debounced/flush notes and idempotent guest merge. Existing account notes win and guest state clears only after confirmed success. Browser/offline acceptance remains pending.

## Checkpoints
Previous checkpoints include faf5409 and c112725. Session 11 code/docs/tests form a local metadata checkpoint. Pre-existing scripts/ensure-admin-user.mjs remains untracked/excluded. No env/service-account files staged; no push/deploy.
