'use client';

import { BookOpen, ExternalLink, LayoutDashboard, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from '@/components/auth/SignOutButton';

const links = [
  { href: '/admin', label: 'Overview', Icon: LayoutDashboard, exact: true },
  { href: '/admin/resources', label: 'Resources', Icon: BookOpen, exact: false },
  { href: '/admin/users', label: 'Users', Icon: Users, exact: false },
];

/** Left sidebar on desktop; a row of links above the content under 800px (DESIGN.md portals). */
export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="portal-sidebar">
      <div className="portal-sidebar-title">Admin</div>
      <nav aria-label="Admin">
        {links.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? 'active' : undefined}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
        <Link href="/" className="portal-sidebar-secondary">
          <ExternalLink size={18} aria-hidden="true" />
          View site
        </Link>
      </nav>
      <div className="portal-sidebar-footer">
        <SignOutButton />
      </div>
    </aside>
  );
}
