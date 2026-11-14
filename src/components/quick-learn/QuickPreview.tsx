import Link from 'next/link';
export function QuickPreview() {
  return (
    <section className="site-container section">
      <div className="quick-home-preview">
        <div>
          <div className="eyebrow">SMALL IDEAS. BIG CURIOSITY.</div>
          <h2>
            Quick Learn{' '}
            <span lang="ne">/ {'\u091b\u094b\u091f\u094b \u0938\u093f\u0915\u093e\u0907'}</span>
          </h2>
          <p>
            Selected educational YouTube Shorts in Nepali and English. Watch, try a little question
            and explore further. Pause for a recap after five.
          </p>
          <Link className="button" href="/quick-learn">
            Explore Quick Learn
          </Link>
        </div>
        <div className="quick-preview-phone" aria-hidden="true">
          <span className="quick-play-mark" />
          <strong>One little idea</strong>
          <small>Watch / Wonder / Explore</small>
        </div>
      </div>
    </section>
  );
}
