import Link from 'next/link';
import type { ReactNode } from 'react';

export function AcademicFrame({ children }: { children: ReactNode }) {
  return (
    <section className="site-container section academic-shell">
      <div className="academic-breadcrumb">
        <Link href="/study" prefetch={false}>
          Academic study
        </Link>{' '}
        /{' '}
        <Link href="/study/9" prefetch={false}>
          Grade 9
        </Link>{' '}
        /{' '}
        <Link href="/study/9/mathematics" prefetch={false}>
          Mathematics
        </Link>
      </div>
      {children}
    </section>
  );
}
