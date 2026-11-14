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
