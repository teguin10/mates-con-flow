// Tema de inglés: los números del 0 al 100 (nivel cero). Leer y escuchar se
// responden con el teclado numérico; elegir y escribir, en inglés.

import { enFrame } from '../explain/storyboard.js';
import { numberAccepts, numberWord } from '../lang/numbers.js';
import { BLOCK, LEVEL_NAMES, SUBJECT, choicesFor, en, generator, pickForm, spellFrame } from './ingles-comun.js';

const TOPIC_ID = 'ingles-numbers';

export const FORMS = {
  leer: 'Leer el número (inglés → cifras)',
  escuchar: 'Escuchar el número',
  elegir: 'Elegir cómo se dice',
  escribir: 'Escribir el número en inglés',
};

const TENS = [20, 30, 40, 50, 60, 70, 80, 90, 100];
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const LEVELS = {
  1: { numbers: range(0, 12), forms: [['leer', 3], ['elegir', 2], ['escuchar', 3]] },
  2: { numbers: [...range(13, 20), ...TENS], forms: [['leer', 2], ['elegir', 3], ['escuchar', 3], ['escribir', 2]] },
  3: { numbers: [...range(21, 99).filter((n) => n % 10 !== 0), ...range(13, 19), ...TENS], forms: [['escuchar', 3], ['escribir', 3], ['leer', 1], ['elegir', 2]] },
};

const CONTEXTS = [
  (n) => `🏐 En un partido de vóley en Londres, el marcador dice ${n}.`,
  (n) => `🧱 En un obby de Roblox en inglés, el nivel es el ${n}.`,
  (n) => `📺 Un youtuber inglés dice que su vídeo tiene ${n} likes.`,
  (n) => `🥞 En una receta inglesa de tortitas pone ${n} gramos.`,
];

const LISTEN_CONTEXTS = [
  '🏐 La árbitra de un partido de vóley en Londres canta los puntos en inglés.',
  '🎧 Un youtuber inglés dice un número en su vídeo.',
  '📞 Te dictan un número por teléfono en inglés.',
];

/** Números que se confunden con n: 13 con 30, 14 con 40… y los vecinos. */
export function confusables(n) {
  const list = [];
  if (n >= 13 && n <= 19) list.push((n - 10) * 10);
  if (n >= 30 && n <= 90 && n % 10 === 0) list.push(n / 10 + 10);
  list.push(n + 1, n - 1, n + 10, n - 10, n + 2);
  return list.filter((v) => v >= 0 && v <= 100 && v !== n);
}

function explainFrames(n) {
  const word = numberWord(n);
  const frames = [];
  if (n > 20 && n < 100 && n % 10 !== 0) {
    const tens = n - (n % 10);
    frames.push(enFrame(`${n} es ${tens} y ${n % 10}: ${en(numberWord(tens))} y ${en(numberWord(n % 10))}, unidos con un guion.`,
      { kind: 'calc', lines: [`${tens} → ${numberWord(tens)}`, `${n % 10} → ${numberWord(n % 10)}`, `${n} → ${word}`] }));
  } else if (n >= 13 && n <= 19) {
    frames.push(enFrame(`Del 13 al 19 acaban en ${en('teen')}, y se dice fuerte el final: ${en(word)}.`,
      { kind: 'calc', lines: [`${n} → ${word}`, `${(n - 10) * 10} → ${numberWord((n - 10) * 10)}`] }));
  } else if (n >= 30 && n < 100 && n % 10 === 0) {
    frames.push(enFrame(`Las decenas acaban en ${en('ty')}, y se dice fuerte el principio: ${en(word)}.`,
      { kind: 'calc', lines: [`${n} → ${word}`, `${n / 10 + 10} → ${numberWord(n / 10 + 10)}`] }));
  }
  frames.push(enFrame(`${n} en inglés es ${en(word)}.`, { kind: 'calc', lines: [`${n} = ${word}`] }));
  return frames;
}

