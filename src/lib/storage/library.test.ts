import { describe, expect, it } from 'vitest';
import { changeLibrary, emptyLibrary, libraryChange } from './library';

describe('account library merge', () => {
  it('merges idempotently and keeps existing account notes', () => {
    const current = { savedIds: ['1'], progress: [], notes: { note: 'Account note' } };
    const change = {
      kind: 'merge' as const,
      data: { savedIds: ['1', '2'], progress: ['path-0'], notes: { note: 'Guest note' } },
    };
    const merged = changeLibrary(current, change);
    expect(merged.notes.note).toBe('Account note');
    expect(merged.savedIds).toEqual(['1', '2']);
    expect(changeLibrary(merged, change)).toEqual(merged);
  });
  it('uses explicit bookmark state so retries do not toggle twice', () => {
    const change = { kind: 'saved' as const, key: '1', value: true };
    const once = changeLibrary(emptyLibrary, change);
    expect(changeLibrary(once, change)).toEqual(once);
  });
  it('rejects oversized notes and unsafe field keys', () => {
    expect(libraryChange.safeParse({ kind: 'note', key: 'a.b', value: 'private' }).success).toBe(
      false,
    );
    expect(
      libraryChange.safeParse({ kind: 'note', key: 'safe', value: 'a'.repeat(4001) }).success,
    ).toBe(false);
  });
});
