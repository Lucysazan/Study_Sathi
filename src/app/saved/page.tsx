import type { Metadata } from 'next';
import { SavedList } from '@/components/resources/SavedList';
import { PageTitle } from '@/components/ui/PageTitle';

export const metadata: Metadata = {
  title: 'My Saved Resources',
  description: 'Your bookmarked learning resources, saved in this browser.',
  robots: { index: false },
};

export default function SavedPage() {
  return (
    <>
      <PageTitle
        eyebrow="A LITTLE COLLECTION OF POSSIBILITIES"
        title="My Saved Resources"
        intro="Your next discoveries, all in one place. Saved on this browser, without an account."
      />
      <section className="site-container section">
        <SavedList />
      </section>
    </>
  );
}
