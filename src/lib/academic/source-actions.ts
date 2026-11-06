'use server';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { textbookSchema } from './source';

function refreshTextbookReaders() {
  // Reader configuration streams at request time; only the admin form needs refresh.
  revalidatePath('/admin/academic');
}

export async function saveAcademicTextbook(input: unknown) {
  const admin = await requireRole(['admin'], '/admin/academic');
  const result = textbookSchema.safeParse(input);
  if (!result.success)
    return {
      ok: false,
      error: 'Check the official URLs, edition, permission reference and approval checkbox.',
    };
  try {
    const db = adminDb();
    const batch = db.batch();
    batch.set(db.collection('academicSources').doc('grade9-mathematics'), result.data);
    batch.set(db.collection('auditLog').doc(), {
      action: 'academic.source.publish',
      actorUid: admin.uid,
      at: FieldValue.serverTimestamp(),
      summary: 'Grade 9 Mathematics textbook reference',
    });
    await batch.commit();
    refreshTextbookReaders();
    return { ok: true };
  } catch {
    return { ok: false, error: 'The textbook could not be saved. Please try again.' };
  }
}

export async function removeAcademicTextbook() {
  const admin = await requireRole(['admin'], '/admin/academic');
  try {
    const db = adminDb();
    const batch = db.batch();
    batch.delete(db.collection('academicSources').doc('grade9-mathematics'));
    batch.set(db.collection('auditLog').doc(), {
      action: 'academic.source.withdraw',
      actorUid: admin.uid,
      at: FieldValue.serverTimestamp(),
      summary: 'Grade 9 Mathematics textbook reference',
    });
    await batch.commit();
    refreshTextbookReaders();
    return { ok: true };
  } catch {
    return { ok: false, error: 'The textbook could not be withdrawn. Please try again.' };
  }
}
