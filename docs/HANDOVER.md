# Handover

Last updated: 2026-11-05, Codex session 14. Branch: main.

## Current state
StudySathi is a Next.js 16.4.5 + Firebase LMS. Core public/auth/admin/family/course flows, nine activity formats with stacked lessons, gamification/consented leaderboards and analytics are implemented. Cover/language metadata and submission checklist are now implemented. Student account toolbar, course discovery and linked-parent progress are implemented. Desktop/360px Chromium smoke tests now pass. Broader assistive-technology/manual acceptance and final live deployment/index verification remain unfinished. ROADMAP is current; do not claim all phases complete.

## Session 14 changes
- Added @playwright/test (dev dependency) and npm run test:e2e: owns fresh local Auth/Firestore emulators, a separate localhost:3100 Next server/.next-e2e output, demo project and cookie overrides, one worker, desktop/360px Chromium. No normal env files changed; no production test accounts created. External browser requests blocked; artifacts ignored.
- 22 browser tests cover all four logins, role redirect/httpOnly cookie, stacked quiz wrong/correct/repeat rewards, enrollment/completion/refresh, immediate metadata submission/admin publish, skip/menu focus, parent create/consent/progress/password reset and session revocation, profile/offline retry/logout, guest merge/cross-browser sync/logout isolation/private-note exclusion, analytics and missing-course recovery. Mobile student/admin screenshots inspected; this is not full screen-reader/real-device acceptance.
- Browser-discovered fixes: login labels no longer include hint/error text in their names; manual save/review submission includes current metadata and waits for in-flight autosave; draft network failures show feedback; account forms preserve typed values after failure; account/learning forms catch connection failures; logout stays on the page with retry feedback when the session-clear request fails.
- Added check:live (read-only, --prod --project required), seven missing course indexes, release guide and npm ci Vercel installs. Live queries proved missing indexes for catalog/review and owner-scoped sum analytics; emulators do not enforce these indexes.
- User confirmed studysathisip.vercel.app is the existing Git-connected site and explicitly authorized push; site HTTP 200. GitHub main was 80290cc (Phase 2), behind local LMS changes. No local Vercel token/link; do not infer no Git connection from this.
- User explicitly approved production rules/index deployment to studysathi-20d2c. CLI stopped at Service Usage GET 403. Existing Rules API deployment succeeded: release now projects/studysathi-20d2c/rulesets/e838422c-f480-478e-a42a-415ce8a6eaa9; prior ruleset f7d1966c-596e-46b2-8902-73054af5c71e. Index creation was denied by Google Cloud (permission 7). No indexes created and no IAM changes attempted. Owner Firebase CLI login requested; seven index definitions are ready for deployment.
- Live Auth config already includes studysathisip.vercel.app. Web/admin configs and service account were checked for matching studysathi-20d2c; emulator flag remains false. No credential contents logged or staged.

## Session 13 changes
- Accessibility code pass: mobile navigation Escape restores focus to the toggle; skip target is programmatically focusable; AccountForm exposes aria-busy and connects field errors with aria-invalid/aria-describedby and unique IDs.
- Account field-group inputs/selects now use existing design tokens, 44px targets and constrained widths. Portal links have 44px targets and long learner/course text can wrap.
- Student, parent, creator and admin segments now have loading, error retry and generic not-found screens with role-appropriate dashboard links. Shared PortalRecovery never renders raw errors or claims unsaved edits are safe. Existing analytics-specific boundaries remain.
- These are source-level improvements. Desktop/360px, keyboard, zoom, screen-reader and contrast acceptance remain unverified; see docs/ACCEPTANCE.md for the next check sequence.

