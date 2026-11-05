'use client';

import { type InputHTMLAttributes, useId, useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const ready = () => true;
const notReady = () => false;

/** Labelled input with an optional hint and an inline error (never alerts). */
export function Field({
  label,
  error,
  hint,
  ...input
}: { label: string; error?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  // Static auth pages can display before their event handlers attach. Keep inputs disabled
  // until hydration so text entered quickly cannot be discarded by the controlled state.
  const hydrated = useSyncExternalStore(subscribe, ready, notReady);
  const describedBy = [error ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy.length ? describedBy.join(' ') : undefined}
        {...input}
        disabled={input.disabled || !hydrated}
      />
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
