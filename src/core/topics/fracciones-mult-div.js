// Tema: multiplicar fracciones (también un entero por una fracción), la
// inversa y dividir (multiplicar por la inversa).

import { div, fr, inverse, mul, simplify } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { bar, BLOCK, F, fractionView, generator, LEVEL_NAMES, simplifyStep } from './fracciones-comun.js';

const TOPIC_ID = 'fracciones-mult-div';

export const FORMS = {
  'entero-por-fraccion': 'Un número por una fracción (3 × 2/5)',
  multiplicar: 'Multiplicar fracciones (2/3 × 4/5)',
  inversa: 'La inversa (3/5 → 5/3)',
  dividir: 'Dividir fracciones (2/3 ÷ 4/5)',
};

const LEVELS = {
  1: { forms: [['entero-por-fraccion', 1], ['multiplicar', 2]], maxD: 6 },
  2: { forms: [['inversa', 1], ['dividir', 2], ['multiplicar', 1]], maxD: 8 },
  3: { forms: [['dividir', 2], ['multiplicar', 1], ['entero-por-fraccion', 1]], maxD: 10 },
};

const proper = (rng, maxD) => {
  const d = rng.int(2, maxD);
  return fr(rng.int(1, d - 1), d);
};

function enteroPorFraccion(rng, config) {
  const f = simplify(proper(rng, config.maxD));
  const k = rng.int(2, 4);
  const raw = fr(k * f.n, f.d);
  const simp = simplifyStep(raw);
  const drawn = raw.n / raw.d <= 4;
  return {
    expression: `${k} × ${F(f)} = □`,
    raw,
    story: rng.pick([
      `🥞 Cada crepe lleva ${F(f)} de taza de harina. ¿Cuánta harina necesitas para ${k} crepes?`,
      `🏐 Cada set de vóley dura ${F(f)} de hora. ¿Cuánto duran ${k} sets?`,
    ]),
    hint: `Multiplica ${k} por el numerador y deja el denominador: ${k} × ${f.n}.`,
    frames: [
      frame(`${k} × ${F(f)} es sumar ${F(f)} ${k} veces.`,
        drawn ? fractionView(Array.from({ length: k }, () => bar(f)), Array(k - 1).fill('+')) : { kind: 'calc', lines: [`${k} × ${F(f)}`] }),
      frame(`Se multiplica el numerador: ${k} × ${f.n} = ${raw.n}. El denominador se queda: ${F(raw)}.`,
        drawn ? fractionView([bar(raw, { highlight: true })], [], `${k} × ${F(f)} = ${F(raw)}`) : { kind: 'calc', lines: [`${k} × ${f.n} = ${raw.n}`, `${k} × ${F(f)} = ${F(raw)}`] }),
      ...simp.frames,
    ],
    steps: [`${k} × ${f.n} = ${raw.n} (el numerador).`, `El denominador se queda: ${f.d}.`, `${k} × ${F(f)} = ${F(raw)}.`, simp.step],
  };
}

function multiplicar(rng, config) {
  const a = proper(rng, config.maxD);
  const b = proper(rng, config.maxD);
  const raw = mul(a, b);
  const simp = simplifyStep(raw);
  return {
    expression: `${F(a)} × ${F(b)} = □`,
    raw,
    story: rng.pick([
      `🍫 Te queda ${F(a)} de tableta y te comes ${F(b)} de lo que queda. ¿Qué parte de la tableta te comes?`,
      `🎨 Pintas ${F(b)} de los ${F(a)} del mural que te tocan. ¿Qué parte del mural pintas?`,
      '🔐 La contraseña de la caja zombi es el resultado de:',
    ]),
    hint: 'Numerador por numerador y denominador por denominador.',
    frames: [
      frame('Para multiplicar fracciones: arriba por arriba y abajo por abajo.', { kind: 'calc', lines: [`${F(a)} × ${F(b)}`] }),
      frame(`Arriba: ${a.n} × ${b.n} = ${raw.n}. Abajo: ${a.d} × ${b.d} = ${raw.d}. Resultado: ${F(raw)}.`,
        { kind: 'calc', lines: [`arriba: ${a.n} × ${b.n} = ${raw.n}`, `abajo: ${a.d} × ${b.d} = ${raw.d}`, `${F(a)} × ${F(b)} = ${F(raw)}`] }),
      ...simp.frames,
    ],
    steps: [`Numeradores: ${a.n} × ${b.n} = ${raw.n}.`, `Denominadores: ${a.d} × ${b.d} = ${raw.d}.`, `Resultado: ${F(raw)}.`, simp.step],
  };
}

