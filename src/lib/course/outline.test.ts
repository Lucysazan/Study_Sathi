import { describe, expect, it } from 'vitest';
import { readCourseOutline } from './outline';

describe('course outline compatibility', () => {
  const modules = [
    {
      id: 'part',
      title: 'Part one',
      lessons: [
        {
          id: 'intro',
          title: 'Introduction',
          kind: 'text',
          duration: '5 min',
          content: 'Learn something new today.',
        },
      ],
    },
  ];
  it('reads old array and canonical object formats identically', () => {
    expect(readCourseOutline(modules)).toEqual(readCourseOutline({ modules }));
  });
  it('returns null for malformed content', () => {
    expect(readCourseOutline('bad')).toBeNull();
    expect(readCourseOutline({ modules: [{ title: 42 }] })).toBeNull();
  });
});
