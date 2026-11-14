import { describe, it, expect } from 'vitest';
import { approvedVideos, filterQuickVideos, quickVideoSchema, quickSaveId } from './catalog';
const base = {
  videoId: '0oedpy8mqWg',
  sourceUrl: 'https://www.youtube.com/shorts/0oedpy8mqWg',
  title: 'Beside and besides',
  creator: 'BBC Learning English',
  language: 'en',
  subject: 'English',
  minAge: 10,
  maxAge: 16,
  durationSeconds: 17,
  objective: 'Distinguish two words.',
  question: {
    prompt: 'Beside means?',
    options: ['Next to', 'Also'],
    answer: 0,
    explanation: 'Beside means next to.',
  },
  related: { href: '/learning-paths/english-adventure', label: 'English' },
  review: {
    status: 'approved',
    date: '2026-11-14',
    reviewer: 'Automated source review',
    basis: 'Source and visual checks',
    notes: 'Not teacher-reviewed',
  },
};
describe('Quick Learn publication boundary', () => {
  it('excludes pending, rejected and invalid records even when filters match', () => {
    expect(
      approvedVideos([
        base,
        { ...base, review: { ...base.review, status: 'pending' } },
        { ...base, review: { ...base.review, status: 'rejected' } },
        { ...base, durationSeconds: 600 },
      ]),
    ).toHaveLength(1);
  });
  it('requires dated approval evidence and exact source identity', () => {
    expect(
      quickVideoSchema.safeParse({ ...base, review: { ...base.review, date: null } }).success,
    ).toBe(false);
    expect(
      quickVideoSchema.safeParse({
        ...base,
        sourceUrl: 'https://www.youtube.com/shorts/otherID_123',
      }).success,
    ).toBe(false);
  });
  it('rejects unsafe related links and invalid question/age ranges', () => {
    for (const patch of [
      { related: { href: '//evil.test', label: 'X' } },
      { related: { href: '/\\evil.test', label: 'X' } },
      { related: { href: 'javascript:alert(1)', label: 'X' } },
      { question: { ...base.question, answer: 9 } },
      { minAge: 16, maxAge: 10 },
    ])
      expect(quickVideoSchema.safeParse({ ...base, ...patch }).success).toBe(false);
  });
  it('keeps spoken language independent of subject and overlaps suggested ages', () => {
    const videos = approvedVideos([
      base,
      { ...base, language: 'ne', subject: 'English', minAge: 12, maxAge: 14 },
    ]);
    expect(
      filterQuickVideos(videos, { language: 'ne', subject: 'English', age: '10-12' }),
    ).toHaveLength(1);
    expect(filterQuickVideos(videos, { language: 'en', subject: 'Science', age: '' })).toHaveLength(
      0,
    );
    expect(
      filterQuickVideos(videos, { language: 'ne', subject: 'English', age: '13-16' }),
    ).toHaveLength(1);
  });
  it('namespaces bookmarks and only matches saved video ids', () => {
    const videos = approvedVideos([base]);
    expect(quickSaveId(base.videoId)).toBe('quick-0oedpy8mqWg');
    expect(
      filterQuickVideos(videos, { language: '', subject: '', age: '', savedOnly: true }, ['1']),
    ).toHaveLength(0);
    expect(
      filterQuickVideos(videos, { language: '', subject: '', age: '', savedOnly: true }, [
        quickSaveId(base.videoId),
      ]),
    ).toHaveLength(1);
  });
});
