/**
 * Starter badges (rule types from ARCHITECTURE §5). Seed source for `badges/{id}`.
 * Copy celebrates effort, never compares children. Icons are lucide names.
 */
export type BadgeRule =
  | { type: 'first_lesson' }
  | { type: 'course_complete'; value: number }
  | { type: 'category_complete'; value: string }
  | { type: 'streak_days'; value: number }
  | { type: 'xp_total'; value: number }
  | { type: 'quiz_perfect' };

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  rule: BadgeRule;
};

export const badges: readonly Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'You finished your first lesson. Every journey starts here!',
    icon: 'Footprints',
    rule: { type: 'first_lesson' },
  },
  {
    id: 'course-finisher',
    name: 'Course Finisher',
    description: 'You completed a whole course. Well done for keeping going!',
    icon: 'GraduationCap',
    rule: { type: 'course_complete', value: 1 },
  },
  {
    id: 'three-day-sprout',
    name: 'Three-Day Sprout',
    description: 'You learned something three days in a row.',
    icon: 'Sprout',
    rule: { type: 'streak_days', value: 3 },
  },
  {
    id: 'week-of-learning',
    name: 'Week of Learning',
    description: 'Seven days of learning in a row. What a habit!',
    icon: 'Leaf',
    rule: { type: 'streak_days', value: 7 },
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    description: 'You earned 100 XP by exploring and practising.',
    icon: 'Sparkles',
    rule: { type: 'xp_total', value: 100 },
  },
  {
    id: 'sharp-thinker',
    name: 'Sharp Thinker',
    description: 'You got every answer right in a quiz.',
    icon: 'Lightbulb',
    rule: { type: 'quiz_perfect' },
  },
  {
    id: 'safe-explorer',
    name: 'Safe Explorer',
    description: 'You completed a Digital Safety course.',
    icon: 'ShieldCheck',
    rule: { type: 'category_complete', value: 'Digital Safety' },
  },
];
