'use client';

import { useId } from 'react';
import type { BudgetActivity } from '@/lib/course/activities';

export function BudgetEditor({
  value,
  onChange,
}: {
  value: BudgetActivity;
  onChange: (next: BudgetActivity) => void;
}) {
  const id = useId();
  return (
    <div className="course-activity">
      <div className="field-group">
        <label htmlFor={`${id}-total`}>Imaginary budget total (NPR)</label>
        <input
          id={`${id}-total`}
          type="number"
          min={1}
          max={1000000}
          step={1}
          value={value.total}
          onChange={(event) => onChange({ ...value, total: Number(event.target.value) })}
        />
      </div>
      {value.categories.map((category, index) => (
        <div className="field-group" key={index}>
          <label htmlFor={`${id}-${index}`}>Category {index + 1}</label>
          <input
            id={`${id}-${index}`}
            maxLength={100}
            value={category}
            onChange={(event) =>
              onChange({
                ...value,
                categories: value.categories.map((name, position) =>
                  position === index ? event.target.value : name,
                ),
              })
            }
          />
          <button
            type="button"
            className="button secondary"
            disabled={value.categories.length <= 2}
            onClick={() =>
              onChange({
                ...value,
                categories: value.categories.filter((_, position) => position !== index),
              })
            }
          >
            Remove category {index + 1}
          </button>
        </div>
      ))}
      <button
        type="button"
        className="button secondary"
        disabled={value.categories.length >= 6}
        onClick={() =>
          onChange({
            ...value,
            categories: [...value.categories, `Category ${value.categories.length + 1}`],
          })
        }
      >
        Add category
      </button>
    </div>
  );
}
