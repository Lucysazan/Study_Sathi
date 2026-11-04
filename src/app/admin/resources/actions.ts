'use server';

import { updateTag } from 'next/cache';
import { z } from 'zod';
import { CATALOG_TAG } from '@/data/catalog.server';
import { type ActionResult, fail, invalid, ok } from '@/lib/actions';
import { getAdmin, NOT_ALLOWED } from '@/lib/admin/guard';
import {
  createResource,
  deleteResource as removeResource,
  pathsUsingResource,
  updateResource,
} from '@/lib/admin/resources';
import { resourceInputSchema } from '@/lib/validation/catalog';

const idSchema = z.string().min(1).max(80);

/**
 * Create (id null) or update a resource. Validate → check admin → write + audit → refresh the
 * public catalogue cache so visitors see the change on their next page load.
 */
export async function saveResource(
  id: string | null,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = resourceInputSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  if (id !== null && !idSchema.safeParse(id).success) return fail('Unknown resource.');

  const admin = await getAdmin();
  if (!admin) return fail(NOT_ALLOWED);

  try {
    let savedId = id;
    if (id === null) {
      savedId = await createResource(parsed.data, admin.uid);
    } else if (!(await updateResource(id, parsed.data, admin.uid))) {
      return fail('This resource no longer exists.');
    }
    updateTag(CATALOG_TAG);
    return ok({ id: savedId ?? '' });
  } catch (error) {
    console.error('saveResource failed', error);
    return fail('Could not save the resource. Please try again.');
  }
}

export async function deleteResource(id: unknown): Promise<ActionResult<{ title: string }>> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return fail('Unknown resource.');

  const admin = await getAdmin();
  if (!admin) return fail(NOT_ALLOWED);

  try {
    const usedBy = await pathsUsingResource(parsedId.data);
    if (usedBy.length) {
      return fail(
        `This resource is a step in: ${usedBy.join(', ')}. Remove it from the path first.`,
      );
    }
    const deleted = await removeResource(parsedId.data, admin.uid);
    if (!deleted) return fail('This resource no longer exists.');
    updateTag(CATALOG_TAG);
    return ok(deleted);
  } catch (error) {
    console.error('deleteResource failed', error);
    return fail('Could not delete the resource. Please try again.');
  }
}
