// Tema: porcentajes. El tanto por ciento de una cantidad, qué porcentaje es
// una parte, el total a partir de una parte y el porcentaje como fracción.

import { fr, mul, div, simplify } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, D, generator, LEVEL_NAMES, percentView } from './proporcion-comun.js';
import { F } from './fracciones-comun.js';

const TOPIC_ID = 'porcentajes';

export const FORMS = {
  'de-una-cantidad': 'El % de una cantidad (25 % de 80)',
  'que-porcentaje': 'Qué % es una parte (15 de 60)',
  total: 'El total a partir de una parte',
  fraccion: 'Porcentaje como fracción (25 % = 1/4)',
};

const LEVELS = {
  1: { forms: [['de-una-cantidad', 4], ['fraccion', 2]], percents: [10, 50, 25, 20, 75] },
  2: { forms: [['de-una-cantidad', 3], ['que-porcentaje', 3], ['fraccion', 1]], percents: [10, 20, 25, 30, 40, 50, 60, 75, 5, 15] },
  3: { forms: [['que-porcentaje', 2], ['total', 3], ['de-una-cantidad', 2]], percents: [5, 12, 15, 35, 45, 65, 80, 8, 16] },
};

const CONTEXTS = [
  { what: 'de batería', story: (p, t) => `📱 Tu móvil tiene ${t} minutos de batería al máximo. ¿Cuántos minutos son el ${p} %?` },
  { what: 'de los saques', story: (p, t) => `🏐 Has hecho ${t} saques y entra el ${p} %. ¿Cuántos saques entran?` },
  { what: 'del insti', story: (p, t) => `🏫 En tu insti hay ${t} alumnos y el ${p} % ve series de terror. ¿Cuántos son?` },
  { what: 'de los seguidores', story: (p, t) => `📺 Un youtuber tiene ${t} mil seguidores en España y el ${p} % son de Madrid. ¿Cuántos miles son?` },
];

const percentOf = (p, total) => div(mul(fr(p, 1), fr(total, 1)), fr(100, 1));

/** Un total que haga exacto (o con 1-2 decimales) el porcentaje. */
function totalFor(rng, p, level) {
  const s = simplify(fr(p, 100));
  const min = Math.max(1, Math.ceil(20 / s.d));
  return s.d * rng.int(min, min + (level === 1 ? 8 : 15));
}

function buildOf(rng, cfg, level) {
  const p = rng.pick(cfg.percents);
  const total = totalFor(rng, p, level);
  const answer = percentOf(p, total);
  const ctx = rng.pick(CONTEXTS);
  return {
    id: `de:${p}:${total}`,
    form: 'de-una-cantidad',
    answerType: 'decimal',
    answer,
    expression: `${p} % de ${total} = □`,
    story: ctx.story(p, total),
    hint: `El ${p} % es ${p} de cada 100: multiplica ${total} por ${p} y divide entre 100.`,
    steps: [`${p} % de ${total} = ${total} × ${p} ÷ 100.`, `${total} × ${p} = ${total * p}; ÷ 100 = ${D(answer)}.`],
    frames: [
      frame(`El ${p} % es ${p} de cada 100.`, percentView(p, `${p} %`)),
      frame(`Multiplicamos ${total} por ${p} y dividimos entre 100: ${D(answer)}.`, { kind: 'calc', lines: [`${total} × ${p} = ${total * p}`, `${total * p} ÷ 100 = ${D(answer)}`] }),
      frame(`El ${p} % de ${total} es ${D(answer)}.`, percentView(p, `${p} % de ${total} = ${D(answer)}`, total)),
    ],
    hintFrames: [frame(`${p} % = ${p} de cada 100.`, percentView(p, `${p} %`))],
  };
}

function buildWhich(rng, cfg, level) {
  const p = rng.pick(cfg.percents);
  const total = totalFor(rng, p, level);
  const part = percentOf(p, total);
  return {
    id: `que:${D(part)}:${total}`,
    form: 'que-porcentaje',
    answerType: 'decimal',
    answer: fr(p, 1),
    expression: `${D(part)} de ${total} = □ %`,
    story: `🚲 En tu insti hay ${total} alumnos y ${D(part)} vienen en bici. ¿Qué porcentaje viene en bici?`,
    hint: `Divide la parte entre el total y multiplica por 100: ${D(part)} ÷ ${total} × 100.`,
    steps: [`${D(part)} ÷ ${total} = ${D(div(part, fr(total, 1)))}.`, `× 100 = ${p} %.`],
    frames: [
      frame(`La parte entre el total: ${D(part)} ÷ ${total} = ${D(div(part, fr(total, 1)))}.`, { kind: 'calc', lines: [`${D(part)} ÷ ${total} = ${D(div(part, fr(total, 1)))}`] }),
      frame(`Por 100: ${p} %.`, percentView(p, `${p} %`)),
    ],
    hintFrames: [frame('Parte ÷ total × 100.', { kind: 'calc', lines: [`${D(part)} ÷ ${total} × 100`] })],
  };
}

