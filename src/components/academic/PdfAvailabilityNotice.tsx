import Link from 'next/link';

// Temporary incident notice. Remove after actual PDF delivery is verified, not HEAD alone.
export function PdfAvailabilityNotice() {
  return (
    <aside className="study-tools" aria-label="Textbook availability notice">
      <h2>Textbook files may not open right now</h2>
      <p>
        Our textbook links share a government file server. Actual PDF requests failed in our checks
        on 6 November 2026, even when the links reported success. This can affect multiple classes.
        The number of indexed books does not mean the files are currently readable.
      </p>
      <p>
        You can still browse video lessons and original practice. Reader pages include the official
        listing and retry controls.{' '}
        <Link href="/study/sources" prefetch={false}>
          Source details
        </Link>
        .
      </p>
    </aside>
  );
}
