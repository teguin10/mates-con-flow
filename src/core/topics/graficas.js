// Tema: interpretar gráficas. Leer un valor, el máximo y si crece o decrece.

import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES, planeView } from './funciones-comun.js';

const TOPIC_ID = 'graficas';

export const FORMS = {
  leer: 'Leer un valor en la gráfica',
  maximo: 'Cuándo es el máximo o el mínimo',
  crece: 'Si crece o decrece',
};

const LEVELS = {
  1: { forms: [['leer', 4], ['maximo', 2]] },
  2: { forms: [['leer', 2], ['maximo', 3], ['crece', 3]] },
  3: { forms: [['crece', 3], ['maximo', 3], ['leer', 1]] },
};

// Situaciones: qué se mide en cada eje y cómo nombrarlo.
const SITUATIONS = [
  { x: 'hora', y: '°C', what: 'la temperatura', story: '🌡️ La gráfica muestra la temperatura durante la excursión.', xs: [8, 9, 10, 11, 12, 13, 14], range: [2, 16] },
  { x: 'min', y: 'km', what: 'la distancia a casa', story: '🚲 La gráfica muestra a qué distancia de casa estás en tu paseo en bici.', xs: [0, 10, 20, 30, 40, 50, 60], range: [0, 9] },
  { x: 'mes', y: '€', what: 'el dinero de tu hucha', story: '🐷 La gráfica muestra el dinero de tu hucha cada mes.', xs: [1, 2, 3, 4, 5, 6, 7], range: [0, 14] },
];

function makeGraph(rng) {
  const sit = rng.pick(SITUATIONS);
  const ys = [];
  let y = rng.int(sit.range[0], sit.range[1]);
  for (let i = 0; i < sit.xs.length; i += 1) {
    ys.push(y);
    y = Math.min(sit.range[1], Math.max(sit.range[0], y + rng.pick([-3, -2, -1, 1, 2, 3])));
  }
  return { sit, ys };
}

function view(sit, ys, focus = null) {
  return planeView({
    poly: sit.xs.map((x, i) => [x, ys[i]]),
    points: sit.xs.map((x, i) => ({ x, y: ys[i], focus: focus === i, label: focus === i ? `${ys[i]}` : null })),
    min: sit.xs[0], max: sit.xs.at(-1), yMin: 0, yMax: sit.range[1] + 2, xLabel: sit.x, yLabel: sit.y,
  });
}

function buildRead(rng) {
  const { sit, ys } = makeGraph(rng);
  const i = rng.int(0, sit.xs.length - 1);
  return {
    id: `leer:${sit.what}:${ys.join(',')}:${i}`,
    form: 'leer',
    answerType: 'integer',
    answer: ys[i],
    expression: `${sit.x} ${sit.xs[i]} → □ ${sit.y}`,
    story: `${sit.story} ¿Cuánto vale ${sit.what} cuando ${sit.x === 'hora' ? 'son las' : sit.x === 'min' ? 'han pasado' : 'es el mes'} ${sit.xs[i]}${sit.x === 'min' ? ' minutos' : ''}?`,
    illustration: view(sit, ys),
    hint: `Busca ${sit.xs[i]} en el eje horizontal, sube hasta la línea y mira a qué altura está.`,
    steps: [`En ${sit.xs[i]} la gráfica está a la altura ${ys[i]}.`],
    frames: [
      frame(`Buscamos ${sit.xs[i]} abajo y subimos hasta la línea.`, view(sit, ys, i)),
      frame(`Está a la altura ${ys[i]}: ${ys[i]} ${sit.y}.`, view(sit, ys, i)),
    ],
    hintFrames: [frame(`Busca ${sit.xs[i]} en el eje de abajo.`, view(sit, ys))],
  };
}

