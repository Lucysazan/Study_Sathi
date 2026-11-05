import { beforeEach, expect, it, vi } from 'vitest';
const setup = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth/setup', () => ({ completeSignup: setup }));
import { POST } from './route';
beforeEach(() => {
  setup.mockReset();
});

it('rejects cross-origin setup before touching account data', async () => {
  const response = await POST(
    new Request('https://app.test/api/auth/setup', {
      method: 'POST',
      headers: { origin: 'https://other.test' },
      body: '{}',
    }),
  );
  expect(response.status).toBe(403);
  expect(setup).not.toHaveBeenCalled();
});
it('returns a no-store JSON result without an RSC response', async () => {
  setup.mockResolvedValue({ ok: true, data: { role: 'parent' } });
  const input = { idToken: 'test-token', accountType: 'parent', displayName: 'Parent' };
  const response = await POST(
    new Request('https://app.test/api/auth/setup', {
      method: 'POST',
      headers: { origin: 'https://app.test' },
      body: JSON.stringify(input),
    }),
  );
  expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(await response.json()).toEqual({ ok: true, data: { role: 'parent' } });
  expect(setup).toHaveBeenCalledWith(input);
});
