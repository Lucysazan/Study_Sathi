import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { toLearningPath, toResource } from '@/lib/validation/catalog';
import type { LearningPath, Resource } from '@/types/catalog';
import { type Catalog, seedCatalog } from './catalog';

/** Cache tag for the public catalogue. Admin edits call `updateTag(CATALOG_TAG)`. */
export const CATALOG_TAG = 'catalog';

const FIRESTORE_TIMEOUT_MS = 4000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore did not answer within ${ms} ms`)), ms),
    ),
  ]);
}

const byOrder = (a: { order: number; title: string }, b: { order: number; title: string }) =>
  a.order - b.order || a.title.localeCompare(b.title);

/** Strip internal fields so only the public shape reaches pages and client props. */
function publicResource({ order: _order, ...r }: Resource & { order: number }): Resource {
  return r;
}
function publicPath({ order: _order, ...p }: LearningPath & { order: number }): LearningPath {
  return p;
}

async function loadFromFirestore(): Promise<Omit<Catalog, 'source'>> {
  const db = adminDb();
  const [resourceSnap, pathSnap] = await Promise.all([
    db.collection('resources').get(),
    db.collection('learningPaths').get(),
  ]);
  const resources = resourceSnap.docs
    .map((d) => toResource(d.id, d.data()))
    .filter((r) => r !== null)
    .sort(byOrder)
    .map(publicResource);
  const paths = pathSnap.docs
    .map((d) => toLearningPath(d.id, d.data()))
    .filter((p) => p !== null)
    .sort(byOrder)
    .map(publicPath);
  const skipped = resourceSnap.size - resources.length + (pathSnap.size - paths.length);
  if (skipped) console.warn(`Catalogue: skipped ${skipped} invalid Firestore document(s)`);
  return { resources, paths };
}

/**
 * The public catalogue: Firestore, cached for hours and refreshed when an admin saves.
 * Falls back to the bundled seed (cached for minutes only) when Firestore is unreachable or not
 * seeded yet, so the public site keeps working and builds never need Firebase.
 * Firestore cost: one read per document when the cache refreshes, not per visitor.
 */
export async function getCatalog(): Promise<Catalog> {
  'use cache';
  cacheTag(CATALOG_TAG);
  try {
    const live = await withTimeout(loadFromFirestore(), FIRESTORE_TIMEOUT_MS);
    if (!live.resources.length && !live.paths.length) throw new Error('Firestore is not seeded');
    cacheLife('hours');
    return {
      resources: live.resources.length ? live.resources : seedCatalog.resources,
      paths: live.paths.length ? live.paths : seedCatalog.paths,
      source: 'firestore',
    };
  } catch (error) {
    console.warn(
      `Catalogue: using bundled seed data (${error instanceof Error ? error.message : error})`,
    );
    cacheLife('minutes');
    return seedCatalog;
  }
}
