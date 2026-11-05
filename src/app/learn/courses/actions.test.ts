import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
  revalidate: vi.fn(),
  role: vi.fn(),
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidate }));
vi.mock('@/lib/auth/session', () => ({ requireRole: mocks.role }));
vi.mock('@/lib/firebase/admin', () => ({
  adminDb: () => ({
    collection: (collection: string) => ({ doc: (id: string) => `${collection}/${id}` }),
    runTransaction: (
      callback: (tx: {
        get: typeof mocks.get;
        set: typeof mocks.set;
        update: typeof mocks.update;
      }) => unknown,
    ) => callback({ get: mocks.get, set: mocks.set, update: mocks.update }),
  }),
}));

import { completeLesson } from './actions';

function snapshot(data: Record<string, unknown> | null) {
  return { exists: data !== null, data: () => data, get: (key: string) => data?.[key] };
}
const course = {
  status: 'published',
  outline: { modules: [{ lessons: [{ id: 'one' }, { id: 'two' }] }] },
};
function input(lessonId = 'one') {
  const form = new FormData();
  form.set('courseId', 'course');
  form.set('lessonId', lessonId);
  return form;
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.role.mockResolvedValue({ uid: 'student' });
});

describe('lesson completion boundary', () => {
  it('rejects invalid document paths before accessing auth or Firestore', async () => {
    expect((await completeLesson(input('../bad'))).ok).toBe(false);
    expect(mocks.role).not.toHaveBeenCalled();
    expect(mocks.get).not.toHaveBeenCalled();
  });
  it('rejects forged lesson IDs', async () => {
    mocks.get.mockResolvedValueOnce(snapshot(course));
    expect((await completeLesson(input('missing'))).ok).toBe(false);
    expect(mocks.set).not.toHaveBeenCalled();
  });
  it('rejects unpublished courses and missing enrollment', async () => {
    mocks.get.mockResolvedValueOnce(snapshot({ ...course, status: 'draft' }));
    expect((await completeLesson(input())).ok).toBe(false);
    mocks.get.mockResolvedValueOnce(snapshot(course)).mockResolvedValueOnce(snapshot(null));
    expect((await completeLesson(input())).ok).toBe(false);
    expect(mocks.set).not.toHaveBeenCalled();
  });
  it('saves progress and refreshes the learner routes', async () => {
    mocks.get
      .mockResolvedValueOnce(snapshot(course))
      .mockResolvedValueOnce(snapshot({}))
      .mockResolvedValueOnce(snapshot(null));
    expect((await completeLesson(input())).ok).toBe(true);
    expect(mocks.set).toHaveBeenCalledWith(
      'courseProgress/student_course',
      expect.objectContaining({ userId: 'student', nextLessonId: 'two' }),
      { merge: true },
    );
    expect(mocks.revalidate).toHaveBeenCalledWith('/learn/courses/course', 'layout');
  });
  it('does not write twice for a completed lesson', async () => {
    mocks.get
      .mockResolvedValueOnce(snapshot(course))
      .mockResolvedValueOnce(snapshot({}))
      .mockResolvedValueOnce(snapshot({ completedLessons: ['one'] }));
    expect((await completeLesson(input())).ok).toBe(true);
    expect(mocks.set).not.toHaveBeenCalled();
  });
  it('returns a retry message when storage fails', async () => {
    mocks.get.mockRejectedValueOnce(new Error('offline'));
    expect(await completeLesson(input())).toEqual({
      ok: false,
      error: 'We could not save your progress. Please try again.',
    });
  });
  it('marks historical fully completed progress once so retries cannot inflate completion counts', async () => {
    mocks.get
      .mockResolvedValueOnce(snapshot(course))
      .mockResolvedValueOnce(snapshot({}))
      .mockResolvedValueOnce(snapshot({ completedLessons: ['one', 'two'] }));
    expect((await completeLesson(input('two'))).ok).toBe(true);
    expect(mocks.set).toHaveBeenCalledWith(
      'courseProgress/student_course',
      expect.objectContaining({ completedAt: expect.anything() }),
      { merge: true },
    );
    expect(mocks.update).toHaveBeenCalledTimes(1);
    mocks.update.mockClear();
    mocks.get
      .mockResolvedValueOnce(snapshot(course))
      .mockResolvedValueOnce(snapshot({}))
      .mockResolvedValueOnce(snapshot({ completedLessons: ['one', 'two'], completedAt: 'saved' }));
    expect((await completeLesson(input('two'))).ok).toBe(true);
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
