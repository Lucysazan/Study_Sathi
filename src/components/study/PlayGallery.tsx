'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { GamePreview } from './GamePreview';
type Item = {
  id: string;
  title: string;
  subject: string;
  ages: string;
  simulation?: string;
  widget?: string;
};
const names: Record<string, string> = {
  fractions: 'Pizza fractions',
  balance: 'Find the balance',
  circuits: 'Light it up!',
  budget: 'Pocket money',
  'digital-safety': 'Code protector',
  waste: 'Planet helpers',
  reading: 'Story detective',
  'study-habits': 'Build a study streak',
};
const filters = ['All activities', 'Maths', 'Science', 'Everyday skills'];
export function PlayGallery({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('All activities');
  const shown = items.filter(
    (a) =>
      filter === 'All activities' ||
      (filter === 'Maths' && a.subject === 'Mathematics') ||
      (filter === 'Science' && a.subject === 'Science') ||
      (filter === 'Everyday skills' && !['Science', 'Mathematics'].includes(a.subject)),
  );
  return (
    <>
      <section className="play-hero">
        <div className="play-hero-copy">
          <span className="play-kicker">
            <Gamepad2 size={19} aria-hidden="true" /> YOUR LITTLE DISCOVERY ZONE
          </span>
          <h1>
            Play and <span>Learn</span>
          </h1>
          <p>Pick something fun. Tap, explore, and see what happens.</p>
          <div className="play-hero-actions">
            <Link href="/play/progress" prefetch={false}>
              <Trophy size={18} aria-hidden="true" /> My progress
            </Link>
            <Link href="/learn/leaderboard">
              <Sparkles size={18} aria-hidden="true" /> Friendly leaderboard
            </Link>
          </div>
        </div>
        <div className="hero-demo">
          <span className="hero-demo-label">Go on, add a slice!</span>
          <GamePreview id="fractions" />
        </div>
        <span className="play-hero-star" aria-hidden="true">
          ✦
        </span>
      </section>
      <div className="play-choose">
        <h2>What will you try today?</h2>
        <div className="play-filters" aria-label="Choose activity subject">
          {filters.map((f) => (
            <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status">
        {shown.length} activities shown
      </p>
      <div className="play-gallery">
        {shown.map((a) => (
          <article className={'play-tile tile-' + a.id} key={a.id}>
            <div className="tile-picture">
              <span className="tile-kind">
                {a.simulation ? 'Simulation' : a.widget ? 'Quick play' : 'Guided practice'}
              </span>
              <GamePreview id={a.id} />
            </div>
            <div className="tile-copy">
              <span className="tile-subject">{a.subject}</span>
              <h2>{names[a.id] || a.title}</h2>
              <p>{a.ages}</p>
              <Link
                className="tile-play"
                href={'/play/' + a.id}
                prefetch={false}
                aria-label={'Start ' + a.title}
              >
                {a.simulation || a.widget ? "Let's play" : "Let's try"}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="play-bottom">
        <Gamepad2 aria-hidden="true" />
        <p>
          These little previews are yours to try. Open an activity for the full game. Questions are
          optional.
        </p>
        <Link href="/study">
          Textbooks & videos <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
