import type { ReactNode } from 'react';
import { Motif, type MotifName } from '@/components/art/Motif';

export type Tone = 'cobalt' | 'grass' | 'marigold' | 'blush';

/** "LITTLE STEPS. NEW POSSIBILITIES." → "Little steps. New possibilities." */
function sentenceCase(text: string) {
  return text
    .toLowerCase()
    .replace(/(^|[.!?]\s+)([a-z])/g, (_, gap: string, ch: string) => gap + ch.toUpperCase());
}

/**
 * Title slide for inner pages (paper-deck design): serif kicker, big heading, intro, a painted
 * motif, a vertical word and a colour bar. `children` sit under the intro (e.g. a search box).
 */
export function PageTitle({
  eyebrow,
  title,
  intro,
  children,
  motif = 'books',
  word,
  tone = 'cobalt',
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  children?: ReactNode;
  motif?: MotifName;
  word?: string;
  tone?: Tone;
}) {
  return (
    <section className={`page-title page-hero tone-${tone}`} data-tilt>
      <div className="page-hero-slide slide">
        <span className="page-hero-bar" aria-hidden="true" />
        <div className="page-hero-copy">
          <p className="page-hero-kicker">{sentenceCase(eyebrow)}</p>
          <h1>{title}</h1>
          <div className="page-hero-intro">{intro}</div>
          {children}
        </div>
        <div className="page-hero-art">
          <Motif name={motif} />
        </div>
        {word && (
          <p className="page-hero-word" aria-hidden="true">
            {word}
          </p>
        )}
      </div>
    </section>
  );
}
