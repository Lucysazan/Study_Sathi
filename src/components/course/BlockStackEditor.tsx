'use client';

import type { ReactNode } from 'react';
import { courseLessonKinds, type CourseBlock } from '@/lib/course/draft';

export function BlockStackEditor({
  blocks,
  onChange,
  createBlock,
  renderFields,
}: {
  blocks: CourseBlock[];
  onChange: (next: CourseBlock[]) => void;
  createBlock: (kind: CourseBlock['kind']) => CourseBlock;
  renderFields: (block: CourseBlock, onChange: (next: CourseBlock) => void) => ReactNode;
}) {
  function update(index: number, next: CourseBlock) {
    onChange(blocks.map((block, position) => (position === index ? next : block)));
  }
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [block] = next.splice(index, 1);
    if (!block) return;
    next.splice(target, 0, block);
    onChange(next);
  }
  return (
    <div>
      <p>Activities appear in this order. The learner completes the whole lesson once.</p>
      {blocks.map((block, index) => (
        <fieldset className="lesson-block-editor" key={block.id}>
          <legend>Activity {index + 1}</legend>
          <div className="field-group">
            <label htmlFor={`block-title-${block.id}`}>Activity heading</label>
            <input
              id={`block-title-${block.id}`}
              maxLength={90}
              value={block.title}
              onChange={(event) => update(index, { ...block, title: event.target.value })}
            />
          </div>
          <div className="field-group">
            <label htmlFor={`block-kind-${block.id}`}>Activity format</label>
            <select
              id={`block-kind-${block.id}`}
              value={block.kind}
              onChange={(event) =>
                update(index, {
                  ...createBlock(event.target.value as CourseBlock['kind']),
                  id: block.id,
                  title: block.title,
                })
              }
            >
              {courseLessonKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {kind}
                </option>
              ))}
            </select>
          </div>
          {renderFields(block, (next) => update(index, next))}
          <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
            <button
              type="button"
              className="button secondary"
              aria-label={`Move activity ${index + 1} up`}
              disabled={index === 0}
              onClick={() => move(index, -1)}
            >
              Move up
            </button>
            <button
              type="button"
              className="button secondary"
              aria-label={`Move activity ${index + 1} down`}
              disabled={index === blocks.length - 1}
              onClick={() => move(index, 1)}
            >
              Move down
            </button>
            <button
              type="button"
              className="button secondary"
              disabled={blocks.length <= 1}
              onClick={() => onChange(blocks.filter((_, position) => position !== index))}
            >
              Remove activity {index + 1}
            </button>
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        className="button secondary"
        disabled={blocks.length >= 12}
        onClick={() => onChange([...blocks, createBlock('text')])}
      >
        Add activity
      </button>
    </div>
  );
}
