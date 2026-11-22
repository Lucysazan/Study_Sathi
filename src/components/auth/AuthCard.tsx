import type { ReactNode } from 'react';
import { PeekArt } from '@/components/art/PeekArt';
import { Logo } from '@/components/layout/Logo';

/** Auth slide: a marigold panel with a peeking learner beside the form (paper-deck design). */
export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <section className="auth-page">
      <div className="auth-card slide">
        <div className="auth-art" data-eyes>
          <PeekArt />
        </div>
        <div className="auth-body">
          <Logo />
          <div className="auth-panel">{children}</div>
        </div>
      </div>
    </section>
  );
}
