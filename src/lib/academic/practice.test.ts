import { describe, expect, it } from 'vitest';
import { academicChapters } from '@/data/academic';
import { gradePractice, revisionSkills, savedPractice, submissionSchema } from './practice';

describe('academic practice', () => {
  it('has coherent skills, unique questions and different follow-up sets', () => {
    const ids = new Set<string>();
    for (const chapter of academicChapters) {
      for (const q of [...chapter.questions, ...chapter.followUp]) {
        expect(ids.has(q.id)).toBe(false);
        ids.add(q.id);
        expect(chapter.skills.some((skill) => skill.id === q.skillId)).toBe(true);
        expect(q.options[q.answer]).toBeTruthy();
      }
      for (const skill of chapter.skills) {
        expect(chapter.questions.filter((q) => q.skillId === skill.id)).toHaveLength(2);
        expect(chapter.followUp.filter((q) => q.skillId === skill.id)).toHaveLength(2);
      }
    }
    expect(ids.size).toBe(24);
  });
  it('grades every topic and phase from trusted answers', () => {
    for (const chapter of academicChapters)
      for (const phase of ['check', 'follow-up'] as const) {
        const questions = phase === 'check' ? chapter.questions : chapter.followUp;
        const result = gradePractice({
          chapterId: chapter.id,
          phase,
          expectedUid: null,
          answers: Object.fromEntries(questions.map((q) => [q.id, q.answer])),
        });
        expect(result.correct).toBe(4);
        expect(revisionSkills(chapter, result)).toEqual([]);
      }
  });
  it('recommends only the skills with missed questions', () => {
    const chapter = academicChapters[0]!;
    const answers = Object.fromEntries(chapter.questions.map((q) => [q.id, q.answer]));
    answers['sets-c1'] = 0;
    const result = gradePractice({
      chapterId: chapter.id,
      phase: 'check',
      expectedUid: null,
      answers,
    });
    expect(result.correct).toBe(3);
    expect(revisionSkills(chapter, result).map((skill) => skill.id)).toEqual(['membership']);
  });
  it('rejects missing, extra, unknown and out-of-range answers', () => {
    const base = { chapterId: 'sets', phase: 'check' as const, expectedUid: null };
    expect(() => gradePractice({ ...base, answers: {} })).toThrow();
    const answers = Object.fromEntries(academicChapters[0]!.questions.map((q) => [q.id, q.answer]));
    expect(() => gradePractice({ ...base, answers: { ...answers, extra: 0 } })).toThrow();
    expect(() => gradePractice({ ...base, answers: { ...answers, 'sets-c1': 8 } })).toThrow();
    expect(() => gradePractice({ ...base, chapterId: 'unknown', answers })).toThrow();
    expect(submissionSchema.safeParse({ ...base, answers, correct: 4 }).success).toBe(false);
    expect(submissionSchema.safeParse({ ...base, answers: { 'sets-c1': -1 } }).success).toBe(false);
  });
  it('persists only a compact trusted summary and one-day review suggestion', () => {
    const chapter = academicChapters[0]!;
    const result = gradePractice({
      chapterId: chapter.id,
      phase: 'check',
      expectedUid: null,
      answers: Object.fromEntries(chapter.questions.map((q) => [q.id, q.answer])),
    });
    const saved = savedPractice(result, new Date('2026-11-06T06:00:00Z'));
    expect(saved.reviewAt).toBe('2026-11-07T06:00:00.000Z');
    expect(saved).not.toHaveProperty('feedback');
  });
});
