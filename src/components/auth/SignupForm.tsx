'use client';

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';
import type { AccountType } from '@/lib/auth/accounts';
import { finishSetup, goAfterSignIn, startSession } from '@/lib/auth/client-flow';
import { authFormError } from '@/lib/auth/errors';
import { getClientAuth } from '@/lib/firebase/client';
import {
  accountTypeSchema,
  displayNameSchema,
  fieldErrors,
  signupSchema,
} from '@/lib/validation/auth';
import { AccountTypeChoice } from './AccountTypeChoice';
import { Field } from './Field';
import { GoogleButton } from './GoogleButton';

/** Sign-up for parents and course-creator applicants (students are added by a parent). */
export function SignupForm() {
  const [accountType, setAccountType] = useState<AccountType | ''>('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  function fail(error: unknown) {
    const message = authFormError(error, 'adult');
    setErrors(message ? { form: message } : {});
    setBusy(false);
  }

  async function complete(user: User, type: AccountType, name: string) {
    const session = await finishSetup(user, type, name);
    goAfterSignIn(session.role, null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ accountType, displayName, email, password });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    try {
      const auth = await getClientAuth();
      // A failed setup request may follow successful Auth creation. Resume that signed-in
      // account instead of trying to create the same email again.
      const user =
        auth.currentUser?.email?.toLowerCase() === parsed.data.email.toLowerCase()
          ? auth.currentUser
          : (await createUserWithEmailAndPassword(auth, parsed.data.email, parsed.data.password))
              .user;
      await complete(user, parsed.data.accountType, parsed.data.displayName);
    } catch (error) {
      fail(error);
    }
  }

  async function onGoogle() {
    const type = accountTypeSchema.safeParse(accountType);
    // Google gives us name and email, but we still need to know who the account is for.
    if (!type.success) {
      return setErrors({ accountType: type.error.issues[0]?.message ?? 'Please choose one.' });
    }
    setErrors({});
    setBusy(true);
    try {
      const auth = await getClientAuth();
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      const name = displayNameSchema.safeParse(user.displayName ?? displayName);
      const fallback = user.email?.split('@')[0] ?? 'Friend';
      const session = await startSession(user);
      if (!session.needsSetup) return goAfterSignIn(session.role, null); // already has an account
      await complete(user, type.data, name.success ? name.data : fallback);
    } catch (error) {
      fail(error);
    }
  }

  return (
    <>
      <h1>Create your account</h1>
      <p>For parents, guardians and course creators. Students get an account from a parent.</p>
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
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint="At least 8 characters."
        />
        <button className="button" type="submit" disabled={busy}>
          {busy ? 'Creating your account…' : 'Create account'}
        </button>
      </form>
      <div className="auth-divider">or</div>
      <div className="auth-form">
        <GoogleButton onClick={onGoogle} disabled={busy} label="Sign up with Google" />
      </div>
      <p className="auth-footer">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </>
  );
}
