# Decisions (ADR-lite)

Append-only. To change a decision, add a new ADR with `Supersedes: ADR-00X` and mark the old one `Status: Superseded`.

Template:
```
## ADR-00X: Title
**Date:** YYYY-MM-DD · **Status:** Proposed | Accepted | Superseded
**Context:** why a decision is needed
**Decision:** what we chose
**Consequences:** trade-offs, follow-ups
```

---

## ADR-001: Next.js App Router on Vercel
**Date:** 2026-11-04 · **Status:** Accepted
**Context:** Prototype is a Vite SPA. We need server-side auth checks, SEO for public pages, and server code for trusted writes.
**Decision:** Next.js App Router, Server Components by default, Server Actions for mutations, deployed on Vercel Hobby.
**Consequences:** Prototype `App.tsx` must be split into routes/components. Vercel Hobby is for non-commercial use.

## ADR-002: Firebase Spark plan, no Cloud Functions
**Date:** 2026-11-04 · **Status:** Accepted
**Context:** Must stay on free tiers. Cloud Functions require the Blaze plan.
**Decision:** All trusted server logic runs in Next.js on Vercel using `firebase-admin`. Firestore + Firebase Auth only.
**Consequences:** No scheduled jobs; leaderboard periods roll over lazily. Must design for Firestore daily quotas.

## ADR-003: Session cookies + custom claims for roles
**Date:** 2026-11-04 · **Status:** Accepted
**Context:** Four roles; portal routes must be protected server-side and in Firestore rules.
**Decision:** Role stored as Auth custom claim (rules + server checks) and mirrored on `users/{uid}`. httpOnly session cookie via `createSessionCookie`. Middleware does a presence check; layouts verify.
**Consequences:** Role changes require token refresh/revocation.

## ADR-004: Media hosting without Firebase Storage
**Date:** 2026-11-04 · **Status:** Proposed (owner to confirm)
**Context:** Cloud Storage for Firebase requires the Blaze plan for new projects' buckets. Course creators need images (covers, lesson images) and videos.
**Decision (proposed):** Videos as YouTube/Vimeo embeds (privacy-enhanced YouTube). Images via Cloudinary free tier with signed uploads from a server action; until then, creators paste image URLs. Revisit if the project moves to Blaze.
**Consequences:** Adds one external service; no large file uploads in v1.

## ADR-005: Students log in with username + password created by a parent
**Date:** 2026-11-04 · **Status:** Accepted (pending owner confirmation for 13–16 self sign-up)
**Context:** Children 10–16 may not have email; we want parental involvement and minimum data.
**Decision:** Parent creates child accounts; server creates Auth user with synthetic email on `STUDENT_LOGIN_DOMAIN`. Parent can reset the password.
**Consequences:** No email-based recovery for students; parent is the recovery path.

## ADR-006: Server-only gamification with idempotent XP ledger
**Date:** 2026-11-04 · **Status:** Accepted
**Context:** Points must not be forgeable; refreshes must not double-award.
**Decision:** XP, levels, streaks, badges and leaderboards are written only in server transactions. Each award first creates `users/{uid}/xpEvents/{eventKey}`.
**Consequences:** Every award costs a few reads/writes; keep awards per lesson, not per block.

## ADR-007: Child-safe social features
**Date:** 2026-11-04 · **Status:** Accepted
**Context:** Users are minors.
**Decision:** No chat, comments or public profiles. Leaderboards are opt-in by a parent, show nickname + preset avatar only, and display top 10 + own rank.
**Consequences:** Less "social" engagement by design.
