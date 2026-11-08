// Tema: ángulos. Tipos, complementarios y suplementarios, los ángulos de un
// triángulo y de un cuadrilátero.

import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES, shapeView } from './geometria-comun.js';

const TOPIC_ID = 'angulos';

export const FORMS = {
  tipo: 'Tipos de ángulos',
  complementario: 'Complementario y suplementario',
  triangulo: 'El ángulo que falta en un triángulo',
  cuadrilatero: 'El ángulo que falta en un cuadrilátero',
};

const LEVELS = {
  1: { forms: [['tipo', 4], ['complementario', 2]] },
  2: { forms: [['complementario', 3], ['triangulo', 3], ['tipo', 1]] },
  3: { forms: [['triangulo', 2], ['cuadrilatero', 3], ['complementario', 2]] },
};

const TYPES = ['Agudo', 'Recto', 'Obtuso', 'Llano'];
const typeOf = (a) => (a < 90 ? 'Agudo' : a === 90 ? 'Recto' : a < 180 ? 'Obtuso' : 'Llano');
const angleView = (deg, value = `${deg}°`) => shapeView('angle', { value }, { angle: deg, alt: `ángulo de ${deg} grados` });

function buildType(rng) {
  const deg = rng.pick([rng.int(10, 80), 90, rng.int(100, 170), 180, rng.int(15, 85), rng.int(95, 175)]);
  const answer = typeOf(deg);
  return {
    id: `tipo:${deg}`,
    form: 'tipo',
    answerType: 'choice',
    choices: TYPES,
    answer,
    expression: `${deg}° → □`,
    story: `📐 Un ángulo mide ${deg}°. ¿De qué tipo es?`,
    illustration: angleView(deg),
    hint: 'Agudo: menos de 90°. Recto: 90°. Obtuso: entre 90° y 180°. Llano: 180°.',
    steps: [`${deg}° ${deg < 90 ? 'es menos de 90°' : deg === 90 ? 'es justo 90°' : deg < 180 ? 'está entre 90° y 180°' : 'es 180°'}.`, `Es ${answer.toLowerCase()}.`],
    frames: [
      frame(`El ángulo mide ${deg} grados.`, angleView(deg)),
      frame(`Como ${deg < 90 ? 'es menor que 90' : deg === 90 ? 'es 90' : deg < 180 ? 'está entre 90 y 180' : 'es 180'}, es ${answer.toLowerCase()}.`, { kind: 'calc', lines: ['agudo < 90° · recto = 90°', 'obtuso entre 90° y 180° · llano = 180°'] }),
    ],
    hintFrames: [frame('Compáralo con un ángulo recto (90°).', angleView(90, '90°'))],
  };
}

function buildComplement(rng) {
  const supp = rng.next() < 0.5;
  const total = supp ? 180 : 90;
  const a = rng.int(10, total - 10);
  const answer = total - a;
  return {
    id: `complementario:${supp}:${a}`,
    form: 'complementario',
    answerType: 'integer',
    answer,
    expression: `${a}° + □° = ${total}°`,
    story: `📐 ¿Cuánto mide el ángulo ${supp ? 'suplementario' : 'complementario'} de ${a}°?`,
    illustration: angleView(a),
    hint: `Dos ángulos son ${supp ? 'suplementarios si suman 180°' : 'complementarios si suman 90°'}.`,
    steps: [`${supp ? 'Suplementarios' : 'Complementarios'}: suman ${total}°.`, `${total}° − ${a}° = ${answer}°.`],
    frames: [
      frame(`${supp ? 'Suplementario' : 'Complementario'} quiere decir que entre los dos suman ${total} grados.`, angleView(total, `${total}°`)),
      frame(`${total} − ${a} = ${answer}. El ángulo mide ${answer} grados.`, { kind: 'calc', lines: [`${total}° − ${a}° = ${answer}°`] }),
    ],
    hintFrames: [frame(`¿Cuánto le falta a ${a}° para llegar a ${total}°?`, angleView(a))],
  };
}

function buildPolygon(rng, sides) {
  const total = sides === 3 ? 180 : 360;
  // Ángulos con sentido: el que falta queda entre 20° y 170° (figura convexa).
  let known;
  let answer;
  do {
    known = Array.from({ length: sides - 1 }, () => rng.int(sides === 3 ? 25 : 60, sides === 3 ? 110 : 140));
    answer = total - known.reduce((a, b) => a + b, 0);
  } while (answer < 20 || answer > 170);
  const name = sides === 3 ? 'triángulo' : 'cuadrilátero';
  return {
    id: `${sides === 3 ? 'triangulo' : 'cuadrilatero'}:${known.join('-')}`,
    form: sides === 3 ? 'triangulo' : 'cuadrilatero',
    answerType: 'integer',
    answer,
    expression: `${known.map((v) => `${v}°`).join(' + ')} + □° = ${total}°`,
    story: `🔺 Un ${name} tiene ${sides - 1} ángulos de ${known.map((v) => `${v}°`).join(' y ')}. ¿Cuánto mide el otro?`,
    illustration: shapeView(sides === 3 ? 'triangle' : 'trapezoid', {}),
    hint: `Los ángulos de un ${name} suman ${total}°.`,
    steps: [`Suman ${total}°.`, `${total}° − ${known.join('° − ')}° = ${answer}°.`],
    frames: [
      frame(`Los ángulos de un ${name} siempre suman ${total} grados.`, shapeView(sides === 3 ? 'triangle' : 'trapezoid', {})),
      frame(`${total} menos ${known.join(' menos ')} es ${answer}.`, { kind: 'calc', lines: [`${total}° − ${known.join('° − ')}° = ${answer}°`] }),
    ],
    hintFrames: [frame(`Triángulo: 180°. Cuadrilátero: 360°.`, { kind: 'calc', lines: ['triángulo → 180°', 'cuadrilátero → 360°'] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'tipo' ? buildType(rng) : form === 'complementario' ? buildComplement(rng) : buildPolygon(rng, form === 'triangulo' ? 3 : 4);
  return { topicId: TOPIC_ID, level, theme: 'geometria', ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Tipos de ángulos',
    paragraphs: ['Agudo: menos de 90°. Recto: 90° (como la esquina de un folio). Obtuso: entre 90° y 180°. Llano: 180° (una línea recta).'],
    frames: [frame('Un ángulo agudo, de 45 grados.', angleView(45)), frame('Uno recto, de 90 grados.', angleView(90)), frame('Uno obtuso, de 130 grados.', angleView(130))],
  },
  {
    title: 'Ángulos que suman',
    paragraphs: [
      'Complementarios: suman 90°. Suplementarios: suman 180°.',
      'Los tres ángulos de cualquier triángulo suman 180°, y los cuatro de un cuadrilátero, 360°.',
    ],
    frames: [frame('Los ángulos de un triángulo suman 180 grados.', shapeView('triangle', {})), frame('60 + 70 + 50 = 180.', { kind: 'calc', lines: ['60° + 70° + 50° = 180°'] })],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Ángulos',
  emoji: '📐',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
