'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import type { CourseLessonLike } from '@/lib/course/learning';
import { safeMediaUrl, videoEmbedUrl } from '@/lib/course/media';
import { saveNote, useNotes } from '@/lib/storage/guest-data';

/** Practice feedback only. Completion and all future rewards are server-controlled. */
export function LessonContent({
  lesson,
  courseId,
}: {
  lesson: CourseLessonLike;
  courseId?: string;
}) {
  const id = useId();
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [noteError, setNoteError] = useState('');
  const notes = useNotes();
  const noteKey = `lesson-${courseId}-${lesson.id}`;
  const media = safeMediaUrl(lesson.mediaUrl);
  const embed = videoEmbedUrl(lesson.mediaUrl);
  switch (lesson.kind) {
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
        <div>
          <fieldset>
            <legend>{lesson.question}</legend>
            {(lesson.options ?? []).map((option, index) => (
              <label className="lesson-choice" key={`${index}-${option}`}>
                <input
                  type="radio"
                  name={`${id}-answer`}
                  value={option}
                  checked={answer === option}
                  required
                  onChange={() => {
                    setAnswer(option);
                    setChecked(false);
                  }}
                />
                {option}
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            onClick={() => setChecked(true)}
            className="button secondary"
            disabled={!answer}
          >
            Check answer
          </button>
          <p role="status">
            {checked
              ? answer === lesson.correctAnswer
                ? '✓ That’s right. Well done!'
                : 'Try again. Read the lesson and choose another answer.'
              : ''}
          </p>
        </div>
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
