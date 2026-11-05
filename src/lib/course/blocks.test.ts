import { describe, expect, it } from 'vitest';
import { courseOutlineSchema, courseReadySchema } from './draft';
import { readCourseOutline } from './outline';
import { findLessonById, getNextLessonId } from './learning';

const text = {
  id: 'read',
  title: 'Read first',
  duration: '2 min',
  kind: 'text',
  content: 'Read this short explanation before practising.',
};
const image = {
  id: 'see',
  title: 'Look closely',
  duration: '2 min',
  kind: 'image',
  mediaUrl: 'https://example.com/image.png',
  alt: 'A tree with green leaves',
};
const lesson = {
  id: 'lesson',
  title: 'Learn and practise',
  duration: '10 min',
  kind: 'text',
  blocks: [text, image],
};
const course = (lessons: unknown[]) => ({ modules: [{ id: 'part', title: 'Part one', lessons }] });

describe('stacked lesson compatibility', () => {
  it('validates blocks instead of requiring unused parent content', () => {
    const parsed = courseReadySchema.safeParse(course([lesson]));
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.modules[0]?.lessons[0]?.blocks).toHaveLength(2);
  });
  it('keeps old single-format lessons and array outlines readable', () => {
    expect(readCourseOutline(course([text]))?.modules[0]?.lessons[0]?.content).toBe(text.content);
    expect(
      readCourseOutline(course([lesson]).modules)?.modules[0]?.lessons[0]?.blocks?.[1]?.alt,
    ).toBe(image.alt);
  });
  it('checks child media readiness and reports its exact position', () => {
    const result = courseReadySchema.safeParse(
      course([{ ...lesson, blocks: [text, { ...image, alt: '' }] }]),
    );
    expect(result.success).toBe(false);
    if (!result.success)
      expect(
        result.error.issues.some(
          (issue) => issue.path.join('.') === 'modules.0.lessons.0.blocks.1.alt',
        ),
      ).toBe(true);
  });
  it('rejects duplicate block/lesson IDs, empty stacks and oversized outlines', () => {
    expect(
      courseOutlineSchema.safeParse(course([{ ...lesson, blocks: [text, text] }])).success,
    ).toBe(false);
    expect(
      courseOutlineSchema.safeParse(course([{ ...lesson, blocks: [{ ...text, id: lesson.id }] }]))
        .success,
    ).toBe(false);
    expect(courseOutlineSchema.safeParse(course([{ ...lesson, blocks: [] }])).success).toBe(false);
    const lessons = Array.from({ length: 20 }, (_, index) => ({
      ...lesson,
      id: `lesson-${index}`,
      blocks: Array.from({ length: 12 }, (_, block) => ({
        ...text,
        id: `block-${index}-${block}`,
        content: 'a'.repeat(4000),
      })),
    }));
    expect(courseOutlineSchema.safeParse(course(lessons)).success).toBe(false);
  });
  it('keeps progress and navigation at the lesson level', () => {
    const data = { outline: course([lesson, { ...text, id: 'next' }]) };
    // The route helpers deliberately identify lessons, never a child activity.
    const parsed = courseOutlineSchema.parse(data.outline);
    expect(findLessonById({ outline: parsed }, 'read')).toBeNull();
    expect(getNextLessonId({ outline: parsed }, 'lesson')).toBe('next');
  });
});
