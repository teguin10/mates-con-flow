// Tema: leer, comparar y ordenar decimales. La cifra de cada posición, cómo
// se lee, comparar (3,5 > 3,45) y elegir el mayor o el menor.

import { compare, equals } from '../math/fraction.js';
import { digitAt, PLACE_NAMES } from '../math/decimal.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, D, generator, LEVEL_NAMES, padTo, placesOf, placesView, randomDecimal, shuffle } from './decimales-comun.js';

const TOPIC_ID = 'decimales-leer';

export const FORMS = {
  cifra: 'La cifra de una posición (décimas, centésimas…)',
  leer: 'Cómo se lee un decimal',
  comparar: 'Comparar dos decimales (3,5 □ 3,45)',
  'mayor-menor': 'El mayor o el menor de varios',
  entre: 'Un decimal entre otros dos',
};

const LEVELS = {
  1: { places: [1, 2], forms: [['cifra', 3], ['comparar', 3], ['leer', 2]] },
  2: { places: [1, 2, 3], forms: [['comparar', 3], ['mayor-menor', 3], ['cifra', 1], ['leer', 2]] },
  3: { places: [2, 3], forms: [['mayor-menor', 2], ['comparar', 2], ['entre', 3]] },
};

const SINGULAR = { 1: 'décima', 2: 'centésima', 3: 'milésima' };
const COMPARE_CHOICES = ['<', '=', '>'];
const WORDS = { '<': 'es menor que', '>': 'es mayor que', '=': 'es igual a' };

const CONTEXTS = [
  { unit: 'm', text: '🏐 En la prueba de salto de tu equipo de vóley', what: 'saltos' },
  { unit: '€', text: '🥞 En la carta de crepes', what: 'precios' },
  { unit: 's', text: '🏃‍♀️ En la carrera de 60 metros del insti', what: 'tiempos' },
  { unit: 'kg', text: '🥊 En el pesaje del torneo de boxeo', what: 'pesos' },
];

/** «4 unidades y 7 centésimas». */
export function reading(f) {
  const text = D(f);
  const [whole, frac = ''] = text.split(',');
  if (!frac) return `${whole} ${whole === '1' ? 'unidad' : 'unidades'}`;
  const n = Number(frac);
  const unit = SINGULAR[frac.length];
  return `${whole} ${whole === '1' ? 'unidad' : 'unidades'} y ${n} ${n === 1 ? unit : `${unit}s`}`;
}

/** Lecturas falsas típicas: la parte decimal en otra posición, o al revés. */
function wrongReadings(f) {
  const [whole, frac] = D(f).split(',');
  const n = Number(frac);
  const units = (w) => `${w} ${w === '1' ? 'unidad' : 'unidades'}`;
  const others = [1, 2, 3].filter((k) => k !== frac.length).map((k) => `${units(whole)} y ${n} ${n === 1 ? SINGULAR[k] : `${SINGULAR[k]}s`}`);
  const w = Number(whole);
  others.push(`${units(String(n))} y ${w} ${w === 1 ? SINGULAR[frac.length] : `${SINGULAR[frac.length]}s`}`);
  return [...new Set(others)].filter((r) => r !== reading(f));
}

function symbol(a, b) {
  const c = compare(a, b);
  if (c < 0) return '<';
  return c > 0 ? '>' : '=';
}

/**
 * Dos decimales que se parecen, con su forma escrita: trampas típicas como
 * 3,5 y 3,45, o 3,5 y 3,50 (iguales).
 */
function trickyPair(rng, places) {
  const whole = rng.int(0, 20);
  const kind = rng.int(0, 3);
  const a = { n: whole * 10 + rng.int(1, 9), d: 10 };
  const item = (f, text = D(f)) => ({ f, text });
  if (kind === 0) return [item(a), item({ n: a.n * 10 - rng.int(1, 9), d: 100 })];
  if (kind === 1) return [item(a), item(a, padTo(D(a), 2))];
  if (kind === 2) return [item({ n: whole * 100 + rng.int(1, 9), d: 100 }), item(a)];
  return [item(randomDecimal(rng, whole, whole + 1, rng.pick(places))), item(randomDecimal(rng, whole, whole + 1, rng.pick(places)))];
}

function rowsFor(values) {
  const places = Math.max(...values.map(placesOf));
  return values.map((v) => padTo(D(v), places));
}

function compareFrames(a, b, ta = D(a), tb = D(b)) {
  const rows = rowsFor([a, b]);
  const answer = symbol(a, b);
  const frames = [frame(`Ponemos ${ta} y ${tb} uno encima del otro, con las comas en columna. Si falta alguna cifra, se rellena con ceros.`, placesView(rows))];
  let place = 0;
  const max = Math.max(placesOf(a), placesOf(b));
  while (place <= max && digitAt(a, place) === digitAt(b, place) && Math.floor(a.n / a.d) === Math.floor(b.n / b.d)) place += 1;
  if (Math.floor(a.n / a.d) !== Math.floor(b.n / b.d)) {
    frames.push(frame(`La parte entera ya es distinta: ${Math.floor(a.n / a.d)} y ${Math.floor(b.n / b.d)}.`, placesView(rows, 0)));
  } else if (answer === '=') {
    frames.push(frame('Todas las cifras son iguales: los ceros del final no cambian nada.', placesView(rows)));
  } else {
    frames.push(frame(`La primera cifra distinta está en las ${PLACE_NAMES[place]}: ${digitAt(a, place)} y ${digitAt(b, place)}.`, placesView(rows, place)));
  }
  frames.push(frame(`Por eso, ${ta} ${WORDS[answer]} ${tb}.`, { kind: 'calc', lines: [`${ta} ${answer} ${tb}`] }));
  return frames;
}

