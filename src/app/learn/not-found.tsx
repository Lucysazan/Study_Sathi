import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="site-container section">
      <h1 className="detail-title">This page is unavailable</h1>
      <p>It may have moved, or it may no longer be available to your account.</p>
      <Link className="button secondary" href="/learn">
        Back to my learning
      </Link>
    </section>
  );
}
