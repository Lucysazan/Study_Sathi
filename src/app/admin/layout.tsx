import { PortalShell } from '@/components/portal/PortalShell';

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <PortalShell allowed={['admin']} returnTo="/admin">
      {children}
    </PortalShell>
  );
}
