import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { publicRoutes } from '../src/data/routes';

test.describe('every public page', () => {
  for (const route of publicRoutes) {
    test(`${route.path} renders with a title, one h1 and a canonical URL`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/Sahyatri/);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    });
  }

  test('unknown pages show the 404 state', async ({ page }) => {
    const response = await page.goto('/this-road-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/wrong turn/i);
    await expect(page.getByRole('link', { name: /return home/i })).toBeVisible();
  });
});

test.describe('accessibility', () => {
  // Contrast is judged at rest: with reduced motion, entrance fades complete instantly.
  test.use({ reducedMotion: 'reduce' });

  for (const path of ['/', '/safety', '/help', '/contact']) {
    test(`${path} has no detectable axe violations`, async ({ page }) => {
      await page.goto(`${path}?webgl=off`);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
  }

  test('the skip link moves focus to the main content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard flow');
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });

  test('3D visuals are labelled images with static fallbacks', async ({ page }) => {
    await page.goto('/?webgl=off');
    const hero = page.getByRole('img', { name: /^Illustration of a mobility network/ });
    await expect(hero).toBeVisible();
    await expect(hero.locator('img[src*="/visuals/"]')).toHaveCount(1);
    await expect(page.locator('canvas')).toHaveCount(0);
  });
});

test.describe('navigation', () => {
  test('desktop Product menu opens and links to product pages', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation');
    await page.goto('/');
    await page.getByRole('button', { name: 'Product' }).click();
    await page.getByRole('link', { name: /for drivers/i }).first().click();
    await expect(page).toHaveURL(/\/drivers$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/empty seats/i);
  });

  test('mobile menu opens, traps focus and closes with Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile navigation');
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog', { name: 'Menu' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Safety' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});

test.describe('in-page anchors', () => {
  // Sections use content-visibility; jumps must still land exactly under the sticky header.
  for (const id of ['how-it-works', 'faq', 'get-the-app']) {
    test(`/#${id} lands under the header`, async ({ page }) => {
      await page.goto(`/#${id}`);
      await page.waitForTimeout(800);
      const top = await page.evaluate((i) => document.getElementById(i)!.getBoundingClientRect().top, id);
      expect(Math.abs(top - 80)).toBeLessThan(24);
    });
  }
});

test.describe('forms', () => {
  test('early access validates, then confirms', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /get early access/i }).click();
    await expect(page.getByText('Enter your email address.')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeFocused();

    await page.getByLabel('Email address').fill('asha@example.com');
    await page.getByRole('radio', { name: 'Both' }).check();
    await page.getByRole('button', { name: /get early access/i }).click();
    await expect(page.getByRole('status').filter({ hasText: /on the list/i })).toBeVisible();
  });

  test('contact topic is preselected from the link', async ({ page }) => {
    await page.goto('/contact?topic=press');
    await expect(page.getByLabel('Topic')).toHaveValue('press');
  });
});

test.describe('motion preferences', () => {
  test.use({ reducedMotion: 'reduce' });

  test('reduced motion keeps every section readable and static', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Move together.' })).toBeVisible();
    await page.locator('#network').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /every empty seat/i })).toBeVisible();
    const height = await page.locator('#network > div').evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBeLessThan(2000);
  });
});

test.describe('platform files', () => {
  test('sitemap lists every public page and robots points to it', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    for (const route of publicRoutes) expect(sitemap).toContain(route.path === '/' ? '</loc>' : `${route.path}</loc>`);
    expect(sitemap.match(/<url>/g)).toHaveLength(publicRoutes.length);
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap:');
  });

  test('security headers are sent', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  test('scene illustrations are served as cacheable SVG', async ({ request }) => {
    const response = await request.get('/visuals/mobility.svg');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/svg+xml');
    expect(await response.text()).toContain('viewBox="0 0 1600 900"');
  });
});
