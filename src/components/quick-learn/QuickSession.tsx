'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
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
  const [start, setStart] = useState(initial),
    [active, setActive] = useState(0),
    [breaking, setBreaking] = useState(false);
  const [started, setStarted] = useState<string[]>([]),
    [answered, setAnswered] = useState<string[]>([]);
  const [storageError, setStorageError] = useState('');
  const progress = useProgress(),
    marked = useRef(new Set<string>()),
    scroll = useRef<HTMLDivElement>(null);
  const batch = videos.slice(start, start + 5);
  function mark(id: string) {
    if (marked.current.has(id) || progress.includes(id)) return;
    marked.current.add(id);
    if (!toggleStepComplete(id)) {
      marked.current.delete(id);
      setStorageError('This result is available for this visit, but could not be saved.');
    }
  }
  function move(to: number) {
    const next = Math.max(0, Math.min(batch.length, to));
    scroll.current?.scrollTo({
      top: next * scroll.current.clientHeight,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }
  function another() {
    setStart(start + 5 < videos.length ? start + 5 : 0);
    setActive(0);
    setStarted([]);
    setAnswered([]);
    setBreaking(false);
    scroll.current?.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (breaking)
    return (
      <section className="quick-break" aria-label="Learning break">
        <h2>A little pause is part of learning.</h2>
        <p>
          Look away from the screen. Stretch, have some water, or tell someone one thing you
          discovered.
        </p>
        <div className="academic-actions">
          <Link className="button" href="/learning-paths">
            Explore a learning path
          </Link>
          <button className="button secondary" onClick={another}>
            Explore another five
          </button>
        </div>
      </section>
    );
  return (
    <section className="quick-session" aria-label="Five-short learning session">
      <div className="quick-controls">
        <button
          className="button secondary"
          disabled={active === 0}
          onClick={() => move(active - 1)}
        >
          Previous
        </button>
        <p role="status">
          {active < batch.length ? `Short ${active + 1} of ${batch.length}` : 'Your learning recap'}
        </p>
        <button
          className="button secondary"
          disabled={active === batch.length}
          onClick={() => move(active + 1)}
        >
          {active === batch.length - 1 ? 'Show recap' : 'Next'}
        </button>
      </div>
      <p className="quick-swipe-help">
        Swipe up or down beside the player. You can also use Previous and Next. Tap YouTube&apos;s
        play button to watch.
      </p>
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
            Math.min(batch.length, Math.max(0, Math.round(node.scrollTop / node.clientHeight))),
          );
        }}
      >
        {batch.map((v, i) => (
          <QuickCard
            key={v.videoId}
            video={v}
            active={i === active}
            index={i}
            total={batch.length}
            onStarted={() =>
              setStarted((list) => (list.includes(v.videoId) ? list : [...list, v.videoId]))
            }
            onFinished={() => mark(`quick-finished-${v.videoId}`)}
            onAnswer={(correct) => {
              setAnswered((list) => (list.includes(v.videoId) ? list : [...list, v.videoId]));
              if (correct) mark(`quick-check-${v.videoId}`);
            }}
          />
        ))}
        <article className="quick-recap" aria-label="Learning recap">
          <div className="eyebrow">A MOMENT TO REMEMBER</div>
          <h2>Your little learning recap</h2>
          <p>
            {started.length} videos started / {answered.length} questions tried
          </p>
          <p>
            Starting a video is not the same as finishing it. These are practice activities, not a
            test of mastery.
          </p>
          <ul>
            {batch.map((v) => (
              <li key={v.videoId}>
                {v.subject}: {v.objective}
              </li>
            ))}
          </ul>
          <div className="game-controls">
            <button className="button" onClick={() => setBreaking(true)}>
              Take a break
            </button>
            <button className="button secondary" onClick={another}>
              Explore another five
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
