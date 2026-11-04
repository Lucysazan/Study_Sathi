'use server';

import { z } from 'zod';
import { type ActionResult, fail, ok } from '@/lib/actions';
import { getAdmin, NOT_ALLOWED } from '@/lib/admin/guard';
import { setDisabled } from '@/lib/admin/users';
import { assignRole } from '@/lib/auth/accounts';
import { roles } from '@/lib/auth/roles';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

const uidSchema = z.string().min(1).max(128);
const roleSchema = z.enum(roles);

/** Change a user's role (also how creator applicants are approved). Signs them out everywhere. */
export async function setUserRole(uid: unknown, role: unknown): Promise<ActionResult> {
  const parsedUid = uidSchema.safeParse(uid);
  const parsedRole = roleSchema.safeParse(role);
  if (!parsedUid.success || !parsedRole.success) return fail('Please choose a valid role.');

  const admin = await getAdmin();
  if (!admin) return fail(NOT_ALLOWED);
  if (parsedUid.data === admin.uid) return fail("You can't change your own role.");

  try {
    await assignRole(adminAuth(), adminDb(), parsedUid.data, parsedRole.data, admin.uid);
    return ok();
  } catch (error) {
    console.error('setUserRole failed', error);
    return fail('Could not change the role. Please try again.');
  }
}

/** Turn an account off (signs them out) or back on. */
export async function setUserDisabled(uid: unknown, disabled: unknown): Promise<ActionResult> {
  const parsedUid = uidSchema.safeParse(uid);
  const parsedDisabled = z.boolean().safeParse(disabled);
  if (!parsedUid.success || !parsedDisabled.success) return fail('Invalid request.');

  const admin = await getAdmin();
  if (!admin) return fail(NOT_ALLOWED);
  if (parsedUid.data === admin.uid) return fail("You can't turn off your own account.");

  try {
    await setDisabled(parsedUid.data, parsedDisabled.data, admin.uid);
    return ok();
  } catch (error) {
    console.error('setUserDisabled failed', error);
    return fail('Could not update the account. Please try again.');
  }
}
