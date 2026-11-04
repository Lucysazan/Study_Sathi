import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PortalHeader, StatusNote } from '@/components/admin/PortalHeader';
import { ResourceRowActions } from '@/components/admin/ResourceRowActions';
import { PortalLoading } from '@/components/portal/PortalShell';
import { listResourcesForAdmin } from '@/lib/admin/resources';

export const metadata: Metadata = { title: 'Resources · Admin', robots: { index: false } };

async function AdminResourcesBody({ searchParams }: PageProps<'/admin/resources'>) {
  const [resources, params] = await Promise.all([listResourcesForAdmin(), searchParams]);
  const saved = typeof params.saved === 'string' ? params.saved : null;

  return (
    <>
      <PortalHeader
        eyebrow="CURATED LIBRARY"
        title="Resources"
        intro="Links to free materials from their original providers. Changes appear on the public site straight away."
        action={
          <Link className="button" href="/admin/resources/new">
            <Plus size={17} aria-hidden="true" /> Add resource
          </Link>
        }
      />
      {saved && <StatusNote>Saved “{saved}”.</StatusNote>}

      {resources.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <caption className="sr-only">All resources ({resources.length})</caption>
            <thead>
              <tr>
                <th scope="col">Resource</th>
                <th scope="col">Category</th>
                <th scope="col">Ages</th>
                <th scope="col">Language</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.title}</strong>
                    <small>{r.provider}</small>
                  </td>
                  <td>{r.category}</td>
                  <td>{r.age}</td>
                  <td>{r.language}</td>
                  <td>
                    <ResourceRowActions id={r.id} title={r.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="notice">
          <div>
            <h3>No resources in Firestore yet</h3>
            <p>
              Run <code>npm run seed</code> to load the curated catalogue, or add one by hand.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export async function AdminResourcesPage(props: PageProps<'/admin/resources'>) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminResourcesBody {...props} />
    </Suspense>
  );
}

export default function AdminResourcesRoute(props: PageProps<'/admin/resources'>) {
  return <AdminResourcesPage {...props} />;
}
