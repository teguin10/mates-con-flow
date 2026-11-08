// Tema: monomios. Coeficiente, parte literal y grado; monomios semejantes;
// sumar y restar semejantes; multiplicar monomios.

import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES, MINUS, mono, num, shuffle } from './algebra-comun.js';

const TOPIC_ID = 'monomios';

export const FORMS = {
  partes: 'Coeficiente y grado',
  semejantes: '¿Son semejantes?',
  sumar: 'Sumar y restar monomios semejantes',
  multiplicar: 'Multiplicar monomios',
};

const LEVELS = {
  1: { forms: [['partes', 3], ['semejantes', 3], ['sumar', 2]], neg: false },
  2: { forms: [['sumar', 4], ['semejantes', 1], ['multiplicar', 2]], neg: true },
  3: { forms: [['sumar', 2], ['multiplicar', 4]], neg: true },
};

const VARS = ['x', 'y', 'a'];

function buildParts(rng) {
  const c = rng.int(2, 9) * (rng.next() < 0.3 ? -1 : 1);
  const v = rng.pick(VARS);
  const e = rng.int(1, 4);
  const m = mono(c, v, e);
  const askDegree = rng.next() < 0.5;
  return {
    id: `partes:${m}:${askDegree}`,
    form: 'partes',
    answerType: 'integer',
    answer: askDegree ? e : c,
    expression: `${m} → ${askDegree ? 'grado' : 'coeficiente'}: □`,
    story: `🔎 En el monomio ${m}, ¿cuál es ${askDegree ? 'el grado' : 'el coeficiente'}?`,
    hint: 'El coeficiente es el número de delante; la parte literal, las letras; el grado, el exponente de la letra.',
    steps: [`Coeficiente: ${num(c)}. Parte literal: ${mono(1, v, e)}. Grado: ${e}.`],
    frames: [frame(`En ${m}, el número ${num(c)} es el coeficiente, ${mono(1, v, e)} es la parte literal y el grado es ${e}.`, { kind: 'calc', lines: [m, `coeficiente ${num(c)} · parte literal ${mono(1, v, e)} · grado ${e}`] })],
    hintFrames: [frame('Número delante: coeficiente. Exponente: grado.', { kind: 'calc', lines: [m] })],
  };
}

function buildSimilar(rng) {
  const v = rng.pick(VARS);
  const e = rng.int(1, 3);
  const yes = rng.next() < 0.5;
  const a = mono(rng.int(2, 9), v, e);
  const otherE = e === 1 ? 2 : e - 1;
  const b = yes ? mono(rng.int(2, 9) * (rng.next() < 0.3 ? -1 : 1), v, e) : rng.next() < 0.5 ? mono(rng.int(2, 9), v, otherE) : mono(rng.int(2, 9), VARS.find((w) => w !== v), e);
  const answer = yes ? 'Sí' : 'No';
  return {
    id: `semejantes:${a}:${b}`,
    form: 'semejantes',
    answerType: 'choice',
    choices: ['Sí', 'No'],
    answer,
    expression: `${a} y ${b}, ¿semejantes? □`,
    story: `👯 ¿${a} y ${b} son monomios semejantes?`,
    hint: 'Son semejantes si tienen la misma parte literal: las mismas letras con los mismos exponentes. El número da igual.',
    steps: [yes ? 'Tienen la misma parte literal: son semejantes.' : 'La parte literal no es igual (cambia la letra o el exponente): no son semejantes.'],
    frames: [frame(yes ? `${a} y ${b} tienen la misma parte literal: son semejantes.` : `${a} y ${b} no tienen la misma parte literal: no son semejantes.`, { kind: 'calc', lines: [`${a}  ·  ${b}`, yes ? 'misma parte literal ✔' : 'distinta parte literal ✘'] })],
    hintFrames: [frame('Mira solo las letras y sus exponentes.', { kind: 'calc', lines: [`${a}  ·  ${b}`] })],
  };
}

