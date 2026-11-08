// Tema: potencias. Valor de una potencia, de multiplicación repetida a
// potencia, potencias de base 10, propiedades (misma base) y notación
// científica.

import { power, sup } from '../math/numbers.js';
import { frame } from '../explain/storyboard.js';
import { generator, shuffle } from './decimales-comun.js';

const TOPIC_ID = 'potencias';
export const BLOCK = 'Potencias, raíces y divisibilidad';
export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };

export const FORMS = {
  valor: 'El valor de una potencia (2⁵ = 32)',
  escribir: 'De multiplicación a potencia (3 · 3 · 3 · 3 = 3⁴)',
  'base-10': 'Potencias de 10 (7 · 10³)',
  propiedades: 'Producto, cociente y potencia de potencia',
  notacion: 'Notación científica',
};

const LEVELS = {
  1: { forms: [['valor', 3], ['escribir', 3]], max: [[2, 5], [3, 3], [4, 3], [5, 3], [10, 3]] },
  2: { forms: [['valor', 2], ['escribir', 1], ['base-10', 3], ['propiedades', 2]], max: [[2, 8], [3, 4], [4, 3], [5, 4], [6, 3], [7, 3], [10, 5]] },
  3: { forms: [['propiedades', 4], ['notacion', 3], ['base-10', 1]], max: [[2, 10], [3, 5], [5, 4], [10, 6]] },
};

const repeated = (b, e) => Array.from({ length: e }, () => b).join(' · ');

function buildValue(rng, max) {
  const [b, emax] = rng.pick(max);
  const e = rng.int(2, emax);
  const value = b ** e;
  const story = rng.pick([
    `🧮 Calcula ${power(b, e)}.`,
    `🧟 En la serie de zombis, cada zombi muerde a ${b} personas al día. El día ${e} hay ${power(b, e)} zombis nuevos. ¿Cuántos son?`,
    `📦 Tienes ${b} cajas, cada una con ${b} cajas dentro… y así ${e} veces. Al final hay ${power(b, e)} cajitas. ¿Cuántas son?`,
  ]);
  return {
    id: `valor:${b}^${e}`,
    form: 'valor',
    answerType: 'integer',
    answer: value,
    expression: `${power(b, e)} = □`,
    story,
    hint: `El exponente (${e}) dice cuántas veces se multiplica la base (${b}) por sí misma.`,
    steps: [`${power(b, e)} = ${repeated(b, e)}.`, `= ${value}.`],
    frames: [
      frame(`${power(b, e)}: la base ${b} se multiplica ${e} veces.`, { kind: 'calc', lines: [`${power(b, e)} = ${repeated(b, e)}`] }),
      frame(`${repeated(b, e)} = ${value}.`, { kind: 'calc', lines: [`${power(b, e)} = ${value}`] }),
    ],
    hintFrames: [frame(`${power(b, e)} es ${b} multiplicado ${e} veces.`, { kind: 'calc', lines: [`${power(b, e)} = ${repeated(b, e)}`] })],
  };
}

function buildWrite(rng, max) {
  const [b] = rng.pick(max);
  const e = rng.int(2, 6);
  return {
    id: `escribir:${b}^${e}`,
    form: 'escribir',
    answerType: 'integer',
    answer: e,
    expression: `${repeated(b, e)} = ${b}^□`,
    story: `✍️ Escríbelo como potencia. ¿Cuál es el exponente?`,
    hint: 'Cuenta cuántas veces aparece el número multiplicado.',
    steps: [`El ${b} aparece ${e} veces.`, `${repeated(b, e)} = ${power(b, e)}.`],
    frames: [
      frame(`Contamos cuántas veces se multiplica el ${b}: ${e}.`, { kind: 'calc', lines: [repeated(b, e)] }),
      frame(`Es ${power(b, e)}.`, { kind: 'calc', lines: [`${repeated(b, e)} = ${power(b, e)}`] }),
    ],
    hintFrames: [frame('Cuenta los factores.', { kind: 'calc', lines: [repeated(b, e)] })],
  };
}

