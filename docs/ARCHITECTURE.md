# Architecture

Keep this file accurate. If you change the data model, rules or auth flow, update this file in the same commit and add an entry to `logs/DECISIONS.md`.

## 1. Roles

| Role | How they get it | Can do |
| --- | --- | --- |
| `guest` | Not signed in | Public site; bookmarks/notes in localStorage |
| `student` | Created by a parent (or by admin) | Learn, earn XP, leaderboard, own profile (nickname + avatar) |
| `parent` | Self sign-up (email/password or Google) | Create/manage linked students, view their progress, leaderboard opt-in |
| `creator` | Sign up → apply → admin approves | Create/edit own courses, submit for review, view own analytics |
| `admin` | `scripts/set-role.ts` or another admin | Everything; approvals, publishing, users, resources, badges |

Roles live in two places, both written **only by server code**:
- Firebase Auth **custom claim** `role` (used by Firestore rules and session checks).
- `users/{uid}.role` (used for listing and display).

After changing a role, the server revokes refresh tokens so the new claim applies on next sign-in.

## 2. Authentication flow

- Adults: Firebase Auth email/password or Google, client side.
- Students (no email needed): parent picks a **username** and **password** for the child. The server creates a Firebase Auth user with a synthetic email `{username}@${STUDENT_LOGIN_DOMAIN}` (never emailed). Students log in with username + password; the login form adds the domain. Parents can reset the child's password from the parent portal (server action → `admin.auth().updateUser`).
- After client sign-in, the client posts the ID token to `POST /api/auth/session`; the server verifies it and sets an httpOnly, secure, `sameSite=lax` session cookie (`createSessionCookie`, 5–14 days). `DELETE` clears it and revokes tokens.
- `src/proxy.ts` (Next 16 renamed middleware to proxy): if a `/learn`, `/parent`, `/creator`, `/admin` or `/account` route has no session cookie → redirect to `/login?next=...`. It does **not** verify the cookie.
- Each portal `layout.tsx` uses `PortalShell` → `RoleGate` → `requireRole([...])`, which verifies the cookie with `verifySessionCookie(cookie, true)` (also catches revoked tokens and disabled accounts) and redirects: not signed in → login; wrong role → the user's own home. With Cache Components this check runs inside `<Suspense>`, so the site header/footer stay in the static shell.
- **Layouts do not protect pages.** Next renders a layout and its page in parallel, so the page runs even if the layout redirects (Next docs: authentication.md "Layouts and auth checks"). Every admin data function calls `requireAdmin()` itself (`src/lib/admin/guard.ts`, data access layer), and every Server Action calls `getAdmin()`/role checks before doing anything. `PortalShell` in the layout is only an extra layer.
- `next` after login is accepted only as a same-site path (`safeNextPath`).
- Session cookie: httpOnly, `sameSite=lax`, secure in production, 7 days; minted only from a sign-in less than 5 minutes old. `/api/auth/session` rejects requests whose `Origin` is not this site.
- A second, readable cookie `ss_signed_in=1` only tells the static header to show "My account" instead of "Log in". It grants nothing.
- **Adult sign-up** (`/signup`): Firebase creates the user in the browser → server action `completeSignup` verifies the ID token and sets up the account (`setUpAccount`): parents get the `parent` claim + user doc; creator applicants get a user doc with `role: null, requestedRole: 'creator'` and no claim until an admin approves them (Phase 4) → the browser refreshes its token and posts it to `/api/auth/session` again. A first Google sign-in from `/login` (no user doc yet) shows the same setup step.
- Role changes (`assignRole`, used by `scripts/set-role.ts` and later the admin UI) update the claim and user doc, write `auditLog`, and revoke refresh tokens.

## 3. Firestore data model

