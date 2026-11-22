import { DeckPage } from '@/components/layout/DeckPage';

export default function SavedLayout({ children }: LayoutProps<'/saved'>) {
  return <DeckPage>{children}</DeckPage>;
}
