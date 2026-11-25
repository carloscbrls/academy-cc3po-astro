// Mobile QA gate: 390/375/360 screenshots + overflow/input-size/target
// checks across every page. Run against a served dist (or the live URL):
//   QA_BASE=http://localhost:4173 node scripts/mobile-qa.mjs
// Uses the fleet Playwright install on this machine.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const { firefox } = createRequire('/home/hatch/workspace/fleet-ci/package.json')('playwright');
const BASE = process.env.QA_BASE || 'http://localhost:4173';
const OUT = process.env.QA_OUT || '/tmp/academy-shots';
mkdirSync(OUT, { recursive: true });
const PAGES = ['/', '/apply/', '/cohort/', '/tracks/operator/', '/tracks/builder/', '/demo-day/', '/partners/', '/success/', '/privacy/', '/code-of-conduct/', '/es/', '/es/apply/', '/es/cohort/', '/es/tracks/operator/', '/es/tracks/builder/', '/es/success/'];
const WIDTHS = [390, 375, 360];
const browser = await firefox.launch();
let failures = 0;
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    const m = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      let smallInputs = 0, smallTargets = 0;
      document.querySelectorAll('input, select, textarea').forEach((el) => {
        if (el.type === 'hidden' || el.offsetParent === null) return;
        if (parseFloat(getComputedStyle(el).fontSize) < 16) smallInputs++;
      });
      document.querySelectorAll('a, button').forEach((el) => {
        if (el.offsetParent === null) return;
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.height < 24 || r.width < 24)) smallTargets++;
      });
      return { overflow, smallInputs, smallTargets };
    });
    const bad = m.overflow > 0 || m.smallInputs > 0;
    if (bad) failures++;
    console.log(`${bad ? 'FAIL' : 'ok  '} ${w}px ${p} overflow=${m.overflow} smallInputs=${m.smallInputs} sub24pxTargets=${m.smallTargets}`);
    if (w === 390) await page.screenshot({ path: `${OUT}/${p.replaceAll('/', '_') || '_root'}.png`, fullPage: false });
  }
  await ctx.close();
}
await browser.close();
console.log('FAILURES:', failures);
