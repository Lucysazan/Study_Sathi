'use client';

import { useId, useState } from 'react';
import { checkBudget, type BudgetActivity } from '@/lib/course/activities';

export function BudgetPlayer({ activity }: { activity: BudgetActivity }) {
  const id = useId();
  const [values, setValues] = useState<string[]>(() => activity.categories.map(() => ''));
  const result = checkBudget(activity, values);
  return (
    <div className="course-activity">
      <p>
        Plan an imaginary NPR {activity.total} budget. Use whole rupees. You can choose how much
        goes in each category.
      </p>
      {activity.categories.map((category, index) => (
        <div className="field-group" key={`${index}-${category}`}>
          <label htmlFor={`${id}-${index}`}>{category} (NPR)</label>
          <input
            id={`${id}-${index}`}
            type="number"
            inputMode="numeric"
            min={0}
            max={activity.total}
            step={1}
            value={values[index] ?? ''}
            onChange={(event) =>
              setValues((current) =>
                current.map((value, position) => (position === index ? event.target.value : value)),
              )
            }
          />
        </div>
      ))}
      <p role="status">
        {result.balanced
          ? '✓ Your whole budget is planned!'
          : values.some((value) => value !== '') && !result.valid
            ? 'Fill every category with a whole number from 0 to the total budget.'
            : result.remaining < 0
              ? `You are NPR ${-result.remaining} over budget. Try adjusting your plan.`
              : `NPR ${result.remaining} left to plan.`}
      </p>
    </div>
  );
}
