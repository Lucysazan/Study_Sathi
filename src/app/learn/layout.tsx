import { PortalShell } from '@/components/portal/PortalShell';

export default function LearnLayout({ children }: LayoutProps<'/learn'>) {
  return (
    <PortalShell allowed={['student']} returnTo="/learn">
      {children}
    </PortalShell>
  );
}
