// Tema: cuadrados perfectos y raíz cuadrada (exacta y entera).

import { frame } from '../explain/storyboard.js';
import { generator } from './decimales-comun.js';
import { BLOCK, LEVEL_NAMES } from './potencias.js';

const TOPIC_ID = 'raices';

export const FORMS = {
  cuadrado: 'El cuadrado de un número (7² = 49)',
  raiz: 'Raíz cuadrada exacta (√49 = 7)',
  'es-cuadrado': '¿Es un cuadrado perfecto?',
  'raiz-entera': 'Raíz entera (√50 ≈ 7)',
};

const LEVELS = {
  1: { forms: [['cuadrado', 3], ['raiz', 3]], max: 10 },
  2: { forms: [['raiz', 3], ['es-cuadrado', 3], ['cuadrado', 1]], max: 15 },
  3: { forms: [['raiz-entera', 4], ['raiz', 2], ['es-cuadrado', 1]], max: 20 },
};

const grid = (n) => ({ kind: 'calc', lines: [`${n} × ${n} = ${n * n}`], grid: n <= 10 ? { rows: n, cols: n } : null });

function buildSquare(rng, max) {
  const n = rng.int(2, max);
  return {
    id: `cuadrado:${n}`,
    form: 'cuadrado',
    answerType: 'integer',
    answer: n * n,
    expression: `${n}² = □`,
    story: `🟪 Haces un mural cuadrado de pegatinas con ${n} filas y ${n} columnas. ¿Cuántas pegatinas usas? (${n}²)`,
    hint: `${n}² es ${n} × ${n}.`,
    steps: [`${n}² = ${n} × ${n} = ${n * n}.`],
    frames: [frame(`${n}² es un cuadrado de ${n} por ${n}: ${n * n}.`, grid(n))],
    hintFrames: [frame(`${n} filas de ${n}.`, { ...grid(n), lines: [`${n} × ${n}`] })],
  };
}

function buildRoot(rng, max) {
  const n = rng.int(2, max);
  const sq = n * n;
  return {
    id: `raiz:${sq}`,
    form: 'raiz',
    answerType: 'integer',
    answer: n,
    expression: `√${sq} = □`,
    story: `🟦 Tienes ${sq} pegatinas y quieres colocarlas en un cuadrado perfecto. ¿Cuántas van en cada fila? (√${sq})`,
    hint: `Busca el número que multiplicado por sí mismo da ${sq}.`,
    steps: [`¿Qué número por sí mismo da ${sq}?`, `${n} × ${n} = ${sq}, así que √${sq} = ${n}.`],
    frames: [
      frame(`La raíz cuadrada de ${sq} es el número que al cuadrado da ${sq}.`, { kind: 'calc', lines: [`□ × □ = ${sq}`] }),
      frame(`${n} × ${n} = ${sq}. √${sq} = ${n}.`, grid(n)),
    ],
    hintFrames: [frame(`¿Qué número por sí mismo da ${sq}?`, { kind: 'calc', lines: [`□ × □ = ${sq}`] })],
  };
}

function buildIsSquare(rng, max) {
  const yes = rng.next() < 0.5;
  const n = rng.int(3, max);
  const value = yes ? n * n : n * n + rng.pick([-1, 1, 2, n]);
  const low = Math.floor(Math.sqrt(value));
  return {
    id: `es-cuadrado:${value}`,
    form: 'es-cuadrado',
    answerType: 'choice',
    choices: ['Sí', 'No'],
    answer: low * low === value ? 'Sí' : 'No',
    expression: `¿${value} es cuadrado perfecto?`,
    story: `🔲 ¿Puedes colocar ${value} fichas formando un cuadrado perfecto? (¿Es ${value} un cuadrado perfecto?)`,
    hint: 'Un cuadrado perfecto es un número que se obtiene multiplicando un número por sí mismo: 1, 4, 9, 16, 25…',
    steps: [`${low}² = ${low * low}${low * low === value ? '' : ` y ${low + 1}² = ${(low + 1) ** 2}`}.`, low * low === value ? `${value} es cuadrado perfecto: ${low}².` : `${value} queda entre los dos: no es cuadrado perfecto.`],
    frames: [
      frame(`Buscamos cuadrados cerca de ${value}: ${low}² = ${low * low}${low * low === value ? '' : ` y ${low + 1}² = ${(low + 1) ** 2}`}.`, { kind: 'calc', lines: [`${low}² = ${low * low}`, `${low + 1}² = ${(low + 1) ** 2}`] }),
      frame(low * low === value ? `${value} = ${low}²: sí es cuadrado perfecto.` : `${value} está entre ${low * low} y ${(low + 1) ** 2}: no lo es.`, { kind: 'calc', lines: [low * low === value ? `${value} = ${low}²` : `${low * low} < ${value} < ${(low + 1) ** 2}`] }),
    ],
    hintFrames: [frame('Piensa en los cuadrados que conoces.', { kind: 'calc', lines: ['1 · 4 · 9 · 16 · 25 · 36 · 49 · 64 · 81 · 100'] })],
  };
}

function buildIntegerRoot(rng, max) {
  const n = rng.int(3, max);
  const value = n * n + rng.int(1, 2 * n);
  const rest = value - n * n;
  return {
    id: `raiz-entera:${value}`,
    form: 'raiz-entera',
    answerType: 'integer',
    answer: n,
    expression: `√${value} ≈ □`,
    story: `📐 ${value} no es cuadrado perfecto. ¿Cuál es su raíz entera (el número más grande cuyo cuadrado no pasa de ${value})?`,
    hint: `Busca el cuadrado más grande que no pase de ${value}.`,
    steps: [`${n}² = ${n * n} ≤ ${value} y ${n + 1}² = ${(n + 1) ** 2} > ${value}.`, `La raíz entera es ${n} y sobran ${rest} (el resto).`],
    frames: [
      frame(`${n}² = ${n * n} no pasa de ${value}; ${n + 1}² = ${(n + 1) ** 2} sí.`, { kind: 'calc', lines: [`${n}² = ${n * n}`, `${n + 1}² = ${(n + 1) ** 2}`] }),
      frame(`La raíz entera de ${value} es ${n}, y el resto es ${value} − ${n * n} = ${rest}.`, { kind: 'calc', lines: [`√${value} ≈ ${n}`, `resto = ${rest}`] }),
    ],
    hintFrames: [frame(`¿Qué cuadrado se acerca a ${value} sin pasarse?`, { kind: 'calc', lines: [`□² ≤ ${value}`] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'cuadrado' ? buildSquare(rng, cfg.max)
    : form === 'raiz' ? buildRoot(rng, cfg.max)
      : form === 'es-cuadrado' ? buildIsSquare(rng, cfg.max)
        : buildIntegerRoot(rng, cfg.max);
  return { topicId: TOPIC_ID, level, theme: 'potencia', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Cuadrados y raíces',
    paragraphs: [
      '5² = 25: un cuadrado de 5 por 5. Por eso 25 es un cuadrado perfecto.',
      'La raíz cuadrada va al revés: √25 = 5, porque 5 × 5 = 25. Si el número no es cuadrado perfecto, su raíz entera es el número más grande cuyo cuadrado no se pasa: √30 ≈ 5 (y sobran 5).',
    ],
    frames: [
      frame('5² = 25: 5 filas de 5.', grid(5)),
      frame('√25 = 5, porque 5 × 5 = 25.', { kind: 'calc', lines: ['√25 = 5'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Raíz cuadrada',
  emoji: '🟪',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
