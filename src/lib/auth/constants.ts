/**
 * Readable (not httpOnly) cookie that only says "someone is signed in on this browser".
 * It lets the static header show "My account" instead of "Log in" without making every public
 * page dynamic. It grants nothing: access is always checked with the httpOnly session cookie.
 */
export const SIGNED_IN_HINT_COOKIE = 'ss_signed_in';

/** Session length (Firebase allows 5 minutes to 14 days). */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** Sign-in must be recent to mint a session cookie (Firebase recommendation). */
export const MAX_SIGN_IN_AGE_SECONDS = 5 * 60;
