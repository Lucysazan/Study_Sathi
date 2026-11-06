import { test, expect } from '@playwright/test';

test('academic public learning recommends revision and offers different follow-up questions', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Start Academic Study', exact: true }).click();
  await expect(page).toHaveURL(/\/study$/);
  await page.getByRole('link', { name: 'Choose Grade 9', exact: true }).click();
  await expect(page).toHaveURL(/\/study\/9$/);
  await page.getByRole('link', { name: 'Study Mathematics', exact: true }).click();
  await expect(page).toHaveURL(/\/study\/9\/mathematics$/);
  await page.getByRole('link', { name: 'Study Sets', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sets', exact: true })).toBeVisible();
  const fields = page.locator('.academic-practice fieldset');
  await expect(fields.first().getByRole('radio').first()).toBeEnabled();
  await fields.nth(0).getByRole('radio').nth(0).check();
  await fields.nth(1).getByRole('radio').nth(2).check();
  await fields.nth(2).getByRole('radio').nth(0).check();
  await fields.nth(3).getByRole('radio').nth(2).check();
  await page.getByRole('button', { name: 'Check answers', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your practice result: 3/4', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Review Elements and membership', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Review Union and intersection', exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('.academic-feedback')).toBeFocused();
  await expect(page.locator('.academic-feedback').getByRole('status')).toContainText('Visit-only');
  await page.getByRole('button', { name: 'Try follow-up practice', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Follow-up practice', exact: true }),
  ).toBeFocused();
  await expect(fields.first()).toContainText('B = {5, 10, 15}');
  await fields.nth(0).getByRole('radio').nth(1).check();
  await fields.nth(1).getByRole('radio').nth(2).check();
  await fields.nth(2).getByRole('radio').nth(0).check();
  await fields.nth(3).getByRole('radio').nth(1).check();
  await page.getByRole('button', { name: 'Check answers', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your practice result: 4/4', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: testInfo.outputPath('academic-result.png'), fullPage: true });
});
