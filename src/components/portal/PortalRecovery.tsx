'use client';

import Link from 'next/link';

export function PortalRecovery({
  retry,
  href,
  label,
}: {
  retry: () => void;
  href: string;
  label: string;
}) {
  return (
    <section className="site-container section">
      <div role="alert">
        <h1 className="detail-title">This page could not load</h1>
        <p>Please try again, or return to your dashboard.</p>
      </div>
      <div className="portal-actions">
        <button type="button" className="button primary" onClick={retry}>
          Try again
        </button>
        <Link className="button secondary" href={href}>
          {label}
        </Link>
      </div>
    </section>
  );
}
