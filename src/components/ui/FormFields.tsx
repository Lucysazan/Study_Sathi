'use client';

import { type SelectHTMLAttributes, type TextareaHTMLAttributes, useId } from 'react';

export { Field } from '@/components/auth/Field';

function describedBy(id: string, error?: string, hint?: string) {
  const ids = [error ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

function Messages({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  return (
    <>
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </>
  );
}

export function SelectField({
  label,
  options,
  placeholder,
  error,
  hint,
  ...select
}: {
  label: string;
  options: readonly string[];
  placeholder?: string;
  error?: string;
  hint?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      {label}
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...select}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Messages id={id} error={error} hint={hint} />
    </label>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  ...textarea
}: { label: string; error?: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      {label}
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...textarea}
      />
      <Messages id={id} error={error} hint={hint} />
    </label>
  );
}
