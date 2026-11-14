import { ResourceLearning } from '@/components/study/ResourceLearning';
import { ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ResourceAdventure } from '@/components/resources/ResourceAdventure';
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
      <div className="detail-layout">
        <div>
          <span className={`category-label ${className}`}>{r.category}</span>
          <h1 className="detail-title">{r.title}</h1>
          <p className="detail-provider">By {r.provider}</p>
          <p className="large-copy">{r.description}</p>
          <ResourceAdventure category={r.category} />
          <ResourceLearning category={r.category} />
          <details className="provider-details">
            <summary>About this provider resource</summary>
            <div className="notice">
              <ExternalLink size={20} aria-hidden="true" />
              <div>
                <h3>Before you visit</h3>
                <p>
                  {r.note ||
                    'This material is hosted by its original provider. You will leave StudySathi when you open it.'}
                </p>
                <p>{r.verification}</p>
                <p>
                  If the site is unavailable, return here and choose a related resource. We cannot
                  check external availability in real time.
                </p>
              </div>
            </div>
          </details>
        </div>
        <aside className="detail-sidebar" aria-label="Resource summary">
          <span className="eyebrow">EXPLORE WITH {r.provider}</span>
          <h3>Ready to have a look?</h3>
          <p>Choose an activity that feels right for you. Ask an adult if you need a hand.</p>
          <a className="button full" href={r.url} target="_blank" rel="noopener noreferrer">
            Explore this resource <ExternalLink size={17} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <dl>
            {[
              ['Recommended age', r.age],
              ['Language', r.language],
              ['Format', r.format],
              ['Topic', r.topic],
              ['Learning purpose', r.purpose],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <SaveButton resourceId={r.id} title={r.title} variant="full" />
          <small>Opens a new tab · Original provider website</small>
        </aside>
      </div>
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
    </section>
  );
}
