import { describe, expect, it } from 'vitest';
import { parseSavedIds } from './parse';

describe('parseSavedIds', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(parseSavedIds(null)).toEqual([]);
    expect(parseSavedIds('')).toEqual([]);
  });

  it('reads a list of resource IDs', () => {
    expect(parseSavedIds('["khan-academy","scratch"]')).toEqual(['khan-academy', 'scratch']);
  });

  it('removes duplicate IDs', () => {
    expect(parseSavedIds('["a","a","b"]')).toEqual(['a', 'b']);
  });

  it('ignores malformed or unexpected data', () => {
    expect(parseSavedIds('not json')).toEqual([]);
    expect(parseSavedIds('{"a":1}')).toEqual([]);
    expect(parseSavedIds('["a",2]')).toEqual([]);
  });
});
