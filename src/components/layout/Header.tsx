import { Suspense } from 'react';
import { Logo } from './Logo';
import { Navbar, NavbarFallback } from './Navbar';

/** Sticky site header. Navbar reads the URL, so it sits in a Suspense boundary (see ADR-008). */
export function Header() {
  return (
    <header>
      <div className="site-container nav">
        <Logo />
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
      </div>
    </header>
  );
}
