/**
 * Parsers for guest data saved by the prototype. Keys are unchanged, so existing visitors keep
 * their bookmarks, progress and notes. Malformed data gives an empty value, never an error.
 */

export const STORAGE_KEYS = {
  saved: 'studysathi-saved',
  progress: 'studysathi-progress',
  notes: 'studysathi-notes',
} as const;

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === 'string');
}

/**
 * Bookmarked resource IDs. Unknown IDs are dropped (the prototype discarded the whole list
 * if any ID was unknown; dropping only the bad ones keeps a visitor's other bookmarks).
 */
export function parseSavedIds(
  raw: string | null,
  isKnownId: (id: string) => boolean = () => true,
): readonly string[] {
  const value = parseJson(raw);
  if (!isStringArray(value)) return [];
  return [...new Set(value)].filter(isKnownId);
}

/** Completed step keys, e.g. "stay-safe-online-0". */
export function parseProgress(raw: string | null): readonly string[] {
  const value = parseJson(raw);
  return isStringArray(value) ? [...new Set(value)] : [];
}

/** Notes keyed by step key. The budget step stores a JSON string as its note. */
export function parseNotes(raw: string | null): Readonly<Record<string, string>> {
  const value = parseJson(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const entries = Object.entries(value);
  return entries.every(([, v]) => typeof v === 'string')
    ? (Object.fromEntries(entries) as Record<string, string>)
    : {};
}

/** Add the item if missing, remove it if present. */
export function toggleItem(list: readonly string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}
