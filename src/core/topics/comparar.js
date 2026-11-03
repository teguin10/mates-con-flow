// Tema: comparar y ordenar enteros, opuesto y valor absoluto. Las
// comparaciones se responden con botones (answerType 'choice').

import { formatInteger as f } from '../math/answer.js';
import { frame, orientationOf, rangeOf } from '../explain/storyboard.js';

const TOPIC_ID = 'enteros-comparar';
const MINUS = '−';

export const FORMS = {
  comparar: `Comparar dos números (${MINUS}5 □ ${MINUS}2)`,
  'mayor-menor': 'El mayor o el menor de varios',
  opuesto: `El opuesto (${MINUS}7 → 7)`,
  'valor-absoluto': `Valor absoluto (|${MINUS}9| = 9)`,
};

const LEVELS = {
  1: { range: 10, count: 3, forms: [['comparar', 4], ['opuesto', 2]] },
  2: { range: 20, count: 3, forms: [['comparar', 2], ['mayor-menor', 3], ['valor-absoluto', 2], ['opuesto', 1]] },
  3: { range: 50, count: 4, forms: [['comparar', 2], ['mayor-menor', 3], ['valor-absoluto', 2]] },
};

export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };
const COMPARE_CHOICES = ['<', '=', '>'];
const WORDS = { '<': 'es menor que', '>': 'es mayor que', '=': 'es igual a' };

const COMPARE_STORIES = [
  { theme: 'termometro', text: (a, b) => `🌡️ En una casa encantada hay ${f(a)} °C y en otra ${f(b)} °C. ¿Qué signo va entre las dos temperaturas?` },
  { theme: 'edificio', text: (a, b) => `🧟 Tu amiga se esconde de los zombis en el piso ${f(a)} y tú en el ${f(b)}. ¿Qué signo va entre los dos pisos?` },
  { theme: 'voley', text: (a, b) => `🏐 En el torneo de vóley, un equipo tiene una diferencia de ${f(a)} y el otro de ${f(b)}. ¿Qué signo va entre las dos?` },
  { theme: 'obby', text: (a, b) => `🧱 En el obby de Roblox, tu avatar está a ${f(a)} metros y el de tu amiga a ${f(b)}. ¿Qué signo va entre las dos alturas?` },
];

const EXTREME_STORIES = [
  { theme: 'termometro', text: (high) => `🌡️ Estas son las temperaturas de las casas de la peli de terror. ¿Cuál es la ${high ? 'más alta' : 'más baja'}?` },
  { theme: 'voley', text: (high) => `🏐 Estas son las diferencias de puntos de los equipos del torneo. ¿Cuál es la ${high ? 'mejor (la mayor)' : 'peor (la menor)'}?` },
  { theme: 'edificio', text: (high) => `🧟 Tus amigas están escondidas en estos pisos del instituto. ¿Cuál es el piso ${high ? 'más alto' : 'más bajo'}?` },
];

const MIRROR_STORIES = [
  (a) => `🪞 En el espejo de la casa encantada todo sale al revés: cada número aparece al otro lado del cero. ¿Qué número sale en el espejo del ${f(a)}?`,
  (a) => `🃏 En tu juego de cartas, la carta del ${f(a)} tiene una gemela que la anula (juntas suman 0). ¿Qué número tiene la gemela?`,
];

const ABS_STORIES = [
  { theme: 'edificio', text: (a) => `🧟 Estás en el piso ${f(a)}. ¿A cuántos pisos estás de la planta baja (el 0)? Eso es el valor absoluto.` },
  { theme: 'termometro', text: (a) => `🌡️ El termómetro marca ${f(a)} °C. ¿A cuántos grados está del 0? Eso es el valor absoluto.` },
  { theme: 'voley', text: (a) => `🏐 Tu equipo tiene una diferencia de ${f(a)}. ¿A cuántos puntos está del empate (0)? Eso es el valor absoluto.` },
];

const steps = (n) => `${n} ${n === 1 ? 'paso' : 'pasos'}`;
const rightWord = (theme) => (orientationOf(theme) === 'vertical' ? 'más arriba' : 'más a la derecha');
const leftWord = (theme) => (orientationOf(theme) === 'vertical' ? 'más abajo' : 'más a la izquierda');

function compareSymbol(a, b) {
  if (a < b) return '<';
  return a > b ? '>' : '=';
}

