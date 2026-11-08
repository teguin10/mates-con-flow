// Tema: rebajas, subidas y repartos directamente proporcionales.

import { add, fr, mul, div, sub } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, D, generator, LEVEL_NAMES, percentView } from './proporcion-comun.js';
import { bar, fractionView } from './fracciones-comun.js';

const TOPIC_ID = 'porcentajes-repartos';

export const FORMS = {
  descuento: 'Rebajas (precio con descuento)',
  aumento: 'Subidas (precio con aumento)',
  reparto: 'Repartos directamente proporcionales',
};

const LEVELS = {
  1: { forms: [['descuento', 4], ['aumento', 2]], percents: [10, 20, 50, 25] },
  2: { forms: [['descuento', 2], ['aumento', 2], ['reparto', 3]], percents: [10, 15, 20, 25, 30, 40] },
  3: { forms: [['reparto', 3], ['descuento', 2], ['aumento', 2]], percents: [5, 12, 15, 21, 35] },
};

// plural: para concordar el verbo («unos cascos tienen», «una sudadera tiene»).
const ITEMS = [
  { name: 'unas zapatillas de vóley', plural: true, min: 30, max: 90 },
  { name: 'unos cascos', plural: true, min: 20, max: 80 },
  { name: 'una sudadera de estilo trap', plural: false, min: 20, max: 60 },
  { name: 'un set de rotuladores', plural: false, min: 10, max: 30 },
  { name: 'unos guantes de boxeo', plural: true, min: 25, max: 70 },
];

function buildChange(rng, cfg, down) {
  const p = rng.pick(cfg.percents);
  const item = rng.pick(ITEMS);
  const price = fr(rng.int(item.min, item.max), 1);
  const change = div(mul(price, fr(p, 1)), fr(100, 1));
  const final = down ? sub(price, change) : add(price, change);
  const factor = fr(down ? 100 - p : 100 + p, 100);
  const verb = down ? 'descuento' : 'subida';
  return {
    id: `${down ? 'descuento' : 'aumento'}:${p}:${D(price)}`,
    form: down ? 'descuento' : 'aumento',
    answerType: 'decimal',
    answer: final,
    expression: `${D(price)} ${down ? '−' : '+'} ${p} % = □`,
    story: down
      ? `🛍️ En rebajas, ${item.name} de ${D(price)} € ${item.plural ? 'tienen' : 'tiene'} un ${p} % de descuento. ¿Cuánto pagas?`
      : `📈 ${item.name[0].toUpperCase()}${item.name.slice(1)} ${item.plural ? 'costaban' : 'costaba'} ${D(price)} € y ${item.plural ? 'han' : 'ha'} subido un ${p} %. ¿Cuánto ${item.plural ? 'cuestan' : 'cuesta'} ahora?`,
    hint: `Calcula el ${p} % de ${D(price)} y ${down ? 'réstalo' : 'súmalo'}. (Atajo: ${down ? 'pagas el' : 'pagas el'} ${down ? 100 - p : 100 + p} %, multiplica por ${D(factor)}.)`,
    steps: [
      `${verb[0].toUpperCase()}${verb.slice(1)}: ${p} % de ${D(price)} = ${D(change)} €.`,
      `${D(price)} ${down ? '−' : '+'} ${D(change)} = ${D(final)} €.`,
      `Atajo: ${D(price)} × ${D(factor)} = ${D(final)}.`,
    ],
    frames: [
      frame(`El ${p} % de ${D(price)} es ${D(change)} €.`, percentView(p, `${p} % = ${D(change)} €`, D(price))),
      frame(`${down ? 'Lo restamos' : 'Lo sumamos'}: ${D(price)} ${down ? '−' : '+'} ${D(change)} = ${D(final)} €.`, { kind: 'calc', lines: [`${D(price)} ${down ? '−' : '+'} ${D(change)} = ${D(final)}`] }),
      frame(`Atajo: ${down ? 'pagas' : 'pagas'} el ${down ? 100 - p : 100 + p} %, o sea ${D(price)} × ${D(factor)} = ${D(final)} €.`, percentView(down ? 100 - p : 100 + p, `${down ? 100 - p : 100 + p} % = ${D(final)} €`)),
    ],
    hintFrames: [frame(`Primero, el ${p} % de ${D(price)}.`, percentView(p, `${p} %`))],
  };
}

