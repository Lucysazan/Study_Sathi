import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { schoolLibrary } from '@/lib/academic/library';
import { BookReader } from '@/components/academic/BookReader';
import { LibraryBreadcrumb } from '@/components/academic/LibraryNavigation';

type Params = { grade: string; subject: string; bookId: string };
function find(p: Params) {
  return schoolLibrary.books.find(
    (book) => String(book.grade) === p.grade && book.subject === p.subject && book.id === p.bookId,
  );
}
export function generateStaticParams() {
  return schoolLibrary.books.map((book) => ({
    grade: String(book.grade),
    subject: book.subject,
    bookId: book.id,
  }));
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return { title: find(await params)?.title || 'Textbook not found' };
}
export default async function ReadPage({ params }: { params: Promise<Params> }) {
  const book = find(await params);
  if (!book) notFound();
  return (
    <section className="site-container section school-library">
      <LibraryBreadcrumb grade={book.grade} subject={book.subject} current="Textbook" />
      <div className="eyebrow">
        READ · CLASS {book.grade} · {book.language}
      </div>
      <h1>{book.title}</h1>
      <p>
        {book.provider} · {book.edition}
      </p>
      <BookReader book={book} />
      <div className="library-source-note">
        <h2>Original source</h2>
        <p>
          When enabled, this PDF loads directly from the government’s server. StudySathi does not
          own or rehost it. Check the book’s edition against your school’s current syllabus.
        </p>
        <a href={book.sourceUrl} target="_blank" rel="noopener noreferrer">
          View official source
        </a>
        <p>Link checked: {book.checked}. Availability may change.</p>
      </div>
    </section>
  );
}
