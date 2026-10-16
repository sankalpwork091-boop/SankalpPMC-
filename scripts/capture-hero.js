const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureHero(outputPrefix = 'after-final', options = {}) {
  const outDir = path.join(process.cwd(), 'public', 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e1) {
    try {
      browser = await chromium.launch({ channel: 'chrome', headless: true });
    } catch (e2) {
      browser = await chromium.launch({ headless: true });
    }
  }

  const viewport = options.viewport || { width: 1440, height: 900 };
  const reducedMotion = options.reducedMotion ? 'reduce' : 'no-preference';

  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion,
  });

  const page = await context.newPage();
  console.log(`Navigating: ${outputPrefix} (viewport: ${viewport.width}x${viewport.height}, reducedMotion: ${reducedMotion})...`);
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });

  await page.waitForSelector('canvas', { timeout: 15000 });
  await page.waitForTimeout(2500);

  const progresses = options.progresses || [0, 0.3, 0.6, 0.9, 1.0];

  for (const p of progresses) {
    await page.evaluate((progress) => {
      const st = window.ScrollTrigger ? window.ScrollTrigger.getAll()[0] : null;
      if (st) {
        const targetScroll = st.start + (st.end - st.start) * progress;
        window.scrollTo(0, targetScroll);
        st.scroll(targetScroll);
      } else {
        const maxScroll = window.innerHeight * 5;
        window.scrollTo(0, maxScroll * progress);
      }
    }, p);

    await page.waitForTimeout(1000);

    const filename = `${outputPrefix}-p${p.toFixed(1).replace('.', '_')}.png`;
    const heroEl = await page.$('#hero-transformation');
    if (heroEl) {
      await heroEl.screenshot({ path: path.join(outDir, filename) });
    } else {
      await page.screenshot({ path: path.join(outDir, filename) });
    }
    console.log(`Saved ${filename}`);
  }

  await browser.close();
}

async function main() {
  // 1. Desktop final progression
  console.log('--- Capturing Desktop Final Progression ---');
  await captureHero('after-final', {
    viewport: { width: 1440, height: 900 },
    progresses: [0, 0.3, 0.6, 0.9, 1.0],
  });

  // 2. Mobile 414px
  console.log('--- Capturing Mobile 414px ---');
  await captureHero('mobile-414', {
    viewport: { width: 414, height: 896 },
    progresses: [0, 1.0],
  });

  // 3. Mobile 375px
  console.log('--- Capturing Mobile 375px ---');
  await captureHero('mobile-375', {
    viewport: { width: 375, height: 812 },
    progresses: [0, 1.0],
  });

  // 4. Reduced Motion
  console.log('--- Capturing Reduced Motion ---');
  await captureHero('reduced-motion', {
    viewport: { width: 1440, height: 900 },
    reducedMotion: true,
    progresses: [1.0],
  });

  console.log('All verification captures completed!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
