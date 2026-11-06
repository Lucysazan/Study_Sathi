'use client';

import { useEffect, useRef, useState } from 'react';
import { PracticeFeedback } from './PracticeFeedback';
import type { PracticeResult } from '@/lib/academic/types';
import type { SavedAcademicResult } from '@/lib/academic/practice';

type PublicQuestion = { id: string; prompt: string; options: string[] };
type Props = {
  chapterId: string;
  skills: { id: string; title: string }[];
  questions: PublicQuestion[];
  followUp: PublicQuestion[];
};

export function AcademicPractice({ chapterId, skills, questions, followUp }: Props) {
  const [phase, setPhase] = useState<'check' | 'follow-up'>('check');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [saved, setSaved] = useState<SavedAcademicResult[]>([]);
  const [identity, setIdentity] = useState<{ uid: string | null } | null>(null);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const active = phase === 'check' ? questions : followUp;

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/academic/progress', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => {
        setIdentity({ uid: data.uid });
        setSaved(
          (Object.values(data.results) as SavedAcademicResult[]).filter(
            (r) => r.chapterId === chapterId,
          ),
        );
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError('Saved practice could not be loaded. Reload to try again.');
      });
    return () => controller.abort();
  }, [chapterId]);

  async function checkAnswers() {
    if (!identity || busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/academic/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, phase, answers, expectedUid: identity.uid }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Please try again.');
      setResult(data.result);
      setSaveMessage(data.saveMessage);
      setSavedSuccessfully(data.saved);
      requestAnimationFrame(() => feedback.current?.focus());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function start(next: 'check' | 'follow-up') {
    setPhase(next);
    setAnswers({});
    setResult(null);
    setSaveMessage('');
    setError('');
    requestAnimationFrame(() => heading.current?.focus());
  }

  return (
    <section className="academic-practice" aria-labelledby="practice-heading">
      <h2 id="practice-heading" tabIndex={-1} ref={heading}>
        {phase === 'check' ? 'Check your understanding' : 'Follow-up practice'}
      </h2>
      <p>
        Four questions, with explanations and a suggested next step. No XP is awarded for this
        pilot.
      </p>
      {saved.length > 0 && (
        <details>
          <summary>Your saved practice</summary>
          {saved.map((item) => (
            <p key={item.phase}>
              {item.phase === 'check' ? 'Chapter check' : 'Follow-up'}: {item.correct}/{item.total}{' '}
              · Checked {item.checkedAt.slice(0, 10)} · Suggested review{' '}
              {item.reviewAt.slice(0, 10)} (UTC)
            </p>
          ))}
          <p>These are practice results, not a mastery certificate.</p>
        </details>
      )}
      {!identity && !error && <p role="status">Loading your practice settings…</p>}
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}
      {active.map((q, index) => (
        <fieldset key={q.id} disabled={busy || !!result || !identity}>
          <legend>
            {index + 1}. {q.prompt}
          </legend>
          {q.options.map((option, value) => (
            <label className="academic-option" key={value}>
              <input
                type="radio"
                name={q.id}
                value={value}
                checked={answers[q.id] === value}
                onChange={() => setAnswers((previous) => ({ ...previous, [q.id]: value }))}
              />
              {option}
            </label>
          ))}
        </fieldset>
      ))}
      {!result && (
        <button
          className="button"
          disabled={busy || !identity || active.some((q) => answers[q.id] === undefined)}
          onClick={checkAnswers}
        >
          {busy ? 'Checking…' : 'Check answers'}
        </button>
      )}
      {result && (
        <div className="academic-feedback" ref={feedback} tabIndex={-1}>
          <PracticeFeedback result={result} skills={skills} saveMessage={saveMessage} />
          <div className="academic-actions">
            <button
              className="button"
              onClick={() => start(phase === 'check' ? 'follow-up' : 'check')}
            >
              {phase === 'check' ? 'Try follow-up practice' : 'Return to chapter check'}
            </button>
            {identity?.uid && !savedSuccessfully && (
              <button className="button secondary" disabled={busy} onClick={checkAnswers}>
                Retry saving result
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