function buildSum(rng, cfg) {
  const v = rng.pick(VARS);
  const e = rng.int(1, 2);
  const c1 = rng.int(1, 9) * (cfg.neg && rng.next() < 0.3 ? -1 : 1);
  const c2 = rng.int(1, 9);
  const minus = cfg.neg && rng.next() < 0.5;
  const result = minus ? c1 - c2 : c1 + c2;
  const lit = mono(1, v, e);
  const expr = `${mono(c1, v, e)} ${minus ? MINUS : '+'} ${mono(c2, v, e)}`;
  return {
    id: `sumar:${expr}`,
    form: 'sumar',
    answerType: 'integer',
    answer: result,
    expression: `${expr} = □${lit}`,
    story: `🧺 Tienes ${mono(c1, v, e)} y ${minus ? `quitas ${mono(c2, v, e)}` : `añades ${mono(c2, v, e)}`}. ¿Cuántos ${lit} quedan? (escribe el coeficiente)`,
    hint: `Se suman o restan los coeficientes y la parte literal (${lit}) se queda igual.`,
    steps: [`Coeficientes: ${num(c1)} ${minus ? MINUS : '+'} ${c2} = ${num(result)}.`, `${expr} = ${mono(result, v, e)}.`],
    frames: [
      frame(`Como son semejantes, sumamos los números y dejamos ${lit} igual.`, { kind: 'calc', lines: [expr] }),
      frame(`${num(c1)} ${minus ? MINUS : '+'} ${c2} = ${num(result)}: queda ${mono(result, v, e)}.`, { kind: 'calc', lines: [`${expr} = ${result === 0 ? '0' : mono(result, v, e)}`] }),
    ],
    hintFrames: [frame(`Opera solo con los números; ${lit} se queda.`, { kind: 'calc', lines: [expr] })],
  };
}

function buildProduct(rng, cfg) {
  const v = rng.pick(VARS);
  const c1 = rng.int(2, 6) * (cfg.neg && rng.next() < 0.3 ? -1 : 1);
  const c2 = rng.int(2, 6);
  const e1 = rng.int(1, 3);
  const e2 = rng.int(1, 3);
  const right = mono(c1 * c2, v, e1 + e2);
  const wrong = [mono(c1 * c2, v, e1 * e2), mono(c1 + c2, v, e1 + e2), mono(c1 * c2, v, Math.max(e1, e2))].filter((w) => w !== right);
  const expr = `${mono(c1, v, e1)} · ${mono(c2, v, e2)}`;
  return {
    id: `multiplicar:${expr}`,
    form: 'multiplicar',
    answerType: 'choice',
    choices: shuffle(rng, [right, ...shuffle(rng, [...new Set(wrong)]).slice(0, 2)]),
    answer: right,
    expression: `${expr} = □`,
    story: `✖️ Multiplica los monomios: ${expr}.`,
    hint: 'Multiplica los coeficientes y suma los exponentes de la misma letra.',
    steps: [`Coeficientes: ${num(c1)} · ${c2} = ${num(c1 * c2)}.`, `Exponentes: ${e1} + ${e2} = ${e1 + e2}.`, `${expr} = ${right}.`],
    frames: [
      frame(`Multiplicamos los números: ${num(c1)} por ${c2} es ${num(c1 * c2)}.`, { kind: 'calc', lines: [`${num(c1)} · ${c2} = ${num(c1 * c2)}`] }),
      frame(`Y sumamos los exponentes de ${v}: ${e1} + ${e2} = ${e1 + e2}. Queda ${right}.`, { kind: 'calc', lines: [`${expr} = ${right}`] }),
    ],
    hintFrames: [frame('Números por números; exponentes se suman.', { kind: 'calc', lines: [expr] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'partes' ? buildParts(rng)
    : form === 'semejantes' ? buildSimilar(rng)
      : form === 'sumar' ? buildSum(rng, cfg)
        : buildProduct(rng, cfg);
  return { topicId: TOPIC_ID, level, theme: 'algebra', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Monomios',
    paragraphs: [
      'Un monomio es un número por letras: en 5x², el 5 es el coeficiente, x² la parte literal y 2 el grado.',
      'Dos monomios son semejantes si tienen la misma parte literal: 3x y 7x sí; 3x y 3x² no.',
    ],
    frames: [frame('En 5x², 5 es el coeficiente, x² la parte literal y el grado es 2.', { kind: 'calc', lines: ['5x²', 'coeficiente 5 · parte literal x² · grado 2'] })],
  },
  {
    title: 'Operar con monomios',
    paragraphs: [
      'Sumar o restar semejantes: se operan los coeficientes y la parte literal se queda: 3x + 5x = 8x (como 3 manzanas más 5 manzanas).',
      'Multiplicar: coeficientes por coeficientes y se suman los exponentes: 2x · 3x² = 6x³.',
    ],
    frames: [
      frame('3x + 5x = 8x: como 3 manzanas más 5 manzanas.', { kind: 'calc', lines: ['3x + 5x = 8x'] }),
      frame('2x · 3x² = 6x³: 2 por 3 y 1 más 2.', { kind: 'calc', lines: ['2x · 3x² = 6x³'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Monomios',
  emoji: '🧩',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