function buildCifra(rng, places) {
  const p = rng.pick(places);
  const f = randomDecimal(rng, 10, 99, p);
  const place = rng.int(1, p) === 1 && rng.next() < 0.3 ? rng.pick([0, -1]) : rng.int(1, p);
  const answer = digitAt(f, place);
  const rows = [D(f)];
  return {
    id: `cifra:${D(f)}:${place}`,
    form: 'cifra',
    answerType: 'integer',
    answer,
    expression: `${D(f)} → ${PLACE_NAMES[place]}: □`,
    story: `🎯 En el número ${D(f)}, ¿qué cifra está en las ${PLACE_NAMES[place]}?`,
    hint: 'Detrás de la coma van, por orden: décimas, centésimas y milésimas. Delante, unidades y decenas.',
    steps: [`Detrás de la coma: décimas, centésimas, milésimas.`, `En ${D(f)}, las ${PLACE_NAMES[place]} son ${answer}.`],
    frames: [
      frame(`Ponemos ${D(f)} en la tabla de posiciones.`, placesView(rows)),
      frame(`Las ${PLACE_NAMES[place]} son la cifra ${answer}.`, placesView(rows, place)),
    ],
    hintFrames: [frame('Así se llaman las posiciones de un decimal.', placesView(rows))],
  };
}

function buildLeer(rng, places, count) {
  const p = rng.pick(places);
  const f = randomDecimal(rng, 0, 30, p);
  const answer = reading(f);
  const wrong = wrongReadings(f);
  const choices = shuffle(rng, [answer, ...wrong.slice(0, count - 1)]);
  return {
    id: `leer:${D(f)}`,
    form: 'leer',
    answerType: 'choice',
    choices,
    answer,
    expression: `${D(f)} → □`,
    story: `🗣️ ¿Cómo se lee ${D(f)}?`,
    hint: `Mira cuántas cifras hay detrás de la coma: 1 son décimas, 2 son centésimas y 3 son milésimas.`,
    steps: [`${D(f)} tiene ${p} ${p === 1 ? 'cifra' : 'cifras'} detrás de la coma: ${SINGULAR[p]}s.`, `Se lee: ${answer}.`],
    frames: [
      frame(`${D(f)} tiene ${p} ${p === 1 ? 'cifra decimal' : 'cifras decimales'}, así que lo de detrás de la coma son ${SINGULAR[p]}s.`, placesView([D(f)], p)),
      frame(`Se lee: ${answer}.`, { kind: 'calc', lines: [D(f), answer] }),
    ],
    hintFrames: [frame('¿Cuántas cifras hay detrás de la coma?', placesView([D(f)]))],
  };
}

function buildComparar(rng, places) {
  const [x, y] = trickyPair(rng, places);
  const [{ f: a, text: ta }, { f: b, text: tb }] = rng.next() < 0.5 ? [x, y] : [y, x];
  const answer = symbol(a, b);
  const frames = compareFrames(a, b, ta, tb);
  return {
    id: `comparar:${ta}:${tb}`,
    form: 'comparar',
    answerType: 'choice',
    choices: COMPARE_CHOICES,
    answer,
    expression: `${ta} □ ${tb}`,
    story: `⚖️ ¿Qué signo va entre ${ta} y ${tb}?`,
    hint: 'No gana el que tiene más cifras. Compara cifra a cifra desde la izquierda: unidades, décimas, centésimas…',
    steps: ['Alinea las comas y rellena con ceros.', 'Compara cifra a cifra desde la izquierda.', `${ta} ${answer} ${tb}.`],
    frames,
    hintFrames: frames.slice(0, 1),
  };
}

