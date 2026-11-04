import type { Resource } from '@/types/catalog';

/** Ported from legacy/src/utils/filters.ts, plus URL helpers. Behaviour must stay identical. */

export const categories = [
  'Academic Education',
  'Digital Safety',
  'Financial Literacy',
  'Life Skills',
  'Learning Games',
  'Environment',
] as const;

export type Filters = {
  q: string;
  category: string;
  age: string;
  language: string;
  format: string;
  purpose: string;
};

export const filterKeys = ['q', 'category', 'age', 'language', 'format', 'purpose'] as const;

export const emptyFilters: Filters = {
  q: '',
  category: '',
  age: '',
  language: '',
  format: '',
  purpose: '',
};

export type FilterField = {
  key: Exclude<keyof Filters, 'q'>;
  label: string;
  /** Text for the "everything" option, e.g. "All Categories". */
  allLabel: string;
  options: readonly string[];
};

export const filterFields: readonly FilterField[] = [
  { key: 'category', label: 'Category', allLabel: 'All Categories', options: categories },
  { key: 'age', label: 'Age Group', allLabel: 'All Ages', options: ['10-12', '13-14', '15-16'] },
  {
    key: 'language',
    label: 'Language',
    allLabel: 'All Languages',
    options: ['Nepali', 'English', 'Multiple Languages'],
  },
  {
    key: 'format',
    label: 'Resource Format',
    allLabel: 'All Formats',
    options: ['Website', 'Video', 'Interactive Lesson', 'Game', 'Reading Material', 'Activity'],
  },
  {
    key: 'purpose',
    label: 'Learning Purpose',
    allLabel: 'All Purposes',
    options: ['Independent Learning', 'Teaching / Group Learning', 'Both'],
  },
];

/** The volunteer page only offers category and age filters. */
export const teachingFilterKeys: readonly FilterField['key'][] = ['category', 'age'];

/**
 * Age groups overlap resource ranges: a 10–14 resource appears in 10–12 and 13–14.
 * Adult-only guidance (no numeric range) is excluded when an age filter is active.
 * "Varies" is never assumed to include a particular language.
 */
export function filterResources(resources: readonly Resource[], f: Filters): Resource[] {
  const q = f.q.toLowerCase();
  const [lo = NaN, hi = NaN] = f.age.split('-').map(Number);
  return resources.filter(
    (r) =>
      (!q ||
        [r.title, r.topic, r.description, r.provider, r.category, r.language]
          .join(' ')
          .toLowerCase()
          .includes(q)) &&
      (!f.category || r.category === f.category) &&
      (!f.age || (r.minAge !== null && r.maxAge !== null && r.minAge <= hi && r.maxAge >= lo)) &&
      (!f.language ||
        (f.language === 'Multiple Languages'
          ? r.language === 'Multiple Languages' || r.language.includes('/')
          : r.language.includes(f.language))) &&
      (!f.format || r.format === f.format) &&
      (!f.purpose || r.purpose === f.purpose),
  );
}

/** Resources suitable for teaching or group learning (the volunteer page). */
export function teachingResources(resources: readonly Resource[]): Resource[] {
  return resources.filter((r) => r.purpose !== 'Independent Learning');
}

/** Read filters from a query string. Unknown keys are ignored. */
export function filtersFromSearchParams(params: URLSearchParams): Filters {
  const f = { ...emptyFilters };
  for (const key of filterKeys) f[key] = params.get(key) ?? '';
  return f;
}

/** Query string for the given filters (empty values left out), e.g. "?category=Environment". */
export function filtersToQueryString(f: Filters): string {
  const params = new URLSearchParams();
  for (const key of filterKeys) if (f[key]) params.set(key, f[key]);
  const s = params.toString();
  return s ? `?${s}` : '';
}

export function hasActiveFilters(f: Filters): boolean {
  return filterKeys.some((k) => f[k] !== '');
}
