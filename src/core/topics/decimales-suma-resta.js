// Tema: sumar y restar decimales colocando las comas en columna. En el nivel
// Pro, compras con cambio (dos pasos).

import { add, compare, sub } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, columnsView, D, generator, LEVEL_NAMES, padTo, placesOf, randomDecimal } from './decimales-comun.js';

const TOPIC_ID = 'decimales-suma-resta';
const MINUS = '−';

export const FORMS = {
  sumar: 'Sumar decimales (3,5 + 1,27)',
  restar: 'Restar decimales (5,2 − 1,75)',
  cambio: 'Compras con cambio (dos pasos)',
};

const LEVELS = {
  1: { forms: [['sumar', 3], ['restar', 2]], places: [[1, 1], [2, 2]], max: 20 },
  2: { forms: [['sumar', 2], ['restar', 3]], places: [[1, 2], [2, 1], [2, 2], [0, 2], [2, 0]], max: 50 },
  3: { forms: [['cambio', 3], ['restar', 2], ['sumar', 1]], places: [[1, 3], [3, 1], [2, 3], [0, 2]], max: 100 },
};

// Cada historia con su tope y las cifras decimales que tienen sentido
// (no hay precios con milésimas).
const SUM_STORIES = [
  { max: 100, places: 2, text: (a, b) => `🎧 Descargas una canción de ${D(a)} MB y otra de ${D(b)} MB. ¿Cuántos MB ocupan?` },
  { max: 20, places: 2, text: (a, b) => `🥞 Pides crepes por ${D(a)} € y batidos por ${D(b)} €. ¿Cuánto pagas?` },
  { max: 50, places: 3, text: (a, b) => `🚲 El sábado haces ${D(a)} km en bici y el domingo ${D(b)} km. ¿Cuántos km haces?` },
  { max: 10, places: 3, text: (a, b) => `🍓 Compras ${D(a)} kg de fresas y ${D(b)} kg de plátanos. ¿Cuántos kg llevas?` },
];
const SUB_STORIES = [
  { max: 50, places: 2, text: (a, b) => `💳 Tienes ${D(a)} € en la tarjeta del móvil y gastas ${D(b)} € en un juego. ¿Cuánto te queda?` },
  { max: 20, places: 2, text: (a, b) => `🎨 Tenías ${D(a)} m de cinta para las cartas y usas ${D(b)} m. ¿Cuánta cinta te queda?` },
  { max: 100, places: 3, text: (a, b) => `🏃‍♀️ Una carrera solidaria mide ${D(a)} km y ya llevas ${D(b)} km. ¿Cuántos km te faltan?` },
  { max: 5, places: 3, text: (a, b) => `🧃 Hay ${D(a)} litros de zumo y os bebéis ${D(b)} litros. ¿Cuánto zumo queda?` },
];
const SHOP = [
  ['un batido', 'un crepe'], ['un cuaderno', 'unos rotuladores'], ['unas rodilleras de vóley', 'una botella'], ['unas pegatinas de Hello Kitty', 'un estuche'],
];

/** Fotogramas de una suma o resta en columna. */
function columnFrames(a, b, op, result) {
  const places = Math.max(placesOf(a), placesOf(b), placesOf(result));
  const lines = [padTo(D(a), places), padTo(D(b), places)];
  const symbol = op === '+' ? '+' : MINUS;
  const verb = op === '+' ? 'Sumamos' : 'Restamos';
  const frames = [frame(`Colocamos los números con las comas en columna: unidades debajo de unidades, décimas debajo de décimas.`, columnsView([D(a), D(b)], symbol))];
  if (lines[0] !== D(a) || lines[1] !== D(b)) {
    frames.push(frame('Rellenamos con ceros los huecos para que los dos tengan las mismas cifras decimales.', columnsView(lines, symbol)));
  }
  frames.push(frame(`${verb} como si no hubiera coma, y la coma del resultado baja en su columna: ${padTo(D(result), places)}.`, columnsView(lines, symbol, padTo(D(result), places))));
  frames.push(frame(`${D(a)} ${symbol} ${D(b)} = ${D(result)}.`, { kind: 'calc', lines: [`${D(a)} ${symbol} ${D(b)} = ${D(result)}`] }));
  return frames;
}

