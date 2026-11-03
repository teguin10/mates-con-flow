// Tema: sumar y restar fracciones, con igual y con distinto denominador
// (pasando al mínimo común múltiplo). Los resultados son siempre positivos.

import { add, compare, fr, lcm, simplify, sub, toCommon } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { bar, BLOCK, F, fractionView, generator, lcmFrame, LEVEL_NAMES, simplifyStep } from './fracciones-comun.js';

const TOPIC_ID = 'fracciones-suma-resta';
const MINUS = '−';

export const FORMS = {
  'igual-denominador': 'Igual denominador (2/7 + 3/7)',
  'distinto-multiplo': 'Un denominador es múltiplo del otro (1/2 + 1/4)',
  distinto: 'Distinto denominador (2/3 + 1/4)',
};

const LEVELS = {
  1: { forms: [['igual-denominador', 1]] },
  2: { forms: [['distinto-multiplo', 2], ['igual-denominador', 1]] },
  3: { forms: [['distinto', 2], ['distinto-multiplo', 1]] },
};

const PAIRS = {
  'distinto-multiplo': [[2, 4], [2, 6], [3, 6], [2, 8], [4, 8], [3, 9], [5, 10], [2, 10], [4, 12], [3, 12], [6, 12]],
  distinto: [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [4, 6], [6, 8], [3, 8], [5, 6], [4, 10], [6, 9]],
};

function stories(op, a, b, rng) {
  if (op === '+') {
    return rng.pick([
      `🥞 Para los crepes echas ${F(a)} de taza de leche y luego ${F(b)} más. ¿Cuánta leche llevas?`,
      `🎧 Por la mañana escuchas ${F(a)} de la playlist de trap y por la tarde ${F(b)}. ¿Qué parte has escuchado?`,
      `🎨 Pintas ${F(a)} del mural el sábado y ${F(b)} el domingo. ¿Qué parte has pintado?`,
    ]);
  }
  return rng.pick([
    `🍫 Tenías ${F(a)} de tableta y te comes ${F(b)}. ¿Cuánta te queda?`,
    `📱 Tenías ${F(a)} de batería y ver vídeos de tus youtubers gasta ${F(b)}. ¿Cuánta queda?`,
    `🥊 El combate dura ${F(a)} de hora y ya han pasado ${F(b)}. ¿Cuánto falta?`,
  ]);
}

// Dos fracciones propias con los denominadores dados; en la resta, a > b.
function operands(rng, d1, d2, op) {
  for (;;) {
    const a = fr(rng.int(1, d1 - 1), d1);
    const b = fr(rng.int(1, d2 - 1), d2);
    if (op === '+' || compare(a, b) > 0) return [a, b];
  }
}

