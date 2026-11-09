import Link from 'next/link';
import { activitiesForCategory } from '@/lib/study/catalog';
export function ResourceLearning({ category }: { category: string }) {
  const items = activitiesForCategory(category);
  return (
    <section className="study-tools">
      <h2>Learn it step by step</h2>
      <p>
        Start with a simple StudySathi explanation, explore an activity here, then check your
        understanding. These are related original guides, not summaries or endorsements of this
        provider’s content.
      </p>
      <div className="academic-grid">
        {items.map((a) => (
          <article className="learning-card" key={a.id}>
            <h3>{a.title}</h3>
            <p>{a.summary}</p>
            <Link className="button" href={'/play/' + a.id} prefetch={false}>
              Learn {a.title}
            </Link>
          </article>
        ))}
      </div>
      <p>
        In-site activities use original content or provider-supported simulations. Other provider
        pages remain linked where embedding or reuse is not confirmed.
      </p>
    </section>
  );
}
