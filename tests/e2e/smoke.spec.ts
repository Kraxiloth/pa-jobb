import { test, expect } from '@playwright/test';

test('shows the På Jobb development shell', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'På Jobb' })).toBeVisible();
  await expect(page.getByText('Fra befaring til ferdig jobb.')).toBeVisible();
});
