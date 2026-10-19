const { chromium } = require('playwright');
const path = require('path');

const widths = [1440, 768, 375];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors = [];

  for (const w of widths) {
    const context = await browser.newContext({
      viewport: { width: w, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`[${w}px console.error] ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => {
      errors.push(`[${w}px pageerror] ${err.message}`);
    });

    await page.goto('http://localhost:3000/contact-us', { waitUntil: 'networkidle', timeout: 30000 });

    // Smooth scroll down to trigger inView animations
    await page.evaluate(async () => {
      const distance = 300;
      const delay = 100;
      while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
        document.scrollingElement.scrollBy(0, distance);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    });
    await page.waitForTimeout(800);

    const screenshotPath = path.join('public', 'screenshots', `contact-${w}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Captured ${screenshotPath}`);
    await context.close();
  }

  await browser.close();
  console.log('Total console/page errors:', errors.length);
  if (errors.length) {
    console.log(errors);
  }
})();
