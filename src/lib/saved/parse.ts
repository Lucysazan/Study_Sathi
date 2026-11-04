/** localStorage key shared with the prototype, so guests keep their bookmarks. */
export const SAVED_STORAGE_KEY = 'studysathi-saved';

/**
 * Parse the stored bookmark list. Malformed data gives an empty list instead of an error,
 * matching the prototype's "storage reads handle malformed data" rule.
 * TODO(Phase 0, localStorage task): also drop IDs that are not in the resource catalogue,
 * like the prototype does.
 */
export function parseSavedIds(raw: string | null): readonly string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value) || !value.every((x) => typeof x === 'string')) return [];
    return [...new Set(value)];
  } catch {
    return [];
  }
}
