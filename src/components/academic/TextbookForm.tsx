'use client';
import { useState, type FormEvent } from 'react';
import type { Textbook } from '@/lib/academic/source';
import { removeAcademicTextbook, saveAcademicTextbook } from '@/lib/academic/source-actions';

export function TextbookForm({ initial }: { initial: Textbook | null }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const data = new FormData(event.currentTarget);
    try {
      const result = await saveAcademicTextbook({
        title: data.get('title'),
        edition: data.get('edition'),
        sourceUrl: data.get('sourceUrl'),
        pdfUrl: data.get('pdfUrl'),
        permissionReference: data.get('permissionReference'),
        approvedForEmbed: data.get('approvedForEmbed') === 'on',
      });
      setMessage(
        result.ok ? 'Textbook published to academic pages.' : (result.error ?? 'Please try again.'),
      );
    } catch {
      setMessage('The textbook could not be saved. Please retry.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <form onSubmit={submit} className="academic-source-form">
        <fieldset disabled={busy}>
          <legend>Grade 9 Mathematics textbook</legend>
          <p>
            Only approved government hosts are accepted. Verify the file, grade, edition and
            permission before publishing. Do not add OLE URLs without a separate approved
            integration.
          </p>
          <label>
            Book title
            <input name="title" required maxLength={180} defaultValue={initial?.title} />
          </label>
          <label>
            Edition and language
            <input name="edition" required maxLength={180} defaultValue={initial?.edition} />
          </label>
          <label>
            Official source page URL
            <input name="sourceUrl" type="url" required defaultValue={initial?.sourceUrl} />
          </label>
          <label>
            Official PDF URL
            <input name="pdfUrl" type="url" required defaultValue={initial?.pdfUrl} />
          </label>
          <label>
            Permission or license reference
            <textarea
              name="permissionReference"
              required
              minLength={15}
              maxLength={1000}
              defaultValue={initial?.permissionReference}
            />
          </label>
          <label>
            <input
              name="approvedForEmbed"
              type="checkbox"
              required
              defaultChecked={initial?.approvedForEmbed}
            />{' '}
            I verified the source and permission to display this PDF in StudySathi.
          </label>
          <button className="button" type="submit">
            {busy ? 'Saving…' : 'Publish textbook reference'}
          </button>
        </fieldset>
      </form>
      {initial && (
        <button
          className="button secondary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const result = await removeAcademicTextbook();
              setMessage(result.ok ? 'Textbook withdrawn.' : (result.error ?? 'Please retry.'));
            } catch {
              setMessage('Could not withdraw the textbook. Please retry.');
            } finally {
              setBusy(false);
            }
          }}
        >
          Withdraw textbook reference
        </button>
      )}
      <p role="status">{message}</p>
    </>
  );
}
