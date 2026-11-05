import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="site-container section">
      <h1 className="detail-title">This course is not available</h1>
      <p>Open your course list to choose another course.</p>
      <Link className="button secondary" href="/creator/analytics">
        Back to analytics
      </Link>
    </section>
  );
}
