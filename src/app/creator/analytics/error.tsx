'use client';

import Link from 'next/link';

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <section className="site-container section">
      <div role="alert">
        <h1 className="detail-title">Analytics are unavailable right now</h1>
        <p>Please try again, or open the first page of your course analytics.</p>
      </div>
      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        <button type="button" className="button primary" onClick={retry}>
          Try again
        </button>
        <Link className="button secondary" href="/creator/analytics">
          First analytics page
        </Link>
        <Link className="button secondary" href="/creator">
          Back to studio
        </Link>
      </div>
    </section>
  );
}
