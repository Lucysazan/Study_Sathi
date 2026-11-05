import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { LearningArt } from './LearningArt';

export function HomeHero() {
  return (
    <section className="hero site-container">
      <div className="hero-copy">
        <div className="eyebrow">
          <span /> FREE LEARNING. SHARED POSSIBILITIES.
        </div>
        <h1>
          Learn, Explore,
          <br />
          <span>Grow Together.</span>
          <svg viewBox="0 0 390 15" aria-hidden="true">
            <path
              d="M3 10Q190-4 384 8"
              fill="none"
              style={{ stroke: 'var(--accent)' }}
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </h1>
        <p>
          Discover free educational resources, build useful skills, and explore new ways to learn —
          all in one place.
        </p>
        <div className="hero-buttons">
          <Link className="button" href="/resources">
            Explore Resources <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className="button secondary" href="/safety-mission">
            Try Safety Mission <BookOpen size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="hero-notes">
          {['Always free', 'No account needed', 'Made for Nepal'].map((note) => (
            <span key={note}>
              <CheckCircle2 size={16} aria-hidden="true" /> {note}
            </span>
          ))}
        </div>
      </div>
      <LearningArt />
    </section>
  );
}
