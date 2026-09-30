import { test, expect } from '@playwright/test';
import { loginAsTendik } from '../../helpers/auth';

test.describe('Tendik Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTendik(page);
  });

  test('should display Tendik dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/\/tendik\/dashboard/);
    await expect(page.locator('text=/Tendik|Finalisasi|Konversi/i').first()).toBeVisible();
  });

  test('should view approved pengajuan ready for finalization', async ({ page }) => {
    await page.goto('/tendik/pengajuan');
    await expect(page.locator('text=/Finalisasi|Diterima/i').first()).toBeVisible();
  });
});
