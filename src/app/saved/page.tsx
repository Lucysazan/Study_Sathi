import type { Metadata } from 'next';
import { SavedList } from '@/components/resources/SavedList';
import { PageTitle } from '@/components/ui/PageTitle';
import { getCatalog } from '@/data/catalog.server';

export const metadata: Metadata = {
  title: 'My Saved Resources',
  description: 'Your bookmarked learning resources.',
  robots: { index: false },
};

export default async function SavedPage() {
  const { resources, source } = await getCatalog();
  return (
    <>
      <PageTitle
        eyebrow="A LITTLE COLLECTION OF POSSIBILITIES"
        title="My Saved Resources"
        intro="Your next discoveries, all in one place. Learner accounts sync saved items across devices; guests save in this browser."
      />
      <section className="site-container section">
        <SavedList resources={resources} canPrune={source === 'firestore'} />
      </section>
    </>
  );
}
