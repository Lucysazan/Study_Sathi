import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { PortalLoading } from '@/components/portal/PortalShell';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { readCourseMetadata } from '@/lib/course/metadata';
import { readCourseOutline } from '@/lib/course/outline';
import { CourseOutlineEditor } from './CourseOutlineEditor';

export const metadata: Metadata = { title: 'Course outline', robots: { index: false } };

export default function CourseDraftEditorPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <CourseDraftEditorContent params={params} />
    </Suspense>
  );
}

async function CourseDraftEditorContent({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(['creator'], '/creator/drafts');
  const { id } = await params;
  const doc = await adminDb().collection('courses').doc(id).get();

  if (!doc.exists || doc.get('createdBy') !== user.uid) {
    notFound();
  }

  const outline = readCourseOutline(doc.get('outline'));

  const title = String(doc.get('title') ?? 'Untitled course');
  const details = readCourseMetadata(doc.data() ?? {});

  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">OUTLINE EDITOR</div>
      <h1 className="detail-title">{title}</h1>
      {doc.get('status') === 'draft' ? (
        <CourseOutlineEditor
          courseId={id}
          initialOutline={outline ?? { modules: [] }}
          initialMetadata={details}
        />
      ) : (
        <div className="notice">
          <p>
            This course is in review or published. An admin can return it to draft before you edit
            it.
          </p>
          <Link href="/creator/drafts">Back to courses</Link>
        </div>
      )}
    </section>
  );
}
