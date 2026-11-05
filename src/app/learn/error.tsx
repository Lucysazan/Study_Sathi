'use client';
import { PortalRecovery } from '@/components/portal/PortalRecovery';
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return <PortalRecovery retry={retry} href="/learn" label="Back to my learning" />;
}
