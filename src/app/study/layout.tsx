import { DeckPage } from '@/components/layout/DeckPage';

export default function StudyLayout({ children }: LayoutProps<'/study'>) {
  return <DeckPage>{children}</DeckPage>;
}
