import { ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CategoryIcon } from '@/components/resources/CategoryIcon';
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
    <section className="site-container section">
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
          <div className={`detail-visual ${className}`}>
            <CategoryIcon category={r.category} size={85} />
            <span>{r.topic}</span>
          </div>
          <h2>What you can explore</h2>
          <p>
            Discover {r.topic.toLowerCase()} through materials from {r.provider}. Choose an activity
            appropriate for your interests and level, and take time to talk about what you learn.
          </p>
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
        </div>
        <aside className="detail-sidebar" aria-label="Resource summary">
          <h3>Your next discovery</h3>
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
          <a className="button full" href={r.url} target="_blank" rel="noopener noreferrer">
            Open Original Resource <ExternalLink size={17} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
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
