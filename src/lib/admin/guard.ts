import 'server-only';
import { type CurrentUser, getCurrentUser, requireRole } from '@/lib/auth/session';

/**
 * Admin access checks for the data access layer.
 *
 * A portal layout does NOT stop its pages from running (Next renders route segments in
 * parallel; see node_modules/next/dist/docs/01-app/02-guides/authentication.md, "Layouts and
 * auth checks"). So every admin data function calls `requireAdmin()` itself, and every admin
 * Server Action calls `getAdmin()`. The layout's PortalShell is only an extra layer.
 */

/** For admin data reads in pages: redirects non-admins (login or their own home). */
export async function requireAdmin(): Promise<CurrentUser> {
  return requireRole(['admin'], '/admin');
}

/**
 * For admin Server Actions: re-check the session on every call (never trust the page that
 * rendered the form). Returns null when the caller is not a signed-in admin.
 */
export async function getAdmin(): Promise<CurrentUser | null> {
  const user = await getCurrentUser();
  return user?.role === 'admin' ? user : null;
}

export const NOT_ALLOWED = 'You need to be signed in as an admin to do that.';
