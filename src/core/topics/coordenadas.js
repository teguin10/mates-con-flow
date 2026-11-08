// Tema: coordenadas cartesianas. Leer las coordenadas de un punto, el
// cuadrante y dónde está un punto.

import { frame } from '../explain/storyboard.js';
import { BLOCK, coord, generator, LEVEL_NAMES, planeView, shuffle } from './funciones-comun.js';

const TOPIC_ID = 'coordenadas';

export const FORMS = {
  leer: 'Leer las coordenadas de un punto',
  cuadrante: 'En qué cuadrante está',
  'que-punto': 'Qué punto tiene esas coordenadas',
};

const LEVELS = {
  1: { forms: [['leer', 4], ['que-punto', 2]], neg: false },
  2: { forms: [['leer', 3], ['cuadrante', 3], ['que-punto', 2]], neg: true },
  3: { forms: [['leer', 2], ['cuadrante', 2], ['que-punto', 3]], neg: true },
};

const QUADRANT = (x, y) => (x > 0 && y > 0 ? '1.º' : x < 0 && y > 0 ? '2.º' : x < 0 && y < 0 ? '3.º' : '4.º');

function point(rng, neg) {
  let x;
  let y;
  do {
    x = neg ? rng.int(-5, 5) : rng.int(1, 5);
    y = neg ? rng.int(-5, 5) : rng.int(1, 5);
  } while (x === 0 || y === 0);
  return { x, y };
}

function readFrames(p, name = 'P') {
  return [
    frame(`Primero la x: desde el 0 vamos ${Math.abs(p.x)} ${p.x > 0 ? 'a la derecha' : 'a la izquierda'}.`, planeView({ points: [{ ...p, label: name, focus: true }] })),
    frame(`Después la y: ${Math.abs(p.y)} ${p.y > 0 ? 'hacia arriba' : 'hacia abajo'}. El punto es ${coord(p.x, p.y)}.`, planeView({ points: [{ ...p, label: `${name}${coord(p.x, p.y)}`, focus: true }] })),
  ];
}

function buildRead(rng, neg) {
  const p = point(rng, neg);
  const right = coord(p.x, p.y);
  const wrong = [coord(p.y, p.x), coord(-p.x, p.y), coord(p.x, -p.y)].filter((w) => w !== right);
  return {
    id: `leer:${p.x}:${p.y}`,
    form: 'leer',
    answerType: 'choice',
    choices: shuffle(rng, [right, ...shuffle(rng, [...new Set(wrong)]).slice(0, 2)]),
    answer: right,
    expression: 'P = □',
    story: '🗺️ En el mapa del tesoro de tu juego, ¿cuáles son las coordenadas del punto P?',
    illustration: planeView({ points: [{ ...p, label: 'P' }] }),
    hint: 'Primero la x (derecha o izquierda), después la y (arriba o abajo): (x, y).',
    steps: [`x = ${p.x} (${p.x > 0 ? 'derecha' : 'izquierda'}).`, `y = ${p.y} (${p.y > 0 ? 'arriba' : 'abajo'}).`, `P = ${right}.`],
    frames: readFrames(p),
    hintFrames: readFrames(p).slice(0, 1),
  };
}

function buildQuadrant(rng) {
  const p = point(rng, true);
  const answer = QUADRANT(p.x, p.y);
  return {
    id: `cuadrante:${p.x}:${p.y}`,
    form: 'cuadrante',
    answerType: 'choice',
    choices: ['1.º', '2.º', '3.º', '4.º'],
    answer,
    expression: `${coord(p.x, p.y)} → □ cuadrante`,
    story: `🧭 ¿En qué cuadrante está el punto ${coord(p.x, p.y)}?`,
    illustration: planeView({ points: [] }),
    hint: '1.º: (+, +) arriba a la derecha. 2.º: (−, +) arriba a la izquierda. 3.º: (−, −) abajo a la izquierda. 4.º: (+, −) abajo a la derecha.',
    steps: [`x ${p.x > 0 ? 'positiva' : 'negativa'} e y ${p.y > 0 ? 'positiva' : 'negativa'}.`, `${answer} cuadrante.`],
    frames: [
      frame('Los ejes dividen el plano en 4 cuadrantes, que se cuentan al revés que las agujas del reloj, empezando arriba a la derecha.', planeView({ points: [{ x: 3, y: 3, label: '1.º' }, { x: -3, y: 3, label: '2.º' }, { x: -3, y: -3, label: '3.º' }, { x: 3, y: -3, label: '4.º' }] })),
      frame(`${coord(p.x, p.y)} está en el ${answer} cuadrante.`, planeView({ points: [{ ...p, label: coord(p.x, p.y), focus: true }] })),
    ],
    hintFrames: [frame('Mira los signos de x y de y.', planeView({ points: [{ x: 3, y: 3, label: '+,+' }, { x: -3, y: 3, label: '−,+' }, { x: -3, y: -3, label: '−,−' }, { x: 3, y: -3, label: '+,−' }] }))],
  };
}

function buildWhich(rng, neg) {
  const pts = [];
  while (pts.length < 3) {
    const p = point(rng, neg);
    if (!pts.some((q) => q.x === p.x && q.y === p.y)) pts.push(p);
  }
  const names = ['A', 'B', 'C'];
  const target = rng.int(0, 2);
  const p = pts[target];
  return {
    id: `que-punto:${pts.map((q) => `${q.x},${q.y}`).join('|')}:${target}`,
    form: 'que-punto',
    answerType: 'choice',
    choices: names,
    answer: names[target],
    expression: `${coord(p.x, p.y)} → □`,
    story: `📍 Tu amiga te espera en el punto ${coord(p.x, p.y)}. ¿Es A, B o C?`,
    illustration: planeView({ points: pts.map((q, i) => ({ ...q, label: names[i] })) }),
    hint: 'Desde el 0: primero x a la derecha o izquierda, después y arriba o abajo.',
    steps: [`${coord(p.x, p.y)}: ${Math.abs(p.x)} ${p.x > 0 ? 'a la derecha' : 'a la izquierda'} y ${Math.abs(p.y)} ${p.y > 0 ? 'arriba' : 'abajo'}.`, `Es el punto ${names[target]}.`],
    frames: readFrames(p, names[target]),
    hintFrames: readFrames(p, '?').slice(0, 1),
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'leer' ? buildRead(rng, cfg.neg) : form === 'cuadrante' ? buildQuadrant(rng) : buildWhich(rng, cfg.neg);
  return { topicId: TOPIC_ID, level, theme: 'funciones', ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Coordenadas',
    paragraphs: [
      'Un punto se localiza con dos números (x, y): primero cuánto a la derecha (o izquierda, si es negativo) y después cuánto arriba (o abajo).',
      'El punto (3, 2) está 3 a la derecha y 2 arriba.',
    ],
    frames: readFrames({ x: 3, y: 2 }),
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Coordenadas',
  emoji: '🗺️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
