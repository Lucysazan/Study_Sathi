'use client';

import { CheckCircle2 } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { feedbackStore } from '@/lib/storage/guest-data';

const empty = { toast: '', notice: '' };
const useFeedback = () =>
  useSyncExternalStore(feedbackStore.subscribe, feedbackStore.get, () => empty);

/** "Your browser could not save changes" banner, shown under the header. */
export function StorageNotice() {
  const { notice } = useFeedback();
  if (!notice) return null;
  return (
    <div className="storage-error" role="alert">
      {notice}
    </div>
  );
}

/** Brief confirmation after saving or removing a bookmark. */
export function Toast() {
  const { toast } = useFeedback();
  // The live region stays mounted so screen readers announce each new message.
  return (
    <div role="status" aria-live="polite">
      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
