import type { LearningPath, Resource } from '@/types/catalog';
import { learningPaths } from './seed/learningPaths';
import resourceData from './seed/resources.json';

/**
 * Read access to the curated catalogue. Phase 0 reads the seed files bundled with the app.
 * Phase 2 moves this to Firestore (read at build/ISR time) behind the same functions.
 */
export const resources: readonly Resource[] = resourceData;
export const paths: readonly LearningPath[] = learningPaths;

/** Resources shown in "A good place to start" on the home page (same picks as the prototype). */
export const featuredResourceIds = ['1', '5', '7', '11'] as const;

export function getResource(id: string): Resource | undefined {
  return resources.find((r) => r.id === id);
}

export function getPath(id: string): LearningPath | undefined {
  return paths.find((p) => p.id === id);
}

/** Up to `limit` other resources in the same category, for "More to explore". */
export function getRelatedResources(resource: Resource, limit = 3): Resource[] {
  return resources
    .filter((r) => r.id !== resource.id && r.category === resource.category)
    .slice(0, limit);
}

export function isKnownResourceId(id: string): boolean {
  return resources.some((r) => r.id === id);
}
