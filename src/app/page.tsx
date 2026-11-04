import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Placeholder until the Home page is ported (Phase 0, "Port pages").
export default function HomePage() {
  return (
    <section className="site-container py-16">
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-heading">
        Learn, Explore, Grow Together.
      </h1>
      <p className="mt-4 max-w-xl">
        StudySathi is moving to a new home. The full home page is coming next.
      </p>
      <Link className="button mt-6" href="/resources">
        Browse resources <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
