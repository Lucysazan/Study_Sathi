import { describe, it, expect } from 'vitest';
import { studyActivities, simulationUrl, activitiesForCategory } from './catalog';
import { gradeStudy, studySubmission } from './checks';
describe('guided activity checks', () => {
  it('grades every catalog activity from trusted answers', () => {
    for (const a of studyActivities) {
      expect(a.questions).toHaveLength(3);
      expect(new Set(a.questions.map((q) => q.id)).size).toBe(3);
      const answers = Object.fromEntries(a.questions.map((q) => [q.id, q.answer]));
      expect(gradeStudy({ activityId: a.id, expectedUid: null, answers }).correct).toBe(3);
      expect(
        gradeStudy({
          activityId: a.id,
          expectedUid: null,
          answers: Object.fromEntries(
            a.questions.map((q) => [q.id, (q.answer + 1) % q.options.length]),
          ),
        }).correct,
      ).toBe(0);
    }
  });
  it('rejects missing, extra and out of range answers and unknown activity', () => {
    const valid = { activityId: 'fractions', expectedUid: null, answers: { f1: 0, f2: 1, f3: 2 } };
    for (const patch of [
      { answers: { f1: 0 } },
      { answers: { ...valid.answers, extra: 0 } },
      { answers: { ...valid.answers, f2: 9 } },
      { activityId: 'unknown' },
    ])
      expect(() => gradeStudy({ ...valid, ...patch })).toThrow();
  });
  it('rejects supplied scores, identities and invalid values', () => {
    expect(
      studySubmission.safeParse({ activityId: 'fractions', expectedUid: null, answers: { f1: -1 } })
        .success,
    ).toBe(false);
    expect(
      studySubmission.safeParse({
        activityId: 'fractions',
        expectedUid: null,
        answers: {},
        xp: 100,
      }).success,
    ).toBe(false);
  });
  it('allows only selected simulation paths and gives every category a learning path', () => {
    expect(simulationUrl('../evil')).toBeNull();
    expect(simulationUrl('fractions-intro')).toMatch(/^https:\/\/phet.colorado.edu\/sims\/html\//);
    for (const category of [
      'Academic Education',
      'Learning Games',
      'Financial Literacy',
      'Digital Safety',
      'Environment',
      'Life Skills',
    ])
      expect(activitiesForCategory(category).length).toBeGreaterThan(0);
  });
});
