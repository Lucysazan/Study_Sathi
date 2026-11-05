import { beforeEach, describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => ({
  createUser: vi.fn(),
  claims: vi.fn(),
  deleteUser: vi.fn(),
  updateUser: vi.fn(),
  revoke: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  role: vi.fn(),
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth/session', () => ({ requireRole: m.role }));
vi.mock('@/lib/env/server', () => ({
  getServerEnv: () => ({ studentLoginDomain: 'students.studysathi.local' }),
}));
vi.mock('@/lib/firebase/admin', () => ({
  adminAuth: () => ({
    createUser: m.createUser,
    setCustomUserClaims: m.claims,
    deleteUser: m.deleteUser,
    updateUser: m.updateUser,
    revokeRefreshTokens: m.revoke,
  }),
  adminDb: () => ({
    collection: (collection: string) => ({
      doc: (id: string) => ({ id, path: `${collection}/${id}`, get: m.get }),
    }),
    runTransaction: (
      callback: (tx: {
        get: typeof m.get;
        create: typeof m.create;
        update: typeof m.update;
      }) => unknown,
    ) => callback({ get: m.get, create: m.create, update: m.update }),
  }),
}));
import { addChild, resetChildPassword } from './actions';

function form(data: Record<string, string>) {
  const result = new FormData();
  for (const [key, value] of Object.entries(data)) result.set(key, value);
  return result;
}
function doc(data: Record<string, unknown>) {
  return { id: 'child', exists: true, get: (key: string) => data[key] };
}
const valid = { nickname: 'Leaf', username: 'leaf123', password: 'long-enough', avatarId: 'leaf' };
beforeEach(() => {
  vi.resetAllMocks();
  m.role.mockResolvedValue({ uid: 'parent' });
  m.createUser.mockResolvedValue({ uid: 'child' });
});

describe('family actions', () => {
  it('does not create an auth account for invalid input', async () => {
    expect((await addChild(form({ ...valid, password: 'bad' }))).ok).toBe(false);
    expect(m.createUser).not.toHaveBeenCalled();
  });
  it('creates a student with leaderboard off and links the parent', async () => {
    m.get.mockResolvedValue(doc({ role: 'parent', childUids: [] }));
    expect((await addChild(form(valid))).ok).toBe(true);
    expect(m.claims).toHaveBeenCalledWith('child', { role: 'student' });
    expect(m.create).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ parentUid: 'parent', role: 'student', leaderboardOptIn: false }),
    );
  });
  it('compensates the auth account when linking fails', async () => {
    m.get.mockRejectedValueOnce(new Error('offline'));
    expect((await addChild(form(valid))).ok).toBe(false);
    expect(m.deleteUser).toHaveBeenCalledWith('child');
  });
  it('rejects password reset for another family', async () => {
    m.get.mockResolvedValue(doc({ role: 'student', parentUid: 'other-parent' }));
    expect(
      (await resetChildPassword(form({ childUid: 'child', password: 'new-password' }))).ok,
    ).toBe(false);
    expect(m.updateUser).not.toHaveBeenCalled();
  });
  it('revokes old sessions after resetting a linked child password', async () => {
    m.get.mockResolvedValue(doc({ role: 'student', parentUid: 'parent' }));
    expect(
      (await resetChildPassword(form({ childUid: 'child', password: 'new-password' }))).ok,
    ).toBe(true);
    expect(m.revoke).toHaveBeenCalledWith('child');
  });
});
