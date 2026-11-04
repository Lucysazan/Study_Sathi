import { describe, expect, it } from 'vitest';
import { parseNotes, parseProgress, parseSavedIds, toggleItem } from './parsers';

describe('parseSavedIds', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(parseSavedIds(null)).toEqual([]);
    expect(parseSavedIds('')).toEqual([]);
  });

  it('reads a list of resource IDs and removes duplicates', () => {
    expect(parseSavedIds('["1","5","1"]')).toEqual(['1', '5']);
  });

  it('drops IDs that are not in the catalogue', () => {
    expect(parseSavedIds('["1","999"]', (id) => id === '1')).toEqual(['1']);
  });

  it('ignores malformed or unexpected data', () => {
    expect(parseSavedIds('not json')).toEqual([]);
    expect(parseSavedIds('{"a":1}')).toEqual([]);
    expect(parseSavedIds('["a",2]')).toEqual([]);
  });
});

describe('parseProgress', () => {
  it('reads completed step keys', () => {
    expect(parseProgress('["stay-safe-online-0"]')).toEqual(['stay-safe-online-0']);
  });

  it('ignores malformed data', () => {
    expect(parseProgress('[1,2]')).toEqual([]);
    expect(parseProgress('oops')).toEqual([]);
  });
});

describe('parseNotes', () => {
  it('reads string notes by step key', () => {
    expect(parseNotes('{"a-3":"hello","b-1":"{\\"Needs\\":\\"200\\"}"}')).toEqual({
      'a-3': 'hello',
      'b-1': '{"Needs":"200"}',
    });
  });

  it('ignores arrays, non-string values and malformed JSON', () => {
    expect(parseNotes('["x"]')).toEqual({});
    expect(parseNotes('{"a":1}')).toEqual({});
    expect(parseNotes('{')).toEqual({});
    expect(parseNotes(null)).toEqual({});
  });
});

describe('toggleItem', () => {
  it('adds a missing item and removes a present one', () => {
    expect(toggleItem(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleItem(['a', 'b'], 'a')).toEqual(['b']);
  });
});
