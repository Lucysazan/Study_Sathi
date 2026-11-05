import { ArrowRight, Plus, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { PortalLoading } from '@/components/portal/PortalShell';
import { requireRole } from '@/lib/auth/session';
import { AccountForm } from '@/components/portal/AccountForm';
import { resetChildPassword } from './actions';
import { adminDb } from '@/lib/firebase/admin';

export const metadata: Metadata = { title: 'Parent area', robots: { index: false } };

export default function ParentPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <ParentDashboard />
    </Suspense>
  );
}

async function ParentDashboard() {
  const user = await requireRole(['parent'], '/parent');
  const doc = await adminDb().collection('users').doc(user.uid).get();
  const childUids: unknown = doc.get('childUids');
  const children = Array.isArray(childUids)
    ? childUids.filter((value): value is string => typeof value === 'string')
    : [];

  const childDocs = await Promise.all(
    children.map((id) => adminDb().collection('users').doc(id).get()),
  );
  const linked = childDocs.filter((child) => child.exists && child.get('parentUid') === user.uid);
  const firstName = user.name?.split(' ')[0] ?? 'Parent';

  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">PARENT AREA</div>
      <h1 className="detail-title">Hello, {firstName}!</h1>

      <div className="notice">
        <Users size={22} aria-hidden="true" />
        <div>
          <h3>Family overview</h3>
          <p>
            {children.length > 0
              ? `You have ${children.length} child account${children.length === 1 ? '' : 's'} linked.`
              : 'No child accounts are linked yet. Add your first learner to begin tracking progress.'}
          </p>
        </div>
      </div>

      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        <Link href="/parent/add-child" className="button primary" aria-label="Add a child account">
          <Plus size={18} aria-hidden="true" />
          Add a child
        </Link>
        <Link href="/account" className="button secondary" aria-label="View your account settings">
          My account
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>

      <div className="admin-list" style={{ marginTop: '1.5rem' }}>
        <div className="module-card" style={{ padding: '1rem 1.25rem' }}>
          <h3 style={{ margin: 0 }}>Children</h3>
          {children.length === 0 ? (
            <p style={{ margin: '0.75rem 0 0' }}>
              No children added yet. Once a child account is created, you will be able to review
              activity and reset access here.
            </p>
          ) : (
            <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.1rem' }}>
              {linked.map((child) => (
                <li key={child.id}>
                  <h4>
                    {String(child.get('nickname') ?? 'Learner')} ?{' '}
                    {String(child.get('avatarId') ?? 'leaf')}
                  </h4>
                  <p>Username: {String(child.get('username') ?? '')}</p>
                  <details>
                    <summary>Reset password</summary>
                    <AccountForm
                      action={resetChildPassword}
                      label="Reset password"
                      fields={[
                        { name: 'childUid', label: '', type: 'hidden', value: child.id },
                        {
                          name: 'password',
                          label: 'New password',
                          type: 'password',
                          minLength: 8,
                          maxLength: 128,
                        },
                      ]}
                    />
                  </details>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="portal-actions">
        <SignOutButton />
      </div>
    </section>
  );
}
