import { LessonContent } from '@/components/course/LessonContent';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { PortalLoading } from '@/components/portal/PortalShell';
import { requireRole } from '@/lib/auth/session';
import { readCourseOutline } from '@/lib/course/outline';
import { adminDb } from '@/lib/firebase/admin';
import {
  findLessonById,
  getCourseLessonPath,
  getNextLessonId,
  getCourseModules,
} from '@/lib/course/learning';
import { LearningAction } from '@/components/course/LearningAction';
import type { CourseLike } from '@/lib/course/learning';
import { completeLesson } from '../../actions';

export const metadata: Metadata = { title: 'Course lesson', robots: { index: false } };

export default function LearnCourseLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <LearnCourseLessonContent params={params} />
    </Suspense>
  );
}

async function LearnCourseLessonContent({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const user = await requireRole(['student'], '/learn/courses');
  const { id, lessonId } = await params;

  const courseSnap = await adminDb().collection('courses').doc(id).get();
  if (!courseSnap.exists || courseSnap.get('status') !== 'published') notFound();

  const enrollmentSnap = await adminDb()
    .collection('courseEnrollments')
    .doc(`${user.uid}_${id}`)
    .get();
  if (!enrollmentSnap.exists) redirect(`/learn/courses/${id}`);

  const course: CourseLike = {
    outline: readCourseOutline(courseSnap.get('outline')) ?? { modules: [] },
  };
  const lesson = findLessonById(course as CourseLike, lessonId);
  if (!lesson) notFound();

  const progressSnap = await adminDb().collection('courseProgress').doc(`${user.uid}_${id}`).get();
  const completedLessons = Array.isArray(progressSnap.get('completedLessons'))
    ? progressSnap
        .get('completedLessons')
        .filter((value: unknown): value is string => typeof value === 'string')
    : [];
  const isComplete = completedLessons.includes(lessonId);
  const totalLessons = getCourseModules(course).flatMap((part) => part.lessons ?? []).length;
  const completeCount = getCourseModules(course)
    .flatMap((part) => part.lessons ?? [])
    .filter((item) => item.id && completedLessons.includes(item.id)).length;
  const nextLessonId = getNextLessonId(course as CourseLike, lessonId);

  return (
    <section className="site-container section portal-welcome lesson-player">
      <div className="eyebrow">LESSON</div>
      <p>
        {completeCount} of {totalLessons} lessons complete
      </p>
      <progress
        max={Math.max(totalLessons, 1)}
        value={completeCount}
        aria-label="Course progress"
      />
      <h1 className="detail-title">{lesson.title ?? 'Untitled lesson'}</h1>

      <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <Link href={`/learn/courses/${id}`} className="button secondary">
          Back to course
        </Link>
      </div>

      <div className="module-card" style={{ padding: '1rem 1.25rem', marginTop: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <span className="chip chip-muted">{lesson.kind}</span>
          <span className="chip chip-muted">{lesson.duration ?? '10 min'}</span>
          {isComplete ? (
            <span className="chip chip-success">Completed</span>
          ) : (
            <span className="chip chip-muted">In progress</span>
          )}
        </div>

        <LessonContent key={lessonId} lesson={lesson} courseId={id} />

        <LearningAction
          action={completeLesson}
          courseId={id}
          lessonId={lessonId}
          disabled={isComplete}
          label="Mark lesson complete"
        />

        {nextLessonId && (
          <div style={{ marginTop: '1rem' }}>
            <Link href={getCourseLessonPath(id, nextLessonId)} className="button secondary">
              Next lesson
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
