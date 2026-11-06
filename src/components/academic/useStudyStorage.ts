'use client';
import { useSyncExternalStore } from 'react';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('study-storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('study-storage', callback);
  };
}
export function useStudyStorage(key: string) {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key) || '';
      } catch {
        return '';
      }
    },
    () => '',
  );
}
export function studyStorageChanged() {
  window.dispatchEvent(new Event('study-storage'));
}
export function useRequestedVideo() {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get('video') || '',
    () => '',
  );
}
