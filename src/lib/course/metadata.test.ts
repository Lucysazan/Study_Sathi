import { describe, expect, it } from 'vitest';
import { courseDraftSchema } from './draft';
import { courseChecklist, readCourseMetadata } from './metadata';

const metadata = {
  title: 'Explore science',
  category: 'science',
  summary: 'Explore everyday science with simple activities.',
  ageRange: '12-15',
  budget: '2 hours',
  language: 'Nepali',
  coverImageUrl: 'https://example.com/cover.png',
  coverAlt: 'Leaves under a microscope',
};
const outline = {
  modules: [
    {
      id: 'part',
      title: 'Part one',
      lessons: [
        {
          id: 'intro',
          title: 'Introduction',
          kind: 'text',
          duration: '5 min',
          content: 'A short introduction to science.',
        },
      ],
    },
  ],
};
describe('course metadata readiness', () => {
  it('keeps legacy drafts editable without inferring a teaching language', () => {
    const data = readCourseMetadata({
      ...metadata,
      language: undefined,
      coverImageUrl: undefined,
      coverAlt: undefined,
    });
    expect(data.language).toBe('');
    expect(data.coverImageUrl).toBe('');
    expect(courseDraftSchema.safeParse(data).success).toBe(true);
    expect(courseChecklist(data, outline)).toMatchObject({
      language: false,
      cover: false,
      ready: false,
    });
  });
  it('accepts complete course details and lessons', () => {
    expect(courseChecklist(metadata, outline).ready).toBe(true);
  });
  it('requires cover descriptions, an explicit language and valid general details', () => {
    expect(courseChecklist({ ...metadata, coverAlt: ' ' }, outline).cover).toBe(false);
    expect(courseChecklist({ ...metadata, language: '' }, outline).language).toBe(false);
    expect(courseChecklist({ ...metadata, ageRange: '' }, outline).details).toBe(false);
    expect(courseChecklist(metadata, { modules: [] }).lessons).toBe(false);
  });
  it('rejects unsafe links and unsupported language values', () => {
    for (const coverImageUrl of [
      'javascript:alert(1)',
      'http://example.com/cover.png',
      'https://user:pass@example.com/a.png',
    ])
      expect(courseDraftSchema.safeParse({ ...metadata, coverImageUrl }).success).toBe(false);
    expect(courseDraftSchema.safeParse({ ...metadata, language: 'Unknown' }).success).toBe(false);
  });
  it('validates nested image and quiz content as part of the same checklist', () => {
    const stack = {
      modules: [
        {
          id: 'part',
          title: 'Part one',
          lessons: [
            {
              id: 'lesson',
              title: 'Read and see',
              duration: '5 min',
              kind: 'text',
              blocks: [
                {
                  id: 'image',
                  title: 'See this',
                  duration: '2 min',
                  kind: 'image',
                  mediaUrl: 'https://example.com/a.png',
                },
              ],
            },
          ],
        },
      ],
    };
    expect(courseChecklist(metadata, stack).lessons).toBe(false);
  });
});