function inversa(rng, config) {
  const a = simplify(proper(rng, config.maxD));
  const raw = inverse(a);
  return {
    expression: `inversa de ${F(a)} = □`,
    raw,
    story: rng.pick([
      '🔄 Dale la vuelta a la fracción, como a un panqueque en la sartén:',
      '🙃 Escribe la inversa (la fracción del revés):',
    ]),
    hint: 'La inversa se obtiene dando la vuelta a la fracción: el numerador pasa abajo y el denominador arriba.',
    frames: [
      frame(`La inversa de ${F(a)} es darle la vuelta: el ${a.n} baja y el ${a.d} sube.`, { kind: 'calc', lines: [`${F(a)} → ${F(raw)}`] }),
      frame(`Comprueba: una fracción por su inversa da 1. ${F(a)} × ${F(raw)} = ${a.n * a.d}/${a.n * a.d} = 1.`,
        { kind: 'calc', lines: [`${F(a)} × ${F(raw)} = ${a.n * a.d}/${a.n * a.d} = 1`] }),
    ],
    steps: [`Damos la vuelta a ${F(a)}.`, `Inversa: ${F(raw)}.`, `Comprobación: ${F(a)} × ${F(raw)} = 1.`],
  };
}

function dividir(rng, config) {
  const a = proper(rng, config.maxD);
  const b = simplify(proper(rng, config.maxD));
  const flipped = inverse(b);
  const raw = div(a, b);
  const simp = simplifyStep(raw);
  return {
    expression: `${F(a)} ÷ ${F(b)} = □`,
    raw,
    story: rng.pick([
      `🥞 Tienes ${F(a)} de litro de masa y cada crepe lleva ${F(b)} de litro. ¿Cuántos crepes (o qué parte) salen?`,
      `🎧 ¿Cuántas veces cabe un trozo de ${F(b)} de canción en ${F(a)} de canción?`,
      '🧟 Para escapar del instituto zombi, resuelve:',
    ]),
    hint: `Dividir es multiplicar por la inversa: ${F(a)} × ${F(flipped)}.`,
    frames: [
      frame(`Dividir es multiplicar por la inversa: le damos la vuelta a ${F(b)}, que pasa a ser ${F(flipped)}.`,
        { kind: 'calc', lines: [`${F(a)} ÷ ${F(b)} = ${F(a)} × ${F(flipped)}`] }),
      frame(`Ahora multiplicamos: arriba ${a.n} × ${flipped.n} = ${raw.n}, abajo ${a.d} × ${flipped.d} = ${raw.d}. Resultado: ${F(raw)}.`,
        { kind: 'calc', lines: [`arriba: ${a.n} × ${flipped.n} = ${raw.n}`, `abajo: ${a.d} × ${flipped.d} = ${raw.d}`, `${F(a)} ÷ ${F(b)} = ${F(raw)}`] }),
      ...simp.frames,
    ],
    steps: [`Inversa de ${F(b)}: ${F(flipped)}.`, `${F(a)} × ${F(flipped)} = ${F(raw)}.`, `Resultado: ${F(raw)}.`, simp.step],
  };
}

const BUILDERS = { 'entero-por-fraccion': enteroPorFraccion, multiplicar, inversa, dividir };

function build(rng, level) {
  const config = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(config.forms);
  const { raw, steps, ...rest } = BUILDERS[form](rng, config);
  return {
    id: rest.expression,
    topicId: TOPIC_ID,
    level,
    form,
    answerType: 'fraction',
    answer: simplify(raw),
    theme: 'fraccion',
    illustration: null,
    steps: steps.filter(Boolean),
    hintFrames: [rest.frames[0]],
    ...rest,
  };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Multiplicar',
    paragraphs: [
      'Para multiplicar fracciones: numerador por numerador y denominador por denominador.',
      '2/3 × 4/5 = 8/15. Y un número por una fracción: 3 × 2/7 = 6/7.',
    ],
    frames: [
      frame('Arriba por arriba: 2 × 4 = 8. Abajo por abajo: 3 × 5 = 15.', { kind: 'calc', lines: ['arriba: 2 × 4 = 8', 'abajo: 3 × 5 = 15', '2/3 × 4/5 = 8/15'] }),
      frame('3 × 2/7 es sumar 2/7 tres veces: 6/7.', fractionView([bar(fr(2, 7)), bar(fr(2, 7)), bar(fr(2, 7))], ['+', '+'], '3 × 2/7 = 6/7')),
    ],
  },
  {
    title: 'La inversa',
    paragraphs: [
      'La inversa de una fracción es la misma fracción del revés, como un panqueque al darle la vuelta: la inversa de 3/5 es 5/3.',
      'Una fracción por su inversa siempre da 1.',
    ],
    frames: [
      frame('La inversa de 3/5 es 5/3.', { kind: 'calc', lines: ['3/5 → 5/3', '3/5 × 5/3 = 15/15 = 1'] }),
    ],
  },
  {
    title: 'Dividir',
    paragraphs: [
      'Para dividir, se multiplica la primera por la inversa de la segunda.',
      '2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12, que simplificada es 5/6.',
    ],
    frames: [
      frame('Le damos la vuelta a la segunda: 4/5 pasa a ser 5/4.', { kind: 'calc', lines: ['2/3 ÷ 4/5 = 2/3 × 5/4'] }),
      frame('Multiplicamos: 10/12. Simplificamos entre 2: 5/6.', { kind: 'calc', lines: ['2/3 × 5/4 = 10/12', '10/12 = 5/6'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Multiplicar y dividir',
  emoji: '🎀',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
