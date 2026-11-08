// Tema: fracción y decimal, decimales periódicos, redondeo y error. Solo se
// escriben decimales exactos; los periódicos se reconocen eligiendo su tipo
// (decisión del usuario).

import { fr, gcd, simplify } from '../math/fraction.js';
import { dec, decimalType, distance, roundTo } from '../math/decimal.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, D, generator, LEVEL_NAMES, padTo, randomDecimal, roundView } from './decimales-comun.js';
import { bar, F, fractionView } from './fracciones-comun.js';

const TOPIC_ID = 'decimales-fraccion-redondeo';

export const FORMS = {
  'a-decimal': 'De fracción a decimal (3/4 = 0,75)',
  'a-fraccion': 'De decimal a fracción (0,25 = 1/4)',
  tipo: 'Exacto o periódico',
  redondear: 'Redondear',
  error: 'Error al redondear',
};

const LEVELS = {
  1: { forms: [['a-decimal', 3], ['redondear', 3]], dens: [2, 4, 5, 10] },
  2: { forms: [['a-decimal', 2], ['a-fraccion', 3], ['redondear', 2], ['tipo', 2]], dens: [2, 4, 5, 8, 10, 20, 25] },
  3: { forms: [['tipo', 2], ['a-fraccion', 2], ['error', 3], ['redondear', 1]], dens: [4, 8, 20, 25, 40, 50] },
};

const TYPES = { exacto: 'Exacto', 'periodico-puro': 'Periódico puro', 'periodico-mixto': 'Periódico mixto' };
const TO = { 0: 'las unidades', 1: 'las décimas', 2: 'las centésimas' };
const NAMES = { 0: 'unidades', 1: 'décima', 2: 'centésima' };

/** Primeras cifras de n/d para enseñar un periódico: 0,333… */
export function firstDigits(f, count = 6) {
  const whole = Math.floor(f.n / f.d);
  let rest = f.n % f.d;
  let digits = '';
  for (let i = 0; i < count; i += 1) {
    rest *= 10;
    digits += Math.floor(rest / f.d);
    rest %= f.d;
  }
  return `${whole},${digits}…`;
}

function properFraction(rng, dens) {
  const d = rng.pick(dens);
  let n;
  do n = rng.int(1, d - 1); while (gcd(n, d) !== 1);
  return fr(n, d);
}

function buildToDecimal(rng, dens) {
  const f = properFraction(rng, dens);
  const value = f;
  return {
    id: `a-decimal:${F(f)}`,
    form: 'a-decimal',
    answerType: 'decimal',
    answer: value,
    expression: `${F(f)} = □`,
    story: `🥞 La receta dice ${F(f)} de litro de leche, pero tu jarra marca decimales. ¿Cuánto es en decimal?`,
    hint: `Una fracción es una división: ${f.n} ÷ ${f.d}.`,
    steps: [`${F(f)} = ${f.n} ÷ ${f.d}.`, `${f.n} ÷ ${f.d} = ${D(value)}.`],
    frames: [
      frame(`${F(f)} es la división ${f.n} entre ${f.d}.`, fractionView([bar(f)], [], `${f.n} ÷ ${f.d}`)),
      frame(`${f.n} ÷ ${f.d} = ${D(value)}.`, { kind: 'calc', lines: [`${f.n} ÷ ${f.d} = ${D(value)}`, `${F(f)} = ${D(value)}`] }),
    ],
    hintFrames: [frame(`${F(f)} es ${f.n} entre ${f.d}.`, fractionView([bar(f)]))],
  };
}

// Decimales con fracciones que se pueden simplificar a mano.
const TO_FRACTION = {
  2: ['0,1', '0,3', '0,7', '0,9', '0,2', '0,4', '0,5', '0,6', '0,8', '0,25', '0,75', '0,05', '0,35', '0,45', '0,15', '0,12'],
  3: ['0,125', '0,375', '0,625', '0,875', '1,25', '1,5', '2,5', '1,75', '0,64', '0,08', '0,48', '0,024'],
};

