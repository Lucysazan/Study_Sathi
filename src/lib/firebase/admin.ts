import 'server-only';
import { type App, cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { type Auth, getAuth } from 'firebase-admin/auth';
import { type Firestore, getFirestore } from 'firebase-admin/firestore';
import { getServerEnv } from '@/lib/env/server';

/** firebase-admin for trusted server code (Node runtime only). Never import from the client. */

const APP_NAME = 'studysathi-admin';

function getAdminApp(): App {
  const existing = getApps().find((a) => a.name === APP_NAME);
  if (existing) return getApp(APP_NAME);

  const env = getServerEnv();
  if (env.useEmulators) {
    // The admin SDK talks to the emulators when these are set.
    process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099';
    process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
    return initializeApp({ projectId: env.projectId }, APP_NAME);
  }
  return initializeApp(
    { credential: cert(env.credentials ?? {}), projectId: env.projectId },
    APP_NAME,
  );
}

export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}
