/** Read-only release probes. No learner documents, identifiers or credentials are printed. */
import { AggregateField, FieldPath } from 'firebase-admin/firestore';
import { fail, initScriptAdmin } from './lib/admin';

async function main() {
  const args = process.argv.slice(2);
  const project = args[args.indexOf('--project') + 1];
  if (!args.includes('--prod') || !args.includes('--project') || !project)
    fail('Use --prod --project <expected-project-id> for these read-only release checks.');
  const { db, target } = initScriptAdmin(true);
  if (target !== `project "${project}"`)
    fail('Configured Firebase project does not match --project.');
  const courses = db.collection('courses');
  const creator = courses.where('createdBy', '==', '__release_index_probe__');
  const probes = [
    {
      name: 'Published catalog',
      run: () =>
        courses
          .where('status', '==', 'published')
          .orderBy('updatedAt', 'desc')
          .select('status')
          .limit(1)
          .get(),
    },
    {
      name: 'Category catalog',
      run: () =>
        courses
          .where('status', '==', 'published')
          .where('category', '==', 'science')
          .orderBy('updatedAt', 'desc')
          .select('status')
          .limit(1)
          .get(),
    },
    {
      name: 'Review queue',
      run: () =>
        courses
          .where('status', 'in', ['draft', 'review'])
          .orderBy('updatedAt', 'desc')
          .select('status')
          .limit(1)
          .get(),
    },
    {
      name: 'Creator pagination',
      run: () => creator.orderBy(FieldPath.documentId()).select('status').limit(1).get(),
    },
    {
      name: 'Creator status totals',
      run: () => creator.where('status', '==', 'draft').count().get(),
    },
    ...['views', 'enrollments', 'completions', 'analyticsEnrollments', 'analyticsCompletions'].map(
      (field) => ({
        name: `Creator ${field} aggregate`,
        run: () => creator.aggregate({ total: AggregateField.sum(`stats.${field}`) }).get(),
      }),
    ),
  ];
  try {
    for (const probe of probes) {
      try {
        await probe.run();
        console.log(`PASS: ${probe.name}`);
      } catch (error) {
        const code =
          error && typeof error === 'object' && 'code' in error ? String(error.code) : 'unknown';
        console.error(`FAIL: ${probe.name} (code ${code}; check deployment/index readiness)`);
        process.exitCode = 1;
      }
    }
  } finally {
    await db.terminate();
  }
}
main().catch(() => {
  console.error('Live readiness check could not finish.');
  process.exitCode = 1;
});
