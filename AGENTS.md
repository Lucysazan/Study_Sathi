# AGENTS.md — StudySathi

Any AI coding agent (Codex, ChatGPT, Claude, …) working here: before doing anything,

1. Read `CLAUDE.md`: the project rules and the **session protocol** (it applies to every agent, not just Claude).
2. Read `docs/HANDOVER.md`: current state, what is verified, what to do next.
3. Read the last entries of `docs/logs/SESSION_LOG.md` and the active phase in `docs/ROADMAP.md`.
4. At the end of your session, update the logs, roadmap and handover as `CLAUDE.md` §0 describes, and commit docs with the code.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
