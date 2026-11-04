# CLAUDE.md — StudySathi (Next.js + Firebase LMS)

This file is the source of truth for any AI coding agent (Claude Code or otherwise) working on this repo.
Read it fully at the start of every session. Keep it short and current; put detail in `docs/`.

---

## 0. Session protocol (MANDATORY — do this every session)

Sessions and agents change. The docs are the memory. Follow this exactly.

**At session start**
1. Read `CLAUDE.md` (this file).
2. Read `docs/HANDOVER.md` — the current state, what is in progress, what is next.
3. Read the last 2–3 entries of `docs/logs/SESSION_LOG.md`.
4. Skim `docs/ROADMAP.md` to find the active phase and the next unchecked task.
5. If the task touches UI, re-read the relevant part of `docs/DESIGN.md`.
6. Run `git status` and `git log --oneline -10` to confirm the code matches the handover.
7. If anything in the handover disagrees with the code, trust the code, note the mismatch in the session log, and fix the handover.

**During the session**
- Work on one roadmap task at a time. Small, focused commits (Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- Every meaningful code change gets a line in `docs/logs/IMPLEMENTATION_LOG.md` (what, where, why).
- Every architectural or product choice gets an entry in `docs/logs/DECISIONS.md` (ADR-lite). Do not silently reverse a past decision — add a new entry that supersedes it.
- If you are unsure about a product decision, add it to "Open questions" in `docs/HANDOVER.md` and choose the safest, simplest default.

**At session end (or before context runs low)**
1. Append an entry to `docs/logs/SESSION_LOG.md`.
2. Rewrite `docs/HANDOVER.md` so a brand-new agent could continue with zero chat history.
3. Tick completed items in `docs/ROADMAP.md`.
4. Make sure `npm run lint`, `npm run typecheck` and `npm run test` pass, or record exactly what fails and why in the handover.
5. Commit docs together with the code they describe.

Never end a session with uncommitted work that is not described in `docs/HANDOVER.md`.

---

## 1. What StudySathi is

A free, calm, child-friendly learning platform for ages 10–16 in Nepal and the adults who support them (parents, volunteers, educators). It started as a Vite + React prototype that curates 15 external educational resources, three learning paths, bookmarks and a volunteer page. That prototype is in `legacy/` (reference only — do not edit it).

We are converting it to **Next.js on Vercel with Firebase**, keeping the same design, and adding a small, focused LMS:

- **Public site** — the existing pages, same look and behaviour (home, resource library, resource details, learning paths, volunteers, saved, about).
- **Students** — enroll in courses, complete lessons, take quizzes, earn XP, badges, streaks, appear on a friendly leaderboard.
- **Parents** — create and manage child accounts, see progress, control leaderboard visibility.
- **Course creators** — build courses from modules, lessons and interactive blocks; submit for review; see views, enrollments and completion.
- **Admins** — approve creators, review/publish courses, manage resources, users, badges and basic analytics.

Ambition level: **clean and modest.** Ship a reliable small LMS, not a big platform. When in doubt, cut scope.

### Non-negotiable product principles (carried over from the prototype)
- Honest content: credit providers, link to originals, never claim partnerships, impact numbers or certification that don't exist.
- Child safety first: no chat, no messaging, no public profiles, no free-text visible to other users, nicknames only on leaderboards, minimum personal data.
- No AI features, no payments, no ads.
- Accessible by default: keyboard, focus states, labels, reduced motion, readable on 360 px phones.

---

## 2. Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js (latest stable, **App Router**), React, TypeScript `strict` |
| Styling | Design tokens as CSS variables in `src/app/globals.css` (ported from `legacy/src/style.css`) + Tailwind CSS v4 utilities. Keep the existing explicit CSS look. |
| Icons | `lucide-react` |
| Auth | Firebase Authentication (client SDK) + **session cookies** verified server-side with `firebase-admin` |
| Database | Cloud Firestore |
| Server logic | Next.js **Server Actions** and **Route Handlers** running `firebase-admin` on Vercel (Node runtime). **No Cloud Functions** (they need the paid Blaze plan). |
| Media | Video = YouTube/Vimeo embed URLs. Images/PDFs = see `docs/logs/DECISIONS.md` ADR-004 (Firebase Storage requires the Blaze plan for new buckets). |
| Validation | `zod` for every Server Action input and every form |
| Testing | Vitest (logic + rules), Firebase Emulator Suite (Auth + Firestore), Playwright smoke tests later |
| Hosting | Vercel (Hobby) + Firebase Spark (free) |
| Lint/format | ESLint (next config) + Prettier |

Do not add new dependencies without a one-line justification in `DECISIONS.md`.

---

## 3. Project structure

```
src/
  app/
    (public)/                 # existing site, no login needed
      page.tsx                # Home
      resources/page.tsx
      resources/[id]/page.tsx
      learning-paths/page.tsx
      learning-paths/[id]/page.tsx
      volunteers/page.tsx
      saved/page.tsx
      about/page.tsx
    (auth)/
      login/page.tsx
      signup/page.tsx         # parents and creator applicants only
    learn/                    # student area (role: student)
      page.tsx                # dashboard: continue, XP, streak, badges
      courses/page.tsx
      courses/[slug]/page.tsx
      courses/[slug]/[lessonId]/page.tsx
      leaderboard/page.tsx
      profile/page.tsx        # avatar + nickname only
    parent/                   # role: parent
    creator/                  # role: creator
      courses/[courseId]/edit/...
      analytics/
    admin/                    # role: admin
      users/ creators/ courses/ resources/ badges/ analytics/
    api/auth/session/route.ts # create/clear session cookie
    layout.tsx  globals.css  not-found.tsx  error.tsx
  components/
    ui/ layout/ resources/ course/ blocks/ gamification/ portal/
  lib/
    firebase/client.ts        # client SDK init (browser only)
    firebase/admin.ts         # admin SDK init (server only, `import 'server-only'`)
    auth/session.ts           # getCurrentUser(), requireRole()
    gamification/             # xp, levels, badges, streaks — pure functions + server writers
    validation/               # zod schemas
    filters.ts                # ported from legacy/src/utils/filters.ts
  types/
  data/seed/                  # resources.json, learningPaths.ts (seed source)
scripts/                      # seed-firestore.ts, set-role.ts
firestore.rules  firestore.indexes.json  firebase.json
docs/  legacy/
```

Details of data model, rules and auth flow: `docs/ARCHITECTURE.md`.

---

## 4. Coding rules

- **Server Components by default.** Add `'use client'` only for interactivity (forms, quiz blocks, bookmarks, menus). Keep client components small and leaf-level.
- **Never trust the client for points, roles or publishing.** XP, badges, streaks, leaderboard entries, roles and course status are written only by server code using `firebase-admin`. Firestore rules must block client writes to them.
- `lib/firebase/admin.ts` and anything using it must import `'server-only'`. Never expose admin credentials or non-`NEXT_PUBLIC_` env vars to the client.
- Every Server Action: validate with zod → check the session and role → do the work → `revalidatePath`/`revalidateTag` → return a typed result `{ ok: true, data } | { ok: false, error }`. No thrown errors to the UI.
- Protect portal routes twice: `middleware.ts` redirects when no session cookie exists (cheap check), and each portal `layout.tsx` calls `requireRole()` (real check with admin SDK, Node runtime).
- Use `next/image`, `next/link`, the Metadata API, `loading.tsx`, `error.tsx`, and `not-found.tsx` per route segment where useful.
- Path alias `@/` → `src/`. Named exports for components; one component per file once it passes ~150 lines.
- Firestore free tier is small (roughly 50k reads / 20k writes per day). Design for few reads: denormalize, store lesson blocks inside the lesson document, use aggregate counters, cache public pages (static or ISR), never list whole collections in client components.
- Render creator-written text safely: markdown → sanitized HTML (no raw HTML from creators).
- Accessibility is part of "done": labels, focus, `aria-pressed`/`aria-expanded`, status messages, reduced motion.
- No `any`. No `// @ts-ignore` without a comment explaining why.
- Keep UI copy short, simple, and kind. Write for a 10-year-old reading in their second language.

---

## 5. Design

Follow `docs/DESIGN.md` exactly. It is the original design guide plus a section for the new portals. Same tokens, same fonts (Plus Jakarta Sans headings, Inter body), same calm off-white/teal look, same card radii and restrained shadows. Portals reuse the public components; they do not get a different visual language.

---

## 6. Commands

```bash
npm run dev            # Next.js dev server
npm run emulators      # Firebase Auth + Firestore emulators
npm run seed           # seed resources, learning paths, badges into Firestore (emulator by default)
npm run lint
npm run typecheck
npm run test
npm run build
```

`scripts/set-role.ts <email> <role>` sets a user's role (used once to create the first admin).

---

## 7. Definition of done (per task)

- Works on a 360 px phone and on desktop.
- Typecheck, lint and tests pass. New logic in `lib/` has unit tests. New Firestore access has a rules test.
- Matches `docs/DESIGN.md`.
- Implementation log, roadmap and handover updated.
