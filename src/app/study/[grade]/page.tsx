import { StudyTools } from '@/components/academic/StudyTools';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LibraryBreadcrumb, SubjectGrid } from '@/components/academic/LibraryNavigation';
import { parseSchoolGrade, schoolGrades } from '@/lib/academic/library';

export function generateStaticParams() {
  return schoolGrades.map((grade) => ({ grade: String(grade) }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ grade: string }>;
}): Promise<Metadata> {
  return { title: `Class ${(await params).grade} · Subjects` };
}
export default async function GradePage({ params }: { params: Promise<{ grade: string }> }) {
  const grade = parseSchoolGrade((await params).grade);
  if (!grade) notFound();
  return (
    <section className="site-container section school-library">
      <LibraryBreadcrumb grade={grade} />
      <div className="eyebrow">SELECT YOUR SUBJECT</div>
      <h1>
        Class {grade} <span lang="ne">· कक्षा {grade}</span>
      </h1>
      <p>Choose a subject to read textbooks and watch teaching playlists here.</p>
      <StudyTools />
      <SubjectGrid grade={grade} />
      <p className="library-source-note">
        Only subjects with indexed material are shown. Coverage varies by class; a listed resource
        does not mean the complete syllabus is covered.
      </p>
    </section>
  );
}
