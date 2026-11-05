import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PortalLoading } from '@/components/portal/PortalShell';
import { requireRole } from '@/lib/auth/session';
import { CourseDraftForm } from './CourseDraftForm';

export const metadata: Metadata = { title: 'Create a course draft', robots: { index: false } };

export default function CreateCoursePage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <CreateCourseContent />
    </Suspense>
  );
}

async function CreateCourseContent() {
  await requireRole(['creator'], '/creator/new');

  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">NEW COURSE</div>
      <h1 className="detail-title">Start a draft</h1>

      <div className="notice">
        <div>
          <h3>Course builder starter</h3>
          <p>
            Add the basic course details and save your draft. The next phase will expand this into a
            full lesson-outline builder with blocks, preview, and publish review.
          </p>
        </div>
      </div>

      <CourseDraftForm />
    </section>
  );
}
