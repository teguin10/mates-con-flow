// Mascotas originales (gato, perro, mono) dibujadas en SVG, con estados de
// ánimo, y las frases con las que acompañan a la alumna.

import { h, s } from './dom.js';

const CREAM = '#f7ead9';
const PINK = '#ff5fa2';
const PINK_SOFT = '#ffb3d1';
const DARK = '#141216';
const GREY = '#8e8794';
const BROWN = '#7a5a4a';
const LINE = { stroke: DARK, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };

export const MASCOT_OPTIONS = [
  { kind: 'gato', label: 'Gato', names: ['Miau', 'Luna', 'Mochi'] },
  { kind: 'perro', label: 'Perro', names: ['Toby', 'Lola', 'Rocky'] },
  { kind: 'mono', label: 'Mono', names: ['Coco', 'Kiko', 'Bimba'] },
];

function eyes(mood, left, right, y) {
  return [left, right].map((x, i) => {
    if (mood === 'happy' || mood === 'party') {
      return s('path', { d: `M${x - 6} ${y + 2} Q${x} ${y - 6} ${x + 6} ${y + 2}`, fill: 'none', ...LINE });
    }
    if (mood === 'oops') {
      const d = i === 0 ? `M${x - 4} ${y - 4} L${x + 3} ${y} L${x - 4} ${y + 4}` : `M${x + 4} ${y - 4} L${x - 3} ${y} L${x + 4} ${y + 4}`;
      return s('path', { d, fill: 'none', ...LINE });
    }
    return s('g', {},
      s('circle', { cx: x, cy: y, r: 5.5, fill: DARK }),
      s('circle', { cx: x + 1.8, cy: y - 1.8, r: 1.8, fill: '#fff' }));
  });
}

function mouth(mood, x, y) {
  if (mood === 'party') return s('path', { d: `M${x - 8} ${y} Q${x} ${y + 13} ${x + 8} ${y} Z`, fill: '#c2185b', ...LINE, 'stroke-width': 2.5 });
  if (mood === 'happy') return s('path', { d: `M${x - 7} ${y} Q${x} ${y + 8} ${x + 7} ${y}`, fill: 'none', ...LINE });
  if (mood === 'oops') return s('circle', { cx: x, cy: y + 2, r: 3, fill: 'none', ...LINE, 'stroke-width': 2.5 });
  return s('path', { d: `M${x - 6} ${y} Q${x - 3} ${y + 4} ${x} ${y} Q${x + 3} ${y + 4} ${x + 6} ${y}`, fill: 'none', ...LINE, 'stroke-width': 2.5 });
}

function cheeks(left, right, y) {
  return [left - 7, right + 7].map((cx) => s('ellipse', { cx, cy: y, rx: 6, ry: 3.5, fill: PINK_SOFT, opacity: 0.8 }));
}

function cat(mood) {
  return [
    s('polygon', { points: '22,52 30,12 56,36', fill: CREAM, ...LINE }),
    s('polygon', { points: '98,52 90,12 64,36', fill: CREAM, ...LINE }),
    s('polygon', { points: '29,43 32,23 47,35', fill: PINK_SOFT }),
    s('polygon', { points: '91,43 88,23 73,35', fill: PINK_SOFT }),
    s('ellipse', { cx: 60, cy: 68, rx: 42, ry: 36, fill: CREAM, ...LINE }),
    ...eyes(mood, 44, 76, 64),
    ...cheeks(44, 76, 76),
    s('polygon', { points: '56,73 64,73 60,78', fill: PINK }),
    mouth(mood, 60, 82),
    s('path', { d: 'M14 70 L32 73 M14 79 L32 78 M106 70 L88 73 M106 79 L88 78', fill: 'none', ...LINE, 'stroke-width': 2 }),
    s('polygon', { points: '76,12 88,20 76,28', fill: PINK, ...LINE, 'stroke-width': 2 }),
    s('polygon', { points: '100,12 88,20 100,28', fill: PINK, ...LINE, 'stroke-width': 2 }),
    s('circle', { cx: 88, cy: 20, r: 4, fill: PINK, ...LINE, 'stroke-width': 2 }),
  ];
}

