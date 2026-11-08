// Tema: multiplicar y dividir decimales: por 10, 100 y 1000 (la coma se
// mueve), por un entero, entre un entero y, en el nivel Pro, decimal por
// decimal y entre un decimal.

import { div, mul } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, D, generator, LEVEL_NAMES, placesOf, randomDecimal } from './decimales-comun.js';

const TOPIC_ID = 'decimales-mult-div';

export const FORMS = {
  'por-10': 'Por y entre 10, 100 y 1000',
  'por-entero': 'Decimal por entero (2,35 × 4)',
  'entre-entero': 'Decimal entre entero (7,5 ÷ 3)',
  'por-decimal': 'Decimal por decimal (1,2 × 0,3)',
  'entre-decimal': 'Entre un decimal (4,5 ÷ 0,5)',
};

const LEVELS = {
  1: { forms: [['por-10', 3], ['por-entero', 2]] },
  2: { forms: [['por-10', 1], ['por-entero', 2], ['entre-entero', 3]] },
  3: { forms: [['por-decimal', 3], ['entre-decimal', 3], ['entre-entero', 1]] },
};

const ZEROS = { 10: 'un cero', 100: 'dos ceros', 1000: 'tres ceros' };
const PLACES = { 10: 1, 100: 2, 1000: 3 };
const integerOf = (f) => (f.n * 10 ** placesOf(f)) / f.d;
/** Un entero con la coma puesta a `places` cifras del final: (100, 1) → «10,0». */
const withComma = (value, places) => {
  if (places === 0) return String(value);
  const digits = String(value).padStart(places + 1, '0');
  return `${digits.slice(0, -places)},${digits.slice(-places)}`;
};

function buildPow10(rng) {
  const k = rng.pick([10, 100, 1000]);
  const times = rng.next() < 0.55;
  const a = randomDecimal(rng, 0, 99, rng.int(1, 3));
  const result = times ? mul(a, { n: k, d: 1 }) : div(a, { n: k, d: 1 });
  const op = times ? '×' : '÷';
  const dir = times ? 'a la derecha' : 'a la izquierda';
  const story = times
    ? `📦 Un paquete de pegatinas cuesta ${D(a)} €. ¿Cuánto cuestan ${k} paquetes?`
    : `🍫 Una caja de ${D(a)} kg de chocolate se reparte en ${k} bolsitas iguales. ¿Cuántos kg lleva cada una?`;
  return {
    id: `por-10:${D(a)}${op}${k}`,
    form: 'por-10',
    answerType: 'decimal',
    answer: result,
    expression: `${D(a)} ${op} ${k}`,
    story,
    hint: `${times ? 'Multiplicar' : 'Dividir'} entre ${k} es mover la coma ${PLACES[k]} ${PLACES[k] === 1 ? 'lugar' : 'lugares'} ${dir}. Si faltan cifras, añade ceros.`,
    steps: [`${k} tiene ${ZEROS[k]}: la coma se mueve ${PLACES[k]} ${PLACES[k] === 1 ? 'lugar' : 'lugares'} ${dir}.`, `${D(a)} ${op} ${k} = ${D(result)}.`],
    frames: [
      frame(`${k} tiene ${ZEROS[k]}, así que la coma salta ${PLACES[k]} ${PLACES[k] === 1 ? 'lugar' : 'lugares'} ${dir}.`, { kind: 'shift', from: D(a), to: D(result), dir: times ? 1 : -1, places: PLACES[k] }),
      frame(`${D(a)} ${op} ${k} = ${D(result)}.`, { kind: 'calc', lines: [`${D(a)} ${op} ${k} = ${D(result)}`] }),
    ],
    hintFrames: [frame(`¿Hacia dónde salta la coma al ${times ? 'multiplicar' : 'dividir'}?`, { kind: 'shift', from: D(a), to: null, dir: times ? 1 : -1, places: PLACES[k] })],
  };
}

function productFrames(a, b, result) {
  const ia = integerOf(a);
  const ib = integerOf(b);
  const pa = placesOf(a);
  const pb = placesOf(b);
  const total = pa + pb;
  return [
    frame(`Primero multiplicamos sin comas: ${ia} × ${ib} = ${ia * ib}.`, { kind: 'calc', lines: [`${ia} × ${ib} = ${ia * ib}`] }),
    frame(`Contamos las cifras decimales: ${pa}${pb ? ` + ${pb}` : ''} = ${total}. El resultado lleva ${total} ${total === 1 ? 'cifra decimal' : 'cifras decimales'}.`,
      { kind: 'calc', lines: [`${D(a)} → ${pa}`, ...(pb ? [`${D(b)} → ${pb}`] : []), `${ia * ib} → ${withComma(ia * ib, total)}${withComma(ia * ib, total) === D(result) ? '' : ` = ${D(result)}`}`] }),
    frame(`${D(a)} × ${D(b)} = ${D(result)}.`, { kind: 'calc', lines: [`${D(a)} × ${D(b)} = ${D(result)}`] }),
  ];
}

