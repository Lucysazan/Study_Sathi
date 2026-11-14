export type NavItem = { href: string; label: string };

/** Main site navigation, in display order (same as the prototype). */
export const mainNav: readonly NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/study', label: 'Academic Study' },
  { href: '/play', label: 'Play and Learn' },
  { href: '/quick-learn', label: 'Quick Learn' },
  { href: '/resources', label: 'Resources' },
  { href: '/learning-paths', label: 'Learning Paths' },
  { href: '/about', label: 'About' },
];

/**
 * Whether a nav link should show as active for the current path.
 * Home only matches exactly; other links also match their child routes
 * (e.g. /resources/khan-academy keeps "Resources" active).
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
