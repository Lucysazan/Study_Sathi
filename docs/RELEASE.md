# Release steps

## Local verification

Use Node 24 LTS and Java 21 for the Firebase emulators. On PowerShell use `npm.cmd` and `npx.cmd` if execution policy blocks their `.ps1` wrappers.

```sh
npm ci
npx playwright install chromium
npm run lint
npm run typecheck
npm run test
npm run test:rules
npm run test:e2e
npm run build
```

`test:e2e` owns ports 8080, 9099 and 3100. Stop another emulator using those ports first. It starts fresh Auth/Firestore emulators, generates disposable users and course fixtures, and runs Chromium at 1280px and 360px. It never imports or exports emulator data. Browser requests to non-loopback hosts are blocked. Normal `.env` files are not changed; test-only child environment overrides select the demo project, cookie name and `.next-e2e` output. The runner refuses an existing test web server.

Failure screenshots/traces are under ignored `test-results/`; inspect them with `npx playwright show-trace <trace.zip>`. These artifacts contain disposable test credentials and must not be published. A passing local demo run does not prove live Firebase indexes, production cookies, Google sign-in, deployment, real devices or screen-reader acceptance. See ACCEPTANCE.md for remaining manual checks.

## Hosting and Firebase

Record the intended Vercel project, domain and Firebase project before deploying. `.firebaserc` defaults to a demo project; always pass the actual project explicitly to deployment commands.

1. Link/import this repository in the intended Vercel project. Root directory must be `Study_Sathi` when importing its parent repository. The app uses the checked-in `vercel.json`.
2. Configure the variables listed in `.env.example` in Vercel, including both public web config and server-only Admin credentials for the same Firebase project. Set `NEXT_PUBLIC_USE_EMULATORS=false`; do not configure emulator hosts or `STUDYSATHI_E2E` on Vercel. Never commit or paste credentials into logs or issue comments.
3. Enable the configured Auth providers and add the precise preview/production domains to Firebase Auth authorized domains. Verify Google sign-in on the intended domain if enabled.
4. Deploy Firestore rules/indexes to the intended project explicitly:

   ```sh
   npx firebase deploy --only firestore:rules,firestore:indexes --project <actual-project-id>
   ```

5. Wait for indexes to finish building. Run the catalog seed against the actual configured project only when authorized: `npm run seed -- --prod`. It adds missing curated records; production overwrite is forbidden. Existing admin/course records must remain intact. Do not create another admin if one already exists.
6. Create a Vercel preview, verify the intended Firebase target and inspect build/runtime errors. Then promote the verified release to production.
7. On HTTPS, check login for each role, session cookie security, logout/revocation, parent ownership, creator submit/admin publish and student enroll/complete with dedicated acceptance accounts. Check catalog data and live queries (review queue, leaderboard, analytics) for missing indexes. Do not run the disposable emulator smoke suite against a live URL.

Record actual deployment URL, commit, project, checks and any failures in HANDOVER/SESSION_LOG. Mark the deployment roadmap item complete only after the deployed site and live rules/indexes/data are verified.

## Current project checkpoint (2026-11-05)

Existing site: https://studysathisip.vercel.app/; Git origin Lucysazan/Study_Sathi, production branch main (confirmed by owner). The authorized push 30f4e35 started a Vercel deployment under study-sathi. Production Auth already authorizes the site. Rules release is deployed; seven indexes await an owner login because the Admin SDK service account cannot create indexes. No IAM permissions were changed. Use `npm run check:live -- --prod --project studysathi-20d2c` after index deployment; it prints query pass/fail only. Production catalog seeding needs the separately requested explicit approval.
