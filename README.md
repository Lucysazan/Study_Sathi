# StudySathi

**Learn, Explore, Grow Together.**
A free, calm learning platform for children aged 10–16 in Nepal and the adults who support them. StudySathi curates trusted educational resources, offers guided learning paths, and now includes a small learning management system (LMS) with friendly gamification.

> AI agents: read `CLAUDE.md` first, then `docs/HANDOVER.md`.

## What's inside

| Who | What they can do |
| --- | --- |
| Visitors | Browse and filter 15 curated resources, follow 3 learning paths, save bookmarks (in the browser), read the volunteer guide |
| Students | Take courses, complete interactive lessons and quizzes, earn XP, badges and streaks, see a friendly leaderboard |
| Parents | Create child accounts, see their progress, choose whether they appear on leaderboards |
| Course creators | Build courses (modules → lessons → interactive blocks), submit for review, see views and completion |
| Admins | Approve creators, review and publish courses, manage resources, users and badges, see simple analytics |

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · lucide-react · Firebase Auth · Cloud Firestore · firebase-admin · zod · Vitest · Vercel

Runs on free tiers: **Vercel Hobby** and **Firebase Spark**. See `docs/ARCHITECTURE.md` for the limits we design around.

## Getting started

### 1. Prerequisites
- Node.js LTS (20 or newer) and npm
- Java 11+ (needed by the Firebase emulators)
- Firebase CLI: `npm i -g firebase-tools`
- A Firebase project (Spark plan) and a Vercel account

### 2. Install
```bash
git clone <repo-url> studysathi
cd studysathi
npm ci
```

### 3. Firebase project setup
1. Create a project in the Firebase console.
2. **Authentication** → enable *Email/Password* and *Google*.
3. **Firestore** → create the database (production mode; our rules lock it down). Pick the region closest to Nepal (e.g. `asia-south1`).
4. **Project settings → Your apps** → add a Web app and copy the config.
5. **Project settings → Service accounts** → generate a private key (JSON). Never commit it.
6. `firebase login` then `firebase use --add` and choose your project.

### 4. Environment variables
Copy `.env.example` to `.env.local` and fill in:

```bash
# Public (safe for the browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_USE_EMULATORS=true          # true locally, false on Vercel

# Server only (never prefix with NEXT_PUBLIC_)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SESSION_COOKIE_NAME=__session
STUDENT_LOGIN_DOMAIN=students.studysathi.local
```

### 5. Run locally
```bash
npm run emulators   # terminal 1: Auth + Firestore emulators (UI at http://localhost:4000)
npm run seed        # terminal 2: loads resources, learning paths and badges
npm run dev         # terminal 2: http://localhost:3000
```

Create your first admin: sign up in the app, then run
```bash
npx tsx scripts/set-role.ts you@example.com admin
```

### 6. Quality checks
```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

## Deploying to Vercel
1. Import the repo in Vercel (framework: Next.js).
2. Add every variable from `.env.local` to Vercel → Settings → Environment Variables. Set `NEXT_PUBLIC_USE_EMULATORS=false`. Paste the private key with literal `\n` line breaks; `lib/firebase/admin.ts` converts them.
3. Firebase console → Authentication → Settings → **Authorized domains**: add your `*.vercel.app` domain and any custom domain.
4. Deploy rules and indexes from your machine: `firebase deploy --only firestore:rules,firestore:indexes`.
5. Run the seed script once against production: `npm run seed -- --prod`.

Note: Vercel Hobby is intended for non-commercial projects. If StudySathi becomes part of a commercial service, move to a paid plan.

## Project documentation

| File | Purpose |
| --- | --- |
| `CLAUDE.md` | Rules and session protocol for AI coding agents |
| `docs/DESIGN.md` | Visual design guide (tokens, typography, pages, portals) |
| `docs/ARCHITECTURE.md` | Routes, auth, roles, Firestore data model, security, gamification rules |
| `docs/ROADMAP.md` | Phased task checklist |
| `docs/HANDOVER.md` | Current state and next steps (rewritten every session) |
| `docs/logs/SESSION_LOG.md` | Append-only log of every work session |
| `docs/logs/IMPLEMENTATION_LOG.md` | Append-only log of code changes |
| `docs/logs/DECISIONS.md` | Architecture and product decisions (ADR-lite) |
| `legacy/` | Original Vite prototype, kept for reference only |

## Content and honesty
Resources link to their original providers, who own their material. Age ranges are StudySathi guidance, not provider certification. StudySathi does not claim partnerships, learner counts or measured impact. It supports the intent of UN SDG 4 (Quality Education).

## Privacy
We collect as little as possible about children: a nickname, an avatar choice, and learning progress. Students cannot message each other, and there are no public profiles. Parents control their child's account and leaderboard visibility.
