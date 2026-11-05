'use client';

import { useActionState, useId, useState } from 'react';
import type { ActionResult } from '@/lib/actions';
import { avatarGlyphs } from '@/lib/avatars';

export type AccountField = {
  name: string;
  label: string;
  type?: string;
  value?: string;
  options?: readonly string[];
  minLength?: number;
  maxLength?: number;
};

export function AccountForm({
  action,
  fields,
  label,
}: {
  action: (data: FormData) => Promise<ActionResult>;
  fields: AccountField[];
  label: string;
}) {
  const id = useId();
  // Keep entered values when React resets an action form after a failed request.
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((field) => [field.name, field.value ?? field.options?.[0] ?? '']),
    ),
  );
  const [state, submit, pending] = useActionState(
    async (_: ActionResult | null, data: FormData): Promise<ActionResult> => {
      try {
        return await action(data);
      } catch {
        return {
          ok: false,
          error: 'Could not connect. Please check your connection and try again.',
        };
      }
    },
    null,
  );
  return (
    <form action={submit} className="auth-form" style={{ maxWidth: 560 }} aria-busy={pending}>
      {fields.map((field) => (
        <div className="field-group" key={field.name}>
          {field.type !== 'hidden' && <label htmlFor={`${id}-${field.name}`}>{field.label}</label>}
          {field.options ? (
            <select
              id={`${id}-${field.name}`}
              name={field.name}
              value={values[field.name] ?? ''}
              onChange={(event) =>
                setValues((current) => ({ ...current, [field.name]: event.target.value }))
              }
              aria-invalid={(state && !state.ok && !!state.fieldErrors?.[field.name]) || undefined}
              aria-describedby={
                state && !state.ok && state.fieldErrors?.[field.name]
                  ? `${id}-${field.name}-error`
                  : undefined
              }
            >
              {field.options.map((value) => (
                <option key={value} value={value}>
                  {field.name === 'avatarId' ? `${avatarGlyphs[value] ?? ''} ${value}` : value}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`${id}-${field.name}`}
              name={field.name}
              type={field.type ?? 'text'}
              value={values[field.name] ?? ''}
              onChange={(event) =>
                setValues((current) => ({ ...current, [field.name]: event.target.value }))
              }
              required
              minLength={field.minLength}
              maxLength={field.maxLength}
              autoComplete={field.type === 'password' ? 'new-password' : 'off'}
              aria-invalid={(state && !state.ok && !!state.fieldErrors?.[field.name]) || undefined}
              aria-describedby={
                state && !state.ok && state.fieldErrors?.[field.name]
                  ? `${id}-${field.name}-error`
                  : undefined
              }
            />
          )}
          {state && !state.ok && state.fieldErrors?.[field.name] && (
            <p id={`${id}-${field.name}-error`} className="form-error">
              {state.fieldErrors[field.name]}
            </p>
          )}
        </div>
      ))}
      <button className="button primary" type="submit" disabled={pending}>
        {pending ? 'Saving…' : label}
      </button>
      <p role="status" className={state && !state.ok ? 'form-error' : undefined}>
        {state ? (state.ok ? 'Saved.' : state.error) : ''}
      </p>
    </form>
  );
}