function buildTimes(rng, form) {
  const a = form === 'por-entero' ? randomDecimal(rng, 0, 30, rng.int(1, 2)) : randomDecimal(rng, 0, 9, 1);
  const b = form === 'por-entero' ? { n: rng.int(2, 9), d: 1 } : randomDecimal(rng, 0, rng.next() < 0.5 ? 1 : 5, 1);
  const result = mul(a, b);
  const story = form === 'por-entero'
    ? `🎧 Cada canción de tu playlist de trap ocupa ${D(a)} MB. ¿Cuánto ocupan ${D(b)} canciones?`
    : `🎨 Vais a pintar un mural en una pared de ${D(a)} m de largo y ${D(b)} m de alto. ¿Cuántos m² mide?`;
  const frames = productFrames(a, b, result);
  return {
    id: `${form}:${D(a)}×${D(b)}`,
    form,
    answerType: 'decimal',
    answer: result,
    expression: `${D(a)} × ${D(b)}`,
    story,
    hint: 'Multiplica como si no hubiera comas y luego pon tantas cifras decimales como tengan los dos números juntos.',
    steps: [
      `Sin comas: ${integerOf(a)} × ${integerOf(b)} = ${integerOf(a) * integerOf(b)}.`,
      `Cifras decimales: ${placesOf(a) + placesOf(b)}. Resultado: ${D(result)}.`,
    ],
    frames,
    hintFrames: frames.slice(0, 1),
  };
}

function buildDivide(rng, form) {
  if (form === 'entre-entero') {
    const b = rng.int(2, 9);
    const result = randomDecimal(rng, 0, 20, rng.int(1, 2));
    const a = mul(result, { n: b, d: 1 });
    return {
      id: `entre-entero:${D(a)}÷${b}`,
      form,
      answerType: 'decimal',
      answer: result,
      expression: `${D(a)} ÷ ${b}`,
      story: `🍕 Entre ${b} amigas pagáis una cuenta de ${D(a)} € a partes iguales. ¿Cuánto paga cada una?`,
      hint: 'Divide como siempre y, al llegar a la coma del dividendo, pon la coma en el cociente.',
      steps: [`Divide ${D(a)} entre ${b} como con enteros.`, `Cuando bajes la primera cifra decimal, pon la coma en el cociente: ${D(result)}.`],
      frames: [
        frame(`Dividimos ${D(a)} entre ${b}. Al pasar la coma del dividendo, ponemos la coma en el cociente.`, { kind: 'calc', lines: [`${D(a)} ÷ ${b}`, `${D(result)} × ${b} = ${D(a)}`] }),
        frame(`${D(a)} ÷ ${b} = ${D(result)}. Comprobamos: ${D(result)} × ${b} = ${D(a)}.`, { kind: 'calc', lines: [`${D(a)} ÷ ${b} = ${D(result)}`] }),
      ],
      hintFrames: [frame('Divide como siempre y pon la coma cuando llegues a ella.', { kind: 'calc', lines: [`${D(a)} ÷ ${b}`] })],
    };
  }
  // Entre un decimal: se multiplican los dos por 10 o 100 para quitar la coma del divisor.
  const b = randomDecimal(rng, 0, 3, rng.next() < 0.7 ? 1 : 2);
  const q = { n: rng.int(2, 30), d: 1 };
  const a = mul(b, q);
  const k = 10 ** placesOf(b);
  const a2 = mul(a, { n: k, d: 1 });
  const b2 = mul(b, { n: k, d: 1 });
  return {
    id: `entre-decimal:${D(a)}÷${D(b)}`,
    form,
    answerType: 'decimal',
    answer: q,
    expression: `${D(a)} ÷ ${D(b)}`,
    story: `🎀 Tienes ${D(a)} m de cinta y cortas trozos de ${D(b)} m para decorar cartas. ¿Cuántos trozos salen?`,
    hint: `Quita la coma del divisor: multiplica los dos números por ${k}.`,
    steps: [`Multiplica los dos por ${k}: ${D(a)} ÷ ${D(b)} = ${D(a2)} ÷ ${D(b2)}.`, `${D(a2)} ÷ ${D(b2)} = ${D(q)}.`],
    frames: [
      frame(`El divisor tiene coma. Multiplicamos los dos por ${k} y la división no cambia.`, { kind: 'calc', lines: [`${D(a)} ÷ ${D(b)}`, `${D(a2)} ÷ ${D(b2)}`] }),
      frame(`${D(a2)} ÷ ${D(b2)} = ${D(q)}.`, { kind: 'calc', lines: [`${D(a)} ÷ ${D(b)} = ${D(q)}`] }),
    ],
    hintFrames: [frame(`Multiplica dividendo y divisor por ${k}.`, { kind: 'calc', lines: [`${D(a)} ÷ ${D(b)}`, `(× ${k})   (× ${k})`] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'por-10' ? buildPow10(rng)
    : form === 'por-entero' || form === 'por-decimal' ? buildTimes(rng, form)
      : buildDivide(rng, form);
  return { topicId: TOPIC_ID, level, theme: 'decimal', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Por 10, 100 y 1000',
    paragraphs: [
      'Multiplicar por 10, 100 o 1000 es mover la coma a la derecha tantos lugares como ceros: 3,47 × 100 = 347.',
      'Dividir es moverla a la izquierda: 3,47 ÷ 10 = 0,347.',
    ],
    frames: [
      frame('3,47 × 100: la coma salta 2 lugares a la derecha.', { kind: 'shift', from: '3,47', to: '347', dir: 1, places: 2 }),
      frame('3,47 ÷ 10: la coma salta 1 lugar a la izquierda.', { kind: 'shift', from: '3,47', to: '0,347', dir: -1, places: 1 }),
    ],
  },
  {
    title: 'Multiplicar y dividir',
    paragraphs: [
      'Para multiplicar, hazlo sin comas y luego pon tantas cifras decimales como tengan los dos números: 1,2 × 0,3 → 12 × 3 = 36 → 0,36.',
      'Para dividir entre un decimal, multiplica los dos por 10 o 100 hasta que el divisor no tenga coma.',
    ],
    frames: productFrames({ n: 12, d: 10 }, { n: 3, d: 10 }, { n: 36, d: 100 }),
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Multiplicar y dividir decimales',
  emoji: '✖️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
