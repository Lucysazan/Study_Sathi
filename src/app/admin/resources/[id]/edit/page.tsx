import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortalHeader } from '@/components/admin/PortalHeader';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { getResourceForAdmin } from '@/lib/admin/resources';

export const metadata: Metadata = { title: 'Edit resource · Admin', robots: { index: false } };

export default async function EditResourcePage({
  params,
}: PageProps<'/admin/resources/[id]/edit'>) {
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
