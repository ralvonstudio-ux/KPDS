// One-off: strip the flat white background baked into the logo PNG and
// replace it with real alpha transparency, un-premultiplying the
// anti-aliased edge pixels against white so they don't carry a pale halo
// when composited over a colored page background.
import sharp from "sharp";

const SRC = "C:/Users/LENOVO/Downloads/3 (6).png";
const OUT = "public/logo/kpds-mark.png";

const img = sharp(SRC);
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const out = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  const r = data[i * channels];
  const g = data[i * channels + 1];
  const b = data[i * channels + 2];
  const minC = Math.min(r, g, b);
  const alpha = 255 - minC; // "how far from white" = ink coverage

  let nr = r, ng = g, nb = b;
  if (alpha > 0) {
    // Un-premultiply: original = alpha*trueColor + (1-alpha)*white
    const a = alpha / 255;
    nr = Math.max(0, Math.min(255, Math.round((r - (255 - alpha)) / a)));
    ng = Math.max(0, Math.min(255, Math.round((g - (255 - alpha)) / a)));
    nb = Math.max(0, Math.min(255, Math.round((b - (255 - alpha)) / a)));
  }

  out[i * 4] = nr;
  out[i * 4 + 1] = ng;
  out[i * 4 + 2] = nb;
  out[i * 4 + 3] = alpha;
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .trim() // crop the now-transparent margin down to the actual mark
  .png()
  .toFile(OUT);

console.log("wrote", OUT);
