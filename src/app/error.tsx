'use client';

import Link from 'next/link';

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <section className="site-container section">
      <div role="alert">
        <h1 className="detail-title">This page could not load</h1>
        <p>Please try again. If it still does not work, return to the home page.</p>
      </div>
      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        <button type="button" className="button primary" onClick={retry}>
          Try again
        </button>
        <Link className="button secondary" href="/">
          Go home
        </Link>
      </div>
    </section>
  );
}
