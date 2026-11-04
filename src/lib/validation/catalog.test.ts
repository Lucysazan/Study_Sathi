import { describe, expect, it } from 'vitest';
import resources from '@/data/seed/resources.json';
import { learningPaths } from '@/data/seed/learningPaths';
import {
  ADULT_AGE_LABEL,
  ageLabel,
  resourceInputSchema,
  slugify,
  toLearningPath,
  toResource,
} from './catalog';
import { fieldErrors } from './auth';

const valid = {
  title: 'Khan Academy Kids',
  provider: 'Khan Academy',
  category: 'Academic Education',
  topic: 'Early learning',
  description: 'Free activities for reading, maths and more.',
  language: 'English',
  audience: 'children',
  minAge: '10',
  maxAge: '12',
  format: 'Website',
  purpose: 'Both',
  url: 'https://www.khanacademy.org/kids',
  note: '',
  verification: 'Official provider page checked on 5 November 2026.',
};

describe('resourceInputSchema', () => {
  it('accepts a valid resource and derives the age label', () => {
    const r = resourceInputSchema.parse(valid);
    expect(r).toMatchObject({ minAge: 10, maxAge: 12, age: '10–12' });
    expect(r).not.toHaveProperty('audience');
  });

  it('uses the adult label and no range for adult guidance', () => {
    const r = resourceInputSchema.parse({ ...valid, audience: 'adults', minAge: '', maxAge: '' });
    expect(r).toMatchObject({ minAge: null, maxAge: null, age: ADULT_AGE_LABEL });
  });

  it('checks the age range', () => {
    const r = resourceInputSchema.safeParse({ ...valid, minAge: '14', maxAge: '11' });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).maxAge).toContain('at least the youngest');
    expect(resourceInputSchema.safeParse({ ...valid, minAge: '3' }).success).toBe(false);
    expect(resourceInputSchema.safeParse({ ...valid, maxAge: '' }).success).toBe(false);
  });

  it('only allows https links and known options', () => {
    expect(resourceInputSchema.safeParse({ ...valid, url: 'http://x.org' }).success).toBe(false);
    expect(resourceInputSchema.safeParse({ ...valid, url: 'javascript:alert(1)' }).success).toBe(
      false,
    );
    expect(resourceInputSchema.safeParse({ ...valid, category: 'Sports' }).success).toBe(false);
    expect(resourceInputSchema.safeParse({ ...valid, language: 'French' }).success).toBe(false);
  });

  it('accepts every seed resource as form input (the admin can edit them all)', () => {
    for (const r of resources) {
      const input = {
        ...r,
        audience: r.minAge === null ? 'adults' : 'children',
        minAge: r.minAge ?? '',
        maxAge: r.maxAge ?? '',
      };
      const parsed = resourceInputSchema.safeParse(input);
      expect(parsed.success, `${r.id} ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
      if (parsed.success) expect(parsed.data.age === r.age || r.minAge === null).toBe(true);
    }
  });
});

describe('Firestore document parsing', () => {
  it('reads seed data back as resources and paths', () => {
    for (const r of resources) expect(toResource(r.id, r)).not.toBeNull();
    for (const p of learningPaths) expect(toLearningPath(p.id, p)).not.toBeNull();
  });

  it('rejects broken documents instead of crashing', () => {
    expect(toResource('x', { title: 'Only a title' })).toBeNull();
    expect(toLearningPath('x', { title: 'x', steps: [] })).toBeNull();
  });
});

describe('helpers', () => {
  it('builds age labels', () => {
    expect(ageLabel(10, 14)).toBe('10–14');
    expect(ageLabel(null, null)).toBe(ADULT_AGE_LABEL);
  });

  it('slugifies titles', () => {
    expect(slugify('Khan Academy Kids!')).toBe('khan-academy-kids');
    expect(slugify('  Ñepali — Café ')).toBe('nepali-cafe');
    expect(slugify('!!!')).toBe('resource');
  });
});
