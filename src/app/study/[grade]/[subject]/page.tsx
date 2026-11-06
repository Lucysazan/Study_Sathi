import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SubjectLibrary } from '@/components/academic/SubjectLibrary';
import {
  gradeSubjects,
  parseSchoolGrade,
  schoolGrades,
  subjectLabels,
} from '@/lib/academic/library';

export function generateStaticParams() {
  return schoolGrades.flatMap((grade) =>
    gradeSubjects(grade).map((subject) => ({ grade: String(grade), subject: subject.id })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ grade: string; subject: string }>;
}): Promise<Metadata> {
  const p = await params;
  return { title: `Class ${p.grade} ${subjectLabels[p.subject]?.name || 'Subject'}` };
}
export default async function SubjectPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string }>;
}) {
  const p = await params;
  const grade = parseSchoolGrade(p.grade);
  if (!grade || !gradeSubjects(grade).some((subject) => subject.id === p.subject)) notFound();
  return <SubjectLibrary grade={grade} subject={p.subject} />;
}
