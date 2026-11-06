import Link from 'next/link';
import { schoolLibrary, bookPath, playlistPath } from '@/lib/academic/library';
import type { Chapter } from '@/lib/academic/types';
export function ChapterResources({ chapter }: { chapter: Chapter }) {
  const terms: Record<string, string[]> = {
    sets: ['sets', 'समूह'],
    'real-numbers': ['real number', 'वास्तविक'],
    algebra: ['algebra', 'बीजगणित'],
  };
  const words = terms[chapter.id] || [chapter.title.toLowerCase()];
  const playlists = schoolLibrary.playlists.filter(
    (p) => p.grade === 9 && p.subject === 'mathematics',
  );
  const videos = playlists
    .flatMap((p) =>
      p.videos
        .filter((v) => words.some((w) => v.title.toLowerCase().includes(w)))
        .map((v) => ({ title: v.title, path: playlistPath(p) + '?video=' + v.id })),
    )
    .slice(0, 6);
  const books = schoolLibrary.books.filter((b) => b.grade === 9 && b.subject === 'mathematics');
  const notes = [
    'StudySathi: ' + chapter.title,
    chapter.summary,
    'Original practice notes. Teacher review and edition mapping pending.',
    ...chapter.skills.flatMap((s) => [s.title, s.explanation, 'Example: ' + s.example, ...s.steps]),
    'Try the online practice check at https://studysathisip.vercel.app/study/9/mathematics/' +
      chapter.id,
  ].join('\n\n');
  return (
    <section className="study-tools">
      <h2>Read → Watch → Practise</h2>
      <p>
        Use the original explanation below, explore the subject textbook, then try the practice
        check. Videos are title-matched suggestions, not teacher-approved chapter mapping.
      </p>
      <h3>Subject textbooks</h3>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            <Link prefetch={false} href={bookPath(b)}>
              {b.title}
            </Link>{' '}
            · {b.edition}
          </li>
        ))}
      </ul>
      <p>
        Exact chapter and page numbers are not yet verified. Use the contents page of your school’s
        edition.
      </p>
      <h3>Suggested videos</h3>
      {videos.length ? (
        <ul>
          {videos.map((v) => (
            <li key={v.path}>
              <Link prefetch={false} href={v.path}>
                {v.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          No title-matched lesson yet.{' '}
          <Link href="/study/9/mathematics#video-lessons">Browse subject playlists</Link>.
        </p>
      )}
      <a
        className="button secondary"
        download={chapter.id + '-studysathi-notes.txt'}
        href={'data:text/plain;charset=utf-8,' + encodeURIComponent(notes)}
      >
        Save original notes for offline reading
      </a>
      <p>
        This small text file works offline. Provider PDFs and YouTube videos are not included.
        Graded checks require an internet connection.
      </p>
    </section>
  );
}
