// Tema: problemas con ecuaciones. Plantear la ecuación (elegir) y resolverla.

import { frame } from '../explain/storyboard.js';
import { balanceView, BLOCK, generator, LEVEL_NAMES, shuffle } from './algebra-comun.js';

const TOPIC_ID = 'ecuaciones-problemas';

export const FORMS = {
  plantear: 'Plantear la ecuación',
  resolver: 'Resolver el problema',
};

const LEVELS = {
  1: { forms: [['plantear', 3], ['resolver', 2]], kinds: ['doble', 'mas', 'precio'] },
  2: { forms: [['plantear', 2], ['resolver', 3]], kinds: ['doble', 'mas', 'precio', 'edades', 'consecutivos'] },
  3: { forms: [['resolver', 4], ['plantear', 1]], kinds: ['edades', 'consecutivos', 'perimetro', 'precio'] },
};

// Cada tipo: la historia, la ecuación (bien y mal) y cómo se resuelve.
function makeProblem(rng, kind) {
  if (kind === 'doble') {
    const x = rng.int(3, 20);
    const b = rng.int(1, 10);
    const total = 2 * x + b;
    return {
      story: `🎨 El doble de las cartas que has decorado más ${b} da ${total}. ¿Cuántas cartas has decorado?`,
      eq: `2x + ${b} = ${total}`, wrong: [`2(x + ${b}) = ${total}`, `x + 2 + ${b} = ${total}`, `2x = ${total} + ${b}`],
      x, steps: [['2x + ' + b + ' = ' + total, `2x + ${b}`, String(total)], [`2x = ${total - b}`, '2x', String(total - b)], [`x = ${x}`, 'x', String(x)]],
    };
  }
  if (kind === 'mas') {
    const x = rng.int(5, 30);
    const b = rng.int(3, 15);
    return {
      story: `🏐 Si a los puntos que has hecho hoy les sumas ${b}, te salen ${x + b}. ¿Cuántos puntos has hecho?`,
      eq: `x + ${b} = ${x + b}`, wrong: [`${b}x = ${x + b}`, `x − ${b} = ${x + b}`, `x = ${x + b} + ${b}`],
      x, steps: [[`x + ${b} = ${x + b}`, `x + ${b}`, String(x + b)], [`x = ${x + b} − ${b} = ${x}`, 'x', String(x)]],
    };
  }
  if (kind === 'precio') {
    const n = rng.int(2, 6);
    const x = rng.int(2, 9);
    const b = rng.int(1, 5);
    const total = n * x + b;
    return {
      story: `🥞 Compras ${n} crepes iguales y un zumo de ${b} €. Pagas ${total} € en total. ¿Cuánto cuesta cada crepe?`,
      eq: `${n}x + ${b} = ${total}`, wrong: [`${n} + x + ${b} = ${total}`, `${n}(x + ${b}) = ${total}`, `x + ${b} = ${total}`],
      x, steps: [[`${n}x + ${b} = ${total}`, `${n}x + ${b}`, String(total)], [`${n}x = ${total - b}`, `${n}x`, String(total - b)], [`x = ${x}`, 'x', String(x)]],
    };
  }
  if (kind === 'edades') {
    const x = rng.int(8, 14);
    const k = rng.int(3, 4);
    const sumAges = x + k * x;
    return {
      story: `👩‍👧 Tu tía tiene ${k} veces la edad de su hija, tu prima. Entre las dos suman ${sumAges} años. ¿Cuántos años tiene tu prima?`,
      eq: `x + ${k}x = ${sumAges}`, wrong: [`${k}x = ${sumAges}`, `x + ${k} = ${sumAges}`, `${k}(x + ${sumAges}) = 0`],
      x, steps: [[`x + ${k}x = ${sumAges}`, `x + ${k}x`, String(sumAges)], [`${k + 1}x = ${sumAges}`, `${k + 1}x`, String(sumAges)], [`x = ${x}`, 'x', String(x)]],
    };
  }
  if (kind === 'consecutivos') {
    const x = rng.int(5, 40);
    const total = 3 * x + 3;
    return {
      story: `🔢 Tres números seguidos suman ${total}. ¿Cuál es el más pequeño?`,
      eq: `x + (x + 1) + (x + 2) = ${total}`, wrong: [`x + x + x = ${total}`, `x + 1 + 2 = ${total}`, `3x + 1 = ${total}`],
      x, steps: [[`x + (x + 1) + (x + 2) = ${total}`, 'x + x+1 + x+2', String(total)], [`3x + 3 = ${total}`, '3x + 3', String(total)], [`3x = ${total - 3}`, '3x', String(total - 3)], [`x = ${x}`, 'x', String(x)]],
    };
  }
  // perímetro de un rectángulo con el largo = ancho + d
  const x = rng.int(3, 15);
  const d = rng.int(2, 8);
  const p = 2 * x + 2 * (x + d);
  return {
    story: `📐 Un mural rectangular mide ${d} m más de largo que de ancho y su perímetro es ${p} m. ¿Cuánto mide de ancho?`,
    eq: `2x + 2(x + ${d}) = ${p}`, wrong: [`x + (x + ${d}) = ${p}`, `2x + ${d} = ${p}`, `x · (x + ${d}) = ${p}`],
    x, steps: [[`2x + 2(x + ${d}) = ${p}`, `2x + 2(x+${d})`, String(p)], [`4x + ${2 * d} = ${p}`, `4x + ${2 * d}`, String(p)], [`4x = ${p - 2 * d}`, '4x', String(p - 2 * d)], [`x = ${x}`, 'x', String(x)]],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const kind = rng.pick(cfg.kinds);
  const pr = makeProblem(rng, kind);
  const frames = [
    frame('Llamamos x a lo que no sabemos y escribimos la ecuación.', balanceView(pr.eq.split(' = ')[0], pr.eq.split(' = ')[1])),
    ...pr.steps.slice(1).map(([say, l, r]) => frame(`${say}.`, balanceView(l, r))),
    frame(`Comprobamos en el enunciado: x = ${pr.x} cumple lo que dice.`, { kind: 'calc', lines: [`x = ${pr.x} ✔`] }),
  ];
  const base = {
    topicId: TOPIC_ID,
    level,
    form,
    theme: 'algebra',
    illustration: null,
    story: pr.story,
    hint: 'Llama x a lo que te preguntan, traduce el enunciado a una igualdad y resuélvela.',
    steps: [`Ecuación: ${pr.eq}.`, ...pr.steps.slice(1).map(([say]) => `${say}.`)],
    frames,
    hintFrames: frames.slice(0, 1),
  };
  if (form === 'plantear') {
    return {
      ...base,
      id: `plantear:${pr.eq}`,
      answerType: 'choice',
      choices: shuffle(rng, [pr.eq, ...shuffle(rng, pr.wrong).slice(0, 2)]),
      answer: pr.eq,
      expression: 'Ecuación: □',
      story: `${pr.story} ¿Qué ecuación lo describe?`,
      steps: [`Ecuación: ${pr.eq}.`],
      frames: frames.slice(0, 1),
    };
  }
  return { ...base, id: `resolver:${pr.eq}`, answerType: 'integer', answer: pr.x, expression: 'x = □' };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Del problema a la ecuación',
    paragraphs: [
      '1) Llama x a lo que te preguntan. 2) Escribe el enunciado como una igualdad. 3) Resuélvela. 4) Comprueba que tiene sentido.',
      '«Compras 3 crepes iguales y un zumo de 2 €, y pagas 14 €»: 3x + 2 = 14, así que 3x = 12 y x = 4 € cada crepe.',
    ],
    frames: [
      frame('3 crepes de x € y un zumo de 2 €: 3x + 2 = 14.', balanceView('3x + 2', '14')),
      frame('Restamos 2: 3x = 12.', balanceView('3x', '12')),
      frame('Dividimos entre 3: x = 4. Cada crepe cuesta 4 €.', balanceView('x', '4')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Problemas con ecuaciones',
  emoji: '🕵️‍♀️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
