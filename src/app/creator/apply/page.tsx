import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { PortalLoading } from '@/components/portal/PortalShell';
import { requireUser } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { CreatorApplicationForm } from './CreatorApplicationForm';

export const metadata: Metadata = { title: 'Creator application', robots: { index: false } };

export default function CreatorApplyPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <CreatorApplyContent />
    </Suspense>
  );
}

async function CreatorApplyContent() {
  const user = await requireUser('/creator/apply');
  if (user.role === 'creator') redirect('/creator');

  const doc = await adminDb().collection('users').doc(user.uid).get();
  const pending = doc.exists && doc.get('requestedRole') === 'creator';

  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">CREATOR APPLICATION</div>
      <h1 className="detail-title">Apply to teach with StudySathi</h1>

      <div className="notice">
        <Sparkles size={22} aria-hidden="true" />
        <div>
          <h3>{pending ? 'Application already submitted' : 'Phase 4 onboarding'}</h3>
          <p>
            {pending
              ? 'Your application is with the admin team. You will get access to the creator studio once it is approved.'
              : 'Share a little about your background, the kind of content you want to teach, and the learning experience you want to create.'}
          </p>
        </div>
      </div>

      <CreatorApplicationForm pending={pending} />

      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        <Link href="/creator" className="button secondary" aria-label="Back to creator dashboard">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to dashboard
        </Link>
      </div>

      <div className="portal-actions">
        <SignOutButton />
      </div>
    </section>
  );
}
