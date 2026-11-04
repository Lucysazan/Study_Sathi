import { describe, expect, it } from 'vitest';
import { isActivePath } from './nav';

describe('isActivePath', () => {
  it('matches home only on the exact root path', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/resources', '/')).toBe(false);
  });

  it('matches a section and its child routes', () => {
    expect(isActivePath('/resources', '/resources')).toBe(true);
    expect(isActivePath('/resources/khan-academy', '/resources')).toBe(true);
  });

  it('does not match routes that only share a prefix', () => {
    expect(isActivePath('/resources-old', '/resources')).toBe(false);
    expect(isActivePath('/about', '/resources')).toBe(false);
  });
});
