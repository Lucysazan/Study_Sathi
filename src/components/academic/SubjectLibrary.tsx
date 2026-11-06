import Link from 'next/link';
import { BookOpen, PlayCircle } from 'lucide-react';
import { bookPath, playlistPath, subjectLabels, subjectMaterials } from '@/lib/academic/library';
import { academicChapters, chapterPath } from '@/data/academic';
import { AcademicProgress } from './AcademicProgress';
import { LibraryBreadcrumb } from './LibraryNavigation';

export function SubjectLibrary({ grade, subject }: { grade: number; subject: string }) {
  const { books, playlists } = subjectMaterials(grade, subject);
  const meta = subjectLabels[subject];
  return (
    <section className="site-container section school-library">
      <LibraryBreadcrumb grade={grade} subject={subject} />
      <div className="eyebrow">CLASS {grade} · SELECT YOUR MATERIAL</div>
      <h1>{meta?.name}</h1>
      <p className="library-nepali" lang="ne">
        {meta?.nepali}
      </p>
      <div className="library-modes">
        <a href="#textbooks">
          <BookOpen aria-hidden="true" /> Read · {books.length} PDFs
        </a>
        <a href="#video-lessons">
          <PlayCircle aria-hidden="true" /> Watch · {playlists.length} playlists
        </a>
      </div>
      <section id="textbooks">
        <h2>Read textbooks</h2>
        <p>
          View the PDF here or open the government-hosted original to save a copy. Match the edition
          to your school’s syllabus.
        </p>
        {books.length === 0 ? (
          <p className="library-empty">
            A verified textbook for this subject is not in the catalog yet. Video lessons below are
            available.
          </p>
        ) : (
          <div className="material-grid">
            {books.map((book) => (
              <article className="material-card" key={book.id}>
                <div className="material-cover">
                  <BookOpen size={40} aria-hidden="true" />
                  <span>CLASS {grade}</span>
                  <strong>{meta?.name}</strong>
                  <span>{book.language}</span>
                </div>
                <div className="material-body">
                  <span className="material-kind">GOVERNMENT PDF</span>
                  <h3>{book.title}</h3>
                  <p>{book.provider}</p>
                  <p>{book.edition}</p>
                  <Link className="button" href={bookPath(book)} prefetch={false}>
                    Read textbook
                  </Link>
                  <a
                    className="text-link"
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download / open PDF
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section id="video-lessons">
        <h2>Watch subject lessons</h2>
        <p>
          NCED Virtual’s playlists play inside StudySathi. Use the player’s playlist menu to reach
          the full collection.
        </p>
        {playlists.length === 0 ? (
          <p className="library-empty">No verified subject playlist is indexed here yet.</p>
        ) : (
          <div className="material-grid">
            {playlists.map((playlist) => (
              <article className="material-card" key={playlist.id}>
                <div className="material-cover video-cover">
                  <PlayCircle size={44} aria-hidden="true" />
                  <span>CLASS {grade}</span>
                  <strong>{meta?.name}</strong>
                  <span>{playlist.language}</span>
                </div>
                <div className="material-body">
                  <span className="material-kind">NCED VIRTUAL PLAYLIST</span>
                  <h3>{playlist.title}</h3>
                  <p>
                    {playlist.videos.length} lessons indexed
                    {playlist.hasMore ? ' · full list in player' : ''}
                  </p>
                  <p>{playlist.provider}</p>
                  <Link className="button" href={playlistPath(playlist)} prefetch={false}>
                    Watch playlist
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {grade === 9 && subject === 'mathematics' && (
        <section id="practice-topics">
          <h2>Practise with StudySathi</h2>
          <p>
            Original pilot activities, separate from the official textbooks and videos. Teacher
            review is pending.
          </p>
          <AcademicProgress />
          <div className="academic-grid">
            {academicChapters.map((chapter) => (
              <article className="learning-card" key={chapter.id}>
                <h3>{chapter.title}</h3>
                <p>{chapter.summary}</p>
                <Link className="button secondary" href={chapterPath(chapter.id)} prefetch={false}>
                  Study {chapter.title}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
