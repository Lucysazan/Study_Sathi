import { getAcademicTextbook } from '@/lib/academic/source.server';
import Link from 'next/link';

export async function TextbookReader() {
  const textbook = await getAcademicTextbook();
  if (!textbook)
    return (
      <section className="learning-card">
        <h2>Official textbook</h2>
        <p>
          Read the government-hosted Mathematics books in our class library. This original practice
          unit is not yet mapped to specific textbook pages.
        </p>
        <Link href="/study/9/mathematics#textbooks" prefetch={false}>
          Read Grade 9 Mathematics textbooks
        </Link>
      </section>
    );
  return (
    <section className="learning-card">
      <h2>Official textbook</h2>
      <p>
        {textbook.title} · {textbook.edition}
      </p>
      <p>
        Full book view. Chapter page mapping is pending; use the book contents to locate the topic.
      </p>
      <details>
        <summary>Open textbook reader</summary>
        <iframe
          className="academic-pdf"
          title={`${textbook.title} textbook PDF`}
          src={textbook.pdfUrl}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </details>
      <p>
        If the reader is blank or downloads instead,{' '}
        <a href={textbook.pdfUrl} target="_blank" rel="noopener noreferrer">
          open the original PDF
        </a>
        .
      </p>
      <p>
        Publisher: Curriculum Development Centre, Nepal.{' '}
        <a href={textbook.sourceUrl} target="_blank" rel="noopener noreferrer">
          Source record
        </a>
        . The file remains on the provider’s server.
      </p>
    </section>
  );
}
