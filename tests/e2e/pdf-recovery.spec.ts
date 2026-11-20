import { test, expect } from '@playwright/test';
import { schoolLibrary, bookPath } from '../../src/lib/academic/library';

test('old government bookmark offers explicitly identified readable editions', async ({ page }) => {
  await page.route('https://pustakalaya.org/media/**', (route) => route.abort());
  await page.goto('/study/6/mathematics/read/cdc-113');
  await expect(page.locator('.library-pdf')).toHaveCount(0);
  await expect(page.getByText(/original government file is currently unavailable/)).toBeVisible();
  await page.getByRole('link', { name: 'Read available textbook', exact: true }).first().click();
  await expect(page.locator('.library-pdf')).toHaveAttribute(
    'src',
    /^https:\/\/pustakalaya\.org\/media\/uploads\/documents\/.*\.pdf#page=1$/,
  );
  await expect(page.getByRole('link', { name: 'View source and edition details' })).toHaveAttribute(
    'href',
    /^https:\/\/pustakalaya\.org\/documents\/detail\//,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('each class exposes readable textbooks rather than the failed file host', async ({ page }) => {
  await page.route('https://pustakalaya.org/media/**', (route) => route.abort());
  for (let grade = 1; grade <= 12; grade++) {
    const book = schoolLibrary.books.find((item) => item.grade === grade);
    if (!book) throw new Error('Missing readable book for class ' + grade);
    await page.goto(bookPath(book));
    await expect(page.locator('.library-pdf')).toHaveAttribute('src', book.pdfUrl + '#page=1');
    await expect(
      page.getByRole('link', { name: 'Download / open PDF', exact: true }),
    ).toHaveAttribute('href', book.pdfUrl);
  }
});
