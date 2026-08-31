// Builds the "full" KPDS lockup (icon + KPDS on top, "Khatu Pixel Digital
// Studio" wordmark below) as one clean transparent PNG, matching the
// layout in the client-supplied circular badge
// (scripts/logo-sources/logo-badge-circular.png) — but that badge's
// content sits too close to its own drop-shadow to crop cleanly (verified:
// even a zero-margin crop picks up shadow gray at the edges). So instead
// this composites from two shadow-free sources:
//   - public/logo/kpds-mark.png (icon + "KPDS", already bg-removed — see
//     logo-remove-bg.mjs)
//   - scripts/logo-sources/logo-wordmark-only.png ("Khatu Pixel Digital
//     Studio" wordmark, flat white background, no shadow — bg-removed
//     here with the same unpremultiply technique as logo-remove-bg.mjs)
// Run from the repo root: node scripts/build-full-logo.mjs
import sharp from "sharp";

async function removeWhiteBg(inputPath) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const minC = Math.min(r, g, b);
    const alpha = 255 - minC;
    let nr = r, ng = g, nb = b;
    if (alpha > 0) {
      const a = alpha / 255;
      nr = Math.max(0, Math.min(255, Math.round((r - (255 - alpha)) / a)));
      ng = Math.max(0, Math.min(255, Math.round((g - (255 - alpha)) / a)));
      nb = Math.max(0, Math.min(255, Math.round((b - (255 - alpha)) / a)));
    }
    out[i * 4] = nr; out[i * 4 + 1] = ng; out[i * 4 + 2] = nb; out[i * 4 + 3] = alpha;
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).trim().png().toBuffer();
}

const icon = await sharp("public/logo/kpds-mark.png").png().toBuffer();
const iconMeta = await sharp(icon).metadata();

const wordmark = await removeWhiteBg("scripts/logo-sources/logo-wordmark-only.png");
const wordmarkMeta = await sharp(wordmark).metadata();

// Scale the wordmark so its width matches the icon lockup's width (same
// proportion as the reference badge, where the tagline spans roughly the
// same width as the icon+KPDS line above it).
const targetWordmarkWidth = iconMeta.width;
const wordmarkScale = targetWordmarkWidth / wordmarkMeta.width;
const wordmarkResized = await sharp(wordmark)
  .resize({ width: targetWordmarkWidth, height: Math.round(wordmarkMeta.height * wordmarkScale) })
  .png()
  .toBuffer();
const wordmarkResizedMeta = await sharp(wordmarkResized).metadata();

const GAP = Math.round(iconMeta.height * 0.18);
const canvasWidth = iconMeta.width;
const canvasHeight = iconMeta.height + GAP + wordmarkResizedMeta.height;

await sharp({
  create: { width: canvasWidth, height: canvasHeight, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([
    { input: icon, left: 0, top: 0 },
    { input: wordmarkResized, left: 0, top: iconMeta.height + GAP },
  ])
  .png()
  .toFile("public/logo/kpds-full.png");

console.log("wrote public/logo/kpds-full.png", canvasWidth, "x", canvasHeight);
