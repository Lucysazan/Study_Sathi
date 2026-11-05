'use client';

import { useSyncExternalStore } from 'react';
import { updateLibrary } from './actions';
import { changeLibrary, type LibraryChange, type LibraryData } from './library';

type Snapshot = { uid: string; data: LibraryData } | null;
let snapshot: Snapshot = null;
let revision = 0;
export const accountRevision = () => revision;
const listeners = new Set<() => void>();
let queue: Promise<void> = Promise.resolve();
let reportFailure: (message: string) => void = () => {};
const timers = new Map<string, { timer: ReturnType<typeof setTimeout>; save: () => void }>();

export async function flushAccountWrites() {
  for (const { timer, save } of timers.values()) {
    clearTimeout(timer);
    save();
  }
  timers.clear();
  await queue;
}

export function setAccountData(next: Snapshot, failure: (message: string) => void) {
  snapshot = next;
  reportFailure = failure;
  for (const listener of listeners) listener();
}
export const getAccountData = () => snapshot;
export function useAccountData() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getAccountData,
    () => null,
  );
}
export function changeAccountData(change: LibraryChange): boolean {
  if (!snapshot) return false;
  const uid = snapshot.uid;
  revision += 1;
  try {
    setAccountData({ uid, data: changeLibrary(snapshot.data, change) }, reportFailure);
  } catch {
    reportFailure('This collection is full or the note is too long.');
    return false;
  }
  const save = () => {
    queue = queue.then(async () => {
      if (snapshot?.uid !== uid) return;
      try {
        const result = await updateLibrary(uid, change);
        if (!result.ok) reportFailure(result.error);
      } catch {
        reportFailure('Your account changes could not be saved. Please try again.');
      }
    });
  };
  if (change.kind === 'note') {
    clearTimeout(timers.get(change.key)?.timer);
    const timer = setTimeout(() => {
      timers.delete(change.key);
      save();
    }, 600);
    timers.set(change.key, { timer, save });
  } else save();
  return true;
}
