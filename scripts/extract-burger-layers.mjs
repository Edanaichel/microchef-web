import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "public/images/burger/microchef-exploded-burger.png";
const OUT = "public/images/burger/parts";

// The source photo only separates cleanly where the backdrop shows through:
// the cheese drapes over the patty and the sauce sits on the base bun.
const NAMES = ["top-bun", "lettuce", "tomato", "pickles", "patty", "onions", "base"];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const image = sharp(SRC).ensureAlpha();
const { width, height } = await image.metadata();
const { data } = await image.raw().toBuffer({ resolveWithObject: true });

// A row belongs to an ingredient when enough pixels rise above the black backdrop.
// The looser threshold alone catches drips and haze, so require real coverage too.
const SOLID = 70;
const rowIsContent = [];
for (let y = 0; y < height; y += 1) {
  let strong = 0;
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * 4;
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    if (max > SOLID) strong += 1;
  }
  rowIsContent.push(strong > width * 0.08);
}

const bands = [];
let start = -1;
for (let y = 0; y < height; y += 1) {
  if (rowIsContent[y] && start === -1) start = y;
  if ((!rowIsContent[y] || y === height - 1) && start !== -1) {
    bands.push({ top: start, bottom: y });
    start = -1;
  }
}

// Merge bands that are only separated by a sliver (droplets, drips, shadows).
const merged = [];
for (const band of bands) {
  const last = merged[merged.length - 1];
  if (last && band.top - last.bottom < 6) {
    last.bottom = band.bottom;
  } else {
    merged.push({ ...band });
  }
}

const solid = merged.filter((b) => b.bottom - b.top > 40);
if (solid.length !== NAMES.length) {
  console.error(
    `Detected ${solid.length} bands, expected ${NAMES.length}:`,
    solid.map((b) => `${b.top}-${b.bottom}`).join(", "),
  );
  process.exit(1);
}

const manifest = [];

for (const [index, band] of solid.entries()) {
  const name = NAMES[index];
  const gapAbove = index === 0 ? band.top : band.top - solid[index - 1].bottom;
  const gapBelow =
    index === solid.length - 1 ? height - band.bottom : solid[index + 1].top - band.bottom;

  const top = Math.max(0, band.top - Math.min(10, Math.floor(gapAbove / 2)));
  const bottom = Math.min(height, band.bottom + Math.min(10, Math.floor(gapBelow / 2)));
  const bandHeight = bottom - top;

  const { data: raw, info } = await sharp(SRC)
    .extract({ left: 0, top, width, height: bandHeight })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < raw.length; i += 4) {
    const max = Math.max(raw[i], raw[i + 1], raw[i + 2]);
    if (max <= 16) {
      raw[i + 3] = 0;
    } else if (max < 52) {
      raw[i + 3] = Math.round(((max - 16) / 36) * 255);
    }
  }

  const file = path.join(OUT, `${name}.webp`);
  await sharp(raw, { raw: info })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(file);

  manifest.push({
    name,
    file: `/images/burger/parts/${name}.webp`,
    top: top / height,
    height: bandHeight / height,
    center: (top + bandHeight / 2) / height,
  });

  console.log(`${name.padEnd(11)} rows ${top}-${bottom}  (${bandHeight}px)`);
}

fs.writeFileSync(
  "components/burger-parts.json",
  `${JSON.stringify({ width, height, aspect: width / height, parts: manifest }, null, 2)}\n`,
);

// Flatten proof sheet so the reassembled stack can be eyeballed.
const proof = await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: { r: 7, g: 8, b: 6, alpha: 1 },
  },
})
  .composite(
    manifest.map((part) => ({
      input: path.join(OUT, `${part.name}.webp`),
      top: Math.round(part.top * height),
      left: 0,
    })),
  )
  .png()
  .toBuffer();

await sharp(proof).resize({ width: 520 }).png().toFile(path.join(OUT, "_proof.png"));
console.log("wrote components/burger-parts.json");
