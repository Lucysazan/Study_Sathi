import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Firestore, Transaction } from 'firebase-admin/firestore';
vi.mock('server-only', () => ({}));
import { awardLesson } from './awards';

const get = vi.fn();
const create = vi.fn();
const update = vi.fn();
// The fakes preserve the Firestore read/write boundary without opening a live database.
function collection(path: string): {
  doc: (id: string) => { path: string; collection: typeof collection };
} {
  return {
    doc: (id) => ({
      path: `${path}/${id}`,
      collection: (sub) => collection(`${path}/${id}/${sub}`),
    }),
  };
}
const db = { collection } as unknown as Firestore;
const tx = { get, create, update } as unknown as Transaction;
const input = {
  courseId: 'course',
  lessonId: 'lesson',
  now: new Date('2026-11-05T10:00:00Z'),
  completedCourse: false,
  category: 'science',
};
const user = {
  exists: true,
  get: (key: string) => (key === 'role' ? 'student' : { xp: 0, futureStat: 42 }),
};
beforeEach(() => {
  vi.resetAllMocks();
});
describe('idempotent reward transaction', () => {
  it('creates a ledger event and stats only after all reads', async () => {
    get.mockResolvedValueOnce(user).mockResolvedValueOnce({ exists: false });
    expect(await awardLesson(tx, db, 'student', input)).toMatchObject({ xpAwarded: 15 });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.stringMatching(/^users\/student\/xpEvents\/lesson_[a-f0-9]{64}$/),
      }),
      expect.objectContaining({ amount: 15, reason: 'lesson_complete' }),
    );
    expect(update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ stats: expect.objectContaining({ xp: 15, futureStat: 42 }) }),
    );
    expect(get.mock.invocationCallOrder[1]).toBeLessThan(create.mock.invocationCallOrder[0] ?? 0);
  });
  it('awards nothing when the event already exists', async () => {
    get.mockResolvedValueOnce(user).mockResolvedValueOnce({ exists: true });
    expect(await awardLesson(tx, db, 'student', input)).toEqual({ xpAwarded: 0, newBadges: [] });
    expect(create).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });
  it('fails without writes for a missing or invalid learner account', async () => {
    get.mockResolvedValueOnce({ exists: false }).mockResolvedValueOnce({ exists: false });
    await expect(awardLesson(tx, db, 'student', input)).rejects.toThrow();
    expect(create).not.toHaveBeenCalled();
  });
  it('does not erase malformed trusted stats', async () => {
    get
      .mockResolvedValueOnce({
        exists: true,
        get: (key: string) => (key === 'role' ? 'student' : { xp: -100 }),
      })
      .mockResolvedValueOnce({ exists: false });
    await expect(awardLesson(tx, db, 'student', input)).rejects.toThrow();
    expect(update).not.toHaveBeenCalled();
  });
});
