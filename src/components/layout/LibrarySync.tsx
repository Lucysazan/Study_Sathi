'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { loadLibrary, updateLibrary } from '@/lib/storage/actions';
import {
  accountRevision,
  getAccountData,
  flushAccountWrites,
  setAccountData,
  useAccountData,
} from '@/lib/storage/account-store';
import { clearGuestData, getGuestData } from '@/lib/storage/guest-data';

export function LibrarySync() {
  const path = usePathname();
  const account = useAccountData();
  const [error, setError] = useState('');
  const [offer, setOffer] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    const revision = accountRevision();
    flushAccountWrites()
      .then(() => loadLibrary())
      .then((result) => {
        if (!active) return;
        if (!result.ok) {
          setError(result.error);
          return;
        }
        if (revision === accountRevision() || getAccountData()?.uid !== result.data?.uid)
          setAccountData(result.data, setError);
        const guest = getGuestData();
        setOffer(
          !!result.data &&
            (guest.savedIds.length > 0 ||
              guest.progress.length > 0 ||
              Object.keys(guest.notes).length > 0),
        );
      })
      .catch(() => {
        if (active) setError('Account sync is unavailable. Please refresh to try again.');
      });
    return () => {
      active = false;
    };
  }, [path]);
  async function merge() {
    if (!account) return;
    setBusy(true);
    try {
      const result = await updateLibrary(account.uid, { kind: 'merge', data: getGuestData() });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const refreshed = await loadLibrary();
      if (!refreshed.ok || !refreshed.data) {
        setError('Your items were merged. Refresh to load them.');
        return;
      }
      setAccountData(refreshed.data, setError);
      clearGuestData();
      setOffer(false);
    } catch {
      setError('Your items could not be merged. Your browser copy is still here.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="site-container">
      {error && (
        <p role="status" className="form-error">
          {error}
        </p>
      )}
      {offer && (
        <div className="notice">
          <p>Bring your saved items and notes from this browser into your account?</p>
          <button className="button secondary" type="button" disabled={busy} onClick={merge}>
            {busy ? 'Merging…' : 'Bring my saved items'}
          </button>
          <button className="button secondary" type="button" onClick={() => setOffer(false)}>
            Later
          </button>
        </div>
      )}
    </div>
  );
}
