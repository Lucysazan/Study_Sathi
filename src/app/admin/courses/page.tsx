import { ClipboardList } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PortalHeader } from '@/components/admin/PortalHeader';
import { PortalLoading } from '@/components/portal/PortalShell';
import { listCoursesForReview } from '@/lib/admin/courses';
import { CourseReviewControls } from './CourseReviewControls';

export const metadata: Metadata = { title: 'Course review · Admin', robots: { index: false } };

async function AdminCoursesBody() {
  const courses = await listCoursesForReview();

  return (
    <>
      <PortalHeader
        eyebrow="COURSE REVIEW"
        title="Review queue"
        intro="Approve, publish, or request edits for creator drafts before they go live."
      />

      {courses.length === 0 ? (
        <div className="notice">
          <ClipboardList size={22} aria-hidden="true" />
          <div>
            <h3>No drafts in review</h3>
            <p>Creator drafts will appear here when they are submitted for approval.</p>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <caption className="sr-only">Course review queue</caption>
            <thead>
              <tr>
                <th scope="col">Course</th>
                <th scope="col">Status</th>
                <th scope="col">Summary</th>
                <th scope="col">Review</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <strong>{course.title}</strong>
                    <small>{course.creatorName ?? 'Creator not set'}</small>
                  </td>
                  <td>
                    <span className={`chip ${course.status === 'published' ? 'chip-success' : 'chip-muted'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td>{course.summary || 'No summary yet.'}</td>
                  <td>
                    <CourseReviewControls courseId={course.id} status={course.status} title={course.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AdminCoursesPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminCoursesBody />
    </Suspense>
  );
}