function buildBase10(rng) {
  const e = rng.int(2, 6);
  const a = rng.next() < 0.4 ? 1 : rng.int(2, 9);
  const value = a * 10 ** e;
  const expr = a === 1 ? power(10, e) : `${a} · ${power(10, e)}`;
  return {
    id: `base-10:${a}:${e}`,
    form: 'base-10',
    answerType: 'integer',
    answer: value,
    expression: `${expr} = □`,
    story: `🌍 Las potencias de 10 sirven para números grandes. ¿Cuánto es ${expr}?`,
    hint: `${power(10, e)} es un 1 seguido de ${e} ceros.`,
    steps: [`${power(10, e)} = 1 seguido de ${e} ceros = ${10 ** e}.`, ...(a > 1 ? [`${a} · ${10 ** e} = ${value}.`] : [])],
    frames: [
      frame(`${power(10, e)} es un 1 con ${e} ceros: ${10 ** e}.`, { kind: 'calc', lines: [`${power(10, e)} = ${10 ** e}`] }),
      ...(a > 1 ? [frame(`Multiplicamos por ${a}: ${value}.`, { kind: 'calc', lines: [`${a} · ${10 ** e} = ${value}`] })] : []),
    ],
    hintFrames: [frame(`Cuenta ${e} ceros.`, { kind: 'calc', lines: [`${power(10, e)} = 1${'0'.repeat(e)}`] })],
  };
}

function buildProperty(rng) {
  const b = rng.pick([2, 3, 5, 7, 10]);
  const kind = rng.pick(['producto', 'cociente', 'potencia']);
  const m = rng.int(2, 7);
  const n = rng.int(2, kind === 'cociente' ? m - 1 || 1 : 5);
  if (kind === 'cociente' && n >= m) return buildProperty(rng);
  const answer = kind === 'producto' ? m + n : kind === 'cociente' ? m - n : m * n;
  const expr = kind === 'producto' ? `${power(b, m)} · ${power(b, n)}` : kind === 'cociente' ? `${power(b, m)} : ${power(b, n)}` : `(${power(b, m)})${sup(n)}`;
  const rule = {
    producto: 'Al multiplicar potencias de la misma base, se suman los exponentes.',
    cociente: 'Al dividir potencias de la misma base, se restan los exponentes.',
    potencia: 'En una potencia de una potencia, se multiplican los exponentes.',
  }[kind];
  const op = kind === 'producto' ? `${m} + ${n}` : kind === 'cociente' ? `${m} − ${n}` : `${m} · ${n}`;
  return {
    id: `propiedades:${kind}:${b}:${m}:${n}`,
    form: 'propiedades',
    answerType: 'integer',
    answer,
    expression: `${expr} = ${b}^□`,
    story: `⚡ Escribe el resultado como una sola potencia de ${b}. ¿Cuál es el exponente?`,
    hint: rule,
    steps: [rule, `${op} = ${answer}: ${expr} = ${power(b, answer)}.`],
    frames: [
      frame(rule, { kind: 'calc', lines: [`${expr}`] }),
      frame(`${op} = ${answer}. Queda ${power(b, answer)}.`, { kind: 'calc', lines: [`${expr} = ${b}^(${op}) = ${power(b, answer)}`] }),
    ],
    hintFrames: [frame(rule, { kind: 'calc', lines: [expr] })],
  };
}

const BIG = [
  { text: 'La Tierra está a unos 150 000 000 km del Sol.', n: 150000000 },
  { text: 'Un vídeo viral tiene 4 300 000 visitas.', n: 4300000 },
  { text: 'En España viven unos 48 000 000 de personas.', n: 48000000 },
  { text: 'Tu cerebro tiene unas 86 000 000 000 neuronas.', n: 86000000000 },
  { text: 'La Luna está a 384 000 km de la Tierra.', n: 384000 },
  { text: 'Una canción de trap tiene 25 000 000 de reproducciones.', n: 25000000 },
];

