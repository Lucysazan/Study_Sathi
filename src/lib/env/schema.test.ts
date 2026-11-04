import { describe, expect, it } from 'vitest';
import { EMULATOR_PROJECT_ID, parseClientEnv, parseServerEnv } from './schema';

describe('parseClientEnv', () => {
  it('fills safe defaults when using emulators', () => {
    expect(parseClientEnv({ NEXT_PUBLIC_USE_EMULATORS: 'true' })).toEqual({
      useEmulators: true,
      apiKey: 'demo-api-key',
      authDomain: 'localhost',
      projectId: EMULATOR_PROJECT_ID,
      appId: undefined,
    });
  });

  it('requires the Firebase web config without emulators', () => {
    expect(() => parseClientEnv({})).toThrow(/NEXT_PUBLIC_FIREBASE_API_KEY is required/);
    expect(() => parseClientEnv({ NEXT_PUBLIC_FIREBASE_API_KEY: '  ' })).toThrow();
  });

  it('accepts a full config', () => {
    const env = parseClientEnv({
      NEXT_PUBLIC_USE_EMULATORS: 'false',
      NEXT_PUBLIC_FIREBASE_API_KEY: 'key',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'x.firebaseapp.com',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'x',
      NEXT_PUBLIC_FIREBASE_APP_ID: 'app',
    });
    expect(env.useEmulators).toBe(false);
    expect(env.projectId).toBe('x');
  });
});

describe('parseServerEnv', () => {
  it('needs no credentials with emulators and applies defaults', () => {
    const env = parseServerEnv({ NEXT_PUBLIC_USE_EMULATORS: 'true' });
    expect(env.credentials).toBeNull();
    expect(env.projectId).toBe(EMULATOR_PROJECT_ID);
    expect(env.sessionCookieName).toBe('__session');
    expect(env.studentLoginDomain).toBe('students.studysathi.local');
  });

  it('requires admin credentials without emulators', () => {
    expect(() => parseServerEnv({})).toThrow(/FIREBASE_ADMIN_PRIVATE_KEY is required/);
  });

  it('converts literal \\n in the private key into line breaks', () => {
    const env = parseServerEnv({
      FIREBASE_ADMIN_PROJECT_ID: 'p',
      FIREBASE_ADMIN_CLIENT_EMAIL: 'svc@p.iam.gserviceaccount.com',
      FIREBASE_ADMIN_PRIVATE_KEY: '-----BEGIN-----\\nabc\\n-----END-----\\n',
    });
    expect(env.credentials?.privateKey).toBe('-----BEGIN-----\nabc\n-----END-----\n');
  });

  it('refuses emulators in Vercel production', () => {
    expect(() =>
      parseServerEnv({ NEXT_PUBLIC_USE_EMULATORS: 'true', VERCEL_ENV: 'production' }),
    ).toThrow(/must be false in production/);
  });
});
