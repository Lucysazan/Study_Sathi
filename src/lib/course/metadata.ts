import {
  courseCategories,
  courseDraftSchema,
  courseLanguages,
  courseReadySchema,
  type CourseDraftInput,
} from './draft';
import { safeMediaUrl } from './media';

export function readCourseMetadata(value: Record<string, unknown>): CourseDraftInput {
  const text = (key: string, fallback = '') =>
    typeof value[key] === 'string' ? (value[key] as string) : fallback;
  return {
    title: text('title'),
    summary: text('summary'),
    ageRange: text('ageRange', 'All ages'),
    budget: text('budget', 'Flexible'),
    category: courseCategories.find((category) => category === value.category) ?? 'digital-skills',
    status: 'draft',
    language: courseLanguages.find((language) => language === value.language) ?? '',
    coverImageUrl: text('coverImageUrl'),
    coverAlt: text('coverAlt'),
  };
}

export function courseChecklist(value: unknown, outline: unknown) {
  const parsed = courseDraftSchema.safeParse(value);
  const raw = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const result = {
    title: courseDraftSchema.shape.title.safeParse(raw.title).success,
    summary: courseDraftSchema.shape.summary.safeParse(raw.summary).success,
    details: parsed.success,
    language: courseLanguages.some((language) => language === raw.language),
    cover:
      typeof raw.coverImageUrl === 'string' &&
      !!safeMediaUrl(raw.coverImageUrl) &&
      typeof raw.coverAlt === 'string' &&
      raw.coverAlt.trim().length >= 2 &&
      raw.coverAlt.trim().length <= 240,
    lessons: courseReadySchema.safeParse(outline).success,
  };
  return { ...result, ready: Object.values(result).every(Boolean) };
}
