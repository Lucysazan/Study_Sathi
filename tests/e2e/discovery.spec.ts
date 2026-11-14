import { test, expect } from '@playwright/test';

test('guided discovery leads from playful home to a saved learning roadmap', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.discovery-door')).toHaveCount(4);
  await page
    .locator('.discovery-spotlight')
    .getByRole('button', { name: 'Flip the switch preview', exact: true })
    .click();
  await expect(page.locator('.discovery-spotlight .preview-status')).toHaveText('You lit it up!');
  await page.locator('.discovery-door').filter({ hasText: 'Follow a trail' }).click();
  await page.locator('.path-card').first().click();
  const roadmap = page.getByRole('navigation', { name: 'Your learning roadmap', exact: true });
  await expect(roadmap.locator('a')).toHaveCount(4);
  await roadmap.locator('a').first().click();
  await expect(page.locator('#trail-step-0')).toBeInViewport();
  await page
    .locator('#trail-step-0')
    .getByRole('button', { name: 'Mark Step Complete', exact: true })
    .click();
  await expect(roadmap.locator('a').first()).toContainText('Done');
  await page.reload();
  await expect(roadmap.locator('a').first()).toContainText('Done');
  await page.goto('/resources');
  await expect(page.locator('.resource-scene').first()).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Choose how to learn' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('resource adventures are interactive and English and maths trails credit their providers', async ({
  page,
}) => {
  await page.goto('/resources/4');
  await expect(page.locator('.detail-visual')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'One small step today' })).toBeVisible();
  const preview = page.locator('.resource-adventure');
  const before = await preview.locator('.preview-status').textContent();
  await preview.getByRole('button', { name: 'Finish a step preview', exact: true }).click();
  await expect(preview.locator('.preview-status')).not.toHaveText(before || '');
  await page.goto('/learning-paths');
  await page.locator('.path-card').filter({ hasText: 'My English adventure' }).click();
  const words = page.getByRole('link', { name: /Play word games/ });
  await expect(words).toHaveAttribute(
    'href',
    'https://learnenglishkids.britishcouncil.org/grammar-vocabulary/word-games',
  );
  await expect(words).toHaveAttribute('target', '_blank');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page
    .locator('#trail-step-0')
    .getByRole('button', { name: 'Mark Step Complete', exact: true })
    .click();
  await page.reload();
  await expect(page.locator('.trail-stop').first()).toContainText('Done');
  await page.goto('/learning-paths/maths-world');
  await expect(page.getByRole('link', { name: /Open the maths map/ })).toHaveAttribute(
    'href',
    'https://math-world.e-learningforkids.org/en/grade-1/map',
  );
  await expect(
    page.getByRole('link', { name: 'Try the fractions game', exact: true }),
  ).toHaveAttribute('href', '/play/fractions');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
