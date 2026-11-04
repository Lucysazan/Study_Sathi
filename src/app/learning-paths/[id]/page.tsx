import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PathSteps } from '@/components/paths/PathSteps';
import { CategoryIcon } from '@/components/resources/CategoryIcon';
import { getPath, getResource, paths } from '@/data/catalog';
import { getCategoryMeta } from '@/lib/categories';

export function generateStaticParams() {
  return paths.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps<'/learning-paths/[id]'>): Promise<Metadata> {
  const p = getPath((await params).id);
  return p ? { title: p.title, description: p.description } : {};
}

export default async function PathDetailsPage({ params }: PageProps<'/learning-paths/[id]'>) {
  const p = getPath((await params).id);
  if (!p) notFound();

  const resourceTitles: Record<string, string> = {};
  for (const s of p.steps) {
    const r = s.resource ? getResource(s.resource) : undefined;
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
        <span className={`path-icon ${getCategoryMeta(p.category).className}`}>
          <CategoryIcon category={p.category} size={30} />
        </span>
        <div className="eyebrow">
          AGES {p.age} · {p.steps.length} STEPS · YOUR OWN PACE
        </div>
        <h1>{p.title}</h1>
        <p>{p.description}</p>
      </div>
      <PathSteps path={p} resourceTitles={resourceTitles} />
    </section>
  );
}
