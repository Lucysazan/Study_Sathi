'use client';
import { useState, type FormEvent } from 'react';
import type { SchoolBook } from '@/lib/academic/library';

export function BookReader({ book }: { book: SchoolBook }) {
  const [page, setPage] = useState(1);
  function jump(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(new FormData(event.currentTarget).get('page'));
    if (Number.isInteger(value) && value >= 1 && value <= 2000) setPage(value);
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
            defaultValue={1}
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
    </section>
  );
}
