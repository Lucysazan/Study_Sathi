'use client';
import { useStudyStorage } from './useStudyStorage';
import { useState, type FormEvent } from 'react';
import { rememberStudy, ResourceFeedback } from './StudyTools';
import type { SchoolBook } from '@/lib/academic/library';
import { AlternativeLibrary } from './AlternativeLibrary';

export function BookReader({ book }: { book: SchoolBook }) {
  const saved = Number(useStudyStorage('study-book-' + book.id));
  const [chosen, setPage] = useState<number | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [attempt, setAttempt] = useState(0);
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
      <aside className="study-tools" aria-label="PDF loading help">
        <h2>PDF not loading?</h2>
        <p>
          The file loads from the government server. If you see “didn’t send any data”, the file
          request failed. Opening it separately may help with browser viewer problems; if that also
          fails, use the official listing or try later.
        </p>
        <div className="academic-actions">
          <button
            className="button secondary"
            onClick={() => {
              setShowViewer(true);
              setAttempt(attempt + 1);
            }}
          >
            Retry PDF viewer
          </button>
          <button className="button secondary" onClick={() => setShowViewer(false)}>
            Hide failed viewer
          </button>
          <a
            className="button secondary"
            href={book.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open official book listing
          </a>
        </div>
        <p>
          StudySathi cannot restore an unavailable publisher file. A successful link check does not
          guarantee the PDF will load now.
        </p>
      </aside>
      <AlternativeLibrary grade={book.grade} />
      <p role="status">Reading PDF page {page}. Use Go to page to remember your place.</p>
      {showViewer ? (
        <iframe
          key={`${page}-${attempt}`}
          className="library-pdf"
          title={`${book.title} PDF reader`}
          src={`${book.pdfUrl}#page=${page}`}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <p role="status">
          Government viewer is off. Try the alternative library above, or use Retry PDF viewer to
          test the original file.
        </p>
      )}
      <p>
        The browser’s PDF controls offer zoom, printing and saving. On phones that do not support
        inline PDF viewing, use “Download / open PDF” and your browser’s Save option. PDF page
        numbers may differ from printed page numbers.
      </p>
      <ResourceFeedback title={book.title} />
    </section>
  );
}
