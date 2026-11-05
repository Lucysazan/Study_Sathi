import { describe, expect, it } from 'vitest';
import { courseDraftSchema, courseOutlineSchema } from './draft';

describe('courseDraftSchema', () => {
  it('accepts a valid draft', () => {
    const result = courseDraftSchema.safeParse({
      title: 'Foundations of Digital Skills',
      category: 'digital-skills',
      summary: 'A beginner-friendly course about using digital tools confidently at home and work.',
      ageRange: '12-15',
      status: 'draft',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a missing title and short summary', () => {
    const result = courseDraftSchema.safeParse({
      title: '',
      category: 'digital-skills',
      summary: 'Too short',
      ageRange: '12-15',
      status: 'draft',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'title')).toBe(true);
      expect(result.error.issues.some((issue) => issue.path[0] === 'summary')).toBe(true);
    }
  });
});

describe('courseOutlineSchema', () => {
  it('accepts a module with one lesson', () => {
    const result = courseOutlineSchema.safeParse({
      modules: [
        {
          id: 'm-1',
          title: 'Welcome module',
          lessons: [{ id: 'l-1', title: 'Welcome lesson', kind: 'video', duration: '10 min' }],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('accepts richer lesson block types for text, quiz, and reflection content', () => {
    const result = courseOutlineSchema.safeParse({
      modules: [
        {
          id: 'm-1',
          title: 'Digital safety fundamentals',
          lessons: [
            {
              id: 'l-1',
              title: 'Read and reflect',
              kind: 'text',
              duration: '7 min',
              content:
                'Digital safety means protecting your information and asking trusted adults for help.',
            },
            {
              id: 'l-2',
              title: 'Quick check',
              kind: 'quiz',
              duration: '5 min',
              question: 'What should you do before sharing a password?',
              options: [
                'Share it with friends',
                'Keep it private and ask a trusted adult if needed',
                'Post it publicly',
              ],
              correctAnswer: 'Keep it private and ask a trusted adult if needed',
            },
            {
              id: 'l-3',
              title: 'Reflection prompt',
              kind: 'reflection',
              duration: '4 min',
              prompt: 'Which digital safety habit will you practice this week?',
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejects quiz questions without an answer option', () => {
    const result = courseOutlineSchema.safeParse({
      modules: [
        {
          id: 'm-1',
          title: 'Quiz review',
          lessons: [
            {
              id: 'l-1',
              title: 'Check your knowledge',
              kind: 'quiz',
              duration: '4 min',
              question: 'What should you do before sharing a password?',
              options: ['A', 'B'],
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
