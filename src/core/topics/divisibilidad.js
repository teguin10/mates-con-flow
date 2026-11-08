// Tema: múltiplos y divisores, criterios de divisibilidad, números primos y
// descomposición en factores primos.

import { divisionSteps, divisors, factorize, formatFactors, isPrime } from '../math/numbers.js';
import { frame } from '../explain/storyboard.js';
import { generator, shuffle } from './decimales-comun.js';
import { BLOCK, LEVEL_NAMES } from './potencias.js';

const TOPIC_ID = 'divisibilidad';

export const FORMS = {
  multiplo: '¿Es múltiplo?',
  divisor: '¿Cuál no es divisor?',
  criterio: 'Criterios del 2, 3, 5 y 10',
  primo: '¿Es primo?',
  descomponer: 'Descomposición en factores primos',
};

const LEVELS = {
  1: { forms: [['multiplo', 3], ['divisor', 3], ['criterio', 2]] },
  2: { forms: [['criterio', 3], ['primo', 3], ['divisor', 2]] },
  3: { forms: [['descomponer', 4], ['primo', 2], ['criterio', 1]] },
};

const CRITERIA = {
  2: (n) => `Es divisible entre 2 si acaba en cifra par (0, 2, 4, 6, 8). ${n} acaba en ${n % 10}.`,
  3: (n) => `Es divisible entre 3 si la suma de sus cifras es múltiplo de 3. ${String(n).split('').join(' + ')} = ${String(n).split('').reduce((s, d) => s + Number(d), 0)}.`,
  5: (n) => `Es divisible entre 5 si acaba en 0 o en 5. ${n} acaba en ${n % 10}.`,
  10: (n) => `Es divisible entre 10 si acaba en 0. ${n} acaba en ${n % 10}.`,
};

const factorView = (n) => ({ kind: 'factor', rows: divisionSteps(n) });

function buildMultiple(rng) {
  const d = rng.int(3, 12);
  const yes = rng.next() < 0.5;
  const n = yes ? d * rng.int(3, 12) : d * rng.int(3, 12) + rng.int(1, d - 1);
  const q = Math.floor(n / d);
  return {
    id: `multiplo:${n}:${d}`,
    form: 'multiplo',
    answerType: 'choice',
    choices: ['Sí', 'No'],
    answer: n % d === 0 ? 'Sí' : 'No',
    expression: `¿${n} es múltiplo de ${d}?`,
    story: `🍬 Tienes ${n} caramelos. ¿Puedes hacer bolsitas de ${d} sin que sobre ninguno? (¿Es ${n} múltiplo de ${d}?)`,
    hint: `Es múltiplo si la división ${n} ÷ ${d} es exacta (resto 0).`,
    steps: [`${n} ÷ ${d} = ${q}, resto ${n % d}.`, n % d === 0 ? `Resto 0: ${n} es múltiplo de ${d}.` : `Sobra ${n % d}: no es múltiplo.`],
    frames: [
      frame(`Dividimos ${n} entre ${d}: ${q} y sobra ${n % d}.`, { kind: 'calc', lines: [`${n} = ${d} × ${q} + ${n % d}`] }),
      frame(n % d === 0 ? `Resto 0: sí es múltiplo de ${d}.` : `Sobra ${n % d}: no es múltiplo de ${d}.`, { kind: 'calc', lines: [n % d === 0 ? `${n} = ${d} × ${q}` : `resto ${n % d} ≠ 0`] }),
    ],
    hintFrames: [frame('Haz la división y mira el resto.', { kind: 'calc', lines: [`${n} ÷ ${d}`] })],
  };
}

