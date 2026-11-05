'use client';

import { useId, useState } from 'react';
import { checkSort, type SortActivity } from '@/lib/course/activities';

export function SortPlayer({ activity }: { activity: SortActivity }) {
  const id = useId();
  const [answers, setAnswers] = useState<string[]>(() => activity.items.map(() => ''));
  const [checked, setChecked] = useState(false);
  const result = checkSort(activity, answers);
  return (
    <div className="course-activity">
      <p>Choose a group for each item. Take your time.</p>
      {activity.items.map((item, index) => (
        <div className="field-group" key={`${index}-${item.label}`}>
          <label htmlFor={`${id}-${index}`}>{item.label}</label>
          <select
            id={`${id}-${index}`}
            value={answers[index] ?? ''}
            onChange={(event) => {
              setAnswers((current) =>
                current.map((value, position) => (position === index ? event.target.value : value)),
              );
              setChecked(false);
            }}
          >
            <option value="">Choose a group</option>
            {activity.buckets.map((bucket) => (
              <option key={bucket} value={bucket}>
                {bucket}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        type="button"
        className="button secondary"
        disabled={result.answered !== result.total}
        onClick={() => setChecked(true)}
      >
        Check groups
      </button>
      <p role="status">
        {checked
          ? result.allCorrect
            ? '✓ Every item is in the right group. Well done!'
            : `${result.correct} of ${result.total} items are in the right group. Try another group for the others.`
          : ''}
      </p>
      {checked && !result.allCorrect && (
        <ul>
          {activity.items.map((item, index) => (
            <li key={index}>
              {item.label}: {answers[index] === item.bucket ? 'Correct' : 'Try another group'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
