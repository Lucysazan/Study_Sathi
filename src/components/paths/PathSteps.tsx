'use client';

import { ArrowRight, ArrowUpRight, Check, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { saveNote, toggleStepComplete, useNotes, useProgress } from '@/lib/storage/guest-data';
import type { LearningPath } from '@/types/catalog';
import { BudgetActivity } from './BudgetActivity';

/**
 * Progress panel, numbered steps and completion message for one path.
 * Progress and notes are saved in this browser (keys "<pathId>-<stepIndex>", as in the prototype).
 */
export function PathSteps({
  path,
  resourceTitles,
}: {
  path: LearningPath;
  /** Titles of linked resources, by resource ID (looked up on the server). */
  resourceTitles: Readonly<Record<string, string>>;
}) {
  const complete = useProgress();
  const notes = useNotes();
  const [error, setError] = useState('');

  const total = path.steps.length;
  const keys = path.steps.map((_, i) => `${path.id}-${i}`);
  const count = keys.filter((k) => complete.includes(k)).length;

  function mark(key: string) {
    if (!toggleStepComplete(key)) {
      setError('Progress is available for this visit, but your browser could not save it.');
    }
  }

  function note(key: string, value: string) {
    if (!saveNote(key, value)) setError('Your browser could not save your notes.');
  }

  return (
    <>
      <div className="progress-panel">
        <div>
          <strong>Your learning journey</strong>
          <span>
            {count} of {total} steps complete
          </span>
        </div>
        <progress max={total} value={count} aria-label="Learning path progress" />
        <p>
          <Lightbulb size={17} aria-hidden="true" />
          {path.goal}
        </p>
      </div>
      <nav className="trail-map" aria-label="Your learning roadmap">
        {path.steps.map((step, i) => (
          <a
            key={keys[i]}
            href={`#trail-step-${i}`}
            className={complete.includes(keys[i]!) ? 'trail-stop done' : 'trail-stop'}
          >
            <span>
              {complete.includes(keys[i]!) ? <Check aria-label="Complete" size={22} /> : i + 1}
            </span>
            <strong>{step.title}</strong>
            <small>{complete.includes(keys[i]!) ? 'Done - revisit' : 'Explore this step'}</small>
          </a>
        ))}
      </nav>
      {error && <p role="alert">{error}</p>}
      <div className="steps">
        {path.steps.map((s, i) => {
          const key = keys[i] ?? `${path.id}-${i}`;
          const done = complete.includes(key);
          const resourceTitle = s.resource ? resourceTitles[s.resource] : undefined;
          return (
            <article id={`trail-step-${i}`} className={done ? 'step complete' : 'step'} key={key}>
              <span className="step-number" aria-hidden="true">
                {done ? <Check size={19} /> : i + 1}
              </span>
              <div className="step-main">
                <div className="eyebrow">STEP {String(i + 1).padStart(2, '0')}</div>
                <h2>{s.title}</h2>
                <p>{s.description}</p>
                {s.resource && resourceTitle && (
                  <Link className="text-link" href={`/resources/${s.resource}`}>
                    {resourceTitle}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                )}
                {s.prompt && (
                  <label className="reflection-label">
                    {s.prompt}
                    <textarea
                      placeholder="Keep a note for yourself…"
                      value={notes[key] ?? ''}
                      onChange={(e) => note(key, e.target.value)}
                    />
                    <small>Saved in this browser. Avoid including personal information.</small>
                  </label>
                )}
                {s.budget && (
                  <BudgetActivity value={notes[key] ?? ''} onChange={(v) => note(key, v)} />
                )}
                <button
                  type="button"
                  className={done ? 'button secondary' : 'button'}
                  aria-pressed={done}
                  onClick={() => mark(key)}
                >
                  <CheckCircle2 size={17} aria-hidden="true" />
                  {done ? 'Complete · Undo' : 'Mark Step Complete'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {count === total && (
        <div className="completion" role="status">
          <Sparkles size={28} aria-hidden="true" />
          <h2>You made time to discover something new.</h2>
          <p>Keep practicing, ask questions, and explore your next interest.</p>
          <Link className="button" href="/learning-paths">
            Explore another path <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}
