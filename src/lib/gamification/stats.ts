import { z } from 'zod';

const counter = z.number().int().min(0).max(1000000000);
export const statsSchema = z.object({
  xp: counter.default(0),
  level: counter.default(1),
  streakDays: counter.default(0),
  lastActiveDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .default(null),
  quizPerfect: z.boolean().default(false),
  lessonCount: counter.default(0),
  courseCount: counter.default(0),
  badgeIds: z.array(z.string()).max(100).default([]),
  completedCategories: z.array(z.string()).max(100).default([]),
  weeklyPeriod: z.string().nullable().default(null),
  weeklyXp: counter.default(0),
  weeklyLessons: counter.default(0),
});
export type LearnerStats = z.infer<typeof statsSchema>;

const thresholds = [0, 50, 120, 220, 350, 520, 750, 1000] as const;
export function levelInfo(xp: number) {
  const safeXp = Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;
  const index =
    safeXp >= 1000
      ? 7 + Math.floor((safeXp - 1000) / 350)
      : thresholds.findLastIndex((threshold) => safeXp >= threshold);
  const start = thresholds[index] ?? 1000 + (index - 7) * 350;
  const next = thresholds[index + 1] ?? start + 350;
  return {
    level: index + 1,
    name:
      ['Seedling', 'Sprout', 'Sapling', 'Young Tree', 'Growing Tree', 'Strong Tree', 'Tall Tree'][
        index
      ] ?? 'Learning Tree',
    start,
    next,
    remaining: next - safeXp,
    earned: safeXp - start,
  };
}

export function learningDay(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  return ['year', 'month', 'day']
    .map((kind) => parts.find((part) => part.type === kind)?.value)
    .join('-');
}

export function learningWeek(now: Date): string {
  const date = new Date(`${learningDay(now)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date.toISOString().slice(0, 10);
}

export function nextStreak(previous: LearnerStats, today: string) {
  if (previous.lastActiveDate && today <= previous.lastActiveDate)
    return { days: previous.streakDays, dailyBonus: 0, date: previous.lastActiveDate };
  const consecutive =
    previous.lastActiveDate &&
    Date.parse(`${today}T00:00:00Z`) - Date.parse(`${previous.lastActiveDate}T00:00:00Z`) ===
      86400000;
  return { days: consecutive ? previous.streakDays + 1 : 1, dailyBonus: 5, date: today };
}

export function visibleActivity(stats: LearnerStats, now: Date) {
  const dates = [learningDay(now), learningDay(new Date(now.getTime() - 86400000))];
  return {
    streak: stats.lastActiveDate && dates.includes(stats.lastActiveDate) ? stats.streakDays : 0,
    weeklyLessons: stats.weeklyPeriod === learningWeek(now) ? stats.weeklyLessons : 0,
  };
}
