# First prompt to paste into Claude Code

Copy everything below the line into Claude Code from the repo root.

---

Read CLAUDE.md, then docs/HANDOVER.md, docs/ROADMAP.md, docs/DESIGN.md and docs/ARCHITECTURE.md.

We are starting Phase 0. Do these in order and stop for my review after step 4:
1. Move the current Vite prototype (src/, index.html, vite.config.ts, package.json, package-lock.json, tsconfig.json, README.md, DESIGN.md) into `legacy/`. Don't change its contents.
2. Scaffold Next.js in the repo root (App Router, TypeScript strict, ESLint, `src/` dir, `@/` alias, Tailwind v4). Add Prettier and Vitest. Add scripts: dev, build, lint, typecheck, test.
3. Port the design tokens and global styles from `legacy/src/style.css` into `src/app/globals.css` and set up fonts with next/font.
4. Port Logo, Navbar (with mobile menu) and Footer, and render them in the root layout with a placeholder home page.

Follow the session protocol: update IMPLEMENTATION_LOG, SESSION_LOG, ROADMAP and HANDOVER before you finish, and commit with Conventional Commit messages.
