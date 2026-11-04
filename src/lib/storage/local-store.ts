import { useSyncExternalStore } from 'react';

export type LocalStore<T> = {
  /** Current value. Server render and hydration see `empty`; the stored value follows. */
  useValue: () => T;
  /** Read the current value outside React (e.g. inside an event handler). */
  get: () => T;
  /** Save a new value. Returns false if the browser refused to store it (value is kept for this visit). */
  set: (next: T) => boolean;
};

/**
 * A tiny localStorage-backed store shared by every component that uses it, kept in sync across
 * components and browser tabs. Used for guest data (bookmarks, path progress, notes).
 * `parse` must never throw: return `empty` for missing or malformed data.
 */
export function createLocalStore<T>(
  key: string,
  parse: (raw: string | null) => T,
  empty: T,
): LocalStore<T> {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T = empty;
  // Holds the value when the browser refuses to save it, so the visit still works.
  let unsaved: { value: T } | undefined;

  function readRaw(): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function get(): T {
    if (unsaved) return unsaved.value;
    const raw = readRaw();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = parse(raw);
    }
    return cachedValue;
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  function set(next: T): boolean {
    let ok = true;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
      unsaved = undefined;
    } catch {
      unsaved = { value: next };
      ok = false;
    }
    emit();
    return ok;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) listener();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  }

  const getServerSnapshot = () => empty;

  return {
    useValue: () => useSyncExternalStore(subscribe, get, getServerSnapshot),
    get,
    set,
  };
}
