import { badges } from '@/data/seed/badges';
import { learningDay, learningWeek, levelInfo, nextStreak, type LearnerStats } from './stats';

export type LessonRewardInput = { now: Date; completedCourse: boolean; category: string };
export function lessonReward(previous: LearnerStats, input: LessonRewardInput) {
  const streak = nextStreak(previous, learningDay(input.now));
  const courseBonus = input.completedCourse ? 50 : 0;
  const xpAwarded = 10 + streak.dailyBonus + courseBonus;
  const weeklyPeriod = learningWeek(input.now);
  const stats: LearnerStats = {
    ...previous,
    xp: previous.xp + xpAwarded,
    streakDays: streak.days,
    lastActiveDate: streak.date,
    lessonCount: previous.lessonCount + 1,
    courseCount: previous.courseCount + Number(input.completedCourse),
    completedCategories: input.completedCourse
      ? [...new Set([...previous.completedCategories, input.category])]
      : previous.completedCategories,
    weeklyPeriod,
    weeklyXp: (previous.weeklyPeriod === weeklyPeriod ? previous.weeklyXp : 0) + xpAwarded,
    weeklyLessons: (previous.weeklyPeriod === weeklyPeriod ? previous.weeklyLessons : 0) + 1,
  };
  stats.level = levelInfo(stats.xp).level;
  const newBadges = updateBadges(stats, previous.badgeIds);
  return { stats, xpAwarded, newBadges, dailyBonus: streak.dailyBonus, courseBonus };
}

function updateBadges(stats: LearnerStats, previousBadges: string[]) {
  const earned = badges
    .filter((badge) => {
      switch (badge.rule.type) {
        case 'first_lesson':
          return stats.lessonCount > 0;
        case 'course_complete':
          return stats.courseCount >= badge.rule.value;
        case 'streak_days':
          return stats.streakDays >= badge.rule.value;
        case 'xp_total':
          return stats.xp >= badge.rule.value;
        case 'category_complete':
          return stats.completedCategories.includes(badge.rule.value);
        case 'quiz_perfect':
          return stats.quizPerfect;
      }
    })
    .map((badge) => badge.id);
  const newBadges = earned.filter((id) => !previousBadges.includes(id));
  stats.badgeIds = [...new Set([...previousBadges, ...earned])];
  return newBadges;
}

export function quizReward(previous: LearnerStats, now: Date) {
  const weeklyPeriod = learningWeek(now);
  const stats: LearnerStats = {
    ...previous,
    xp: previous.xp + 5,
    quizPerfect: true,
    weeklyPeriod,
    weeklyXp: (previous.weeklyPeriod === weeklyPeriod ? previous.weeklyXp : 0) + 5,
    weeklyLessons: previous.weeklyPeriod === weeklyPeriod ? previous.weeklyLessons : 0,
  };
  stats.level = levelInfo(stats.xp).level;
  const newBadges = updateBadges(stats, previous.badgeIds);
  return { stats, xpAwarded: 5, newBadges, dailyBonus: 0, courseBonus: 0 };
}
