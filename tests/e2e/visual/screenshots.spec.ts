import { test, expect } from '@playwright/test';
import {
  loginAsMahasiswa,
  loginAsVerifikator,
  loginAsTendik,
  loginAsWadek
} from '../../helpers/auth';

test.describe('Visual Regression - Critical Application Pages', () => {
  test('Login Page Visual Appearance', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('form')).toBeVisible();

    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Mahasiswa Dashboard Visual Layout', async ({ page }) => {
    await loginAsMahasiswa(page);
    await page.goto('/mahasiswa/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    await expect(page).toHaveScreenshot('mahasiswa-dashboard.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Mahasiswa New Pengajuan Form Visual Step 1', async ({ page }) => {
    await loginAsMahasiswa(page);
    await page.goto('/mahasiswa/pengajuan/new');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('form')).toBeVisible();

    await expect(page).toHaveScreenshot('mahasiswa-pengajuan-step1.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Verifikator Dashboard Visual Queue', async ({ page }) => {
    await loginAsVerifikator(page);
    await page.goto('/verifikator/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    await expect(page).toHaveScreenshot('verifikator-dashboard.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Tendik Dashboard Visual Overview', async ({ page }) => {
    await loginAsTendik(page);
    await page.goto('/tendik/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    await expect(page).toHaveScreenshot('tendik-dashboard.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Wadek Dashboard Visual Overview', async ({ page }) => {
    await loginAsWadek(page);
    await page.goto('/wadek/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    await expect(page).toHaveScreenshot('wadek-dashboard.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });
});
