'use client';

import { createLocalStore } from './local-store';
import { parseNotes, parseProgress, parseSavedIds, STORAGE_KEYS, toggleItem } from './parsers';

/** Guest data stores (localStorage). Signed-in sync arrives in Phase 3 (ARCHITECTURE §7). */

const savedStore = createLocalStore<readonly string[]>(
  STORAGE_KEYS.saved,
  (raw) => parseSavedIds(raw),
  [],
);
const progressStore = createLocalStore<readonly string[]>(STORAGE_KEYS.progress, parseProgress, []);
const notesStore = createLocalStore<Readonly<Record<string, string>>>(
  STORAGE_KEYS.notes,
  parseNotes,
  {},
);

// ----- Feedback: toast + "could not save" notice (shared, like the prototype's app-level state) -----

type Feedback = { toast: string; notice: string };
const feedbackListeners = new Set<() => void>();
let feedback: Feedback = { toast: '', notice: '' };
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function setFeedback(next: Partial<Feedback>) {
  feedback = { ...feedback, ...next };
  for (const listener of feedbackListeners) listener();
}

export const feedbackStore = {
  subscribe(listener: () => void) {
    feedbackListeners.add(listener);
    return () => feedbackListeners.delete(listener);
  },
  get: () => feedback,
};

export function showToast(message: string) {
  clearTimeout(toastTimer);
  setFeedback({ toast: message });
  toastTimer = setTimeout(() => setFeedback({ toast: '' }), 2500);
}

// ----- Bookmarks -----

export const useSavedIds = savedStore.useValue;

export function toggleSaved(id: string) {
  const wasSaved = savedStore.get().includes(id);
  const ok = savedStore.set(toggleItem(savedStore.get(), id));
  showToast(wasSaved ? 'Resource removed from saved' : 'Resource saved for later');
  if (!ok) {
    setFeedback({
      notice: 'Your browser could not save changes. Your collection will last for this visit only.',
    });
  }
}

/** Drop saved IDs that are not in the catalogue any more. No-op when nothing changes. */
export function pruneSaved(knownIds: readonly string[]) {
  const current = savedStore.get();
  const kept = current.filter((id) => knownIds.includes(id));
  if (kept.length !== current.length) savedStore.set(kept);
}

// ----- Learning path progress and notes -----

export const useProgress = progressStore.useValue;
export const useNotes = notesStore.useValue;

/** Returns false if the browser could not save (the change still lasts for this visit). */
export function toggleStepComplete(stepKey: string): boolean {
  return progressStore.set(toggleItem(progressStore.get(), stepKey));
}

/** Returns false if the browser could not save (the change still lasts for this visit). */
export function saveNote(stepKey: string, value: string): boolean {
  return notesStore.set({ ...notesStore.get(), [stepKey]: value });
}
