import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/SIMPRESMA/i);
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation error on empty fields', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('#email-error')).toBeVisible();
    await expect(page.locator('#password-error')).toBeVisible();
  });

  test('should reject invalid credentials with error notification', async ({ page }) => {
    await page.fill('#email', 'wrong@test.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=/Gagal Masuk|Invalid credentials|tidak sesuai/i')).toBeVisible({
      timeout: 10000,
    });
  });

  test('should successfully login as Mahasiswa', async ({ page }) => {
    await page.fill('#email', 'mhs.si@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/mahasiswa/dashboard');
    await expect(page.locator('text=/Dashboard|Mahasiswa/i').first()).toBeVisible();
  });

  test('should successfully login as Verifikator', async ({ page }) => {
    await page.fill('#email', 'verif.si@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/verifikator/dashboard');
    await expect(page.locator('text=/Dashboard|Verifikasi|Antrean/i').first()).toBeVisible();
  });

  test('should successfully login as Tendik', async ({ page }) => {
    await page.fill('#email', 'tendik@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/tendik/dashboard');
    await expect(page.locator('text=/Dashboard|Tendik|Finalisasi/i').first()).toBeVisible();
  });

  test('should successfully login as Wadek', async ({ page }) => {
    await page.fill('#email', 'wadek@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/wadek/dashboard');
    await expect(page.locator('text=/Dashboard|Wadek|Matriks/i').first()).toBeVisible();
  });
});
