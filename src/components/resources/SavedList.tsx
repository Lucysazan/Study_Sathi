'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SavedQuickList } from '@/components/quick-learn/SavedQuickList';
import { quickSaveId, type QuickVideo } from '@/lib/quick-learn/catalog';
import { Empty } from '@/components/ui/Empty';
import { useEffect } from 'react';
import { pruneSaved, useSavedIds } from '@/lib/storage/guest-data';
import type { Resource } from '@/types/catalog';
import { ResourceGrid } from './ResourceGrid';

/** The visitor's bookmarked resources (this browser only). */
export function SavedList({
  resources,
  canPrune,
  quickVideos = [],
}: {
  resources: readonly Resource[];
  /** Only true for the live catalogue: never prune against the fallback seed. */
  canPrune: boolean;
  quickVideos?: readonly QuickVideo[];
}) {
  const saved = useSavedIds();
  const list = resources.filter((r) => saved.includes(r.id));

  // Forget bookmarks for resources that no longer exist (e.g. removed by an admin).
  useEffect(() => {
    if (canPrune)
      pruneSaved([
        ...resources.map((r) => r.id),
        ...quickVideos.map((v) => quickSaveId(v.videoId)),
      ]);
  }, [resources, canPrune, quickVideos]);

  const savedShorts = quickVideos.filter((v) => saved.includes(quickSaveId(v.videoId)));
  if (!list.length && !savedShorts.length) {
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
      <SavedQuickList videos={savedShorts} />
      {list.length > 0 && (
        <>
          <div className="results-heading">
            <h2>
              Your collection <span>{list.length}</span>
            </h2>
            <p>Use the bookmark to remove a resource.</p>
          </div>
          <ResourceGrid resources={list} />
        </>
      )}
    </>
  );
}
