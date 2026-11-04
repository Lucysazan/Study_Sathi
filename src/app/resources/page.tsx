import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResourceLibrary, ResourceLibraryFallback } from '@/components/resources/ResourceLibrary';

export const metadata: Metadata = {
  title: 'Explore Learning Resources',
  description:
    'Search and filter free learning resources by category, age, language, format and purpose.',
};

export default function ResourcesPage() {
  return (
    <Suspense fallback={<ResourceLibraryFallback />}>
      <ResourceLibrary />
    </Suspense>
  );
}