## Session 12 changes
- Student toolbar inside the guarded /learn layout shows XP, level, fixed avatar, profile/saved links and logout. Its independent session read runs under Suspense; React cache shares account reads only within a request. Rewards/profile edits invalidate the learning layout.
- Dashboard discovery reads at most six published metadata records and returns up to three unenrolled candidates. This is deterministic discovery, not AI personalization; an exhausted candidate batch links to the catalog.
- Parent dashboard validates/deduplicates/caps linked IDs at ten, verifies student role and parentUid, and shows level, recorded weekly lessons, current published course and a progress link. The independently guarded /parent/children/[id] page verifies current ownership before any course reads and matching enrollment fields before exposing published outline titles. Private notes are never fetched.
- Weekly lesson count is server-maintained with Kathmandu Sunday rollover, including when a quiz begins a new week. Existing records default to zero; no historical backfill. Parent totals are explicitly recorded totals.
- Shared pure course summary ignores stale completion IDs and does not call an empty course complete.

## Session 11 changes
- Draft schema adds language, coverImageUrl and coverAlt. Language options are English/Nepali/English and Nepali (content labels only; UI remains English). Drafts can leave these blank; review/publishing require explicit language, HTTPS cover and a 2-240 character image description.
- Shared CourseMetadataFields and CourseCover power new/edit forms. New drafts always stay draft and open their editor after creation. Removed misleading review-status selection. CourseCover uses next/image unoptimized with scheme checks and a load-failure fallback; no upload/proxy/dependency added.
- Editor metadata and outline save atomically, with status forced draft and unknown/ownership fields stripped. Autosave skips untouched initial state; validation feedback is readable. Shared CourseChecklist validates all metadata and nested lesson readiness. Review submission saves current edits before validating the stored course.
- Admin review shows cover/language/checklist and shared actual lesson previews. Quiz preview gives no XP; no courseId is passed. Publishing now validates and updates in one transaction, blocking stale-check races with edits. Creator/student routes are revalidated after writes/status changes.
- Student course catalogue/detail show optional cover and teaching language. Legacy published courses stay readable without migration; missing language shows Not specified, never an inferred English label. Legacy drafts need new metadata before submission/republishing.

## Validation
- 141 unit tests / 29 files PASS.
- 43 emulator tests / 6 files PASS this session: includes family ownership/role guards, matching enrollment and published-course privacy, discovery filtering, and all prior review/analytics/reward/consent/rules cases.
- Lint, typecheck, production build PASS. Public build used catalogue seed fallback; this does not prove live seeding.
- 22 Playwright Chromium tests PASS across desktop/360px; see Session 14 coverage and limits. Native UI host is not needed for the automated suite. Production login/play-through is not yet verified.
- Production rules deployed with explicit approval; live read-only config/query checks performed. Index creation denied by IAM. No env/service-account/IAM changes or production test-account writes. Push/deployment outcome to be recorded below.

## Environment
.env and .env.local retain NEXT_PUBLIC_USE_EMULATORS=false. Keep production parity. PowerShell uses npm.cmd/npx.cmd (npm.ps1 blocked). .nvmrc is 24; Node 26 host works with Firebase CLI engine warning. Some tests need approved execution outside sandbox for esbuild/CLI config.
All integration writers require loopback FIRESTORE_EMULATOR_HOST and dedicated disposable demo projects: rules, rewards, leaderboards, review and per-test analytics. They do not initialize from live app config.

## Next work
1. Complete remaining manual/assistive-technology acceptance of Phases 3-7 (smoke coverage now exists): parent/child/reset/profile; private sync/merge/logout; metadata and stacked editor/autosave/review/publish; quizzes, XP/dashboard, leaderboard consent; analytics pagination/errors; keyboard and 360px layout. Use npm run test:e2e for browser regression; remaining manual checks are in ACCEPTANCE.md.
2. Run docs/ACCEPTANCE.md for route recovery, keyboard/forms, zoom, screen readers and desktop/360px views. Portal boundaries and source-level accessibility fixes are implemented; acceptance remains pending.
3. Owner must log into Firebase CLI to deploy the seven indexes (service-account index create denied), then run check:live and verify the Git-triggered Vercel release. Production seeding and authenticated live smoke still need verification. No abandonment tracker exists: analytics show completion funnels only. No view-event TTL cleanup was deployed.

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
