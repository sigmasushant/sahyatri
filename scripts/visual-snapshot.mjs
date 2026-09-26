/**
 * Design-review snapshots with the locally installed Chrome (GPU-accelerated WebGL).
 *
 *   node scripts/visual-snapshot.mjs <url> <outPrefix> [width] [height] [section|full] ["selector|offset|waitMs" ...]
 *
 * Example: node scripts/visual-snapshot.mjs "http://localhost:3000/?webgl=high" ./shots/home 1440 900 section "#matching|200|7000"
 * Append ?webgl=off|low|high to the URL to force a device tier.
 */
import { chromium } from '@playwright/test';

const [, , url, out, width = '1440', height = '900', full = 'section', ...selectors] = process.argv;
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: +width, height: +height }, deviceScaleFactor: 1 });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const renderer = await page.evaluate(() => {
  const gl = document.createElement('canvas').getContext('webgl');
  const info = gl && gl.getExtension('WEBGL_debug_renderer_info');
  return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'none';
});
console.log('renderer:', renderer);
if (full === 'full') {
  // Scroll through the page so lazy scenes and reveals trigger, then capture everything.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 600) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}-full.png`, fullPage: true });
} else {
  await page.screenshot({ path: `${out}-0.png` });
}
let i = 1;
for (const selector of selectors) {
  const [sel, offset = '0', wait = '3500'] = selector.split('|');
  await page.evaluate(
    ([s, o]) => {
      const el = document.querySelector(s);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + Number(o), behavior: 'instant' });
    },
    [sel, offset],
  );
  await page.waitForTimeout(+wait);
  await page.screenshot({ path: `${out}-${i++}.png` });
}
console.log(logs.filter((l) => !l.includes('React DevTools') && !l.includes('[HMR]')).join('\n'));
await browser.close();
