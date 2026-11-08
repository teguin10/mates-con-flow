// Tema: lenguaje algebraico (de palabras a letras) y valor numérico de una
// expresión.

import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES, linear, MINUS, num, shuffle, sum } from './algebra-comun.js';

const TOPIC_ID = 'algebra-lenguaje';

export const FORMS = {
  traducir: 'De palabras a álgebra',
  'valor-numerico': 'Valor numérico de una expresión',
};

// Frases y su expresión correcta, con fallos típicos.
const PHRASES = [
  { text: 'El doble de un número', right: '2x', wrong: ['x + 2', 'x²', 'x : 2'] },
  { text: 'Un número más 5', right: 'x + 5', wrong: ['5x', 'x − 5', '5 − x'] },
  { text: 'La mitad de un número', right: 'x : 2', wrong: ['2x', 'x − 2', 'x²'] },
  { text: 'El triple de un número menos 4', right: '3x − 4', wrong: ['3(x − 4)', '4 − 3x', '3x + 4'] },
  { text: 'El cuadrado de un número', right: 'x²', wrong: ['2x', 'x + 2', 'x · 2'] },
  { text: 'El número siguiente a x', right: 'x + 1', wrong: ['x − 1', '1x', '2x'] },
  { text: 'El número anterior a x', right: 'x − 1', wrong: ['x + 1', '1 − x', 'x : 1'] },
  { text: 'La edad de tu prima dentro de 3 años (hoy tiene x)', right: 'x + 3', wrong: ['3x', 'x − 3', '3 − x'] },
  { text: 'La edad de tu prima hace 2 años (hoy tiene x)', right: 'x − 2', wrong: ['x + 2', '2x', '2 − x'] },
  { text: 'El precio de 4 crepes si cada uno cuesta x €', right: '4x', wrong: ['x + 4', 'x : 4', '4 − x'] },
  { text: 'El doble de un número más 7', right: '2x + 7', wrong: ['2(x + 7)', '7x + 2', '2x − 7'] },
  { text: 'El perímetro de un cuadrado de lado x', right: '4x', wrong: ['x²', 'x + 4', '2x'] },
];

const LEVELS = {
  1: { forms: [['traducir', 3], ['valor-numerico', 2]], range: [1, 6], neg: false },
  2: { forms: [['traducir', 2], ['valor-numerico', 3]], range: [-5, 8], neg: true },
  3: { forms: [['valor-numerico', 3], ['traducir', 1]], range: [-6, 9], neg: true, square: true },
};

function buildTranslate(rng) {
  const p = rng.pick(PHRASES);
  return {
    id: `traducir:${p.text}`,
    form: 'traducir',
    answerType: 'choice',
    choices: shuffle(rng, [p.right, ...shuffle(rng, p.wrong).slice(0, 2)]),
    answer: p.right,
    expression: `${p.text} → □`,
    story: `🔤 Escribe en lenguaje algebraico (usa x para el número): “${p.text}”.`,
    hint: 'El doble es 2x, el triple 3x, la mitad x : 2, el cuadrado x², el siguiente x + 1 y el anterior x − 1.',
    steps: [`“${p.text}” se escribe ${p.right}.`],
    frames: [
      frame('Llamamos x al número que no conocemos.', { kind: 'calc', lines: ['número → x'] }),
      frame(`“${p.text}” es ${p.right}.`, { kind: 'calc', lines: [`${p.text}`, `→ ${p.right}`] }),
    ],
    hintFrames: [frame('Palabras clave del álgebra.', { kind: 'calc', lines: ['doble 2x · triple 3x · mitad x : 2', 'cuadrado x² · siguiente x + 1'] })],
  };
}

function buildValue(rng, cfg) {
  const a = rng.int(2, 6) * (cfg.neg && rng.next() < 0.3 ? -1 : 1);
  const b = rng.int(-9, 9) || 3;
  const x = rng.int(cfg.range[0], cfg.range[1]) || 2;
  const square = cfg.square && rng.next() < 0.5;
  const expr = square ? sum([[1, 'x', 2], [a, 'x'], [b, '']]) : linear(a, b);
  const value = (square ? x * x : 0) + a * x + b;
  const sub = (v) => (v < 0 ? `(${num(v)})` : String(v));
  const replaced = square ? `${sub(x)}² ${a < 0 ? MINUS : '+'} ${Math.abs(a)} · ${sub(x)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)}` : `${num(a)} · ${sub(x)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)}`;
  return {
    id: `valor:${expr}:${x}`,
    form: 'valor-numerico',
    answerType: 'integer',
    answer: value,
    expression: `${expr}, x = ${num(x)} → □`,
    story: `🧮 Calcula el valor de ${expr} cuando x vale ${num(x)}.`,
    hint: `Cambia la x por ${num(x)}${x < 0 ? ' (entre paréntesis)' : ''} y haz las cuentas: primero las multiplicaciones${square ? ' y la potencia' : ''}.`,
    steps: [`Sustituimos x por ${num(x)}: ${replaced}.`, `= ${num(value)}.`],
    frames: [
      frame(`Cambiamos cada x por ${num(x)}.`, { kind: 'calc', lines: [expr, replaced] }),
      frame(`Hacemos las cuentas: ${num(value)}.`, { kind: 'calc', lines: [`${replaced} = ${num(value)}`] }),
    ],
    hintFrames: [frame(`Pon ${num(x)} donde está la x.`, { kind: 'calc', lines: [expr, replaced] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'traducir' ? buildTranslate(rng) : buildValue(rng, cfg);
  return { topicId: TOPIC_ID, level, theme: 'algebra', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Letras en lugar de números',
    paragraphs: [
      'En álgebra usamos una letra (normalmente x) para un número que no conocemos. «El doble de un número» es 2x; «un número más 5» es x + 5.',
      'El valor numérico es lo que da la expresión cuando cambias la letra por un número: si x = 4, 3x + 2 = 3 · 4 + 2 = 14.',
    ],
    frames: [
      frame('El doble de un número: 2x.', { kind: 'calc', lines: ['el doble de un número → 2x'] }),
      frame('Si x vale 4, 3x + 2 vale 3 por 4 más 2: 14.', { kind: 'calc', lines: ['3x + 2', '3 · 4 + 2 = 14'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Lenguaje algebraico',
  emoji: '🔤',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
