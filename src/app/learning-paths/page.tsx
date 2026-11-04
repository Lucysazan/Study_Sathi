import { Compass } from 'lucide-react';
import type { Metadata } from 'next';
import { PathCard } from '@/components/paths/PathCard';
import { PageTitle } from '@/components/ui/PageTitle';
import { getCatalog } from '@/data/catalog.server';

export const metadata: Metadata = {
  title: 'Learning Paths',
  description: 'Short, curated sequences of free resources and activities, at your own pace.',
};

export default async function LearningPathsPage() {
  const { paths } = await getCatalog();
  return (
    <>
      <PageTitle
        eyebrow="LITTLE STEPS. NEW POSSIBILITIES."
        title="Find your learning path"
        intro="A little structure for your curiosity. Follow a short, curated sequence of free resources and activities."
      />
      <section className="site-container section">
        <div className="path-grid">
          {paths.map((p, i) => (
            <PathCard key={p.id} path={p} index={i} />
          ))}
        </div>
        <div className="notice path-notice">
          <Compass size={26} aria-hidden="true" />
          <div>
            <h3>Your pace, your progress</h3>
            <p>
              No deadlines or scores. Mark each step when you&apos;re ready. Your progress is saved
              in this browser; completion records participation and does not certify mastery.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
