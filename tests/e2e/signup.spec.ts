import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { test, expect } from '@playwright/test';

let app: App;
test.beforeAll(() => {
  if (
    process.env.STUDYSATHI_E2E !== '1' ||
    process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080' ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099'
  )
    throw new Error('Local emulators required');
  app = initializeApp({ projectId: 'demo-studysathi' }, randomUUID());
});
test.afterAll(async () => {
  await deleteApp(app);
});
test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) =>
    ['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname)
      ? route.continue()
      : route.abort(),
  );
});

for (const type of ['parent', 'creator'] as const) {
  test(`signup creates a new ${type} account and verified session`, async ({ page }) => {
    const email = `signup-${randomUUID()}@example.test`;
    await page.goto('/signup');
    await page
      .getByRole('radio', { name: type === 'parent' ? /Parent or guardian/ : /Course creator/ })
      .check();
    await page.getByLabel('Your name', { exact: true }).fill('Signup learner');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill('Signup-test-password-42');
    await page.getByRole('button', { name: 'Create account', exact: true }).click();
    await expect(page).toHaveURL(type === 'parent' ? /\/parent$/ : /\/account$/);
    const account = await getAuth(app).getUserByEmail(email);
    const profile = await getFirestore(app).collection('users').doc(account.uid).get();
    expect(profile.get('role')).toBe(type === 'parent' ? 'parent' : null);
    expect(profile.get('requestedRole')).toBe(type === 'creator' ? 'creator' : null);
    expect(account.customClaims?.role ?? null).toBe(type === 'parent' ? 'parent' : null);
    expect(
      (await page.context().cookies()).some(
        (cookie) => cookie.name === 'studysathi_e2e_session' && cookie.httpOnly,
      ),
    ).toBe(true);
  });
}

test('signup retries account setup after Auth creation without creating a second account', async ({
  page,
}) => {
  let attempts = 0;
  await page.route('**/api/auth/setup', (route) =>
    ++attempts === 1
      ? route.fulfill({
          status: 503,
          json: { ok: false, error: 'Setup unavailable. Please try again.' },
        })
      : route.continue(),
  );
  const email = `retry-${randomUUID()}@example.test`;
  await page.goto('/signup');
  await page.getByRole('radio', { name: /Parent or guardian/ }).check();
  await page.getByLabel('Your name', { exact: true }).fill('Retry parent');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill('Signup-test-password-42');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Setup unavailable.' })).toBeVisible();
  const first = await getAuth(app).getUserByEmail(email);
  expect((await getFirestore(app).collection('users').doc(first.uid).get()).exists).toBe(false);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page).toHaveURL(/\/parent$/);
  expect((await getAuth(app).getUserByEmail(email)).uid).toBe(first.uid);
  expect((await getFirestore(app).collection('users').doc(first.uid).get()).get('role')).toBe(
    'parent',
  );
});

test('signup setup rejects injected roles and forged tokens', async ({ request }) => {
  const url = 'http://localhost:3100/api/auth/setup';
  const headers = { origin: 'http://localhost:3100' };
  expect(
    (
      await request.post(url, {
        headers,
        data: { idToken: 'x'.repeat(30), accountType: 'admin', displayName: 'Probe' },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post(url, {
        headers,
        data: { idToken: 'x'.repeat(30), accountType: 'parent', displayName: 'Probe' },
      })
    ).status(),
  ).toBe(400);
  expect(
    (await request.post(url, { headers: { origin: 'https://other.test' }, data: {} })).status(),
  ).toBe(403);
});