function buildCompare(rng, range) {
  const a = rng.int(-range, range);
  let b = rng.next() < 0.1 ? a : rng.int(-range, range);
  if (a >= 0 && b >= 0) b = -rng.int(1, range);
  const story = rng.pick(COMPARE_STORIES);
  const answer = compareSymbol(a, b);
  const base = { kind: 'line', theme: story.theme, ...rangeOf([a, b]) };
  const max = Math.max(a, b);
  const hintText = a < 0 && b < 0
    ? `Con negativos, el que está más cerca del cero es el mayor. Piensa en el termómetro: ${f(-1)} °C es más calor que ${f(-10)} °C.`
    : 'En la recta, el número que está más a la derecha (o más arriba) es el mayor. Cualquier positivo es mayor que cualquier negativo.';
  return {
    form: 'comparar',
    answerType: 'choice',
    choices: COMPARE_CHOICES,
    answer,
    expression: `${f(a)} □ ${f(b)}`,
    story: story.text(a, b),
    theme: story.theme,
    hint: hintText,
    steps: [
      `Coloca ${f(a)} y ${f(b)} en la recta.`,
      a === b ? 'Están en el mismo sitio: son iguales.' : `El que está ${rightWord(story.theme)} es el mayor: ${f(max)}.`,
      `Respuesta: ${f(a)} ${answer} ${f(b)} (${f(a)} ${WORDS[answer]} ${f(b)})`,
    ],
    illustration: null,
    frames: [
      frame(`Ponemos ${f(a)} y ${f(b)} en la recta.`, { ...base, phase: 'points', points: [a, b], highlight: null }),
      frame(a === b ? 'Están en el mismo sitio: son iguales.' : `El que está ${rightWord(story.theme)} es el mayor: ${f(max)}.`,
        { ...base, phase: 'points', points: [a, b], highlight: max }),
      frame(`Por eso: ${f(a)} ${WORDS[answer]} ${f(b)}.`, { kind: 'calc', lines: [`${f(a)} ${answer} ${f(b)}`] }),
    ],
    hintFrames: [
      frame(`Ponemos ${f(a)} y ${f(b)} en la recta. ¿Cuál está ${rightWord(story.theme)}?`, { ...base, phase: 'points', points: [a, b], highlight: null }),
    ],
  };
}

