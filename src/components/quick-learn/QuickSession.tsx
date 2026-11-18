'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import type { QuickVideo } from '@/lib/quick-learn/catalog';
import { useProgress, toggleStepComplete } from '@/lib/storage/guest-data';
import { QuickCard } from './QuickCard';
export function QuickSession({
  videos,
  initialId,
}: {
  videos: readonly QuickVideo[];
  initialId?: string;
}) {
  const initial = Math.max(
    0,
    videos.findIndex((v) => v.videoId === initialId),
  );
  const [active, setActive] = useState(initial);
  const [storageError, setStorageError] = useState('');
  const progress = useProgress(),
    soundRef = useRef({ muted: false }),
    marked = useRef(new Set<string>()),
    scroll = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = scroll.current;
    if (node) node.scrollTop = initial * node.clientHeight;
  }, [initial]);
  const batch = videos;
  function mark(id: string) {
    if (marked.current.has(id) || progress.includes(id)) return;
    marked.current.add(id);
    if (!toggleStepComplete(id)) {
      marked.current.delete(id);
      setStorageError('This result is available for this visit, but could not be saved.');
    }
  }
  function move(to: number) {
    const next = Math.max(0, Math.min(batch.length - 1, to));
    scroll.current?.scrollTo({
      top: next * scroll.current.clientHeight,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }
  return (
    <section className="quick-session" aria-label="Short learning videos">
      <div className="quick-controls">
        <button
          className="button secondary"
          disabled={active === 0}
          onClick={() => move(active - 1)}
        >
          Previous
        </button>
        <p className="sr-only" role="status">
          {batch[active]?.title}
        </p>
        <button
          className="button secondary"
          disabled={active === batch.length - 1}
          onClick={() => move(active + 1)}
        >
          Next
        </button>
      </div>
      {storageError && <p role="alert">{storageError}</p>}
      <div
        className="quick-feed"
        role="region"
        tabIndex={0}
        aria-label="Educational Shorts feed"
        ref={scroll}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            move(active + (event.key === 'ArrowDown' ? 1 : -1));
          }
        }}
        onScroll={(event) => {
          const node = event.currentTarget;
          setActive(
            Math.min(batch.length - 1, Math.max(0, Math.round(node.scrollTop / node.clientHeight))),
          );
        }}
      >
        {batch.map((v, i) => (
          <QuickCard
            key={v.videoId}
            video={v}
            soundRef={soundRef}
            active={i === active}
            onStarted={() => {}}
            onFinished={() => mark(`quick-finished-${v.videoId}`)}
            onAnswer={(correct) => {
              if (correct) mark(`quick-check-${v.videoId}`);
            }}
          />
        ))}
      </div>
    </section>
  );
}
