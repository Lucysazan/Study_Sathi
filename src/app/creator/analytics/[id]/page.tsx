import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PortalLoading } from '@/components/portal/PortalShell';
import { AnalyticsMetrics } from '@/components/course/AnalyticsMetrics';
import { getCreatorCourseAnalytics } from '@/lib/analytics/courses';

export const metadata: Metadata = { title: 'Course activity', robots: { index: false } };
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <CourseAnalytics params={params} />
    </Suspense>
  );
}
async function CourseAnalytics({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCreatorCourseAnalytics(id);
  if (!course) notFound();
  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">COURSE ACTIVITY</div>
      <h1 className="detail-title">{course.title}</h1>
      <p>Status: {course.status}</p>
      <AnalyticsMetrics metrics={course.metrics} />
      <h2>Lesson completions</h2>
      <p>
        Lesson counts start with this update. Learners can take lessons in any order, so a lower
        count does not prove that learners dropped out.
      </p>
      {course.lessons.length ? (
        <ol className="analytics-lessons">
          {course.lessons.map((lesson, index) => (
            <li key={index}>
              <div>
                <strong>{lesson.title}</strong>
                <span>{lesson.completions} recorded completions</span>
              </div>
              <div className="analytics-bar" aria-hidden="true">
                <span style={{ width: `${lesson.width}%` }} />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p>Add lessons to this course to see their activity here.</p>
      )}
      <Link className="button secondary" href="/creator/analytics">
        Back to analytics
      </Link>
    </section>
  );
}
