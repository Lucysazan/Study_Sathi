import type { Metadata } from 'next';
import { PortalWelcome } from '@/components/portal/PortalWelcome';

export const metadata: Metadata = { title: 'Parent area', robots: { index: false } };

export default function ParentPage() {
  return (
    <PortalWelcome
      eyebrow="PARENT AREA"
      comingSoon="Soon you can add your children's accounts here and follow their progress."
    />
  );
}
