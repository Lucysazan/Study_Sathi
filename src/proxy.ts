import { type NextRequest, NextResponse } from 'next/server';
import { loginUrl } from '@/lib/auth/roles';

/**
 * Cheap first check for portal routes: no session cookie → go to login.
 * It does NOT verify the cookie; each portal layout does that with firebase-admin
 * (requireRole). See ARCHITECTURE §2.
 */
export function proxy(request: NextRequest) {
  const cookieName = process.env.SESSION_COOKIE_NAME?.trim() || '__session';
  if (request.cookies.has(cookieName)) return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(new URL(loginUrl(pathname + search), request.url));
}

// Keep in sync with `protectedPrefixes` in src/lib/auth/roles.ts.
export const config = {
  matcher: [
    '/learn',
    '/learn/:path*',
    '/parent',
    '/parent/:path*',
    '/creator',
    '/creator/:path*',
    '/admin',
    '/admin/:path*',
    '/account',
    '/account/:path*',
  ],
};