/** 150 000 000 → «1,5 · 10⁸». */
export function scientific(n) {
  const e = String(n).length - 1;
  const digits = String(n).replace(/0+$/, '');
  const mantissa = digits.length > 1 ? `${digits[0]},${digits.slice(1)}` : digits;
  return { text: `${mantissa} · ${power(10, e)}`, mantissa, e };
}

function buildScientific(rng) {
  const big = rng.pick(BIG);
  const { text, mantissa, e } = scientific(big.n);
  // Todas las falsas valen otra cosa (ninguna es el mismo número mal escrito).
  const digits = String(big.n).replace(/0+$/, '');
  const wrong = [`${mantissa} · ${power(10, e - 1)}`, `${mantissa} · ${power(10, e + 1)}`, digits.length > 1 ? `${digits} · ${power(10, e)}` : `${mantissa} · ${power(10, e - 2)}`];
  const choices = shuffle(rng, [text, ...shuffle(rng, wrong).slice(0, 2)]);
  const shown = String(big.n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return {
    id: `notacion:${big.n}`,
    form: 'notacion',
    answerType: 'choice',
    choices,
    answer: text,
    expression: `${shown} = □`,
    story: `🔭 ${big.text} ¿Cómo se escribe en notación científica?`,
    hint: 'Pon la coma detrás de la primera cifra y cuenta cuántos lugares la has movido: ese es el exponente de 10.',
    steps: [`Primera cifra y coma: ${mantissa}.`, `La coma se ha movido ${e} lugares: · ${power(10, e)}.`, `${text}.`],
    frames: [
      frame(`Dejamos una sola cifra delante de la coma: ${mantissa}.`, { kind: 'calc', lines: [shown, mantissa] }),
      frame(`La coma ha saltado ${e} lugares, así que se multiplica por ${power(10, e)}.`, { kind: 'calc', lines: [`${shown} = ${text}`] }),
    ],
    hintFrames: [frame('Una cifra delante de la coma y el resto en la potencia de 10.', { kind: 'calc', lines: [shown] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'valor' ? buildValue(rng, cfg.max)
    : form === 'escribir' ? buildWrite(rng, cfg.max)
      : form === 'base-10' ? buildBase10(rng)
        : form === 'propiedades' ? buildProperty(rng)
          : buildScientific(rng);
  return { topicId: TOPIC_ID, level, theme: 'potencia', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Qué es una potencia',
    paragraphs: [
      'Una potencia es una multiplicación repetida: 2⁵ = 2 · 2 · 2 · 2 · 2 = 32. El 2 es la base y el 5, el exponente.',
      '5² se lee «5 al cuadrado» y 5³, «5 al cubo».',
    ],
    frames: [
      frame('2⁵ es multiplicar el 2 cinco veces.', { kind: 'calc', lines: ['2⁵ = 2 · 2 · 2 · 2 · 2'] }),
      frame('2⁵ = 32.', { kind: 'calc', lines: ['2⁵ = 32'] }),
    ],
  },
  {
    title: 'Trucos con la misma base',
    paragraphs: [
      'Multiplicar: se suman los exponentes (2³ · 2⁴ = 2⁷). Dividir: se restan (5⁶ : 5² = 5⁴). Potencia de potencia: se multiplican ((3²)³ = 3⁶).',
      'Notación científica: 150 000 000 = 1,5 · 10⁸.',
    ],
    frames: [
      frame('2³ · 2⁴: sumamos los exponentes, 2⁷.', { kind: 'calc', lines: ['2³ · 2⁴ = 2⁷'] }),
      frame('5⁶ : 5²: restamos, 5⁴.', { kind: 'calc', lines: ['5⁶ : 5² = 5⁴'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Potencias y notación científica',
  emoji: '⚡',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
