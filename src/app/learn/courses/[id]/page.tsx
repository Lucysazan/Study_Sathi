import { CourseView } from '@/components/course/CourseView';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PortalLoading } from '@/components/portal/PortalShell';
import { requireRole } from '@/lib/auth/session';
import { readCourseOutline } from '@/lib/course/outline';
import { adminDb } from '@/lib/firebase/admin';
import { LearningAction } from '@/components/course/LearningAction';
import { getFirstLessonId, getCourseModules, type CourseLike } from '@/lib/course/learning';
import { enrollInCourse } from '../actions';

export const metadata: Metadata = { title: 'Course details', robots: { index: false } };

export default function LearnCoursePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <LearnCourseContent params={params} />
    </Suspense>
  );
}

async function LearnCourseContent({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(['student'], '/learn/courses');
  const { id } = await params;
  const courseSnap = await adminDb().collection('courses').doc(id).get();

  if (!courseSnap.exists || courseSnap.get('status') !== 'published') {
    notFound();
  }

  const enrollmentSnap = await adminDb()
    .collection('courseEnrollments')
    .doc(`${user.uid}_${id}`)
    .get();

  const course: CourseLike = {
    outline: readCourseOutline(courseSnap.get('outline')) ?? { modules: [] },
  };
  const modules = getCourseModules(course);
  const title = String(courseSnap.get('title') ?? 'Untitled course');
  const summary = String(courseSnap.get('summary') ?? 'No summary yet.');
  const category = String(courseSnap.get('category') ?? 'digital-skills');
  const ageRange = String(courseSnap.get('ageRange') ?? 'All ages');
  const budget = String(courseSnap.get('budget') ?? 'Flexible');
  const isEnrolled = enrollmentSnap.exists;
  const progress = isEnrolled
    ? await adminDb().collection('courseProgress').doc(`${user.uid}_${id}`).get()
    : null;
  const saved: unknown = progress?.get('completedLessons');
  const completed = new Set(
    Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : [],
  );
  const lessons = modules.flatMap((part) => part.lessons ?? []);
  const completedCount = lessons.filter((lesson) => lesson.id && completed.has(lesson.id)).length;
  const resumeId = lessons.find((lesson) => lesson.id && !completed.has(lesson.id))?.id;
  const firstLessonId = getFirstLessonId(course);

  return (
    <section className="site-container section portal-welcome">
      <CourseView courseId={id} />
      <div className="eyebrow">COURSE</div>
      <h1 className="detail-title">{title}</h1>

      <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <Link href="/learn/courses" className="button secondary">
          Back to catalog
        </Link>
      </div>

      <div className="module-card" style={{ padding: '1rem 1.25rem', marginTop: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <span className="chip chip-muted">{category.replace('-', ' ')}</span>
          <span className="chip chip-muted">{ageRange}</span>
          <span className="chip chip-muted">Budget: {budget}</span>
        </div>

        <p style={{ margin: '1rem 0 0' }}>{summary}</p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <LearningAction
            action={enrollInCourse}
            courseId={id}
            disabled={isEnrolled}
            label="Enroll in course"
          />
          {isEnrolled && firstLessonId && (
            <Link
              href={`/learn/courses/${id}/${resumeId ?? firstLessonId}`}
              className="button secondary"
            >
              {completedCount === lessons.length
                ? 'Review course'
                : completedCount > 0
                  ? 'Continue course'
                  : 'Start course'}
            </Link>
          )}
        </div>
      </div>

      <div className="module-card" style={{ padding: '1rem 1.25rem', marginTop: '1.25rem' }}>
        <h3 style={{ marginTop: 0 }}>Course outline</h3>
        {isEnrolled && lessons.length > 0 && (
          <p role="status">
            {completedCount} of {lessons.length} lessons complete
          </p>
        )}
        {modules.length === 0 ? (
          <p>No outline has been saved yet for this course.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.9rem' }}>
            {modules.map((module, moduleIndex) => (
              <div
                key={module.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem' }}>
                  {moduleIndex + 1}. {module.title || 'Untitled module'}
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.35rem' }}>
                  {(module.lessons ?? []).map((lesson, lessonIndex) => (
                    <li key={lesson.id}>
                      {isEnrolled && lesson.id ? (
                        <Link href={`/learn/courses/${id}/${lesson.id}`}>
                          {lesson.title || 'Untitled lesson'}
                          {completed.has(lesson.id) ? ' · Completed' : ''}
                        </Link>
                      ) : (
                        <>
                          {lessonIndex + 1}. {lesson.title || 'Untitled lesson'} · {lesson.kind} ·{' '}
                          {lesson.duration}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
