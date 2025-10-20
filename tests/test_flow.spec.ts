import { test, expect } from '@playwright/test';

test.describe('20/10 Gift Website Flow', () => {
  test('should complete the full gift flow', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');

    // Check landing page elements
    await expect(page.locator('h1')).toContainText('Chúc mừng ngày Phụ Nữ Việt Nam');
    await expect(page.locator('button')).toContainText('Xem món quà đặc biệt này nhé');

    // Click gift button
    await page.click('button:has-text("Xem món quà đặc biệt này nhé")');

    // Should navigate to gift page
    await expect(page).toHaveURL('/gift');
    await expect(page.locator('h1')).toContainText('Món quà bí mật');

    // Wait for Allay to appear
    await expect(page.locator('[data-testid="allay"]')).toBeVisible({ timeout: 10000 });

    // Click on Allay
    await page.click('[data-testid="allay"]');

    // Wait for gift boxes to appear
    await expect(page.locator('[data-testid="gift-box-1"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="gift-box-2"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="gift-box-3"]')).toBeVisible({ timeout: 5000 });

    // Click on first gift box
    await page.click('[data-testid="gift-box-1"]');

    // Fill out the form
    await page.fill('input[placeholder*="Họ và tên"]', 'Nguyễn Thị Linh');
    await page.fill('input[placeholder*="Số điện thoại"]', '0123456789');
    await page.fill('textarea[placeholder*="Địa chỉ"]', '123 Đường ABC, Quận 1, TP.HCM');

    // Submit form
    await page.click('button:has-text("Gửi thông tin")');

    // Wait for success message and stay on gift page
    await expect(page.locator('text=Món quà của bạn đã được ghi nhận')).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL('/gift');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Navigate to landing page
    await page.goto('/');

    // Check mobile layout
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button')).toBeVisible();

    // Click gift button
    await page.click('button:has-text("Xem món quà đặc biệt này nhé")');

    // Check gift page on mobile
    await expect(page).toHaveURL('/gift');

    // Click on Allay
    await page.click('[data-testid="allay"]');

    // Check gift boxes are stacked vertically on mobile
    const giftBoxes = page.locator('[data-testid^="gift-box"]');
    await expect(giftBoxes).toHaveCount(3);

    // Click on first gift box
    await page.click('[data-testid="gift-box-1"]');

    // Check modal is full screen on mobile
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Fill form on mobile
    await page.fill('input[placeholder*="Họ và tên"]', 'Nguyễn Thị Linh');
    await page.fill('input[placeholder*="Số điện thoại"]', '0123456789');
    await page.fill('textarea[placeholder*="Địa chỉ"]', '123 Đường ABC, Quận 1, TP.HCM');

    // Submit form
    await page.click('button:has-text("Gửi thông tin")');

    // Wait for success; remain on gift page
    await expect(page.locator('text=Món quà của bạn đã được ghi nhận')).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL('/gift');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/github-issue-proxy', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.goto('/gift');

    // Complete the flow until form submission
    await page.click('[data-testid="allay"]');
    await page.click('[data-testid="gift-box-1"]');

    await page.fill('input[placeholder*="Họ và tên"]', 'Test User');
    await page.fill('input[placeholder*="Số điện thoại"]', '0123456789');
    await page.fill('textarea[placeholder*="Địa chỉ"]', 'Test Address');

    await page.click('button:has-text("Gửi thông tin")');

    // Should show error message
    await expect(page.locator('text=Có lỗi xảy ra')).toBeVisible({ timeout: 10000 });
  });
});
