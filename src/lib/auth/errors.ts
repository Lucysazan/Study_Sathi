/**
 * Plain-language messages for Firebase Auth error codes (DESIGN.md "Auth pages").
 * Returns '' when nothing should be shown (e.g. the user closed the Google popup).
 */
export function friendlyAuthError(code: string | undefined, audience: 'student' | 'adult'): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return audience === 'student'
        ? "That username and password don't match. Ask your parent to reset it."
        : "That email and password don't match. Please try again.";
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in instead.';
    case 'auth/weak-password':
      return 'Please choose a longer password (at least 8 characters).';
    case 'auth/too-many-requests':
      return 'Too many tries. Please wait a few minutes and try again.';
    case 'auth/user-disabled':
      return 'This account is turned off. Please contact us for help.';
    case 'auth/network-request-failed':
      return "We couldn't connect. Check your internet and try again.";
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google window. Please allow pop-ups and try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
    case 'auth/user-cancelled':
      return '';
    case 'auth/account-exists-with-different-credential':
      return 'This email already uses a password. Please log in with your email and password.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/** Firebase errors carry a `code` like "auth/invalid-credential". */
export function errorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return undefined;
}
