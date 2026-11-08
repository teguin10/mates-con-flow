// Tema: razón y proporción. La razón entre dos cantidades (como fracción),
// si dos razones forman proporción y el número que falta en una proporción.

import { equals, fr, gcd, simplify } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES, tableView } from './proporcion-comun.js';
import { F } from './fracciones-comun.js';

const TOPIC_ID = 'proporcion-razon';

export const FORMS = {
  razon: 'La razón entre dos cantidades',
  'es-proporcion': '¿Forman proporción?',
  'cuarto-proporcional': 'El número que falta (3/5 = x/20)',
};

const LEVELS = {
  1: { forms: [['razon', 3], ['es-proporcion', 2]], max: 12 },
  2: { forms: [['razon', 2], ['es-proporcion', 2], ['cuarto-proporcional', 3]], max: 20 },
  3: { forms: [['cuarto-proporcional', 4], ['es-proporcion', 2], ['razon', 1]], max: 30 },
};

const PAIRS = [
  { a: 'chicas', b: 'chicos', story: (x, y) => `🏐 En tu equipo de vóley hay ${x} chicas y ${y} chicos. ¿Cuál es la razón entre chicas y chicos?` },
  { a: 'perros', b: 'gatos', story: (x, y) => `🐶 En el refugio hay ${x} perros y ${y} gatos. ¿Cuál es la razón entre perros y gatos?` },
  { a: 'aciertos', b: 'saques', story: (x, y) => `🏐 De ${y} saques, metes ${x}. ¿Cuál es la razón entre aciertos y saques?` },
  { a: 'tazas de harina', b: 'huevos', story: (x, y) => `🥞 Para las tortitas usas ${x} tazas de harina y ${y} huevos. ¿Cuál es la razón entre harina y huevos?` },
];

function buildRatio(rng, max) {
  const pair = rng.pick(PAIRS);
  let x;
  let y;
  do {
    x = rng.int(2, max);
    y = rng.int(2, max);
  } while (x === y || (pair.a === 'aciertos' && x >= y));
  const value = fr(x, y);
  const s = simplify(value);
  return {
    id: `razon:${pair.a}:${x}:${y}`,
    form: 'razon',
    answerType: 'fraction',
    answer: s,
    expression: `${pair.a} / ${pair.b} = □`,
    story: pair.story(x, y),
    hint: `La razón es una división escrita como fracción: ${pair.a} arriba y ${pair.b} abajo. Después, simplifica.`,
    steps: [`Razón = ${x}/${y}.`, ...(gcd(x, y) > 1 ? [`Simplificada: ${F(s)}.`] : []), `Por cada ${s.d} ${pair.b} hay ${s.n} ${pair.a}.`],
    frames: [
      frame(`La razón de ${pair.a} a ${pair.b} es ${x} entre ${y}: ${x}/${y}.`, { kind: 'calc', lines: [`${pair.a} / ${pair.b} = ${x}/${y}`] }),
      ...(gcd(x, y) > 1 ? [frame(`La simplificamos: ${x}/${y} = ${F(s)}.`, { kind: 'calc', lines: [`${x}/${y} = ${F(s)}`] })] : []),
      frame(`Quiere decir que por cada ${s.d} ${pair.b} hay ${s.n} ${pair.a}.`, { kind: 'calc', lines: [`${F(s)}: ${s.n} ${pair.a} por cada ${s.d} ${pair.b}`] }),
    ],
    hintFrames: [frame(`${pair.a} arriba, ${pair.b} abajo.`, { kind: 'calc', lines: [`${pair.a} / ${pair.b}`] })],
  };
}

function buildIsProportion(rng, max) {
  const d0 = rng.int(2, 9);
  let n0;
  do n0 = rng.int(1, 9); while (n0 === d0);
  const a = fr(n0, d0);
  const k = rng.int(2, 5);
  const yes = rng.next() < 0.5;
  const b = yes ? fr(a.n * k, a.d * k) : fr(a.n * k + rng.pick([-1, 1]), a.d * k);
  const answer = equals(a, b) ? 'Sí' : 'No';
  const cross1 = a.n * b.d;
  const cross2 = a.d * b.n;
  return {
    id: `es-proporcion:${F(a)}:${F(b)}`,
    form: 'es-proporcion',
    answerType: 'choice',
    choices: ['Sí', 'No'],
    answer,
    expression: `${F(a)} = ${F(b)} ?`,
    story: `🔎 ¿Las razones ${F(a)} y ${F(b)} forman una proporción?`,
    hint: 'Dos razones forman proporción si sus productos cruzados son iguales.',
    steps: [`Productos cruzados: ${a.n} × ${b.d} = ${cross1} y ${a.d} × ${b.n} = ${cross2}.`, cross1 === cross2 ? 'Son iguales: sí forman proporción.' : 'Son distintos: no forman proporción.'],
    frames: [
      frame(`Multiplicamos en cruz: ${a.n} × ${b.d} = ${cross1}.`, { kind: 'calc', lines: [`${a.n} × ${b.d} = ${cross1}`] }),
      frame(`Y ${a.d} × ${b.n} = ${cross2}.`, { kind: 'calc', lines: [`${a.n} × ${b.d} = ${cross1}`, `${a.d} × ${b.n} = ${cross2}`] }),
      frame(cross1 === cross2 ? 'Son iguales: forman proporción.' : 'Son distintos: no forman proporción.', { kind: 'calc', lines: [`${cross1} ${cross1 === cross2 ? '=' : '≠'} ${cross2}`] }),
    ],
    hintFrames: [frame('Multiplica en cruz y compara.', { kind: 'calc', lines: [`${a.n} × ${b.d}  ¿=?  ${a.d} × ${b.n}`] })],
  };
}

