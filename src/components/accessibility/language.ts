'use client';
import { useSyncExternalStore } from 'react';
const key = 'studysathi-language';
let language: 'en' | 'ne' = 'en';
let memoryOnly = false;
function snapshot() {
  try {
    if (!memoryOnly) language = localStorage.getItem(key) === 'ne' ? 'ne' : 'en';
  } catch {}
  return language;
}
function subscribe(fn: () => void) {
  window.addEventListener('studysathi-language', fn);
  window.addEventListener('storage', fn);
  return () => {
    window.removeEventListener('studysathi-language', fn);
    window.removeEventListener('storage', fn);
  };
}
export function useLanguage() {
  const language = useSyncExternalStore(subscribe, snapshot, () => 'en' as const);
  return {
    language,
    setLanguage(next: 'en' | 'ne') {
      try {
        localStorage.setItem(key, next);
      } catch {
        memoryOnly = true;
      }
      /* Keep same-tab choice working if storage is unavailable. */ languageMemory(next);
    },
  };
}
function languageMemory(next: 'en' | 'ne') {
  language = next;
  window.dispatchEvent(new Event('studysathi-language'));
}
