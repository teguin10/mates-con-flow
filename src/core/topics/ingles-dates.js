// Tema de inglés: días de la semana, meses, ordinales y fechas (Starter 2).
// En inglés los días y los meses se escriben con mayúscula, y las fechas a
// la británica: «the 3rd of May».

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_STARTER2, LEVEL_NAMES, SUBJECT, VOCAB_FORMS, choicesFor, en, generator, pickForm, sentenceView, vocabExercise,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-dates';

export const DAYS = [
  { en: 'Monday', es: 'lunes', emoji: '😩' }, { en: 'Tuesday', es: 'martes', emoji: '📚' },
  { en: 'Wednesday', es: 'miércoles', emoji: '🐫' }, { en: 'Thursday', es: 'jueves', emoji: '🏐' },
  { en: 'Friday', es: 'viernes', emoji: '🎉' }, { en: 'Saturday', es: 'sábado', emoji: '🎮' },
  { en: 'Sunday', es: 'domingo', emoji: '🥞' },
];
export const MONTHS = [
  { en: 'January', es: 'enero', emoji: '❄️' }, { en: 'February', es: 'febrero', emoji: '💘' }, { en: 'March', es: 'marzo', emoji: '🌱' },
  { en: 'April', es: 'abril', emoji: '🌧️' }, { en: 'May', es: 'mayo', emoji: '🌸' }, { en: 'June', es: 'junio', emoji: '🏖️' },
  { en: 'July', es: 'julio', emoji: '☀️' }, { en: 'August', es: 'agosto', emoji: '🍉' }, { en: 'September', es: 'septiembre', emoji: '🎒' },
  { en: 'October', es: 'octubre', emoji: '🎃' }, { en: 'November', es: 'noviembre', emoji: '🍂' }, { en: 'December', es: 'diciembre', emoji: '🎄' },
];

const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth',
  'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'];

/** 1 → «first», 23 → «twenty-third», 31 → «thirty-first». */
export function ordinalWord(n) {
  if (n <= 20) return ORDINALS[n - 1];
  const tens = n >= 30 ? 'thirty' : 'twenty';
  return n % 10 === 0 ? `${tens.slice(0, -1)}ieth` : `${tens}-${ORDINALS[(n % 10) - 1]}`;
}

/** 1 → «1st», 2 → «2nd», 3 → «3rd», 11 → «11th», 22 → «22nd». */
export function ordinalShort(n) {
  const end = n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th';
  return `${n}${end}`;
}

export const FORMS = {
  ...VOCAB_FORMS,
  siguiente: 'Qué día o mes va después',
  ordinal: 'Ordinales (1st, 2nd, 3rd…)',
  fecha: 'Decir una fecha (the 3rd of May)',
};

const LEVELS = {
  1: { choices: 3, forms: [['significado', 3], ['traducir', 3], ['escuchar', 3], ['siguiente', 2]] },
  2: { choices: 3, forms: [['traducir', 2], ['siguiente', 2], ['ordinal', 3], ['escribir', 3], ['escuchar', 2]] },
  3: { choices: 4, forms: [['fecha', 4], ['ordinal', 2], ['escribir', 2], ['dictado', 2]] },
};

const CONTEXTS = ['📅 En tu agenda en inglés pone:', '📱 Tu amiga de Londres te escribe:', '🏐 En el calendario del torneo de vóley:'];

