'use client';

import { Bookmark, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isActivePath, mainNav } from '@/lib/nav';
import { useSavedIds } from '@/lib/storage/guest-data';

const MENU_ID = 'main-navigation';

/** Main navigation, saved link and mobile menu toggle, with the current page highlighted. */
export function Navbar() {
  return <NavbarContent pathname={usePathname()} />;
}

/** Same markup without an active link: the Suspense fallback while the path is unknown. */
export function NavbarFallback() {
  return <NavbarContent pathname={null} />;
}

function NavbarContent({ pathname }: { pathname: string | null }) {
  // Remember which path the menu was opened on, so navigating closes it (no effect needed).
  const [openOn, setOpenOn] = useState<string | null | undefined>(undefined);
  const open = openOn === pathname;
  const close = () => setOpenOn(undefined);
  const saved = useSavedIds();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenOn(undefined);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <nav id={MENU_ID} className={open ? 'open' : undefined} aria-label="Main navigation">
        {mainNav.map(({ href, label }) => {
          const active = pathname !== null && isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? 'active' : undefined}
              aria-current={active ? 'page' : undefined}
              onClick={close}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="nav-tools">
        <Link className="saved-nav" href="/saved" aria-label={`Saved resources (${saved.length})`}>
          <Bookmark size={20} aria-hidden="true" />
          <span className="saved-label">Saved</span>
          {saved.length > 0 && <b>{saved.length}</b>}
        </Link>
        <button
          type="button"
          className="mobile-toggle icon-button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls={MENU_ID}
          onClick={() => (open ? close() : setOpenOn(pathname))}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </>
  );
}
