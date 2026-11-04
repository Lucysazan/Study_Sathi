import { Suspense, type ReactNode } from 'react';
import type { Role } from '@/lib/auth/roles';
import { RoleGate } from './RoleGate';

export function PortalLoading() {
  return (
    <div className="site-container portal-loading" role="status">
      Checking your account…
    </div>
  );
}

/**
 * Portal layout wrapper: the session check streams in behind Suspense, so the site header and
 * footer stay in the static shell (Cache Components). proxy.ts already bounced visitors with no
 * session cookie; this is the real check.
 */
export function PortalShell({
  allowed,
  returnTo,
  children,
}: {
  allowed: readonly Role[];
  returnTo: string;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <RoleGate allowed={allowed} returnTo={returnTo}>
        {children}
      </RoleGate>
    </Suspense>
  );
}
