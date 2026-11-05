'use client';

import { useId, useState, useTransition } from 'react';
import { submitQuiz, type QuizReceipt } from '@/app/learn/courses/quiz';
import type { CourseLessonLike } from '@/lib/course/learning';
import { badges } from '@/data/seed/badges';

export function QuizPlayer({
  quiz,
  courseId,
  lessonId,
}: {
  quiz: CourseLessonLike;
  courseId?: string;
  lessonId?: string;
}) {
  const id = useId();
  const [answer, setAnswer] = useState('');
  const [receipt, setReceipt] = useState<QuizReceipt | null>(null);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  function check() {
    if (!courseId) {
      setReceipt({ correct: answer === quiz.correctAnswer, xpAwarded: 0, newBadges: [] });
      return;
    }
    startTransition(async () => {
      setError('');
      try {
        const result = await submitQuiz({ courseId, lessonId, quizId: quiz.id, answer });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setReceipt(result.data);
      } catch {
        setError('We could not check your answer. Please try again.');
      }
    });
  }
  return (
    <div>
      <fieldset disabled={pending}>
        <legend>{quiz.question}</legend>
        {(quiz.options ?? []).map((option, index) => (
          <label className="lesson-choice" key={`${index}-${option}`}>
            <input
              type="radio"
              name={`${id}-answer`}
              value={option}
              checked={answer === option}
              onChange={() => {
                setAnswer(option);
                setReceipt(null);
                setError('');
              }}
            />
            {option}
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        className="button secondary"
        disabled={!answer || pending}
        onClick={check}
      >
        {pending ? 'Checking…' : 'Check answer'}
      </button>
      <p role="status">
        {error ||
          (receipt
            ? receipt.correct
              ? `✓ That’s right. Well done!${receipt.xpAwarded ? ` +${receipt.xpAwarded} XP` : ''}`
              : 'Try again. Read the lesson and choose another answer.'
            : '')}
      </p>
      {badges
        .filter((badge) => receipt?.newBadges.includes(badge.id))
        .map((badge) => (
          <p className="notice" role="status" key={badge.id}>
            New badge: {badge.name}
          </p>
        ))}
      {!courseId && <p>Preview only. No points are awarded.</p>}
    </div>
  );
}
