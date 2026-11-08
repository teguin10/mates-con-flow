// Tema: tablas de frecuencias. Frecuencia absoluta, relativa y porcentaje, y
// leer un diagrama de barras.

import { fr, simplify } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { barsView, BLOCK, countBy, D, generator, LEVEL_NAMES } from './estadistica-comun.js';
import { F } from './fracciones-comun.js';

const TOPIC_ID = 'frecuencias';

export const FORMS = {
  absoluta: 'Frecuencia absoluta',
  relativa: 'Frecuencia relativa',
  porcentaje: 'Porcentaje',
  barras: 'Leer un diagrama de barras',
};

const LEVELS = {
  1: { forms: [['absoluta', 3], ['barras', 3]] },
  2: { forms: [['absoluta', 1], ['relativa', 3], ['barras', 2]] },
  3: { forms: [['relativa', 2], ['porcentaje', 4]] },
};

const SURVEYS = [
  { topic: 'deporte favorito', labels: ['vóley', 'fútbol', 'baloncesto', 'boxeo'] },
  { topic: 'mascota favorita', labels: ['perro', 'gato', 'mono', 'pez'] },
  { topic: 'estilo de música', labels: ['trap', 'pop', 'reguetón', 'rock'] },
  { topic: 'postre favorito', labels: ['crepes', 'tortitas', 'helado', 'tarta'] },
];

/** Datos de una encuesta: el total es 10, 20, 25 o 50 para que los porcentajes sean exactos. */
function survey(rng, level) {
  const s = rng.pick(SURVEYS);
  const total = level === 3 ? rng.pick([20, 25, 50]) : level === 2 ? rng.pick([10, 20]) : rng.int(8, 15);
  const counts = [0, 0, 0, 0];
  for (let i = 0; i < total; i += 1) counts[rng.weighted([[0, 4], [1, 3], [2, 2], [3, 1]])] += 1;
  return { ...s, counts, total };
}

const tableLines = (s) => s.labels.map((l, i) => `${l}: ${s.counts[i]}`);

function buildAbsolute(rng, level) {
  const s = survey(rng, level);
  const i = rng.int(0, 3);
  const data = s.labels.flatMap((l, k) => Array.from({ length: s.counts[k] }, () => l));
  // Mezclamos las respuestas como llegarían en la encuesta.
  for (let k = data.length - 1; k > 0; k -= 1) { const j = rng.int(0, k); [data[k], data[j]] = [data[j], data[k]]; }
  return {
    id: `absoluta:${s.topic}:${s.counts.join('-')}:${i}`,
    form: 'absoluta',
    answerType: 'integer',
    answer: s.counts[i],
    expression: `f(${s.labels[i]}) = □`,
    story: `📋 Preguntas en clase el ${s.topic}. Las respuestas son: ${data.join(', ')}. ¿Cuántas veces sale «${s.labels[i]}» (su frecuencia absoluta)?`,
    hint: 'La frecuencia absoluta es cuántas veces se repite un dato: cuéntalo.',
    steps: [`«${s.labels[i]}» sale ${s.counts[i]} veces.`],
    frames: [
      frame('Hacemos la tabla contando cuántas veces sale cada respuesta.', { kind: 'calc', lines: tableLines(s) }),
      frame(`«${s.labels[i]}» sale ${s.counts[i]} veces: esa es su frecuencia absoluta.`, barsView(s.labels.map((l, k) => ({ label: l, value: s.counts[k] })), i)),
    ],
    hintFrames: [frame(`Cuenta cuántas veces aparece «${s.labels[i]}».`, { kind: 'calc', lines: [`${s.labels[i]}: ?`] })],
  };
}

