import type { LearningPath, Resource } from '@/types/catalog';
import { learningPaths } from './seed/learningPaths';
import resourceData from './seed/resources.json';

/**
 * The curated catalogue and pure lookups over it. Server code gets the live catalogue from
 * `getCatalog()` (src/data/catalog.server.ts, Firestore with seed fallback); this file has no
 * server-only imports so client code and tests can use the helpers.
 */
export type Catalog = {
  resources: readonly Resource[];
  paths: readonly LearningPath[];
  /** Where the data came from (shown to admins; handy when debugging). */
  source: 'firestore' | 'seed';
};

/** The bundled seed files: fallback when Firestore is empty or unreachable. */
export const seedCatalog: Catalog = {
  resources: resourceData,
  paths: learningPaths,
  source: 'seed',
};

/** Resources shown in "A good place to start" on the home page (same picks as the prototype). */
export const featuredResourceIds = ['1', '5', '7', '11'] as const;

export function findResource(catalog: Catalog, id: string): Resource | undefined {
  return catalog.resources.find((r) => r.id === id);
}

export function findPath(catalog: Catalog, id: string): LearningPath | undefined {
  return catalog.paths.find((p) => p.id === id);
}

/** Featured resources that still exist (an admin may have removed one). */
export function featuredResources(catalog: Catalog): Resource[] {
  return featuredResourceIds
    .map((id) => findResource(catalog, id))
    .filter((r): r is Resource => r !== undefined);
}

/** Up to `limit` other resources in the same category, for "More to explore". */
export function relatedResources(catalog: Catalog, resource: Resource, limit = 3): Resource[] {
  return catalog.resources
    .filter((r) => r.id !== resource.id && r.category === resource.category)
    .slice(0, limit);
}
