import { test, expect } from '@playwright/test';

test('public safety mission explains choices, switches language and finishes without signup', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try the safety mission', exact: true }).click();
  await expect(page).toHaveURL(/\/safety-mission$/);
  await page
    .getByRole('radio', { name: 'Reply with the OTP before time runs out.', exact: true })
    .check();
  await page.getByRole('button', { name: 'Check my choice', exact: true }).click();
  await expect(page.locator('.safety-mission').getByRole('status')).toContainText(
    'Let’s look at a safer action.',
  );
  await expect(page.locator('.safety-mission').getByRole('status')).toContainText(
    'Keep OTPs, PINs and passwords private.',
  );
  await page.getByRole('button', { name: 'नेपाली', exact: true }).click();
  await expect(page.locator('.safety-mission')).toHaveAttribute('lang', 'ne');
  await expect(page.locator('.safety-mission').getByRole('status')).toContainText(
    'OTP, पिन र पासवर्ड गोप्य राख्नुहोस्।',
  );
  await page.screenshot({ path: testInfo.outputPath('nepali-feedback.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.getByRole('button', { name: 'Next situation', exact: true }).click();
  await page
    .getByRole('radio', {
      name: 'Do not pay or forward it. Show a trusted adult and verify independently.',
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: 'Check my choice', exact: true }).click();
  await page.getByRole('button', { name: 'Next situation', exact: true }).click();
  await page
    .getByRole('radio', {
      name: 'Read the page. If unsure, ask the teacher through the usual class channel.',
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: 'Check my choice', exact: true }).click();
  await page.getByRole('button', { name: 'See my safety plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your safety plan', exact: true })).toBeFocused();
  await expect(page.getByText('Safer first choices:', { exact: false })).toContainText('2 / 3');
  await page.getByRole('button', { name: 'Practise again', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'A wallet verification message', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
});
