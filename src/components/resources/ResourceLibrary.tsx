'use client';

import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useId, useState } from 'react';
import { Empty } from '@/components/ui/Empty';
import { PageTitle } from '@/components/ui/PageTitle';
import {
  emptyFilters,
  filterKeys,
  filterResources,
  type Filters,
  filtersFromSearchParams,
  filtersToQueryString,
  hasActiveFilters,
  teachingResources,
} from '@/lib/filters';
import { FilterPanel } from './FilterPanel';
import { ResourceGrid } from './ResourceGrid';

import type { Resource } from '@/types/catalog';

type Props = { teaching?: boolean; resources: readonly Resource[] };

/** Search + filters + results. Filters live in the query string so views can be shared. */
export function ResourceLibrary({ teaching = false, resources }: Props) {
  const params = useSearchParams();
  const fromUrl = filtersFromSearchParams(new URLSearchParams(params.toString()));

  // The search text is local state so typing stays instant; it follows the URL when the URL
  // changes from elsewhere (e.g. a category link). React's "adjust state during render" pattern.
  const [q, setQ] = useState(fromUrl.q);
  const [lastUrlQ, setLastUrlQ] = useState(fromUrl.q);
  if (fromUrl.q !== lastUrlQ) {
    setLastUrlQ(fromUrl.q);
    setQ(fromUrl.q);
  }

  function setFilters(next: Filters) {
    setQ(next.q);
    setLastUrlQ(next.q);
    // Native history API: updates useSearchParams without a server round trip (Next docs).
    window.history.replaceState(null, '', window.location.pathname + filtersToQueryString(next));
  }

  return (
    <LibraryView
      teaching={teaching}
      resources={resources}
      filters={{ ...fromUrl, q }}
      onChange={setFilters}
    />
  );
}

/** Full library with no filters: shown while the query string is unknown during prerendering. */
export function ResourceLibraryFallback({ teaching = false, resources }: Props) {
  return (
    <LibraryView
      teaching={teaching}
      resources={resources}
      filters={emptyFilters}
      onChange={() => {}}
    />
  );
}

function LibraryView({
  teaching,
  resources,
  filters: f,
  onChange,
}: {
  teaching: boolean;
  resources: readonly Resource[];
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  // Unique per instance: Next keeps visited pages mounted (hidden), so /resources and
  // /volunteers can both be in the DOM at once.
  const filterShellId = useId();
  const list = filterResources(teaching ? teachingResources(resources) : resources, f);
  const active = filterKeys.filter((k) => f[k]);

  return (
    <>
      {!teaching && (
        <nav className="resource-shortcuts site-container" aria-label="Choose how to learn">
          <Link href="/study">My class books</Link>
          <Link href="/play">Play and discover</Link>
          <Link href="/learning-paths">Follow a trail</Link>
        </nav>
      )}
      <PageTitle
        eyebrow={teaching ? 'LEARN TOGETHER' : 'A WORLD OF FREE LEARNING'}
        title={teaching ? 'Support Learning in Your Community.' : 'Explore Learning Resources'}
        intro={
          teaching
            ? 'Discover educational resources to help parents, teachers, and volunteers guide children through useful learning activities.'
            : 'Find free and useful learning materials from trusted educational providers.'
        }
      >
        <div className="search-box" role="search">
          <Search size={21} aria-hidden="true" />
          <input
            aria-label="Search resources"
            placeholder="What would you like to learn today?"
            value={f.q}
            onChange={(e) => onChange({ ...f, q: e.target.value })}
          />
          {f.q && (
            <button
              type="button"
              className="icon-button"
              onClick={() => onChange({ ...f, q: '' })}
              aria-label="Clear search"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </PageTitle>

      <section className="site-container library-section">
        <button
          type="button"
          className="button secondary mobile-filters"
          aria-expanded={expanded}
          aria-controls={filterShellId}
          onClick={() => setExpanded(!expanded)}
        >
          <SlidersHorizontal size={17} aria-hidden="true" />
          {expanded ? 'Hide' : 'Show'} filters
        </button>
        <div className="library-layout">
          <div id={filterShellId} className={expanded ? 'filter-shell expanded' : 'filter-shell'}>
            <FilterPanel filters={f} onChange={onChange} teaching={teaching} />
          </div>
          <div>
            <div className="results-heading">
              <h2>
                {teaching ? 'Teaching-friendly resources' : 'The resource library'}{' '}
                <span>{list.length}</span>
              </h2>
              <span role="status">
                {list.length} resource{list.length !== 1 ? 's' : ''} to explore
              </span>
            </div>
            {hasActiveFilters(f) && (
              <div className="active-filters">
                {active.map((k) => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => onChange({ ...f, [k]: '' })}
                    aria-label={`Remove filter: ${f[k]}`}
                  >
                    {f[k]}
                    <X size={12} aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
            {list.length ? (
              <ResourceGrid resources={list} />
            ) : (
              <Empty
                title="A new search, a new discovery"
                description="We couldn't find a match. Try another word or clear a filter."
                action={
                  <button type="button" className="button" onClick={() => onChange(emptyFilters)}>
                    Reset Filters
                  </button>
                }
              />
            )}
            <p className="catalog-note">
              Selected for learners in Nepal. Age ranges are guidance; review materials with an
              adult. External access and content may change.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