function tip(n) {
  if (n >= 13 && n <= 19) return `Si acaba en ${en('teen')} está entre 13 y 19; si acaba en ${en('ty')} es una decena (30, 40…).`;
  if (n > 20 && n % 10 !== 0) return `Primero la decena y luego la unidad, con un guion: ${en('twenty-one')} es 21.`;
  return `Recuerda los primeros: ${en('one, two, three, four, five')}…`;
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  const n = rng.pick(cfg.numbers);
  const word = numberWord(n);
  const context = rng.pick(CONTEXTS);
  const base = {
    id: `${form}:${n}`,
    form,
    repeat: word,
    theme: null,
    illustration: null,
    hint: tip(n),
    hintFrames: [enFrame(tip(n), { kind: 'calc', lines: [n >= 13 && n <= 19 ? '13 – 19 → …teen' : '21 → twenty-one'] })],
    steps: [`${n} en inglés es ${en(word)}.`, 'Escúchalo con 🔊 y repítelo en voz alta.'],
    frames: explainFrames(n),
  };
  if (form === 'leer') {
    return { ...base, answerType: 'integer', answer: n, audio: word, story: `${context(en(word))} ¿Qué número es?`, expression: `${en(word)} = □` };
  }
  if (form === 'escuchar') {
    return { ...base, answerType: 'integer', answer: n, listen: word, story: `${rng.pick(LISTEN_CONTEXTS)} Escucha 🔊 y escribe el número con cifras.`, expression: '🔊 = □' };
  }
  if (form === 'elegir') {
    const pool = confusables(n).map(numberWord);
    return { ...base, answerType: 'choice', choicesLang: 'en', choices: choicesFor(rng, word, pool, 3), answer: word, story: `${context(n)} ¿Cómo se dice en inglés?`, expression: `${n} = □` };
  }
  return {
    ...base,
    answerType: 'text',
    answer: word,
    accept: numberAccepts(n),
    story: `${context(n)} Escríbelo en inglés, con letras.`,
    expression: `${n} = □`,
    frames: [...explainFrames(n), spellFrame(word)],
  };
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Del 0 al 12 🔢',
    paragraphs: ['Estos hay que sabérselos de memoria. Tócalos, escúchalos y repítelos.'],
    words: range(0, 12).map((n) => ({ en: numberWord(n), es: String(n) })),
    frames: [
      enFrame(`${en('one, two, three, four, five')}.`, { kind: 'calc', lines: ['1 one · 2 two · 3 three', '4 four · 5 five'] }),
      enFrame(`${en('six, seven, eight, nine, ten')}.`, { kind: 'calc', lines: ['6 six · 7 seven · 8 eight', '9 nine · 10 ten'] }),
      enFrame(`Y dos especiales: ${en('eleven')} y ${en('twelve')}.`, { kind: 'calc', lines: ['11 eleven · 12 twelve'] }),
    ],
  },
  {
    title: '¿Teen o ty? 👂',
    paragraphs: [
      `Del 13 al 19 acaban en ${en('teen')}: ${en('thirteen, fourteen, fifteen')}… Las decenas acaban en ${en('ty')}: ${en('thirty, forty, fifty')}…`,
      'Es la trampa más típica: 13 y 30 suenan parecido. En los «teen» se dice fuerte el final.',
    ],
    words: [13, 30, 14, 40, 15, 50, 20, 100].map((n) => ({ en: numberWord(n), es: String(n) })),
    frames: [
      enFrame(`${en('thirteen')} es 13 y ${en('thirty')} es 30.`, { kind: 'calc', lines: ['13 → thirteen', '30 → thirty'] }),
      enFrame(`${en('fifteen')} es 15 y ${en('fifty')} es 50.`, { kind: 'calc', lines: ['15 → fifteen', '50 → fifty'] }),
    ],
  },
  {
    title: 'Del 21 al 100 🚀',
    paragraphs: [`Decena y unidad con guion: ${en('twenty-one')}, ${en('thirty-five')}… Y el 100 es ${en('one hundred')}.`],
    words: [21, 35, 48, 99, 100].map((n) => ({ en: numberWord(n), es: String(n) })),
    frames: explainFrames(35),
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK,
  title: 'Numbers: del 0 al 100',
  emoji: '🔢',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
