import { BookOpen, Compass, PlusCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { PortalLoading } from '@/components/portal/PortalShell';
import { requireRole } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'Creator studio', robots: { index: false } };

export default function CreatorPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <CreatorDashboard />
    </Suspense>
  );
}

async function CreatorDashboard() {
  const user = await requireRole(['creator'], '/creator');
  const firstName = user.name?.split(' ')[0] ?? 'Creator';

  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">CREATOR STUDIO</div>
      <h1 className="detail-title">Hello, {firstName}!</h1>

      <div className="notice">
        <BookOpen size={22} aria-hidden="true" />
        <div>
          <h3>Course workspace</h3>
          <p>
            Drafts, lesson plans, and classroom-ready content will live here as the course builder
            comes online.
          </p>
        </div>
      </div>

      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        <Link href="/creator/new" className="button primary" aria-label="Create a new course">
          <PlusCircle size={18} aria-hidden="true" />
          New course
        </Link>
        <Link href="/creator/drafts" className="button secondary" aria-label="Open your saved drafts">
          My drafts
        </Link>
        <Link href="/creator/apply" className="button secondary" aria-label="Review creator guidelines">
          <Compass size={18} aria-hidden="true" />
          Guidelines
        </Link>
      </div>

      <div className="admin-list" style={{ marginTop: '1.5rem' }}>
        <div className="module-card" style={{ padding: '1rem 1.25rem' }}>
          <h3 style={{ margin: 0 }}>Your workspace</h3>
          <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.1rem' }}>
            <li>Drafts: 0</li>
            <li>Submitted for review: 0</li>
            <li>Published courses: 0</li>
          </ul>
        </div>
      </div>

      <div className="portal-actions">
        <SignOutButton />
      </div>
    </section>
  );
}
