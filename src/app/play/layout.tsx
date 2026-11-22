import { DeckPage } from '@/components/layout/DeckPage';

export default function PlayLayout({ children }: LayoutProps<'/play'>) {
  return <DeckPage>{children}</DeckPage>;
}
