// Tema: probabilidad. Experimentos aleatorios, espacio muestral y regla de
// Laplace (con la probabilidad como fracción).

import { fr, simplify } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES } from './estadistica-comun.js';
import { F } from './fracciones-comun.js';

const TOPIC_ID = 'probabilidad';

export const FORMS = {
  aleatorio: 'Aleatorio o determinista',
  'espacio-muestral': 'Casos posibles',
  laplace: 'Regla de Laplace',
};

const LEVELS = {
  1: { forms: [['aleatorio', 3], ['espacio-muestral', 3]] },
  2: { forms: [['espacio-muestral', 1], ['laplace', 4]] },
  3: { forms: [['laplace', 4], ['aleatorio', 1]] },
};

const EXPERIMENTS = [
  { text: 'Lanzar un dado y ver qué número sale', random: true },
  { text: 'Sacar una carta de una baraja sin mirar', random: true },
  { text: 'Lanzar una moneda al aire', random: true },
  { text: 'Elegir sin mirar un caramelo de una bolsa con varios sabores', random: true },
  { text: 'Soltar una pelota y ver si cae al suelo', random: false },
  { text: 'Calentar agua a 100 °C y ver si hierve', random: false },
  { text: 'Sumar 2 + 3 y ver cuánto da', random: false },
  { text: 'Mirar si mañana sale el sol por el este', random: false },
];

// Situaciones de Laplace: casos posibles y una lista de sucesos con sus casos favorables.
function situation(rng) {
  const kind = rng.pick(['dado', 'bolsa', 'ruleta', 'letras']);
  if (kind === 'dado') {
    const ev = rng.pick([
      { text: 'que salga un 6', fav: 1 }, { text: 'que salga un número par', fav: 3 }, { text: 'que salga más de 4', fav: 2 },
      { text: 'que salga un múltiplo de 3', fav: 2 }, { text: 'que salga menos de 5', fav: 4 }, { text: 'que salga un número primo', fav: 3 },
    ]);
    return { story: `🎲 Lanzas un dado. ¿Cuál es la probabilidad de ${ev.text}?`, total: 6, fav: ev.fav, favText: ev.text, totalText: '6 caras' };
  }
  if (kind === 'bolsa') {
    const pink = rng.int(1, 6);
    const black = rng.int(1, 6);
    const white = rng.int(0, 4);
    const total = pink + black + white;
    const which = rng.pick(['rosa', 'negra']);
    const fav = which === 'rosa' ? pink : black;
    return {
      story: `🎱 En una bolsa hay ${pink} bolas rosas, ${black} negras${white ? ` y ${white} blancas` : ''}. Sacas una sin mirar. ¿Probabilidad de que sea ${which}?`,
      total, fav, favText: `bolas ${which === 'rosa' ? 'rosas' : 'negras'}`, totalText: `${total} bolas`,
    };
  }
  if (kind === 'ruleta') {
    const sectors = rng.pick([4, 5, 8, 10]);
    const fav = rng.int(1, sectors - 1);
    return { story: `🎡 Una ruleta tiene ${sectors} partes iguales y ${fav} son de color rosa. ¿Probabilidad de que caiga en rosa?`, total: sectors, fav, favText: 'partes rosas', totalText: `${sectors} partes` };
  }
  const word = rng.pick(['VOLEY', 'CREPES', 'PATINAR', 'ZOMBIS', 'GATITO']);
  const letter = rng.pick([...new Set(word)]);
  const fav = [...word].filter((c) => c === letter).length;
  return { story: `🔤 Escribes cada letra de la palabra ${word} en un papelito y sacas uno sin mirar. ¿Probabilidad de sacar una ${letter}?`, total: word.length, fav, favText: `letras ${letter}`, totalText: `${word.length} letras` };
}

function buildRandom(rng) {
  const e = rng.pick(EXPERIMENTS);
  const answer = e.random ? 'Aleatorio' : 'Determinista';
  return {
    id: `aleatorio:${e.text}`,
    form: 'aleatorio',
    answerType: 'choice',
    choices: ['Aleatorio', 'Determinista'],
    answer,
    expression: '□',
    story: `🎲 «${e.text}». ¿Es un experimento aleatorio o determinista?`,
    hint: 'Aleatorio: no se puede saber qué va a pasar antes de hacerlo. Determinista: siempre pasa lo mismo.',
    steps: [e.random ? 'No sabes qué va a salir: es aleatorio.' : 'Siempre pasa lo mismo: es determinista.'],
    frames: [frame(e.random ? 'Antes de hacerlo no se sabe qué va a salir: es aleatorio.' : 'Se sabe de antemano qué va a pasar: es determinista.', { kind: 'calc', lines: ['aleatorio → no se sabe (dado, moneda)', 'determinista → siempre igual'] })],
    hintFrames: [frame('¿Puedes saber el resultado antes?', { kind: 'calc', lines: ['sí → determinista', 'no → aleatorio'] })],
  };
}

