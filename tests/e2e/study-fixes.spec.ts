import { test, expect } from '@playwright/test';
import { schoolLibrary, subjectLabels } from '../../src/lib/academic/library';

test('class filters scope subjects and reset dependent selections for every class', async ({
  page,
}) => {
  await page.goto('/study');
  await expect(
    page.getByRole('heading', { name: 'Textbook files may not open right now' }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Clear saved study activity', exact: true }),
  ).toHaveCount(0);
  const grade = page.getByRole('combobox', { name: 'Class', exact: true });
  const subject = page.getByRole('combobox', { name: 'Subject', exact: true });
  for (let value = 1; value <= 12; value++) {
    await grade.selectOption(String(value));
    const expected = [
      ...new Set(
        [...schoolLibrary.books, ...schoolLibrary.playlists]
          .filter((item) => item.grade === value)
          .map((item) => subjectLabels[item.subject]?.name || item.subject),
      ),
    ].sort();
    await expect(subject.locator('option')).toHaveText(['All subjects', ...expected]);
  }
  await subject.selectOption({ index: 1 });
  await page.getByRole('combobox', { name: 'Material', exact: true }).selectOption({ index: 1 });
  await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption({ index: 1 });
  await grade.selectOption('10');
  await expect(subject).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Material', exact: true })).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Language', exact: true })).toHaveValue('');
  await subject.selectOption('Mathematics');
  const results = page.locator('.catalog-results li');
  await expect(results.first()).toContainText('Class 10');
  for (const text of await results.allTextContents()) expect(text).toContain('Class 10');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('site header returns after Quick Learn Back and browser history without reload', async ({
  page,
}) => {
  await page.route('https://www.youtube.com/iframe_api', (route) => route.abort());
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => {
    (window as Window & { navigationProbe?: string }).navigationProbe = 'same-document';
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.getByRole('link', { name: 'Explore Quick Learn', exact: true }).click();
    await expect(page.locator('body > header')).toHaveCount(0);
    await page.getByRole('link', { name: 'Back to StudySathi', exact: true }).click();
    await expect(page.locator('body > header')).toBeVisible();
    await expect(page.locator('body > footer')).toBeVisible();
  }
  await page.getByRole('link', { name: 'Explore Quick Learn', exact: true }).click();
  await expect(page).toHaveURL(/\/quick-learn$/);
  await expect(page.locator('.quick-heading')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('body > header')).toBeVisible();
  const menu = page.getByRole('button', { name: 'Open navigation', exact: true });
  if (await menu.isVisible()) await menu.click();
  await page
    .getByRole('navigation', { name: 'Main navigation', exact: true })
    .getByRole('link', { name: 'Play and Learn', exact: true })
    .click();
  await expect(page).toHaveURL(/\/play$/);
  await expect(page.locator('body > header')).toBeVisible();
  expect(
    await page.evaluate(() => (window as Window & { navigationProbe?: string }).navigationProbe),
  ).toBe('same-document');
  expect(errors).toEqual([]);
});
