import { beforeEach, describe, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({ get: vi.fn(), update: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth/session', () => ({ requireRole: async () => ({ uid: 'creator' }) }));
vi.mock('@/lib/firebase/admin', () => ({
  adminDb: () => ({
    collection: (name: string) => ({ doc: (id: string) => `${name}/${id}` }),
    runTransaction: (callback: (tx: { get: typeof m.get; update: typeof m.update }) => unknown) =>
      callback({ get: m.get, update: m.update }),
  }),
}));
import { saveCourseOutline, submitCourseForReview } from './actions';
const outline = {
  modules: [
    {
      id: 'part',
      title: 'Part one',
      lessons: [
        {
          id: 'lesson',
          title: 'Introduction',
          kind: 'text',
          duration: '5 min',
          content: 'Learn something new today.',
        },
      ],
    },
  ],
};
function current(overrides: Record<string, unknown> = {}) {
  const data: Record<string, unknown> = {
    createdBy: 'creator',
    status: 'draft',
    title: 'A course',
    summary: 'A helpful summary for learners.',
    outline,
    ...overrides,
  };
  return { exists: true, get: (key: string) => data[key] };
}
beforeEach(() => {
  vi.resetAllMocks();
});
describe('creator write boundary', () => {
  it('stores the canonical outline object', async () => {
    m.get.mockResolvedValue(current());
    expect((await saveCourseOutline('course', outline)).ok).toBe(true);
    expect(m.update).toHaveBeenCalledWith('courses/course', expect.objectContaining({ outline }));
  });
  it('blocks edits to published courses and another creator’s courses', async () => {
    for (const data of [{ status: 'published' }, { createdBy: 'other' }]) {
      m.get.mockResolvedValue(current(data));
      expect((await saveCourseOutline('course', outline)).ok).toBe(false);
    }
    expect(m.update).not.toHaveBeenCalled();
  });
  it('blocks media drafts from submission until links and descriptions are ready', async () => {
    m.get.mockResolvedValue(
      current({
        outline: {
          modules: [
            {
              ...outline.modules[0],
              lessons: [{ id: 'image', title: 'An image', kind: 'image', duration: '5 min' }],
            },
          ],
        },
      }),
    );
    expect((await submitCourseForReview('course')).ok).toBe(false);
    expect(m.update).not.toHaveBeenCalled();
  });
  it('submits legacy array outlines in canonical form', async () => {
    m.get.mockResolvedValue(current({ outline: outline.modules }));
    expect((await submitCourseForReview('course')).ok).toBe(true);
    expect(m.update).toHaveBeenCalledWith(
      'courses/course',
      expect.objectContaining({ status: 'review', outline }),
    );
  });
});