function buildToFraction(rng, level) {
  const raw = dec(rng.pick(TO_FRACTION[level === 3 ? 3 : 2]));
  const s = simplify(raw);
  const steps = [`${D(raw)} = ${raw.n}/${raw.d} (${raw.d === 10 ? 'décimas' : raw.d === 100 ? 'centésimas' : 'milésimas'}).`];
  if (s.d !== raw.d) steps.push(`Simplifica: ${raw.n}/${raw.d} = ${F(s)}.`);
  return {
    id: `a-fraccion:${D(raw)}`,
    form: 'a-fraccion',
    answerType: 'fraction',
    mustSimplify: true,
    answer: s,
    expression: `${D(raw)} = □`,
    story: raw.n < raw.d
      ? `🎨 Has pintado ${D(raw)} del mural. ¿Qué fracción es? Dala lo más simplificada que puedas.`
      : `🥞 La receta pide ${D(raw)} kg de harina. Escríbelo como fracción, lo más simplificada que puedas.`,
    hint: `Escríbelo sobre 10, 100 o 1000 según las cifras decimales, y simplifica.`,
    steps,
    frames: [
      frame(`${D(raw)} son ${raw.n} ${raw.d === 10 ? 'décimas' : raw.d === 100 ? 'centésimas' : 'milésimas'}: ${raw.n}/${raw.d}.`, { kind: 'calc', lines: [`${D(raw)} = ${raw.n}/${raw.d}`] }),
      ...(s.d !== raw.d ? [frame(`Simplificamos: ${raw.n}/${raw.d} = ${F(s)}.`, { kind: 'calc', lines: [`${raw.n}/${raw.d} = ${F(s)}`] })] : []),
    ],
    hintFrames: [frame(`¿Cuántas cifras decimales tiene ${D(raw)}?`, { kind: 'calc', lines: [D(raw)] })],
  };
}

const TYPE_POOL = [fr(1, 3), fr(2, 3), fr(1, 9), fr(5, 9), fr(4, 11), fr(1, 7), fr(1, 6), fr(5, 6), fr(7, 12), fr(1, 15), fr(7, 30), fr(3, 4), fr(2, 5), fr(7, 8), fr(9, 20), fr(3, 25)];

function buildType(rng) {
  const f = rng.pick(TYPE_POOL);
  const type = decimalType(f);
  const shown = firstDigits(f);
  const why = {
    exacto: 'La división acaba: es un decimal exacto.',
    'periodico-puro': 'Justo detrás de la coma se repite siempre lo mismo: es periódico puro.',
    'periodico-mixto': 'Hay alguna cifra que no se repite antes de las que se repiten: es periódico mixto.',
  }[type];
  return {
    id: `tipo:${F(f)}`,
    form: 'tipo',
    answerType: 'choice',
    choices: Object.values(TYPES),
    answer: TYPES[type],
    expression: `${F(f)} → □`,
    story: `🔁 Divide ${f.n} entre ${f.d}. ¿Qué tipo de decimal sale?`,
    hint: 'Haz la división unas cuantas cifras: ¿acaba, se repite desde el principio o se repite después de alguna cifra?',
    steps: [`${f.n} ÷ ${f.d} = ${type === 'exacto' ? D(f) : shown}`, why],
    frames: [
      frame(`Dividimos ${f.n} entre ${f.d}: sale ${type === 'exacto' ? D(f) : shown}`, { kind: 'calc', lines: [`${f.n} ÷ ${f.d} = ${type === 'exacto' ? D(f) : shown}`] }),
      frame(why, { kind: 'calc', lines: [type === 'exacto' ? D(f) : shown, TYPES[type]] }),
    ],
    hintFrames: [frame(`Haz la división ${f.n} entre ${f.d} y mira qué cifras salen.`, { kind: 'calc', lines: [`${f.n} ÷ ${f.d} = ?`] })],
  };
}

function roundFrames(value, places) {
  const step = { n: 1, d: 10 ** places };
  const low = roundTo({ n: Math.floor((value.n * 10 ** places) / value.d), d: 10 ** places }, places);
  const high = { n: low.n * (step.d / low.d) + 1, d: step.d };
  const result = roundTo(value, places);
  const next = Math.floor((value.n * 10 ** (places + 1)) / value.d) % 10;
  return {
    result,
    next,
    frames: [
      frame(`${D(value)} está entre ${D(low)} y ${D(high)}.`, roundView(D(low), D(high), D(value))),
      frame(`Miramos la cifra siguiente: es un ${next}. ${next >= 5 ? 'Como es 5 o más, subimos' : 'Como es menos de 5, se queda'}: ${D(result)}.`, roundView(D(low), D(high), D(value), D(result))),
    ],
  };
}

