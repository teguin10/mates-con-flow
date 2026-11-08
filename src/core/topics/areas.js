// Tema: perímetros y áreas de cuadrado, rectángulo, triángulo, rombo,
// trapecio y polígono regular.

import { add, div, fr, mul } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, D, generator, LEVEL_NAMES, shapeView } from './geometria-comun.js';

const TOPIC_ID = 'areas';

export const FORMS = {
  perimetro: 'Perímetro',
  'area-cuadrilatero': 'Área del cuadrado y del rectángulo',
  'area-triangulo': 'Área del triángulo',
  'area-otros': 'Área del rombo, del trapecio y del polígono regular',
};

const LEVELS = {
  1: { forms: [['perimetro', 3], ['area-cuadrilatero', 3]] },
  2: { forms: [['area-cuadrilatero', 2], ['area-triangulo', 3], ['perimetro', 2]] },
  3: { forms: [['area-otros', 4], ['area-triangulo', 2]] },
};

const n = (v) => fr(v, 1);
const CONTEXT = [
  '🎨 El mural que vais a pintar', '🧵 Una manualidad de cartulina', '🌷 El huerto de tu abuela', '🖼️ Un póster para tu habitación',
];

function buildPerimeter(rng) {
  const shape = rng.pick(['square', 'rect', 'triangle']);
  let sides;
  let labels;
  if (shape === 'square') { const l = rng.int(2, 15); sides = [l, l, l, l]; labels = { side: `${l} m` }; }
  else if (shape === 'rect') { const b = rng.int(3, 18); const h = rng.int(2, 12); sides = [b, h, b, h]; labels = { base: `${b} m`, height: `${h} m` }; }
  else { sides = [rng.int(3, 12), rng.int(3, 12), rng.int(3, 12)].sort((a, b) => a - b); if (sides[0] + sides[1] <= sides[2]) sides[2] = sides[0] + sides[1] - 1; labels = {}; }
  const p = sides.reduce((a, b) => a + b, 0);
  const name = { square: 'cuadrado', rect: 'rectángulo', triangle: 'triángulo' }[shape];
  return {
    id: `perimetro:${shape}:${sides.join('-')}`,
    form: 'perimetro',
    answerType: 'decimal',
    answer: n(p),
    expression: `P = □ m`,
    story: `${rng.pick(CONTEXT)} tiene forma de ${name}${shape === 'triangle' ? ` con lados de ${sides.join(' m, ')} m` : ''}. ¿Cuánto mide su perímetro (el borde)?`,
    illustration: shapeView(shape, labels),
    hint: 'El perímetro es la suma de todos los lados.',
    steps: [`P = ${sides.join(' + ')} = ${p} m.`],
    frames: [
      frame('El perímetro es lo que mide el borde: sumamos todos los lados.', shapeView(shape, labels)),
      frame(`${sides.join(' más ')} es ${p}.`, { kind: 'calc', lines: [`P = ${sides.join(' + ')} = ${p} m`] }),
    ],
    hintFrames: [frame('Suma todos los lados.', shapeView(shape, labels))],
  };
}

function buildQuadArea(rng) {
  const square = rng.next() < 0.4;
  const b = rng.int(2, 15);
  const h = square ? b : rng.int(2, 12);
  const labels = square ? { side: `${b} m` } : { base: `${b} m`, height: `${h} m` };
  return {
    id: `area-cuadrilatero:${b}:${h}`,
    form: 'area-cuadrilatero',
    answerType: 'decimal',
    answer: n(b * h),
    expression: `A = □ m²`,
    story: `${rng.pick(CONTEXT)} es ${square ? `un cuadrado de ${b} m de lado` : `un rectángulo de ${b} m por ${h} m`}. ¿Cuál es su área?`,
    illustration: shapeView(square ? 'square' : 'rect', labels),
    hint: square ? 'Área del cuadrado = lado × lado.' : 'Área del rectángulo = base × altura.',
    steps: [`A = ${b} × ${h} = ${b * h} m².`],
    frames: [
      frame(square ? 'El área del cuadrado es lado por lado.' : 'El área del rectángulo es base por altura.', shapeView(square ? 'square' : 'rect', labels)),
      frame(`${b} por ${h} es ${b * h}: ${b * h} metros cuadrados.`, { kind: 'calc', lines: [`A = ${b} × ${h} = ${b * h} m²`], grid: b <= 10 && h <= 10 ? { rows: h, cols: b } : null }),
    ],
    hintFrames: [frame(square ? 'lado × lado' : 'base × altura', shapeView(square ? 'square' : 'rect', labels))],
  };
}

