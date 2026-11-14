'use client';
import { useStudyStorage } from './useStudyStorage';
import { useState, type FormEvent } from 'react';
import { rememberStudy, ResourceFeedback } from './StudyTools';
import type { SchoolBook } from '@/lib/academic/library';

export function BookReader({ book }: { book: SchoolBook }) {
  const saved = Number(useStudyStorage('study-book-' + book.id));
  const [chosen, setPage] = useState<number | null>(null);
  const page = chosen ?? (Number.isInteger(saved) && saved >= 1 && saved <= 2000 ? saved : 1);
  function jump(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(new FormData(event.currentTarget).get('page'));
    if (Number.isInteger(value) && value >= 1 && value <= 2000) {
      setPage(value);
      rememberStudy(book.title, 'study-book-' + book.id, String(value));
    }
  }
  return (
    <section className="book-reader">
      <div className="reader-toolbar">
        <form onSubmit={jump}>
          <label htmlFor="pdf-page">PDF page</label>
          <input
            id="pdf-page"
            name="page"
            type="number"
            min={1}
            max={2000}
            key={page}
            defaultValue={page}
            required
          />
          <button className="button secondary" type="submit">
            Go to page
          </button>
        </form>
        <a className="button" href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
          Download / open PDF
        </a>
      </div>
      <p role="status">Reading PDF page {page}. Use Go to page to remember your place.</p>
      <iframe
        key={page}
        className="library-pdf"
        title={`${book.title} PDF reader`}
        src={`${book.pdfUrl}#page=${page}`}
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <p>
        The browser’s PDF controls offer zoom, printing and saving. On phones that do not support
        inline PDF viewing, use “Download / open PDF” and your browser’s Save option. PDF page
        numbers may differ from printed page numbers.
      </p>
      <ResourceFeedback title={book.title} />
    </section>
  );
}
