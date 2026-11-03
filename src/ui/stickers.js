// Dibujos originales de las pegatinas en SVG, con borde blanco «troquelado».

import { s } from './dom.js';

const INK = '#141216';
const CREAM = '#f7ead9';
const PINK = '#ff5fa2';
const PINK_SOFT = '#ffb3d1';
const YELLOW = '#ffd27a';
const LINE = { stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };

const face = (x, y, gap = 12) => [
  s('circle', { cx: x - gap / 2, cy: y, r: 3, fill: INK }),
  s('circle', { cx: x + gap / 2, cy: y, r: 3, fill: INK }),
  s('path', { d: `M${x - 4} ${y + 6} Q${x} ${y + 10} ${x + 4} ${y + 6}`, fill: 'none', ...LINE, 'stroke-width': 2 }),
  s('ellipse', { cx: x - gap / 2 - 5, cy: y + 6, rx: 4, ry: 2.5, fill: PINK_SOFT }),
  s('ellipse', { cx: x + gap / 2 + 5, cy: y + 6, rx: 4, ry: 2.5, fill: PINK_SOFT }),
];

const ART = {
  estrella: () => [
    s('polygon', { points: '50,12 61,38 89,40 67,58 74,86 50,71 26,86 33,58 11,40 39,38', fill: YELLOW, ...LINE }),
    ...face(50, 50),
  ],
  llama: () => [
    s('path', { d: 'M50 10 C66 30 80 42 76 64 C73 82 60 90 50 90 C38 90 24 82 24 64 C24 50 34 44 38 32 C42 42 46 44 48 46 C50 34 48 22 50 10 Z', fill: '#ff8a5b', ...LINE }),
    s('path', { d: 'M50 50 C58 58 62 66 60 74 C58 82 54 84 50 84 C44 84 40 80 40 72 C40 64 46 60 50 50 Z', fill: YELLOW }),
    ...face(50, 66, 10),
  ],
  voley: () => [
    s('circle', { cx: 50, cy: 50, r: 36, fill: CREAM, ...LINE }),
    s('path', { d: 'M50 14 C40 34 40 56 54 86 M18 38 C38 44 60 40 82 28 M24 72 C40 60 62 60 84 66', fill: 'none', stroke: '#5b8def', 'stroke-width': 4, 'stroke-linecap': 'round' }),
    s('circle', { cx: 50, cy: 50, r: 36, fill: 'none', ...LINE }),
  ],
  guante: () => [
    s('rect', { x: 24, y: 16, width: 50, height: 52, rx: 24, fill: PINK, ...LINE }),
    s('ellipse', { cx: 26, cy: 48, rx: 10, ry: 14, fill: PINK, ...LINE }),
    s('rect', { x: 30, y: 66, width: 40, height: 20, rx: 6, fill: CREAM, ...LINE }),
    s('path', { d: 'M36 72 L64 72', fill: 'none', ...LINE, 'stroke-width': 2 }),
    ...face(52, 40),
  ],
  micro: () => [
    s('rect', { x: 44, y: 50, width: 12, height: 36, rx: 5, fill: INK, ...LINE }),
    s('rect', { x: 38, y: 48, width: 24, height: 8, rx: 3, fill: PINK, ...LINE }),
    s('circle', { cx: 50, cy: 32, r: 20, fill: '#b8b2bf', ...LINE }),
    s('path', { d: 'M36 26 L64 26 M34 34 L66 34 M38 42 L62 42 M44 14 L44 50 M56 14 L56 50', fill: 'none', stroke: '#6d6773', 'stroke-width': 2 }),
    s('circle', { cx: 50, cy: 32, r: 20, fill: 'none', ...LINE }),
  ],
  cascos: () => [
    s('path', { d: 'M20 58 C20 30 34 16 50 16 C66 16 80 30 80 58', fill: 'none', ...LINE, 'stroke-width': 8 }),
    s('path', { d: 'M20 58 C20 30 34 16 50 16 C66 16 80 30 80 58', fill: 'none', stroke: PINK, 'stroke-width': 4 }),
    s('rect', { x: 12, y: 50, width: 20, height: 32, rx: 9, fill: PINK, ...LINE }),
    s('rect', { x: 68, y: 50, width: 20, height: 32, rx: 9, fill: PINK, ...LINE }),
    s('path', { d: 'M40 66 L44 60 L48 70 L52 56 L56 68 L60 62', fill: 'none', stroke: CREAM, 'stroke-width': 3, 'stroke-linecap': 'round' }),
  ],
  corona: () => [
    s('polygon', { points: '16,74 20,30 36,50 50,22 64,50 80,30 84,74', fill: YELLOW, ...LINE }),
    s('rect', { x: 16, y: 72, width: 68, height: 12, rx: 4, fill: YELLOW, ...LINE }),
    s('circle', { cx: 50, cy: 60, r: 6, fill: PINK, ...LINE, 'stroke-width': 2 }),
    s('circle', { cx: 32, cy: 64, r: 4, fill: PINK_SOFT }),
    s('circle', { cx: 68, cy: 64, r: 4, fill: PINK_SOFT }),
  ],
  diamante: () => [
    s('polygon', { points: '28,18 72,18 88,40 50,88 12,40', fill: '#9fe3f0', ...LINE }),
    s('path', { d: 'M12 40 L88 40 M28 18 L38 40 L50 88 L62 40 L72 18 M38 40 L50 18 L62 40', fill: 'none', stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' }),
    s('polygon', { points: '38,40 62,40 50,88', fill: PINK_SOFT, opacity: 0.7 }),
  ],
  crepe: () => [
    s('path', { d: 'M14 70 Q50 6 86 70 Z', fill: '#f2c98a', ...LINE }),
    s('path', { d: 'M24 62 Q50 40 76 62', fill: 'none', stroke: '#6b3e26', 'stroke-width': 4, 'stroke-linecap': 'round' }),
    s('circle', { cx: 40, cy: 50, r: 7, fill: '#ff4d6d', ...LINE, 'stroke-width': 2 }),
    s('circle', { cx: 60, cy: 50, r: 7, fill: '#ff4d6d', ...LINE, 'stroke-width': 2 }),
    s('path', { d: 'M40 43 L42 39 M60 43 L62 39', fill: 'none', stroke: '#3fa34d', 'stroke-width': 3, 'stroke-linecap': 'round' }),
  ],
  // Crepe redondo en 4 porciones, 3 con chocolate: 3/4.
  'crepe-porciones': () => [
    s('circle', { cx: 50, cy: 50, r: 36, fill: '#f2c98a', ...LINE }),
    s('path', { d: 'M50 50 L50 14 A36 36 0 1 1 14 50 Z', fill: '#8a4b2a', opacity: 0.9 }),
    s('path', { d: 'M50 14 L50 86 M14 50 L86 50', fill: 'none', ...LINE, 'stroke-width': 2.5 }),
    s('circle', { cx: 50, cy: 50, r: 36, fill: 'none', ...LINE }),
    s('circle', { cx: 32, cy: 30, r: 5, fill: '#ff4d6d', ...LINE, 'stroke-width': 2 }),
    s('text', { x: 70, y: 36, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: PINK }, '¾'),
  ],
  tortitas: () => [
    s('ellipse', { cx: 50, cy: 76, rx: 34, ry: 9, fill: '#d99a5b', ...LINE }),
    s('ellipse', { cx: 50, cy: 62, rx: 32, ry: 9, fill: '#e8b06f', ...LINE }),
    s('ellipse', { cx: 50, cy: 48, rx: 30, ry: 9, fill: '#f2c98a', ...LINE }),
    s('path', { d: 'M26 46 Q32 58 36 50 Q42 62 48 50 Q56 60 62 50 Q68 56 74 46', fill: '#8a4b2a', opacity: 0.85 }),
    s('rect', { x: 42, y: 32, width: 16, height: 10, rx: 2, fill: YELLOW, ...LINE, 'stroke-width': 2 }),
  ],
  zombi: () => [
    s('circle', { cx: 50, cy: 52, r: 32, fill: '#9fcf9a', ...LINE }),
    s('path', { d: 'M34 38 L42 46 M42 38 L34 46', fill: 'none', ...LINE }),
    s('circle', { cx: 62, cy: 42, r: 5, fill: INK }),
    s('path', { d: 'M40 64 Q50 70 60 64', fill: 'none', ...LINE, 'stroke-width': 2 }),
    s('path', { d: 'M26 30 L34 34 M30 26 L30 36', fill: 'none', stroke: INK, 'stroke-width': 2 }),
    s('path', { d: 'M62 18 L70 12 L66 22 Z', fill: PINK, ...LINE, 'stroke-width': 2 }),
    s('ellipse', { cx: 32, cy: 58, rx: 5, ry: 3, fill: PINK_SOFT }),
    s('ellipse', { cx: 68, cy: 58, rx: 5, ry: 3, fill: PINK_SOFT }),
  ],
  gata: () => [
    s('polygon', { points: '22,40 28,12 46,30', fill: CREAM, ...LINE }),
    s('polygon', { points: '78,40 72,12 54,30', fill: CREAM, ...LINE }),
    s('ellipse', { cx: 50, cy: 54, rx: 34, ry: 30, fill: CREAM, ...LINE }),
    s('path', { d: 'M26 46 L74 46', fill: 'none', ...LINE, 'stroke-width': 3 }),
    s('rect', { x: 28, y: 44, width: 18, height: 12, rx: 5, fill: INK }),
    s('rect', { x: 54, y: 44, width: 18, height: 12, rx: 5, fill: INK }),
    s('polygon', { points: '47,62 53,62 50,66', fill: PINK }),
    s('path', { d: 'M44 70 Q50 74 56 70', fill: 'none', ...LINE, 'stroke-width': 2 }),
  ],
};

export function stickerSvg(art, { locked = false } = {}) {
  const draw = ART[art] ?? ART.estrella;
  return s('svg', { viewBox: '0 0 100 100', class: `sticker-svg ${locked ? 'is-locked' : ''}`, 'aria-hidden': 'true' },
    s('g', { class: 'sticker-cut' }, ...draw()),
    s('g', {}, ...draw()));
}
