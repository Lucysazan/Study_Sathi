'use server';

import { z } from 'zod';
import { type ActionResult, fail, ok } from '@/lib/actions';
import { getAdmin, NOT_ALLOWED } from '@/lib/admin/guard';
import { setCourseReviewNote, updateCourseReviewStatus } from '@/lib/admin/courses';
import { courseReviewNoteSchema } from '@/lib/course/review';

const statusSchema = z.enum(['draft', 'review', 'published']);

export async function setCourseStatus(courseId: unknown, status: unknown): Promise<ActionResult> {
  const parsedId = z.string().min(1).max(128).safeParse(courseId);
  const parsedStatus = statusSchema.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) return fail('Please select a valid status.');

  const admin = await getAdmin();
  if (!admin) return fail(NOT_ALLOWED);

  try {
    await updateCourseReviewStatus(parsedId.data, parsedStatus.data, admin.uid);
    return ok();
  } catch (error) {
    console.error('setCourseStatus failed', error);
    return fail('Could not update the course status. Please try again.');
  }
}

export async function saveCourseReviewNote(
  courseId: unknown,
  input: unknown,
): Promise<ActionResult> {
  const parsedId = z.string().min(1).max(128).safeParse(courseId);
  const parsed = courseReviewNoteSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return fail('Please leave a useful note for the creator.');

  const admin = await getAdmin();
  if (!admin) return fail(NOT_ALLOWED);

  try {
    await setCourseReviewNote(parsedId.data, parsed.data.note, admin.uid);
    return ok();
  } catch (error) {
    console.error('saveCourseReviewNote failed', error);
    return fail('Could not save the review note. Please try again.');
  }
}
