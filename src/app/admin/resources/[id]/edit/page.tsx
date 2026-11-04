import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PortalHeader } from '@/components/admin/PortalHeader';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { PortalLoading } from '@/components/portal/PortalShell';
import { getResourceForAdmin } from '@/lib/admin/resources';

export const metadata: Metadata = { title: 'Edit resource · Admin', robots: { index: false } };

async function EditResourceBody({ params }: PageProps<'/admin/resources/[id]/edit'>) {
  const resource = await getResourceForAdmin((await params).id);
  if (!resource) notFound();
  const { order: _order, ...fields } = resource;
  return (
    <>
      <PortalHeader eyebrow="RESOURCES" title={`Edit “${resource.title}”`} />
      <ResourceForm resource={fields} />
    </>
  );
}

export async function EditResourcePage(props: PageProps<'/admin/resources/[id]/edit'>) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <EditResourceBody {...props} />
    </Suspense>
  );
}

export default function EditResourceRoute(props: PageProps<'/admin/resources/[id]/edit'>) {
  return <EditResourcePage {...props} />;
}
