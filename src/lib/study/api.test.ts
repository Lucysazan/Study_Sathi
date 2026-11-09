import { beforeEach, it, expect, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ user: vi.fn(), read: vi.fn(), save: vi.fn() }));
vi.mock('@/lib/auth/session', () => ({ getCurrentUser: mocks.user }));
vi.mock('./progress.server', () => ({
  readStudyProgress: mocks.read,
  saveStudyProgress: mocks.save,
}));
import { GET, POST } from '@/app/api/study/route';
const input = {
  activityId: 'fractions',
  expectedUid: null as string | null,
  answers: { f1: 0, f2: 1, f3: 2 },
};
const request = (body: unknown, origin = 'https://study.test') =>
  new Request('https://study.test/api/study', {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue(null);
  mocks.save.mockResolvedValue({ xpAwarded: 15, newBadges: ['first-step'] });
  mocks.read.mockResolvedValue({});
});
it('grades guests without persistence or rewards', async () => {
  expect(await (await POST(request(input))).json()).toMatchObject({
    saved: false,
    result: { correct: 3 },
    reward: { xpAwarded: 0 },
  });
  expect(mocks.save).not.toHaveBeenCalled();
});
it('uses session uid for saving and refuses switched accounts', async () => {
  mocks.user.mockResolvedValue({ uid: 'one', role: 'student' });
  expect((await POST(request(input))).status).toBe(409);
  expect(await (await POST(request({ ...input, expectedUid: 'one' }))).json()).toMatchObject({
    saved: true,
    reward: { xpAwarded: 15 },
  });
  expect(mocks.save).toHaveBeenCalledWith('one', expect.objectContaining({ correct: 3 }));
});
it('rejects cross-origin, forged scores and incomplete answers', async () => {
  expect((await POST(request(input, 'https://other.test'))).status).toBe(403);
  expect((await POST(request({ ...input, xp: 50 }))).status).toBe(400);
  expect((await POST(request({ ...input, answers: {} }))).status).toBe(400);
  expect(mocks.save).not.toHaveBeenCalled();
});
it('reports persistence failure without promising points', async () => {
  mocks.user.mockResolvedValue({ uid: 'one', role: 'student' });
  mocks.save.mockRejectedValue(Error());
  expect(await (await POST(request({ ...input, expectedUid: 'one' }))).json()).toMatchObject({
    saved: false,
    reward: { xpAwarded: 0 },
    message: expect.stringContaining('could not be saved'),
  });
});
it('only exposes current student progress', async () => {
  expect(await (await GET()).json()).toEqual({ uid: null, results: {} });
  mocks.user.mockResolvedValue({ uid: 'parent', role: 'parent' });
  expect(await (await GET()).json()).toEqual({ uid: null, results: {} });
  expect(mocks.read).not.toHaveBeenCalled();
  mocks.user.mockResolvedValue({ uid: 'one', role: 'student' });
  await GET();
  expect(mocks.read).toHaveBeenCalledWith('one');
});
