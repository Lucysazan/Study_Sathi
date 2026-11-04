# Handover

> Rewrite this whole file at the end of every session. A new agent with no chat history must be able to continue from here.

**Last updated:** 2026-11-04 · **By:** planning session (Claude, claude.ai chat) · **Branch:** `main`

## Current state
- Planning complete. Documentation created: `CLAUDE.md`, `README.md`, `docs/DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, logs.
- Code: only the Vite + React prototype exists. It should be moved into `legacy/` as the first task.
- No Firebase project connected yet. No Vercel project yet.

## In progress
- Nothing.

## Next steps (in order)
1. Phase 0, task 1: move prototype into `legacy/`, scaffold Next.js in the repo root.
2. Port tokens and global styles, then shared layout components (Navbar, Footer, Logo).
3. Port public pages one by one, checking each against the prototype.

## Open questions (defaults in use until the owner answers)
| Question | Default in use |
| --- | --- |
| Can students aged 13–16 sign up themselves, or must every student be created by a parent? | Parent-created only |
| Where are course images/PDFs hosted? (Firebase Storage needs the paid Blaze plan) | Image URLs + YouTube/Vimeo embeds; Cloudinary free tier proposed in ADR-004 (pending) |
| Should the UI be bilingual (English/Nepali) from the start? | English first; keep strings in one place for later translation |
| Do volunteers/teachers need "classes" to group students? | Not in v1 |

## Known issues / risks
- Firestore free-tier quotas: keep reads low (see ARCHITECTURE §6).
- Prototype README references `.openai/hosting.json`; not used with Vercel. Remove in the new README (done).

## Environment notes
- Required env vars are listed in `README.md` and `.env.example`.
