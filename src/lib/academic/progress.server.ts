import 'server-only';
import { adminDb } from '@/lib/firebase/admin';
import { academicProgressSchema, type SavedAcademicResult } from './practice';

function progressRef(uid: string) {
  return adminDb().collection('users').doc(uid).collection('privateData').doc('academic');
}

export async function readAcademicProgress(uid: string) {
  const doc = await progressRef(uid).get();
  return academicProgressSchema.parse(doc.exists ? (doc.data()?.results ?? {}) : {});
}

export async function writeAcademicProgress(uid: string, result: SavedAcademicResult) {
  const ref = progressRef(uid);
  await adminDb().runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const current = academicProgressSchema.parse(doc.exists ? (doc.data()?.results ?? {}) : {});
    const key = `${result.chapterId}_${result.phase}`;
    const results = academicProgressSchema.parse({ ...current, [key]: result });
    tx.set(ref, { results });
  });
}
