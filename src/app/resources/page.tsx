import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResourceLibrary, ResourceLibraryFallback } from '@/components/resources/ResourceLibrary';
import { getCatalog } from '@/data/catalog.server';

export const metadata: Metadata = {
  title: 'Explore Learning Resources',
  description:
    'Search and filter free learning resources by category, age, language, format and purpose.',
};

export default async function ResourcesPage() {
  const { resources } = await getCatalog();
  return (
    <Suspense fallback={<ResourceLibraryFallback resources={resources} />}>
      <ResourceLibrary resources={resources} />
    </Suspense>
  );
}
