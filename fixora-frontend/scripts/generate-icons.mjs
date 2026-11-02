/**
 * Generates Fixora PWA icons (PNG) with no external dependencies.
 * Lime field, ink "F" mark — matches design.md brand tokens.
 * Run: node scripts/generate-icons.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public");

const PRIMARY = [0x9f, 0xe8, 0x70, 255];
const INK = [0x0e, 0x0f, 0x0c, 255];

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(size, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function fillRect(px, size, x0, y0, x1, y1, color) {
  const xs = Math.max(0, Math.round(x0 * size));
  const ys = Math.max(0, Math.round(y0 * size));
  const xe = Math.min(size, Math.round(x1 * size));
  const ye = Math.min(size, Math.round(y1 * size));
  for (let y = ys; y < ye; y++) {
    for (let x = xs; x < xe; x++) {
      const i = (y * size + x) * 4;
      px[i] = color[0];
      px[i + 1] = color[1];
      px[i + 2] = color[2];
      px[i + 3] = color[3];
    }
  }
}

function renderIcon(size, { padding = 0.26, glyphScale = 1 }) {
  const px = Buffer.alloc(size * size * 4);
  fillRect(px, size, 0, 0, 1, 1, PRIMARY);
  // "F" mark centred within the padding box
  const box = 1 - padding * 2;
  const ox = padding;
  const oy = padding;
  const g = box * glyphScale;
  const cx = (1 - g) / 2;
  const cy = (1 - g) / 2;
  const x0 = cx;
  const y0 = cy;
  const stemW = g * 0.24;
  const armH = g * 0.24;
  fillRect(px, size, x0, y0, x0 + stemW, y0 + g, INK); // stem
  fillRect(px, size, x0, y0, x0 + g, y0 + armH, INK); // top arm
  fillRect(px, size, x0, y0 + g * 0.4, x0 + g * 0.78, y0 + g * 0.4 + armH * 0.9, INK); // mid arm
  // accent dot — brand period
  const dot = g * 0.16;
  fillRect(px, size, x0 + g * 0.86, y0 + g * 0.84, x0 + g * 0.86 + dot, y0 + g * 0.84 + dot, INK);
  void ox;
  void oy;
  return encodePng(size, px);
}

mkdirSync(outDir, { recursive: true });

const outputs = [
  ["icon-192.png", renderIcon(192, { padding: 0.24 })],
  ["icon-512.png", renderIcon(512, { padding: 0.24 })],
  ["icon-512-maskable.png", renderIcon(512, { padding: 0.34 })],
  ["apple-touch-icon.png", renderIcon(180, { padding: 0.24 })],
];

for (const [name, buf] of outputs) {
  writeFileSync(join(outDir, name), buf);
  console.log(`wrote public/${name} (${buf.length} bytes)`);
}
