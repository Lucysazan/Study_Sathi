import { DeckPage } from '@/components/layout/DeckPage';

export default function VolunteersLayout({ children }: LayoutProps<'/volunteers'>) {
  return <DeckPage>{children}</DeckPage>;
}
