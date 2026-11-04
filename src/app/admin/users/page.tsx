import { Search } from 'lucide-react';
import type { Metadata } from 'next';
import { PortalHeader } from '@/components/admin/PortalHeader';
import { UserRowControls } from '@/components/admin/UserRowControls';
import { listUsersForAdmin } from '@/lib/admin/users';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'Users · Admin', robots: { index: false } };

const roleLabels: Record<string, string> = {
  student: 'Student',
  parent: 'Parent',
  creator: 'Creator',
  admin: 'Admin',
};

export default async function AdminUsersPage({ searchParams }: PageProps<'/admin/users'>) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q.slice(0, 100) : '';
  const [me, { users, total, capped }] = await Promise.all([
    getCurrentUser(),
    listUsersForAdmin(q),
  ]);

  return (
    <>
      <PortalHeader
        eyebrow="PEOPLE"
        title="Users"
        intro="Change roles or turn accounts off. People are signed out when their role or access changes."
      />

      <form className="admin-search" role="search" action="/admin/users">
        <label className="sr-only" htmlFor="user-search">
          Search users
        </label>
        <Search size={18} aria-hidden="true" />
        <input
          id="user-search"
          name="q"
          defaultValue={q}
          placeholder="Search by name, email, username or role"
        />
        <button className="button secondary" type="submit">
          Search
        </button>
      </form>
      <p className="admin-count" role="status">
        {q ? `${users.length} of ${total} accounts match “${q}”.` : `${total} accounts.`}
        {capped && ' Showing the first 1,000 accounts.'}
      </p>

      {users.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <caption className="sr-only">Accounts</caption>
            <thead>
              <tr>
                <th scope="col">Person</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Manage</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid}>
                  <td>
                    <strong>{u.name || 'No name'}</strong>
                    <small>{u.login}</small>
                  </td>
                  <td>
                    <span className={`chip role-${u.role ?? 'none'}`}>
                      {u.role ? roleLabels[u.role] : 'No role'}
                    </span>
                    {u.wantsToCreate && <span className="chip chip-info">Wants to create</span>}
                  </td>
                  <td>
                    <span className={u.disabled ? 'chip chip-muted' : 'chip chip-success'}>
                      {u.disabled ? 'Turned off' : 'Active'}
                    </span>
                  </td>
                  <td>
                    {u.uid === me?.uid ? (
                      <small>This is you</small>
                    ) : (
                      <UserRowControls
                        uid={u.uid}
                        name={u.name || u.login}
                        role={u.role}
                        disabled={u.disabled}
                        suggestCreator={u.wantsToCreate}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No accounts match your search.</p>
      )}
    </>
  );
}
