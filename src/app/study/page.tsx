import { LibrarySearch } from '@/components/academic/LibrarySearch';
import { StudyText } from '@/components/academic/StudyTools';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, PlayCircle } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';
import { GradeGrid } from '@/components/academic/LibraryNavigation';
import { bookPath, playlistPath, subjectLabels, schoolLibrary } from '@/lib/academic/library';
export const metadata: Metadata = {
  title: 'Class-wise learning | Classes 1-12',
  description:
    'Choose your class and subject. Read available CDC textbook PDFs and watch NCED Virtual teaching playlists inside StudySathi.',
};
export default function AcademicHome() {
  return (
    <>
      <PageTitle
        eyebrow="LEARN BY CLASS"
        title={<StudyText en="Select your class" ne="कक्षा छान्नुहोस्" />}
        intro="One place for your textbooks and video lessons. Choose a class, then a subject."
        motif="books"
        word="Classes"
        tone="grass"
      >
        <div className="library-summary">
          <span>
            <BookOpen size={20} aria-hidden="true" /> {schoolLibrary.books.length} verified textbook
            PDFs
          </span>
          <span>
            <PlayCircle size={20} aria-hidden="true" /> {schoolLibrary.playlists.length} teaching
            playlists
          </span>
          <span>English and Nepali materials</span>
        </div>
      </PageTitle>
      <section className="site-container section school-library">
        <LibrarySearch
          items={[
            ...schoolLibrary.books.map((b) => ({
              id: b.id,
              title: b.title,
              grade: b.grade,
              subject: subjectLabels[b.subject]?.name || b.subject,
              language: b.language,
              edition: b.edition,
              kind: 'PDF',
              path: bookPath(b),
            })),
            ...schoolLibrary.playlists.flatMap((p) =>
              p.videos.map((v) => ({
                id: p.id + v.id,
                title: v.title,
                grade: p.grade,
                subject: subjectLabels[p.subject]?.name || p.subject,
                language: p.language,
                edition: '',
                kind: 'Video lesson',
                path: playlistPath(p) + '?video=' + v.id,
              })),
            ),
          ]}
        />
        <GradeGrid />
        <p className="library-source-note">
          Resources are credited to CDC and NCED Virtual. Coverage varies by subject and grade.
          These are provider-hosted materials, not a claim of complete current-syllabus coverage.
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
      <section className="site-container section study-play-promo">
        <h2>Learn, play and check your understanding</h2>
        <p>
          Try simple explanations and interactive activities, then earn rewards through learning
          checks.
        </p>
        <Link className="button" href="/play" prefetch={false}>
          Open Play and Learn
        </Link>
      </section>
    </>
  );
}
