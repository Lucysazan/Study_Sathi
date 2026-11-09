import { studyActivities } from '@/lib/study/catalog';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortalLoading } from '@/components/portal/PortalShell';
import { getChildProgress } from '@/lib/parent/progress';

export const metadata: Metadata = { title: 'Learner progress', robots: { index: false } };

export default function ChildProgressPage({ params }: PageProps<'/parent/children/[id]'>) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <Progress params={params} />
    </Suspense>
  );
}

async function Progress({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const child = await getChildProgress(id);
  if (!child) notFound();
  return (
    <section className="site-container section">
      <Link href="/parent">Back to family</Link>
      <h1>{child.nickname}&apos;s learning progress</h1>
      <p>
        Level {child.level} Â· {child.xp} XP Â· {child.streak} day learning streak
      </p>
      <p>
        {child.weeklyLessons} recorded learning activities this week (Sundayâ€“Saturday, Nepal
        time).
      </p>
      <p>
        {child.lessonCount} recorded learning activities and {child.courseCount} recorded courses
        completed.
      </p>
      <p>Totals reflect activity recorded since tracking began.</p>
      <div className="learning-card">
        <h2>Play and Learn checks</h2>
        {child.study === null ? (
          <p>Activity checks are temporarily unavailable.</p>
        ) : Object.keys(child.study).length === 0 ? (
          <p>No activity checks saved yet.</p>
        ) : (
          <ul>
            {studyActivities
              .filter((a) => child.study?.[a.id])
              .map((a) => {
                const r = child.study![a.id]!;
                return (
                  <li key={a.id}>
                    {a.title}: best {r.best}/{r.total}, latest {r.last}/{r.total}.{' '}
                    {r.completedAt ? 'Completed' : 'Keep practising'}
                  </li>
                );
              })}
          </ul>
        )}
        <p>
          Completed learning checks count toward activity totals, XP and eligible rewards. Course
          completion remains separate.
        </p>
        <h2>Academic practice</h2>
        {child.academic === null ? (
          <p>Academic results are temporarily unavailable.</p>
        ) : child.academic.length === 0 ? (
          <p>No academic practice saved yet.</p>
        ) : (
          <ul>
            {child.academic.map((result) => (
              <li key={`${result.chapterId}-${result.phase}`}>
                {result.chapterId.replaceAll('-', ' ')} · {result.phase}: {result.correct}/
                {result.total}. Suggested review: {result.reviewAt.slice(0, 10)} (UTC).
              </li>
            ))}
          </ul>
        )}
        <p>
          Short practice results guide revision; they do not certify mastery. They do not add to
          course XP totals.
        </p>
      </div>
      {child.course ? (
        <div className="learning-card">
          <h2>{child.course.title}</h2>
          <p>
            {child.course.done} of {child.course.total} lessons complete
          </p>
          <ul>
            {child.course.lessons.map((lesson, index) => (
              <li key={index}>
                {lesson.title}: {lesson.completed ? 'Complete' : 'To do'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No current published course to show yet.</p>
      )}
    </section>
  );
}
