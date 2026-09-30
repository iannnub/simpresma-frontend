import { test, expect } from '@playwright/test';
import { loginAsVerifikator } from '../../helpers/auth';

test.describe('Verifikator Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsVerifikator(page);
  });

  test('should display Verifikator dashboard with queue and stats', async ({ page }) => {
    await expect(page).toHaveURL(/\/verifikator\/dashboard/);
    await expect(page.locator('text=/Verifikasi|Verifikator|Antrean/i').first()).toBeVisible();
  });

  test('should view Pengajuan queue list for verifikator prodi', async ({ page }) => {
    await page.goto('/verifikator/pengajuan');
    await expect(page.locator('text=/Verifikasi|Daftar Pengajuan/i').first()).toBeVisible();
  });
});
