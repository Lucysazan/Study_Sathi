import { DeckPage } from '@/components/layout/DeckPage';

export default function ResourcesLayout({ children }: LayoutProps<'/resources'>) {
  return <DeckPage>{children}</DeckPage>;
}
