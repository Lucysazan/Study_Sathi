import {
  BookOpen,
  Gamepad2,
  GraduationCap,
  Heart,
  Leaf,
  type LucideIcon,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { categories } from './filters';

export type CategoryMeta = {
  name: string;
  /** CSS class for the category tint (see "academic", "digital"… in globals.css). */
  className: string;
  description: string;
  Icon: LucideIcon;
};

/** Category look and copy, in the same order as `categories` (from the prototype). */
export const categoryMeta: readonly CategoryMeta[] = [
  {
    name: 'Academic Education',
    className: 'academic',
    description: 'Mathematics, science, languages and more.',
    Icon: GraduationCap,
  },
  {
    name: 'Digital Safety',
    className: 'digital',
    description: 'Safer, kinder adventures on the internet.',
    Icon: ShieldCheck,
  },
  {
    name: 'Financial Literacy',
    className: 'financial',
    description: 'Saving, spending and everyday money skills.',
    Icon: Wallet,
  },
  {
    name: 'Life Skills',
    className: 'life',
    description: 'Confidence, communication and growing together.',
    Icon: Heart,
  },
  {
    name: 'Learning Games',
    className: 'games',
    description: 'Learn through play, coding and creativity.',
    Icon: Gamepad2,
  },
  {
    name: 'Environment',
    className: 'environment',
    description: 'Small steps for a greener, healthier planet.',
    Icon: Leaf,
  },
];

const fallback: CategoryMeta = {
  name: '',
  className: 'academic',
  description: '',
  Icon: BookOpen,
};

export function getCategoryMeta(category: string): CategoryMeta {
  return categoryMeta.find((c) => c.name === category) ?? { ...fallback, name: category };
}

// Keep the two lists aligned: fails loudly in development if a category is added to one only.
if (process.env.NODE_ENV !== 'production') {
  const names = categoryMeta.map((c) => c.name).join('|');
  if (names !== categories.join('|')) {
    console.warn('categoryMeta and filters.categories are out of sync');
  }
}
