import type { ReactNode } from 'react';
import { Logo } from '@/components/layout/Logo';

/** Centred auth card on the off-white canvas, logo above (DESIGN.md "Auth pages"). */
export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <Logo />
        <div className="auth-panel">{children}</div>
      </div>
    </section>
  );
}
