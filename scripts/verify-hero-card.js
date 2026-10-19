const { chromium } = require('playwright');
const path = require('path');

const widths = [1920, 1440, 1024, 768, 414, 375];

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

    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('canvas', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);

    // Scroll hero to climax (progress 1.0)
    await page.evaluate(() => {
      const st = window.ScrollTrigger ? window.ScrollTrigger.getAll()[0] : null;
      if (st) {
        window.scrollTo(0, st.end);
        st.scroll(st.end);
      } else {
        window.scrollTo(0, window.innerHeight * 5);
      }
    });
    await page.waitForTimeout(1500);

    const screenshotPath = path.join('public', 'screenshots', `hero-card-${w}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`Captured ${screenshotPath}`);

    // Verify button href
    if (w === 1440) {
      const button = page.locator('a:has-text("Schedule Committee Meeting")');
      const href = await button.getAttribute('href');
      console.log(`Button href on 1440px: ${href}`);
      if (href !== '/contact-us') {
        errors.push(`Expected button href to be '/contact-us', got '${href}'`);
      }
    }

    await context.close();
  }

  // Also test prefers-reduced-motion
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await rmPage.waitForSelector('canvas', { timeout: 15000 }).catch(() => {});
  await rmPage.waitForTimeout(1500);
  await rmPage.evaluate(() => {
    const st = window.ScrollTrigger ? window.ScrollTrigger.getAll()[0] : null;
    if (st) {
      window.scrollTo(0, st.end);
      st.scroll(st.end);
    } else {
      window.scrollTo(0, window.innerHeight * 5);
    }
  });
  await rmPage.waitForTimeout(1500);
  const rmPath = path.join('public', 'screenshots', 'hero-card-reduced-motion.png');
  await rmPage.screenshot({ path: rmPath });
  console.log(`Captured ${rmPath}`);
  await rmContext.close();

  await browser.close();
  console.log('Total errors:', errors.length);
  if (errors.length) {
    console.log(errors);
  }
})();
