export type CourseLessonLike = {
  id?: string;
  title?: string;
  kind?: string;
  duration?: string;
  content?: string;
  prompt?: string;
  mediaUrl?: string;
  alt?: string;
  resourceTitle?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
};

export type CourseModuleLike = {
  id?: string;
  title?: string;
  lessons?: CourseLessonLike[];
};

export type CourseLike = {
  id?: string;
  outline?: { modules?: CourseModuleLike[] } | CourseModuleLike[];
};

export function findLessonById(
  course: CourseLike | null | undefined,
  lessonId: string,
): CourseLessonLike | null {
  if (!course) return null;

  for (const part of getCourseModules(course)) {
    const lesson = part.lessons?.find((item) => item.id === lessonId);
    if (lesson) return lesson;
  }

  return null;
}

export function getFirstLessonId(course: CourseLike | null | undefined): string | null {
  if (!course) return null;

  for (const part of getCourseModules(course)) {
    const lesson = part.lessons?.[0];
    if (lesson?.id) return lesson.id;
  }

  return null;
}

export function getNextLessonId(
  course: CourseLike | null | undefined,
  currentLessonId: string,
): string | null {
  if (!course) return null;

  let foundCurrent = false;

  for (const part of getCourseModules(course)) {
    for (const lesson of part.lessons ?? []) {
      if (foundCurrent) return lesson.id ?? null;
      if (lesson.id === currentLessonId) foundCurrent = true;
    }
  }

  return null;
}

export function getCourseLessonPath(courseId: string, lessonId: string): string {
  return `/learn/courses/${encodeURIComponent(courseId)}/${encodeURIComponent(lessonId)}`;
}

export function getCourseModules(course: CourseLike): CourseModuleLike[] {
  return Array.isArray(course.outline) ? course.outline : (course.outline?.modules ?? []);
}
