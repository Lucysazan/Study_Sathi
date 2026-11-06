import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { LearningArt } from './LearningArt';

export function HomeHero() {
  return (
    <section className="hero site-container">
      <div className="hero-copy">
        <div className="eyebrow">
          <span /> ACADEMIC LEARNING FOR NEPAL
        </div>
        <h1>
          Your class. Your subjects.
          <br />
          <span>Learn right here.</span>
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
          Find government textbooks and NCED Virtual teaching playlists for Classes 1–12. Read PDFs
          and watch subject lessons without leaving StudySathi.
        </p>
        <div className="hero-buttons">
          <Link className="button" href="/study">
            Start Academic Study <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className="button secondary" href="/learn">
            My Learning <BookOpen size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="hero-notes">
          {['Free to explore', 'Classes 1–12', 'Made for Nepal'].map((note) => (
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
