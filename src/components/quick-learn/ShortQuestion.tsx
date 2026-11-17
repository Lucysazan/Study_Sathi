'use client';
import { useState } from 'react';
import { AnswerEffect } from '@/components/accessibility/AnswerEffect';
import { ReadAloud } from '@/components/accessibility/ReadAloud';
import type { QuickVideo } from '@/lib/quick-learn/catalog';
export function ShortQuestion({
  video,
  onAnswer,
}: {
  video: QuickVideo;
  onAnswer: (correct: boolean) => void;
}) {
  const [choice, setChoice] = useState<number | null>(null),
    [checked, setChecked] = useState(false);
  return (
    <details className="quick-question">
      <summary>Try one question (optional)</summary>
      <ReadAloud text={video.question.prompt + ' ' + video.question.options.join('. ')} />
      {checked && <AnswerEffect success={choice === video.question.answer} attempt={1} />}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (choice === null) return;
          setChecked(true);
          onAnswer(choice === video.question.answer);
        }}
      >
        <fieldset>
          <legend>{video.question.prompt}</legend>
          {video.question.options.map((option, i) => (
            <label key={option}>
              <input
                type="radio"
                name={`q-${video.videoId}`}
                checked={choice === i}
                onChange={() => {
                  setChoice(i);
                  setChecked(false);
                }}
              />
              {option}
            </label>
          ))}
        </fieldset>
        <button className="button secondary" disabled={choice === null}>
          Check my answer
        </button>
        {checked && (
          <p role="status">
            <strong>
              {choice === video.question.answer ? 'You got it! ' : 'Have another look. '}
            </strong>
            {video.question.explanation}
          </p>
        )}
      </form>
    </details>
  );
}
