// Tema: magnitudes directamente proporcionales. Reconocerlas, completar una
// tabla y resolver problemas (reducción a la unidad y regla de tres).

import { fr, mul } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, D, generator, LEVEL_NAMES, tableView } from './proporcion-comun.js';

const TOPIC_ID = 'proporcion-directa';

export const FORMS = {
  reconocer: '¿Son directamente proporcionales?',
  tabla: 'Completar una tabla de proporcionalidad',
  problema: 'Problemas (reducción a la unidad)',
};

const LEVELS = {
  1: { forms: [['reconocer', 2], ['tabla', 3]] },
  2: { forms: [['tabla', 2], ['problema', 3], ['reconocer', 1]] },
  3: { forms: [['problema', 4], ['tabla', 1]] },
};

// Parejas de magnitudes: si son directamente proporcionales y por qué.
const PAIRS = [
  { text: 'los kilos de fresas que compras y lo que pagas', yes: true, why: 'el doble de kilos cuesta el doble' },
  { text: 'las entradas del concierto de trap y el dinero que cuestan', yes: true, why: 'el triple de entradas cuesta el triple' },
  { text: 'los crepes que haces y la harina que necesitas', yes: true, why: 'el doble de crepes lleva el doble de harina' },
  { text: 'los minutos de una canción y lo que ocupa en el móvil', yes: true, why: 'el doble de minutos ocupa más o menos el doble' },
  { text: 'tu edad y tu altura', yes: false, why: 'con el doble de edad no mides el doble' },
  { text: 'las personas que pintan un mural y el tiempo que tardan', yes: false, why: 'con más personas se tarda menos, no más (es inversa)' },
  { text: 'la velocidad de la bici y el tiempo que tardas en llegar', yes: false, why: 'si vas más rápido tardas menos (es inversa)' },
  { text: 'tu número de pie y tu nota de mates', yes: false, why: 'no tienen nada que ver' },
];

// unit: lo que corresponde a 1, en décimas (min y max), para que los precios tengan sentido.
const PROBLEMS = [
  { a: 'crepes', b: 'g de harina', unit: [200, 600, 100], story: (x, y, z) => `🥞 Para ${x} crepes se usan ${y} g de harina. ¿Cuánta harina hace falta para ${z} crepes?` },
  { a: 'entradas', b: '€', unit: [80, 250, 5], story: (x, y, z) => `🎤 ${x} entradas para el concierto cuestan ${y} €. ¿Cuánto cuestan ${z} entradas?` },
  { a: 'kg de fresas', b: '€', unit: [15, 45, 1], story: (x, y, z) => `🍓 ${x} kg de fresas cuestan ${y} €. ¿Cuánto cuestan ${z} kg?` },
  { a: 'vueltas', b: 'minutos', unit: [20, 80, 10], story: (x, y, z) => `🏃‍♀️ En el entrenamiento das ${x} vueltas en ${y} minutos. A ese ritmo, ¿cuántos minutos tardas en ${z} vueltas?` },
];

function buildRecognize(rng) {
  const pair = rng.pick(PAIRS);
  return {
    id: `reconocer:${pair.text}`,
    form: 'reconocer',
    answerType: 'choice',
    choices: ['Sí', 'No'],
    answer: pair.yes ? 'Sí' : 'No',
    expression: '¿Directamente proporcionales?',
    story: `🤔 ¿Son directamente proporcionales ${pair.text}?`,
    hint: 'Son directamente proporcionales si al doble de una le corresponde el doble de la otra, al triple el triple…',
    steps: [`Piensa: ¿al doble le corresponde el doble?`, `${pair.yes ? 'Sí' : 'No'}: ${pair.why}.`],
    frames: [
      frame('Directamente proporcionales: al doble, el doble; al triple, el triple.', tableView(['', ''], [1, 2, 3], [5, 10, 15], '× 5')),
      frame(`Aquí: ${pair.why}. ${pair.yes ? 'Sí lo son.' : 'No lo son.'}`, { kind: 'calc', lines: [pair.yes ? 'Sí ✔' : 'No ✘'] }),
    ],
    hintFrames: [frame('¿Al doble le corresponde el doble?', tableView(['', ''], [1, 2], [5, 10], '× 5'))],
  };
}

