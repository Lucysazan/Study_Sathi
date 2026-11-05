import { expect, it } from 'vitest';
import { summarizeCourseProgress } from './progress-summary';

it('counts only existing lessons and resumes the first incomplete lesson', () => {
  const course = {
    outline: {
      modules: [
        {
          lessons: [
            { id: 'a', title: 'A' },
            { id: 'b', title: 'B' },
          ],
        },
      ],
    },
  };
  expect(
    summarizeCourseProgress('course', 'Course', course, ['a', 'a', 'deleted', null]),
  ).toMatchObject({
    done: 1,
    total: 2,
    complete: false,
    path: '/learn/courses/course/b',
  });
  expect(summarizeCourseProgress('course', 'Course', course, ['a', 'b']).complete).toBe(true);
});

it('does not label an empty course complete', () => {
  expect(summarizeCourseProgress('course', 'Course', {}, null)).toMatchObject({
    done: 0,
    total: 0,
    complete: false,
  });
});
