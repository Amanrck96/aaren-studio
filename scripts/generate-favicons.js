const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// 1. Read the user uploaded logo
const sourceImagePath = 'C:/Users/amanr/.gemini/antigravity/brain/9fe60087-433b-47e0-bfbb-7a6b63cb9316/.user_uploaded/media_1793718148705_af3b975a.png';
const buf = fs.readFileSync(sourceImagePath);

const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);

let idatBuffers = [];
let offset = 8;
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IDAT') idatBuffers.push(buf.subarray(offset + 8, offset + 8 + len));
  offset += 12 + len;
}
const decompressed = zlib.inflateSync(Buffer.concat(idatBuffers));
const stride = 1 + width * 4;
const raw = Buffer.alloc(width * height * 4);
for (let y = 0; y < height; y++) {
  const filter = decompressed[y * stride];
  const scanline = decompressed.subarray(y * stride + 1, (y + 1) * stride);
  for (let x = 0; x < width * 4; x++) {
    const rawIdx = (y * width * 4) + x;
    const a = (x >= 4) ? raw[rawIdx - 4] : 0, b = (y > 0) ? raw[rawIdx - width * 4] : 0, c = (x >= 4 && y > 0) ? raw[rawIdx - width * 4 - 4] : 0;
    let val = scanline[x];
    if (filter === 1) val = (val + a) & 0xff;
    else if (filter === 2) val = (val + b) & 0xff;
    else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
    else if (filter === 4) {
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      val = (val + ((pa <= pb && pa <= pc) ? a : ((pb <= pc) ? b : c))) & 0xff;
    }
    raw[rawIdx] = val;
  }
}

// Monogram bounds in source: X: [240, 342], Y: [128, 232]
// Total span: 103 width x 105 height. Center: (291, 180)
// To give comfortable breathing room in browser tabs and round icons:
// Crop 128x128 centered at (291, 180) -> X: [227, 355), Y: [116, 244)
const cropSize = 128;
const startX = 227;
const startY = 116;

const masterRgba = Buffer.alloc(cropSize * cropSize * 4);
// Primary brand color
const BRONZE_R = 129; // #81
const BRONZE_G = 102; // #66
const BRONZE_B = 63;  // #3F

for (let cy = 0; cy < cropSize; cy++) {
  for (let cx = 0; cx < cropSize; cx++) {
    const srcX = startX + cx;
    const srcY = startY + cy;
    let r = 255, g = 255, b = 255;
    if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
      const idx = (srcY * width + srcX) * 4;
      r = raw[idx];
      g = raw[idx + 1];
      b = raw[idx + 2];
    }
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const outIdx = (cy * cropSize + cx) * 4;

    if (lum >= 250) {
      // Pure transparent
      masterRgba[outIdx] = 0;
      masterRgba[outIdx + 1] = 0;
      masterRgba[outIdx + 2] = 0;
      masterRgba[outIdx + 3] = 0;
    } else {
      // Smooth alpha ramp preserving original sub-pixel antialiasing
      const alpha = Math.min(255, Math.max(0, Math.round((255 - lum) / (255 - 90) * 255)));
      masterRgba[outIdx] = BRONZE_R;
      masterRgba[outIdx + 1] = BRONZE_G;
      masterRgba[outIdx + 2] = BRONZE_B;
      masterRgba[outIdx + 3] = alpha;
    }
  }
}

// Also create a version with a subtle circular / squircle badge or crisp white backdrop option for high contrast
// For browser tabs, a clean transparent background with the rich bronze icon is standard.

