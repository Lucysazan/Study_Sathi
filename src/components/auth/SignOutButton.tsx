'use client';

import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOutEverywhere } from '@/lib/auth/client-flow';

export function SignOutButton({ label = 'Log out' }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return (
    <>
      <button
        type="button"
        className="button secondary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError('');
          try {
            await signOutEverywhere();
          } catch {
            setError('Could not log out. Check your connection and try again.');
          } finally {
            setBusy(false);
          }
        }}
      >
        <LogOut size={17} aria-hidden="true" />
        {busy ? 'Logging out…' : label}
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </>
  );
}
