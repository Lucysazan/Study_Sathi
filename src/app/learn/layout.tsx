import { Suspense } from 'react';
import { StudentToolbar } from '@/components/portal/StudentToolbar';
import { PortalShell } from '@/components/portal/PortalShell';

export default function LearnLayout({ children }: LayoutProps<'/learn'>) {
  return (
    <PortalShell allowed={['student']} returnTo="/learn">
      <Suspense
        fallback={
          <div className="site-container" role="status">
            Loading learning account?
          </div>
        }
      >
        <StudentToolbar />
      </Suspense>
      {children}
    </PortalShell>
  );
}