function buildSpace(rng) {
  const options = [
    { story: '🪙 Lanzas una moneda. ¿Cuántos resultados posibles hay?', n: 2, list: 'cara, cruz' },
    { story: '🎲 Lanzas un dado. ¿Cuántos resultados posibles hay?', n: 6, list: '1, 2, 3, 4, 5, 6' },
    { story: '🪙🪙 Lanzas dos monedas. ¿Cuántos resultados posibles hay?', n: 4, list: 'CC, CX, XC, XX' },
    { story: '📅 Eliges al azar un día de la semana. ¿Cuántos resultados posibles hay?', n: 7, list: 'lunes … domingo' },
    { story: '🍬 En una bolsa hay caramelos de fresa, limón, menta y cola. Sacas uno. ¿Cuántos sabores pueden salir?', n: 4, list: 'fresa, limón, menta, cola' },
  ];
  const o = rng.pick(options);
  return {
    id: `espacio:${o.n}:${o.list}`,
    form: 'espacio-muestral',
    answerType: 'integer',
    answer: o.n,
    expression: 'casos posibles = □',
    story: o.story,
    hint: 'El espacio muestral son todos los resultados que pueden salir. Escríbelos todos y cuéntalos.',
    steps: [`Posibles: ${o.list}.`, `Son ${o.n}.`],
    frames: [frame(`Los resultados posibles son: ${o.list}. Son ${o.n}.`, { kind: 'calc', lines: [`E = { ${o.list} }`, `${o.n} casos`] })],
    hintFrames: [frame('Escribe todos los resultados posibles.', { kind: 'calc', lines: ['E = { … }'] })],
  };
}

function buildLaplace(rng) {
  const sit = situation(rng);
  const p = simplify(fr(sit.fav, sit.total));
  return {
    id: `laplace:${sit.story}`,
    form: 'laplace',
    answerType: 'fraction',
    answer: p,
    expression: 'P = □',
    story: sit.story,
    hint: 'Regla de Laplace: casos favorables entre casos posibles.',
    steps: [`Favorables: ${sit.fav} (${sit.favText}). Posibles: ${sit.total} (${sit.totalText}).`, `P = ${sit.fav}/${sit.total}${F(p) !== `${sit.fav}/${sit.total}` ? ` = ${F(p)}` : ''}.`],
    frames: [
      frame('La probabilidad es casos favorables entre casos posibles.', { kind: 'calc', lines: ['P = favorables / posibles'] }),
      frame(`Favorables: ${sit.fav}. Posibles: ${sit.total}. La probabilidad es ${sit.fav}/${sit.total}${F(p) !== `${sit.fav}/${sit.total}` ? `, que simplificada es ${F(p)}` : ''}.`, { kind: 'calc', lines: [`P = ${sit.fav}/${sit.total}${F(p) !== `${sit.fav}/${sit.total}` ? ` = ${F(p)}` : ''}`] }),
    ],
    hintFrames: [frame('Cuenta los casos favorables y los posibles.', { kind: 'calc', lines: ['P = favorables / posibles'] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'aleatorio' ? buildRandom(rng) : form === 'espacio-muestral' ? buildSpace(rng) : buildLaplace(rng);
  return { topicId: TOPIC_ID, level, theme: 'estadistica', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Probabilidad',
    paragraphs: [
      'Un experimento es aleatorio si no se puede saber el resultado antes (lanzar un dado). El espacio muestral son todos los resultados posibles: {1, 2, 3, 4, 5, 6}.',
      'Regla de Laplace: probabilidad = casos favorables ÷ casos posibles. Que salga par en un dado: 3/6 = 1/2.',
    ],
    frames: [
      frame('En un dado hay 6 resultados posibles.', { kind: 'calc', lines: ['E = { 1, 2, 3, 4, 5, 6 }'] }),
      frame('Que salga par: 2, 4 y 6. Son 3 de 6: la probabilidad es 3/6, o sea, 1/2.', { kind: 'calc', lines: ['P(par) = 3/6 = 1/2'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Probabilidad',
  emoji: '🎲',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
