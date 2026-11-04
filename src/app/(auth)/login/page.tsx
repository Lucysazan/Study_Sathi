import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm, LoginFormFromUrl } from '@/components/auth/LoginForm';
import { studentLoginDomain } from '@/lib/env/public-config';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to StudySathi as a student, parent or course creator.',
  robots: { index: false },
};

export default function LoginPage() {
  const domain = studentLoginDomain();
  return (
    <AuthCard>
      {/* LoginForm reads ?next=, so it needs a Suspense boundary (Cache Components). */}
      <Suspense fallback={<LoginForm studentLoginDomain={domain} next={null} />}>
        <LoginFormFromUrl studentLoginDomain={domain} />
      </Suspense>
    </AuthCard>
  );
}
