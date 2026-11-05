import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { avatars } from '@/lib/validation/family';
import { AccountForm } from '@/components/portal/AccountForm';
import { PortalLoading } from '@/components/portal/PortalShell';
import { saveProfile } from './actions';

export const metadata: Metadata = { title: 'My profile', robots: { index: false } };
export default function Page() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <Content />
    </Suspense>
  );
}
async function Content() {
  const user = await requireRole(['student'], '/learn/profile');
  const doc = await adminDb().collection('users').doc(user.uid).get();
  return (
    <section className="site-container section portal-welcome">
      <h1 className="detail-title">My profile</h1>
      <p>Pick a nickname and an avatar. Keep your full name private.</p>
      <AccountForm
        action={saveProfile}
        label="Save profile"
        fields={[
          {
            name: 'nickname',
            label: 'Nickname',
            minLength: 2,
            maxLength: 20,
            value: String(doc.get('nickname') ?? ''),
          },
          {
            name: 'avatarId',
            label: 'Avatar',
            options: avatars,
            value: String(doc.get('avatarId') ?? 'leaf'),
          },
        ]}
      />
      <Link href="/learn" className="button secondary">
        Back to learning
      </Link>
    </section>
  );
}
