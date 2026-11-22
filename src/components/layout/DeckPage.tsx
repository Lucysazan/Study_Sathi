import type { ReactNode } from 'react';

/** Public pages sit on the "table": each top-level section becomes a paper slide (paper-deck.css). */
export function DeckPage({ children }: { children: ReactNode }) {
  return <div className="deck deck-page">{children}</div>;
}
