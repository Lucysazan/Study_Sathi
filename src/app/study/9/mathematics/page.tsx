import type { Metadata } from 'next';
import Link from 'next/link';
import { AcademicFrame } from '@/components/academic/AcademicFrame';
import { AcademicProgress } from '@/components/academic/AcademicProgress';
import { academicChapters, chapterPath } from '@/data/academic';

export const metadata: Metadata = { title: 'Grade 9 Mathematics' };
export default function Mathematics() {
  return (
    <AcademicFrame>
      <div className="eyebrow">GRADE 9 · MATHEMATICS · ENGLISH</div>
      <h1>Choose a topic</h1>
      <p>
        Start with an explanation, then check your understanding. These pilot topic units do not
        represent a complete textbook or verified chapter numbering.
      </p>
      <AcademicProgress />
      <div className="academic-grid">
        {academicChapters.map((chapter) => (
          <article className="learning-card" key={chapter.id}>
            <h2>{chapter.title}</h2>
            <p>{chapter.summary}</p>
            <p>{chapter.skills.length} skills · Explanation + examples + practice</p>
            <Link className="button" href={chapterPath(chapter.id)}>
              Study {chapter.title}
            </Link>
          </article>
        ))}
      </div>
      <p>
        <Link href="/study/sources">View textbook references and review status</Link>
      </p>
    </AcademicFrame>
  );
}
