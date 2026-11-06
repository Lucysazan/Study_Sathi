'use client';
import { useState } from 'react';

export function AlternativeLibrary({ grade }: { grade: number }) {
  const [loaded, setLoaded] = useState(false);
  const url = `https://gradewise.pustakalaya.org/grade/${grade}`;
  return (
    <section className="study-tools" aria-label="Alternative class library">
      <h2>Read using OLE Nepal’s class library</h2>
      <p>
        The government PDF host is failing in our checks. You can try OLE Nepal’s independently
        hosted Class {grade} library instead. Choose a subject, chapter and document there. This is
        an alternative collection, not a replacement edition of the selected book.
      </p>
      <div className="academic-actions">
        <button className="button" onClick={() => setLoaded(!loaded)} aria-expanded={loaded}>
          {loaded ? 'Close alternative library' : 'Load alternative class library'}
        </button>
        <a className="button secondary" href={url} target="_blank" rel="noopener noreferrer">
          Open class library on OLE Nepal
        </a>
      </div>
      {loaded && (
        <iframe
          className="alternative-library-frame"
          src={url}
          title={`OLE Nepal Class ${grade} library`}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
      <p>
        Loading connects to OLE Nepal. Their navigation, availability and download options remain
        under their control. If the embedded library does not work in your browser, open the
        original. Content stays with OLE Nepal; StudySathi does not copy it or claim a partnership.
      </p>
    </section>
  );
}
