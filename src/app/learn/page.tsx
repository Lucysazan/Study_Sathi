import type { Metadata } from 'next';
import Link from 'next/link';
import { PortalWelcome } from '@/components/portal/PortalWelcome';

export const metadata: Metadata = { title: 'My learning', robots: { index: false } };

export default function LearnPage() {
  return (
    <PortalWelcome
      eyebrow="MY LEARNING"
      comingSoon="Your courses, XP and badges will appear here soon."
    >
      <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <Link href="/learn/profile" className="button secondary">
          My profile
        </Link>
        <Link href="/learn/courses" className="button primary">
          Explore courses
        </Link>
      </div>
    </PortalWelcome>
  );
}