function buildOp(rng, cfg, op) {
  const [pa, pb] = rng.pick(cfg.places);
  const fitting = (op === '+' ? SUM_STORIES : SUB_STORIES).filter((st) => st.places >= Math.max(pa, pb));
  const st = rng.pick(fitting);
  const max = Math.min(cfg.max, st.max);
  let a = randomDecimal(rng, 0, max, pa);
  let b = randomDecimal(rng, 0, Math.max(1, Math.floor(max / 2)), pb);
  if (op === '-' && compare(a, b) <= 0) [a, b] = [add(a, b), a];
  if (op === '+' && compare(add(a, b), { n: st.max, d: 1 }) > 0) b = randomDecimal(rng, 0, 1, pb);
  const result = op === '+' ? add(a, b) : sub(a, b);
  const symbol = op === '+' ? '+' : MINUS;
  const frames = columnFrames(a, b, op, result);
  const story = st.text(a, b);
  const padHint = placesOf(a) !== placesOf(b) ? ' Si uno tiene menos cifras decimales, rellénalo con ceros.' : '';
  return {
    id: `${op}:${D(a)}:${D(b)}`,
    form: op === '+' ? 'sumar' : 'restar',
    answerType: 'decimal',
    answer: result,
    expression: `${D(a)} ${symbol} ${D(b)}`,
    story,
    hint: `Pon las comas una debajo de otra.${padHint}`,
    steps: [
      'Coloca los números con las comas en columna.',
      ...(padHint ? ['Rellena con ceros: así las dos tienen las mismas cifras decimales.'] : []),
      `${op === '+' ? 'Suma' : 'Resta'} como con enteros y baja la coma: ${D(a)} ${symbol} ${D(b)} = ${D(result)}.`,
    ],
    frames,
    hintFrames: frames.slice(0, frames.length - 2),
  };
}

function buildChange(rng) {
  const [x, y] = rng.pick(SHOP);
  const a = randomDecimal(rng, 1, 6, 2);
  const b = randomDecimal(rng, 1, 6, 2);
  const total = add(a, b);
  const paid = { n: total.n <= 1000 ? 10 : 20, d: 1 };
  const change = sub(paid, total);
  return {
    id: `cambio:${D(a)}:${D(b)}`,
    form: 'cambio',
    answerType: 'decimal',
    answer: change,
    expression: `${D(paid)} ${MINUS} (${D(a)} + ${D(b)}) = □`,
    story: `🛍️ Compras ${x} de ${D(a)} € y ${y} de ${D(b)} €. Pagas con un billete de ${D(paid)} €. ¿Cuánto te devuelven?`,
    hint: `Primero suma lo que cuesta todo; luego réstalo de ${D(paid)} € (que es ${D(paid)},00).`,
    steps: [
      `Total: ${D(a)} + ${D(b)} = ${D(total)} €.`,
      `Cambio: ${D(paid)},00 ${MINUS} ${padTo(D(total), 2)} = ${D(change)} €.`,
    ],
    frames: [
      ...columnFrames(a, b, '+', total).slice(-2),
      frame(`Ahora el cambio: ${D(paid)} es ${D(paid)},00 y le restamos ${padTo(D(total), 2)}.`, columnsView([`${D(paid)},00`, padTo(D(total), 2)], MINUS, padTo(D(change), 2))),
      frame(`Te devuelven ${D(change)} €.`, { kind: 'calc', lines: [`${D(paid)} ${MINUS} ${D(total)} = ${D(change)}`] }),
    ],
    hintFrames: columnFrames(a, b, '+', total).slice(0, 1),
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'cambio' ? buildChange(rng) : buildOp(rng, cfg, form === 'sumar' ? '+' : '-');
  return { topicId: TOPIC_ID, level, theme: 'decimal', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Las comas, en columna',
    paragraphs: [
      'Para sumar o restar decimales, pon las comas una debajo de la otra: unidades con unidades y décimas con décimas.',
      'Si un número tiene menos cifras decimales, rellénalo con ceros (5,2 es 5,20). Luego opera como con enteros y baja la coma.',
    ],
    frames: columnFrames({ n: 52, d: 10 }, { n: 175, d: 100 }, '-', { n: 345, d: 100 }),
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Sumar y restar decimales',
  emoji: '🧾',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
