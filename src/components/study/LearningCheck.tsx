'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
type Result = {
  correct: number;
  total: number;
  feedback: { id: string; correct: boolean; answer: string; explanation: string }[];
};
export function LearningCheck({
  activityId,
  questions,
}: {
  activityId: string;
  questions: { id: string; prompt: string; options: string[] }[];
}) {
  const [identity, setIdentity] = useState<{ uid: string | null } | null>(null),
    [answers, setAnswers] = useState<Record<string, number>>({}),
    [result, setResult] = useState<Result | null>(null),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = new AbortController();
    fetch('/api/study', { cache: 'no-store', signal: c.signal })
      .then(async (r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((d) => setIdentity({ uid: d.uid }))
      .catch(() => {
        if (!c.signal.aborted) setError('Saved activity could not be loaded. Reload to try again.');
      });
    return () => c.abort();
  }, []);
  async function check() {
    if (!identity || busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, answers, expectedUid: identity.uid }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setResult(data.result);
      setMessage(data.message);
      requestAnimationFrame(() => feedback.current?.focus());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="study-tools learning-check" id="learning-check">
      <h2>Check what you learned</h2>
      <p>
        Answer all three questions correctly to complete this activity. The first perfect check
        earns 10 XP, plus the 5 XP daily bonus when eligible. Replays do not earn more XP. Opening a
        game or video does not earn points.
      </p>
      {!result ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void check();
          }}
        >
          {questions.map((q, i) => (
            <fieldset key={q.id}>
              <legend>
                {i + 1}. {q.prompt}
              </legend>
              {q.options.map((o, n) => (
                <label key={o}>
                  <input
                    type="radio"
                    name={q.id}
                    required
                    checked={answers[q.id] === n}
                    onChange={() => setAnswers({ ...answers, [q.id]: n })}
                    disabled={busy || !identity}
                  />
                  {o}
                </label>
              ))}
            </fieldset>
          ))}
          <button className="button" disabled={!identity || busy}>
            {busy ? 'Checking…' : 'Check learning'}
          </button>
        </form>
      ) : (
        <div ref={feedback} tabIndex={-1}>
          <h3>
            Your learning check: {result.correct}/{result.total}
          </h3>
          <p role="status">{message}</p>
          <ol>
            {result.feedback.map((f) => (
              <li key={f.id}>
                <strong>
                  {f.correct ? 'Correct' : 'Review'}: {f.answer}
                </strong>
                <p>{f.explanation}</p>
              </li>
            ))}
          </ol>
          {result.correct < result.total && (
            <p>
              Return to the simple explanation or try the activity again, then retry this check.
            </p>
          )}
          <button
            className="button secondary"
            onClick={() => {
              setResult(null);
              setAnswers({});
              setMessage('');
            }}
          >
            Try learning check again
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      <p>
        <Link href="/play/progress" prefetch={false}>
          My activity progress
        </Link>{' '}
        ·{' '}
        <Link href="/learn/leaderboard" prefetch={false}>
          Friendly leaderboard
        </Link>
      </p>
      <p>
        Leaderboard participation is optional and uses existing parent consent. Only nicknames are
        shown. These checks record practice performance, not certified mastery.
      </p>
    </section>
  );
}
