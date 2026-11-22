import Link from 'next/link';

/** "S/" monogram with the StudySathi wordmark. Links home. */
export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="StudySathi home">
      <span className="logo-mark" aria-hidden="true">
        S
      </span>
      <span className="logo-word">StudySathi</span>
    </Link>
  );
}
