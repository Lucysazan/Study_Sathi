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
      <p>{child.weeklyLessons} recorded lessons this week (Sundayâ€“Saturday, Nepal time).</p>
      <p>
        {child.lessonCount} recorded lessons and {child.courseCount} recorded courses completed.
      </p>
      <p>Totals reflect activity recorded since tracking began.</p>
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
