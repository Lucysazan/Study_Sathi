'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Empty } from '@/components/ui/Empty';
import { useEffect } from 'react';
import { pruneSaved, useSavedIds } from '@/lib/storage/guest-data';
import type { Resource } from '@/types/catalog';
import { ResourceGrid } from './ResourceGrid';

/** The visitor's bookmarked resources (this browser only). */
export function SavedList({
  resources,
  canPrune,
}: {
  resources: readonly Resource[];
  /** Only true for the live catalogue: never prune against the fallback seed. */
  canPrune: boolean;
}) {
  const saved = useSavedIds();
  const list = resources.filter((r) => saved.includes(r.id));

  // Forget bookmarks for resources that no longer exist (e.g. removed by an admin).
  useEffect(() => {
    if (canPrune) pruneSaved(resources.map((r) => r.id));
  }, [resources, canPrune]);

  if (!list.length) {
    return (
      <Empty
        title="Make room for your next discovery"
        description="Tap the bookmark on a resource to save it here for later."
        action={
          <Link className="button" href="/resources">
            Explore Resources <ArrowRight size={17} aria-hidden="true" />
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="results-heading">
        <h2>
          Your collection <span>{list.length}</span>
        </h2>
        <p>Use the bookmark to remove a resource.</p>
      </div>
      <ResourceGrid resources={list} />
    </>
  );
}
