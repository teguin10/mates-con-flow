// Tema: cuerpos geométricos. Reconocerlos, caras, aristas y vértices de
// prismas y pirámides, y la fórmula de Euler.

import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES, shapeView, shuffle } from './geometria-comun.js';

const TOPIC_ID = 'cuerpos';

export const FORMS = {
  reconocer: 'Reconocer el cuerpo',
  elementos: 'Caras, aristas y vértices',
  euler: 'Fórmula de Euler',
};

const LEVELS = {
  1: { forms: [['reconocer', 5], ['elementos', 2]] },
  2: { forms: [['elementos', 4], ['reconocer', 2]] },
  3: { forms: [['elementos', 3], ['euler', 3]] },
};

const BODIES = [
  { name: 'Cubo', shape: 'cube', example: 'un dado' },
  { name: 'Prisma', shape: 'prism', example: 'una caja de zapatillas' },
  { name: 'Pirámide', shape: 'pyramid', example: 'las pirámides de Egipto' },
  { name: 'Cilindro', shape: 'cylinder', example: 'una lata de refresco' },
  { name: 'Cono', shape: 'cone', example: 'un cucurucho de helado' },
  { name: 'Esfera', shape: 'sphere', example: 'un balón de vóley' },
];

const BASES = { 3: 'triangular', 4: 'cuadrangular', 5: 'pentagonal', 6: 'hexagonal' };

/** Caras, aristas y vértices de un prisma o pirámide de base con n lados. */
export function elements(kind, n) {
  return kind === 'prisma' ? { caras: n + 2, aristas: 3 * n, vertices: 2 * n } : { caras: n + 1, aristas: 2 * n, vertices: n + 1 };
}

function buildRecognize(rng) {
  const body = rng.pick(BODIES);
  return {
    id: `reconocer:${body.name}`,
    form: 'reconocer',
    answerType: 'choice',
    choices: shuffle(rng, [body.name, ...shuffle(rng, BODIES.filter((b) => b !== body).map((b) => b.name)).slice(0, 2)]),
    answer: body.name,
    expression: '□',
    story: `📦 ¿Qué cuerpo geométrico es? Se parece a ${body.example}.`,
    illustration: shapeView(body.shape, {}),
    hint: 'Los poliedros tienen caras planas (cubo, prisma, pirámide); los cuerpos redondos tienen partes curvas (cilindro, cono, esfera).',
    steps: [`Es ${body.name.toLowerCase() === 'esfera' || body.name.toLowerCase() === 'pirámide' ? 'una' : 'un'} ${body.name.toLowerCase()}, como ${body.example}.`],
    frames: [frame(`Es ${body.name === 'Esfera' || body.name === 'Pirámide' ? 'una' : 'un'} ${body.name.toLowerCase()}, como ${body.example}.`, shapeView(body.shape, {}))],
    hintFrames: [frame('¿Tiene caras planas o partes curvas?', shapeView(body.shape, {}))],
  };
}

