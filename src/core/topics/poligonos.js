// Tema: polígonos. Nombre según los lados, clasificar triángulos (por lados
// y por ángulos) y cuadriláteros.

import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES, shapeView, shuffle } from './geometria-comun.js';

const TOPIC_ID = 'poligonos';

export const FORMS = {
  nombre: 'El nombre según los lados',
  'triangulo-lados': 'Triángulos por sus lados',
  'triangulo-angulos': 'Triángulos por sus ángulos',
  cuadrilatero: 'Cuadriláteros',
};

const LEVELS = {
  1: { forms: [['nombre', 4], ['triangulo-lados', 3]] },
  2: { forms: [['triangulo-lados', 2], ['triangulo-angulos', 3], ['cuadrilatero', 3]] },
  3: { forms: [['cuadrilatero', 3], ['triangulo-angulos', 2], ['nombre', 1]] },
};

const NAMES = { 3: 'Triángulo', 4: 'Cuadrilátero', 5: 'Pentágono', 6: 'Hexágono', 7: 'Heptágono', 8: 'Octógono', 9: 'Eneágono', 10: 'Decágono' };

function buildName(rng) {
  const n = rng.int(3, 10);
  const pool = Object.values(NAMES).filter((x) => x !== NAMES[n]);
  return {
    id: `nombre:${n}`,
    form: 'nombre',
    answerType: 'choice',
    choices: shuffle(rng, [NAMES[n], ...shuffle(rng, pool).slice(0, 2)]),
    answer: NAMES[n],
    expression: `${n} lados → □`,
    story: `⭐ Recortas una figura de papel con ${n} lados. ¿Cómo se llama?`,
    illustration: shapeView('polygon', {}, { sides: n }),
    hint: 'Penta = 5, hexa = 6, hepta = 7, octo = 8, enea = 9, deca = 10.',
    steps: [`${n} lados: ${NAMES[n].toLowerCase()}.`],
    frames: [frame(`Contamos los lados: ${n}. Es un ${NAMES[n].toLowerCase()}.`, shapeView('polygon', {}, { sides: n }))],
    hintFrames: [frame('Cuenta los lados.', shapeView('polygon', {}, { sides: n }))],
  };
}

function buildTriangleSides(rng) {
  const kind = rng.pick(['Equilátero', 'Isósceles', 'Escaleno']);
  const a = rng.int(3, 12);
  const sides = kind === 'Equilátero' ? [a, a, a] : kind === 'Isósceles' ? [a, a, a + rng.int(1, 4)] : [a, a + 1, a + rng.int(2, 4)];
  return {
    id: `triangulo-lados:${sides.join('-')}`,
    form: 'triangulo-lados',
    answerType: 'choice',
    choices: ['Equilátero', 'Isósceles', 'Escaleno'],
    answer: kind,
    expression: `${sides.join(' cm, ')} cm → □`,
    story: `🔺 Un triángulo tiene lados de ${sides.join(' cm, ')} cm. ¿Qué tipo de triángulo es por sus lados?`,
    illustration: shapeView('triangle', {}),
    hint: 'Equilátero: 3 lados iguales. Isósceles: 2 iguales. Escaleno: todos distintos.',
    steps: [`Lados: ${sides.join(', ')}.`, `${kind === 'Equilátero' ? 'Los tres son iguales' : kind === 'Isósceles' ? 'Hay dos iguales' : 'Los tres son distintos'}: ${kind.toLowerCase()}.`],
    frames: [frame(`${kind === 'Equilátero' ? 'Los tres lados son iguales' : kind === 'Isósceles' ? 'Dos lados son iguales' : 'Los tres lados son distintos'}: es ${kind.toLowerCase()}.`, { kind: 'calc', lines: [`${sides.join(' · ')}`, kind] })],
    hintFrames: [frame('¿Cuántos lados iguales hay?', { kind: 'calc', lines: [sides.join(' · ')] })],
  };
}

