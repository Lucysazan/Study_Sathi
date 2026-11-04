import type { ReactNode } from 'react';

/** Soft page header band: eyebrow, h1, intro and optional extra content (e.g. a search box). */
export function PageTitle({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-title">
      <div className="site-container">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{intro}</p>
        {children}
      </div>
    </section>
  );
}
