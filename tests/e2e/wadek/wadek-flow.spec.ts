import { test, expect } from '@playwright/test';
import { loginAsWadek } from '../../helpers/auth';

test.describe('Wadek Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsWadek(page);
  });

  test('should display Wadek dashboard with charts and overview', async ({ page }) => {
    await expect(page).toHaveURL(/\/wadek\/dashboard/);
    await expect(page.locator('text=/Wadek|Wakil Dekan|Statistik/i').first()).toBeVisible();
  });

  test('should access Matriks Konversi management page', async ({ page }) => {
    await page.goto('/wadek/matriks');
    await expect(page.locator('text=/Matriks Konversi/i').first()).toBeVisible();
  });

  test('should access Tim Verifikator management page', async ({ page }) => {
    await page.goto('/wadek/verifikator');
    await expect(page.locator('text=/Verifikator/i').first()).toBeVisible();
  });

  test('should access Pemetaan Bidang MK page', async ({ page }) => {
    await page.goto('/wadek/bidang-mk');
    await expect(page.locator('text=/Bidang|Mata Kuliah/i').first()).toBeVisible();
  });
});
