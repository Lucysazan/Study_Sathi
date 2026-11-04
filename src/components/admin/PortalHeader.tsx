import type { ReactNode } from 'react';

/** Page title row with the primary action on the right (DESIGN.md portals). */
export function PortalHeader({
  eyebrow,
  title,
  intro,
  action,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div className="portal-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {action}
    </div>
  );
}

/** Green or neutral status line shown after an action (e.g. "Saved Khan Academy Kids"). */
export function StatusNote({ children }: { children: ReactNode }) {
  return (
    <p className="admin-status" role="status">
      {children}
    </p>
  );
}
