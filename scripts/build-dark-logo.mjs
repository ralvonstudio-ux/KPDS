// Builds dark-mode counterparts of the logo PNGs. The navbar/footer were
// using a blunt `brightness-0 invert` CSS filter to make the logo visible
// on a dark background — but that flattens EVERYTHING to solid white,
// including the red "C" swoosh and orange crown, losing the brand color
// entirely. This instead does a real per-pixel conversion: desaturated
// (grayscale/black) ink becomes white, but any pixel with real color
// saturation (the red/orange accents) keeps its actual hue — only
// brightened a little so it still pops against a dark background.
import sharp from "sharp";

async function toDarkVariant(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info; // channels === 4 (RGBA)

  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const alpha = data[idx + 3];
    if (alpha === 0) continue;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    if (saturation < 0.15) {
      // Desaturated (black/gray line art) -> white, so it reads against a dark page.
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
    } else {
      // Colored accent (red swoosh, orange crown) -> keep its hue, just
      // brighten toward the light end so it still contrasts with a dark
      // background instead of reading as a dim, muddy color.
      const boost = 1.35;
      data[idx] = Math.min(255, Math.round(r * boost));
      data[idx + 1] = Math.min(255, Math.round(g * boost));
      data[idx + 2] = Math.min(255, Math.round(b * boost));
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(outputPath);
  console.log("wrote", outputPath);
}

await toDarkVariant("public/logo/kpds-mark.png", "public/logo/kpds-mark-dark.png");
await toDarkVariant("public/logo/kpds-full.png", "public/logo/kpds-full-dark.png");
