'use server';

import { awardLesson, noReward, type RewardReceipt } from '@/lib/gamification/awards';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { type ActionResult, fail, ok } from '@/lib/actions';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import {
  findLessonById,
  getNextLessonId,
  getCourseModules,
  type CourseLike,
} from '@/lib/course/learning';

const documentId = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .refine((id) => !id.includes('/') && id !== '.' && id !== '..');
const completionSchema = z.object({ courseId: documentId, lessonId: documentId });

export async function enrollInCourse(formData: FormData): Promise<ActionResult> {
  const parsed = documentId.safeParse(formData.get('courseId'));
  if (!parsed.success) return fail('Please choose a course to enroll in.');
  const user = await requireRole(['student'], '/learn/courses');
  const courseId = parsed.data;

  if (!courseId) return fail('Please choose a course to enroll in.');

  try {
    const db = adminDb();
    const result = await db.runTransaction(async (transaction) => {
      const course = await transaction.get(db.collection('courses').doc(courseId));
      if (!course.exists || course.get('status') !== 'published')
        return fail('This course is not available right now.');
      const ref = db.collection('courseEnrollments').doc(user.uid + '_' + courseId);
      const enrollment = await transaction.get(ref);
      if (!enrollment.exists)
        transaction.set(ref, {
          userId: user.uid,
          courseId,
          title: String(course.get('title') ?? 'Untitled course'),
          enrolledAt: FieldValue.serverTimestamp(),
          status: 'active',
        });
      if (!enrollment.exists)
        transaction.update(db.collection('courses').doc(courseId), {
          'stats.enrollments': FieldValue.increment(1),
        });
      transaction.update(db.collection('users').doc(user.uid), { currentCourseId: courseId });
      return ok();
    });
    if (result.ok) revalidatePath('/learn/courses/' + courseId);
    return result;
  } catch {
    return fail('We could not save your enrollment. Please try again.');
  }
}

export async function completeLesson(formData: FormData): Promise<ActionResult<RewardReceipt>> {
  const parsed = completionSchema.safeParse({
    courseId: formData.get('courseId'),
    lessonId: formData.get('lessonId'),
  });
  if (!parsed.success) return fail('This lesson is not available right now.');
  const user = await requireRole(['student'], '/learn/courses');
  const { courseId, lessonId } = parsed.data;

  if (!courseId || !lessonId) {
    return fail('This lesson is not available right now.');
  }

  const now = new Date();
  try {
    const result = await adminDb().runTransaction(async (transaction) => {
      const courseRef = adminDb().collection('courses').doc(courseId);
      const courseSnap = await transaction.get(courseRef);
      if (!courseSnap.exists || courseSnap.get('status') !== 'published') {
        return fail('This course is no longer available.');
      }

      if (!findLessonById(courseSnap.data() as CourseLike, lessonId))
        return fail('This lesson is not part of the course.');
      const enrollmentSnap = await transaction.get(
        adminDb().collection('courseEnrollments').doc(`${user.uid}_${courseId}`),
      );
      if (!enrollmentSnap.exists) {
        return fail('You need to enroll before starting this course.');
      }

      const progressRef = adminDb().collection('courseProgress').doc(`${user.uid}_${courseId}`);
      const progressSnap = await transaction.get(progressRef);
      const completedLessons = Array.isArray(progressSnap.get('completedLessons'))
        ? progressSnap
            .get('completedLessons')
            .filter((value: unknown): value is string => typeof value === 'string')
        : [];

      const lessonIds = getCourseModules(courseSnap.data() as CourseLike)
        .flatMap((part) => part.lessons ?? [])
        .map((lesson) => lesson.id)
        .filter((id): id is string => !!id);
      const allDone =
        lessonIds.length > 0 &&
        lessonIds.every((id) => id === lessonId || completedLessons.includes(id));
      const receipt = !completedLessons.includes(lessonId)
        ? await awardLesson(transaction, adminDb(), user.uid, {
            courseId,
            lessonId,
            now,
            completedCourse: allDone && !progressSnap.get('completedAt'),
            category: String(courseSnap.get('category') ?? ''),
          })
        : noReward;
      if (!completedLessons.includes(lessonId) || (allDone && !progressSnap.get('completedAt'))) {
        transaction.set(
          progressRef,
          {
            userId: user.uid,
            courseId,
            completedLessons: FieldValue.arrayUnion(lessonId),
            nextLessonId: getNextLessonId(courseSnap.data() as CourseLike, lessonId),
            updatedAt: FieldValue.serverTimestamp(),
            ...(allDone ? { completedAt: FieldValue.serverTimestamp() } : {}),
          },
          { merge: true },
        );
      }

      if (allDone && !progressSnap.get('completedAt'))
        transaction.update(courseRef, { 'stats.completions': FieldValue.increment(1) });
      return ok(receipt);
    });
    if (result.ok) {
      revalidatePath(`/learn/courses/${courseId}`, 'layout');
      revalidatePath('/learn');
    }
    return result;
  } catch {
    return fail('We could not save your progress. Please try again.');
  }
}
