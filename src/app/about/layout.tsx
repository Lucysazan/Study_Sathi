import { DeckPage } from '@/components/layout/DeckPage';

export default function AboutLayout({ children }: LayoutProps<'/about'>) {
  return <DeckPage>{children}</DeckPage>;
}
