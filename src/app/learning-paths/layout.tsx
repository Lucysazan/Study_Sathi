import { DeckPage } from '@/components/layout/DeckPage';

export default function LearningPathsLayout({ children }: LayoutProps<'/learning-paths'>) {
  return <DeckPage>{children}</DeckPage>;
}
