import { expect, it } from 'vitest';
import { AuthFlowError, authFormError } from './errors';

it('does not expose internal framework exceptions in authentication forms', () => {
  expect(authFormError(new Error('Minified React error #441; internal details'), 'adult')).toBe(
    'We could not complete sign-in. Please try again.',
  );
});
it('preserves deliberate public setup feedback', () => {
  expect(authFormError(new AuthFlowError('Please try setup again.'), 'adult')).toBe(
    'Please try setup again.',
  );
});
it('keeps audience-specific Firebase errors and cancelled-popup behavior', () => {
  expect(authFormError({ code: 'auth/invalid-credential' }, 'student')).toContain(
    'Ask your parent',
  );
  expect(authFormError({ code: 'auth/popup-closed-by-user' }, 'adult')).toBe('');
});
