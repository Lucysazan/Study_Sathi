/**
 * Load the curated catalogue into Firestore: resources, learning paths and badges.
 *
 *   npm run seed                  # emulators: add anything missing
 *   npm run seed -- --force       # emulators: overwrite with the seed files
 *   npm run seed -- --prod        # real project: add anything missing (never overwrites)
 *
 * Without --force, existing documents are left alone, so admin edits are never lost.
 */
import { FieldValue } from 'firebase-admin/firestore';
import { badges } from '../src/data/seed/badges';
import { learningPaths } from '../src/data/seed/learningPaths';
import resources from '../src/data/seed/resources.json';
import { toLearningPath, toResource } from '../src/lib/validation/catalog';
import { fail, initScriptAdmin } from './lib/admin';

type Doc = { collection: string; id: string; data: Record<string, unknown> };

async function main() {
  const args = process.argv.slice(2);
  const prod = args.includes('--prod');
  const force = args.includes('--force');
  if (prod && force) fail('--force is not allowed with --prod (it would overwrite admin edits).');

  const docs: Doc[] = [
    ...resources.map((r, i) => {
      const { id, ...data } = r;
      return { collection: 'resources', id, data: { ...data, order: i + 1 } };
    }),
    ...learningPaths.map((p, i) => {
      const { id, ...data } = p;
      return { collection: 'learningPaths', id, data: { ...data, order: i + 1 } };
    }),
    ...badges.map(({ id, ...data }) => ({ collection: 'badges', id, data })),
  ];

  // Validate before writing anything.
  for (const d of docs) {
    const ok =
      d.collection === 'resources'
        ? toResource(d.id, d.data)
        : d.collection === 'learningPaths'
          ? toLearningPath(d.id, d.data)
          : d.data;
    if (!ok) fail(`Seed data is invalid: ${d.collection}/${d.id}`);
  }

  const { db, target } = initScriptAdmin(prod);
  const counts = { written: 0, skipped: 0 };
  const batch = db.batch();
  for (const d of docs) {
    const ref = db.collection(d.collection).doc(d.id);
    if (!force && (await ref.get()).exists) {
      counts.skipped++;
      continue;
    }
    batch.set(ref, { ...d.data, updatedAt: FieldValue.serverTimestamp() });
    counts.written++;
  }
  await batch.commit();
  console.log(
    `\n✔ Seeded ${target}: ${counts.written} written, ${counts.skipped} already there (kept).` +
      (counts.skipped && !force ? '\n  Use --force on the emulators to overwrite.' : '') +
      '\n',
  );
}

main().catch((error: unknown) => fail(error instanceof Error ? error.message : String(error)));
