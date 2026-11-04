import { describe, expect, it } from 'vitest';
import { isProtectedPath, isRole, loginUrl, roleHome, safeNextPath } from './roles';

describe('roles', () => {
  it('recognises valid roles only', () => {
    expect(isRole('admin')).toBe(true);
    expect(isRole('superuser')).toBe(false);
    expect(isRole(undefined)).toBe(false);
  });

  it('sends each role to its home', () => {
    expect(roleHome('student')).toBe('/learn');
    expect(roleHome('parent')).toBe('/parent');
    expect(roleHome('creator')).toBe('/creator');
    expect(roleHome('admin')).toBe('/admin');
    expect(roleHome(null)).toBe('/account');
  });

  it('knows which paths are protected', () => {
    expect(isProtectedPath('/admin')).toBe(true);
    expect(isProtectedPath('/learn/courses/x')).toBe(true);
    expect(isProtectedPath('/learning-paths')).toBe(false);
    expect(isProtectedPath('/administrator')).toBe(false);
    expect(isProtectedPath('/')).toBe(false);
  });
});

describe('safeNextPath', () => {
  it('keeps same-site paths with query and hash', () => {
    expect(safeNextPath('/admin')).toBe('/admin');
    expect(safeNextPath('/learn/courses?x=1#top')).toBe('/learn/courses?x=1#top');
  });

  it('rejects open redirects and junk', () => {
    for (const bad of [
      null,
      '',
      'admin',
      '//evil.example',
      'https://evil.example',
      '/\\evil.example',
      'javascript:alert(1)',
      `/${'a'.repeat(600)}`,
    ]) {
      expect(safeNextPath(bad)).toBeNull();
    }
  });

  it('builds a login URL that round-trips', () => {
    const url = new URL(loginUrl('/admin?tab=users'), 'https://x.test');
    expect(safeNextPath(url.searchParams.get('next'))).toBe('/admin?tab=users');
  });
});
