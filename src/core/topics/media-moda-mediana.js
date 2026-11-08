// Tema: parámetros centrales. Media, moda y mediana de pocos datos.

import { fr } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, D, generator, LEVEL_NAMES } from './estadistica-comun.js';

const TOPIC_ID = 'media-moda-mediana';

export const FORMS = {
  media: 'La media',
  moda: 'La moda',
  mediana: 'La mediana',
};

const LEVELS = {
  1: { forms: [['moda', 3], ['media', 3]], n: [5, 5], max: 10 },
  2: { forms: [['media', 2], ['moda', 1], ['mediana', 3]], n: [5, 7], max: 10 },
  3: { forms: [['mediana', 3], ['media', 3]], n: [6, 8], max: 20 },
};

const CONTEXTS = [
  { what: 'las notas de tus exámenes de mates', unit: '' },
  { what: 'los puntos que has hecho en los partidos de vóley', unit: 'puntos' },
  { what: 'las horas que duermes cada noche', unit: 'h' },
  { what: 'los vídeos que ve tu prima al día', unit: 'vídeos' },
];

const dataLine = (data) => data.join(', ');

function makeData(rng, cfg, { mode = false, total = null } = {}) {
  const n = rng.int(cfg.n[0], cfg.n[1]);
  for (;;) {
    const data = Array.from({ length: n }, () => rng.int(1, cfg.max));
    if (mode) {
      const counts = new Map();
      data.forEach((d) => counts.set(d, (counts.get(d) ?? 0) + 1));
      const max = Math.max(...counts.values());
      if (max < 2 || [...counts.values()].filter((c) => c === max).length > 1) continue;
    }
    if (total !== null && data.reduce((a, b) => a + b, 0) % total !== 0) continue;
    return data;
  }
}

function buildMean(rng, cfg, level) {
  const ctx = rng.pick(CONTEXTS);
  // En los niveles 1 y 2 la media sale entera; en el 3, con un decimal como mucho.
  let data;
  let mean;
  do {
    data = makeData(rng, cfg);
    mean = fr(data.reduce((a, b) => a + b, 0), data.length);
  } while (D(mean) === null || (level < 3 && mean.n % mean.d !== 0) || (D(mean).split(',')[1] ?? '').length > 1);
  const sum = data.reduce((a, b) => a + b, 0);
  return {
    id: `media:${data.join('-')}`,
    form: 'media',
    answerType: 'decimal',
    answer: mean,
    expression: `media = □`,
    story: `🧮 Estos son ${ctx.what}: ${dataLine(data)}. ¿Cuál es la media?`,
    hint: 'La media es la suma de todos los datos dividida entre cuántos datos hay.',
    steps: [`Suma: ${data.join(' + ')} = ${sum}.`, `Hay ${data.length} datos: ${sum} ÷ ${data.length} = ${D(mean)}.`],
    frames: [
      frame(`Sumamos todos los datos: ${sum}.`, { kind: 'calc', lines: [`${data.join(' + ')} = ${sum}`] }),
      frame(`Dividimos entre ${data.length}, que son los datos que hay: ${D(mean)}.`, { kind: 'calc', lines: [`${sum} ÷ ${data.length} = ${D(mean)}`] }),
    ],
    hintFrames: [frame('Suma todo y divide entre cuántos hay.', { kind: 'calc', lines: [dataLine(data)] })],
  };
}

function buildMode(rng, cfg) {
  const ctx = rng.pick(CONTEXTS);
  const data = makeData(rng, cfg, { mode: true });
  const counts = new Map();
  data.forEach((d) => counts.set(d, (counts.get(d) ?? 0) + 1));
  const max = Math.max(...counts.values());
  const mode = [...counts.entries()].find(([, c]) => c === max)[0];
  return {
    id: `moda:${data.join('-')}`,
    form: 'moda',
    answerType: 'integer',
    answer: mode,
    expression: 'moda = □',
    story: `🔁 Estos son ${ctx.what}: ${dataLine(data)}. ¿Cuál es la moda?`,
    hint: 'La moda es el dato que más se repite.',
    steps: [`El ${mode} sale ${max} veces, más que ningún otro.`, `Moda = ${mode}.`],
    frames: [frame(`El dato que más se repite es el ${mode}: sale ${max} veces.`, { kind: 'bars', bars: [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([v, c]) => ({ label: String(v), value: c })), highlight: [...counts.keys()].sort((a, b) => a - b).indexOf(mode), note: `moda = ${mode}` })],
    hintFrames: [frame('¿Qué número se repite más?', { kind: 'calc', lines: [dataLine(data)] })],
  };
}

function buildMedian(rng, cfg) {
  const ctx = rng.pick(CONTEXTS);
  let data;
  let median;
  do {
    data = makeData(rng, cfg);
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    median = n % 2 ? fr(sorted[(n - 1) / 2], 1) : fr(sorted[n / 2 - 1] + sorted[n / 2], 2);
  } while (D(median) === null);
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const even = n % 2 === 0;
  return {
    id: `mediana:${data.join('-')}`,
    form: 'mediana',
    answerType: 'decimal',
    answer: median,
    expression: 'mediana = □',
    story: `📏 Estos son ${ctx.what}: ${dataLine(data)}. ¿Cuál es la mediana?`,
    hint: even ? 'Ordena los datos. Como hay un número par, la mediana es la media de los dos del centro.' : 'Ordena los datos de menor a mayor: la mediana es el del centro.',
    steps: [`Ordenados: ${sorted.join(', ')}.`, even ? `Los del centro son ${sorted[n / 2 - 1]} y ${sorted[n / 2]}: (${sorted[n / 2 - 1]} + ${sorted[n / 2]}) ÷ 2 = ${D(median)}.` : `El del centro es ${D(median)}.`],
    frames: [
      frame('Primero ordenamos los datos de menor a mayor.', { kind: 'calc', lines: [dataLine(data), `→ ${sorted.join(', ')}`] }),
      frame(even ? `Hay ${n} datos: la mediana es la media de los dos del centro, ${sorted[n / 2 - 1]} y ${sorted[n / 2]}: ${D(median)}.` : `Hay ${n} datos: el del centro es el ${D(median)}.`, { kind: 'calc', lines: [sorted.join(', '), `mediana = ${D(median)}`] }),
    ],
    hintFrames: [frame('Ordénalos de menor a mayor.', { kind: 'calc', lines: [dataLine(data)] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'media' ? buildMean(rng, cfg, level) : form === 'moda' ? buildMode(rng, cfg) : buildMedian(rng, cfg);
  return { topicId: TOPIC_ID, level, theme: 'estadistica', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Media, moda y mediana',
    paragraphs: [
      'Con las notas 6, 8, 5, 8 y 3: la media es la suma entre cuántos hay (30 ÷ 5 = 6); la moda, el que más se repite (8); y la mediana, el del centro al ordenarlos (3, 5, 6, 8, 8 → 6).',
      'Si hay un número par de datos, la mediana es la media de los dos del centro.',
    ],
    frames: [
      frame('Media: sumamos y dividimos entre 5. 30 entre 5 es 6.', { kind: 'calc', lines: ['6 + 8 + 5 + 8 + 3 = 30', '30 ÷ 5 = 6'] }),
      frame('Moda: el 8, que sale dos veces.', { kind: 'calc', lines: ['6, 8, 5, 8, 3 → moda 8'] }),
      frame('Mediana: ordenados, el del centro es el 6.', { kind: 'calc', lines: ['3, 5, 6, 8, 8 → mediana 6'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Media, moda y mediana',
  emoji: '⚖️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
