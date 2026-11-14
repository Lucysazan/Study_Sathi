'use client';
import { useState } from 'react';
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
