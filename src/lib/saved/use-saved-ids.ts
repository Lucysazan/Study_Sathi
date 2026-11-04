'use client';

import { useSyncExternalStore } from 'react';
import { parseSavedIds, SAVED_STORAGE_KEY } from './parse';

const EMPTY: readonly string[] = [];
let cachedRaw: string | null = null;
let cachedIds: readonly string[] = EMPTY;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(SAVED_STORAGE_KEY);
  } catch {
    return null; // Storage blocked (private mode, settings): behave as "nothing saved".
  }
}

function getSnapshot(): readonly string[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = parseSavedIds(raw);
  }
  return cachedIds;
}

function subscribe(onChange: () => void): () => void {
  // `storage` fires when another tab changes the list. Same-tab updates arrive with the
  // save/unsave feature (Phase 0, localStorage task).
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

/**
 * Bookmarked resource IDs for guests (localStorage, read-only for now). The server render
 * sees an empty list, so there is no hydration mismatch; the real list appears after hydration.
 */
export function useSavedIds(): readonly string[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
