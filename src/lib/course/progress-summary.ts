import { getCourseLessonPath, getCourseModules, type CourseLike } from './learning';

export function summarizeCourseProgress(
  id: string,
  title: string,
  course: CourseLike,
  saved: unknown,
) {
  const completed = new Set(
    Array.isArray(saved) ? saved.filter((value): value is string => typeof value === 'string') : [],
  );
  const lessons = getCourseModules(course).flatMap((part) => part.lessons ?? []);
  const rows = lessons.map((lesson) => ({
    title: lesson.title || 'Untitled lesson',
    completed: !!lesson.id && completed.has(lesson.id),
  }));
  const next = lessons.find((lesson) => lesson.id && !completed.has(lesson.id));
  return {
    title,
    path: next?.id ? getCourseLessonPath(id, next.id) : `/learn/courses/${encodeURIComponent(id)}`,
    done: rows.filter((lesson) => lesson.completed).length,
    total: rows.length,
    complete: rows.length > 0 && !next,
    lessons: rows,
  };
}