function buildNotDivisor(rng) {
  const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 48, 60]);
  const divs = divisors(n);
  const not = rng.pick([5, 7, 9, 11, 14, 16].filter((x) => n % x !== 0 && x < n));
  const shown = shuffle(rng, [not, ...shuffle(rng, divs.filter((x) => x > 1 && x < n)).slice(0, 2)]);
  return {
    id: `divisor:${n}:${not}`,
    form: 'divisor',
    answerType: 'choice',
    choices: shown.map(String),
    answer: String(not),
    expression: `¿Cuál no divide a ${n}?`,
    story: `🧁 Quieres repartir ${n} cupcakes en cajas iguales sin que sobre ninguno. ¿Qué tamaño de caja NO sirve?`,
    hint: `Un divisor de ${n} es un número que lo divide de forma exacta.`,
    steps: [`Divisores de ${n}: ${divs.join(', ')}.`, `${not} no está: ${n} ÷ ${not} no es exacta.`],
    frames: [
      frame(`Los divisores de ${n} son ${divs.join(', ')}.`, { kind: 'calc', lines: [`Div(${n}) = ${divs.join(', ')}`] }),
      frame(`${not} no está en la lista: no es divisor.`, { kind: 'calc', lines: [`${n} ÷ ${not} = ${Math.floor(n / not)}, resto ${n % not}`] }),
    ],
    hintFrames: [frame(`Prueba a dividir ${n} entre cada uno.`, { kind: 'calc', lines: shown.map((x) => `${n} ÷ ${x} = ?`) })],
  };
}

function buildCriterion(rng) {
  const d = rng.pick([2, 3, 5, 10, 3]);
  const yes = rng.next() < 0.5;
  let n;
  do n = rng.int(100, 9999); while ((n % d === 0) !== yes);
  return {
    id: `criterio:${n}:${d}`,
    form: 'criterio',
    answerType: 'choice',
    choices: ['Sí', 'No'],
    answer: n % d === 0 ? 'Sí' : 'No',
    expression: `¿${n} es divisible entre ${d}?`,
    story: `🔍 Sin hacer la división: ¿${n} es divisible entre ${d}?`,
    hint: CRITERIA[d](n).split('.')[0] + '.',
    steps: [CRITERIA[d](n), n % d === 0 ? `Sí es divisible entre ${d}.` : `No es divisible entre ${d}.`],
    frames: [
      frame(CRITERIA[d](n), { kind: 'calc', lines: [String(n)] }),
      frame(n % d === 0 ? `Sí es divisible entre ${d}.` : `No es divisible entre ${d}.`, { kind: 'calc', lines: [`${n} ÷ ${d} ${n % d === 0 ? 'exacta ✔' : 'no exacta ✘'}`] }),
    ],
    hintFrames: [frame(CRITERIA[d](n).split('.')[0] + '.', { kind: 'calc', lines: [String(n)] })],
  };
}

// Compuestos que parecen primos: la trampa típica.
const TRICKY = [51, 57, 87, 91, 93, 39, 49, 77, 21, 27, 33, 63, 69, 81];

function buildPrime(rng) {
  const prime = rng.next() < 0.5;
  const pool = prime ? [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97] : TRICKY;
  const n = rng.pick(pool);
  const smallest = isPrime(n) ? null : factorize(n)[0][0];
  return {
    id: `primo:${n}`,
    form: 'primo',
    answerType: 'choice',
    choices: ['Sí', 'No'],
    answer: isPrime(n) ? 'Sí' : 'No',
    expression: `¿${n} es primo?`,
    story: `🕵️ ¿${n} es un número primo (solo se puede dividir entre 1 y entre él mismo)?`,
    hint: 'Prueba a dividir entre 2, 3, 5 y 7. Si ninguno lo divide (y es menor que 121), es primo.',
    steps: isPrime(n) ? [`Ni 2, ni 3, ni 5, ni 7 dividen a ${n}.`, `${n} es primo.`] : [`${n} = ${smallest} × ${n / smallest}.`, `No es primo: es compuesto.`],
    frames: isPrime(n)
      ? [frame(`Probamos con 2, 3, 5 y 7: ninguno divide a ${n}. Es primo.`, { kind: 'calc', lines: [`Div(${n}) = 1, ${n}`] })]
      : [frame(`${n} se puede dividir entre ${smallest}: ${n} = ${smallest} × ${n / smallest}. No es primo.`, { kind: 'calc', lines: [`${n} = ${smallest} × ${n / smallest}`] })],
    hintFrames: [frame('Prueba con 2, 3, 5 y 7.', { kind: 'calc', lines: [`${n} ÷ 2, ${n} ÷ 3, ${n} ÷ 5, ${n} ÷ 7`] })],
  };
}

