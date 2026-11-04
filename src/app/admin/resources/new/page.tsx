import type { Metadata } from 'next';
import { PortalHeader } from '@/components/admin/PortalHeader';
import { ResourceForm } from '@/components/admin/ResourceForm';

export const metadata: Metadata = { title: 'Add resource · Admin', robots: { index: false } };

export default function NewResourcePage() {
  return (
    <>
      <PortalHeader
        eyebrow="RESOURCES"
        title="Add a resource"
        intro="Link to free material on its original website. Check it with care: children will open it."
      />
      <ResourceForm />
    </>
  );
}
