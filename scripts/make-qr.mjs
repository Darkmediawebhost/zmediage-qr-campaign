// Builds the campaign QR: print/qr-b.svg → https://zmediage.vercel.app (no path, no text).
//   npm run qr
//   QR_URL=https://zmediage.com npm run qr   → after moving to the real domain
import QRCode from 'qrcode';
import { mkdirSync, writeFileSync } from 'node:fs';

const URL_ = process.env.QR_URL || 'https://zmediage.vercel.app';
const OUT = new URL('../print/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const INK = '#0b0614';
const EYE_OUT = '#1e0a3c';
const EYE_IN = '#6d28d9';
const Z_PATH =
  'M653 771C666 672 723 605 817 605L1393 605C1305 745 1253 859 1180 932C1118 1004 1024 1077 936 1155L1385 1155C1372 1263 1305 1333 1201 1333L723 1333L635 1365C645 1243 702 1139 786 1066L1118 771Z';

/** QR art in a size×size box (quiet zone included). Returns SVG markup for <g>. */
function qrArt(url, size) {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const n = qr.modules.size;
  const quiet = 4;
  const m = size / (n + quiet * 2);
  const at = (i) => (i + quiet) * m;
  const logo = Math.ceil(n * 0.2) | 1; // odd, centred, well under the H-level budget
  const lo = (n - logo) / 2;
  const inFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const inLogo = (r, c) => r >= lo - 0.5 && r < lo + logo + 0.5 && c >= lo - 0.5 && c < lo + logo + 0.5;

  let dots = '';
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.modules.get(r, c) && !inFinder(r, c) && !inLogo(r, c))
        dots += `<rect x="${(at(c) + m * 0.02).toFixed(2)}" y="${(at(r) + m * 0.02).toFixed(2)}" width="${(m * 0.96).toFixed(2)}" height="${(m * 0.96).toFixed(2)}" rx="${(m * 0.22).toFixed(2)}"/>`;

  const eye = (r, c) => {
    const x = at(c), y = at(r);
    return `<rect x="${x + m / 2}" y="${y + m / 2}" width="${m * 6}" height="${m * 6}" rx="${m * 1.8}" fill="none" stroke="${EYE_OUT}" stroke-width="${m}"/>
<rect x="${x + m * 2}" y="${y + m * 2}" width="${m * 3}" height="${m * 3}" rx="${m * 0.9}" fill="${EYE_IN}"/>`;
  };

  const lx = at(lo), ls = logo * m;
  const pad = ls * 0.16;
  return `<rect width="${size}" height="${size}" rx="${m * 2.5}" fill="#fff"/>
<g fill="${INK}">${dots}</g>
${eye(0, 0)}${eye(0, n - 7)}${eye(n - 7, 0)}
<rect x="${lx}" y="${lx}" width="${ls}" height="${ls}" rx="${ls * 0.24}" fill="${INK}"/>
<svg x="${lx + pad}" y="${lx + pad}" width="${ls - pad * 2}" height="${ls - pad * 2}" viewBox="625 595 778 780"><path fill="url(#zg)" d="${Z_PATH}"/></svg>`;
}

const defs = `<defs>
<linearGradient id="zg" x1="635" y1="605" x2="1393" y2="1365" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#C4B5FD"/><stop offset=".45" stop-color="#8B5CF6"/><stop offset="1" stop-color="#5B21B6"/></linearGradient>
</defs>`;

writeFileSync(
  new URL('qr-b.svg', OUT),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">${defs}${qrArt(URL_, 400)}</svg>`,
);
console.log(`print/qr-b.svg  →  ${URL_}`);