function buildNext(rng, count) {
  const days = rng.next() < 0.6;
  const list = days ? DAYS : MONTHS;
  const i = rng.int(0, list.length - 1);
  const item = list[i];
  const next = list[(i + 1) % list.length];
  return {
    id: `siguiente:${item.en}`,
    form: 'siguiente',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, next.en, list.map((x) => x.en).filter((x) => x !== item.en), count),
    answer: next.en,
    audio: item.en,
    repeat: `${item.en}, ${next.en}`,
    story: `${days ? '📅 ¿Qué día va después de' : '🗓️ ¿Qué mes va después de'} ${en(item.en)} (${item.es})?`,
    expression: `${en(item.en)} → □`,
    theme: null,
    illustration: null,
    hint: `Después de ${item.es} va ${next.es}. ¿Cómo se dice en inglés?`,
    hintFrames: [enFrame(`${en(item.en)} es ${item.es}.`, sentenceView([{ text: item.en, mark: 'subject' }, { text: '→' }, { text: '?' }], `${item.es} → ${next.es}`))],
    steps: [`Después de ${item.es} va ${next.es}: ${en(next.en)}.`],
    frames: [
      enFrame(`Después de ${en(item.en)} va ${en(next.en)}.`, sentenceView([{ text: item.en, mark: 'subject' }, { text: '→' }, { text: next.en, mark: 'verb' }], `${item.es} → ${next.es}`)),
      enFrame(`Repite conmigo: ${en(`${item.en}, ${next.en}`)}.`, sentenceView([{ text: item.en, mark: 'subject' }, { text: next.en, mark: 'verb' }])),
    ],
  };
}

function buildOrdinal(rng, count, level) {
  const n = rng.int(1, level === 3 ? 31 : 20);
  const word = ordinalWord(n);
  const pool = [ordinalWord(Math.max(1, n - 1)), ordinalWord(Math.min(31, n + 1)), ...(n <= 3 ? ['oneth', 'twoth', 'threeth'] : [`${word}s`])];
  const short = ordinalShort(n);
  return {
    id: `ordinal:${n}`,
    form: 'ordinal',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, word, pool.filter((w) => w !== word), count),
    answer: word,
    audio: null,
    repeat: word,
    story: `🏆 En la carrera quedas en el puesto ${n}.º: ${en(short)}. ¿Cómo se dice?`,
    expression: `${en(short)} = □`,
    theme: null,
    illustration: null,
    hint: `Casi todos acaban en ${en('-th')}, menos ${en('first')} (1st), ${en('second')} (2nd) y ${en('third')} (3rd), y los que acaban en ellos (21st, 22nd, 23rd…).`,
    hintFrames: [enFrame(`Los especiales: ${en('first')}, ${en('second')} y ${en('third')}.`, { kind: 'calc', lines: ['1st first · 2nd second · 3rd third', '4th fourth · 5th fifth · 12th twelfth'] })],
    steps: [`${short} = ${en(word)}.`],
    frames: [
      enFrame(`${short} se dice ${en(word)}.`, { kind: 'calc', lines: [`${short} = ${word}`] }),
      enFrame(`Repite conmigo: ${en(word)}.`, sentenceView([{ text: word, mark: 'verb' }])),
    ],
  };
}

