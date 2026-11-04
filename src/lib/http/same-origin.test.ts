import { describe, expect, it } from 'vitest';
import { sameOrigin } from './same-origin';

describe('sameOrigin', () => {
  it('accepts localhost origins when the app is served on 0.0.0.0 during local dev', () => {
    const request = new Request('http://0.0.0.0:3000/api/auth/session', {
      headers: {
        origin: 'http://localhost:3000',
      },
    });

    expect(sameOrigin(request)).toBe(true);
  });
});
