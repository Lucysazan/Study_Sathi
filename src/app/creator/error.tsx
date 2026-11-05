'use client';
import { PortalRecovery } from '@/components/portal/PortalRecovery';
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return <PortalRecovery retry={retry} href="/creator" label="Back to studio" />;
}