function bilinearResize(srcWidth, srcHeight, srcRgba, dstWidth, dstHeight) {
  const dst = Buffer.alloc(dstWidth * dstHeight * 4);
  const xRatio = (srcWidth - 1) / (dstWidth > 1 ? dstWidth - 1 : 1);
  const yRatio = (srcHeight - 1) / (dstHeight > 1 ? dstHeight - 1 : 1);

  for (let dy = 0; dy < dstHeight; dy++) {
    const sy = dy * yRatio;
    const y0 = Math.floor(sy);
    const y1 = Math.min(srcHeight - 1, y0 + 1);
    const yDiff = sy - y0;

    for (let dx = 0; dx < dstWidth; dx++) {
      const sx = dx * xRatio;
      const x0 = Math.floor(sx);
      const x1 = Math.min(srcWidth - 1, x0 + 1);
      const xDiff = sx - x0;

      const dstIdx = (dy * dstWidth + dx) * 4;

      for (let c = 0; c < 4; c++) {
        const v00 = srcRgba[(y0 * srcWidth + x0) * 4 + c];
        const v10 = srcRgba[(y0 * srcWidth + x1) * 4 + c];
        const v01 = srcRgba[(y1 * srcWidth + x0) * 4 + c];
        const v11 = srcRgba[(y1 * srcWidth + x1) * 4 + c];

        const top = v00 * (1 - xDiff) + v10 * xDiff;
        const bottom = v01 * (1 - xDiff) + v11 * xDiff;
        dst[dstIdx + c] = Math.round(top * (1 - yDiff) + bottom * yDiff);
      }
    }
  }
  return dst;
}

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const toCrc = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(toCrc));
  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 4)] = 0; // Filter 0
    rgbaBuffer.copy(scanlines, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const idat = makeChunk('IDAT', zlib.deflateSync(scanlines));
  const iend = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, makeChunk('IHDR', ihdr), idat, iend]);
}

function buildIco(pngArray) {
  const count = pngArray.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  let offset = 6 + (16 * count);
  const dirEntries = [];
  for (const item of pngArray) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // Colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(item.png.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset
    dirEntries.push(entry);
    offset += item.png.length;
  }
  return Buffer.concat([header, ...dirEntries, ...pngArray.map(x => x.png)]);
}

// Generate resolutions
const png16 = encodePNG(16, 16, bilinearResize(cropSize, cropSize, masterRgba, 16, 16));
const png32 = encodePNG(32, 32, bilinearResize(cropSize, cropSize, masterRgba, 32, 32));
const png48 = encodePNG(48, 48, bilinearResize(cropSize, cropSize, masterRgba, 48, 48));
const png180 = encodePNG(180, 180, bilinearResize(cropSize, cropSize, masterRgba, 180, 180));
const png512 = encodePNG(512, 512, bilinearResize(cropSize, cropSize, masterRgba, 512, 512));

const icoBuffer = buildIco([
  { width: 16, height: 16, png: png16 },
  { width: 32, height: 32, png: png32 },
  { width: 48, height: 48, png: png48 },
]);

// High-resolution SVG representation of the Aaren Monogram
// Exact geometry traced from the architectural logo:
// Apex at (78, 14), Left baseline at (16, 88), Arch at (50, 88)->(78, 54), Loop at (78, 54)->(86, 88)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <g stroke="#81663F" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Outer Triangle Apex & Left Diagonal -->
    <path d="M 16 86 L 76 16 L 76 86" />
    <!-- Horizontal Baseline to Arch -->
    <path d="M 16 86 L 48 86" />
    <!-- Archway Doorway -->
    <path d="M 48 86 L 48 56 Q 48 48, 62 48 Q 76 48, 76 56" />
    <!-- Right loop/handle -->
    <path d="M 76 56 Q 84 56, 84 64 L 84 78 Q 84 86, 76 86" />
  </g>
</svg>`;

// Destination directories
const projectRoot = 'c:/Users/amanr/OneDrive/Documents/aaren studio';
const appDir = path.join(projectRoot, 'src/app');
const publicDir = path.join(projectRoot, 'public');

// Write to src/app/
fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(appDir, 'icon.png'), png512);
fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(appDir, 'apple-icon.png'), png180);

// Write to public/
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(publicDir, 'icon.png'), png512);
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), png180);

console.log('✅ All favicon and icon assets generated successfully in src/app and public!');

