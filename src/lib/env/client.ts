import { type ClientEnv, parseClientEnv } from './schema';

let cached: ClientEnv | undefined;

/**
 * Firebase web config. Validated on first use (not at import), so pages that never touch
 * Firebase still build without it. Each variable is referenced by its full name because Next
 * only inlines NEXT_PUBLIC_ values written out like this.
 */
export function getClientEnv(): ClientEnv {
  cached ??= parseClientEnv({
    NEXT_PUBLIC_USE_EMULATORS: process.env.NEXT_PUBLIC_USE_EMULATORS,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
  return cached;
}
