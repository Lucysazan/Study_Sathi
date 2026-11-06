import 'server-only';
import { connection } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { textbookSchema } from './source';

export async function getAcademicTextbook() {
  // Keep mutable source configuration out of the prebuilt route shell. A missing
  // source at build time must not remain embedded in the reader after publication.
  await connection();
  try {
    const doc = await adminDb().collection('academicSources').doc('grade9-mathematics').get();
    const result = textbookSchema.safeParse(doc.data());
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
