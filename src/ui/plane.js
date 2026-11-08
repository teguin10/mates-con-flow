// Plano cartesiano en SVG para el bloque de funciones: ejes con cuadrícula,
// puntos con etiqueta, una recta y = ax + b y gráficas por puntos.
// view: { kind: 'plane', min, max, points, line, poly, xLabel, yLabel, yMax }.

import { s } from './dom.js';

const SIZE = 220;
const PAD = 18;

export function planeSvg(view) {
  const min = view.min ?? -6;
  const max = view.max ?? 6;
  const yMin = view.yMin ?? min;
  const yMax = view.yMax ?? max;
  const span = SIZE - PAD * 2;
  const sx = (x) => PAD + ((x - min) / (max - min)) * span;
  const sy = (y) => SIZE - PAD - ((y - yMin) / (yMax - yMin)) * span;
  const kids = [];
  // Paso «redondo» para la cuadrícula: 1, 2, 5, 10, 20 o 50.
  const nice = (spanV) => [1, 2, 5, 10, 20, 50].find((st) => spanV / st <= 12) ?? 100;
  const stepX = nice(max - min);
  const stepY = nice(yMax - yMin);
  for (let x = Math.ceil(min); x <= max; x += stepX) kids.push(s('line', { x1: sx(x), y1: sy(yMin), x2: sx(x), y2: sy(yMax), class: 'pl-grid' }));
  for (let y = Math.ceil(yMin); y <= yMax; y += stepY) kids.push(s('line', { x1: sx(min), y1: sy(y), x2: sx(max), y2: sy(y), class: 'pl-grid' }));
  const x0 = Math.min(Math.max(0, min), max);
  const y0 = Math.min(Math.max(0, yMin), yMax);
  kids.push(s('line', { x1: sx(min), y1: sy(y0), x2: sx(max), y2: sy(y0), class: 'pl-axis' }));
  kids.push(s('line', { x1: sx(x0), y1: sy(yMin), x2: sx(x0), y2: sy(yMax), class: 'pl-axis' }));
  for (let x = Math.ceil(min); x <= max; x += stepX) if (x !== 0) kids.push(s('text', { x: sx(x), y: sy(y0) + 13, class: 'pl-num', 'text-anchor': 'middle' }, String(x).replace('-', '−')));
  for (let y = Math.ceil(yMin); y <= yMax; y += stepY) if (y !== 0) kids.push(s('text', { x: sx(x0) - 5, y: sy(y) + 4, class: 'pl-num', 'text-anchor': 'end' }, String(y).replace('-', '−')));
  if (view.xLabel) kids.push(s('text', { x: sx(max), y: sy(y0) - 6, class: 'pl-axis-label', 'text-anchor': 'end' }, view.xLabel));
  if (view.yLabel) kids.push(s('text', { x: sx(x0) + 6, y: sy(yMax) + 10, class: 'pl-axis-label' }, view.yLabel));
  if (view.line) {
    const { a, b } = view.line;
    const f = (x) => a * x + b;
    kids.push(s('line', { x1: sx(min), y1: sy(f(min)), x2: sx(max), y2: sy(f(max)), class: 'pl-line' }));
  }
  if (view.poly) {
    kids.push(s('polyline', { points: view.poly.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' '), class: 'pl-line' }));
  }
  for (const p of view.points ?? []) {
    kids.push(s('circle', { cx: sx(p.x), cy: sy(p.y), r: 5, class: `pl-point ${p.focus ? 'is-focus' : ''}` }));
    if (p.label) kids.push(s('text', { x: sx(p.x) + 7, y: sy(p.y) - 7, class: 'pl-label' }, p.label));
  }
  // Recorte para que la recta no se salga del cuadro.
  const clipId = `pl-clip-${Math.random().toString(36).slice(2, 8)}`;
  return s('svg', { viewBox: `0 0 ${SIZE} ${SIZE}`, class: 'plane-svg', role: 'img', 'aria-label': view.alt ?? 'plano cartesiano' },
    s('defs', {}, s('clipPath', { id: clipId }, s('rect', { x: PAD, y: PAD, width: span, height: span }))),
    s('g', { 'clip-path': `url(#${clipId})` }, ...kids.filter((k) => k.getAttribute('class') === 'pl-line')),
    ...kids.filter((k) => k.getAttribute('class') !== 'pl-line'));
}
