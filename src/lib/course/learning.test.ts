import { describe, expect, it } from 'vitest';
import { findLessonById, getCourseLessonPath, getFirstLessonId } from './learning';

describe('course learning helpers', () => {
  const course = {
    id: 'course-1',
    outline: {
      modules: [
        {
          id: 'module-1',
          title: 'Welcome',
          lessons: [
            { id: 'lesson-1', title: 'Intro', kind: 'text', duration: '5 min' },
            { id: 'lesson-2', title: 'Check', kind: 'reflection', duration: '7 min' },
          ],
        },
      ],
    },
  };

  it('finds the lesson in the course outline', () => {
    expect(findLessonById(course, 'lesson-2')).toMatchObject({ id: 'lesson-2', title: 'Check' });
  });

  it('returns the first lesson id when no lesson is selected', () => {
    expect(getFirstLessonId(course)).toBe('lesson-1');
  });

  it('builds a route path to a lesson page', () => {
    expect(getCourseLessonPath('course-1', 'lesson-2')).toBe('/learn/courses/course-1/lesson-2');
  });
});