function buildRound(rng, level) {
  const places = level === 1 ? rng.int(0, 1) : rng.int(0, 2);
  const value = randomDecimal(rng, 0, 50, places + rng.int(1, 2));
  const { result, next, frames } = roundFrames(value, places);
  const context = rng.pick([
    `⏱️ Tu tiempo en la carrera ha sido ${D(value)} s.`,
    `💶 Una cuenta sale a ${D(value)} €.`,
    `📏 Tu salto mide ${D(value)} m.`,
  ]);
  return {
    id: `redondear:${D(value)}:${places}`,
    form: 'redondear',
    answerType: 'decimal',
    answer: result,
    expression: `${D(value)} ≈ □`,
    story: `${context} Redondéalo a ${TO[places]}.`,
    hint: `Mira la cifra que va justo después de ${TO[places]}: si es 5 o más, se sube una ${NAMES[places]}; si es menos, se deja igual.`,
    steps: [`La cifra siguiente a ${TO[places]} es ${next}.`, `${next >= 5 ? 'Es 5 o más: subimos.' : 'Es menos de 5: se queda igual.'} ${D(value)} ≈ ${D(result)}.`],
    frames,
    hintFrames: frames.slice(0, 1),
  };
}

function buildError(rng) {
  const places = rng.int(0, 1);
  const value = randomDecimal(rng, 1, 20, places + 2);
  const { result, frames } = roundFrames(value, places);
  const err = distance(value, result);
  const width = Math.max(2, places + 2);
  return {
    id: `error:${D(value)}:${places}`,
    form: 'error',
    answerType: 'decimal',
    answer: err,
    expression: `|${D(value)} − ${D(result)}| = □`,
    story: `🏃‍♀️ El cronómetro marca ${D(value)} s y en la tabla lo apuntan redondeado a ${TO[places]}: ${D(result)} s. ¿Cuál es el error absoluto?`,
    hint: 'El error absoluto es la diferencia entre el valor exacto y el aproximado, siempre en positivo: resta el menor del mayor.',
    steps: [`Error absoluto = |valor exacto − valor aproximado|.`, `|${padTo(D(value), width)} − ${padTo(D(result), width)}| = ${D(err)}.`],
    frames: [
      ...frames.slice(-1),
      frame(`El error es la distancia entre los dos: ${D(err)}.`, { kind: 'calc', lines: [`|${D(value)} − ${D(result)}| = ${D(err)}`] }),
    ],
    hintFrames: [frame('El error absoluto es la distancia entre el valor exacto y el redondeado.', roundView(D(value), D(result), D(value)))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'a-decimal' ? buildToDecimal(rng, cfg.dens)
    : form === 'a-fraccion' ? buildToFraction(rng, level)
      : form === 'tipo' ? buildType(rng)
        : form === 'redondear' ? buildRound(rng, level)
          : buildError(rng);
  return { topicId: TOPIC_ID, level, theme: 'decimal', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Una fracción es una división',
    paragraphs: [
      '3/4 es 3 entre 4: 0,75. Y al revés, 0,75 son 75 centésimas: 75/100, que simplificada es 3/4.',
      'A veces la división no acaba: 1/3 = 0,333… Eso es un decimal periódico. Si se repite justo detrás de la coma es puro (0,333…) y si antes hay alguna cifra que no se repite, mixto (0,1666…).',
    ],
    frames: [
      frame('3/4 es 3 entre 4.', fractionView([bar(fr(3, 4))], [], '3 ÷ 4')),
      frame('3 ÷ 4 = 0,75.', { kind: 'calc', lines: ['3 ÷ 4 = 0,75', '3/4 = 0,75'] }),
      frame('1 ÷ 3 no acaba nunca: 0,333… Es periódico puro.', { kind: 'calc', lines: ['1 ÷ 3 = 0,333…'] }),
    ],
  },
  {
    title: 'Redondear',
    paragraphs: [
      'Para redondear, mira la cifra siguiente a la que quieres dejar: si es 5 o más, súbela; si es menos de 5, déjala igual.',
      '3,47 redondeado a las décimas es 3,5. El error absoluto es la distancia entre el valor exacto y el redondeado: |3,47 − 3,5| = 0,03.',
    ],
    frames: roundFrames({ n: 347, d: 100 }, 1).frames,
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Fracción, decimal y redondeo',
  emoji: '🎯',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
