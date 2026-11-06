import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { textbookSchema } from './source';

export async function getAcademicTextbook() {
  'use cache';
  cacheLife('minutes');
  cacheTag('academic-textbook');
  try {
    const doc = await adminDb().collection('academicSources').doc('grade9-mathematics').get();
    const result = textbookSchema.safeParse(doc.data());
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
