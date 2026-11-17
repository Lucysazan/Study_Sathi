import { ResourceIntroduction } from '@/components/resources/ResourceIntroduction';
import { resourceIntros } from '@/data/resourceIntros';
import { ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ResourceGrid } from '@/components/resources/ResourceGrid';
import { SaveButton } from '@/components/resources/SaveButton';
import { findResource, relatedResources } from '@/data/catalog';
import { getCatalog } from '@/data/catalog.server';
import { getCategoryMeta } from '@/lib/categories';

export async function generateStaticParams() {
  const { resources } = await getCatalog();
  return resources.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: PageProps<'/resources/[id]'>): Promise<Metadata> {
  const r = findResource(await getCatalog(), (await params).id);
  return r ? { title: r.title, description: r.description } : {};
}

export default async function ResourceDetailsPage({ params }: PageProps<'/resources/[id]'>) {
  const catalog = await getCatalog();
  const r = findResource(catalog, (await params).id);
  if (!r) notFound();
  const { className } = getCategoryMeta(r.category);

  return (
    <section className="site-container section resource-detail-page">
      <div className="breadcrumb">
        <Link href="/resources">Resources</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span>{r.category}</span>
      </div>
      <div className="resource-story-header">
        <span className={`category-label ${className}`}>{r.category}</span>
        <h1>{r.title}</h1>
        <p>By {r.provider}</p>
      </div>
      <ResourceIntroduction
        key={r.id}
        id={r.id}
        title={r.title}
        provider={r.provider}
        category={r.category}
        url={r.url}
        lines={
          resourceIntros[r.title] || [
            'Curious about ' + r.topic.toLowerCase() + '?',
            r.description,
            'Choose one thing to explore. Start small and see what you discover.',
          ]
        }
      />
      <div className="resource-story-actions">
        <a href={r.url} target="_blank" rel="noopener noreferrer">
          Open resource <ExternalLink size={16} aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <SaveButton resourceId={r.id} title={r.title} variant="full" />
        <span>Original provider website - Opens a new tab</span>
      </div>
      <details className="provider-details resource-story-details">
        <summary>For curious minds &amp; grown-ups</summary>
        <p>{r.description}</p>
        <dl>
          {[
            ['Suggested age', r.age],
            ['Language', r.language],
            ['Format', r.format],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {r.note && <p>{r.note}</p>}
        <p>{r.verification}</p>
      </details>
      <details className="resource-more-details">
        <summary>Discover another resource</summary>
        <div className="section-heading related">
          <div>
            <div className="eyebrow">KEEP YOUR CURIOSITY GOING</div>
            <h2>More to explore</h2>
          </div>
          <Link className="text-link" href="/resources">
            All resources <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <ResourceGrid resources={relatedResources(catalog, r)} />
      </details>
    </section>
  );
}