function buildTotal(rng, cfg, level) {
  const p = rng.pick(cfg.percents.filter((x) => x >= 5));
  const total = totalFor(rng, p, level);
  const part = percentOf(p, total);
  return {
    id: `total:${p}:${D(part)}`,
    form: 'total',
    answerType: 'decimal',
    answer: fr(total, 1),
    expression: `${p} % de □ = ${D(part)}`,
    story: `🎨 Has pintado ${D(part)} m² del mural y eso es el ${p} % del total. ¿Cuántos m² tiene el mural entero?`,
    hint: `Si ${D(part)} es el ${p} %, el 1 % es ${D(part)} ÷ ${p}; el 100 % es eso por 100.`,
    steps: [`1 % = ${D(part)} ÷ ${p} = ${D(div(part, fr(p, 1)))}.`, `100 % = ${D(div(part, fr(p, 1)))} × 100 = ${total}.`],
    frames: [
      frame(`${D(part)} es el ${p} %.`, percentView(p, `${p} % = ${D(part)}`)),
      frame(`El 1 % es ${D(part)} ÷ ${p} = ${D(div(part, fr(p, 1)))}.`, { kind: 'calc', lines: [`1 % = ${D(part)} ÷ ${p} = ${D(div(part, fr(p, 1)))}`] }),
      frame(`El 100 % es ${D(div(part, fr(p, 1)))} × 100 = ${total}.`, percentView(100, `100 % = ${total}`)),
    ],
    hintFrames: [frame('Calcula primero el 1 %.', percentView(p, `${p} % = ${D(part)}`))],
  };
}

const AS_FRACTION = [10, 20, 25, 50, 75, 40, 5, 60, 80, 30];

function buildFraction(rng) {
  const p = rng.pick(AS_FRACTION);
  const s = simplify(fr(p, 100));
  return {
    id: `fraccion:${p}`,
    form: 'fraccion',
    answerType: 'fraction',
    mustSimplify: true,
    answer: s,
    expression: `${p} % = □`,
    story: `🍕 Te comes el ${p} % de la pizza. ¿Qué fracción de la pizza es? Simplifícala.`,
    hint: `${p} % es ${p}/100. Simplifica.`,
    steps: [`${p} % = ${p}/100.`, `Simplificada: ${F(s)}.`],
    frames: [
      frame(`${p} % es ${p} de cada 100: ${p}/100.`, percentView(p, `${p}/100`)),
      frame(`Simplificada: ${F(s)}.`, { kind: 'calc', lines: [`${p}/100 = ${F(s)}`] }),
    ],
    hintFrames: [frame(`${p} % = ${p}/100.`, percentView(p, `${p} %`))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'de-una-cantidad' ? buildOf(rng, cfg, level)
    : form === 'que-porcentaje' ? buildWhich(rng, cfg, level)
      : form === 'total' ? buildTotal(rng, cfg, level)
        : buildFraction(rng);
  return { topicId: TOPIC_ID, level, theme: 'porcentaje', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Qué es un porcentaje',
    paragraphs: [
      'El 25 % es 25 de cada 100: 25/100 = 1/4. Para calcular el 25 % de 80, multiplica 80 × 25 = 2000 y divide entre 100: 20.',
      'Trucos: el 50 % es la mitad, el 25 % la cuarta parte y el 10 % se calcula dividiendo entre 10.',
    ],
    frames: [
      frame('El 25 % es 25 de cada 100.', percentView(25, '25 %')),
      frame('25 % de 80: 80 × 25 ÷ 100 = 20.', { kind: 'calc', lines: ['80 × 25 = 2000', '2000 ÷ 100 = 20'] }),
      frame('Es la cuarta parte de 80.', percentView(25, '25 % de 80 = 20', 80)),
    ],
  },
  {
    title: 'Qué porcentaje es',
    paragraphs: ['Si ganas 15 de 60 partidos: 15 ÷ 60 = 0,25 y por 100, el 25 %.'],
    frames: [
      frame('15 ÷ 60 = 0,25.', { kind: 'calc', lines: ['15 ÷ 60 = 0,25'] }),
      frame('Por 100: el 25 %.', percentView(25, '25 %')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Porcentajes',
  emoji: '💯',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
