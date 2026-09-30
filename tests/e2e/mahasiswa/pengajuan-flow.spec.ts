import { test, expect } from '@playwright/test';
import { loginAsMahasiswa } from '../../helpers/auth';

test.describe('Mahasiswa Module - Dashboard & Pengajuan', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMahasiswa(page);
  });

  test('should display Mahasiswa dashboard with stats and actions', async ({ page }) => {
    await expect(page).toHaveURL(/\/mahasiswa\/dashboard/);
    await expect(page.locator('text=/Dashboard|Mahasiswa/i').first()).toBeVisible();
    await expect(page.locator('a[href="/mahasiswa/pengajuan/new"], button:has-text("Ajukan")').first()).toBeVisible();
  });

  test('should navigate to Pengajuan list page', async ({ page }) => {
    await page.goto('/mahasiswa/pengajuan');
    await expect(page.locator('text=/Daftar Pengajuan|Riwayat/i').first()).toBeVisible();
    await expect(page.locator('a[href="/mahasiswa/pengajuan/new"]').first()).toBeVisible();
  });

  test('should display multi-step pengajuan create form', async ({ page }) => {
    await page.goto('/mahasiswa/pengajuan/new');
    await expect(page.locator('#nama_lomba')).toBeVisible();
    await expect(page.locator('text=/Informasi Perlombaan|Langkah/i').first()).toBeVisible();
    await expect(page.locator('button:has-text("Lanjut"), button:has-text("Next")').first()).toBeVisible();
  });

  test('should validate required fields on step 1 of create form', async ({ page }) => {
    await page.goto('/mahasiswa/pengajuan/new');
    await page.click('button:has-text("Lanjut"), button:has-text("Next")');
    await expect(page.locator('text=/wajib|harus|required/i').first()).toBeVisible();
  });
});
