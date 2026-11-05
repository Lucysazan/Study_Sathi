export type CourseMetrics = {
  views: number;
  enrollments: number;
  completions: number;
  analyticsEnrollments: number;
  analyticsCompletions: number;
  completionRate: number | null;
};

export function recordedCount(value: unknown): number {
  if (value === undefined || value === null) return 0;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0)
    throw new Error('Recorded metrics are invalid.');
  return value;
}

export function courseMetrics(stats: unknown): CourseMetrics {
  if (stats != null && (typeof stats !== 'object' || Array.isArray(stats)))
    throw new Error('Recorded metrics are invalid.');
  const data =
    stats && typeof stats === 'object' && !Array.isArray(stats)
      ? (stats as Record<string, unknown>)
      : {};
  const views = recordedCount(data.views);
  const enrollments = recordedCount(data.enrollments);
  const completions = recordedCount(data.completions);
  const analyticsEnrollments = recordedCount(data.analyticsEnrollments);
  const analyticsCompletions = recordedCount(data.analyticsCompletions);
  // Versioned new enrollments and their completions form a comparable cohort.
  const completionRate =
    analyticsEnrollments > 0 && analyticsCompletions <= analyticsEnrollments
      ? Math.round((1000 * analyticsCompletions) / analyticsEnrollments) / 10
      : null;
  return {
    views,
    enrollments,
    completions,
    analyticsEnrollments,
    analyticsCompletions,
    completionRate,
  };
}

export type LessonMetric = { title: string; completions: number; width: number };
export function lessonMetrics(
  lessons: { id?: string; title?: string }[],
  stats: unknown,
): LessonMetric[] {
  const data =
    stats && typeof stats === 'object' && !Array.isArray(stats)
      ? (stats as Record<string, unknown>)
      : {};
  const raw = data.lessonCompletions;
  const counts =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const rows = lessons.map((lesson) => ({
    title: lesson.title || 'Untitled lesson',
    completions:
      lesson.id && Object.hasOwn(counts, lesson.id) ? recordedCount(counts[lesson.id]) : 0,
  }));
  const largest = Math.max(1, ...rows.map((row) => row.completions));
  return rows.map((row) => ({ ...row, width: (100 * row.completions) / largest }));
}
