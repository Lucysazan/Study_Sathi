import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CategoryIcon } from '@/components/resources/CategoryIcon';
import { getCategoryMeta } from '@/lib/categories';
import type { LearningPath } from '@/types/catalog';

/** Learning path preview card. `index` is 0-based and shown as "01", "02"… */
export function PathCard({ path: p, index }: { path: LearningPath; index: number }) {
  return (
    <Link href={`/learning-paths/${p.id}`} className="path-card">
      <span className={`path-icon ${getCategoryMeta(p.category).className}`}>
        <CategoryIcon category={p.category} size={28} />
      </span>
      <div className="path-topline">
        LEARNING PATH <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3>{p.title}</h3>
      <div className="mini-trail" aria-label={`${p.steps.length} stops on this path`}>
        {p.steps.map((step, i) => (
          <span key={step.title}>{i + 1}</span>
        ))}
      </div>
      <p>{p.description}</p>
      <div className="path-meta">
        <span>Ages {p.age}</span>
        <span>{p.steps.length} steps</span>
      </div>
      <span className="card-action">
        Start Learning <ArrowRight size={18} aria-hidden="true" />
      </span>
    </Link>
  );
}
