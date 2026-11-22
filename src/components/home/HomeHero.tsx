import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ReaderArt } from '@/components/art/ReaderArt';

const WORD = 'Curiosity';

/** Home hero: a single "title slide" — illustration, giant word, vertical tagline, colour block. */
export function HomeHero() {
  return (
    <section className="deck-hero" aria-labelledby="hero-title">
      <div className="slide hero-slide" data-tilt>
        <div className="hero-side">
          <p className="serif-pair">
            Free learning,
            <br />
            community at heart
          </p>
          <p className="hero-lede">
            Textbooks, video lessons and playful activities for curious minds in Nepal. Learn at
            your own pace.
          </p>
          <div className="hero-actions">
            <Link className="ink-button" href="#choose-class">
              Find my class
            </Link>
            <Link className="line-link" href="/play">
              Play and learn
            </Link>
          </div>
          <ul className="hero-facts">
            <li>Free to explore</li>
            <li>No sign-up to start</li>
            <li>Classes 1–12</li>
          </ul>
        </div>

        <div className="hero-stage">
          <div className="hero-art" data-eyes>
            <ReaderArt />
          </div>
          <span className="monogram" aria-hidden="true">
            S
          </span>
          <h1 id="hero-title" className="hero-word">
            <span aria-hidden="true">
              {WORD.split('').map((ch, i) => (
                <span key={i} style={{ '--i': i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
            <span className="sr-only">Curiosity: free learning for curious minds in Nepal</span>
          </h1>
        </div>

        <p className="hero-vertical" aria-hidden="true">
          <span>Learn. Explore.</span>
          <span>Grow together.</span>
        </p>
        <span className="hero-block" aria-hidden="true" />
      </div>
    </section>
  );
}
