import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PortalLoading } from '@/components/portal/PortalShell';
import { AnalyticsMetrics } from '@/components/course/AnalyticsMetrics';
import { getCreatorAnalytics } from '@/lib/analytics/courses';

export const metadata: Metadata = { title: 'Course analytics', robots: { index: false } };
export default function Page({ searchParams }: { searchParams: Promise<{ after?: string }> }) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <Analytics searchParams={searchParams} />
    </Suspense>
  );
}
async function Analytics({ searchParams }: { searchParams: Promise<{ after?: string }> }) {
  const { after } = await searchParams;
  const data = await getCreatorAnalytics(after);
  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">CREATOR ANALYTICS</div>
      <h1 className="detail-title">Your courses, at a glance</h1>
      <p>
        {data.summary.courses} courses: {data.summary.draft} drafts, {data.summary.review} in
        review, {data.summary.published} published.
      </p>
      <AnalyticsMetrics metrics={data.summary} />
      <h2>Course details</h2>
      {data.courses.length ? (
        <ul className="analytics-course-list">
          {data.courses.map((course) => (
            <li key={course.id} className="learning-card">
              <h3>
                <Link href={`/creator/analytics/${encodeURIComponent(course.id)}`}>
                  {course.title}
                </Link>
              </h3>
              <p>
                {course.status} · {course.views} recorded views · {course.enrollments} enrollments ·{' '}
                {course.completions} completions
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          {after
            ? 'There are no more courses on this page.'
            : 'Create a course to start seeing activity here.'}
        </p>
      )}
      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        {data.next && (
          <Link
            className="button secondary"
            href={`/creator/analytics?after=${encodeURIComponent(data.next)}`}
          >
            Next courses
          </Link>
        )}
        {after && (
          <Link className="button secondary" href="/creator/analytics">
            First page
          </Link>
        )}
        <Link className="button secondary" href="/creator">
          Back to studio
        </Link>
      </div>
    </section>
  );
}