function buildFourth(rng) {
  const a = fr(rng.int(1, 9), rng.int(2, 9));
  const k = rng.int(2, 8);
  const missingTop = rng.next() < 0.5;
  const top = a.n * k;
  const bottom = a.d * k;
  const answer = missingTop ? top : bottom;
  const expression = missingTop ? `${F(a)} = □/${bottom}` : `${F(a)} = ${top}/□`;
  const story = rng.pick([
    `🥞 La receta dice ${a.n} vasos de leche por cada ${a.d} huevos. Si usas ${missingTop ? `${bottom} huevos` : `${top} vasos de leche`}, ¿cuántos ${missingTop ? 'vasos de leche' : 'huevos'} necesitas?`,
    `🎨 Para el color rosa mezclas ${a.n} botes de rojo por cada ${a.d} de blanco. Con ${missingTop ? `${bottom} de blanco` : `${top} de rojo`}, ¿cuántos de ${missingTop ? 'rojo' : 'blanco'} hacen falta?`,
  ]);
  const product = missingTop ? a.n * bottom : a.d * top;
  const divisor = missingTop ? a.d : a.n;
  return {
    id: `cuarto:${expression}`,
    form: 'cuarto-proporcional',
    answerType: 'integer',
    answer,
    expression,
    story,
    hint: 'En una proporción los productos cruzados son iguales: multiplica en cruz los dos números que conoces y divide entre el otro.',
    steps: [`Producto cruzado: ${missingTop ? `${a.n} × ${bottom}` : `${a.d} × ${top}`} = ${product}.`, `Divide entre ${divisor}: ${product} ÷ ${divisor} = ${answer}.`],
    frames: [
      frame('Ponemos los datos en una tabla.', tableView(['', ''], [a.n, missingTop ? null : top], [a.d, missingTop ? bottom : null])),
      frame(`Multiplicamos en cruz: ${missingTop ? `${a.n} × ${bottom}` : `${a.d} × ${top}`} = ${product}.`, { kind: 'calc', lines: [`${missingTop ? `${a.n} × ${bottom}` : `${a.d} × ${top}`} = ${product}`] }),
      frame(`Y dividimos entre ${divisor}: ${product} ÷ ${divisor} = ${answer}.`, { kind: 'calc', lines: [`${product} ÷ ${divisor} = ${answer}`, expression.replace('□', String(answer))] }),
    ],
    hintFrames: [frame('Multiplica en cruz y divide.', tableView(['', ''], [a.n, missingTop ? null : top], [a.d, missingTop ? bottom : null]))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'razon' ? buildRatio(rng, cfg.max) : form === 'es-proporcion' ? buildIsProportion(rng, cfg.max) : buildFourth(rng);
  return { topicId: TOPIC_ID, level, theme: 'proporcion', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Razón',
    paragraphs: [
      'Una razón compara dos cantidades dividiéndolas. Si en tu equipo hay 6 chicas y 4 chicos, la razón entre chicas y chicos es 6/4 = 3/2: por cada 2 chicos hay 3 chicas.',
    ],
    frames: [
      frame('6 chicas y 4 chicos: la razón es 6/4.', { kind: 'calc', lines: ['chicas / chicos = 6/4'] }),
      frame('Simplificada: 3/2. Por cada 2 chicos hay 3 chicas.', { kind: 'calc', lines: ['6/4 = 3/2'] }),
    ],
  },
  {
    title: 'Proporción',
    paragraphs: [
      'Dos razones iguales forman una proporción: 2/3 = 8/12. Se comprueba multiplicando en cruz: 2 × 12 = 3 × 8 = 24.',
      'Si falta un número, multiplica en cruz los que conoces y divide entre el otro.',
    ],
    frames: [
      frame('2/3 y 8/12: multiplicamos en cruz.', { kind: 'calc', lines: ['2 × 12 = 24', '3 × 8 = 24'] }),
      frame('Dan lo mismo: forman proporción.', { kind: 'calc', lines: ['2/3 = 8/12'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Razón y proporción',
  emoji: '⚖️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
