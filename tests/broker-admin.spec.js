import { test, expect } from '@playwright/test';

const BROKER_URL = 'https://admin.jrwfinance.com.au';
const CLIENT_URL = 'https://portal.jrwfinance.com.au';

// ── Login ──────────────────────────────────────────────────────────────────

test('broker admin login screen loads', async ({ page }) => {
  await page.goto(BROKER_URL);
  await expect(page.locator('text=Broker Admin')).toBeVisible();
  await expect(page.locator('#login-email')).toBeVisible();
  await expect(page.locator('#login-password')).toBeVisible();
});

test('broker admin rejects wrong password', async ({ page }) => {
  await page.goto(BROKER_URL);
  await page.fill('#login-email', 'wrong@example.com');
  await page.fill('#login-password', 'wrongpassword');
  await page.click('#btn-login');
  await expect(page.locator('#login-error')).toBeVisible({ timeout: 5000 });
});

test('broker admin demo mode loads dashboard', async ({ page }) => {
  await page.goto(BROKER_URL);
  await page.click('text=Preview in demo mode');
  await expect(page.locator('text=Client Dashboard')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.cc')).toHaveCount(3); // 3 demo clients
});

// ── Dashboard ──────────────────────────────────────────────────────────────

test('client search filters the grid', async ({ page }) => {
  await page.goto(BROKER_URL);
  await page.click('text=Preview in demo mode');
  await page.fill('#client-search', 'Alex');
  await expect(page.locator('.cc')).toHaveCount(1);
});

test('clicking a client opens their detail view', async ({ page }) => {
  await page.goto(BROKER_URL);
  await page.click('text=Preview in demo mode');
  await page.locator('.cc').first().click();
  await expect(page.locator('text=Overview')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=Portfolio')).toBeVisible();
});

// ── Client detail tabs ─────────────────────────────────────────────────────

test('all client tabs are reachable', async ({ page }) => {
  await page.goto(BROKER_URL);
  await page.click('text=Preview in demo mode');
  await page.locator('.cc').first().click();
  for (const tab of ['Portfolio', 'Planning', 'Messages', 'Documents', 'Profile', 'Audit log']) {
    await page.click(`.cd-link:has-text("${tab}")`);
    await expect(page.locator('.cd-tab.active')).toBeVisible();
  }
});

// ── Client portal ──────────────────────────────────────────────────────────

test('client portal login screen loads', async ({ page }) => {
  await page.goto(CLIENT_URL);
  await expect(page.locator('text=Client Portal')).toBeVisible();
  await expect(page.locator('#email')).toBeVisible();
});

test('client portal demo mode loads', async ({ page }) => {
  await page.goto(CLIENT_URL);
  await page.click('text=Preview in demo mode');
  await expect(page.locator('text=Overview')).toBeVisible({ timeout: 5000 });
});

// ── Mobile ─────────────────────────────────────────────────────────────────

test('broker admin is usable on mobile', async ({ page }) => {
  await page.goto(BROKER_URL);
  await page.click('text=Preview in demo mode');
  // Sidebar should be hidden on mobile (overlay mode)
  const sidebar = page.locator('#cd-sb, .sb');
  await expect(sidebar.first()).not.toHaveClass(/mobile-open/);
});
