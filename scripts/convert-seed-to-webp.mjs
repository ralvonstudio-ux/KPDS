// One-off script: convert public/images/seed/*.jpg to .webp (quality 82,
// same dimensions) for a real file-size win on the self-hosted placeholder
// images, then delete the originals. Run with: node scripts/convert-seed-to-webp.mjs
import { readdirSync, statSync, unlinkSync } from "fs";
import { join, extname, basename } from "path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "images", "seed");
const files = readdirSync(dir).filter((f) => extname(f).toLowerCase() === ".jpg");

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const inPath = join(dir, file);
  const outPath = join(dir, `${basename(file, extname(file))}.webp`);
  const before = statSync(inPath).size;

  await sharp(inPath).webp({ quality: 82 }).toFile(outPath);

  const after = statSync(outPath).size;
  totalBefore += before;
  totalAfter += after;
  console.log(`${file} -> ${basename(outPath)}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);

  unlinkSync(inPath);
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB (${(
    100 -
    (totalAfter / totalBefore) * 100
  ).toFixed(0)}% smaller)`,
);
