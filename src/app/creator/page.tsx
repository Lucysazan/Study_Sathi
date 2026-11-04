import type { Metadata } from 'next';
import { PortalWelcome } from '@/components/portal/PortalWelcome';

export const metadata: Metadata = { title: 'Creator studio', robots: { index: false } };

export default function CreatorPage() {
  return (
    <PortalWelcome
      eyebrow="CREATOR STUDIO"
      comingSoon="The course builder is on its way. You'll be able to create and submit courses here."
    />
  );
}
