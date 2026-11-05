import { describe, expect, it } from 'vitest';
import { courseReviewNoteSchema } from './review';

describe('courseReviewNoteSchema', () => {
  it('accepts a detailed review note', () => {
    const result = courseReviewNoteSchema.safeParse({
      note: 'The concept is strong, but the outline needs clearer lesson sequencing and a short reflection at the end of each module.',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a short note', () => {
    const result = courseReviewNoteSchema.safeParse({
      note: 'Too short',
    });

    expect(result.success).toBe(false);
  });
});
