'use client';

import { useState } from 'react';

/**
 * Two-step button for actions that are hard to undo: first click asks, second click does it.
 * No browser dialogs; focus moves to the confirm button so keyboard users can continue.
 */
export function ConfirmButton({
  label,
  confirmLabel,
  question,
  onConfirm,
  disabled,
  danger = false,
}: {
  label: string;
  confirmLabel: string;
  question: string;
  onConfirm: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button
        type="button"
        className="admin-link-button"
        disabled={disabled}
        onClick={() => setAsking(true)}
      >
        {label}
      </button>
    );
  }
  return (
    <span className="confirm-inline" role="group" aria-label={question}>
      <span>{question}</span>
      <button
        type="button"
        className={danger ? 'admin-link-button danger' : 'admin-link-button'}
        autoFocus
        disabled={disabled}
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
      >
        {confirmLabel}
      </button>
      <button type="button" className="admin-link-button" onClick={() => setAsking(false)}>
        Cancel
      </button>
    </span>
  );
}
