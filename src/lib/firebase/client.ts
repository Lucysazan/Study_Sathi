import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  type Auth,
  connectAuthEmulator,
  getAuth,
  inMemoryPersistence,
  setPersistence,
} from 'firebase/auth';
import { getClientEnv } from '@/lib/env/client';

/**
 * Browser Firebase SDK. Import only from Client Components.
 * The browser signs in only to obtain an ID token; the server then sets an httpOnly session
 * cookie (ARCHITECTURE §2). Auth state is kept in memory, so no token sits in browser storage.
 */

let auth: Auth | undefined;

function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApp();
  const env = getClientEnv();
  return initializeApp({
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    appId: env.appId,
  });
}

export async function getClientAuth(): Promise<Auth> {
  if (auth) return auth;
  const instance = getAuth(getFirebaseApp());
  if (getClientEnv().useEmulators) {
    connectAuthEmulator(instance, 'http://127.0.0.1:9099', { disableWarnings: true });
  }
  await setPersistence(instance, inMemoryPersistence);
  auth = instance;
  return instance;
}
