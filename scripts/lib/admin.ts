/**
 * firebase-admin for CLI scripts (they can't import `server-only` modules).
 * Emulators by default; a real project only with --prod, so a script never changes production
 * by accident.
 */
import { existsSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { type Auth, getAuth } from 'firebase-admin/auth';
import { type Firestore, getFirestore } from 'firebase-admin/firestore';
import { parseServerEnv } from '../../src/lib/env/schema';

export function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

export function initScriptAdmin(prod: boolean): {
  auth: Auth;
  db: Firestore;
  target: string;
} {
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
  return {
    auth: getAuth(app),
    db: getFirestore(app),
    target: env.useEmulators ? 'the emulators' : `project "${env.projectId}"`,
  };
}
