// Tema: máximo común divisor y mínimo común múltiplo, con listas (niveles 1
// y 2), con factores (nivel 3) y en problemas.

import { gcd, lcm } from '../math/fraction.js';
import { divisors, factorize, formatFactors, divisionSteps } from '../math/numbers.js';
import { frame } from '../explain/storyboard.js';
import { generator } from './decimales-comun.js';
import { BLOCK, LEVEL_NAMES } from './potencias.js';

const TOPIC_ID = 'mcd-mcm';

export const FORMS = {
  mcd: 'Máximo común divisor',
  mcm: 'Mínimo común múltiplo',
  problema: 'Problemas de mcd y mcm',
};

const LEVELS = {
  1: { forms: [['mcd', 3], ['mcm', 3]], pairs: [[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [4, 10], [6, 15], [9, 12], [12, 18], [3, 4], [5, 6], [8, 10]] },
  2: { forms: [['mcd', 2], ['mcm', 2], ['problema', 3]], pairs: [[12, 18], [16, 24], [15, 20], [18, 24], [20, 30], [14, 21], [12, 16], [24, 36], [10, 25], [9, 15]] },
  3: { forms: [['problema', 3], ['mcd', 2], ['mcm', 2]], pairs: [[24, 36], [30, 45], [36, 48], [40, 60], [28, 42], [48, 72], [60, 90], [18, 30], [45, 75]] },
};

const multiplesUntil = (a, m) => Array.from({ length: m / a }, (_, i) => a * (i + 1)).join(', ');

function listFrames(a, b, kind) {
  if (kind === 'mcd') {
    const g = gcd(a, b);
    return [
      frame(`Escribimos los divisores de ${a} y de ${b}.`, { kind: 'calc', lines: [`Div(${a}) = ${divisors(a).join(', ')}`, `Div(${b}) = ${divisors(b).join(', ')}`] }),
      frame(`El mayor que está en las dos listas es ${g}: m.c.d.(${a}, ${b}) = ${g}.`, { kind: 'calc', lines: [`m.c.d.(${a}, ${b}) = ${g}`] }),
    ];
  }
  const m = lcm(a, b);
  return [
    frame(`Escribimos los múltiplos de ${a} y de ${b} hasta encontrar uno común.`, { kind: 'calc', lines: [`${a}: ${multiplesUntil(a, m)}`, `${b}: ${multiplesUntil(b, m)}`] }),
    frame(`El primero que está en las dos es ${m}: m.c.m.(${a}, ${b}) = ${m}.`, { kind: 'calc', lines: [`m.c.m.(${a}, ${b}) = ${m}`] }),
  ];
}

function factorFrames(a, b, kind) {
  const fa = factorize(a);
  const fb = factorize(b);
  const value = kind === 'mcd' ? gcd(a, b) : lcm(a, b);
  const rule = kind === 'mcd' ? 'factores comunes con el menor exponente' : 'todos los factores (comunes y no comunes) con el mayor exponente';
  return [
    frame(`Descomponemos: ${a} = ${formatFactors(fa)} y ${b} = ${formatFactors(fb)}.`, { kind: 'factor', rows: divisionSteps(a), rows2: divisionSteps(b) }),
    frame(`El ${kind === 'mcd' ? 'm.c.d.' : 'm.c.m.'} se forma con los ${rule}: ${formatFactors(factorize(value))} = ${value}.`, { kind: 'calc', lines: [`${a} = ${formatFactors(fa)}`, `${b} = ${formatFactors(fb)}`, `${kind === 'mcd' ? 'm.c.d.' : 'm.c.m.'} = ${formatFactors(factorize(value))} = ${value}`] }),
  ];
}

function buildPlain(rng, cfg, kind, level) {
  const [a, b] = rng.pick(cfg.pairs);
  const value = kind === 'mcd' ? gcd(a, b) : lcm(a, b);
  const frames = level === 3 ? factorFrames(a, b, kind) : listFrames(a, b, kind);
  const name = kind === 'mcd' ? 'm.c.d.' : 'm.c.m.';
  return {
    id: `${kind}:${a}:${b}`,
    form: kind,
    answerType: 'integer',
    answer: value,
    expression: `${name}(${a}, ${b}) = □`,
    story: kind === 'mcd' ? `🔢 Calcula el máximo común divisor de ${a} y ${b}.` : `🔢 Calcula el mínimo común múltiplo de ${a} y ${b}.`,
    hint: kind === 'mcd'
      ? `El m.c.d. es el divisor más grande que tienen en común. Escribe los divisores de los dos.`
      : `El m.c.m. es el múltiplo más pequeño que tienen en común. Escribe la tabla de los dos.`,
    steps: frames.map((f) => f.say),
    frames,
    hintFrames: frames.slice(0, 1),
  };
}

const PROBLEMS = {
  mcm: [
    (a, b) => `🚌 Un autobús pasa cada ${a} minutos y otro cada ${b}. Acaban de pasar juntos. ¿Dentro de cuántos minutos vuelven a coincidir?`,
    (a, b) => `🏐 Tú entrenas cada ${a} días y tu amiga cada ${b}. Hoy coincidís. ¿Dentro de cuántos días volvéis a coincidir?`,
  ],
  mcd: [
    (a, b) => `🍓 Tienes ${a} fresas y ${b} galletas. Quieres hacer el mayor número posible de bolsitas iguales (todas con lo mismo) sin que sobre nada. ¿Cuántas bolsitas haces?`,
    (a, b) => `🎀 Tienes dos cintas de ${a} cm y ${b} cm y quieres cortarlas en trozos iguales lo más largos posible. ¿Cuánto mide cada trozo?`,
  ],
};

function buildProblem(rng, cfg, level) {
  const kind = rng.next() < 0.5 ? 'mcd' : 'mcm';
  const [a, b] = rng.pick(cfg.pairs);
  const value = kind === 'mcd' ? gcd(a, b) : lcm(a, b);
  const frames = level === 3 ? factorFrames(a, b, kind) : listFrames(a, b, kind);
  const story = rng.pick(PROBLEMS[kind])(a, b);
  const why = kind === 'mcd'
    ? 'Repartir en partes iguales lo más grandes posible es buscar un divisor común, el mayor: el m.c.d.'
    : 'Volver a coincidir es buscar un múltiplo común, el más pequeño: el m.c.m.';
  return {
    id: `problema:${kind}:${a}:${b}:${story.slice(0, 4)}`,
    form: 'problema',
    answerType: 'integer',
    answer: value,
    expression: `${kind === 'mcd' ? 'm.c.d.' : 'm.c.m.'}(${a}, ${b}) = □`,
    story,
    hint: why,
    steps: [why, ...frames.map((f) => f.say)],
    frames: [frame(why, { kind: 'calc', lines: [kind === 'mcd' ? 'iguales y lo más grandes → m.c.d.' : 'volver a coincidir → m.c.m.'] }), ...frames],
    hintFrames: [frame(why, { kind: 'calc', lines: [kind === 'mcd' ? 'm.c.d.' : 'm.c.m.'] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'problema' ? buildProblem(rng, cfg, level) : buildPlain(rng, cfg, form, level);
  return { topicId: TOPIC_ID, level, theme: 'divisibilidad', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'm.c.d. y m.c.m.',
    paragraphs: [
      'El máximo común divisor (m.c.d.) es el divisor más grande que comparten dos números: m.c.d.(12, 18) = 6.',
      'El mínimo común múltiplo (m.c.m.) es el múltiplo más pequeño que comparten: m.c.m.(4, 6) = 12. Sirve para saber cuándo vuelven a coincidir dos cosas que se repiten.',
    ],
    frames: [...listFrames(12, 18, 'mcd'), ...listFrames(4, 6, 'mcm')],
  },
  {
    title: 'Con factores primos',
    paragraphs: ['Con números grandes es más rápido descomponer. m.c.d.: factores comunes con el menor exponente. m.c.m.: todos los factores con el mayor exponente.'],
    frames: factorFrames(24, 36, 'mcd'),
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'm.c.d. y m.c.m.',
  emoji: '🚌',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
