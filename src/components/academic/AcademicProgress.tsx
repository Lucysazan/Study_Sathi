'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { SavedAcademicResult } from '@/lib/academic/practice';

export function AcademicProgress() {
  const [state, setState] = useState<{
    uid: string | null;
    results: Record<string, SavedAcademicResult>;
  } | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/academic/progress', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(setState)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, []);
  if (error) return <p role="status">Saved practice could not be loaded. Refresh to try again.</p>;
  if (!state) return <p role="status">Loading saved practice…</p>;
  if (!state.uid)
    return (
      <p>
        You can practise without an account.{' '}
        <Link href="/login?next=%2Fstudy%2F9%2Fmathematics">Student login</Link> saves future
        results across devices.
      </p>
    );
  const results = Object.values(state.results);
  return (
    <div className="learning-card">
      <h2>Your saved practice</h2>
      {results.length === 0 ? (
        <p>Complete a topic check to begin your revision plan.</p>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={`${result.chapterId}-${result.phase}`}>
              <Link href={`/study/9/mathematics/${encodeURIComponent(result.chapterId)}#practice`}>
                {result.chapterId.replaceAll('-', ' ')} · {result.phase}
              </Link>
              : {result.correct}/{result.total}. Suggested review: {result.reviewAt.slice(0, 10)}{' '}
              (UTC).
            </li>
          ))}
        </ul>
      )}
      <p>
        Opening a page is not counted as understanding. Results describe short practice sets, not
        mastery.
      </p>
    </div>
  );
}