function buildFactorize(rng) {
  const n = rng.pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 54, 60, 72, 84, 90, 100, 120, 150, 180]);
  const factors = factorize(n);
  const right = formatFactors(factors);
  const bump = factors.map(([p, e], i) => (i === 0 ? [p, e + 1] : [p, e]));
  const drop = factors.length > 1 ? factors.slice(0, -1) : [[factors[0][0], factors[0][1] - 1 || 2]];
  const swap = factors.map(([p, e]) => [p === 2 ? 4 : p, e]);
  const wrong = [formatFactors(bump), formatFactors(drop), formatFactors(swap)].filter((w) => w !== right);
  return {
    id: `descomponer:${n}`,
    form: 'descomponer',
    answerType: 'choice',
    choices: shuffle(rng, [right, ...shuffle(rng, [...new Set(wrong)]).slice(0, 2)]),
    answer: right,
    expression: `${n} = □`,
    story: `🌳 Descompón ${n} en factores primos.`,
    hint: 'Divide entre el primo más pequeño que puedas (2, 3, 5…) una y otra vez hasta llegar a 1.',
    steps: [`Divisiones: ${divisionSteps(n).filter(([, p]) => p).map(([v, p]) => `${v} ÷ ${p}`).join(', ')}.`, `${n} = ${right}.`],
    frames: [
      frame(`Dividimos ${n} entre primos, empezando por el más pequeño, hasta llegar a 1.`, factorView(n)),
      frame(`Los primos de la derecha son los factores: ${n} = ${right}.`, { kind: 'calc', lines: [`${n} = ${right}`] }),
    ],
    hintFrames: [frame('Empieza dividiendo entre 2 si puedes.', { kind: 'factor', rows: [[n, null]] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'multiplo' ? buildMultiple(rng)
    : form === 'divisor' ? buildNotDivisor(rng)
      : form === 'criterio' ? buildCriterion(rng)
        : form === 'primo' ? buildPrime(rng)
          : buildFactorize(rng);
  return { topicId: TOPIC_ID, level, theme: 'divisibilidad', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Múltiplos y divisores',
    paragraphs: [
      '24 es múltiplo de 6 porque 6 × 4 = 24. Y 6 es divisor de 24 porque 24 ÷ 6 es exacta.',
      'Criterios rápidos: entre 2 si acaba en par; entre 5 si acaba en 0 o 5; entre 10 si acaba en 0; entre 3 si la suma de sus cifras es múltiplo de 3.',
    ],
    frames: [
      frame('Divisores de 24: los que lo dividen de forma exacta.', { kind: 'calc', lines: ['Div(24) = 1, 2, 3, 4, 6, 8, 12, 24'] }),
      frame('Múltiplos de 6: la tabla del 6.', { kind: 'calc', lines: ['6, 12, 18, 24, 30…'] }),
    ],
  },
  {
    title: 'Primos y factores',
    paragraphs: [
      'Un número primo solo tiene dos divisores: el 1 y él mismo (2, 3, 5, 7, 11…). Ojo: 51 = 3 × 17 no es primo.',
      'Descomponer es escribirlo como producto de primos: 60 = 2² · 3 · 5.',
    ],
    frames: [
      frame('60 entre 2, entre 2, entre 3 y entre 5.', factorView(60)),
      frame('60 = 2² · 3 · 5.', { kind: 'calc', lines: ['60 = 2² · 3 · 5'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Múltiplos, divisores y primos',
  emoji: '🌳',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
