import { describe, expect, it } from 'vitest';
import { errorCode, friendlyAuthError } from '@/lib/auth/errors';
import {
  adultLoginSchema,
  fieldErrors,
  signupSchema,
  studentEmail,
  studentLoginSchema,
} from './auth';

describe('auth form schemas', () => {
  it('normalises email and accepts a valid adult login', () => {
    const r = adultLoginSchema.parse({ email: '  Parent@Example.ORG ', password: 'x' });
    expect(r.email).toBe('parent@example.org');
  });

  it('rejects a bad email with a friendly message', () => {
    const r = adultLoginSchema.safeParse({ email: 'nope', password: 'x' });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).email).toBe('Please enter a valid email address.');
  });

  it('validates student usernames', () => {
    expect(studentLoginSchema.parse({ username: ' Asha.K ', password: 'x' }).username).toBe(
      'asha.k',
    );
    expect(studentLoginSchema.safeParse({ username: 'a', password: 'x' }).success).toBe(false);
    expect(studentLoginSchema.safeParse({ username: 'asha@x', password: 'x' }).success).toBe(false);
  });

  it('requires every sign-up field and a longer password', () => {
    const r = signupSchema.safeParse({
      accountType: 'teacher',
      displayName: 'A',
      email: 'x',
      password: 'short',
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(Object.keys(fieldErrors(r.error)).sort()).toEqual([
        'accountType',
        'displayName',
        'email',
        'password',
      ]);
    }
  });

  it('builds the synthetic student email', () => {
    expect(studentEmail(' Asha ', 'students.studysathi.local')).toBe(
      'asha@students.studysathi.local',
    );
  });
});

describe('friendlyAuthError', () => {
  it('uses student-friendly wording for wrong credentials', () => {
    expect(friendlyAuthError('auth/invalid-credential', 'student')).toBe(
      "That username and password don't match. Ask your parent to reset it.",
    );
    expect(friendlyAuthError('auth/invalid-credential', 'adult')).toContain('email and password');
  });

  it('stays silent when the user closes the Google window', () => {
    expect(friendlyAuthError('auth/popup-closed-by-user', 'adult')).toBe('');
  });

  it('has a kind fallback', () => {
    expect(friendlyAuthError('auth/something-new', 'adult')).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('reads codes from Firebase errors only', () => {
    expect(errorCode({ code: 'auth/x' })).toBe('auth/x');
    expect(errorCode(new Error('x'))).toBeUndefined();
  });
});
