import { BookOpen, Compass, PlusCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { PortalLoading } from '@/components/portal/PortalShell';
import { getCreatorWorkspace } from '@/lib/analytics/courses';

export const metadata: Metadata = { title: 'Creator studio', robots: { index: false } };

export default function CreatorPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <CreatorDashboard />
    </Suspense>
  );
}

async function CreatorDashboard() {
  const user = await getCreatorWorkspace();
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
            Build lessons, submit your courses for review, and see how learners use your published
            courses.
          </p>
        </div>
      </div>

      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        <Link href="/creator/new" className="button primary" aria-label="Create a new course">
          <PlusCircle size={18} aria-hidden="true" />
          New course
        </Link>
        <Link
          href="/creator/drafts"
          className="button secondary"
          aria-label="Open your saved drafts"
        >
          My drafts
        </Link>
        <Link
          href="/creator/apply"
          className="button secondary"
          aria-label="Review creator guidelines"
        >
          <Compass size={18} aria-hidden="true" />
          Guidelines
        </Link>
        <Link href="/creator/analytics" className="button secondary">
          Course analytics
        </Link>
      </div>

      <div className="admin-list" style={{ marginTop: '1.5rem' }}>
        <div className="module-card" style={{ padding: '1rem 1.25rem' }}>
          <h3 style={{ margin: 0 }}>Your workspace</h3>
          <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.1rem' }}>
            <li>Drafts: {user.draft}</li>
            <li>Submitted for review: {user.review}</li>
            <li>Published courses: {user.published}</li>
          </ul>
        </div>
      </div>

      <div className="portal-actions">
        <SignOutButton />
      </div>
    </section>
  );
}
