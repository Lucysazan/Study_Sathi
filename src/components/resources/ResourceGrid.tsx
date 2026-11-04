import type { Resource } from '@/types/catalog';
import { ResourceCard } from './ResourceCard';

export function ResourceGrid({
  resources,
  featured = false,
}: {
  resources: readonly Resource[];
  featured?: boolean;
}) {
  return (
    <div className={featured ? 'resource-grid featured' : 'resource-grid'}>
      {resources.map((r) => (
        <ResourceCard key={r.id} resource={r} />
      ))}
    </div>
  );
}