function buildMayorMenor(rng, places, count) {
  const context = rng.pick(CONTEXTS);
  const whole = context.unit === '€' ? rng.int(1, 9) : context.unit === 's' ? rng.int(8, 12) : rng.int(1, 60);
  const values = [];
  while (values.length < count) {
    const v = randomDecimal(rng, whole, whole + 1, rng.pick(places));
    if (!values.some((w) => equals(w, v))) values.push(v);
  }
  const high = context.unit === 's' ? rng.next() < 0.3 : rng.next() < 0.6;
  const sorted = [...values].sort(compare);
  const answerValue = high ? sorted.at(-1) : sorted[0];
  const goal = context.unit === 's' ? (high ? 'el tiempo más lento (el mayor)' : 'el tiempo más rápido (el menor)') : high ? 'el mayor' : 'el menor';
  const rows = rowsFor(values);
  return {
    id: `mayor-menor:${values.map(D).join('|')}`,
    form: 'mayor-menor',
    answerType: 'choice',
    choices: values.map((v) => `${D(v)} ${context.unit}`),
    answer: `${D(answerValue)} ${context.unit}`,
    expression: `¿Cuál es ${high ? 'el mayor' : 'el menor'}?`,
    story: `${context.text} salen estos ${context.what}. ¿Cuál es ${goal}?`,
    hint: 'Ponlos uno debajo de otro con las comas alineadas y compara cifra a cifra.',
    steps: ['Alinea las comas y rellena con ceros.', `Ordenados de menor a mayor: ${sorted.map(D).join(' < ')}.`, `${high ? 'El mayor' : 'El menor'} es ${D(answerValue)}.`],
    frames: [
      frame('Los ponemos en columna, con las comas alineadas y ceros donde falten cifras.', placesView(rows)),
      frame(`De menor a mayor: ${sorted.map(D).join(' < ')}.`, { kind: 'calc', lines: [sorted.map(D).join(' < ')] }),
      frame(`${high ? 'El mayor' : 'El menor'} es ${D(answerValue)}.`, placesView([padTo(D(answerValue), Math.max(...values.map(placesOf)))])),
    ],
    hintFrames: [frame('Los ponemos en columna, con las comas alineadas.', placesView(rows))],
  };
}

function buildEntre(rng) {
  const low = randomDecimal(rng, 0, 20, 1);
  const high = { n: low.n + 1, d: 10 };
  const answer = { n: low.n * 10 + rng.int(1, 9), d: 100 };
  const wrong = [{ n: low.n * 10 - rng.int(1, 9), d: 100 }, { n: high.n * 10 + rng.int(1, 9), d: 100 }, { n: Math.floor(low.n / 10) * 100 + rng.int(1, 9), d: 100 }]
    .filter((w) => !equals(w, answer) && w.n > 0);
  const choices = shuffle(rng, [answer, ...wrong.slice(0, 2)].map(D));
  const lowP = padTo(D(low), 2);
  const highP = padTo(D(high), 2);
  return {
    id: `entre:${D(low)}:${D(answer)}`,
    form: 'entre',
    answerType: 'choice',
    choices,
    answer: D(answer),
    expression: `${D(low)} < □ < ${D(high)}`,
    story: `🔎 Entre dos decimales siempre caben más. ¿Cuál de estos está entre ${D(low)} y ${D(high)}?`,
    hint: `Escribe ${D(low)} como ${lowP} y ${D(high)} como ${highP}: entre los dos están ${D(low)}1, ${D(low)}2… hasta ${D(low)}9.`,
    steps: [`${D(low)} = ${lowP} y ${D(high)} = ${highP}.`, `Entre ellos están ${D(low)}1, ${D(low)}2… ${D(low)}9.`, `La respuesta es ${D(answer)}.`],
    frames: [
      frame(`Añadimos un cero: ${D(low)} es ${lowP} y ${D(high)} es ${highP}.`, placesView([lowP, highP], 2)),
      frame(`Entre ${lowP} y ${highP} están ${D(low)}1, ${D(low)}2… y ${D(answer)} es uno de ellos.`, placesView([lowP, padTo(D(answer), 2), highP], 2)),
    ],
    hintFrames: [frame(`Piensa en ${D(low)} como ${lowP}.`, placesView([lowP, highP]))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const count = level === 3 ? 4 : 3;
  const ex = form === 'cifra' ? buildCifra(rng, cfg.places)
    : form === 'leer' ? buildLeer(rng, cfg.places, count)
      : form === 'comparar' ? buildComparar(rng, cfg.places)
        : form === 'mayor-menor' ? buildMayorMenor(rng, cfg.places, count)
          : buildEntre(rng);
  return { topicId: TOPIC_ID, level, theme: 'decimal', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Las posiciones',
    paragraphs: [
      'Un decimal tiene una parte entera (delante de la coma) y una parte decimal (detrás).',
      'Detrás de la coma van las décimas, las centésimas y las milésimas. 3,47 € son 3 euros, 4 décimas y 7 centésimas: 3 euros y 47 céntimos.',
    ],
    frames: [
      frame('3,47 en la tabla: 3 unidades, 4 décimas y 7 centésimas.', placesView(['3,47'])),
      frame('Las décimas van justo detrás de la coma.', placesView(['3,47'], 1)),
      frame('Y las centésimas, después.', placesView(['3,47'], 2)),
    ],
  },
  {
    title: 'Comparar sin caer en la trampa',
    paragraphs: [
      'No gana el que tiene más cifras: 3,5 es mayor que 3,45.',
      'Truco: alinea las comas, rellena con ceros (3,50 y 3,45) y compara cifra a cifra desde la izquierda.',
    ],
    frames: compareFrames({ n: 35, d: 10 }, { n: 345, d: 100 }),
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Leer, comparar y ordenar',
  emoji: '🔍',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
