# Play and Learn

Added 2026-11-09 at the user's request to connect resource discovery to simple explanations, interactive exploration, learning checks and trusted rewards.

## Student experience

- /play lists eight original StudySathi guides: fractions, balance, circuits, budget, digital safety, waste, reading and study habits.
- Each activity explains the idea, gives an exploration task and presents three follow-up questions. Incorrect checks explain each answer and suggest revisiting the activity. Original material needs teacher review; age/class ranges are guidance, not official chapter mapping.
- Three activities use PhET-hosted simulations; budget, digital safety and waste use original widgets. Reading/study habits use guided reflection. Per the user?s later instruction, simulation iframes load automatically on the activity page. Long hints are collapsed; questions mount only after Check what I learned is pressed. Credits remain visible.
- Guests can practise without accounts, persistence or points. Signed-in students save best/latest/attempt count and first completed date at /play/progress.
- First perfect checks earn 10 XP plus the existing first eligible daily bonus of 5. The completion is a learning unit counted in existing lessonCount/weeklyLessons stats; UI totals now say learning activities. It does not finish a course or overwrite currentCourseId.
- Replays and partial results do not earn additional XP. Provider scores, iframe messages, clicks and watch time are not trusted or recorded as completion. These are low-stakes checks with feedback, not certified mastery or proof of watching a simulation.
- Existing badges/streaks and parent-consented nickname leaderboards use the same reward transaction. Parent child-progress pages show activity best/latest results after verifying ownership. No public activity history or private notes.
- Existing Grade 9 academic pilot stays separate and still awards no XP. Its original practice/source routes and restored government PDF URLs remain unchanged.

## Resource integration

Every current resource category has related original learning guides. These are clearly labelled general guides, not fabricated summaries of a provider's site. Unverified provider pages remain original links; do not iframe arbitrary websites or reintroduce the rejected OLE whole-site iframe. Existing NCED videos and government PDF readers remain in /study.

## Sources and licence

Official sources reviewed 2026-11-09:
- https://phet.colorado.edu/en/licensing/
- https://phet.colorado.edu/en/help-center/getting-started
- https://phet.colorado.edu/en/simulations/fractions-intro
- https://phet.colorado.edu/en/simulations/balancing-act
- https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc

Current regular HTML simulation terms are CC BY-NC 4.0. The existing free, ad-free, non-commercial StudySathi project uses official hosted embeds and exact provider-required attribution adjacent to each simulation. No assets copied or altered; logos remain within provider content. Commercial use, ads, fundraising products or redistribution require a new licence review. Historical CC BY pages are not treated as the current licence. Public URL availability is not permission by itself.

Each of the three actual embed URLs returned HTTP 200 HTML with content bytes and no frame restriction in ordinary fetch probes. Browser rendering and all-device keyboard/screen-reader acceptance must be reported separately.

## Trusted implementation

- src/lib/study/catalog.ts: allowlisted activities, explanations, question definitions and simulation identifiers. Public page props strip answer indices/explanations before client quiz rendering.
- /api/study: same-origin bounded strict submission, verified session expectedUid, server grading, no-store responses. GET reads only current student's progress.
- users/{uid}/privateData/study: bounded catalog-keyed records. Existing default-deny rules block all direct client writes/reads except admin reads; server verifies student identity and linked parent ownership.
- study_ XP event namespace deduplicates first perfect passes atomically with progress/stats/consented leaderboard entries. No new Firestore rules/indexes or production seed required.
- Scoring and trusted stats never come from client payloads. No external completion API, postMessage score trust, new dependencies, API keys or production test fixtures.

## Acceptance

Unit tests cover grading/forged payloads/session changes/save failures and ledger isolation. Firestore integration covers concurrent duplicate submissions, lower retries preserving best, opt-out and disabled accounts. Browser tests cover public exploration, simulation controls, guest results, signed-in persistence, duplicate rewards, leaderboard entry and parent/student privacy at desktop/360px. Broader teacher, native-speaker, assistive-technology and real learner evaluation remains open.

Release 496af04: 179 unit, 50 rules/integration and 48 production-build desktop/mobile checks pass. Final normal build/lint/typecheck pass. Live anonymous resource-to-budget feedback and actual PhET fractions embed verified at 360px with no page errors/outer overflow. No authenticated production fixtures were written.
