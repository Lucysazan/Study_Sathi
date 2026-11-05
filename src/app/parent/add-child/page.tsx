import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { PortalLoading } from '@/components/portal/PortalShell';
import { AccountForm } from '@/components/portal/AccountForm';
import { avatars } from '@/lib/validation/family';
import { addChild } from '../actions';
export const metadata: Metadata = { title: 'Add a learner', robots: { index: false } };
export default function Page() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <Content />
    </Suspense>
  );
}
async function Content() {
  await requireRole(['parent'], '/parent/add-child');
  return (
    <section className="site-container section portal-welcome">
      <h1 className="detail-title">Create a learner account</h1>
      <p>Use a nickname, not a full name. Keep the username and password somewhere safe.</p>
      <AccountForm
        action={addChild}
        label="Create account"
        fields={[
          { name: 'nickname', label: 'Nickname', minLength: 2, maxLength: 20 },
          { name: 'username', label: 'Username', minLength: 3, maxLength: 30 },
          {
            name: 'password',
            label: 'Password (at least 8 characters)',
            type: 'password',
            minLength: 8,
            maxLength: 128,
          },
          { name: 'avatarId', label: 'Avatar', options: avatars },
        ]}
      />
      <Link href="/parent" className="button secondary">
        Back to family
      </Link>
    </section>
  );
}
