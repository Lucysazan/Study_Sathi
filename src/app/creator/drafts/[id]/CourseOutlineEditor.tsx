'use client';

import { ArrowLeft, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CourseLesson, CourseOutline } from '@/lib/course/draft';
import { LessonContent } from '@/components/course/LessonContent';
import { saveCourseOutline, submitCourseForReview } from '../actions';

const lessonKindOptions = [
  { value: 'text', label: 'Text' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
  { value: 'resource', label: 'Resource' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'reflection', label: 'Reflection' },
  { value: 'checkpoint', label: 'Checkpoint' },
] as const;

function createLesson(kind: CourseLesson['kind'] = 'text'): CourseLesson {
  const base: CourseLesson = {
    id: crypto.randomUUID(),
    title: 'New lesson',
    kind,
    duration: '10 min',
  };

  if (kind === 'text') {
    return {
      ...base,
      content: 'Add a short explanation or instruction for learners.',
    };
  }

  if (kind === 'quiz') {
    return {
      ...base,
      question: 'What is the key idea?',
      options: ['Option 1', 'Option 2'],
      correctAnswer: 'Option 1',
    };
  }

  if (kind === 'reflection' || kind === 'checkpoint') {
    return {
      ...base,
      prompt: 'Prompt learners with a reflection or self-check exercise.',
    };
  }

  if (kind === 'resource') {
    return {
      ...base,
      resourceTitle: 'Helpful resource',
      mediaUrl: 'https://',
    };
  }

  if (kind === 'image' || kind === 'video') {
    return {
      ...base,
      mediaUrl: 'https://',
    };
  }

  return base;
}

export function CourseOutlineEditor({
  courseId,
  initialOutline,
  title,
  summary,
}: {
  courseId: string;
  initialOutline: CourseOutline;
  title: string;
  summary: string;
}) {
  const router = useRouter();
  const [modules, setModules] = useState<CourseOutline['modules']>(initialOutline.modules);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const [autosaveState, setAutosaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (submitState === 'success') return;
    let active = true;
    const timeout = setTimeout(async () => {
      setAutosaveState('saving');
      const result = await saveCourseOutline(courseId, { modules });
      if (!active) return;
      if (!result.ok) {
        setError(result.error);
        setAutosaveState('idle');
        return;
      }

      setAutosaveState('saved');
    }, 800);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [modules, courseId, submitState]);

  function addModule() {
    setModules((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: `Module ${current.length + 1}`,
        lessons: [createLesson('text')],
      },
    ]);
  }

  function updateModule(index: number, next: CourseOutline['modules'][number]) {
    setModules((current) =>
      current.map((module, moduleIndex) => (moduleIndex === index ? next : module)),
    );
  }

  function addLesson(moduleIndex: number) {
    setModules((current) =>
      current.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: [...module.lessons, createLesson('text')],
            }
          : module,
      ),
    );
  }

  function moveModule(moduleIndex: number, direction: -1 | 1) {
    setModules((current) => {
      if (moduleIndex < 0 || moduleIndex >= current.length) return current;
      const nextIndex = moduleIndex + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [movedModule] = next.splice(moduleIndex, 1);
      if (!movedModule) return current;
      next.splice(nextIndex, 0, movedModule);
      return next;
    });
  }

  function moveLesson(moduleIndex: number, lessonIndex: number, direction: -1 | 1) {
    setModules((current) =>
      current.map((module, index) => {
        if (index !== moduleIndex) return module;
        const lessons = [...module.lessons];
        const nextIndex = lessonIndex + direction;
        if (lessonIndex < 0 || nextIndex < 0 || nextIndex >= lessons.length) return module;
        const [movedLesson] = lessons.splice(lessonIndex, 1);
        if (!movedLesson) return module;
        lessons.splice(nextIndex, 0, movedLesson);
        return { ...module, lessons };
      }),
    );
  }

  function updateLesson(moduleIndex: number, lessonIndex: number, nextLesson: CourseLesson) {
    const currentModule = modules[moduleIndex];
    if (!currentModule) return;
    const nextModule = { ...currentModule, lessons: [...currentModule.lessons] };
    nextModule.lessons[lessonIndex] = nextLesson;
    updateModule(moduleIndex, nextModule);
  }

  function addQuizOption(moduleIndex: number, lessonIndex: number) {
    const lesson = modules[moduleIndex]?.lessons[lessonIndex];
    if (!lesson || lesson.kind !== 'quiz') return;

    const nextOptions = [
      ...(lesson.options ?? ['Option 1', 'Option 2']),
      `Option ${(lesson.options?.length ?? 2) + 1}`,
    ];
    updateLesson(moduleIndex, lessonIndex, {
      ...lesson,
      options: nextOptions,
      correctAnswer: lesson.correctAnswer ?? nextOptions[0],
    });
  }

  function renderLessonFields(moduleIndex: number, lessonIndex: number, lesson: CourseLesson) {
    const setLesson = (next: CourseLesson) => updateLesson(moduleIndex, lessonIndex, next);

    switch (lesson.kind) {
      case 'text':
        return (
          <div className="field-group">
            <label htmlFor={`lesson-content-${lesson.id}`}>Lesson text</label>
            <textarea
              id={`lesson-content-${lesson.id}`}
              value={lesson.content ?? ''}
              rows={4}
              onChange={(event) => setLesson({ ...lesson, content: event.target.value })}
            />
          </div>
        );
      case 'video':
      case 'image':
      case 'resource':
        return (
          <>
            <div className="field-group">
              <label htmlFor={`lesson-media-${lesson.id}`}>
                {lesson.kind === 'image' && (
                  <div className="field-group">
                    <label htmlFor={`alt-${lesson.id}`}>Image description</label>
                    <input
                      id={`alt-${lesson.id}`}
                      value={lesson.alt ?? ''}
                      maxLength={240}
                      onChange={(event) => setLesson({ ...lesson, alt: event.target.value })}
                    />
                  </div>
                )}
                {lesson.kind === 'resource'
                  ? 'Resource URL'
                  : lesson.kind === 'image'
                    ? 'Image URL'
                    : 'Video URL'}
              </label>
              <input
                id={`lesson-media-${lesson.id}`}
                value={lesson.mediaUrl ?? ''}
                onChange={(event) => setLesson({ ...lesson, mediaUrl: event.target.value })}
              />
            </div>
            <div className="field-group">
              <label htmlFor={`lesson-resource-${lesson.id}`}>
                {lesson.kind === 'resource' ? 'Resource title' : 'Caption'}
              </label>
              <input
                id={`lesson-resource-${lesson.id}`}
                value={lesson.resourceTitle ?? lesson.title}
                onChange={(event) => setLesson({ ...lesson, resourceTitle: event.target.value })}
              />
            </div>
          </>
        );
      case 'quiz':
        return (
          <>
            <div className="field-group">
              <label htmlFor={`lesson-question-${lesson.id}`}>Question</label>
              <textarea
                id={`lesson-question-${lesson.id}`}
                value={lesson.question ?? ''}
                rows={3}
                onChange={(event) => setLesson({ ...lesson, question: event.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Answer options</label>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {(lesson.options ?? ['Option 1', 'Option 2']).map((option, optionIndex) => (
                  <div
                    key={`${lesson.id}-option-${optionIndex}`}
                    style={{ display: 'flex', gap: '0.5rem' }}
                  >
                    <input
                      value={option}
                      onChange={(event) => {
                        const nextOptions = [...(lesson.options ?? ['Option 1', 'Option 2'])];
                        nextOptions[optionIndex] = event.target.value;
                        setLesson({
                          ...lesson,
                          options: nextOptions,
                          correctAnswer: lesson.correctAnswer ?? nextOptions[0],
                        });
                      }}
                    />
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => {
                        const nextOptions = [...(lesson.options ?? ['Option 1', 'Option 2'])];
                        nextOptions.splice(optionIndex, 1);
                        setLesson({
                          ...lesson,
                          options: nextOptions,
                          correctAnswer: nextOptions.includes(lesson.correctAnswer ?? '')
                            ? lesson.correctAnswer
                            : nextOptions[0],
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="button secondary"
                onClick={() => addQuizOption(moduleIndex, lessonIndex)}
              >
                Add option
              </button>
            </div>

            <div className="field-group">
              <label htmlFor={`lesson-answer-${lesson.id}`}>Correct answer</label>
              <select
                id={`lesson-answer-${lesson.id}`}
                value={lesson.correctAnswer ?? lesson.options?.[0] ?? ''}
                onChange={(event) => setLesson({ ...lesson, correctAnswer: event.target.value })}
              >
                {(lesson.options ?? ['Option 1', 'Option 2']).map((option) => (
                  <option key={`${lesson.id}-answer-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case 'reflection':
      case 'checkpoint':
        return (
          <div className="field-group">
            <label htmlFor={`lesson-prompt-${lesson.id}`}>
              {lesson.kind === 'reflection' ? 'Reflection prompt' : 'Checkpoint prompt'}
            </label>
            <textarea
              id={`lesson-prompt-${lesson.id}`}
              value={lesson.prompt ?? ''}
              rows={3}
              onChange={(event) => setLesson({ ...lesson, prompt: event.target.value })}
            />
          </div>
        );
      default:
        return null;
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);

    const result = await saveCourseOutline(courseId, { modules });
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setAutosaveState('saved');
    router.refresh();
  }

  async function handleSubmitForReview() {
    setError('');
    setBusy(true);
    setSubmitState('idle');

    const saved = await saveCourseOutline(courseId, { modules });
    if (!saved.ok) {
      setBusy(false);
      setError(saved.error);
      return;
    }
    const result = await submitCourseForReview(courseId);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      setSubmitState('error');
      return;
    }

    setSubmitState('success');
    router.refresh();
  }

  const checklist = {
    title: title.trim().length >= 3,
    summary: summary.trim().length >= 20,
    modules: modules.length > 0,
    lessons: modules.every((module) => module.lessons.length > 0),
  };

  return (
    <form className="auth-form" style={{ maxWidth: 820 }} onSubmit={onSubmit} noValidate>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="module-card" style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0 }}>Review checklist</h3>
          <span className="chip chip-muted">
            {autosaveState === 'saving'
              ? 'Autosaving…'
              : autosaveState === 'saved'
                ? 'Saved'
                : 'Draft'}
          </span>
        </div>
        <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', display: 'grid', gap: '0.4rem' }}>
          <li>{checklist.title ? '✅' : '⬜'} Course title is filled in</li>
          <li>{checklist.summary ? '✅' : '⬜'} Summary is at least 20 characters</li>
          <li>{checklist.modules ? '✅' : '⬜'} At least one module is added</li>
          <li>{checklist.lessons ? '✅' : '⬜'} Every module has at least one lesson</li>
        </ul>
      </div>

      {modules.length === 0 ? (
        <div className="notice">
          <Sparkles size={22} aria-hidden="true" />
          <div>
            <h3>No modules yet</h3>
            <p>Add your first module to begin building the course outline.</p>
          </div>
        </div>
      ) : null}

      {modules.map((module, moduleIndex) => (
        <div
          key={module.id}
          className="module-card"
          style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}
        >
          <div className="field-group">
            <label htmlFor={`module-${module.id}`}>Module title</label>
            <input
              id={`module-${module.id}`}
              value={module.title}
              onChange={(event) =>
                updateModule(moduleIndex, {
                  ...module,
                  title: event.target.value,
                })
              }
            />
          </div>

          <div
            className="portal-actions"
            style={{ justifyContent: 'flex-start', flexWrap: 'wrap', marginBottom: '0.75rem' }}
          >
            <button
              type="button"
              className="button secondary"
              onClick={() => moveModule(moduleIndex, -1)}
              disabled={moduleIndex === 0}
            >
              Move module up
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => moveModule(moduleIndex, 1)}
              disabled={moduleIndex === modules.length - 1}
            >
              Move module down
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {module.lessons.map((lesson, lessonIndex) => (
              <div
                key={lesson.id}
                style={{
                  border: '1px solid var(--border)',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  marginBottom: '0.75rem',
                }}
              >
                <div className="field-group">
                  <label htmlFor={`lesson-title-${lesson.id}`}>Lesson title</label>
                  <input
                    id={`lesson-title-${lesson.id}`}
                    value={lesson.title}
                    onChange={(event) => {
                      const nextLessons = [...module.lessons];
                      nextLessons[lessonIndex] = { ...lesson, title: event.target.value };
                      updateModule(moduleIndex, { ...module, lessons: nextLessons });
                    }}
                  />
                </div>

                <div
                  className="portal-actions"
                  style={{
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    marginBottom: '0.75rem',
                  }}
                >
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => moveLesson(moduleIndex, lessonIndex, -1)}
                    disabled={lessonIndex === 0}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => moveLesson(moduleIndex, lessonIndex, 1)}
                    disabled={lessonIndex === module.lessons.length - 1}
                  >
                    Move down
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="field-group">
                    <label htmlFor={`lesson-kind-${lesson.id}`}>Format</label>
                    <select
                      id={`lesson-kind-${lesson.id}`}
                      value={lesson.kind}
                      onChange={(event) => {
                        const nextLesson = createLesson(event.target.value as CourseLesson['kind']);
                        updateLesson(moduleIndex, lessonIndex, {
                          ...nextLesson,
                          id: lesson.id,
                          title: lesson.title,
                          duration: lesson.duration,
                        });
                      }}
                    >
                      {lessonKindOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group">
                    <label htmlFor={`lesson-duration-${lesson.id}`}>Duration</label>
                    <input
                      id={`lesson-duration-${lesson.id}`}
                      value={lesson.duration}
                      onChange={(event) => {
                        const nextLessons = [...module.lessons];
                        nextLessons[lessonIndex] = { ...lesson, duration: event.target.value };
                        updateModule(moduleIndex, { ...module, lessons: nextLessons });
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  {renderLessonFields(moduleIndex, lessonIndex, lesson)}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="button secondary"
              onClick={() => addLesson(moduleIndex)}
            >
              <Plus size={18} aria-hidden="true" />
              Add lesson
            </button>
          </div>
        </div>
      ))}

      <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <button type="button" className="button secondary" onClick={addModule}>
          <Plus size={18} aria-hidden="true" />
          Add module
        </button>
        <button type="submit" className="button primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save outline'}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={
            busy ||
            !checklist.title ||
            !checklist.summary ||
            !checklist.modules ||
            !checklist.lessons
          }
          onClick={handleSubmitForReview}
        >
          Submit for review
        </button>
        <Link href="/creator/drafts" className="button secondary" aria-label="Back to drafts">
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Link>
      </div>
      <div className="module-card" style={{ padding: '1rem 1.25rem', marginTop: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Student preview</h3>
        {modules.length === 0 ? (
          <p>No modules yet. Add a module to preview the learner journey.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {modules.map((module, moduleIndex) => (
              <div
                key={`preview-${module.id}`}
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
                  {module.lessons.map((lesson, lessonIndex) => (
                    <li key={`preview-${lesson.id}`}>
                      <h5>
                        {lessonIndex + 1}. {lesson.title || 'Untitled lesson'}
                      </h5>
                      <LessonContent key={lesson.id + lesson.kind} lesson={lesson} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {submitState === 'success' && (
        <p className="admin-row-status" role="status">
          Draft submitted for review.
        </p>
      )}
    </form>
  );
}
