import { ArrowRight, BookOpen, Database, UserPlus, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PortalHeader } from '@/components/admin/PortalHeader';
import { getCatalog } from '@/data/catalog.server';
import { getAdminOverview } from '@/lib/admin/overview';

export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

const actionLabels: Record<string, string> = {
  'role.set': 'Changed a role',
  'user.disable': 'Turned off an account',
  'user.enable': 'Turned on an account',
  'resource.create': 'Added a resource',
  'resource.update': 'Edited a resource',
  'resource.delete': 'Removed a resource',
};

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Kathmandu',
});

export default async function AdminOverviewPage() {
  // getAdminOverview checks the admin session before reading anything.
  const overview = await getAdminOverview();
  const catalog = await getCatalog();
  const { activity } = overview;

  const cards = [
    {
      label: 'Resources',
      value: overview.resourceCount,
      href: '/admin/resources',
      Icon: BookOpen,
    },
    {
      label: 'Accounts',
      value: overview.accountCount,
      href: '/admin/users',
      Icon: Users,
    },
    {
      label: 'Creator applicants',
      value: overview.pendingCreators,
      href: '/admin/users',
      Icon: UserPlus,
    },
  ];

  return (
    <>
      <PortalHeader
        eyebrow="ADMIN"
        title={`Hello, ${overview.adminName?.split(' ')[0] ?? 'admin'}!`}
        intro="Here is what's happening on StudySathi."
      />
      <div className="stat-grid">
        {cards.map(({ label, value, href, Icon }) => (
          <Link key={label} href={href} className="stat-card">
            <Icon size={22} aria-hidden="true" />
            <strong>{value}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {catalog.source === 'seed' && (
        <div className="notice">
          <Database size={20} aria-hidden="true" />
          <div>
            <h3>The public site is showing the built-in catalogue</h3>
            <p>
              Firestore has no resources yet or could not be reached. Run <code>npm run seed</code>{' '}
              to load the catalogue.
            </p>
          </div>
        </div>
      )}

      <section className="admin-card">
        <div className="admin-card-head">
          <h2>Recent activity</h2>
          <Link className="text-link" href="/admin/resources">
            Manage resources <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {activity.length ? (
          <ul className="activity-list">
            {activity.map((a) => (
              <li key={a.id}>
                <span>
                  <strong>{actionLabels[a.action] ?? a.action}</strong>
                  {a.summary ? `: ${a.summary}` : ''}
                </span>
                <time dateTime={a.at?.toISOString()}>{a.at ? dateFormat.format(a.at) : ''}</time>
              </li>
            ))}
          </ul>
        ) : (
          <p>No admin activity yet.</p>
        )}
      </section>
    </>
  );
}
