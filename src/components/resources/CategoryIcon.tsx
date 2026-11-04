import { getCategoryMeta } from '@/lib/categories';

/** Lucide icon for a category. Decorative: the category is always named in text nearby. */
export function CategoryIcon({ category, size = 22 }: { category: string; size?: number }) {
  const { Icon } = getCategoryMeta(category);
  return <Icon size={size} aria-hidden="true" />;
}
