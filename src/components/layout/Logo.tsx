import { BookOpen, Leaf } from 'lucide-react';
import Link from 'next/link';

/** Open book + leaf mark with the "StudySathi" wordmark ("Sathi" in teal). Links home. */
export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="StudySathi home">
      <span className="logo-icon" aria-hidden="true">
        <BookOpen size={26} />
        <Leaf size={13} />
      </span>
      Study<span>Sathi</span>
    </Link>
  );
}
