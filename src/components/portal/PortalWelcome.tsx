import { Compass } from 'lucide-react';
import { Suspense, type ReactNode } from 'react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { getCurrentUser } from '@/lib/auth/session';
import { PortalLoading } from './PortalShell';

/** Phase 1 placeholder for each portal: greets the user and says what is coming. */
async function PortalWelcomeBody({
  eyebrow,
  comingSoon,
  children,
}: {
  eyebrow: string;
  comingSoon: string;
  children?: ReactNode;
}) {
  const user = await getCurrentUser();
  const firstName = user?.name?.split(' ')[0];
  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="detail-title">{firstName ? `Hello, ${firstName}!` : 'Hello!'}</h1>
      <div className="notice">
        <Compass size={22} aria-hidden="true" />
        <div>
          <h3>Coming soon</h3>
          <p>{comingSoon}</p>
        </div>
      </div>
      {children}
      <div className="portal-actions">
        <SignOutButton />
      </div>
    </section>
  );
}

export function PortalWelcome(props: {
  eyebrow: string;
  comingSoon: string;
  children?: ReactNode;
}) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <PortalWelcomeBody {...props} />
    </Suspense>
  );
}
