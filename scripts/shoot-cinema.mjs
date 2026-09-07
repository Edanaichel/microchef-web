/**
 * Drives the installed Chrome to capture each act of /cinema at a real scroll
 * position, so the staged layout can be reviewed frame by frame.
 *
 *   npm install --no-save puppeteer-core
 *   node scripts/shoot-cinema.mjs [width] [height]
 *
 * Requires `next dev` to be running on port 3000.
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const width = Number(process.argv[2] ?? 1440);
const height = Number(process.argv[3] ?? 900);
const out = `/tmp/cinema-${width}`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--hide-scrollbars",
    // Headless backgrounds the renderer, which stalls the rAF-driven timeline.
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
  ],
});

const page = await browser.newPage();
// A backgrounded tab gets almost no animation frames, which stalls the timeline.
await page.bringToFront();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
// Headless barely issues animation frames, so the reduced-motion path is used
// to settle every act into its resting state for a layout review.
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto("http://127.0.0.1:3000/cinema", { waitUntil: "networkidle0" });

await mkdir(out, { recursive: true });

// Let the cold open finish before anything is captured.
await new Promise((resolve) => setTimeout(resolve, 1200));
await page.screenshot({ path: `${out}/00-hero.png` });

const targets = await page.evaluate(() =>
  Array.from(document.querySelectorAll("main > section, .cin-sting")).map((el, i) => ({
    id: el.id || el.className.split(" ")[0].replace("cin-", ""),
    index: i,
    top: el.getBoundingClientRect().top + window.scrollY,
  }))
);

for (const target of targets.slice(1)) {
  await page.evaluate((top) => {
    window.lenisInstance?.scrollTo?.(top, { immediate: true });
    window.scrollTo({ top, behavior: "instant" });
  }, target.top);
  // Scroll-triggered reveals need a beat to play out.
  await new Promise((resolve) => setTimeout(resolve, 700));
  const name = String(target.index).padStart(2, "0");
  await page.screenshot({ path: `${out}/${name}-${target.id}.png` });
}

await browser.close();
console.log(`captured ${targets.length} frames to ${out}`);
