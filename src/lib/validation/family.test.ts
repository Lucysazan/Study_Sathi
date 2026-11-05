import { describe, expect, it } from 'vitest';
import { avatars, childSchema, profileSchema } from './family';

describe('family account inputs', () => {
  it('uses exactly twelve fixed avatars', () => {
    expect(new Set(avatars).size).toBe(12);
  });
  it('normalizes usernames and strips injected roles', () => {
    const result = childSchema.parse({
      nickname: 'Leaf',
      username: ' LEAF_123 ',
      password: 'long-enough',
      avatarId: 'leaf',
      role: 'admin',
    });
    expect(result.username).toBe('leaf_123');
    expect(result).not.toHaveProperty('role');
  });
  it('rejects short passwords, invalid usernames and custom avatars', () => {
    expect(
      childSchema.safeParse({
        nickname: 'Leaf',
        username: 'bad@name',
        password: 'short',
        avatarId: 'leaf',
      }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({ nickname: 'Leaf', avatarId: 'https://photo.example/me' }).success,
    ).toBe(false);
  });
});
