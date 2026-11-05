import { z } from 'zod';
import { passwordSchema, usernameSchema } from './auth';

export const avatars = [
  'panda',
  'yak',
  'fox',
  'owl',
  'rabbit',
  'elephant',
  'butterfly',
  'turtle',
  'leaf',
  'flower',
  'mountain',
  'sun',
] as const;
export const profileSchema = z.object({
  nickname: z.string().trim().min(2).max(20),
  avatarId: z.enum(avatars),
});
export const childSchema = profileSchema.extend({
  username: usernameSchema,
  password: passwordSchema,
});
export const childPasswordSchema = z.object({
  childUid: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[^/]+$/),
  password: passwordSchema,
});
