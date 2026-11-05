import { spawn, spawnSync } from 'node:child_process';

// These overrides belong only to child processes. Never read, write or source .env here.
const overrides = {
  DEBUG: '',
  STUDYSATHI_E2E: '1',
  NEXT_PUBLIC_USE_EMULATORS: 'true',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'demo-studysathi',
  NEXT_PUBLIC_FIREBASE_API_KEY: 'demo-api-key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'localhost',
  NEXT_PUBLIC_FIREBASE_APP_ID: 'demo-app',
  FIREBASE_ADMIN_PROJECT_ID: 'demo-studysathi',
  FIREBASE_ADMIN_CLIENT_EMAIL: '',
  FIREBASE_ADMIN_PRIVATE_KEY: '',
  GOOGLE_APPLICATION_CREDENTIALS: '',
  FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
  SESSION_COOKIE_NAME: 'studysathi_e2e_session',
  STUDENT_LOGIN_DOMAIN: 'students.studysathi.local',
  VERCEL_ENV: 'development',
  NEXT_TELEMETRY_DISABLED: '1',
};
const mode = process.argv[2];
if (mode && mode !== '--app' && mode !== '--test') throw new Error('Unknown E2E command');
if (mode && Object.entries(overrides).some(([key, value]) => (process.env[key] ?? '') !== value)) {
  throw new Error('Use npm run test:e2e to start the isolated local runner.');
}
if (mode === '--app' && process.env.STUDYSATHI_E2E_PRODUCTION === '1') {
  const build = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
    stdio: 'inherit',
    env: { ...process.env, ...overrides },
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}
const args =
  mode === '--app'
    ? [
        'node_modules/next/dist/bin/next',
        process.env.STUDYSATHI_E2E_PRODUCTION === '1' ? 'start' : 'dev',
        '--hostname',
        '127.0.0.1',
        '--port',
        '3100',
      ]
    : mode === '--test'
      ? ['node_modules/@playwright/test/cli.js', 'test']
      : [
          'node_modules/firebase-tools/lib/bin/firebase.js',
          'emulators:exec',
          '--config',
          'firebase.e2e.json',
          '--only',
          'auth,firestore',
          '--project',
          'demo-studysathi',
          'node scripts/run-e2e.mjs --test',
        ];
const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env: { ...process.env, ...overrides },
});
child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
