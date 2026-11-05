'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { invalid, ok } from '@/lib/actions';
import { requireUser } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';

const applicationSchema = z.object({
  bio: z.string().trim().min(25, 'Please tell us a bit more about your teaching focus.').max(1000),
  experience: z
    .string()
    .trim()
    .min(15, 'Share a little about your background or experience.')
    .max(1000),
  goals: z.string().trim().min(15, 'Tell us what you want to build as a creator.').max(1000),
});

export async function submitCreatorApplication(input: unknown) {
  const user = await requireUser('/creator/apply');
  if (user.role === 'creator') return ok({ status: 'approved' });

  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const ref = adminDb().collection('users').doc(user.uid);
  await ref.set(
    {
      requestedRole: 'creator',
      creatorApplication: {
        bio: parsed.data.bio,
        experience: parsed.data.experience,
        goals: parsed.data.goals,
        submittedAt: FieldValue.serverTimestamp(),
      },
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return ok({ status: 'submitted' });
}