function buildDate(rng, count) {
  const day = rng.int(1, 28);
  const month = rng.pick(MONTHS);
  const right = `the ${ordinalShort(day)} of ${month.en}`;
  const wrong = [`the ${day} of ${month.en}`, `${month.en} of the ${ordinalShort(day)}`, `the ${ordinalShort(day)} ${month.es}`, `of ${month.en} the ${ordinalShort(day)}`];
  const context = rng.pick(['🎂 Tu cumpleaños es el', '🏐 La final del torneo es el', '🎤 El concierto de trap es el']);
  return {
    id: `fecha:${day}:${month.en}`,
    form: 'fecha',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, right, wrong, count),
    answer: right,
    audio: null,
    repeat: `It's on ${right}.`,
    story: `${context} ${day} de ${month.es}. ¿Cómo se dice en inglés?`,
    expression: `${day} de ${month.es} = □`,
    theme: null,
    illustration: null,
    hint: `Se dice ${en('the')} + ordinal + ${en('of')} + mes (con mayúscula): ${en('the 3rd of May')}.`,
    hintFrames: [enFrame(`Así: ${en('the 3rd of May')}.`, sentenceView([{ text: 'the' }, { text: '3rd', mark: 'verb' }, { text: 'of' }, { text: 'May', mark: 'subject' }], '3 de mayo'))],
    steps: [`El día con ordinal: ${en(ordinalShort(day))} (${en(ordinalWord(day))}).`, `Queda ${en(right)}.`],
    frames: [
      enFrame(`El día va en ordinal: ${en(ordinalShort(day))}, que se dice ${en(ordinalWord(day))}.`, { kind: 'calc', lines: [`${day} → ${ordinalShort(day)} (${ordinalWord(day)})`] }),
      enFrame(`Y se dice: ${en(`the ${ordinalWord(day)} of ${month.en}`)}.`, sentenceView([{ text: 'the' }, { text: ordinalShort(day), mark: 'verb' }, { text: 'of' }, { text: month.en, mark: 'subject' }], `${day} de ${month.es}`)),
    ],
  };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'siguiente') return buildNext(rng, cfg.choices);
  if (form === 'ordinal') return buildOrdinal(rng, cfg.choices, level);
  if (form === 'fecha') return buildDate(rng, cfg.choices);
  const pool = rng.next() < 0.5 ? DAYS : MONTHS;
  const item = rng.pick(pool);
  const ex = vocabExercise(rng, form, item, pool, { context: rng.next() < 0.3 ? rng.pick(CONTEXTS) : '', choices: cfg.choices });
  return { ...ex, steps: [...ex.steps, 'En inglés, los días y los meses se escriben con mayúscula.'] };
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Days of the week 📅',
    paragraphs: ['Los días de la semana. En inglés van siempre con mayúscula: Monday, Tuesday…'],
    words: DAYS,
    frames: [
      enFrame(`${en('Monday')}, ${en('Tuesday')}, ${en('Wednesday')}, ${en('Thursday')}.`, { kind: 'cards', items: DAYS.slice(0, 4), highlight: null, hide: null }),
      enFrame(`${en('Friday')}, ${en('Saturday')} y ${en('Sunday')}.`, { kind: 'cards', items: DAYS.slice(4), highlight: null, hide: null }),
    ],
  },
  {
    title: 'Months 🗓️',
    paragraphs: ['Los meses, también con mayúscula.'],
    words: MONTHS,
    frames: [
      enFrame(`${en('January')}, ${en('February')}, ${en('March')}, ${en('April')}, ${en('May')}, ${en('June')}.`, { kind: 'cards', items: MONTHS.slice(0, 6), highlight: null, hide: null }),
      enFrame(`${en('July')}, ${en('August')}, ${en('September')}, ${en('October')}, ${en('November')}, ${en('December')}.`, { kind: 'cards', items: MONTHS.slice(6), highlight: null, hide: null }),
    ],
  },
  {
    title: 'Fechas: the 3rd of May 🎂',
    paragraphs: [
      `Para las fechas se usan los ordinales: ${en('first')} (1st), ${en('second')} (2nd), ${en('third')} (3rd) y luego ${en('-th')}: ${en('fourth')}, ${en('fifth')}…`,
      `Se dice ${en('the 3rd of May')} y, para el cumpleaños, ${en("My birthday is on the 3rd of May.")}`,
    ],
    words: [1, 2, 3, 4, 5, 12, 20, 21, 31].map((n) => ({ en: ordinalWord(n), es: ordinalShort(n) })),
    frames: [
      enFrame(`${en('first')}, ${en('second')}, ${en('third')}, ${en('fourth')}.`, { kind: 'calc', lines: ['1st first · 2nd second', '3rd third · 4th fourth'] }),
      enFrame(`${en('My birthday is on the 3rd of May.')}`, sentenceView([{ text: 'My birthday is on' }, { text: 'the 3rd', mark: 'verb' }, { text: 'of May.', mark: 'subject' }], 'Mi cumpleaños es el 3 de mayo.')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_STARTER2,
  title: 'Días, meses y fechas',
  emoji: '📅',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
