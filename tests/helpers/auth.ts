import { Page, expect } from '@playwright/test';

export async function loginAsMahasiswa(page: Page) {
  await page.goto('/login');
  await page.fill('#email', 'mhs.si@test.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/mahasiswa/dashboard', { timeout: 15000 });
  await expect(page.locator('h1, h2')).toContainText(/Dashboard|SIMPRESMA|Prestasi/i);
}

export async function loginAsVerifikator(page: Page) {
  await page.goto('/login');
  await page.fill('#email', 'verif.si@test.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/verifikator/dashboard', { timeout: 15000 });
}

export async function loginAsTendik(page: Page) {
  await page.goto('/login');
  await page.fill('#email', 'tendik@test.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/tendik/dashboard', { timeout: 15000 });
}

export async function loginAsWadek(page: Page) {
  await page.goto('/login');
  await page.fill('#email', 'wadek@test.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/wadek/dashboard', { timeout: 15000 });
}

export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.fill('#email', 'admin@simpresma.unej.ac.id');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/kelola-role', { timeout: 15000 });
}

export async function logout(page: Page) {
  await page.click('button:has-text("Logout"), button:has-text("Keluar")');
  await page.waitForURL('**/login', { timeout: 15000 });
}
