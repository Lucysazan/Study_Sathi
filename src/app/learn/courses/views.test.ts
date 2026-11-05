import { beforeEach, describe, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({ get: vi.fn(), create: vi.fn(), update: vi.fn(), role: vi.fn() }));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => ({ value: 'session-cookie' }) }),
}));
vi.mock('@/lib/env/server', () => ({ getServerEnv: () => ({ sessionCookieName: '__session' }) }));
vi.mock('@/lib/auth/session', () => ({ requireRole: m.role }));
vi.mock('@/lib/firebase/admin', () => ({
  adminDb: () => ({
    collection: (name: string) => ({ doc: (id: string) => `${name}/${id}` }),
    runTransaction: (
      callback: (tx: {
        get: typeof m.get;
        create: typeof m.create;
        update: typeof m.update;
      }) => unknown,
    ) => callback({ get: m.get, create: m.create, update: m.update }),
  }),
}));
import { recordCourseView } from './views';
beforeEach(() => {
  vi.resetAllMocks();
});
describe('session view counting', () => {
  it('stores a digest rather than the session cookie and increments once', async () => {
    m.get
      .mockResolvedValueOnce({ exists: true, get: () => 'published' })
      .mockResolvedValueOnce({ exists: false });
    expect((await recordCourseView('course')).ok).toBe(true);
    expect(m.create).toHaveBeenCalledWith(
      expect.stringMatching(/^courseViews\/[a-f0-9]{64}$/),
      expect.objectContaining({ courseId: 'course' }),
    );
    expect(JSON.stringify(m.create.mock.calls)).not.toContain('session-cookie');
    expect(m.update).toHaveBeenCalledTimes(1);
  });
  it('does not count a repeated session or an unpublished course', async () => {
    m.get
      .mockResolvedValueOnce({ exists: true, get: () => 'published' })
      .mockResolvedValueOnce({ exists: true });
    await recordCourseView('course');
    m.get
      .mockResolvedValueOnce({ exists: true, get: () => 'draft' })
      .mockResolvedValueOnce({ exists: false });
    await recordCourseView('course');
    expect(m.update).not.toHaveBeenCalled();
  });
  it('rejects invalid course paths before reading the database', async () => {
    expect((await recordCourseView('../bad')).ok).toBe(false);
    expect(m.get).not.toHaveBeenCalled();
  });
});
