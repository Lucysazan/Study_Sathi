'use client';

import { CheckCircle2, MessageSquareText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CourseCover } from '@/components/course/CourseCover';
import { CourseChecklist } from '@/components/course/CourseChecklist';
import { LessonContent } from '@/components/course/LessonContent';
import type { CourseReviewDetail } from '@/lib/admin/courses';
import { saveCourseReviewNote, setCourseStatus } from '../actions';

export function CourseReviewDetail({ course }: { course: CourseReviewDetail }) {
  const router = useRouter();
  const [note, setNote] = useState(course.reviewNote ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleStatus(nextStatus: 'draft' | 'review' | 'published') {
    setBusy(true);
    setError('');
    const result = await setCourseStatus(course.id, nextStatus);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setStatusMessage(`Course status updated to ${nextStatus}.`);
    router.refresh();
  }

  async function handleSaveNote() {
    setBusy(true);
    setError('');
    const result = await saveCourseReviewNote(course.id, { note });
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setStatusMessage('Review note saved for the creator.');
    router.refresh();
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="notice">
        <CheckCircle2 size={22} aria-hidden="true" />
        <div>
          <h3>Course overview</h3>
          <p>{course.summary || 'No summary yet for this course.'}</p>
          <p>
            <strong>Status:</strong> {course.status}
            {course.creatorName ? ` · Creator: ${course.creatorName}` : ''}
          </p>
        </div>
      </div>

      <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="button secondary"
          disabled={busy}
          onClick={() => handleStatus('draft')}
        >
          Set to draft
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={busy}
          onClick={() => handleStatus('review')}
        >
          Set to review
        </button>
        <button
          type="button"
          className="button primary"
          disabled={busy || !course.checklist.ready}
          onClick={() => handleStatus('published')}
        >
          Publish course
        </button>
      </div>
      <section>
        <h3>Publication checklist</h3>
        <p>Teaching language: {course.language || 'Not specified'}</p>
        <CourseCover src={course.coverImageUrl} alt={course.coverAlt || course.title} />
        <CourseChecklist checklist={course.checklist} />
      </section>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {statusMessage && (
        <p className="admin-row-status" role="status">
          {statusMessage}
        </p>
      )}

      <div className="module-card" style={{ padding: '1rem 1.25rem' }}>
        <h3 style={{ marginTop: 0 }}>Outline preview</h3>
        {course.outline?.modules?.length ? (
          course.outline.modules.map((module) => (
            <div key={module.id} style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>{module.title}</h4>
              <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <details>
                      <summary>
                        {lesson.title} ·{' '}
                        {lesson.blocks?.length ? `${lesson.blocks.length} activities` : lesson.kind}{' '}
                        · {lesson.duration}
                      </summary>
                      <LessonContent lesson={lesson} />
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No outline has been saved yet for this course.</p>
        )}
      </div>

      <div className="module-card" style={{ padding: '1rem 1.25rem' }}>
        <h3 style={{ marginTop: 0 }}>Creator note</h3>
        <div className="field-group">
          <label htmlFor="review-note">Feedback</label>
          <textarea
            id="review-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={6}
            placeholder="Tell the creator what to improve before publishing."
          />
        </div>
        <button type="button" className="button secondary" disabled={busy} onClick={handleSaveNote}>
          <MessageSquareText size={18} aria-hidden="true" />
          Save note
        </button>
      </div>
    </div>
  );
}
