// Tema: ecuaciones de primer grado. Comprobar una solución y resolver
// (x + a = b, ax = b, ax + b = c y, en el nivel Pro, con x en los dos lados).

import { frame } from '../explain/storyboard.js';
import { balanceView, BLOCK, generator, LEVEL_NAMES, linear, MINUS, num, sum } from './algebra-comun.js';

const TOPIC_ID = 'ecuaciones';

export const FORMS = {
  comprobar: '¿Es solución?',
  'un-paso': 'Un paso (x + 5 = 12, 3x = 21)',
  'dos-pasos': 'Dos pasos (2x + 3 = 11)',
  'dos-lados': 'Con x en los dos lados (5x − 2 = 3x + 6)',
};

const LEVELS = {
  1: { forms: [['comprobar', 2], ['un-paso', 4]], neg: false },
  2: { forms: [['un-paso', 1], ['dos-pasos', 4], ['comprobar', 1]], neg: true },
  3: { forms: [['dos-pasos', 2], ['dos-lados', 4]], neg: true },
};

const solution = (rng, neg) => (neg && rng.next() < 0.3 ? -rng.int(1, 9) : rng.int(1, 12));

function buildCheck(rng) {
  const a = rng.int(2, 6);
  const x = rng.int(1, 9);
  const b = rng.int(1, 15);
  const c = a * x + b;
  const tried = rng.next() < 0.5 ? x : x + rng.pick([-1, 1, 2]);
  const left = a * tried + b;
  const ok = left === c;
  return {
    id: `comprobar:${linear(a, b)}=${c}:${tried}`,
    form: 'comprobar',
    answerType: 'choice',
    choices: ['Sí', 'No'],
    answer: ok ? 'Sí' : 'No',
    expression: `${linear(a, b)} = ${c}, ¿x = ${tried}? □`,
    story: `✅ ¿x = ${tried} es solución de ${linear(a, b)} = ${c}?`,
    hint: `Cambia la x por ${tried} y mira si los dos lados dan lo mismo.`,
    steps: [`${a} · ${tried} + ${b} = ${left}.`, ok ? `${left} = ${c}: sí es solución.` : `${left} ≠ ${c}: no es solución.`],
    frames: [
      frame(`Ponemos ${tried} en lugar de x: ${a} por ${tried} más ${b} es ${left}.`, balanceView(`${a} · ${tried} + ${b} = ${left}`, String(c))),
      frame(ok ? `Los dos lados dan ${c}: la balanza está equilibrada. Sí es solución.` : `${left} no es ${c}: la balanza no está equilibrada. No es solución.`, balanceView(String(left), String(c), ok ? '⚖️ equilibrada' : '✘ no equilibrada')),
    ],
    hintFrames: [frame(`Sustituye x por ${tried}.`, balanceView(linear(a, b), String(c)))],
  };
}

function stepFrames(steps) {
  return steps.map(([say, left, right]) => frame(say, balanceView(left, right)));
}

function buildOneStep(rng, neg) {
  const x = solution(rng, neg);
  if (rng.next() < 0.5) {
    const a = rng.int(2, 15) * (neg && rng.next() < 0.3 ? -1 : 1);
    const b = x + a;
    const steps = [
      ['Queremos dejar la x sola en un lado de la balanza.', linear(1, a), num(b)],
      [`${a > 0 ? `Quitamos ${a} de los dos lados` : `Sumamos ${-a} a los dos lados`}.`, 'x', `${num(b)} ${a > 0 ? MINUS : '+'} ${Math.abs(a)}`],
      [`x = ${num(x)}.`, 'x', num(x)],
    ];
    return {
      id: `un-paso:${linear(1, a)}=${b}`,
      form: 'un-paso',
      answerType: 'integer',
      answer: x,
      expression: `${linear(1, a)} = ${num(b)}  →  x = □`,
      story: `⚖️ Resuelve: ${linear(1, a)} = ${num(b)}.`,
      hint: `Lo que está sumando pasa al otro lado restando (y al revés).`,
      steps: [`x = ${num(b)} ${a > 0 ? MINUS : '+'} ${Math.abs(a)}.`, `x = ${num(x)}.`],
      frames: stepFrames(steps),
      hintFrames: stepFrames(steps.slice(0, 1)),
    };
  }
  const a = rng.int(2, 9) * (neg && rng.next() < 0.3 ? -1 : 1);
  const b = a * x;
  const steps = [
    ['Queremos dejar la x sola.', `${num(a)}x`, num(b)],
    [`Dividimos los dos lados entre ${num(a)}.`, 'x', `${num(b)} : ${a < 0 ? `(${num(a)})` : a}`],
    [`x = ${num(x)}.`, 'x', num(x)],
  ];
  return {
    id: `un-paso:${a}x=${b}`,
    form: 'un-paso',
    answerType: 'integer',
    answer: x,
    expression: `${num(a)}x = ${num(b)}  →  x = □`,
    story: `⚖️ Resuelve: ${num(a)}x = ${num(b)}.`,
    hint: `Lo que multiplica a la x pasa al otro lado dividiendo.`,
    steps: [`x = ${num(b)} : ${a < 0 ? `(${num(a)})` : a}.`, `x = ${num(x)}.`],
    frames: stepFrames(steps),
    hintFrames: stepFrames(steps.slice(0, 1)),
  };
}

