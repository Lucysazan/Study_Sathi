import Link from 'next/link';
import { PeekArt } from '@/components/art/PeekArt';

/** Part 03 of the home deck: Quick Learn, with a face peeking up from a marigold panel. */
export function QuickPreview() {
  return (
    <section className="part" aria-labelledby="quick-title">
      <div className="slide quick-slide" data-reveal>
        <div className="quick-copy">
          <span className="monogram small" aria-hidden="true">
            S
          </span>
          <p className="part-mark">
            <span>Part.</span>
            <strong>03</strong>
          </p>
          <h2 id="quick-title" className="serif-title">
            Quick Learn <span lang="ne">/ {'छोटो सिकाइ'}</span>
          </h2>
          <p className="slide-text">
            Selected educational YouTube Shorts in Nepali and English. Watch, try a little question
            and explore further.
          </p>
          <Link className="ink-button" href="/quick-learn">
            Explore Quick Learn
          </Link>
          <span className="block-mark block-marigold" aria-hidden="true" />
        </div>
        <div className="quick-panel" data-eyes>
          <PeekArt />
        </div>
      </div>
    </section>
  );
}
