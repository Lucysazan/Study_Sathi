import { BookOpen } from 'lucide-react';
import type { ReactNode } from 'react';

/** Teal SDG 4 banner used on Home and About. */
export function MissionBanner({
  eyebrow,
  title,
  children,
  action,
  id,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mission-banner" id={id}>
      <div className="mission-symbol" aria-hidden="true">
        <BookOpen size={53} />
        <span>4</span>
      </div>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
      {action}
    </div>
  );
}