function dog(mood) {
  const tongue = mood === 'happy' || mood === 'party';
  return [
    s('ellipse', { cx: 24, cy: 60, rx: 12, ry: 25, fill: GREY, ...LINE, transform: 'rotate(18 24 60)' }),
    s('ellipse', { cx: 96, cy: 60, rx: 12, ry: 25, fill: GREY, ...LINE, transform: 'rotate(-18 96 60)' }),
    s('ellipse', { cx: 60, cy: 64, rx: 38, ry: 36, fill: CREAM, ...LINE }),
    s('ellipse', { cx: 76, cy: 61, rx: 12, ry: 11, fill: '#e6d3bd' }),
    s('rect', { x: 24, y: 33, width: 72, height: 9, rx: 4.5, fill: PINK, ...LINE, 'stroke-width': 2 }),
    s('ellipse', { cx: 60, cy: 82, rx: 16, ry: 12, fill: '#fff7ee' }),
    ...eyes(mood, 46, 74, 61),
    ...cheeks(46, 74, 74),
    s('ellipse', { cx: 60, cy: 76, rx: 6, ry: 4.5, fill: DARK }),
    mouth(mood === 'party' ? 'happy' : mood, 60, 84),
    tongue ? s('path', { d: 'M55 88 Q60 99 65 88 Z', fill: PINK, ...LINE, 'stroke-width': 2 }) : null,
  ];
}

function monkey(mood) {
  return [
    s('circle', { cx: 20, cy: 66, r: 14, fill: BROWN, ...LINE }),
    s('circle', { cx: 100, cy: 66, r: 14, fill: BROWN, ...LINE }),
    s('circle', { cx: 20, cy: 66, r: 7, fill: CREAM }),
    s('circle', { cx: 100, cy: 66, r: 7, fill: CREAM }),
    s('circle', { cx: 60, cy: 64, r: 38, fill: BROWN, ...LINE }),
    s('ellipse', { cx: 48, cy: 60, rx: 14, ry: 15, fill: CREAM }),
    s('ellipse', { cx: 72, cy: 60, rx: 14, ry: 15, fill: CREAM }),
    s('ellipse', { cx: 60, cy: 80, rx: 24, ry: 16, fill: CREAM }),
    ...eyes(mood, 48, 72, 60),
    ...cheeks(48, 72, 74),
    s('circle', { cx: 56, cy: 75, r: 1.8, fill: DARK }),
    s('circle', { cx: 64, cy: 75, r: 1.8, fill: DARK }),
    mouth(mood, 60, 84),
    s('path', { d: 'M24 44 Q60 0 96 44 Z', fill: DARK, ...LINE }),
    s('path', { d: 'M60 40 Q98 34 114 46 Q92 52 60 46 Z', fill: PINK, ...LINE, 'stroke-width': 2 }),
    s('circle', { cx: 60, cy: 25, r: 4.5, fill: PINK }),
  ];
}

const DRAW = { gato: cat, perro: dog, mono: monkey };

export function mascotSvg(kind, mood = 'neutral') {
  return s('svg', { viewBox: '0 0 120 120', role: 'img', 'aria-hidden': 'true', class: 'mascot-svg' },
    ...(DRAW[kind] ?? cat)(mood));
}

export function mascotView(mascot, mood = 'neutral', size = 'small') {
  return h('div', { class: `mascot mascot-${size} mood-${mood}` }, mascotSvg(mascot?.kind ?? 'gato', mood));
}

export const MESSAGES = {
  greet: (n) => [`¡Hola, ${n}! ¿Practicamos un rato?`, `¡Ey, ${n}! Hoy lo vas a petar 💅`, `${n}, ¡qué ganas tenía de verte! 💖`, `¿Lista, ${n}? Ponte cómoda y vamos.`],
  start: (n) => [`Tú puedes, ${n} 💪`, 'Lee con calma y responde con el teclado.', 'Si fallas no pasa nada: te ayudo yo.'],
  correct: (n) => ['¡Eso es! 🔥', `¡Qué crack, ${n}!`, '¡Perfecta! 💖', '¡Bien hecho!', '¡Nivelazo! ✨', '¡Toma ya! 🏐'],
  correctLate: (n) => ['¡Lo sacaste! Así se aprende 💪', `¡Bien, ${n}! A la próxima, a la primera.`, '¡Conseguido! 🙌'],
  wrong1: () => ['Casi… mira la pista 👀', 'Tranqui, que esto sale. Te dejo una pista.', 'Uy, por poco. Mira la pista 💡'],
  wrong2: () => ['Vamos a verlo paso a paso, juntas 💪', 'Mira cómo se hace y vuelve a intentarlo.', 'Te lo explico y lo intentas otra vez 🙂'],
  reveal: () => ['No pasa nada, así se aprende. ¡A por la siguiente!', 'Esta era difícil. La próxima sale 💖'],
  invalid: () => ['Escribe un número con el teclado 😉'],
  levelUp: (n) => [`¡Subes de nivel, ${n}! 🎉`],
  levelDown: () => ['Bajamos un poquito para coger carrerilla 💪'],
  mastered: (n) => [`👑 ¡${n}, lo dominas! Eres una máquina.`],
};
