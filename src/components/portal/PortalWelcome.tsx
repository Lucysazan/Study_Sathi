import { Compass } from 'lucide-react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { getCurrentUser } from '@/lib/auth/session';

/** Phase 1 placeholder for each portal: greets the user and says what is coming. */
export async function PortalWelcome({
  eyebrow,
  comingSoon,
}: {
  eyebrow: string;
  comingSoon: string;
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
      <div className="portal-actions">
        <SignOutButton />
      </div>
    </section>
  );
}
