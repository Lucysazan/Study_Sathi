'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteResource } from '@/app/admin/resources/actions';
import { ConfirmButton } from './ConfirmButton';

/** View / Edit / Delete for one resource row. Errors show inline under the actions. */
export function ResourceRowActions({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  return (
    <div className="row-actions">
      <div className="row-actions-buttons">
        <Link className="admin-link-button" href={`/resources/${id}`} target="_blank">
          View<span className="sr-only"> {title} (opens in a new tab)</span>
        </Link>
        <Link className="admin-link-button" href={`/admin/resources/${id}/edit`}>
          Edit<span className="sr-only"> {title}</span>
        </Link>
        <ConfirmButton
          label="Delete"
          confirmLabel="Yes, delete"
          question={`Delete “${title}”?`}
          danger
          disabled={pending}
          onConfirm={() =>
            startTransition(async () => {
              setError('');
              const result = await deleteResource(id);
              if (result.ok) router.refresh();
              else setError(result.error);
            })
          }
        />
      </div>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
