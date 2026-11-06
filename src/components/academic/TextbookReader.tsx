import { getAcademicTextbook } from '@/lib/academic/source.server';

export async function TextbookReader() {
  const textbook = await getAcademicTextbook();
  if (!textbook)
    return (
      <section className="learning-card">
        <h2>Official textbook</h2>
        <p>
          A verified textbook PDF is not connected yet. You can use the original explanations and
          practice below.
        </p>
        <a
          href="https://lib.moecdc.gov.np/catalog/opac_css/index.php?id=13786&lvl=notice_display"
          target="_blank"
          rel="noopener noreferrer"
        >
          View the CDC textbook catalog
        </a>
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
