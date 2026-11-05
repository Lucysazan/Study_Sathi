import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, PlusCircle } from 'lucide-react';
import { Suspense } from 'react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { PortalLoading } from '@/components/portal/PortalShell';
import { requireRole } from '@/lib/auth/session';
import { listCreatorDrafts } from './actions';

export const metadata: Metadata = { title: 'My drafts', robots: { index: false } };

export default function CreatorDraftsPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <CreatorDraftsContent />
    </Suspense>
  );
}

async function CreatorDraftsContent() {
  await requireRole(['creator'], '/creator/drafts');
  const drafts = await listCreatorDrafts();

  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">MY DRAFTS</div>
      <h1 className="detail-title">Your course drafts</h1>

      <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <Link href="/creator/new" className="button primary" aria-label="Create a new course draft">
          <PlusCircle size={18} aria-hidden="true" />
          New course
        </Link>
        <Link href="/creator" className="button secondary" aria-label="Back to creator dashboard">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to studio
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="notice">
          <FileText size={22} aria-hidden="true" />
          <div>
            <h3>No drafts yet</h3>
            <p>
              Create your first course draft to start the outline, lesson plan, and review process.
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-list" style={{ marginTop: '1.5rem' }}>
          {drafts.map((draft) => (
            <div key={draft.id} className="module-card" style={{ padding: '1rem 1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{draft.title}</h3>
                  <p style={{ margin: '0.4rem 0 0' }}>{draft.summary || 'No summary yet.'}</p>
                </div>
                <span className="chip chip-muted">{draft.status}</span>
              </div>
              {draft.reviewNote ? (
                <div style={{ marginTop: '0.75rem' }}>
                  <strong>Admin feedback:</strong>
                  <p style={{ margin: '0.35rem 0 0' }}>{draft.reviewNote}</p>
                </div>
              ) : (
                <p style={{ margin: '0.75rem 0 0' }}>No admin feedback yet.</p>
              )}
              <div
                className="portal-actions"
                style={{ justifyContent: 'flex-start', marginTop: '0.75rem' }}
              >
                <Link href={`/creator/drafts/${draft.id}`} className="button secondary">
                  Edit outline
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="portal-actions">
        <SignOutButton />
      </div>
    </section>
  );
}
