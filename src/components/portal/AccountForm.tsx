'use client';

import { useActionState, useId } from 'react';
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
  const [state, submit, pending] = useActionState(
    async (_: ActionResult | null, data: FormData) => action(data),
    null,
  );
  return (
    <form action={submit} className="auth-form" style={{ maxWidth: 560 }}>
      {fields.map((field) => (
        <div className="field-group" key={field.name}>
          {field.type !== 'hidden' && <label htmlFor={`${id}-${field.name}`}>{field.label}</label>}
          {field.options ? (
            <select id={`${id}-${field.name}`} name={field.name} defaultValue={field.value}>
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
              defaultValue={field.value}
              required
              minLength={field.minLength}
              maxLength={field.maxLength}
              autoComplete={field.type === 'password' ? 'new-password' : 'off'}
            />
          )}
          {state && !state.ok && state.fieldErrors?.[field.name] && (
            <p className="form-error">{state.fieldErrors[field.name]}</p>
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
