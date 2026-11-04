'use client';

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { errorCode, friendlyAuthError } from '@/lib/auth/errors';
import { goAfterSignIn, startSession } from '@/lib/auth/client-flow';
import { getClientAuth } from '@/lib/firebase/client';
import {
  adultLoginSchema,
  fieldErrors,
  studentEmail,
  studentLoginSchema,
} from '@/lib/validation/auth';
import { Field } from './Field';
import { GoogleButton } from './GoogleButton';
import { SetupStep } from './SetupStep';

type Tab = 'student' | 'adult';

type Props = { studentLoginDomain: string };

/** Reads ?next= (where to go after login). Must sit inside <Suspense>. */
export function LoginFormFromUrl(props: Props) {
  return <LoginForm {...props} next={useSearchParams().get('next')} />;
}

/** Login with tabs: students (username + password) and parents/creators (email or Google). */
export function LoginForm({ studentLoginDomain, next }: Props & { next: string | null }) {
  const [tab, setTab] = useState<Tab>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [setupUser, setSetupUser] = useState<User | null>(null);

  if (setupUser) return <SetupStep user={setupUser} next={next} />;

  function switchTab(t: Tab) {
    setTab(t);
    setIdentifier('');
    setErrors({});
  }

  async function finish(user: User) {
    const session = await startSession(user);
    if (session.needsSetup) {
      setSetupUser(user);
      setBusy(false);
      return;
    }
    goAfterSignIn(session.role, next);
  }

  function fail(error: unknown) {
    const code = errorCode(error);
    const message = code
      ? friendlyAuthError(code, tab)
      : error instanceof Error
        ? error.message
        : friendlyAuthError(undefined, tab);
    setErrors(message ? { form: message } : {});
    setBusy(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    let email: string;
    if (tab === 'student') {
      const parsed = studentLoginSchema.safeParse({ username: identifier, password });
      if (!parsed.success) return setErrors(fieldErrors(parsed.error));
      email = studentEmail(parsed.data.username, studentLoginDomain);
    } else {
      const parsed = adultLoginSchema.safeParse({ email: identifier, password });
      if (!parsed.success) return setErrors(fieldErrors(parsed.error));
      email = parsed.data.email;
    }
    setErrors({});
    setBusy(true);
    try {
      const auth = await getClientAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await finish(user);
    } catch (error) {
      fail(error);
    }
  }

  async function onGoogle() {
    setErrors({});
    setBusy(true);
    try {
      const auth = await getClientAuth();
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      await finish(user);
    } catch (error) {
      fail(error);
    }
  }

  const isStudent = tab === 'student';
  return (
    <>
      <h1>Welcome back</h1>
      <p>Log in to keep learning.</p>
      <div className="auth-tabs" role="tablist" aria-label="Who is logging in?">
        {(
          [
            ['student', "I'm a student"],
            ['adult', "I'm a parent / creator"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            id={`tab-${value}`}
            aria-selected={tab === value}
            aria-controls="login-panel"
            onClick={() => switchTab(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div id="login-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          {errors.form && (
            <p className="form-error" role="alert">
              {errors.form}
            </p>
          )}
          {isStudent ? (
            <Field
              key="username"
              label="Username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              error={errors.username}
              hint="Your parent made this for you."
            />
          ) : (
            <Field
              key="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              error={errors.email}
            />
          )}
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <button className="button" type="submit" disabled={busy}>
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        {isStudent ? (
          <p className="auth-footer">Forgot your password? Ask your parent to reset it.</p>
        ) : (
          <>
            <div className="auth-divider">or</div>
            <div className="auth-form">
              <GoogleButton onClick={onGoogle} disabled={busy} />
            </div>
            <p className="auth-footer">
              New here? <Link href="/signup">Create an account</Link>
            </p>
          </>
        )}
      </div>
    </>
  );
}
