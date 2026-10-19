import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

function createIco(images) {
  const numImages = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(numImages, 4); // count

  let offset = 6 + 16 * numImages;
  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // offset of image data
    entries.push(entry);
    offset += img.buffer.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.buffer)]);
}

async function run() {
  const srcPath = 'public/images/fav2.png';
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Source file not found at ${srcPath}`);
  }

  const meta = await sharp(srcPath).metadata();
  console.log(`Source image: ${srcPath} (${meta.width}x${meta.height}, channels: ${meta.channels}, alpha: ${meta.hasAlpha})`);

  // Trim transparent boundary to ensure true geometric center
  const trimmedBuffer = await sharp(srcPath).trim().toBuffer();
  const trimmedMeta = await sharp(trimmedBuffer).metadata();
  console.log(`Trimmed bounding box: ${trimmedMeta.width}x${trimmedMeta.height}`);

  // Helper to create square icon with ~8% padding
  async function makeIcon(size, bg) {
    const markSize = Math.round(size * (1 - 2 * 0.08));
    const pad = Math.round((size - markSize) / 2);
    const resizedMark = await sharp(trimmedBuffer)
      .resize(markSize, markSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: 'lanczos3',
      })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bg,
      },
    })
      .composite([{ input: resizedMark, left: pad, top: pad }])
      .png()
      .toBuffer();
  }

  // 1. src/app/icon.png (512x512, transparent background)
  const icon512 = await makeIcon(512, { r: 0, g: 0, b: 0, alpha: 0 });
  fs.writeFileSync('src/app/icon.png', icon512);
  console.log('Generated src/app/icon.png (512x512, transparent)');

  // 2. src/app/apple-icon.png (180x180, white #FFFFFF background)
  const apple180 = await makeIcon(180, { r: 255, g: 255, b: 255, alpha: 1 });
  fs.writeFileSync('src/app/apple-icon.png', apple180);
  console.log('Generated src/app/apple-icon.png (180x180, solid white background)');

  // 3. src/app/favicon.ico (multi-size: 48, 32, 16)
  const icoSizes = [48, 32, 16];
  const icoImages = [];
  for (const s of icoSizes) {
    const buf = await makeIcon(s, { r: 0, g: 0, b: 0, alpha: 0 });
    icoImages.push({ width: s, height: s, buffer: buf });
  }
  const icoBuffer = createIco(icoImages);
  fs.writeFileSync('src/app/favicon.ico', icoBuffer);
  console.log(`Generated src/app/favicon.ico (sizes: ${icoSizes.join(', ')})`);

  // 4. scripts/favicon-preview.png (16, 32, 64 on white and dark background)
  const previewSizes = [16, 32, 64];
  const pImagesWhite = [];
  const pImagesDark = [];
  for (const s of previewSizes) {
    const wBuf = await makeIcon(s, { r: 255, g: 255, b: 255, alpha: 1 });
    const dBuf = await makeIcon(s, { r: 27, g: 27, b: 31, alpha: 1 });
    pImagesWhite.push({ s, buf: wBuf });
    pImagesDark.push({ s, buf: dBuf });
  }

  const stripW = 460;
  const stripH = 240;
  const svgOverlay = Buffer.from(`
    <svg width="${stripW}" height="${stripH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${stripW}" height="120" fill="#FFFFFF"/>
      <rect y="120" width="${stripW}" height="120" fill="#1B1B1F"/>
      <text x="24" y="32" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#1B1B1F">Light Theme Tab Preview (16px, 32px, 64px)</text>
      <text x="24" y="152" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#FAF7F0">Dark Theme Tab Preview (16px, 32px, 64px)</text>
    </svg>
  `);

  const comps = [
    { input: svgOverlay, left: 0, top: 0 },
    // light row
    { input: pImagesWhite[0].buf, left: 60, top: 56 },
    { input: pImagesWhite[1].buf, left: 160, top: 48 },
    { input: pImagesWhite[2].buf, left: 280, top: 32 },
    // dark row
    { input: pImagesDark[0].buf, left: 60, top: 176 },
    { input: pImagesDark[1].buf, left: 160, top: 168 },
    { input: pImagesDark[2].buf, left: 280, top: 152 },
  ];

  const previewStrip = await sharp({
    create: { width: stripW, height: stripH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite(comps)
    .png()
    .toBuffer();

  fs.writeFileSync('scripts/favicon-preview.png', previewStrip);
  console.log('Generated scripts/favicon-preview.png');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
