import { expect, it } from 'vitest';
import { lessonReward, quizReward } from './rewards';
import { statsSchema, visibleActivity } from './stats';

it('resets lessons at the Kathmandu Sunday boundary even when a quiz happens first', () => {
  const saturday = new Date('2026-11-07T18:14:00Z');
  const sunday = new Date('2026-11-07T18:15:00Z');
  const previous = lessonReward(statsSchema.parse({}), {
    now: saturday,
    completedCourse: false,
    category: 'science',
  }).stats;
  expect(visibleActivity(previous, saturday).weeklyLessons).toBe(1);
  expect(visibleActivity(previous, sunday).weeklyLessons).toBe(0);
  const quiz = quizReward(previous, sunday).stats;
  expect(quiz.weeklyLessons).toBe(0);
  const lesson = lessonReward(quiz, {
    now: sunday,
    completedCourse: false,
    category: 'science',
  }).stats;
  expect(lesson.weeklyLessons).toBe(1);
  expect(lesson.lessonCount).toBe(2);
  expect(quizReward(lesson, sunday).stats.weeklyLessons).toBe(1);
});
