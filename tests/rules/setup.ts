import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';

/** Start a rules test environment against the running Firestore emulator. */
export async function createRulesEnv(): Promise<RulesTestEnvironment> {
  const hostPort = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080';
  const [host = '127.0.0.1', port = '8080'] = hostPort.split(':');
  return initializeTestEnvironment({
    projectId: 'demo-studysathi',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host,
      port: Number(port),
    },
  });
}

/** Seed data with rules disabled (like the server would). */
export async function seed(
  env: RulesTestEnvironment,
  docs: Record<string, Record<string, unknown>>,
): Promise<void> {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    for (const [path, data] of Object.entries(docs)) await db.doc(path).set(data);
  });
}
