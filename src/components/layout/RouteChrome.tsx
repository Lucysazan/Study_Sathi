'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** Cached route DOM may remain mounted; only the current URL controls site chrome. */
export function RouteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === '/quick-learn' ? null : children;
}
