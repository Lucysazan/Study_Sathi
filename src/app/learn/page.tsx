import type { Metadata } from 'next';
import { PortalWelcome } from '@/components/portal/PortalWelcome';

export const metadata: Metadata = { title: 'My learning', robots: { index: false } };

export default function LearnPage() {
  return (
    <PortalWelcome
      eyebrow="MY LEARNING"
      comingSoon="Your courses, XP and badges will appear here soon."
    />
  );
}
