import { PortalShell } from '@/components/portal/PortalShell';

export default function ParentLayout({ children }: LayoutProps<'/parent'>) {
  return (
    <PortalShell allowed={['parent']} returnTo="/parent">
      {children}
    </PortalShell>
  );
}
