// Tema: circunferencia, círculo y teorema de Pitágoras (con π = 3,14).

import { fr, mul } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, D, generator, LEVEL_NAMES, PI, shapeView } from './geometria-comun.js';

const TOPIC_ID = 'circulo-pitagoras';

export const FORMS = {
  longitud: 'Longitud de la circunferencia',
  'area-circulo': 'Área del círculo',
  hipotenusa: 'Pitágoras: la hipotenusa',
  cateto: 'Pitágoras: un cateto',
};

const LEVELS = {
  1: { forms: [['longitud', 3], ['area-circulo', 3]] },
  2: { forms: [['longitud', 2], ['area-circulo', 2], ['hipotenusa', 3]] },
  3: { forms: [['hipotenusa', 2], ['cateto', 3], ['area-circulo', 1]] },
};

// Ternas pitagóricas (catetos y hipotenusa enteros).
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [15, 20, 25], [10, 24, 26], [20, 21, 29]];

function buildLength(rng) {
  const r = rng.int(1, 12);
  const useD = rng.next() < 0.4;
  const L = mul(mul(fr(2, 1), PI), fr(r, 1));
  const labels = useD ? { d: `${2 * r} cm` } : { r: `${r} cm` };
  return {
    id: `longitud:${r}:${useD}`,
    form: 'longitud',
    answerType: 'decimal',
    answer: L,
    expression: 'L = □ cm',
    story: `⭕ Vas a poner cinta alrededor de un aro de ${useD ? `${2 * r} cm de diámetro` : `${r} cm de radio`}. ¿Cuánta cinta necesitas? (usa π = 3,14)`,
    illustration: shapeView('circle', labels),
    hint: `Longitud de la circunferencia = 2 · π · r${useD ? ` (el radio es la mitad del diámetro: ${r} cm)` : ''}.`,
    steps: [...(useD ? [`r = ${2 * r} : 2 = ${r} cm.`] : []), `L = 2 · 3,14 · ${r} = ${D(L)} cm.`],
    frames: [
      frame(`La longitud de la circunferencia es 2 por pi por el radio${useD ? `, y el radio es la mitad del diámetro: ${r}` : ''}.`, shapeView('circle', labels)),
      frame(`2 por 3,14 por ${r} es ${D(L)}.`, { kind: 'calc', lines: [`L = 2 · 3,14 · ${r} = ${D(L)} cm`] }),
    ],
    hintFrames: [frame('L = 2 · π · r', shapeView('circle', labels))],
  };
}

function buildArea(rng) {
  const r = rng.int(1, 10);
  const A = mul(PI, fr(r * r, 1));
  return {
    id: `area-circulo:${r}`,
    form: 'area-circulo',
    answerType: 'decimal',
    answer: A,
    expression: 'A = □ cm²',
    story: `🥞 Un crepe redondo tiene ${r * 2} cm de diámetro, o sea, ${r} cm de radio. ¿Cuál es su área? (usa π = 3,14)`,
    illustration: shapeView('circle', { r: `${r} cm` }),
    hint: 'Área del círculo = π · r².',
    steps: [`r² = ${r} · ${r} = ${r * r}.`, `A = 3,14 · ${r * r} = ${D(A)} cm².`],
    frames: [
      frame('El área del círculo es pi por el radio al cuadrado.', shapeView('circle', { r: `${r} cm` })),
      frame(`${r} al cuadrado es ${r * r}, y por 3,14 da ${D(A)}.`, { kind: 'calc', lines: [`A = 3,14 · ${r}² = 3,14 · ${r * r} = ${D(A)} cm²`] }),
    ],
    hintFrames: [frame('A = π · r²', shapeView('circle', { r: `${r} cm` }))],
  };
}

function buildPythagoras(rng, findLeg) {
  const [a, b, c] = rng.pick(TRIPLES);
  const story = findLeg
    ? `🪜 Una escalera de ${c} m está apoyada en una pared, con el pie a ${b} m de la pared. ¿A qué altura llega?`
    : `📺 Una pantalla mide ${b} pulgadas de ancho y ${a} de alto. ¿Cuánto mide su diagonal?`;
  const labels = findLeg ? { a: '?', b: `${b}`, c: `${c}` } : { a: `${a}`, b: `${b}`, c: '?' };
  const answer = findLeg ? a : c;
  return {
    id: `${findLeg ? 'cateto' : 'hipotenusa'}:${a}:${b}:${c}`,
    form: findLeg ? 'cateto' : 'hipotenusa',
    answerType: 'integer',
    answer,
    expression: findLeg ? `${b}² + □² = ${c}²` : `${a}² + ${b}² = □²`,
    story,
    illustration: shapeView('right', labels),
    hint: findLeg ? 'Cateto² = hipotenusa² − otro cateto². Después haz la raíz cuadrada.' : 'Hipotenusa² = cateto² + cateto². Después haz la raíz cuadrada.',
    steps: findLeg
      ? [`${c}² − ${b}² = ${c * c} − ${b * b} = ${c * c - b * b}.`, `√${c * c - b * b} = ${a}.`]
      : [`${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}.`, `√${a * a + b * b} = ${c}.`],
    frames: [
      frame('En un triángulo rectángulo, el lado largo (la hipotenusa) al cuadrado es la suma de los otros dos al cuadrado.', shapeView('right', labels)),
      findLeg
        ? frame(`${c} al cuadrado menos ${b} al cuadrado es ${c * c - b * b}, y su raíz es ${a}.`, { kind: 'calc', lines: [`a² = ${c}² − ${b}² = ${c * c - b * b}`, `a = √${c * c - b * b} = ${a}`] })
        : frame(`${a} al cuadrado más ${b} al cuadrado es ${a * a + b * b}, y su raíz es ${c}.`, { kind: 'calc', lines: [`c² = ${a}² + ${b}² = ${a * a + b * b}`, `c = √${a * a + b * b} = ${c}`] }),
    ],
    hintFrames: [frame('c² = a² + b²', shapeView('right', { a: 'a', b: 'b', c: 'c' }))],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'longitud' ? buildLength(rng) : form === 'area-circulo' ? buildArea(rng) : buildPythagoras(rng, form === 'cateto');
  return { topicId: TOPIC_ID, level, theme: 'geometria', ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Circunferencia y círculo',
    paragraphs: [
      'La circunferencia es la línea del borde; el círculo, lo de dentro. El radio va del centro al borde y el diámetro es el doble del radio.',
      'Longitud: L = 2 · π · r. Área: A = π · r². Usamos π = 3,14.',
    ],
    frames: [
      frame('Un círculo de radio 3.', shapeView('circle', { r: '3 cm' })),
      frame('Longitud: 2 por 3,14 por 3, 18,84. Área: 3,14 por 9, 28,26.', { kind: 'calc', lines: ['L = 2 · 3,14 · 3 = 18,84 cm', 'A = 3,14 · 3² = 28,26 cm²'] }),
    ],
  },
  {
    title: 'Teorema de Pitágoras',
    paragraphs: ['En un triángulo rectángulo: hipotenusa² = cateto² + cateto². Con catetos de 3 y 4: 3² + 4² = 9 + 16 = 25, y la hipotenusa es √25 = 5.'],
    frames: [
      frame('Catetos de 3 y 4.', shapeView('right', { a: '3', b: '4', c: '?' })),
      frame('3 al cuadrado más 4 al cuadrado es 25; la raíz de 25 es 5.', { kind: 'calc', lines: ['c² = 3² + 4² = 25', 'c = √25 = 5'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Círculo y Pitágoras',
  emoji: '⭕',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
