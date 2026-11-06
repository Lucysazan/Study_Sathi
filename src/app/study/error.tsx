'use client';
export default function AcademicError({ retry }: { retry: () => void }) {
  return (
    <section className="site-container section">
      <h1>This topic could not be loaded</h1>
      <p>Please try again.</p>
      <button className="button" onClick={retry}>
        Try again
      </button>
    </section>
  );
}