function buildElements(rng) {
  const kind = rng.next() < 0.5 ? 'prisma' : 'pirámide';
  const n = rng.int(3, 6);
  const which = rng.pick(['caras', 'aristas', 'vertices']);
  const e = elements(kind === 'prisma' ? 'prisma' : 'piramide', n);
  const answer = e[which];
  const word = which === 'vertices' ? 'vértices' : which;
  const rule = kind === 'prisma'
    ? `Un prisma de base con ${n} lados tiene 2 bases y ${n} caras laterales (${n + 2} caras), ${3 * n} aristas y ${2 * n} vértices.`
    : `Una pirámide de base con ${n} lados tiene 1 base y ${n} triángulos (${n + 1} caras), ${2 * n} aristas y ${n + 1} vértices.`;
  return {
    id: `elementos:${kind}:${n}:${which}`,
    form: 'elementos',
    answerType: 'integer',
    answer,
    expression: `${word}: □`,
    story: `🔷 ¿Cuántos ${word} tiene ${kind === 'prisma' ? 'un prisma' : 'una pirámide'} ${BASES[n]} (su base tiene ${n} lados)?`,
    illustration: shapeView(kind === 'prisma' ? 'prism' : 'pyramid', {}),
    hint: 'Caras: las superficies planas. Aristas: donde se juntan dos caras. Vértices: las esquinas.',
    steps: [rule, `${word[0].toUpperCase()}${word.slice(1)}: ${answer}.`],
    frames: [
      frame(rule, shapeView(kind === 'prisma' ? 'prism' : 'pyramid', {})),
      frame(`Tiene ${answer} ${word}.`, { kind: 'calc', lines: [`caras ${e.caras} · aristas ${e.aristas} · vértices ${e.vertices}`] }),
    ],
    hintFrames: [frame('Cuenta en el dibujo, o piensa en la base.', shapeView(kind === 'prisma' ? 'prism' : 'pyramid', {}))],
  };
}

function buildEuler(rng) {
  const kind = rng.next() < 0.5 ? 'prisma' : 'piramide';
  const n = rng.int(3, 8);
  const e = elements(kind, n);
  const ask = rng.pick(['caras', 'aristas', 'vertices']);
  const answer = e[ask];
  const known = { caras: e.caras, aristas: e.aristas, vertices: e.vertices };
  const show = Object.entries(known).filter(([k]) => k !== ask).map(([k, v]) => `${v} ${k === 'vertices' ? 'vértices' : k}`).join(' y ');
  return {
    id: `euler:${kind}:${n}:${ask}`,
    form: 'euler',
    answerType: 'integer',
    answer,
    expression: 'C + V = A + 2',
    story: `🧠 Un poliedro tiene ${show}. ¿Cuántos ${ask === 'vertices' ? 'vértices' : ask} tiene? (usa la fórmula de Euler: C + V = A + 2)`,
    illustration: null,
    hint: 'Fórmula de Euler: caras + vértices = aristas + 2.',
    steps: [`C + V = A + 2.`, `${e.caras} + ${e.vertices} = ${e.aristas} + 2 = ${e.aristas + 2}.`, `Falta: ${answer}.`],
    frames: [
      frame('En cualquier poliedro, caras más vértices es igual a aristas más 2.', { kind: 'calc', lines: ['C + V = A + 2'] }),
      frame(`Sustituimos: ${e.caras} + ${e.vertices} = ${e.aristas} + 2. Lo que falta es ${answer}.`, { kind: 'calc', lines: [`${e.caras} + ${e.vertices} = ${e.aristas} + 2`] }),
    ],
    hintFrames: [frame('C + V = A + 2', { kind: 'calc', lines: ['C + V = A + 2'] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'reconocer' ? buildRecognize(rng) : form === 'elementos' ? buildElements(rng) : buildEuler(rng);
  if (!ex.expression.includes('□')) ex.expression = `${ex.expression} → □`;
  return { topicId: TOPIC_ID, level, theme: 'geometria', ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Cuerpos geométricos',
    paragraphs: [
      'Poliedros: todas sus caras son planas (cubo, prisma, pirámide). Cuerpos redondos: tienen partes curvas (cilindro, cono, esfera).',
      'En un poliedro hay caras, aristas (donde se juntan dos caras) y vértices (las esquinas). Siempre se cumple C + V = A + 2.',
    ],
    frames: [
      frame('Un cubo: 6 caras, 12 aristas y 8 vértices.', shapeView('cube', {})),
      frame('6 más 8 es 14, y 12 más 2 también: se cumple la fórmula de Euler.', { kind: 'calc', lines: ['C + V = A + 2', '6 + 8 = 12 + 2'] }),
      frame('Un cilindro, como una lata: tiene partes curvas.', shapeView('cylinder', {})),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Cuerpos geométricos',
  emoji: '🧊',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