function buildMax(rng) {
  let g;
  do g = makeGraph(rng); while (new Set(g.ys).size < 3 || g.ys.filter((v) => v === Math.max(...g.ys)).length > 1 || g.ys.filter((v) => v === Math.min(...g.ys)).length > 1);
  const { sit, ys } = g;
  const max = rng.next() < 0.6;
  const value = max ? Math.max(...ys) : Math.min(...ys);
  const i = ys.indexOf(value);
  return {
    id: `maximo:${sit.what}:${ys.join(',')}:${max}`,
    form: 'maximo',
    answerType: 'integer',
    answer: sit.xs[i],
    expression: `${max ? 'máximo' : 'mínimo'} en ${sit.x} □`,
    story: `${sit.story} ¿En qué ${sit.x === 'hora' ? 'hora' : sit.x === 'min' ? 'minuto' : 'mes'} es ${sit.what} ${max ? 'más alta (el máximo)' : 'más baja (el mínimo)'}?`,
    illustration: view(sit, ys),
    hint: `El ${max ? 'máximo es el punto más alto' : 'mínimo es el punto más bajo'} de la gráfica; mira qué valor tiene debajo.`,
    steps: [`El punto más ${max ? 'alto' : 'bajo'} vale ${value}.`, `Está en ${sit.xs[i]}.`],
    frames: [
      frame(`Buscamos el punto más ${max ? 'alto' : 'bajo'} de la gráfica: ${value}.`, view(sit, ys, i)),
      frame(`Debajo está el ${sit.xs[i]}.`, view(sit, ys, i)),
    ],
    hintFrames: [frame(`¿Dónde está el punto más ${max ? 'alto' : 'bajo'}?`, view(sit, ys))],
  };
}

function buildGrow(rng) {
  let g;
  let i;
  do {
    g = makeGraph(rng);
    i = rng.int(0, g.sit.xs.length - 2);
  } while (g.ys[i] === g.ys[i + 1]);
  const { sit, ys } = g;
  const up = ys[i + 1] > ys[i];
  return {
    id: `crece:${sit.what}:${ys.join(',')}:${i}`,
    form: 'crece',
    answerType: 'choice',
    choices: ['Crece', 'Decrece'],
    answer: up ? 'Crece' : 'Decrece',
    expression: `de ${sit.xs[i]} a ${sit.xs[i + 1]} → □`,
    story: `${sit.story} Entre ${sit.xs[i]} y ${sit.xs[i + 1]}, ¿${sit.what} crece o decrece?`,
    illustration: view(sit, ys),
    hint: 'Leyendo de izquierda a derecha: si la línea sube, crece; si baja, decrece.',
    steps: [`Pasa de ${ys[i]} a ${ys[i + 1]}: ${up ? 'sube, crece' : 'baja, decrece'}.`],
    frames: [frame(`De ${sit.xs[i]} a ${sit.xs[i + 1]} la línea ${up ? 'sube' : 'baja'}: de ${ys[i]} a ${ys[i + 1]}. ${up ? 'Crece' : 'Decrece'}.`, view(sit, ys, i + 1))],
    hintFrames: [frame('¿La línea sube o baja?', view(sit, ys))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'leer' ? buildRead(rng) : form === 'maximo' ? buildMax(rng) : buildGrow(rng);
  return { topicId: TOPIC_ID, level, theme: 'funciones', ...ex };
}

export const generate = generator(build);

const sample = { sit: SITUATIONS[0], ys: [6, 8, 11, 14, 13, 10, 9] };

export const INTRO = [
  {
    title: 'Leer una gráfica',
    paragraphs: [
      'En una gráfica, abajo (eje horizontal) va lo que cambia solo, como la hora; a la izquierda (eje vertical), lo que se mide, como la temperatura.',
      'Si de izquierda a derecha la línea sube, la función crece; si baja, decrece. El punto más alto es el máximo y el más bajo, el mínimo.',
    ],
    frames: [
      frame('La temperatura durante la mañana.', view(sample.sit, sample.ys)),
      frame('A las 11 se llega al máximo: 14 grados.', view(sample.sit, sample.ys, 3)),
      frame('Después baja: decrece.', view(sample.sit, sample.ys, 5)),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Interpretar gráficas',
  emoji: '📉',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
