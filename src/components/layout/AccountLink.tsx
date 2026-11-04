'use client';

import { LogIn, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { SIGNED_IN_HINT_COOKIE } from '@/lib/auth/constants';

function readHint(): boolean {
  return document.cookie.split('; ').some((c) => c === `${SIGNED_IN_HINT_COOKIE}=1`);
}

const subscribe = () => () => {};

/**
 * "Log in" or "My account" in the header. Uses a readable hint cookie so public pages stay
 * static; /account does the real session check (see src/lib/auth/constants.ts).
 */
export function AccountLink() {
  const signedIn = useSyncExternalStore(subscribe, readHint, () => false);
  return signedIn ? (
    <Link className="account-nav" href="/account" aria-label="My account">
      <UserRound size={20} aria-hidden="true" />
      <span className="account-label">My account</span>
    </Link>
  ) : (
    <Link className="account-nav" href="/login" aria-label="Log in">
      <LogIn size={20} aria-hidden="true" />
      <span className="account-label">Log in</span>
    </Link>
  );
}
