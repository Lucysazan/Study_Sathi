'use client';
import { useState } from 'react';
export function SetExplorer() {
  const [mode, setMode] = useState<'union' | 'intersection'>('union');
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const expected = mode === 'union' ? [1, 2, 3, 4, 5] : [3];
  const correct =
    selected.length === expected.length && expected.every((n) => selected.includes(n));
  return (
    <section className="study-tools">
      <h2>Explore sets</h2>
      <p>
        A = {'{1, 2, 3}'} and B = {'{3, 4, 5}'}. Select the numbers in their {mode}.
      </p>
      <label>
        Set operation
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as 'union' | 'intersection');
            setSelected([]);
            setChecked(false);
          }}
        >
          <option value="union">Union — in either set</option>
          <option value="intersection">Intersection — in both sets</option>
        </select>
      </label>
      <div className="academic-actions">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            className="button secondary"
            aria-pressed={selected.includes(n)}
            aria-label={'Select number ' + n}
            onClick={() => {
              setSelected(
                selected.includes(n) ? selected.filter((v) => v !== n) : [...selected, n],
              );
              setChecked(false);
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <button className="button" onClick={() => setChecked(true)}>
        Check set selection
      </button>
      {checked && (
        <p role="status">
          {correct ? 'Correct! ' : 'Try again. '}
          {mode === 'union'
            ? 'Union includes every number in A or B; 6 is in neither.'
            : 'Intersection includes only the number shared by A and B: 3.'}
        </p>
      )}
      <p>Original exploratory activity. No marks or XP are recorded. Teacher review pending.</p>
    </section>
  );
}
