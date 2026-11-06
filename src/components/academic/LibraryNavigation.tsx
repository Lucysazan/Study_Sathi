import Link from 'next/link';
import { BookOpen, Calculator, FlaskConical, Globe, Heart, Languages } from 'lucide-react';
import {
  gradeSubjects,
  schoolGrades,
  schoolLibrary,
  subjectLabels,
  subjectPath,
} from '@/lib/academic/library';

export function LibraryBreadcrumb({
  grade,
  subject,
  current,
}: {
  grade?: number;
  subject?: string;
  current?: string;
}) {
  return (
    <div className="library-breadcrumb" aria-label="Breadcrumb">
      <Link href="/study" prefetch={false}>
        All classes
      </Link>
      {grade && (
        <>
          <span aria-hidden="true">/</span>
          <Link href={`/study/${grade}`} prefetch={false}>
            Class {grade}
          </Link>
        </>
      )}
      {grade && subject && (
        <>
          <span aria-hidden="true">/</span>
          <Link href={subjectPath(grade, subject)} prefetch={false}>
            {subjectLabels[subject]?.name}
          </Link>
        </>
      )}
      {current && (
        <>
          <span aria-hidden="true">/</span>
          <span>{current}</span>
        </>
      )}
    </div>
  );
}
export function GradeGrid() {
  return (
    <div className="grade-grid">
      {schoolGrades.map((grade) => {
        const books = schoolLibrary.books.filter((item) => item.grade === grade).length;
        const playlists = schoolLibrary.playlists.filter((item) => item.grade === grade).length;
        return (
          <Link
            prefetch={false}
            href={`/study/${grade}`}
            className="grade-tile"
            key={grade}
            aria-label={`Choose Grade ${grade}`}
          >
            <span>Class / कक्षा</span>
            <strong>{grade}</strong>
            <span>
              {books} PDFs · {playlists} playlists
            </span>
          </Link>
        );
      })}
    </div>
  );
}
export function SubjectGrid({ grade }: { grade: number }) {
  return (
    <div className="subject-grid">
      {gradeSubjects(grade).map((subject) => {
        const Icon =
          subject.icon === 'math'
            ? Calculator
            : subject.icon === 'science'
              ? FlaskConical
              : subject.icon === 'globe'
                ? Globe
                : subject.icon === 'health'
                  ? Heart
                  : subject.icon === 'english'
                    ? Languages
                    : BookOpen;
        const books = schoolLibrary.books.filter(
          (item) => item.grade === grade && item.subject === subject.id,
        ).length;
        const playlists = schoolLibrary.playlists.filter(
          (item) => item.grade === grade && item.subject === subject.id,
        ).length;
        return (
          <Link
            prefetch={false}
            href={subjectPath(grade, subject.id)}
            className="subject-tile"
            key={subject.id}
            aria-label={`Study ${subject.name}`}
          >
            <span className="subject-disc">
              <Icon size={40} aria-hidden="true" />
            </span>
            <strong>{subject.name}</strong>
            <span lang="ne">{subject.nepali}</span>
            <small>
              {books} PDFs · {playlists} playlists
            </small>
          </Link>
        );
      })}
    </div>
  );
}
