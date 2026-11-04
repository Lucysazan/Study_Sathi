import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

/** Friendly empty state: icon, title, short help text and an optional action. */
export function Empty({
  title,
  description,
  action,
  headingLevel = 2,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  /** Use 1 when the empty state is the page's main content (e.g. Not found). */
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div className="empty">
      <span aria-hidden="true">
        <Search size={30} />
      </span>
      <Heading>{title}</Heading>
      <p>{description}</p>
      {action}
    </div>
  );
}
