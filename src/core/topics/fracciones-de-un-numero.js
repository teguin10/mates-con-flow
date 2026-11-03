// Tema: fracción de un número (3/4 de 20 = 15). Se divide entre el
// denominador y se multiplica por el numerador.

import { fr, gcd } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { BLOCK, F, fractionView, generator, LEVEL_NAMES } from './fracciones-comun.js';

const TOPIC_ID = 'fracciones-de-un-numero';
const MAX_DRAWN = 40;

export const FORMS = {
  unitaria: 'Una parte (1/4 de 20)',
  fraccion: 'Varias partes (3/4 de 20)',
  grande: 'Con números grandes (3/8 de 120)',
};

const LEVELS = {
  1: { forms: [['unitaria', 2], ['fraccion', 1]], maxD: 6, maxQ: 6 },
  2: { forms: [['fraccion', 3], ['unitaria', 1]], maxD: 8, maxQ: 8 },
  3: { forms: [['grande', 2], ['fraccion', 1]], maxD: 10, maxQ: 15 },
};

const THEMES = [
  { emoji: '🍓', story: (f, total) => `🍓 Tienes ${total} fresas para los crepes y pones ${F(f)} en la masa. ¿Cuántas fresas pones?` },
  { emoji: '⭐', story: (f, total) => `⭐ Has hecho ${total} estrellas de papel y regalas ${F(f)} a tus amigas. ¿Cuántas regalas?` },
  { emoji: '✉️', story: (f, total) => `✉️ De ${total} cartas decoradas, ${F(f)} llevan pegatinas de Hello Kitty. ¿Cuántas son?` },
  { emoji: '🐶', story: (f, total) => `🐶 En el refugio hay ${total} perritos y ${F(f)} ya tienen familia. ¿Cuántos?` },
  { emoji: '🏐', story: (f, total) => `🏐 En el entrenamiento haces ${total} saques y ${F(f)} entran. ¿Cuántos saques entran?` },
  { emoji: '💎', story: (f, total) => `💎 Tienes ${total} robux y gastas ${F(f)} en un accesorio. ¿Cuántos robux gastas?` },
];

function build(rng, level) {
  const config = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(config.forms);
  // Varias partes: 2 ≤ n < d e irreducible (d − 1 siempre vale).
  const d = rng.int(form === 'unitaria' ? 2 : 3, config.maxD);
  let n = 1;
  if (form !== 'unitaria') do n = rng.int(2, d - 1); while (gcd(n, d) !== 1);
  const f = fr(n, d);
  const q = form === 'grande' ? rng.int(10, config.maxQ) : rng.int(2, config.maxQ);
  const total = d * q;
  const answer = n * q;
  const theme = rng.pick(THEMES);
  const drawable = total <= MAX_DRAWN && q <= 10;
  const groups = (k, label) => fractionView([{ n: k, d, total, shape: 'groups', emoji: theme.emoji, label }]);

  const frames = [
    drawable
      ? frame(`Repartimos ${total} en ${d} grupos iguales: ${total} ÷ ${d} = ${q} en cada grupo.`, groups(0, `${total} ÷ ${d} = ${q}`))
      : frame(`Repartimos ${total} en ${d} partes iguales: ${total} ÷ ${d} = ${q}.`, { kind: 'calc', lines: [`${total} ÷ ${d} = ${q}`] }),
  ];
  if (n === 1) {
    frames.push(frame(`${F(f)} es uno de esos grupos: ${q}.`, drawable ? groups(1, `1 grupo = ${q}`) : { kind: 'calc', lines: [`${F(f)} de ${total} = ${q}`] }));
  } else {
    frames.push(frame(`Cogemos ${n} grupos: ${n} × ${q} = ${answer}.`, drawable ? groups(n, `${n} × ${q} = ${answer}`) : { kind: 'calc', lines: [`${n} × ${q} = ${answer}`] }));
  }
  frames.push(frame(`${F(f)} de ${total} es ${answer}.`, { kind: 'calc', lines: [`${F(f)} de ${total} = ${answer}`] }));

  const expression = `${F(f)} de ${total} = □`;
  return {
    id: expression,
    topicId: TOPIC_ID,
    level,
    form,
    answerType: 'integer',
    expression,
    answer,
    story: theme.story(f, total),
    theme: 'fraccion',
    illustration: null,
    hint: `Divide ${total} entre ${d} (el denominador)${n > 1 ? ` y multiplica por ${n} (el numerador)` : ''}.`,
    steps: [
      `${total} ÷ ${d} = ${q} (lo que vale cada parte).`,
      n > 1 ? `${q} × ${n} = ${answer} (las ${n} partes).` : `Una parte: ${q}.`,
      `${F(f)} de ${total} = ${answer}.`,
    ],
    frames,
    hintFrames: [frames[0]],
  };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'La fracción de un número',
    paragraphs: [
      'Para calcular 3/4 de 20, reparte 20 en 4 grupos iguales (20 ÷ 4 = 5) y coge 3 grupos (3 × 5 = 15).',
      'Truco: divide entre el de abajo y multiplica por el de arriba.',
    ],
    frames: [
      frame('Repartimos 20 fresas en 4 grupos: 5 en cada uno.', fractionView([{ n: 0, d: 4, total: 20, shape: 'groups', emoji: '🍓', label: '20 ÷ 4 = 5' }])),
      frame('Cogemos 3 grupos: 3 × 5 = 15. 3/4 de 20 son 15.', fractionView([{ n: 3, d: 4, total: 20, shape: 'groups', emoji: '🍓', label: '3 × 5 = 15' }])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Fracción de un número',
  emoji: '🍓',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
