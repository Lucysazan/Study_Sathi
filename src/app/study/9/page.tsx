import type { Metadata } from 'next';
import Link from 'next/link';
import { AcademicFrame } from '@/components/academic/AcademicFrame';

export const metadata: Metadata = { title: 'Grade 9 subjects' };
export default function GradeNine() {
  return (
    <AcademicFrame>
      <div className="eyebrow">CHOOSE A SUBJECT</div>
      <h1>Grade 9</h1>
      <div className="academic-grid">
        <article className="learning-card">
          <h2>Mathematics</h2>
          <p>
            Sets, real numbers and algebra foundations. Explanations, worked examples and
            topic-based revision.
          </p>
          <Link className="button" href="/study/9/mathematics">
            Study Mathematics
          </Link>
        </article>
      </div>
      <p>Other subjects are not published in this pilot.</p>
    </AcademicFrame>
  );
}
