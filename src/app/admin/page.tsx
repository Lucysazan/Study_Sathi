import type { Metadata } from 'next';
import { PortalWelcome } from '@/components/portal/PortalWelcome';

export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

export default function AdminPage() {
  return (
    <PortalWelcome
      eyebrow="ADMIN"
      comingSoon="The admin area (resources, users and reviews) is being built next."
    />
  );
}
