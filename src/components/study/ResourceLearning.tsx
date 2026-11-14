import Link from 'next/link';
import { activitiesForCategory } from '@/lib/study/catalog';
export function ResourceLearning({ category }: { category: string }) {
  const items = activitiesForCategory(category);
  return (
    <section className="study-tools">
      <h2>Learn it step by step</h2>
      <p>Pick a little challenge. Try it here, then check what you learned.</p>
      <div className="academic-grid">
        {items.map((a) => (
          <article className="learning-card" key={a.id}>
            <h3>{a.title}</h3>
            <p>{a.summary}</p>
            <Link
              className="button"
              aria-label={`Learn ${a.title}`}
              href={'/play/' + a.id}
              prefetch={false}
            >
              Try this activity
            </Link>
          </article>
        ))}
      </div>
      <small>
        Related StudySathi activities, created separately from this provider&apos;s materials.
      </small>
    </section>
  );
}
