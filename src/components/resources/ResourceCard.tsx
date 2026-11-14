import { ArrowUpRight, Globe, Users } from 'lucide-react';
import Link from 'next/link';
import { getCategoryMeta } from '@/lib/categories';
import type { Resource } from '@/types/catalog';
import { ResourceScene } from './ResourceScene';
import { SaveButton } from './SaveButton';

/** Library card: category art, title (whole card is clickable), provider, meta and a bookmark. */
export function ResourceCard({ resource: r }: { resource: Resource }) {
  const { className } = getCategoryMeta(r.category);
  const href = `/resources/${r.id}`;
  return (
    <article className="resource-card">
      <div className={`resource-art ${className}`}>
        <ResourceScene category={r.category} resourceId={r.id} />
        <span className="format-tag">{r.format}</span>
        <SaveButton resourceId={r.id} title={r.title} />
      </div>
      <div className="resource-body">
        <span className={`category-label ${className}`}>{r.category}</span>
        <Link className="card-title" href={href}>
          <h3>{r.title}</h3>
        </Link>
        <p className="provider">{r.provider}</p>
        <p className="description">{r.description}</p>
        <div className="resource-meta">
          <span>
            <Users size={14} aria-hidden="true" />
            {r.minAge ? `Ages ${r.age}` : 'For adults'}
          </span>
          <span>
            <Globe size={14} aria-hidden="true" />
            {r.language}
          </span>
        </div>
        {/* Duplicate link for sighted users; hidden from screen readers (the title link covers it). */}
        <Link className="card-action" href={href} tabIndex={-1} aria-hidden="true">
          Open Details <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}
