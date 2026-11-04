import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { PortalShell } from '@/components/portal/PortalShell';

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <PortalShell allowed={['admin']} returnTo="/admin">
      <div className="site-container portal-layout">
        <AdminSidebar />
        <div className="portal-main">{children}</div>
      </div>
    </PortalShell>
  );
}
