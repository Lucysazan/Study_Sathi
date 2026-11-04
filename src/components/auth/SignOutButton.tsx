'use client';

import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOutEverywhere } from '@/lib/auth/client-flow';

export function SignOutButton({ label = 'Log out' }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="button secondary"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signOutEverywhere();
      }}
    >
      <LogOut size={17} aria-hidden="true" />
      {busy ? 'Logging out…' : label}
    </button>
  );
}
