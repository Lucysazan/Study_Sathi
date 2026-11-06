import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AcademicFrame } from '@/components/academic/AcademicFrame';
import { AcademicPractice } from '@/components/academic/AcademicPractice';
import { TextbookReader } from '@/components/academic/TextbookReader';
import { academicChapters, findAcademicChapter } from '@/data/academic';

export function generateStaticParams() {
  return academicChapters.map((chapter) => ({
    grade: '9',
    subject: 'mathematics',
    chapterId: chapter.id,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ grade: string; subject: string; chapterId: string }>;
}): Promise<Metadata> {
  const chapter = findAcademicChapter((await params).chapterId);
  return { title: chapter ? `${chapter.title} · Grade 9 Mathematics` : 'Topic not found' };
}
export default async function ChapterPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string; chapterId: string }>;
}) {
  const route = await params;
  if (route.grade !== '9' || route.subject !== 'mathematics') notFound();
  const chapter = findAcademicChapter(route.chapterId);
  if (!chapter) notFound();
  const publicQuestion = ({ id, prompt, options }: (typeof chapter.questions)[number]) => ({
    id,
    prompt,
    options,
  });
  return (
    <AcademicFrame>
      <div className="eyebrow">GRADE 9 · MATHEMATICS · PILOT</div>
      <h1>{chapter.title}</h1>
      <p className="academic-intro">{chapter.summary}</p>
      <div className="academic-actions">
        <a className="button secondary" href="#explanation">
          Read explanation
        </a>
        <a className="button" href="#practice">
          Try practice
        </a>
        <Link className="button secondary" href="/study/sources">
          Textbook sources
        </Link>
      </div>
      <p className="academic-review-note">
        Original StudySathi material. Teacher review and current-edition alignment are pending.
      </p>
      <section>
        <h2>What you will practise</h2>
        <ul>
          {chapter.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </section>
      <Suspense fallback={<p role="status">Loading textbook connection…</p>}>
        <TextbookReader />
      </Suspense>
      <section id="explanation">
        <h2>Explanation and worked examples</h2>
        {chapter.skills.map((skill) => (
          <article
            className="learning-card academic-example"
            id={`skill-${skill.id}`}
            key={skill.id}
          >
            <h3>{skill.title}</h3>
            <p>{skill.explanation}</p>
            <h4>Worked example</h4>
            <p>{skill.example}</p>
            <ol>
              {skill.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        ))}
      </section>
      <div id="practice">
        <AcademicPractice
          chapterId={chapter.id}
          skills={chapter.skills.map(({ id, title }) => ({ id, title }))}
          questions={chapter.questions.map(publicQuestion)}
          followUp={chapter.followUp.map(publicQuestion)}
        />
      </div>
      <p>
        <Link href="/study/9/mathematics">Back to Mathematics topics</Link>
      </p>
    </AcademicFrame>
  );
}
