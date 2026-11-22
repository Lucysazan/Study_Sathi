import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BookOpen, BookOpenText, Gamepad2, Map, Sparkles } from 'lucide-react';
import { GamePreview } from '@/components/study/GamePreview';

const DOORS = [
  {
    href: '/study',
    title: 'My class corner',
    text: 'Choose a class. Find books and video lessons.',
    Icon: BookOpen,
    colour: 'cobalt',
    word: 'Read',
  },
  {
    href: '/play',
    title: 'Play and discover',
    text: 'Build, balance and explore with hands-on games.',
    Icon: Gamepad2,
    colour: 'grass',
    word: 'Play',
  },
  {
    href: '/learning-paths',
    title: 'Follow a trail',
    text: 'Small steps. A clear route. Go at your own pace.',
    Icon: Map,
    colour: 'marigold',
    word: 'Walk',
  },
  {
    href: '/resources',
    title: 'Curiosity corner',
    text: 'Explore English, nature, numbers and more.',
    Icon: Sparkles,
    colour: 'blush',
    word: 'Wonder',
  },
] as const;

/** Part 02 of the home deck: four doors into the site, then two "try it here" slides. */
export function DiscoveryGuide() {
  return (
    <section className="part part-discover" aria-labelledby="discover-title">
      <div className="slide discover-intro" data-reveal>
        <p className="vertical-word" aria-hidden="true">
          Discover
        </p>
        <div>
          <p className="part-mark">
            <span>Part.</span>
            <strong>02</strong>
          </p>
          <h2 id="discover-title" className="serif-title">
            Find what sparks your curiosity
          </h2>
          <p className="slide-text">
            Books, games and small discoveries. Every starting point is free.
          </p>
        </div>
      </div>

      <div className="door-grid">
        {DOORS.map(({ href, title, text, Icon, colour, word }, i) => (
          <Link
            key={href}
            href={href}
            className={`slide door door-${colour}`}
            data-reveal
            style={{ '--d': i } as CSSProperties}
          >
            <span className="door-bar" aria-hidden="true" />
            <span className="door-word" aria-hidden="true">
              {word}
            </span>
            <span className="door-icon">
              <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="door-go">Let&apos;s explore</span>
          </Link>
        ))}
      </div>

      <div className="try-row">
        <div className="slide try-slide try-story" data-reveal>
          <span className="try-glyph" aria-hidden="true">
            <BookOpenText size={54} strokeWidth={1.3} />
          </span>
          <h2 className="serif-title">A little English adventure</h2>
          <p className="slide-text">
            Read a short passage. Find the main idea. Try the reading activity right here.
          </p>
          <Link className="line-link" href="/play/reading">
            Be a story detective
          </Link>
          <span className="block-mark block-grass" aria-hidden="true" />
        </div>
        <div className="slide try-slide try-circuit" data-reveal>
          <div>
            <h2 className="serif-title">Can you make the bulb glow?</h2>
            <p className="slide-text">
              Tap the switch. Then open the full circuit game and build your own.
            </p>
            <Link className="ink-button" href="/play/circuits">
              Build a circuit
            </Link>
          </div>
          <GamePreview id="circuits" />
        </div>
      </div>
    </section>
  );
}
