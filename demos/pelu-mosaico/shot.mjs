import { chromium } from "playwright-core";

const out = process.argv[2];
const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500);

// 1) hero + widget robot presente
const hasWidget = await page.locator(".oib-launch").count();
await page.screenshot({ path: `${out}/fix-s1.png` });

// 2) botón "Cita online" abre el chat de reservas
await page.click("text=Cita online en 1 minuto");
await page.waitForTimeout(2500);
await page.screenshot({ path: `${out}/fix-booking.png` });
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// 3) menú de escritorio + ancla a Trabajos
await page.click("text=Menú");
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/fix-menu.png` });
await page.click('a[href="#trabajos"]');
await page.waitForTimeout(1600);
await page.screenshot({ path: `${out}/fix-s2-anchor.png` });

console.log(JSON.stringify({ hasWidget, errors }, null, 2));
await browser.close();
