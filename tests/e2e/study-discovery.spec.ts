import { test, expect } from '@playwright/test';

test('study search filters, saved reading, language and privacy reset', async ({ page }) => {
  await page.route('**/*', (route) =>
    ['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname)
      ? route.continue()
      : route.abort(),
  );
  await page.goto('/study');
  const search = page.getByRole('region', { name: 'Search school library' });
  await search.getByRole('combobox', { name: 'Class', exact: true }).selectOption('6');
  await search.getByRole('combobox', { name: 'Subject', exact: true }).selectOption('Mathematics');
  await search.getByRole('combobox', { name: 'Material', exact: true }).selectOption('PDF');
  await expect(search.getByRole('link').first()).toBeVisible();
  await search.getByRole('link').first().click();
  await page.getByRole('button', { name: 'Retry PDF viewer', exact: true }).click();
  await page.getByLabel('PDF page', { exact: true }).fill('7');
  await page.getByRole('button', { name: 'Go to page', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Retry PDF viewer', exact: true }).click();
  await expect(page.locator('.library-pdf')).toHaveAttribute('src', /#page=7$/);
  await page.goto('/study');
  await expect(page.getByRole('link', { name: /Continue studying:/ })).toBeVisible();
  await page.getByRole('button', { name: 'English / नेपाली', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('कक्षा छान्नुहोस्');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('कक्षा छान्नुहोस्');
  await page.getByRole('button', { name: 'Clear saved study activity', exact: true }).click();
  await expect(page.getByRole('link', { name: /Continue studying:/ })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('chapter resources include offline original notes and interactive sets', async ({ page }) => {
  await page.goto('/study/9/mathematics/sets');
  await expect(
    page.getByRole('heading', { name: 'Read → Watch → Practise', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Save original notes for offline reading', exact: true }),
  ).toHaveAttribute('href', /^data:text\/plain/);
  const explorer = page.getByRole('heading', { name: 'Explore sets', exact: true }).locator('..');
  await explorer.getByLabel('Set operation').selectOption('intersection');
  await explorer.getByRole('button', { name: 'Select number 3', exact: true }).click();
  await explorer.getByRole('button', { name: 'Check set selection', exact: true }).click();
  await expect(explorer.getByRole('status')).toContainText('Correct!');
});
