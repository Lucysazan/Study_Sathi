'use client';

import type { User } from 'firebase/auth';
import { type FormEvent, useState } from 'react';
import { z } from 'zod';
import type { AccountType } from '@/lib/auth/accounts';
import { finishSetup, goAfterSignIn } from '@/lib/auth/client-flow';
import { accountTypeSchema, displayNameSchema, fieldErrors } from '@/lib/validation/auth';
import { AccountTypeChoice } from './AccountTypeChoice';
import { Field } from './Field';
import { authFormError } from '@/lib/auth/errors';

const schema = z.object({ accountType: accountTypeSchema, displayName: displayNameSchema });

/**
 * "Finish setting up": shown after a first Google sign-in from the login page, when the account
 * has no role or profile yet.
 */
export function SetupStep({ user, next }: { user: User; next: string | null }) {
  const [accountType, setAccountType] = useState<AccountType | ''>('');
  const [displayName, setDisplayName] = useState(user.displayName ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ accountType, displayName });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    try {
      const session = await finishSetup(user, parsed.data.accountType, parsed.data.displayName);
      goAfterSignIn(session.role, next);
    } catch (error) {
      setErrors({ form: authFormError(error, 'adult') });
      setBusy(false);
    }
  }

  return (
    <>
      <h1>Welcome to StudySathi</h1>
      <p>One last step: tell us a little about your account.</p>
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {errors.form && (
          <p className="form-error" role="alert">
            {errors.form}
          </p>
        )}
        <AccountTypeChoice
          value={accountType}
          onChange={setAccountType}
          error={errors.accountType}
        />
        <Field
          label="Your name"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          error={errors.displayName}
        />
        <button className="button" type="submit" disabled={busy}>
          {busy ? 'Setting up…' : 'Finish setting up'}
        </button>
      </form>
    </>
  );
}