function buildTriangleAngles(rng) {
  const kind = rng.pick(['Acutángulo', 'Rectángulo', 'Obtusángulo']);
  let angles;
  if (kind === 'Rectángulo') { const a = rng.int(20, 70); angles = [90, a, 90 - a]; }
  else if (kind === 'Obtusángulo') { const big = rng.int(100, 140); const a = rng.int(10, 180 - big - 10); angles = [big, a, 180 - big - a]; }
  else { const a = rng.int(50, 80); const b = rng.int(Math.max(10, 91 - a), 80); angles = [a, b, 180 - a - b]; }
  angles = shuffle(rng, angles);
  return {
    id: `triangulo-angulos:${angles.join('-')}`,
    form: 'triangulo-angulos',
    answerType: 'choice',
    choices: ['Acutángulo', 'Rectángulo', 'Obtusángulo'],
    answer: kind,
    expression: `${angles.join('°, ')}° → □`,
    story: `🔺 Un triángulo tiene ángulos de ${angles.join('°, ')}°. ¿Qué tipo es por sus ángulos?`,
    illustration: kind === 'Rectángulo' ? shapeView('right', {}) : shapeView('triangle', {}),
    hint: 'Acutángulo: los tres agudos. Rectángulo: uno de 90°. Obtusángulo: uno de más de 90°.',
    steps: [`El ángulo mayor es ${Math.max(...angles)}°.`, `${kind}.`],
    frames: [frame(`El ángulo mayor mide ${Math.max(...angles)} grados: el triángulo es ${kind.toLowerCase()}.`, { kind: 'calc', lines: [`${angles.join('° · ')}°`, kind] })],
    hintFrames: [frame('Mira el ángulo más grande.', { kind: 'calc', lines: [`${angles.join('° · ')}°`] })],
  };
}

const QUADS = [
  { name: 'Cuadrado', desc: '4 lados iguales y 4 ángulos rectos' },
  { name: 'Rectángulo', desc: 'lados iguales dos a dos y 4 ángulos rectos' },
  { name: 'Rombo', desc: '4 lados iguales pero sin ángulos rectos' },
  { name: 'Romboide', desc: 'lados paralelos dos a dos, sin lados iguales todos ni ángulos rectos' },
  { name: 'Trapecio', desc: 'solo dos lados paralelos' },
];

function buildQuad(rng) {
  const q = rng.pick(QUADS);
  return {
    id: `cuadrilatero:${q.name}`,
    form: 'cuadrilatero',
    answerType: 'choice',
    choices: shuffle(rng, [q.name, ...shuffle(rng, QUADS.filter((x) => x !== q).map((x) => x.name)).slice(0, 2)]),
    answer: q.name,
    expression: '□',
    story: `🟪 ¿Qué cuadrilátero tiene ${q.desc}?`,
    illustration: null,
    hint: 'Cuadrado y rombo tienen 4 lados iguales; cuadrado y rectángulo, 4 ángulos rectos; el trapecio solo tiene 2 lados paralelos.',
    steps: [`${q.desc[0].toUpperCase()}${q.desc.slice(1)}: ${q.name.toLowerCase()}.`],
    frames: [frame(`El cuadrilátero que tiene ${q.desc} es el ${q.name.toLowerCase()}.`, shapeView(q.name === 'Cuadrado' ? 'square' : q.name === 'Rectángulo' ? 'rect' : q.name === 'Rombo' ? 'rhombus' : 'trapezoid', {}))],
    hintFrames: [frame('Fíjate en los lados iguales y en los ángulos rectos.', { kind: 'calc', lines: ['cuadrado · rectángulo · rombo', 'romboide · trapecio'] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'nombre' ? buildName(rng) : form === 'triangulo-lados' ? buildTriangleSides(rng) : form === 'triangulo-angulos' ? buildTriangleAngles(rng) : buildQuad(rng);
  return { topicId: TOPIC_ID, level, theme: 'geometria', ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Polígonos',
    paragraphs: [
      'Un polígono es una figura cerrada de lados rectos. Se llama según sus lados: triángulo (3), cuadrilátero (4), pentágono (5), hexágono (6)…',
      'Triángulos por sus lados: equilátero (3 iguales), isósceles (2 iguales) y escaleno (ninguno igual). Por sus ángulos: acutángulo, rectángulo (uno de 90°) y obtusángulo.',
    ],
    frames: [frame('Un hexágono: 6 lados.', shapeView('polygon', {}, { sides: 6 })), frame('Un triángulo rectángulo: tiene un ángulo de 90 grados.', shapeView('right', {}))],
  },
  {
    title: 'Cuadriláteros',
    paragraphs: ['Cuadrado (4 lados iguales y 4 ángulos rectos), rectángulo, rombo (4 lados iguales, sin ángulos rectos), romboide y trapecio (solo 2 lados paralelos).'],
    frames: [frame('Un rombo: cuatro lados iguales.', shapeView('rhombus', {})), frame('Un trapecio: solo dos lados paralelos.', shapeView('trapezoid', {}))],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Polígonos',
  emoji: '⬡',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
