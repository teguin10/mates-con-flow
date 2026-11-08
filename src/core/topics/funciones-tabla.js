// Tema: funciones con tabla y expresión. Calcular y para un x, completar la
// tabla y elegir la expresión de una tabla.

import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES, linear, num, planeView, shuffle } from './funciones-comun.js';

const TOPIC_ID = 'funciones-tabla';

export const FORMS = {
  valor: 'Calcular y para un x',
  tabla: 'Completar la tabla',
  expresion: 'La expresión de una tabla',
};

const LEVELS = {
  1: { forms: [['valor', 4], ['tabla', 2]], neg: false },
  2: { forms: [['valor', 2], ['tabla', 3], ['expresion', 2]], neg: true },
  3: { forms: [['expresion', 4], ['tabla', 2]], neg: true },
};

const tableView = (xs, ys) => ({ kind: 'table', rowNames: ['x', 'y'], top: xs.map(num), bottom: ys.map((v) => (v === null ? null : num(v))), factor: null });

function coeffs(rng, neg) {
  const a = rng.int(1, 4) * (neg && rng.next() < 0.35 ? -1 : 1);
  const b = rng.int(neg ? -5 : 0, 6);
  return { a, b };
}

function buildValue(rng, neg) {
  const { a, b } = coeffs(rng, neg);
  const x = rng.int(neg ? -4 : 0, 6);
  const y = a * x + b;
  const expr = `y = ${linear(a, b)}`;
  const sub = x < 0 ? `(${num(x)})` : num(x);
  return {
    id: `valor:${a}:${b}:${x}`,
    form: 'valor',
    answerType: 'integer',
    answer: y,
    expression: `${expr}; x = ${num(x)} → y = □`,
    story: `🎮 En un juego, los puntos (y) se calculan con ${expr}, donde x son las monedas. Si tienes x = ${num(x)}, ¿cuánto vale y?`,
    illustration: null,
    hint: `Cambia la x por ${num(x)} en la expresión.`,
    steps: [`y = ${num(a)} · ${sub}${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''} = ${num(y)}.`],
    frames: [
      frame(`Cambiamos x por ${num(x)}.`, { kind: 'calc', lines: [expr, `y = ${num(a)} · ${sub}${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''}`] }),
      frame(`y vale ${num(y)}. Es el punto (${num(x)}, ${num(y)}).`, planeView({ line: { a, b }, points: [{ x, y, label: `(${num(x)}, ${num(y)})`, focus: true }], min: -6, max: 8, yMin: Math.min(-6, y - 2), yMax: Math.max(8, y + 2) })),
    ],
    hintFrames: [frame(`Pon ${num(x)} donde está la x.`, { kind: 'calc', lines: [expr] })],
  };
}

function buildTable(rng, neg) {
  const { a, b } = coeffs(rng, neg);
  const xs = [0, 1, 2, 3];
  const ys = xs.map((x) => a * x + b);
  const missing = rng.int(1, 3);
  const shown = ys.map((y, i) => (i === missing ? null : y));
  const expr = `y = ${linear(a, b)}`;
  return {
    id: `tabla:${a}:${b}:${missing}`,
    form: 'tabla',
    answerType: 'integer',
    answer: ys[missing],
    expression: `x = ${missing} → y = □`,
    story: `📋 Completa la tabla de ${expr}. ¿Qué número va debajo de x = ${missing}?`,
    illustration: tableView(xs, shown),
    hint: `Calcula ${expr} con x = ${missing}.`,
    steps: [`y = ${num(a)} · ${missing}${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''} = ${num(ys[missing])}.`],
    frames: [
      frame(`Sustituimos x = ${missing} en ${expr}.`, tableView(xs, shown)),
      frame(`Sale ${num(ys[missing])}. Con todos los puntos, la gráfica es una recta.`, planeView({ line: { a, b }, points: xs.map((x, i) => ({ x, y: ys[i], focus: i === missing })), min: -2, max: 6, yMin: Math.min(-2, ...ys) - 1, yMax: Math.max(6, ...ys) + 1 })),
    ],
    hintFrames: [frame(`Usa ${expr}.`, tableView(xs, shown))],
  };
}

function buildExpression(rng, neg) {
  const { a, b } = coeffs(rng, neg);
  const xs = [0, 1, 2, 3];
  const ys = xs.map((x) => a * x + b);
  const right = `y = ${linear(a, b)}`;
  const wrong = [`y = ${linear(b || 1, a)}`, `y = ${linear(a + 1, b)}`, `y = ${linear(a, b + 1)}`, `y = ${linear(-a, b)}`].filter((w) => w !== right);
  return {
    id: `expresion:${a}:${b}`,
    form: 'expresion',
    answerType: 'choice',
    choices: shuffle(rng, [right, ...shuffle(rng, [...new Set(wrong)]).slice(0, 2)]),
    answer: right,
    expression: 'Expresión: □',
    story: '🔎 ¿Qué expresión da esta tabla?',
    illustration: tableView(xs, ys),
    hint: `Con x = 0 sale el número suelto (${num(b)}); cada vez que x sube 1, y cambia ${num(a)}.`,
    steps: [`Con x = 0, y = ${num(b)}: el número suelto es ${num(b)}.`, `Cada paso, y cambia ${num(a)}: el número que multiplica a x es ${num(a)}.`, `${right}.`],
    frames: [
      frame(`Con x = 0, y vale ${num(b)}: ese es el número suelto.`, tableView(xs, ys)),
      frame(`Cada vez que x sube 1, y cambia ${num(a)}: va multiplicando a la x. Es ${right}.`, planeView({ line: { a, b }, points: xs.map((x, i) => ({ x, y: ys[i] })), min: -2, max: 6, yMin: Math.min(-2, ...ys) - 1, yMax: Math.max(6, ...ys) + 1 })),
    ],
    hintFrames: [frame('Mira qué pasa con x = 0 y cuánto cambia y en cada paso.', tableView(xs, ys))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'valor' ? buildValue(rng, cfg.neg) : form === 'tabla' ? buildTable(rng, cfg.neg) : buildExpression(rng, cfg.neg);
  return { topicId: TOPIC_ID, level, theme: 'funciones', ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Tabla, expresión y gráfica',
    paragraphs: [
      'Una función relaciona dos cantidades: y = 2x + 1 dice cómo sale y a partir de x.',
      'Con una tabla de valores (x = 0, 1, 2, 3) sacas puntos, y al dibujarlos sale la gráfica. Si es de la forma y = ax + b, la gráfica es una recta.',
    ],
    frames: [
      frame('y = 2x + 1: con x = 0, 1, 2, 3 sale y = 1, 3, 5, 7.', tableView([0, 1, 2, 3], [1, 3, 5, 7])),
      frame('Al dibujar los puntos sale una recta.', planeView({ line: { a: 2, b: 1 }, points: [0, 1, 2, 3].map((x) => ({ x, y: 2 * x + 1 })), min: -2, max: 6, yMin: -2, yMax: 9 })),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Tablas y expresiones',
  emoji: '📋',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