function buildTwoSteps(rng, neg) {
  const x = solution(rng, neg);
  const a = rng.int(2, 9);
  const b = rng.int(-12, 12) || 4;
  const c = a * x + b;
  const steps = [
    ['Primero dejamos sola la parte con x.', linear(a, b), num(c)],
    [`${b > 0 ? `Restamos ${b}` : `Sumamos ${-b}`} en los dos lados: ${a}x = ${num(c - b)}.`, `${a}x`, num(c - b)],
    [`Dividimos entre ${a}: x = ${num(x)}.`, 'x', num(x)],
  ];
  return {
    id: `dos-pasos:${linear(a, b)}=${c}`,
    form: 'dos-pasos',
    answerType: 'integer',
    answer: x,
    expression: `${linear(a, b)} = ${num(c)}  →  x = □`,
    story: `⚖️ Resuelve: ${linear(a, b)} = ${num(c)}.`,
    hint: `Primero pasa el ${num(b)} al otro lado (cambiando su signo); después divide entre ${a}.`,
    steps: [`${a}x = ${num(c)} ${b > 0 ? MINUS : '+'} ${Math.abs(b)} = ${num(c - b)}.`, `x = ${num(c - b)} : ${a} = ${num(x)}.`],
    frames: stepFrames(steps),
    hintFrames: stepFrames(steps.slice(0, 1)),
  };
}

function buildBothSides(rng) {
  const x = solution(rng, true);
  const c = rng.int(1, 5);
  const a = c + rng.int(1, 4);
  const b = rng.int(-10, 10) || -3;
  const d = (a - c) * x + b;
  const leftE = linear(a, b);
  const rightE = linear(c, d);
  const steps = [
    ['Juntamos las x en un lado y los números en el otro.', leftE, rightE],
    [`Pasamos ${c}x a la izquierda restando y ${num(b)} a la derecha cambiando el signo.`, sum([[a, 'x'], [-c, 'x']]), `${num(d)} ${b > 0 ? MINUS : '+'} ${Math.abs(b)}`],
    [`${a - c}x = ${num(d - b)}.`, `${a - c}x`, num(d - b)],
    [`Dividimos entre ${a - c}: x = ${num(x)}.`, 'x', num(x)],
  ];
  return {
    id: `dos-lados:${leftE}=${rightE}`,
    form: 'dos-lados',
    answerType: 'integer',
    answer: x,
    expression: `${leftE} = ${rightE}  →  x = □`,
    story: `⚖️ Resuelve: ${leftE} = ${rightE}.`,
    hint: 'Pasa las x a un lado y los números al otro, cambiando el signo de lo que cambias de lado.',
    steps: [`${a}x ${MINUS} ${c}x = ${num(d)} ${b > 0 ? MINUS : '+'} ${Math.abs(b)}.`, `${a - c}x = ${num(d - b)}.`, `x = ${num(x)}.`],
    frames: stepFrames(steps),
    hintFrames: stepFrames(steps.slice(0, 1)),
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'comprobar' ? buildCheck(rng)
    : form === 'un-paso' ? buildOneStep(rng, cfg.neg)
      : form === 'dos-pasos' ? buildTwoSteps(rng, cfg.neg)
        : buildBothSides(rng);
  return { topicId: TOPIC_ID, level, theme: 'algebra', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Una ecuación es una balanza',
    paragraphs: [
      'En x + 5 = 12, los dos lados pesan lo mismo. Si quitas 5 de los dos lados, sigue equilibrada: x = 7.',
      'Truco: lo que suma pasa restando, lo que resta pasa sumando, lo que multiplica pasa dividiendo.',
    ],
    frames: stepFrames([
      ['x + 5 = 12: la balanza está equilibrada.', 'x + 5', '12'],
      ['Quitamos 5 de los dos lados.', 'x', '12 − 5'],
      ['x = 7.', 'x', '7'],
    ]),
  },
  {
    title: 'Dos pasos',
    paragraphs: ['2x + 3 = 11: primero quitas el 3 (2x = 8) y después divides entre 2 (x = 4). Comprueba: 2 · 4 + 3 = 11. ✔'],
    frames: stepFrames([
      ['2x + 3 = 11.', '2x + 3', '11'],
      ['Restamos 3: 2x = 8.', '2x', '8'],
      ['Dividimos entre 2: x = 4.', 'x', '4'],
    ]),
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Ecuaciones',
  emoji: '⚖️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
