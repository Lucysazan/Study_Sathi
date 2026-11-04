import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/** Eyebrow + h2 + optional intro on the left, optional "see all" link on the right. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  link,
  className,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  link?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={className ? `section-heading ${className}` : 'section-heading'}>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      {link && (
        <Link className="text-link" href={link.href}>
          {link.label} <ArrowRight size={17} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