function buildRelative(rng, level, asPercent) {
  const s = survey(rng, level);
  let i = rng.int(0, 3);
  if (s.counts[i] === 0) i = 0;
  const rel = simplify(fr(s.counts[i], s.total));
  const pct = fr(s.counts[i] * 100, s.total);
  const bars = barsView(s.labels.map((l, k) => ({ label: l, value: s.counts[k] })), i, `total: ${s.total}`);
  if (asPercent) {
    return {
      id: `porcentaje:${s.topic}:${s.counts.join('-')}:${i}`,
      form: 'porcentaje',
      answerType: 'decimal',
      answer: pct,
      expression: `% de ${s.labels[i]} = □ %`,
      story: `📊 En una encuesta a ${s.total} personas sobre su ${s.topic}, ${s.counts[i]} eligen ${s.labels[i]}. ¿Qué porcentaje es?`,
      illustration: bars,
      hint: 'Porcentaje = frecuencia absoluta ÷ total × 100.',
      steps: [`${s.counts[i]} ÷ ${s.total} = ${D(fr(s.counts[i], s.total))}.`, `× 100 = ${D(pct)} %.`],
      frames: [
        frame(`${s.counts[i]} de ${s.total}: dividimos y multiplicamos por 100.`, bars),
        frame(`${s.counts[i]} entre ${s.total} es ${D(fr(s.counts[i], s.total))}; por 100, el ${D(pct)} %.`, { kind: 'calc', lines: [`${s.counts[i]} ÷ ${s.total} × 100 = ${D(pct)} %`] }),
      ],
      hintFrames: [frame('frecuencia ÷ total × 100', bars)],
    };
  }
  return {
    id: `relativa:${s.topic}:${s.counts.join('-')}:${i}`,
    form: 'relativa',
    answerType: 'fraction',
    answer: rel,
    expression: `fr(${s.labels[i]}) = □`,
    story: `📊 En una encuesta a ${s.total} personas sobre su ${s.topic}, ${s.counts[i]} eligen ${s.labels[i]}. ¿Cuál es su frecuencia relativa? (como fracción)`,
    illustration: bars,
    hint: 'Frecuencia relativa = frecuencia absoluta ÷ total.',
    steps: [`${s.counts[i]}/${s.total}${F(rel) !== `${s.counts[i]}/${s.total}` ? ` = ${F(rel)}` : ''}.`],
    frames: [
      frame(`La frecuencia relativa es ${s.counts[i]} de ${s.total}: ${s.counts[i]}/${s.total}.`, bars),
      frame(`Simplificada: ${F(rel)}.`, { kind: 'calc', lines: [`${s.counts[i]}/${s.total} = ${F(rel)} = ${D(rel)}`] }),
    ],
    hintFrames: [frame('frecuencia ÷ total', bars)],
  };
}

function buildBars(rng, level) {
  const s = survey(rng, level);
  const max = Math.max(...s.counts);
  const tie = s.counts.filter((c) => c === max).length > 1;
  const askTotal = tie || rng.next() < 0.4;
  const bars = barsView(s.labels.map((l, k) => ({ label: l, value: s.counts[k] })));
  if (askTotal) {
    return {
      id: `barras:total:${s.topic}:${s.counts.join('-')}`,
      form: 'barras',
      answerType: 'integer',
      answer: s.total,
      expression: 'Total = □',
      story: `📊 El diagrama muestra las respuestas sobre el ${s.topic}. ¿Cuántas personas respondieron en total?`,
      illustration: bars,
      hint: 'Suma lo que mide cada barra.',
      steps: [`${s.counts.join(' + ')} = ${s.total}.`],
      frames: [frame(`Sumamos las barras: ${s.counts.join(' más ')} es ${s.total}.`, barsView(s.labels.map((l, k) => ({ label: l, value: s.counts[k] })), null, `total: ${s.total}`))],
      hintFrames: [frame('Suma todas las barras.', bars)],
    };
  }
  const i = s.counts.indexOf(max);
  return {
    id: `barras:moda:${s.topic}:${s.counts.join('-')}`,
    form: 'barras',
    answerType: 'choice',
    choices: s.labels,
    answer: s.labels[i],
    expression: 'Lo más elegido: □',
    story: `📊 El diagrama muestra las respuestas sobre el ${s.topic}. ¿Qué opción se eligió más?`,
    illustration: bars,
    hint: 'Busca la barra más alta.',
    steps: [`La barra más alta es «${s.labels[i]}», con ${max}.`],
    frames: [frame(`La barra más alta es la de ${s.labels[i]}: ${max}.`, barsView(s.labels.map((l, k) => ({ label: l, value: s.counts[k] })), i))],
    hintFrames: [frame('¿Qué barra es la más alta?', bars)],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'absoluta' ? buildAbsolute(rng, level) : form === 'barras' ? buildBars(rng, level) : buildRelative(rng, level, form === 'porcentaje');
  return { topicId: TOPIC_ID, level, theme: 'estadistica', illustration: null, ...ex };
}

export const generate = generator(build);

const sample = { labels: ['vóley', 'fútbol', 'baloncesto', 'boxeo'], counts: [8, 6, 4, 2] };

export const INTRO = [
  {
    title: 'Frecuencias',
    paragraphs: [
      'La frecuencia absoluta es cuántas veces sale un dato. La relativa es esa cantidad dividida entre el total, y el porcentaje es la relativa por 100.',
      'Si de 20 alumnos 8 prefieren el vóley: frecuencia absoluta 8, relativa 8/20 = 2/5 = 0,4, y porcentaje 40 %.',
    ],
    frames: [
      frame('El deporte favorito de 20 alumnos.', barsView(sample.labels.map((l, k) => ({ label: l, value: sample.counts[k] })))),
      frame('El vóley: 8 de 20. Relativa 8/20 = 0,4; porcentaje 40 %.', barsView(sample.labels.map((l, k) => ({ label: l, value: sample.counts[k] })), 0, '8/20 = 0,4 = 40 %')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Frecuencias y gráficos',
  emoji: '📋',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
