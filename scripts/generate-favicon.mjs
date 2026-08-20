#!/usr/bin/env node
/**
 * Generate multi-size .ico and apple-touch-icon for BRB Enterprise.
 * Uses sharp for proper SVG → PNG → ICO conversion.
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

// Simplified SVG without gradients (sharp/librsvg handles these poorly)
// We use flat colors that match the brand exactly.
const SVG_192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <rect width="192" height="192" rx="42" fill="#1B1F2A"/>
  <path d="M28 144 Q96 36 164 144" stroke="#F9FAFB" stroke-width="10" fill="none" stroke-linecap="round"/>
  <line x1="48" y1="144" x2="48" y2="100" stroke="#F9FAFB" stroke-width="7" stroke-linecap="round"/>
  <line x1="144" y1="144" x2="144" y2="100" stroke="#F9FAFB" stroke-width="7" stroke-linecap="round"/>
  <path d="M28 144 Q96 68 164 144" stroke="#F5A623" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="10 14"/>
</svg>`;

const SVG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#1B1F2A"/>
  <path d="M10 48 Q32 14 54 48" stroke="#F9FAFB" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <line x1="16" y1="48" x2="16" y2="34" stroke="#F9FAFB" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="48" y1="48" x2="48" y2="34" stroke="#F9FAFB" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M10 48 Q32 24 54 48" stroke="#F5A623" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="4 5"/>
</svg>`;

function createICOFromPNG(pngBuffers, sizes) {
  const numImages = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(numImages, 4);

  let dataOffset = 6 + numImages * 16;
  const entries = [];

  for (let i = 0; i < numImages; i++) {
    const entry = Buffer.alloc(16);
    const size = sizes[i];
    const pngData = pngBuffers[i];

    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(pngData.length, 8);
    entry.writeUInt32LE(dataOffset, 12);

    entries.push({ entry, pngData });
    dataOffset += pngData.length;
  }

  return Buffer.concat([
    header,
    ...entries.map((e) => e.entry),
    ...entries.map((e) => e.pngData),
  ]);
}

async function generate() {
  const sizes = [16, 32, 48, 64];
  const pngBuffers = [];

  for (const size of sizes) {
    const svg = size >= 48 ? SVG_192 : SVG_ICON;
    const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
    console.log(`  ${size}×${size}: ${buf.length} bytes`);
    pngBuffers.push(buf);
  }

  // ICO (16, 32, 48)
  const ico = createICOFromPNG(pngBuffers.slice(0, 3), [16, 32, 48]);
  writeFileSync(join(PUBLIC_DIR, "favicon.ico"), ico);
  console.log(`✓ favicon.ico: ${ico.length} bytes`);

  // 192×192 apple-touch-icon PNG
  const touch192 = await sharp(Buffer.from(SVG_192)).resize(192, 192).png().toBuffer();
  writeFileSync(join(PUBLIC_DIR, "apple-touch-icon.png"), touch192);
  console.log(`✓ apple-touch-icon.png: ${touch192.length} bytes`);

  // 512×512 for PWA / manifest
  const icon512 = await sharp(Buffer.from(SVG_192)).resize(512, 512).png().toBuffer();
  writeFileSync(join(PUBLIC_DIR, "icon-512.png"), icon512);
  console.log(`✓ icon-512.png: ${icon512.length} bytes`);

  // 180×180 for og:image fallback
  const ogIcon = await sharp(Buffer.from(SVG_192)).resize(180, 180).png().toBuffer();
  writeFileSync(join(PUBLIC_DIR, "icon-180.png"), ogIcon);
  console.log(`✓ icon-180.png: ${ogIcon.length} bytes`);
}

generate().catch(console.error);
