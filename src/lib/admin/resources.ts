import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { type ResourceInput, slugify, toLearningPath, toResource } from '@/lib/validation/catalog';
import type { Resource } from '@/types/catalog';
import { writeAudit } from './audit';
import { requireAdmin } from './guard';

/**
 * Admin reads and writes for `resources/{id}`. Live data, not cached (admins see changes now).
 * Reads check the admin session themselves (see guard.ts); writes are only called from Server
 * Actions that have already checked it.
 */

export type AdminResource = Resource & { order: number };

export async function listResourcesForAdmin(): Promise<AdminResource[]> {
  await requireAdmin();
  const snap = await adminDb().collection('resources').get();
  return snap.docs
    .map((d) => toResource(d.id, d.data()))
    .filter((r) => r !== null)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export async function getResourceForAdmin(id: string): Promise<AdminResource | null> {
  await requireAdmin();
  const snap = await adminDb().collection('resources').doc(id).get();
  return snap.exists ? toResource(snap.id, snap.data()) : null;
}

/** New resource with an id made from its title ("-2", "-3"… if taken). Returns the id. */
export async function createResource(input: ResourceInput, actorUid: string): Promise<string> {
  const db = adminDb();
  const base = slugify(input.title);
  const existing = (await db.collection('resources').get()).docs
    .map((d) => toResource(d.id, d.data()))
    .filter((r) => r !== null);
  const taken = new Set(existing.map((r) => r.id));
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  const order = existing.reduce((max, r) => Math.max(max, r.order), 0) + 1;

  await db
    .collection('resources')
    .doc(id)
    .create({
      ...input,
      order,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  await writeAudit(db, { actorUid, action: 'resource.create', target: id, summary: input.title });
  return id;
}

export async function updateResource(
  id: string,
  input: ResourceInput,
  actorUid: string,
): Promise<boolean> {
  const db = adminDb();
  const ref = db.collection('resources').doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.update({ ...input, updatedAt: FieldValue.serverTimestamp() });
  await writeAudit(db, { actorUid, action: 'resource.update', target: id, summary: input.title });
  return true;
}

/** Titles of learning paths that link to this resource (deleting would break a step). */
export async function pathsUsingResource(id: string): Promise<string[]> {
  const snap = await adminDb().collection('learningPaths').get();
  return snap.docs
    .map((d) => toLearningPath(d.id, d.data()))
    .filter((p) => p !== null && p.steps.some((s) => s.resource === id))
    .map((p) => p!.title);
}

export async function deleteResource(
  id: string,
  actorUid: string,
): Promise<{ title: string } | null> {
  const db = adminDb();
  const ref = db.collection('resources').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const title = String(snap.get('title') ?? id);
  await ref.delete();
  await writeAudit(db, { actorUid, action: 'resource.delete', target: id, summary: title });
  return { title };
}
