'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
type RecordEntry = {
  best: number;
  last: number;
  total: number;
  attempts: number;
  completedAt: string | null;
};
export function StudyProgress({ items }: { items: { id: string; title: string }[] }) {
  const [data, setData] = useState<{
      uid: string | null;
      results: Record<string, RecordEntry>;
    } | null>(null),
    [error, setError] = useState('');
  useEffect(() => {
    const c = new AbortController();
    fetch('/api/study', { cache: 'no-store', signal: c.signal })
      .then(async (r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setData)
      .catch(() => {
        if (!c.signal.aborted) setError('Progress is unavailable. Reload to try again.');
      });
    return () => c.abort();
  }, []);
  return (
    <section className="study-tools">
      <h2>Your activity progress</h2>
      {error ? (
        <p role="alert">{error}</p>
      ) : !data ? (
        <p role="status">Loading progress…</p>
      ) : !data.uid ? (
        <p>
          Guest checks are visit-only. <Link href="/login">Sign in as a student</Link> to save
          results and earn rewards.
        </p>
      ) : (
        <>
          <p>
            {Object.values(data.results).filter((r) => r.completedAt).length} of {items.length}{' '}
            learning checks completed. A completed check means all questions were answered correctly
            at least once.
          </p>
          <ul>
            {items.map((item) => {
              const r = data.results[item.id];
              return (
                <li key={item.id}>
                  <Link href={'/play/' + item.id} prefetch={false}>
                    {item.title}
                  </Link>{' '}
                  —{' '}
                  {r
                    ? `Best ${r.best}/${r.total} · Latest ${r.last}/${r.total} · ${r.attempts} checks · ${r.completedAt ? 'Completed' : 'Keep practising'}`
                    : 'Not checked yet'}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
