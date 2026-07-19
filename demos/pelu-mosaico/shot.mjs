import { chromium } from "playwright-core";

const out = process.argv[2];
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500); // splash + revelado

await page.screenshot({ path: `${out}/pw-s1.png` });
await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/pw-s2.png` });
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/pw-s3.png` });

// móvil
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await m.waitForTimeout(3500);
await m.screenshot({ path: `${out}/pw-m1.png` });

await browser.close();
console.log("ok");
