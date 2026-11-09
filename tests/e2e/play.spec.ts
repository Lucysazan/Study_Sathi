import { test, expect } from '@playwright/test';
test('public learning journey supports games, feedback and guest privacy', async ({ page }) => {
  let progressReads = 0;
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/study' && request.method() === 'GET')
      progressReads++;
  });
  await page.route('**/*', (r) =>
    ['localhost', '127.0.0.1'].includes(new URL(r.request().url()).hostname)
      ? r.continue()
      : r.abort(),
  );
  await page.goto('/play');
  await expect(page.getByRole('heading', { name: 'Play and Learn', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Start Plan a small budget', exact: true }).click();
  await page.getByLabel('Spend from Rs 100: Rs 50').fill('85');
  await expect(page.getByRole('status').filter({ hasText: 'Rs 15 remaining' })).toBeVisible();
  await expect(page.locator('.learning-check fieldset')).toHaveCount(0);
  expect(progressReads).toBe(0);
  await page.getByRole('button', { name: 'Check what I learned', exact: true }).click();
  const fields = page.locator('.learning-check fieldset');
  await expect(fields.first().getByRole('radio').first()).toBeEnabled();
  await fields.first().getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Hide questions', exact: true }).click();
  await expect(fields.first()).not.toBeVisible();
  await page.getByRole('button', { name: 'Check what I learned', exact: true }).click();
  await expect(fields.first().getByRole('radio').first()).toBeChecked();
  expect(progressReads).toBe(1);
  for (let i = 0; i < 3; i++) await fields.nth(i).getByRole('radio').nth(0).check();
  await page.getByRole('button', { name: 'Check learning', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your learning check: 1/3', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'Visit-only practice' })).toBeVisible();
  await page.getByRole('button', { name: 'Try learning check again', exact: true }).click();
  for (let i = 0; i < 3; i++) await fields.nth(i).getByRole('radio').nth(i).check();
  await page.getByRole('button', { name: 'Check learning', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your learning check: 3/3', exact: true }),
  ).toBeVisible();
  await page.goto('/play/fractions');
  await expect(page.locator('.study-simulation')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Load simulation', exact: true })).toHaveCount(0);
  await expect(page.locator('.learning-check fieldset')).toHaveCount(0);
  await expect(page.locator('.study-simulation')).toHaveAttribute(
    'src',
    /^https:\/\/phet.colorado.edu\/sims\/html\/fractions-intro/,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/resources/7');
  await expect(
    page.getByRole('link', { name: 'Learn Plan a small budget', exact: true }),
  ).toBeVisible();
  await page.goto('/play/progress');
  await expect(page.getByRole('link', { name: 'Sign in as a student', exact: true })).toBeVisible();
});
