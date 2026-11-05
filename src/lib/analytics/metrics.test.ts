import { describe, expect, it } from 'vitest';
import { courseMetrics, lessonMetrics, recordedCount } from './metrics';

describe('recorded learning metrics', () => {
  it('handles missing historical counters without pretending they are complete history', () => {
    expect(courseMetrics(undefined)).toEqual({
      views: 0,
      enrollments: 0,
      completions: 0,
      analyticsEnrollments: 0,
      analyticsCompletions: 0,
      completionRate: null,
    });
    expect(
      courseMetrics({
        views: 12,
        enrollments: 8,
        completions: 3,
        analyticsEnrollments: 8,
        analyticsCompletions: 3,
      }).completionRate,
    ).toBe(37.5);
  });
  it('withholds rates when legacy denominators are missing or incompatible', () => {
    expect(courseMetrics({ enrollments: 0, completions: 5 }).completionRate).toBeNull();
    expect(courseMetrics({ enrollments: 2, completions: 5 }).completionRate).toBeNull();
    expect(courseMetrics({ enrollments: 2, completions: 0 }).completionRate).toBeNull();
    expect(courseMetrics({ analyticsEnrollments: 2, analyticsCompletions: 0 }).completionRate).toBe(
      0,
    );
    expect(
      courseMetrics({ analyticsEnrollments: 2, analyticsCompletions: 5 }).completionRate,
    ).toBeNull();
  });
  it('does not silently turn invalid metrics into plausible numbers', () => {
    expect(() => courseMetrics('broken')).toThrow();
    for (const value of [-1, 1.5, NaN, Infinity, '12'])
      expect(() => recordedCount(value)).toThrow();
  });
  it('builds bounded relative bars in outline order and ignores deleted lesson IDs', () => {
    const rows = lessonMetrics(
      [{ id: 'first', title: 'First' }, { id: 'lesson.with.dot', title: 'Next' }, { id: 'new' }],
      { lessonCompletions: { first: 4, 'lesson.with.dot': 2, removed: 999 } },
    );
    expect(rows).toEqual([
      { title: 'First', completions: 4, width: 100 },
      { title: 'Next', completions: 2, width: 50 },
      { title: 'Untitled lesson', completions: 0, width: 0 },
    ]);
    expect(lessonMetrics([{ id: 'zero' }], {}).every((row) => Number.isFinite(row.width))).toBe(
      true,
    );
    expect(lessonMetrics([{ id: 'constructor' }], {})[0]?.completions).toBe(0);
  });
});