function buildExtreme(rng, range, count) {
  // Al menos dos negativos, todos distintos y en orden aleatorio.
  const values = new Set();
  while (values.size < 2) values.add(-rng.int(1, range));
  while (values.size < count) values.add(rng.int(-range, range));
  const unique = [...values];
  for (let i = unique.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  const high = rng.next() < 0.5;
  const answerValue = high ? Math.max(...unique) : Math.min(...unique);
  const story = rng.pick(EXTREME_STORIES);
  const base = { kind: 'line', theme: story.theme, ...rangeOf(unique) };
  const where = high ? rightWord(story.theme) : leftWord(story.theme);
  return {
    form: 'mayor-menor',
    answerType: 'choice',
    choices: unique.map(f),
    answer: f(answerValue),
    expression: `¿Cuál es el ${high ? 'mayor' : 'menor'}?`,
    story: story.text(high),
    theme: story.theme,
    hint: `Imagina los números en la recta: el ${high ? 'mayor' : 'menor'} es el que queda ${where}. Con negativos, cuanto más lejos del cero, más pequeño.`,
    steps: [
      `Coloca ${unique.map(f).join(', ')} en la recta.`,
      `El que está ${where} es el ${high ? 'mayor' : 'menor'}: ${f(answerValue)}.`,
    ],
    illustration: null,
    frames: [
      frame(`Ponemos ${unique.map(f).join(', ')} en la recta.`, { ...base, phase: 'points', points: unique, highlight: null }),
      frame(`El que está ${where} es el ${high ? 'mayor' : 'menor'}: ${f(answerValue)}.`, { ...base, phase: 'points', points: unique, highlight: answerValue }),
    ],
    hintFrames: [
      frame(`Ponemos los números en la recta. ¿Cuál queda ${where}?`, { ...base, phase: 'points', points: unique, highlight: null }),
    ],
  };
}

function buildOpposite(rng, range) {
  const a = (rng.int(1, range)) * (rng.next() < 0.6 ? -1 : 1);
  const n = Math.abs(a);
  const base = { kind: 'line', theme: 'recta', ...rangeOf([a, -a]) };
  return {
    form: 'opuesto',
    answerType: 'integer',
    answer: -a,
    expression: `El opuesto de ${f(a)} es □`,
    story: rng.pick(MIRROR_STORIES)(a),
    theme: 'recta',
    hint: `El opuesto está a la misma distancia del cero, pero al otro lado: solo cambia el signo.`,
    steps: [`${f(a)} está a ${steps(n)} del cero.`, `Al otro lado del cero, a ${steps(n)}, está ${f(-a)}.`, `Resultado: ${f(-a)}`],
    illustration: { ...base, phase: 'points', points: [a], highlight: null },
    frames: [
      frame(`Este es el ${f(a)}.`, { ...base, phase: 'points', points: [a], highlight: null }),
      frame(`Contamos los pasos hasta el cero: ${steps(n)}.`, { ...base, phase: 'move', from: a, to: 0 }),
      frame(`Y damos los mismos ${steps(n)} al otro lado del cero.`, { ...base, phase: 'move', from: 0, to: -a }),
      frame(`El opuesto de ${f(a)} es ${f(-a)}: misma distancia, otro lado. Juntos suman 0.`, { ...base, phase: 'points', points: [a, -a], highlight: -a }),
    ],
    hintFrames: [
      frame(`Este es el ${f(a)}. ¿A cuántos pasos está del cero? El opuesto está a los mismos pasos, al otro lado.`, { ...base, phase: 'points', points: [a], highlight: null }),
    ],
  };
}

function buildAbsolute(rng, range) {
  const a = rng.int(1, range) * (rng.next() < 0.7 ? -1 : 1);
  const n = Math.abs(a);
  const story = rng.pick(ABS_STORIES);
  const base = { kind: 'line', theme: story.theme, ...rangeOf([a]) };
  return {
    form: 'valor-absoluto',
    answerType: 'integer',
    answer: n,
    expression: `|${f(a)}| = □`,
    story: story.text(a),
    theme: story.theme,
    hint: 'El valor absoluto es la distancia al cero: cuenta los pasos hasta el cero. Una distancia nunca es negativa.',
    steps: [`Desde ${f(a)} hasta el 0 hay ${steps(n)}.`, `|${f(a)}| = ${n} (una distancia siempre es positiva).`],
    illustration: { ...base, phase: 'start', from: a },
    frames: [
      frame(`Empezamos en ${f(a)}.`, { ...base, phase: 'start', from: a }),
      frame(`Contamos los pasos hasta el cero.`, { ...base, phase: 'move', from: a, to: 0 }),
      frame(`Hay ${steps(n)}: |${f(a)}| = ${n}. La distancia al cero siempre es positiva.`, { ...base, phase: 'arrive', from: a, to: 0 }),
    ],
    hintFrames: [
      frame(`Empezamos en ${f(a)}. Cuenta los pasos hasta el cero.`, { ...base, phase: 'start', from: a }),
    ],
  };
}

function build(rng, level) {
  const { range, count, forms } = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(forms);
  const exercise = form === 'comparar' ? buildCompare(rng, range)
    : form === 'mayor-menor' ? buildExtreme(rng, range, count)
      : form === 'opuesto' ? buildOpposite(rng, range)
        : buildAbsolute(rng, range);
  const id = `${exercise.form}:${exercise.expression}:${(exercise.choices ?? []).join(',')}`;
  return { id, topicId: TOPIC_ID, level, ...exercise };
}

export function generate(rng, level, recentIds = []) {
  let exercise = build(rng, level);
  for (let tries = 0; tries < 30 && recentIds.includes(exercise.id); tries += 1) exercise = build(rng, level);
  return exercise;
}

export const INTRO = [
  {
    title: '¿Quién es mayor?',
    paragraphs: [
      'En la recta, cuanto más a la derecha (o más arriba en el edificio), más grande es el número.',
      'Por eso cualquier positivo es mayor que cualquier negativo, y el 0 está en medio.',
    ],
    frames: [
      frame('Ponemos −5 y 3 en la recta. El que está más a la derecha es el mayor.', { kind: 'line', theme: 'recta', min: -7, max: 5, phase: 'points', points: [-5, 3], highlight: 3 }),
    ],
  },
  {
    title: 'El truco de los negativos',
    paragraphs: [
      'Con negativos, el que está más cerca del cero es el mayor: −2 es mayor que −5.',
      'Piensa en el termómetro: −2 °C es menos frío que −5 °C. Se escribe −2 > −5 (la boca del signo se come al mayor).',
    ],
    frames: [
      frame('−5 °C y −2 °C en el termómetro. El que está más arriba es el mayor: −2.', { kind: 'line', theme: 'termometro', min: -7, max: 3, phase: 'points', points: [-5, -2], highlight: -2 }),
      frame('Por eso: −2 > −5.', { kind: 'calc', lines: ['−2 > −5'] }),
    ],
  },
  {
    title: 'Opuesto y valor absoluto',
    paragraphs: [
      'El opuesto de un número está a la misma distancia del cero, al otro lado: el opuesto de −4 es 4.',
      'El valor absoluto es la distancia al cero, sin signo: |−4| = 4 y |4| = 4.',
    ],
    frames: [
      frame('El −4 está a 4 pasos del cero.', { kind: 'line', theme: 'recta', min: -6, max: 6, phase: 'move', from: -4, to: 0 }),
      frame('Su opuesto, el 4, está a los mismos 4 pasos, al otro lado.', { kind: 'line', theme: 'recta', min: -6, max: 6, phase: 'points', points: [-4, 4], highlight: 4 }),
      frame('Y el valor absoluto es la distancia: |−4| = 4.', { kind: 'calc', lines: ['|−4| = 4', '|4| = 4'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: 'Números enteros',
  title: 'Comparar y ordenar',
  emoji: '🌡️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
