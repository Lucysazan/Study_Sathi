import { Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { PortalLoading } from '@/components/portal/PortalShell';
import { roleHome } from '@/lib/auth/roles';
import { requireUser } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';

export const metadata: Metadata = { title: 'My account', robots: { index: false } };

export default function AccountPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AccountContent />
    </Suspense>
  );
}

/** Sends people with a role to their portal; explains what's next to everyone else. */
async function AccountContent() {
  const user = await requireUser('/account');
  if (user.role) redirect(roleHome(user.role));

  const doc = await adminDb().collection('users').doc(user.uid).get();
  const requestedRole: unknown = doc.get('requestedRole');
  const pendingCreator = doc.exists && requestedRole === 'creator';

  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">MY ACCOUNT</div>
      <h1 className="detail-title">
        {pendingCreator ? 'Thanks for wanting to create courses!' : 'Almost there'}
      </h1>
      <div className="notice">
        <Clock size={22} aria-hidden="true" />
        <div>
          <h3>{pendingCreator ? 'What happens next' : 'Finish setting up'}</h3>
          <p>
            {pendingCreator
              ? 'Course creator applications open soon. An admin will review yours, and the course builder will appear here once you are approved.'
              : 'Your account is not set up yet. Please log out and log in again to finish.'}
          </p>
        </div>
      </div>
      <div className="portal-actions">
        <SignOutButton />
      </div>
    </section>
  );
}
