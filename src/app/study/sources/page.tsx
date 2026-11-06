import type { Metadata } from 'next';
import Link from 'next/link';
import { academicSources } from '@/data/academic';
import { TextbookReader } from '@/components/academic/TextbookReader';

export const metadata: Metadata = { title: 'Academic sources and permissions' };
export default function Sources() {
  return (
    <section className="site-container section academic-shell">
      <Link href="/study">Back to academic study</Link>
      <h1>Sources and content status</h1>
      <p>
        We distinguish official references from our own explanations and practice. Listing a source
        does not imply a partnership or endorsement.
      </p>
      {academicSources.map((source) => (
        <article className="learning-card" key={source.id}>
          <h2>{source.title}</h2>
          <dl>
            <dt>Publisher</dt>
            <dd>{source.publisher}</dd>
            <dt>Edition</dt>
            <dd>{source.edition}</dd>
            <dt>Catalog checked</dt>
            <dd>{source.checked}</dd>
            <dt>Use in StudySathi</dt>
            <dd>{source.permissionNote}</dd>
          </dl>
          <a
            className="button secondary"
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open official catalog
          </a>
        </article>
      ))}
      <h2>Our pilot content</h2>
      <p>
        Three original mathematics topic units with 24 questions. No textbook pages, OLE activities
        or videos have been copied. Teacher review, full curriculum mapping and page references are
        still pending.
      </p>
      <TextbookReader />
      <h2>How textbook display works</h2>
      <p>
        A working, approved PDF source is needed before display is enabled by an administrator. We
        will not label an unverified file as the latest official textbook. Original explanations and
        practice are available now.
      </p>
      <h2>OLE Nepal integration</h2>
      <p>
        No API access or content partnership has been established. Supported integration and
        permission must be confirmed with the provider before importing their materials.
      </p>
      <a href="https://olenepal.org/ole-contact-us/" target="_blank" rel="noopener noreferrer">
        OLE Nepal contact information
      </a>
    </section>
  );
}
