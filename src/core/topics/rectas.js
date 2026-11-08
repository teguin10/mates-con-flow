// Tema: rectas y = mx + n. Pendiente y ordenada en el origen, creciente o
// decreciente, lineal o afín, y el corte con el eje X.

import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES, linear, num, planeView } from './funciones-comun.js';

const TOPIC_ID = 'rectas';

export const FORMS = {
  pendiente: 'La pendiente',
  ordenada: 'La ordenada en el origen',
  crece: 'Creciente o decreciente',
  tipo: 'Lineal o afín',
  'corte-x': 'Corte con el eje X',
};

const LEVELS = {
  1: { forms: [['pendiente', 3], ['ordenada', 3], ['crece', 2]] },
  2: { forms: [['crece', 2], ['tipo', 3], ['pendiente', 2], ['ordenada', 1]] },
  3: { forms: [['corte-x', 4], ['tipo', 1], ['crece', 1]] },
};

const lineView = (m, n, points = []) => planeView({ line: { a: m, b: n }, points });

function coeffs(rng, allowZeroN = true) {
  const m = rng.pick([1, 2, 3, -1, -2, -3, 4, -4]);
  const n = allowZeroN && rng.next() < 0.3 ? 0 : rng.int(-5, 5) || 2;
  return { m, n };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const base = { topicId: TOPIC_ID, level, theme: 'funciones' };
  if (form === 'corte-x') {
    // m divide a n para que el corte sea entero.
    const m = rng.pick([1, 2, -1, -2, 3]);
    const x0 = rng.int(-4, 4) || 2;
    const n = -m * x0;
    const expr = `y = ${linear(m, n)}`;
    return {
      ...base,
      id: `corte-x:${m}:${n}`,
      form,
      answerType: 'integer',
      answer: x0,
      expression: `${expr}: corta el eje X en x = □`,
      story: `✂️ ¿En qué punto corta la recta ${expr} al eje X?`,
      illustration: lineView(m, n),
      hint: 'En el eje X, y vale 0: iguala la expresión a 0 y despeja x.',
      steps: [`0 = ${linear(m, n)}.`, `x = ${num(x0)}.`],
      frames: [
        frame('En el eje X la y vale 0, así que igualamos a 0.', { kind: 'calc', lines: [`0 = ${linear(m, n)}`] }),
        frame(`Despejamos: x = ${num(x0)}. La recta corta en (${num(x0)}, 0).`, lineView(m, n, [{ x: x0, y: 0, label: `(${num(x0)}, 0)`, focus: true }])),
      ],
      hintFrames: [frame('En el eje X, y = 0.', lineView(m, n))],
    };
  }
  const { m, n } = coeffs(rng, form !== 'ordenada');
  const expr = `y = ${linear(m, n)}`;
  if (form === 'pendiente' || form === 'ordenada') {
    const slope = form === 'pendiente';
    const answer = slope ? m : n;
    return {
      ...base,
      id: `${form}:${m}:${n}`,
      form,
      answerType: 'integer',
      answer,
      expression: `${expr} → ${slope ? 'pendiente' : 'ordenada'} = □`,
      story: `📈 En la recta ${expr}, ¿cuánto vale ${slope ? 'la pendiente' : 'la ordenada en el origen'}?`,
      illustration: lineView(m, n),
      hint: 'En y = mx + n, la pendiente es m (el número que multiplica a x) y la ordenada en el origen es n (el número suelto, donde corta al eje Y).',
      steps: [slope ? `El número que multiplica a x es ${num(m)}: pendiente ${num(m)}.` : `El número suelto es ${num(n)}: la recta corta al eje Y en ${num(n)}.`],
      frames: [
        frame('En y = m x + n, m es la pendiente y n la ordenada en el origen.', { kind: 'calc', lines: ['y = m·x + n', expr] }),
        slope
          ? frame(`La pendiente es ${num(m)}: por cada paso a la derecha, la recta ${m > 0 ? 'sube' : 'baja'} ${Math.abs(m)}.`, lineView(m, n, [{ x: 0, y: n }, { x: 1, y: m + n, focus: true }]))
          : frame(`La ordenada es ${num(n)}: la recta corta al eje Y en (0, ${num(n)}).`, lineView(m, n, [{ x: 0, y: n, label: `(0, ${num(n)})`, focus: true }])),
      ],
      hintFrames: [frame('y = m·x + n', { kind: 'calc', lines: ['y = m·x + n', expr] })],
    };
  }
  if (form === 'crece') {
    return {
      ...base,
      id: `crece:${m}:${n}`,
      form,
      answerType: 'choice',
      choices: ['Creciente', 'Decreciente'],
      answer: m > 0 ? 'Creciente' : 'Decreciente',
      expression: `${expr} → □`,
      story: `↗️ ¿La recta ${expr} es creciente o decreciente?`,
      illustration: null,
      hint: 'Si la pendiente es positiva, la recta sube (creciente); si es negativa, baja (decreciente).',
      steps: [`La pendiente es ${num(m)}, ${m > 0 ? 'positiva: creciente' : 'negativa: decreciente'}.`],
      frames: [frame(`La pendiente es ${num(m)}: la recta ${m > 0 ? 'sube, es creciente' : 'baja, es decreciente'}.`, lineView(m, n))],
      hintFrames: [frame('Mira el signo de la pendiente.', { kind: 'calc', lines: [expr] })],
    };
  }
  // tipo: lineal (pasa por el origen, n = 0) o afín
  const useN = rng.next() < 0.5 ? 0 : n || 3;
  const e2 = `y = ${linear(m, useN)}`;
  return {
    ...base,
    id: `tipo:${m}:${useN}`,
    form: 'tipo',
    answerType: 'choice',
    choices: ['Lineal', 'Afín'],
    answer: useN === 0 ? 'Lineal' : 'Afín',
    expression: `${e2} → □`,
    story: `🧭 ¿La función ${e2} es lineal o afín?`,
    illustration: null,
    hint: 'Lineal: y = mx (pasa por el origen, no tiene número suelto). Afín: y = mx + n con n distinto de 0.',
    steps: [useN === 0 ? 'No tiene número suelto: pasa por (0, 0). Es lineal.' : `Tiene número suelto (${num(useN)}): no pasa por el origen. Es afín.`],
    frames: [frame(useN === 0 ? 'Pasa por el origen: es lineal.' : `Corta al eje Y en ${num(useN)}, no en el origen: es afín.`, lineView(m, useN, [{ x: 0, y: useN, focus: true }]))],
    hintFrames: [frame('¿Tiene número suelto?', { kind: 'calc', lines: [e2] })],
  };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'La recta y = mx + n',
    paragraphs: [
      'm es la pendiente: lo que sube (o baja) la recta por cada paso a la derecha. Si m es positiva, crece; si es negativa, decrece.',
      'n es la ordenada en el origen: donde la recta corta al eje Y. Si n = 0, la función es lineal (pasa por el origen); si no, es afín.',
    ],
    frames: [
      frame('y = 2x + 1: la pendiente es 2 y corta al eje Y en 1.', lineView(2, 1, [{ x: 0, y: 1, label: '(0, 1)', focus: true }])),
      frame('y = −x + 3: pendiente negativa, la recta baja.', lineView(-1, 3)),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Rectas: pendiente y ordenada',
  emoji: '📈',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