function build(rng, level) {
  const config = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(config.forms);
  const op = rng.next() < 0.55 ? '+' : '-';
  const symbol = op === '+' ? '+' : MINUS;
  let d1;
  let d2;
  if (form === 'igual-denominador') {
    d1 = rng.int(3, 12);
    d2 = d1;
  } else {
    [d1, d2] = rng.pick(PAIRS[form]);
    if (rng.next() < 0.5) [d1, d2] = [d2, d1];
  }
  const [a, b] = operands(rng, d1, d2, op);
  const raw = op === '+' ? add(a, b) : sub(a, b);
  const answer = simplify(raw);
  const expression = `${F(a)} ${symbol} ${F(b)} = □`;
  const simp = simplifyStep(raw);
  const verb = op === '+' ? 'sumamos' : 'restamos';
  let frames;
  let hintFrames;
  let steps;
  let hint;

  if (d1 === d2) {
    frames = [
      frame(`Mismo denominador, ${d1}: los trozos son iguales, así que ${verb} los numeradores y el denominador se queda igual.`,
        fractionView([bar(a), bar(b)], [symbol])),
      frame(`${a.n} ${symbol} ${b.n} = ${raw.n}. Resultado: ${F(raw)}.`,
        fractionView([bar(a), bar(b), bar(raw, { highlight: true })], [symbol, '='], `${F(a)} ${symbol} ${F(b)} = ${F(raw)}`)),
      ...simp.frames,
    ];
    hintFrames = [frames[0]];
    hint = `Con el mismo denominador, ${op === '+' ? 'suma' : 'resta'} los numeradores y deja el denominador (${d1}).`;
    steps = [`Mismo denominador: ${d1}.`, `Numeradores: ${a.n} ${symbol} ${b.n} = ${raw.n}.`, `Resultado: ${F(raw)}.`];
  } else {
    const m = lcm(d1, d2);
    const [x, y] = toCommon(a, b);
    frames = [
      frame(`Los denominadores son distintos (${d1} y ${d2}): los trozos no son del mismo tamaño y no se pueden ${op === '+' ? 'sumar' : 'restar'} así.`,
        fractionView([bar(a), bar(b)], [symbol])),
      lcmFrame(d1, d2),
      frame(`Pasamos las dos a denominador ${m}: ${F(a)} = ${F(x)} y ${F(b)} = ${F(y)}.`,
        fractionView([bar(x), bar(y)], [symbol], `${F(a)} = ${F(x)}   ${F(b)} = ${F(y)}`)),
      frame(`Ahora sí: ${x.n} ${symbol} ${y.n} = ${raw.n}. Resultado: ${F(raw)}.`,
        fractionView([bar(x), bar(y), bar(raw, { highlight: true })], [symbol, '='])),
      ...simp.frames,
    ];
    hintFrames = frames.slice(0, 2);
    hint = `Busca el mínimo común múltiplo de ${d1} y ${d2}, pasa las dos fracciones a ese denominador y ${op === '+' ? 'suma' : 'resta'} los numeradores.`;
    steps = [
      `m.c.m.(${d1}, ${d2}) = ${m}.`,
      `${F(a)} = ${F(x)} (× ${m / d1}) y ${F(b)} = ${F(y)} (× ${m / d2}).`,
      `${F(x)} ${symbol} ${F(y)} = ${F(raw)}.`,
    ];
  }
  if (simp.step) steps.push(simp.step);
  return {
    id: expression,
    topicId: TOPIC_ID,
    level,
    form,
    answerType: 'fraction',
    expression,
    answer,
    story: stories(op, a, b, rng),
    theme: 'fraccion',
    illustration: null,
    hint,
    steps,
    frames,
    hintFrames,
  };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Mismo denominador',
    paragraphs: [
      'Si los trozos son iguales, se suman (o restan) los numeradores y el denominador se queda igual.',
      '2/7 + 3/7 = 5/7. ¡El denominador no se suma!',
    ],
    frames: [
      frame('2/7 más 3/7: los trozos son iguales.', fractionView([bar(fr(2, 7)), bar(fr(3, 7))], ['+'])),
      frame('2 + 3 = 5 trozos de 7: 5/7.', fractionView([bar(fr(2, 7)), bar(fr(3, 7)), bar(fr(5, 7), { highlight: true })], ['+', '='])),
    ],
  },
  {
    title: 'Distinto denominador',
    paragraphs: [
      'Si los trozos son distintos, primero se pasan las fracciones a un denominador común: el mínimo común múltiplo.',
      '1/2 + 1/3: el m.c.m. de 2 y 3 es 6. 1/2 = 3/6 y 1/3 = 2/6. Suman 5/6.',
    ],
    frames: [
      frame('1/2 y 1/3 tienen trozos de distinto tamaño.', fractionView([bar(fr(1, 2)), bar(fr(1, 3))], ['+'])),
      lcmFrame(2, 3),
      frame('1/2 = 3/6 y 1/3 = 2/6. Ahora sí: 3/6 + 2/6 = 5/6.', fractionView([bar(fr(3, 6)), bar(fr(2, 6)), bar(fr(5, 6), { highlight: true })], ['+', '='])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Sumar y restar',
  emoji: '🍰',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
