'use server';

import { revalidatePath } from 'next/cache';
import { fail, invalid, ok, type ActionResult } from '@/lib/actions';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { profileSchema } from '@/lib/validation/family';

export async function saveProfile(data: FormData): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const user = await requireRole(['student'], '/learn/profile');
  try {
    await adminDb().collection('users').doc(user.uid).update(parsed.data);
  } catch {
    return fail('We could not save your profile. Please try again.');
  }
  revalidatePath('/learn', 'layout');
  revalidatePath('/learn/profile');
  return ok();
}
