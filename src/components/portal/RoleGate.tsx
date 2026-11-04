import type { ReactNode } from 'react';
import type { Role } from '@/lib/auth/roles';
import { requireRole } from '@/lib/auth/session';

/**
 * Real access check for a portal (verifies the session cookie with firebase-admin).
 * Reads cookies, so render it inside <Suspense> (see PortalShell).
 */
export async function RoleGate({
  allowed,
  returnTo,
  children,
}: {
  allowed: readonly Role[];
  returnTo: string;
  children: ReactNode;
}) {
  await requireRole(allowed, returnTo);
  return children;
}
