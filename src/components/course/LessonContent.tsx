'use client';

import Image from 'next/image';
import { useId, useState, type ReactNode } from 'react';
import type { CourseLessonLike } from '@/lib/course/learning';
import { safeMediaUrl, videoEmbedUrl } from '@/lib/course/media';
import { saveNote, useNotes } from '@/lib/storage/guest-data';
import { SortPlayer } from './SortPlayer';
import { QuizPlayer } from './QuizPlayer';
import { BudgetPlayer } from './BudgetPlayer';

/** Shared presentation; authenticated quiz grading and rewards run on the server. */
export function LessonContent({
  lesson,
  courseId,
}: {
  lesson: CourseLessonLike;
  courseId?: string;
}): ReactNode {
  if (lesson.blocks?.length)
    return (
      <div className="lesson-stack">
        {lesson.blocks.map((block) => (
          <section key={block.id} className="lesson-block">
            <h3>{block.title || 'Activity'}</h3>
            <LessonBlockContent lesson={block} courseId={courseId} lessonId={lesson.id} />
          </section>
        ))}
      </div>
    );
  return <LessonBlockContent lesson={lesson} courseId={courseId} lessonId={lesson.id} />;
}

function LessonBlockContent({
  lesson,
  courseId,
  lessonId,
}: {
  lesson: CourseLessonLike;
  courseId?: string;
  lessonId?: string;
}) {
  const id = useId();
  const [noteError, setNoteError] = useState('');
  const notes = useNotes();
  const noteKey = `lesson-${courseId}-${lesson.id}`;
  const media = safeMediaUrl(lesson.mediaUrl);
  const embed = videoEmbedUrl(lesson.mediaUrl);
  switch (lesson.kind) {
    case 'sort':
      return lesson.sortActivity ? (
        <SortPlayer key={JSON.stringify(lesson.sortActivity)} activity={lesson.sortActivity} />
      ) : (
        <p>This sorting activity is being prepared.</p>
      );
    case 'budget':
      return lesson.budgetActivity ? (
        <BudgetPlayer
          key={JSON.stringify(lesson.budgetActivity)}
          activity={lesson.budgetActivity}
        />
      ) : (
        <p>This budget activity is being prepared.</p>
      );
    case 'text':
      return (
        <div className="lesson-prose">{lesson.content || 'This lesson is being prepared.'}</div>
      );
    case 'video':
      return embed ? (
        <iframe
          className="lesson-video"
          src={embed}
          title={lesson.title ?? 'Lesson video'}
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <p>This video is not available yet.</p>
      );
    case 'image':
      return media ? (
        <figure>
          <Image
            src={media}
            alt={lesson.alt ?? lesson.title ?? 'Lesson illustration'}
            width={900}
            height={600}
            unoptimized
            style={{ width: '100%', height: 'auto', borderRadius: 12 }}
          />
        </figure>
      ) : (
        <p>This image is not available yet.</p>
      );
    case 'resource':
      return media ? (
        <a href={media} className="button secondary" target="_blank" rel="noopener noreferrer">
          {lesson.resourceTitle || 'Open resource'} (opens a new tab)
        </a>
      ) : (
        <p>This resource is not available yet.</p>
      );
    case 'quiz':
      return (
        <QuizPlayer
          key={JSON.stringify([lesson.question, lesson.options, lesson.correctAnswer])}
          quiz={lesson}
          courseId={courseId}
          lessonId={lessonId}
        />
      );
    case 'reflection':
      return (
        <div>
          <p>{lesson.prompt}</p>
          <p>Take a moment to think. Keep personal information private.</p>
          {courseId && lesson.id && (
            <>
              <label htmlFor={`${id}-note`}>Your private notes</label>
              <textarea
                id={`${id}-note`}
                rows={5}
                maxLength={4000}
                value={notes[noteKey] ?? ''}
                onChange={(event) => {
                  if (!saveNote(noteKey, event.target.value))
                    setNoteError('Your note could not be saved.');
                }}
              />
              <p role="status">{noteError}</p>
            </>
          )}
        </div>
      );
    case 'checkpoint':
      return (
        <div className="notice">
          <p>{lesson.prompt}</p>
        </div>
      );
    default:
      return <p>This lesson is being prepared.</p>;
  }
}
