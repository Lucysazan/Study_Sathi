/** Roles (ARCHITECTURE §1). Stored as the `role` custom claim and mirrored on users/{uid}. */
export const roles = ['student', 'parent', 'creator', 'admin'] as const;
export type Role = (typeof roles)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (roles as readonly string[]).includes(value);
}

/** Portal routes that need a signed-in user (checked cheaply in proxy.ts, verified in layouts). */
export const protectedPrefixes = ['/learn', '/parent', '/creator', '/admin', '/account'] as const;

export function isProtectedPath(pathname: string): boolean {
  return protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Where a user lands after signing in. No role yet (e.g. creator applicant) → /account. */
export function roleHome(role: Role | null): string {
  switch (role) {
    case 'student':
      return '/learn';
    case 'parent':
      return '/parent';
    case 'creator':
      return '/creator';
    case 'admin':
      return '/admin';
    default:
      return '/account';
  }
}

/**
 * The `next` value from /login?next=… if it is a safe same-site path, otherwise null.
 * Blocks open redirects such as "//evil.example", "https://evil.example" or "/\evil".
 */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || next.length > 512) return null;
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return null;
  try {
    const url = new URL(next, 'https://studysathi.invalid');
    if (url.origin !== 'https://studysathi.invalid') return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}

/** Login URL that returns the user to `path` afterwards. */
export function loginUrl(path: string): string {
  return `/login?next=${encodeURIComponent(path)}`;
}