function buildTable(rng, level) {
  const k = level === 1 ? rng.int(2, 9) : rng.pick([2, 3, 4, 5, 6, 1.5, 2.5, 0.5]);
  const kf = Number.isInteger(k) ? fr(k, 1) : fr(k * 10, 10);
  const tops = [];
  while (tops.length < 4) {
    const v = rng.int(1, 12);
    if (!tops.includes(v)) tops.push(v);
  }
  tops.sort((x, y) => x - y);
  const bottoms = tops.map((t) => mul(fr(t, 1), kf));
  const missing = rng.int(1, 3);
  const answer = bottoms[missing];
  const shownBottom = bottoms.map((b, i) => (i === missing ? null : D(b)));
  const names = ['Bolsas de golosinas', 'Precio (€)'];
  return {
    id: `tabla:${tops.join('-')}:${D(kf)}:${missing}`,
    form: 'tabla',
    answerType: 'decimal',
    answer,
    expression: `${tops[missing]} → □`,
    story: `🍬 Esta tabla es de proporcionalidad directa: bolsas de golosinas y lo que cuestan. ¿Qué número falta debajo de ${tops[missing]}?`,
    hint: `Busca por cuánto se multiplica cada número de arriba para dar el de abajo: ${tops[0]} → ${D(bottoms[0])}.`,
    steps: [`La constante es ${D(bottoms[0])} ÷ ${tops[0]} = ${D(kf)}.`, `${tops[missing]} × ${D(kf)} = ${D(answer)}.`],
    frames: [
      frame('Cada número de abajo es el de arriba multiplicado por lo mismo.', tableView(names, tops, shownBottom)),
      frame(`${D(bottoms[0])} ÷ ${tops[0]} = ${D(kf)}: la constante de proporcionalidad.`, tableView(names, tops, shownBottom, `× ${D(kf)}`)),
      frame(`${tops[missing]} × ${D(kf)} = ${D(answer)}.`, tableView(names, tops, bottoms.map(D), `× ${D(kf)}`)),
    ],
    hintFrames: [frame('¿Por cuánto se multiplica?', tableView(names, tops, shownBottom))],
  };
}

function buildProblem(rng, level) {
  const p = rng.pick(PROBLEMS);
  const x = rng.int(2, 6);
  // Hasta el nivel 3, lo que corresponde a 1 es entero.
  const [min, max, step] = p.unit;
  const unitStep = level === 3 ? step : Math.max(step, 10);
  const unit = fr(Math.round(rng.int(min, max) / unitStep) * unitStep || unitStep, 10);
  const y = mul(fr(x, 1), unit);
  let z;
  do z = rng.int(2, 12); while (z === x);
  const answer = mul(fr(z, 1), unit);
  return {
    id: `problema:${p.a}:${x}:${D(y)}:${z}`,
    form: 'problema',
    answerType: 'decimal',
    answer,
    expression: `${x} → ${D(y)} ; ${z} → □`,
    story: p.story(x, D(y), z),
    hint: `Primero calcula cuánto corresponde a 1 (divide ${D(y)} entre ${x}) y después multiplica por ${z}.`,
    steps: [`Para 1: ${D(y)} ÷ ${x} = ${D(unit)}.`, `Para ${z}: ${D(unit)} × ${z} = ${D(answer)}.`],
    frames: [
      frame(`Lo ponemos en una tabla: ${x} ${p.a} son ${D(y)} ${p.b}.`, tableView([p.a, p.b], [x, 1, z], [D(y), null, null])),
      frame(`Reducimos a la unidad: ${D(y)} ÷ ${x} = ${D(unit)} por cada uno.`, tableView([p.a, p.b], [x, 1, z], [D(y), D(unit), null])),
      frame(`Y multiplicamos: ${D(unit)} × ${z} = ${D(answer)}.`, tableView([p.a, p.b], [x, 1, z], [D(y), D(unit), D(answer)])),
    ],
    hintFrames: [frame('¿Cuánto corresponde a 1?', tableView([p.a, p.b], [x, 1, z], [D(y), null, null]))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'reconocer' ? buildRecognize(rng) : form === 'tabla' ? buildTable(rng, level) : buildProblem(rng, level);
  return { topicId: TOPIC_ID, level, theme: 'proporcion', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Directamente proporcionales',
    paragraphs: [
      'Dos magnitudes son directamente proporcionales si al doble de una le corresponde el doble de la otra, al triple el triple… Por ejemplo, las entradas y lo que cuestan.',
      'En la tabla, cada número de abajo es el de arriba multiplicado por lo mismo: la constante de proporcionalidad.',
    ],
    frames: [
      frame('1 entrada, 5 €; 2 entradas, 10 €; 3 entradas, 15 €.', tableView(['Entradas', 'Precio (€)'], [1, 2, 3], [5, 10, 15])),
      frame('Siempre se multiplica por 5: la constante es 5.', tableView(['Entradas', 'Precio (€)'], [1, 2, 3], [5, 10, 15], '× 5')),
    ],
  },
  {
    title: 'Reducción a la unidad',
    paragraphs: ['Si 3 entradas cuestan 24 €, una cuesta 24 ÷ 3 = 8 €, y 5 entradas cuestan 5 × 8 = 40 €.'],
    frames: [
      frame('3 entradas cuestan 24 €.', tableView(['Entradas', 'Precio (€)'], [3, 1, 5], [24, null, null])),
      frame('Una cuesta 24 ÷ 3 = 8 €.', tableView(['Entradas', 'Precio (€)'], [3, 1, 5], [24, 8, null])),
      frame('Y 5 cuestan 5 × 8 = 40 €.', tableView(['Entradas', 'Precio (€)'], [3, 1, 5], [24, 8, 40])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Magnitudes proporcionales',
  emoji: '📈',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
