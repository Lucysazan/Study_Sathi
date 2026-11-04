# Roadmap

Work top to bottom. Tick `[x]` when done and verified. Don't start a phase until the previous one builds and its checks pass. If a task grows, split it here rather than doing it all at once.

## Phase 0 — Repo setup and parity migration (no Firebase yet)
- [ ] Move the Vite prototype into `legacy/` (read-only reference)
- [ ] Scaffold Next.js (App Router, TypeScript strict, ESLint, `src/`, `@/` alias); add Prettier, Vitest
- [ ] Port design tokens and styles from `legacy/src/style.css` into `src/app/globals.css`; load fonts with `next/font/google` (Plus Jakarta Sans, Inter)
- [ ] Port shared components: Logo, Navbar (with mobile menu), Footer, ResourceCard, CategoryIcon, FilterPanel, Empty, LearningArt, PathCard
- [ ] Port pages: Home, Resources (query-string filters), Resource details, Learning paths, Path details (incl. budget), Volunteers, Saved, About, Not found
- [ ] Port `filters.ts` with unit tests (age overlap, language rules, combined filters)
- [ ] Keep localStorage behaviour for guests (same keys)
- [ ] `generateStaticParams` for resource and path detail pages; per-page metadata
- [ ] Visual check vs prototype at 360px, 768px, 1280px; deploy preview to Vercel

## Phase 1 — Firebase foundation and auth
- [ ] `firebase.json`, emulators config, `firestore.rules` (default deny), `firestore.indexes.json`
- [ ] `lib/firebase/client.ts`, `lib/firebase/admin.ts` (server-only), env validation with zod
- [ ] Session cookie route `/api/auth/session`, `getCurrentUser()`, `requireRole()`, `middleware.ts`
- [ ] Login / signup pages (parent + creator applicant; student username login)
- [ ] `scripts/set-role.ts`; first admin works end to end
- [ ] Rules test harness with the emulator

## Phase 2 — Content in Firestore + admin basics
- [ ] Seed script for resources, learning paths, badges
- [ ] Public resource pages read Firestore at build/ISR (fall back to seed JSON if unavailable)
- [ ] Admin layout + sidebar; admin resources CRUD; audit log entries
- [ ] Admin users list (search, role change, disable)

## Phase 3 — Parents and students
- [ ] Parent dashboard, add child (username + password), reset child password
- [ ] Student profile: nickname + avatar picker (12 avatars)
- [ ] Signed-in bookmarks/notes in Firestore; guest → account merge prompt

## Phase 4 — Creator portal and course builder
- [ ] Creator application flow + admin approval
- [ ] Course CRUD (draft), outline editor (modules/lessons, reorder)
- [ ] Block editors + zod schemas: text, video, image, resource, quiz, reflection, checkpoint
- [ ] Block editors: sort, budget
- [ ] Live student preview, autosave, submit-for-review checklist
- [ ] Admin review queue: preview, approve/publish, request changes with note

## Phase 5 — Learning experience
- [ ] Course catalogue `/learn/courses` (filter by category/age, published only)
- [ ] Course page + enrollment
- [ ] Lesson player for all block types; complete lesson server action
- [ ] View counting (once per session per course)

## Phase 6 — Gamification
- [ ] `lib/gamification` pure functions + tests (xp, levels, streaks, badges)
- [ ] Award transaction with idempotent `xpEvents`
- [ ] Student dashboard: level ring, streak, badges, continue card
- [ ] Celebrations (XP toast, badge card, reduced-motion fallback)
- [ ] Leaderboards (weekly + all-time, opt-in, top 10 + you)
- [ ] Parent leaderboard toggle

## Phase 7 — Analytics and polish
- [ ] Creator analytics (views, enrollments, completions, per-lesson drop-off)
- [ ] Admin overview cards
- [ ] Accessibility pass (keyboard, screen reader labels, focus, contrast)
- [ ] Error/empty/loading states on every route
- [ ] Playwright smoke tests: login per role, complete a lesson, publish a course
- [ ] Production deploy, rules deployed, seed run, authorized domains set

## Later (do not start without an ADR)
- Nepali UI translation · class/group leaderboards for volunteers · offline packs · certificates of completion · email notifications
