/**
 * Give an existing user a role (used once to create the first admin).
 *
 *   npm run set-role -- you@example.com admin            # emulators (.env.local)
 *   npm run set-role -- you@example.com admin --prod     # real project (needs admin credentials)
 *
 * The user must sign up first. They are signed out everywhere so the new role applies at
 * their next login.
 */
import { existsSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { assignRole } from '../src/lib/auth/accounts';
import { isRole, roles } from '../src/lib/auth/roles';
import { parseServerEnv } from '../src/lib/env/schema';

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const prod = args.includes('--prod');
  const [email, role] = args.filter((a) => !a.startsWith('--'));
  if (!email || !role) fail('Usage: npm run set-role -- <email> <role> [--prod]');
  if (!isRole(role)) fail(`Role must be one of: ${roles.join(', ')}`);

  if (existsSync('.env.local')) process.loadEnvFile('.env.local');
  const env = parseServerEnv(process.env);
  if (env.useEmulators && prod) fail('--prod given, but NEXT_PUBLIC_USE_EMULATORS=true.');
  if (!env.useEmulators && !prod) {
    fail('This would change a real Firebase project. Add --prod if that is what you want.');
  }

  if (env.useEmulators) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099';
    process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
  }
  const app = initializeApp(
    env.credentials
      ? { credential: cert(env.credentials), projectId: env.projectId }
      : { projectId: env.projectId },
  );
  const auth = getAuth(app);
  const db = getFirestore(app);

  const user = await auth.getUserByEmail(email.trim().toLowerCase()).catch(() => null);
  if (!user) fail(`No account found for ${email}. Ask them to sign up first.`);

  await assignRole(auth, db, user.uid, role, 'script:set-role');
  console.log(
    `\n✔ ${email} is now "${role}" on ${env.useEmulators ? 'the emulators' : env.projectId}.` +
      '\n  They have been signed out; the new role applies when they log in again.\n',
  );
}

main().catch((error: unknown) => fail(error instanceof Error ? error.message : String(error)));
