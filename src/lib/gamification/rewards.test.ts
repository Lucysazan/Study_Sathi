import { describe, expect, it } from 'vitest';
import { learningDay, learningWeek, levelInfo, nextStreak, statsSchema } from './stats';
import { lessonReward, quizReward } from './rewards';

const fresh = () => statsSchema.parse({});
const now = new Date('2026-11-05T10:00:00Z');
const input = { now, completedCourse: false, category: 'science' };
describe('learner reward rules', () => {
  it('awards the safety badge only for the explicit Digital Safety category', () => {
    expect(
      lessonReward(fresh(), { ...input, completedCourse: true, category: 'digital-safety' })
        .newBadges,
    ).toContain('safe-explorer');
    expect(
      lessonReward(fresh(), { ...input, completedCourse: true, category: 'digital-skills' })
        .newBadges,
    ).not.toContain('safe-explorer');
  });
  it('awards a trusted quiz pass without changing lesson count or streak', () => {
    const result = quizReward({ ...fresh(), xp: 95 }, now);
    expect(result).toMatchObject({ xpAwarded: 5, dailyBonus: 0, courseBonus: 0 });
    expect(result.stats).toMatchObject({
      xp: 100,
      lessonCount: 0,
      lastActiveDate: null,
      streakDays: 0,
      quizPerfect: true,
    });
    expect(result.newBadges).toContain('sharp-thinker');
    expect(result.newBadges).toContain('curious-mind');
    expect(quizReward(result.stats, now).newBadges).not.toContain('sharp-thinker');
  });
  it('awards the first lesson and daily bonus with a first-steps badge', () => {
    const reward = lessonReward(fresh(), input);
    expect(reward).toMatchObject({
      xpAwarded: 15,
      dailyBonus: 5,
      courseBonus: 0,
      newBadges: ['first-steps'],
    });
    expect(reward.stats).toMatchObject({ xp: 15, streakDays: 1, lessonCount: 1, weeklyXp: 15 });
  });
  it('does not repeat daily bonuses or already earned badges on the same day', () => {
    const first = lessonReward(fresh(), input);
    const second = lessonReward(first.stats, input);
    expect(second.xpAwarded).toBe(10);
    expect(second.newBadges).toEqual([]);
    expect(second.stats.streakDays).toBe(1);
  });
  it('adds the course bonus and its badge on the completing lesson', () => {
    const reward = lessonReward(fresh(), { ...input, completedCourse: true });
    expect(reward.xpAwarded).toBe(65);
    expect(reward.stats).toMatchObject({
      courseCount: 1,
      level: 2,
      completedCategories: ['science'],
    });
    expect(reward.newBadges).toContain('course-finisher');
    expect(reward.newBadges).not.toContain('sharp-thinker');
  });
  it('extends consecutive days, resets gaps gently and handles leap days', () => {
    expect(
      nextStreak({ ...fresh(), streakDays: 2, lastActiveDate: '2026-11-04' }, '2026-11-05').days,
    ).toBe(3);
    expect(
      nextStreak({ ...fresh(), streakDays: 7, lastActiveDate: '2026-11-02' }, '2026-11-05').days,
    ).toBe(1);
    expect(
      nextStreak({ ...fresh(), streakDays: 1, lastActiveDate: '2028-02-28' }, '2028-02-29').days,
    ).toBe(2);
    expect(
      nextStreak({ ...fresh(), streakDays: 1, lastActiveDate: '2026-11-06' }, '2026-11-05')
        .dailyBonus,
    ).toBe(0);
  });
  it('awards threshold and streak badges from trusted totals', () => {
    const reward = lessonReward(
      { ...fresh(), xp: 90, streakDays: 2, lastActiveDate: '2026-11-04' },
      input,
    );
    expect(reward.newBadges).toContain('curious-mind');
    expect(reward.newBadges).toContain('three-day-sprout');
  });
  it('uses Kathmandu midnight and Sunday rollover', () => {
    expect(learningDay(new Date('2026-11-05T18:14:59Z'))).toBe('2026-11-05');
    expect(learningDay(new Date('2026-11-05T18:15:00Z'))).toBe('2026-11-06');
    expect(learningWeek(new Date('2026-11-07T18:14:59Z'))).toBe('2026-11-01');
    expect(learningWeek(new Date('2026-11-07T18:15:00Z'))).toBe('2026-11-08');
    expect(
      lessonReward({ ...fresh(), weeklyPeriod: '2026-10-25', weeklyXp: 500 }, input).stats.weeklyXp,
    ).toBe(15);
  });
  it('computes exact level thresholds and bounded progress', () => {
    for (const [xp, expected] of [
      [0, 1],
      [49, 1],
      [50, 2],
      [120, 3],
      [1000, 8],
      [1350, 9],
    ])
      expect(levelInfo(xp ?? 0).level).toBe(expected);
    expect(levelInfo(119)).toMatchObject({ remaining: 1, earned: 69 });
    expect(levelInfo(NaN).level).toBe(1);
    expect(levelInfo(-5).level).toBe(1);
  });
});