```
users/{uid}
  role (null until approved for creator applicants), requestedRole?: 'creator'
  displayName (adults only), nickname, avatarId, createdAt, updatedAt?, status: active|disabled
  # no email stored here: it already lives in Firebase Auth (minimum personal data)
  parentUid?            # students
  childUids?: string[]  # parents
  leaderboardOptIn: bool (students, default false, set by parent)
  stats: { xp, level, streakDays, lastActiveDate, badgeIds[] }   # server-only

users/{uid}/xpEvents/{eventKey}       # server-only ledger; eventKey = idempotency key, e.g. "lesson:{courseId}:{lessonId}"
  amount, reason, createdAt
users/{uid}/notes/{noteKey}           # private reflections (student/parent can read own)
users/{uid}/saved/{resourceId}        # bookmarks for signed-in users

resources/{id}                        # the 15 curated resources (+ admin additions); same shape as legacy Resource type
learningPaths/{id}                    # 3 fixed paths, seeded

courses/{courseId}
  title, slug, summary, category, minAge, maxAge, language, coverImageUrl?
  creatorUid, creatorName
  status: draft | in_review | changes_requested | published | archived
  reviewNote?                          # admin feedback
  moduleOrder: [{ id, title, lessonIds: [] }]   # whole outline in one read
  lessonCount, totalXp, estimatedMinutes
  stats: { views, enrollments, completions }    # server-only counters
  createdAt, updatedAt, publishedAt?

courses/{courseId}/lessons/{lessonId}
  title, xp, estimatedMinutes
  blocks: Block[]                      # all blocks in one document (keep under ~900 KB)

enrollments/{uid}_{courseId}
  uid, courseId, completedLessonIds[], quizBest: { [blockId]: score }, startedAt, completedAt?, lastLessonId

leaderboards/{periodId}               # e.g. "all-time", "week-2026-W45"
  top: [{ uid, nickname, avatarId, xp }]   # top 20, server maintained, one read per view
leaderboards/{periodId}/entries/{uid}      # each opted-in student's weekly xp (for computing rank)

badges/{badgeId}                      # name, description, icon (lucide name), rule {type, value}
creatorApplications/{uid}             # status: pending|approved|rejected, motivation, createdAt
auditLog/{autoId}                     # admin/creator actions: actorUid, action, target, at
```

### Block types (lesson content)

| type | Fields | Notes |
| --- | --- | --- |
| `text` | `markdown` | Rendered with a sanitizer; no raw HTML |
| `video` | `provider: youtube\|vimeo`, `url`, `caption` | Embed only; use privacy-enhanced YouTube (`youtube-nocookie.com`) |
| `image` | `url`, `alt` (required) | See ADR-004 for hosting |
| `resource` | `resourceId`, `tip` | Card linking to a library resource |
| `quiz` | `questions: [{ prompt, kind: single\|multi\|truefalse, options, correct, explain }]`, `passScore` | Instant kind feedback |
| `sort` | `buckets: [..]`, `items: [{ label, bucket }]` | e.g. needs vs wants; tap-to-place, no drag required |
| `budget` | `total`, `currency`, `categories: [..]` | Generalized from the NPR 500 activity |
| `reflection` | `prompt` | Private; stored in `users/{uid}/notes` |
| `checkpoint` | `message` | Celebration / summary between sections |

New block types require an ADR. Each block type = one editor component (`components/blocks/editors`) + one player component (`components/blocks/players`) + a zod schema.

## 3b. Catalogue reads (public site)

`getCatalog()` (`src/data/catalog.server.ts`) reads `resources` + `learningPaths` with firebase-admin inside `'use cache'`, tag `catalog`, `cacheLife('hours')`. Admin saves call `updateTag('catalog')` so visitors see changes on the next load. If Firestore is empty, unreachable or slower than 4 s, it serves the bundled seed (`src/data/seed/*`) with `cacheLife('minutes')`. Builds therefore never need Firebase. Resource ids are numeric for the seed and title slugs for admin-added ones.

## 4. Security rules (principles)

- Default deny.
- Public read: `resources`, `learningPaths`, `badges`, `courses` where `status == 'published'` (and their lessons), `leaderboards/*` top docs.
- Creators: read/write their own courses while `status in [draft, changes_requested]`; cannot change `status` beyond `draft → in_review`, cannot touch `stats`.
- Students: read own `users/{uid}`, `enrollments` they own, own `notes`, own `saved`. Write only `notes`, `saved`, and `nickname`/`avatarId` on own user doc.
- Parents: read their children's user docs and enrollments (`uid in parent.childUids`).
- Admin claim: full access.
- **Never client-writable:** `role`, `stats`, `xpEvents`, `leaderboards`, course `status` (except creator submit), course `stats`, `auditLog`.
- Every rule has a test in `tests/rules/` run against the emulator.

## 5. Gamification rules (v1)

Implemented as pure functions in `lib/gamification/` (unit tested), applied by server actions inside a Firestore transaction.

- **XP:** lesson complete = lesson `xp` (default 10). Quiz: up to +5 on first pass; retries can still pass but award no extra XP. Course complete bonus = +50. Daily streak bonus = +5 (first completion of the day).
- **Idempotency:** each award writes `xpEvents/{eventKey}` first; if it exists, no XP is given. Prevents double points from refreshes or replays.
- **Levels:** level = thresholds `[0, 50, 120, 220, 350, 520, 750, 1000, ...]`; level names are friendly (Seedling, Sprout, Sapling, Tree...).
- **Streaks:** calendar days in `Asia/Kathmandu` time. Missing a day resets gently ("Start a new streak today!"); no guilt messages.
- **Badges:** rule types `first_lesson`, `course_complete`, `category_complete`, `streak_days`, `xp_total`, `quiz_perfect`. Checked after each award.
- **Leaderboard:** only opted-in students (parent consent). Shows nickname + avatar only. Weekly board resets Sunday 00:00 Kathmandu time; all-time board too. Students always see their own rank; the page shows the top 10 plus "you" — never a "bottom of the list".
- **Healthy design:** no timers on quizzes, no loss of points, no streak-shaming, celebrate effort ("You finished 3 lessons this week!").

