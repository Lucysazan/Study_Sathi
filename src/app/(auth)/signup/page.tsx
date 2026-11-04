import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create a StudySathi account as a parent, guardian or course creator.',
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <AuthCard>
      <SignupForm />
    </AuthCard>
  );
}
