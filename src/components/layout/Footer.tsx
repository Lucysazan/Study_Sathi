import { BookOpen } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { Logo } from './Logo';

/** Cached so the footer stays in the static shell (Cache Components forbids a raw `new Date()`). */
async function CurrentYear() {
  'use cache';
  cacheLife('days');
  return <>{new Date().getFullYear()}</>;
}

// Note: link columns are <div>s, not <nav>s. The ported CSS styles every <nav> as the header menu.
export function Footer() {
  return (
    <footer>
      <div className="site-container footer-main">
        <div>
          <Logo />
          <p>
            Free resources. More possibilities.
            <br />
            Learning for every curious mind.
          </p>
          <span className="footer-nepal">
            Made for learners in Nepal <span aria-hidden="true">✦</span>
          </span>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/resources">All resources</Link>
          <Link href="/learning-paths">Learning paths</Link>
          <Link href="/saved">Saved resources</Link>
        </div>
        <div>
          <h4>Learn together</h4>
          <Link href="/volunteers">For parents &amp; volunteers</Link>
          <Link href="/about">About StudySathi</Link>
          <Link href="/about#sdg">Our purpose · SDG 4</Link>
        </div>
        <div className="footer-mission">
          <div className="sdg-mini" aria-hidden="true">
            4 <BookOpen size={25} />
          </div>
          <h4>Quality education</h4>
          <p>Supporting access to inclusive learning opportunities.</p>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <span>
          © <CurrentYear /> StudySathi · SIP prototype
        </span>
        <span>External learning materials belong to their original providers.</span>
      </div>
    </footer>
  );
}
