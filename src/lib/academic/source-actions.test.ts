import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  role: vi.fn(),
  batch: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
  commit: vi.fn(),
  tag: vi.fn(),
}));
vi.mock('@/lib/auth/session', () => ({ requireRole: mocks.role }));
vi.mock('next/cache', () => ({ updateTag: mocks.tag, revalidatePath: vi.fn() }));
vi.mock('@/lib/firebase/admin', () => ({
  adminDb: () => ({ batch: mocks.batch, collection: () => ({ doc: () => ({}) }) }),
}));
import { saveAcademicTextbook, removeAcademicTextbook } from './source-actions';
beforeEach(() => {
  vi.clearAllMocks();
  mocks.role.mockResolvedValue({ uid: 'admin' });
  mocks.batch.mockReturnValue({ set: mocks.set, delete: mocks.remove, commit: mocks.commit });
  mocks.commit.mockResolvedValue(undefined);
});
const data = {
  title: 'Test textbook',
  edition: 'English 2022',
  sourceUrl: 'https://moecdc.gov.np/a',
  pdfUrl: 'https://moecdc.gov.np/a.pdf',
  permissionReference: 'Test-only permission reference',
  approvedForEmbed: true,
};
it('checks admin role before publishing or withdrawing', async () => {
  mocks.role.mockRejectedValue(new Error('Forbidden'));
  await expect(saveAcademicTextbook(data)).rejects.toThrow('Forbidden');
  await expect(removeAcademicTextbook()).rejects.toThrow('Forbidden');
  expect(mocks.batch).not.toHaveBeenCalled();
});
it('rejects unapproved content before any write', async () => {
  expect((await saveAcademicTextbook({ ...data, approvedForEmbed: false })).ok).toBe(false);
  expect(mocks.batch).not.toHaveBeenCalled();
});
it('publishes source and audit together, then invalidates public cache', async () => {
  expect((await saveAcademicTextbook(data)).ok).toBe(true);
  expect(mocks.set).toHaveBeenCalledTimes(2);
  expect(mocks.commit).toHaveBeenCalledOnce();
  expect(mocks.tag).toHaveBeenCalledWith('academic-textbook');
});
