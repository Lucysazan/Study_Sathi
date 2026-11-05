import { z } from 'zod';

export const libraryKey = z
  .string()
  .min(1)
  .max(300)
  .regex(/^[a-zA-Z0-9_-]+$/);
export const librarySchema = z.object({
  savedIds: z.array(libraryKey).max(200),
  progress: z.array(libraryKey).max(200),
  notes: z
    .record(libraryKey, z.string().max(4000))
    .refine(
      (notes) =>
        Object.keys(notes).length <= 100 &&
        Object.values(notes).reduce((sum, value) => sum + value.length, 0) <= 100000,
    ),
});
export type LibraryData = z.infer<typeof librarySchema>;
export const emptyLibrary: LibraryData = { savedIds: [], progress: [], notes: {} };
export const libraryChange = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('saved'), key: libraryKey, value: z.boolean() }),
  z.object({ kind: z.literal('progress'), key: libraryKey, value: z.boolean() }),
  z.object({ kind: z.literal('note'), key: libraryKey, value: z.string().max(4000) }),
  z.object({ kind: z.literal('merge'), data: librarySchema }),
]);
export type LibraryChange = z.infer<typeof libraryChange>;

export function changeLibrary(current: LibraryData, change: LibraryChange): LibraryData {
  if (change.kind === 'merge')
    return librarySchema.parse({
      savedIds: [...new Set([...current.savedIds, ...change.data.savedIds])],
      progress: [...new Set([...current.progress, ...change.data.progress])],
      notes: { ...change.data.notes, ...current.notes },
    });
  if (change.kind === 'note')
    return librarySchema.parse({
      ...current,
      notes: { ...current.notes, [change.key]: change.value },
    });
  const field = change.kind === 'saved' ? 'savedIds' : 'progress';
  return librarySchema.parse({
    ...current,
    [field]: change.value
      ? [...new Set([...current[field], change.key])]
      : current[field].filter((key) => key !== change.key),
  });
}
