'use client';

import { Bookmark } from 'lucide-react';
import { toggleSaved, useSavedIds } from '@/lib/storage/guest-data';

type Props = {
  resourceId: string;
  title: string;
  /** "icon": round bookmark on a card. "full": labelled button on the details page. */
  variant?: 'icon' | 'full';
};

/** Save / unsave a resource for guests (localStorage). */
export function SaveButton({ resourceId, title, variant = 'icon' }: Props) {
  const saved = useSavedIds().includes(resourceId);

  if (variant === 'full') {
    return (
      <button
        type="button"
        className="button secondary full"
        aria-pressed={saved}
        onClick={() => toggleSaved(resourceId)}
      >
        <Bookmark size={17} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
        {saved ? 'Saved · Remove' : 'Save Resource'}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={saved ? 'save-button is-saved' : 'save-button'}
      aria-label={`${saved ? 'Unsave' : 'Save'} ${title}`}
      aria-pressed={saved}
      onClick={() => toggleSaved(resourceId)}
    >
      <Bookmark size={18} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
