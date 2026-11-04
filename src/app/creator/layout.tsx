import { PortalShell } from '@/components/portal/PortalShell';

export default function CreatorLayout({ children }: LayoutProps<'/creator'>) {
  return (
    <PortalShell allowed={['creator']} returnTo="/creator">
      {children}
    </PortalShell>
  );
}