## 6. Free-tier budget (design constraints)

- Firestore Spark: ~50k reads, 20k writes, 20k deletes per day, 1 GiB storage. Public pages are statically generated or cached (ISR) so visitors don't cost reads. Course outline = 1 read; lesson = 1 read; leaderboard = 1 read.
- View counts: increment at most once per session per course (cookie flag) through a server action.
- No Cloud Functions, no scheduled functions: weekly leaderboard rollover happens lazily (period id derived from date; first write of a new week creates the new doc).
- Vercel Hobby: serverless function limits apply; keep server actions short.

## 7. Guest data migration

Guests keep using localStorage keys from the prototype (`studysathi-saved`, `studysathi-progress`, `studysathi-notes`). On first sign-in as a student, offer "Bring your saved items into your account?" and merge them via a server action, then clear local keys.

## Current implemented storage (2026-11-05)
The model above includes planned work. Current course routes use courses/{id}.outline = { modules: [{ id, title, lessons: [{ id, title, kind, duration, ...content }] }] }. Legacy array-shaped outlines are read compatibly. Creator identity is createdBy; statuses are draft/review/published. Full stacked block lesson documents remain on the roadmap.
Student enrollment lives at courseEnrollments/{uid}_{courseId}; progress at courseProgress/{uid}_{courseId} with completedLessons, nextLessonId, updatedAt and completedAt. Transactions protect review status, enrollment, progress and course stats counters. courseViews/{sessionCourseDigest} deduplicates views without persisting a raw auth token.
Private library data uses users/{uid}/privateData/library = { savedIds, progress, notes }. Server actions check the current student and expected uid. Cloud data stays in client memory, separate from guest localStorage; the merge prompt preserves existing account notes. Profiles use nickname plus one of 12 fixed avatar IDs. Parent-created students use the configured synthetic email domain and default leaderboardOptIn=false. Phase 6 awards/leaderboards are not implemented yet.

## Stacked activities and rewards (2026-11-05)
Inline lessons now optionally contain blocks (1-12 validated content records); stacks replace parent content during rendering. Legacy lessons without blocks and legacy array outlines remain readable. Lesson IDs remain the unit of navigation, completion and XP; child block IDs identify practice/reflection state. Sort and fictional NPR budget activities bring the supported format count to nine. Course outline writes have a 700 KB serialized limit.
New completion transactions read course, enrollment, progress, user stats and hashed lesson xpEvents before any writes. A fresh completion writes the ledger, validated stats and progress atomically; course completion/daily bonuses cannot repeat across concurrent tabs. Legacy completed lessons receive no retroactive reward. Quiz bonuses, perfect-quiz badges and opt-in leaderboards are still pending.

## Phase 6 completion update (2026-11-05, session 9)
Quiz rewards and leaderboards are now implemented, superseding the earlier pending notes. submitQuiz validates course publication, enrollment, lesson/block membership and a stored answer option. Successful grading atomically writes a quiz-specific xpEvent, +5 XP and the perfect-quiz flag/badge; replay rewards are zero. Practice preview stays local.
The parent consent action atomically updates leaderboardOptIn and minimal XP entries for all-time/current Sunday-start Kathmandu week. Reward transactions read the same user document before writing entries. Account disable or role changes clear consent and delete both entries. getLeaderboard checks student auth and live participant consent/status and returns rank/nickname/avatar/XP/isYou only. Archived-period entries are server-only. Digital Safety course/badge category is digital-safety.

## Phase 7 analytics update (2026-11-05, session 10)
Creator /creator/analytics lists owned courses in 20-row pages; detail reads only an owned course and its aggregate stats. Admin overview adds global learning aggregates. Independent sum queries avoid intersections of sparse legacy stats. No learner identities/private notes are fetched for these views.
Course stats now include lessonCompletions keyed by literal lesson ID, plus analyticsEnrollments/analyticsCompletions for a comparable cohort. New enrollments have analyticsVersion=1. Counters are written atomically with existing progress/enrollment transactions and are idempotent. Earlier enrollment docs are not backfilled; completion rate is for this new cohort, while other cards show prospective recorded totals. Relative per-lesson completion bars do not imply abandonment. Root loading/error boundaries and analytics-specific error/not-found recovery use the installed Next 16 retry API.