const SHARES = [
  { story: (total, a, b, who) => `🍬 Repartís ${total} golosinas entre dos amigas de forma proporcional a las horas que habéis ayudado en la feria: ${a} h y ${b} h. ¿Cuántas le tocan a la que ayudó ${who} h?` },
  { story: (total, a, b, who) => `💶 Dos hermanas ganan ${total} € cuidando perros: una paseó ${a} días y la otra ${b}. Si se reparte de forma proporcional, ¿cuánto le toca a la que paseó ${who} días?` },
  { story: (total, a, b, who) => `🏆 El premio de ${total} € del torneo se reparte proporcional a los puntos: ${a} y ${b}. ¿Cuánto le toca al equipo de ${who} puntos?` },
];

function buildShare(rng, level) {
  const a = rng.int(1, level === 3 ? 9 : 5);
  let b;
  do b = rng.int(1, level === 3 ? 9 : 5); while (b === a);
  const parts = a + b;
  const each = rng.int(2, level === 3 ? 30 : 12);
  const total = parts * each;
  const who = rng.next() < 0.5 ? a : b;
  const answer = fr(who * each, 1);
  return {
    id: `reparto:${total}:${a}:${b}:${who}`,
    form: 'reparto',
    answerType: 'decimal',
    answer,
    expression: `${total} → ${a} : ${b}`,
    story: rng.pick(SHARES).story(total, a, b, who),
    hint: `Suma las partes (${a} + ${b} = ${parts}), mira cuánto vale una parte (${total} ÷ ${parts}) y multiplica.`,
    steps: [`Partes: ${a} + ${b} = ${parts}.`, `Una parte: ${total} ÷ ${parts} = ${each}.`, `Le tocan ${who} × ${each} = ${who * each}.`],
    frames: [
      frame(`Hay ${a} + ${b} = ${parts} partes en total.`, fractionView([bar(fr(a, parts), { label: `${a} partes` }), bar(fr(b, parts), { label: `${b} partes` })])),
      frame(`Cada parte vale ${total} ÷ ${parts} = ${each}.`, { kind: 'calc', lines: [`${total} ÷ ${parts} = ${each}`] }),
      frame(`Le tocan ${who} partes: ${who} × ${each} = ${who * each}.`, { kind: 'calc', lines: [`${who} × ${each} = ${who * each}`] }),
    ],
    hintFrames: [frame('¿Cuántas partes hay en total?', fractionView([bar(fr(a, parts)), bar(fr(b, parts))]))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'reparto' ? buildShare(rng, level) : buildChange(rng, cfg, form === 'descuento');
  return { topicId: TOPIC_ID, level, theme: 'porcentaje', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Rebajas y subidas',
    paragraphs: [
      'Unas zapatillas de 60 € con un 20 % de descuento: el 20 % de 60 es 12, así que pagas 60 − 12 = 48 €.',
      'Atajo: con un 20 % de descuento pagas el 80 %: 60 × 0,8 = 48. Con una subida del 20 % pagas el 120 %: 60 × 1,2 = 72.',
    ],
    frames: [
      frame('El 20 % de 60 es 12.', percentView(20, '20 % = 12 €', 60)),
      frame('60 − 12 = 48 €.', { kind: 'calc', lines: ['60 − 12 = 48'] }),
      frame('Atajo: pagas el 80 %, 60 × 0,8 = 48.', percentView(80, '80 % = 48 €')),
    ],
  },
  {
    title: 'Repartos proporcionales',
    paragraphs: ['Para repartir 50 € entre dos personas en proporción 2 y 3: hay 2 + 3 = 5 partes, cada parte vale 50 ÷ 5 = 10 €, y les tocan 20 € y 30 €.'],
    frames: [
      frame('2 + 3 = 5 partes.', fractionView([bar(fr(2, 5)), bar(fr(3, 5))])),
      frame('Cada parte vale 50 ÷ 5 = 10 €: 20 € y 30 €.', { kind: 'calc', lines: ['50 ÷ 5 = 10', '2 × 10 = 20 · 3 × 10 = 30'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Rebajas, subidas y repartos',
  emoji: '🛍️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
