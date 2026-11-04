import { describe, expect, it } from 'vitest';
import { resources } from '@/data/catalog';
import type { Resource } from '@/types/catalog';
import {
  emptyFilters,
  type Filters,
  filterResources,
  filtersFromSearchParams,
  filtersToQueryString,
  hasActiveFilters,
  teachingResources,
} from './filters';

function make(over: Partial<Resource>): Resource {
  return {
    id: 'x',
    title: 'Title',
    provider: 'Provider',
    category: 'Academic Education',
    topic: 'Topic',
    description: 'Description',
    language: 'English',
    age: '10–14',
    minAge: 10,
    maxAge: 14,
    format: 'Website',
    purpose: 'Both',
    url: 'https://example.org',
    note: '',
    verification: '',
    ...over,
  };
}

const f = (over: Partial<Filters>): Filters => ({ ...emptyFilters, ...over });
const ids = (list: Resource[]) => list.map((r) => r.id);

describe('filterResources: age overlap', () => {
  const tenToFourteen = make({ id: 'a', minAge: 10, maxAge: 14 });
  const thirteenToSixteen = make({ id: 'b', minAge: 13, maxAge: 16 });
  const adultsOnly = make({ id: 'c', age: 'Adults', minAge: null, maxAge: null });
  const all = [tenToFourteen, thirteenToSixteen, adultsOnly];

  it('includes a resource in every age group its range overlaps', () => {
    expect(ids(filterResources(all, f({ age: '10-12' })))).toEqual(['a']);
    expect(ids(filterResources(all, f({ age: '13-14' })))).toEqual(['a', 'b']);
    expect(ids(filterResources(all, f({ age: '15-16' })))).toEqual(['b']);
  });

  it('excludes adult-only guidance when a child age filter is active', () => {
    expect(ids(filterResources(all, f({ age: '13-14' })))).not.toContain('c');
    expect(ids(filterResources(all, f({})))).toContain('c');
  });
});

describe('filterResources: language rules', () => {
  const nepali = make({ id: 'np', language: 'Nepali' });
  const both = make({ id: 'np-en', language: 'Nepali / English' });
  const multiple = make({ id: 'multi', language: 'Multiple Languages' });
  const varies = make({ id: 'varies', language: 'Varies' });
  const all = [nepali, both, multiple, varies];

  it('matches resources whose label includes the language', () => {
    expect(ids(filterResources(all, f({ language: 'Nepali' })))).toEqual(['np', 'np-en']);
    expect(ids(filterResources(all, f({ language: 'English' })))).toEqual(['np-en']);
  });

  it('treats "Multiple Languages" as explicit multi-language or "A / B" labels', () => {
    expect(ids(filterResources(all, f({ language: 'Multiple Languages' })))).toEqual([
      'np-en',
      'multi',
    ]);
  });

  it('never assumes "Varies" includes a language', () => {
    for (const language of ['Nepali', 'English', 'Multiple Languages']) {
      expect(ids(filterResources(all, f({ language })))).not.toContain('varies');
    }
  });
});

describe('filterResources: search and combined filters', () => {
  it('searches title, topic, description, provider, category and language, case-insensitively', () => {
    const r = make({ id: 's', provider: 'OLE Nepal', topic: 'School Subjects' });
    expect(ids(filterResources([r], f({ q: 'ole nepal' })))).toEqual(['s']);
    expect(ids(filterResources([r], f({ q: 'SUBJECTS' })))).toEqual(['s']);
    expect(ids(filterResources([r], f({ q: 'dinosaurs' })))).toEqual([]);
  });

  it('requires every active filter to match', () => {
    const list = [
      make({ id: '1', category: 'Environment', format: 'Video' }),
      make({ id: '2', category: 'Environment', format: 'Activity' }),
      make({ id: '3', category: 'Life Skills', format: 'Video' }),
    ];
    expect(ids(filterResources(list, f({ category: 'Environment', format: 'Video' })))).toEqual([
      '1',
    ]);
  });

  it('returns everything with no filters', () => {
    expect(filterResources(resources, emptyFilters)).toHaveLength(resources.length);
  });
});

describe('real catalogue sanity checks', () => {
  it('has the 15 curated resources', () => {
    expect(resources).toHaveLength(15);
  });

  it('teaching resources leave out independent-only ones', () => {
    const teaching = teachingResources(resources);
    expect(teaching.length).toBeGreaterThan(0);
    expect(teaching.every((r) => r.purpose !== 'Independent Learning')).toBe(true);
  });
});

describe('URL helpers', () => {
  it('round-trips filters through a query string', () => {
    const filters = f({ category: 'Digital Safety', age: '13-14', q: 'safe & sound' });
    const qs = filtersToQueryString(filters);
    expect(filtersFromSearchParams(new URLSearchParams(qs))).toEqual(filters);
  });

  it('leaves out empty values and ignores unknown keys', () => {
    expect(filtersToQueryString(emptyFilters)).toBe('');
    expect(filtersFromSearchParams(new URLSearchParams('?foo=1&category=Environment'))).toEqual(
      f({ category: 'Environment' }),
    );
  });

  it('detects active filters', () => {
    expect(hasActiveFilters(emptyFilters)).toBe(false);
    expect(hasActiveFilters(f({ purpose: 'Both' }))).toBe(true);
  });
});
