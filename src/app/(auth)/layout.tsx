import type { ReactNode } from 'react';
import { DeckPage } from '@/components/layout/DeckPage';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <DeckPage>{children}</DeckPage>;
}
