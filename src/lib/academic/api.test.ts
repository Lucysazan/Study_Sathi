import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ user: vi.fn(), read: vi.fn(), write: vi.fn() }));
vi.mock('@/lib/auth/session', () => ({ getCurrentUser: mocks.user }));
vi.mock('@/lib/academic/progress.server', () => ({
  readAcademicProgress: mocks.read,
  writeAcademicProgress: mocks.write,
}));
import { POST } from '@/app/api/academic/practice/route';
import { GET } from '@/app/api/academic/progress/route';

const answers = { 'sets-c1': 1, 'sets-c2': 2, 'sets-c3': 0, 'sets-c4': 2 };
function request(data: unknown, origin = 'https://study.test') {
  return new Request('https://study.test/api/academic/practice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin },
    body: JSON.stringify(data),
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.user.mockResolvedValue(null);
  mocks.read.mockResolvedValue({});
  mocks.write.mockResolvedValue(undefined);
});
it('grades guest practice without writing data', async () => {
  const response = await POST(
    request({ chapterId: 'sets', phase: 'check', answers, expectedUid: null }),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ saved: false, result: { correct: 4 } });
  expect(mocks.write).not.toHaveBeenCalled();
});
it('saves trusted results only to the current matching student', async () => {
  mocks.user.mockResolvedValue({ uid: 'one', role: 'student' });
  const response = await POST(
    request({ chapterId: 'sets', phase: 'check', answers, expectedUid: 'one' }),
  );
  expect((await response.json()).saved).toBe(true);
  expect(mocks.write).toHaveBeenCalledWith(
    'one',
    expect.objectContaining({ correct: 4, chapterId: 'sets' }),
  );
  expect(
    (await POST(request({ chapterId: 'sets', phase: 'check', answers, expectedUid: 'two' })))
      .status,
  ).toBe(409);
  expect(mocks.write).toHaveBeenCalledTimes(1);
});
it('rejects cross-origin and forged scoring input', async () => {
  expect((await POST(request({}, 'https://other.test'))).status).toBe(403);
  expect(
    (
      await POST(
        request({ chapterId: 'sets', phase: 'check', answers, expectedUid: null, correct: 4 }),
      )
    ).status,
  ).toBe(400);
  expect(mocks.write).not.toHaveBeenCalled();
});
it('returns feedback and an explicit warning when saving fails', async () => {
  mocks.user.mockResolvedValue({ uid: 'one', role: 'student' });
  mocks.write.mockRejectedValue(new Error('offline'));
  const response = await POST(
    request({ chapterId: 'sets', phase: 'check', answers, expectedUid: 'one' }),
  );
  expect(await response.json()).toMatchObject({
    saved: false,
    result: { correct: 4 },
    saveMessage: expect.stringContaining('could not be saved'),
  });
});
it('loads only the current student and never exposes parent or guest records', async () => {
  expect(await (await GET()).json()).toEqual({ uid: null, results: {} });
  mocks.user.mockResolvedValue({ uid: 'parent', role: 'parent' });
  expect(await (await GET()).json()).toEqual({ uid: null, results: {} });
  expect(mocks.read).not.toHaveBeenCalled();
  mocks.user.mockResolvedValue({ uid: 'one', role: 'student' });
  const response = await GET();
  expect(response.headers.get('cache-control')).toContain('no-store');
  expect(mocks.read).toHaveBeenCalledWith('one');
});
