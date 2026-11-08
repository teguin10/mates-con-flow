// Figuras geométricas en SVG para los vídeos y las ilustraciones de
// geometría: rectángulo, cuadrado, triángulo, rombo, trapecio, círculo,
// triángulo rectángulo, ángulo, polígono regular y cuerpos.
// view: { kind: 'shape', shape, labels: { … }, angle?, sides? }.

import { s } from './dom.js';

const W = 200;
const H = 140;
const label = (x, y, text, cls = 'sh-label') => (text === undefined || text === null ? null : s('text', { x, y, class: cls, 'text-anchor': 'middle' }, String(text)));
const dashed = (x1, y1, x2, y2) => s('line', { x1, y1, x2, y2, class: 'sh-dash' });
const poly = (points, cls = 'sh-fill') => s('polygon', { points: points.map((p) => p.join(',')).join(' '), class: cls });

const SHAPES = {
  rect: ({ base, height }) => [s('rect', { x: 30, y: 25, width: 140, height: 85, class: 'sh-fill' }), label(100, 128, base), label(16, 72, height)],
  square: ({ side }) => [s('rect', { x: 57, y: 22, width: 86, height: 86, class: 'sh-fill' }), label(100, 128, side), label(42, 70, side)],
  triangle: ({ base, height }) => [poly([[20, 115], [180, 115], [80, 22]]), dashed(80, 22, 80, 115), label(100, 133, base), label(92, 75, height, 'sh-label sh-left')],
  rhombus: ({ D, d }) => [poly([[100, 12], [176, 68], [100, 124], [24, 68]]), dashed(24, 68, 176, 68), dashed(100, 12, 100, 124), label(140, 62, D), label(112, 100, d, 'sh-label sh-left')],
  trapezoid: ({ B, b, height }) => [poly([[20, 115], [180, 115], [140, 28], [60, 28]]), dashed(60, 28, 60, 115), label(100, 133, B), label(100, 20, b), label(72, 76, height, 'sh-label sh-left')],
  circle: ({ r, d }) => [s('circle', { cx: 100, cy: 70, r: 55, class: 'sh-fill' }), s('circle', { cx: 100, cy: 70, r: 3, class: 'sh-dot' }),
    d ? dashed(45, 70, 155, 70) : s('line', { x1: 100, y1: 70, x2: 155, y2: 70, class: 'sh-dash' }), label(d ? 100 : 128, 62, d ?? r)],
  right: ({ a, b, c }) => [poly([[40, 118], [170, 118], [40, 24]]), s('rect', { x: 40, y: 106, width: 12, height: 12, class: 'sh-mark' }),
    label(26, 74, a), label(105, 135, b), label(116, 64, c, 'sh-label sh-hyp')],
  angle: ({ value }, view) => {
    const deg = Math.max(5, Math.min(view.angle ?? 60, 180));
    const rad = (deg * Math.PI) / 180;
    const x = 40 + 130 * Math.cos(rad);
    const y = 110 - 130 * Math.sin(rad);
    const ax = 40 + 30 * Math.cos(rad);
    const ay = 110 - 30 * Math.sin(rad);
    return [
      s('line', { x1: 40, y1: 110, x2: 175, y2: 110, class: 'sh-ray' }),
      s('line', { x1: 40, y1: 110, x2: x, y2: Math.max(8, y), class: 'sh-ray' }),
      deg === 90 ? s('rect', { x: 40, y: 92, width: 18, height: 18, class: 'sh-mark' })
        : s('path', { d: `M70 110 A30 30 0 ${deg > 180 ? 1 : 0} 0 ${ax} ${ay}`, class: 'sh-arc' }),
      label(88, 98, value),
    ];
  },
  polygon: ({ side, apothem }, view) => {
    const n = view.sides ?? 6;
    const pts = Array.from({ length: n }, (_, i) => {
      const t = (Math.PI * 2 * i) / n - Math.PI / 2 + Math.PI / n;
      return [100 + 58 * Math.cos(t), 72 + 58 * Math.sin(t)];
    });
    const [p0, p1] = [pts[0], pts[1]];
    const mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    return [poly(pts), apothem ? dashed(100, 72, mid[0], mid[1]) : null, label(mid[0], mid[1] + 16, side), label((100 + mid[0]) / 2 - 10, (72 + mid[1]) / 2, apothem)];
  },
  cube: () => [poly([[50, 50], [130, 50], [130, 125], [50, 125]]), poly([[50, 50], [80, 25], [160, 25], [130, 50]], 'sh-fill sh-top'), poly([[130, 50], [160, 25], [160, 100], [130, 125]], 'sh-fill sh-side')],
  prism: () => [poly([[40, 60], [140, 60], [140, 125], [40, 125]]), poly([[40, 60], [70, 30], [170, 30], [140, 60]], 'sh-fill sh-top'), poly([[140, 60], [170, 30], [170, 95], [140, 125]], 'sh-fill sh-side')],
  pyramid: () => [poly([[30, 120], [130, 120], [100, 20]]), poly([[130, 120], [170, 100], [100, 20]], 'sh-fill sh-side')],
  cylinder: () => [s('rect', { x: 55, y: 30, width: 90, height: 85, class: 'sh-fill' }), s('ellipse', { cx: 100, cy: 30, rx: 45, ry: 12, class: 'sh-fill sh-top' }), s('ellipse', { cx: 100, cy: 115, rx: 45, ry: 12, class: 'sh-fill' })],
  cone: () => [poly([[55, 115], [145, 115], [100, 18]]), s('ellipse', { cx: 100, cy: 115, rx: 45, ry: 12, class: 'sh-fill sh-top' })],
  sphere: () => [s('circle', { cx: 100, cy: 70, r: 55, class: 'sh-fill' }), s('ellipse', { cx: 100, cy: 70, rx: 55, ry: 14, class: 'sh-equator' })],
};

export function shapeSvg(view) {
  const draw = SHAPES[view.shape] ?? SHAPES.rect;
  return s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'shape-svg', role: 'img', 'aria-label': view.alt ?? view.shape }, ...draw(view.labels ?? {}, view));
}
