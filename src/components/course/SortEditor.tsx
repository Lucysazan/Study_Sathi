'use client';

import { useId } from 'react';
import type { SortActivity } from '@/lib/course/activities';

export function SortEditor({
  value,
  onChange,
}: {
  value: SortActivity;
  onChange: (next: SortActivity) => void;
}) {
  const id = useId();
  return (
    <div className="course-activity">
      <h4>Groups</h4>
      {value.buckets.map((bucket, index) => (
        <div className="field-group" key={index}>
          <label htmlFor={`${id}-group-${index}`}>Group {index + 1}</label>
          <input
            id={`${id}-group-${index}`}
            maxLength={100}
            value={bucket}
            onChange={(event) =>
              onChange({
                buckets: value.buckets.map((name, position) =>
                  position === index ? event.target.value : name,
                ),
                items: value.items.map((item) =>
                  item.bucket === bucket ? { ...item, bucket: event.target.value } : item,
                ),
              })
            }
          />
          <button
            type="button"
            className="button secondary"
            disabled={value.buckets.length <= 2}
            onClick={() =>
              onChange({
                buckets: value.buckets.filter((_, position) => position !== index),
                items: value.items.map((item) =>
                  item.bucket === bucket
                    ? { ...item, bucket: value.buckets.find((name) => name !== bucket) ?? '' }
                    : item,
                ),
              })
            }
          >
            Remove group {index + 1}
          </button>
        </div>
      ))}
      <button
        type="button"
        className="button secondary"
        disabled={value.buckets.length >= 6}
        onClick={() =>
          onChange({ ...value, buckets: [...value.buckets, `Group ${value.buckets.length + 1}`] })
        }
      >
        Add group
      </button>
      <h4>Items and correct groups</h4>
      {value.items.map((item, index) => (
        <div className="field-group" key={index}>
          <label htmlFor={`${id}-item-${index}`}>Item {index + 1}</label>
          <input
            id={`${id}-item-${index}`}
            maxLength={100}
            value={item.label}
            onChange={(event) =>
              onChange({
                ...value,
                items: value.items.map((entry, position) =>
                  position === index ? { ...entry, label: event.target.value } : entry,
                ),
              })
            }
          />
          <label htmlFor={`${id}-answer-${index}`}>Correct group for item {index + 1}</label>
          <select
            id={`${id}-answer-${index}`}
            value={item.bucket}
            onChange={(event) =>
              onChange({
                ...value,
                items: value.items.map((entry, position) =>
                  position === index ? { ...entry, bucket: event.target.value } : entry,
                ),
              })
            }
          >
            {value.buckets.map((bucket, position) => (
              <option key={position} value={bucket}>
                {bucket || 'Unnamed group'}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="button secondary"
            disabled={value.items.length <= 2}
            onClick={() =>
              onChange({ ...value, items: value.items.filter((_, position) => position !== index) })
            }
          >
            Remove item {index + 1}
          </button>
        </div>
      ))}
      <button
        type="button"
        className="button secondary"
        disabled={value.items.length >= 12}
        onClick={() =>
          onChange({
            ...value,
            items: [
              ...value.items,
              { label: `Item ${value.items.length + 1}`, bucket: value.buckets[0] ?? '' },
            ],
          })
        }
      >
        Add item
      </button>
    </div>
  );
}