function buildTriangleArea(rng) {
  const b = rng.int(2, 16);
  const h = rng.int(2, 12);
  const area = div(n(b * h), n(2));
  const labels = { base: `${b} cm`, height: `${h} cm` };
  return {
    id: `area-triangulo:${b}:${h}`,
    form: 'area-triangulo',
    answerType: 'decimal',
    answer: area,
    expression: `A = □ cm²`,
    story: `🔺 Recortas un banderín triangular de ${b} cm de base y ${h} cm de altura. ¿Cuál es su área?`,
    illustration: shapeView('triangle', labels),
    hint: 'Área del triángulo = base × altura : 2 (es la mitad de un rectángulo).',
    steps: [`A = ${b} × ${h} : 2 = ${b * h} : 2 = ${D(area)} cm².`],
    frames: [
      frame('Un triángulo es la mitad de un rectángulo: base por altura, entre 2.', shapeView('triangle', labels)),
      frame(`${b} por ${h} es ${b * h}, y la mitad, ${D(area)}.`, { kind: 'calc', lines: [`A = ${b} × ${h} : 2 = ${D(area)} cm²`] }),
    ],
    hintFrames: [frame('base × altura : 2', shapeView('triangle', labels))],
  };
}

function buildOtherArea(rng) {
  const kind = rng.pick(['rhombus', 'trapezoid', 'polygon']);
  if (kind === 'rhombus') {
    const Dg = rng.int(4, 16);
    const d = rng.int(2, Dg - 1);
    const area = div(n(Dg * d), n(2));
    const labels = { D: `${Dg} cm`, d: `${d} cm` };
    return {
      id: `area-otros:rombo:${Dg}:${d}`, form: 'area-otros', answerType: 'decimal', answer: area, expression: 'A = □ cm²',
      story: `💎 Una pegatina con forma de rombo tiene diagonales de ${Dg} cm y ${d} cm. ¿Cuál es su área?`,
      illustration: shapeView('rhombus', labels), hint: 'Área del rombo = diagonal mayor × diagonal menor : 2.',
      steps: [`A = ${Dg} × ${d} : 2 = ${D(area)} cm².`],
      frames: [frame('El área del rombo es diagonal mayor por diagonal menor, entre 2.', shapeView('rhombus', labels)), frame(`${Dg} por ${d} entre 2 es ${D(area)}.`, { kind: 'calc', lines: [`A = ${Dg} × ${d} : 2 = ${D(area)} cm²`] })],
      hintFrames: [frame('D × d : 2', shapeView('rhombus', labels))],
    };
  }
  if (kind === 'trapezoid') {
    const B = rng.int(6, 16);
    const b = rng.int(2, B - 1);
    const h = rng.int(2, 10);
    const area = div(n((B + b) * h), n(2));
    const labels = { B: `${B} m`, b: `${b} m`, height: `${h} m` };
    return {
      id: `area-otros:trapecio:${B}:${b}:${h}`, form: 'area-otros', answerType: 'decimal', answer: area, expression: 'A = □ m²',
      story: `🌷 Un huerto con forma de trapecio tiene bases de ${B} m y ${b} m y una altura de ${h} m. ¿Cuál es su área?`,
      illustration: shapeView('trapezoid', labels), hint: 'Área del trapecio = (base mayor + base menor) × altura : 2.',
      steps: [`A = (${B} + ${b}) × ${h} : 2 = ${B + b} × ${h} : 2 = ${D(area)} m².`],
      frames: [frame('El área del trapecio: suma de las bases, por la altura, entre 2.', shapeView('trapezoid', labels)), frame(`(${B} + ${b}) por ${h} entre 2 es ${D(area)}.`, { kind: 'calc', lines: [`A = (${B} + ${b}) × ${h} : 2 = ${D(area)} m²`] })],
      hintFrames: [frame('(B + b) × h : 2', shapeView('trapezoid', labels))],
    };
  }
  const sides = rng.pick([5, 6, 8]);
  const l = rng.int(2, 10);
  const ap = fr(rng.int(10, 90), 10);
  const per = sides * l;
  const area = div(mul(n(per), ap), n(2));
  const labels = { side: `${l} cm`, apothem: `${D(ap)} cm` };
  const name = { 5: 'pentágono', 6: 'hexágono', 8: 'octógono' }[sides];
  return {
    id: `area-otros:poligono:${sides}:${l}:${D(ap)}`, form: 'area-otros', answerType: 'decimal', answer: area, expression: 'A = □ cm²',
    story: `⬡ Una baldosa con forma de ${name} regular tiene ${l} cm de lado y ${D(ap)} cm de apotema. ¿Cuál es su área?`,
    illustration: shapeView('polygon', labels, { sides }), hint: 'Área del polígono regular = perímetro × apotema : 2.',
    steps: [`Perímetro: ${sides} × ${l} = ${per} cm.`, `A = ${per} × ${D(ap)} : 2 = ${D(area)} cm².`],
    frames: [frame('El área de un polígono regular es perímetro por apotema, entre 2.', shapeView('polygon', labels, { sides })), frame(`Perímetro ${per}; ${per} por ${D(ap)} entre 2 es ${D(area)}.`, { kind: 'calc', lines: [`P = ${sides} × ${l} = ${per}`, `A = ${per} × ${D(ap)} : 2 = ${D(area)} cm²`] })],
    hintFrames: [frame('P × a : 2', shapeView('polygon', labels, { sides }))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'perimetro' ? buildPerimeter(rng) : form === 'area-cuadrilatero' ? buildQuadArea(rng) : form === 'area-triangulo' ? buildTriangleArea(rng) : buildOtherArea(rng);
  return { topicId: TOPIC_ID, level, theme: 'geometria', ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Perímetro y área',
    paragraphs: [
      'El perímetro es lo que mide el borde (se suman los lados, en m). El área es lo que ocupa por dentro (en m²).',
      'Rectángulo: base × altura. Cuadrado: lado × lado. Triángulo: base × altura : 2.',
    ],
    frames: [
      frame('Un rectángulo de 5 por 3.', shapeView('rect', { base: '5 m', height: '3 m' })),
      frame('Perímetro: 5 + 3 + 5 + 3 = 16 metros. Área: 5 por 3, 15 metros cuadrados.', { kind: 'calc', lines: ['P = 16 m', 'A = 5 × 3 = 15 m²'], grid: { rows: 3, cols: 5 } }),
      frame('El triángulo es la mitad: base por altura entre 2.', shapeView('triangle', { base: '6 cm', height: '4 cm' })),
    ],
  },
  {
    title: 'Más figuras',
    paragraphs: ['Rombo: D × d : 2. Trapecio: (B + b) × h : 2. Polígono regular: perímetro × apotema : 2.'],
    frames: [
      frame('Rombo: diagonal mayor por diagonal menor, entre 2.', shapeView('rhombus', { D: 'D', d: 'd' })),
      frame('Trapecio: suma de las bases, por la altura, entre 2.', shapeView('trapezoid', { B: 'B', b: 'b', height: 'h' })),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Perímetros y áreas',
  emoji: '🟧',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
