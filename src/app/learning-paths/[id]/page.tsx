import { guidedPaths } from '@/data/guidedPaths';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PathSteps } from '@/components/paths/PathSteps';
import { ResourceScene } from '@/components/resources/ResourceScene';
import { findPath, findResource } from '@/data/catalog';
import { getCatalog } from '@/data/catalog.server';

export async function generateStaticParams() {
  const { paths } = await getCatalog();
  return [...paths, ...guidedPaths].map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps<'/learning-paths/[id]'>): Promise<Metadata> {
  const id = (await params).id;
  const p = findPath(await getCatalog(), id) ?? guidedPaths.find((path) => path.id === id);
  return p ? { title: p.title, description: p.description } : {};
}

export default async function PathDetailsPage({ params }: PageProps<'/learning-paths/[id]'>) {
  const catalog = await getCatalog();
  const id = (await params).id;
  const p = findPath(catalog, id) ?? guidedPaths.find((path) => path.id === id);
  if (!p) notFound();

  const resourceTitles: Record<string, string> = {};
  for (const s of p.steps) {
    const r = s.resource ? findResource(catalog, s.resource) : undefined;
    if (r) resourceTitles[r.id] = r.title;
  }

  return (
    <section className="site-container section path-detail">
      <div className="breadcrumb">
        <Link href="/learning-paths">Learning Paths</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span>{p.title}</span>
      </div>
      <div className="path-detail-head">
        <div className="path-cover">
          <ResourceScene category={p.category} resourceId={p.id} />
        </div>
        <div className="eyebrow">
          AGES {p.age} · {p.steps.length} STEPS · YOUR OWN PACE
        </div>
        <h1>{p.title}</h1>
        <p>{p.description}</p>
      </div>
      {guidedPaths.some((path) => path.id === p.id) && (
        <p className="trail-provider-note">
          Made by StudySathi. Play here, take your time and tick each stop when you are ready. Ticks
          record participation, not a test score.
        </p>
      )}
      <PathSteps path={p} resourceTitles={resourceTitles} />
    </section>
  );
}
