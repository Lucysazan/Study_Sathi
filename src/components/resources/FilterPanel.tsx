'use client';

import { ChevronDown, Lightbulb, SlidersHorizontal } from 'lucide-react';
import { emptyFilters, filterFields, type Filters, teachingFilterKeys } from '@/lib/filters';

/** Sidebar of select filters. Teaching mode (volunteer page) shows category and age only. */
export function FilterPanel({
  filters,
  onChange,
  teaching = false,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  teaching?: boolean;
}) {
  const fields = teaching
    ? filterFields.filter((field) => teachingFilterKeys.includes(field.key))
    : filterFields;

  return (
    <aside className="filters" aria-label="Filters">
      <div className="filter-heading">
        <h3>
          <SlidersHorizontal size={18} aria-hidden="true" /> Filters
        </h3>
        <button type="button" className="plain-button" onClick={() => onChange(emptyFilters)}>
          Clear all
        </button>
      </div>
      {fields.map(({ key, label, allLabel, options }) => (
        <label key={key}>
          {label}
          <span className="select-wrap">
            <select
              value={filters[key]}
              onChange={(e) => onChange({ ...filters, [key]: e.target.value })}
            >
              <option value="">{allLabel}</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o.replace('-', '–')}
                </option>
              ))}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </span>
        </label>
      ))}
      <div className="filter-note">
        <Lightbulb size={22} aria-hidden="true" />
        <p>Every curious mind learns differently. Find what works for you.</p>
      </div>
    </aside>
  );
}
