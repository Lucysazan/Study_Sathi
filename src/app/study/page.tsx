import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, PlayCircle, GraduationCap } from 'lucide-react';
import { GradeGrid } from '@/components/academic/LibraryNavigation';
import { schoolLibrary } from '@/lib/academic/library';
export const metadata: Metadata = {
  title: 'Class-wise learning | Classes 1-12',
  description:
    'Choose your class and subject. Read government-hosted PDFs and watch NCED Virtual teaching playlists inside StudySathi.',
};
export default function AcademicHome() {
  return (
    <section className="site-container section school-library">
      <div className="library-heading">
        <div>
          <div className="eyebrow">LEARN BY CLASS</div>
          <h1>Select your class</h1>
          <p>One place for your textbooks and video lessons. Choose a class, then a subject.</p>
        </div>
        <GraduationCap size={88} aria-hidden="true" />
      </div>
      <div className="library-summary">
        <span>
          <BookOpen size={20} aria-hidden="true" /> {schoolLibrary.books.length} government PDFs
        </span>
        <span>
          <PlayCircle size={20} aria-hidden="true" /> {schoolLibrary.playlists.length} teaching
          playlists
        </span>
        <span>English and Nepali materials</span>
      </div>
      <GradeGrid />
      <p className="library-source-note">
        Resources are credited to CDC and NCED Virtual. Coverage varies by subject and grade. These
        are provider-hosted materials, not a claim of complete current-syllabus coverage.
      </p>
      <div className="academic-actions">
        <Link className="button secondary" href="/study/sources">
          Sources and catalog coverage
        </Link>
        <Link className="button secondary" href="/learn">
          My learning dashboard
        </Link>
      </div>
    </section>
  );
}
