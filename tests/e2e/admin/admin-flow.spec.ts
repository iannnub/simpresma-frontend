import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../../helpers/auth';

test.describe('Admin Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should display Kelola Role user management page', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/kelola-role/);
    await expect(page.locator('text=/Kelola Role|Pengguna/i').first()).toBeVisible();
  });
});
