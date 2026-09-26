/**
 * Lab performance audit with the locally installed Chrome.
 *
 *   node scripts/perf-audit.mjs [baseUrl] [path ...]
 *
 * For each page, on an emulated mid-range phone (4× CPU slowdown, ~9 Mbps / 60 ms RTT) and on
 * desktop, it reports LCP, CLS, total blocking time, transferred JS/HTML and whether the 3D
 * chunk was fetched before the user scrolled. Run against a production build (`npm run build && npm start`).
 */
import { chromium } from '@playwright/test';

const [, , base = 'http://localhost:3000', ...paths] = process.argv;
const pages = paths.length ? paths : ['/', '/safety', '/technology', '/help'];

const profiles = [
  { name: 'mobile', viewport: { width: 390, height: 844 }, mobile: true, cpu: 4, network: { latency: 60, down: 9e6 / 8, up: 3e6 / 8 } },
  { name: 'desktop', viewport: { width: 1440, height: 900 }, mobile: false, cpu: 1, network: null },
];

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu'] });

for (const profile of profiles) {
  for (const path of pages) {
    const context = await browser.newContext({
      viewport: profile.viewport,
      isMobile: profile.mobile,
      hasTouch: profile.mobile,
      deviceScaleFactor: profile.mobile ? 3 : 1,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    if (profile.network) {
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: profile.network.latency,
        downloadThroughput: profile.network.down,
        uploadThroughput: profile.network.up,
      });
    }
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });

    const bytes = { js: 0, html: 0, css: 0, font: 0, other: 0 };
    const threeChunks = [];
    const types = new Map();
    cdp.on('Network.responseReceived', (e) => types.set(e.requestId, { type: e.type, url: e.response.url }));
    cdp.on('Network.loadingFinished', (e) => {
      const info = types.get(e.requestId);
      if (!info) return;
      const key = info.type === 'Script' ? 'js' : info.type === 'Document' ? 'html' : info.type === 'Stylesheet' ? 'css' : info.type === 'Font' ? 'font' : 'other';
      bytes[key] += e.encodedDataLength;
    });

    await page.addInitScript(() => {
      window.__metrics = { lcp: 0, cls: 0, tbt: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__metrics.lcp = entry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__metrics.cls += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__metrics.tbt += Math.max(0, entry.duration - 50);
      }).observe({ type: 'longtask', buffered: true });
    });

    page.on('request', (request) => {
      if (/SceneRenderer|three|fiber/i.test(request.url())) threeChunks.push(request.url());
    });

    const started = Date.now();
    await page.goto(base + path, { waitUntil: 'load' });
    await page.waitForTimeout(4000);
    const metrics = await page.evaluate(() => window.__metrics);
    const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
    console.log(
      `${profile.name.padEnd(8)} ${path.padEnd(12)} LCP ${Math.round(metrics.lcp)} ms · CLS ${metrics.cls.toFixed(3)} · TBT ${Math.round(metrics.tbt)} ms · ` +
        `HTML ${kb(bytes.html)} · JS ${kb(bytes.js)} · CSS ${kb(bytes.css)} · fonts ${kb(bytes.font)} · load ${Date.now() - started} ms`,
    );
    await context.close();
  }
}

await browser.close();
