// Tema de inglés: la hora (o'clock, half past, quarter past / to) y los
// adverbios de frecuencia (always, usually, often, sometimes, never).

import { enFrame } from '../explain/storyboard.js';
import { numberWord } from '../lang/numbers.js';
import {
  BLOCK_DAILY, LEVEL_NAMES, SUBJECT, choicesFor, en, generator, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-time-frequency';

const pad = (m) => String(m).padStart(2, '0');

/** 7:30 → «half past seven»; 7:45 → «quarter to eight»; 7:20 → «twenty past seven». */
export function timeWords(h, m) {
  const next = h === 12 ? 1 : h + 1;
  if (m === 0) return `${numberWord(h)} o'clock`;
  if (m === 15) return `quarter past ${numberWord(h)}`;
  if (m === 30) return `half past ${numberWord(h)}`;
  if (m === 45) return `quarter to ${numberWord(next)}`;
  if (m < 30) return `${numberWord(m)} past ${numberWord(h)}`;
  return `${numberWord(60 - m)} to ${numberWord(next)}`;
}

export const ADVERBS = [
  { en: 'always', es: 'siempre', pct: 100 }, { en: 'usually', es: 'normalmente', pct: 80 },
  { en: 'often', es: 'a menudo', pct: 60 }, { en: 'sometimes', es: 'a veces', pct: 40 }, { en: 'never', es: 'nunca', pct: 0 },
];

// sub y rest: la frase en español, con el adverbio entre los dos.
const HABITS = [
  { s: 'I', v: 'have', c: 'cereal for breakfast.', sub: '', rest: 'desayuno cereales' },
  { s: 'She', v: 'plays', c: 'volleyball on Saturdays.', sub: 'ella', rest: 'juega al vóley los sábados' },
  { s: 'We', v: 'watch', c: 'horror films at night.', sub: '', rest: 'vemos pelis de terror por la noche' },
  { s: 'My brother', v: 'gets up', c: 'late.', sub: 'mi hermano', rest: 'se levanta tarde' },
  { s: 'They', v: 'walk', c: 'the dog after school.', sub: '', rest: 'pasean al perro después de clase' },
];

export const FORMS = {
  hora: 'Decir la hora',
  frecuencia: 'Qué adverbio de frecuencia es',
  posicion: 'Dónde va el adverbio',
};

const LEVELS = {
  1: { forms: [['hora', 4], ['frecuencia', 3]], minutes: [0, 30] },
  2: { forms: [['hora', 3], ['frecuencia', 2], ['posicion', 3]], minutes: [0, 15, 30, 45] },
  3: { forms: [['hora', 3], ['posicion', 3], ['frecuencia', 1]], minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] },
};

function buildTime(rng, minutes) {
  const h = rng.int(1, 12);
  const m = rng.pick(minutes);
  const answer = timeWords(h, m);
  const others = [
    timeWords(h === 12 ? 1 : h + 1, m), timeWords(h, (m + 30) % 60), m === 45 ? `quarter past ${numberWord(h)}` : `quarter to ${numberWord(h)}`,
    m > 30 ? `${numberWord(60 - m)} past ${numberWord(h)}` : `${numberWord(m || 1)} to ${numberWord(h)}`,
  ];
  const clock = `${h}:${pad(m)}`;
  return {
    id: `hora:${clock}`,
    form: 'hora',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, answer, others.filter((o) => o !== answer), 3),
    answer,
    audio: null,
    repeat: `It's ${answer}.`,
    story: `🕒 ${en('What time is it?')} El reloj marca ${h === 1 ? 'la' : 'las'} ${clock}.`,
    expression: `${clock} → □`,
    theme: null,
    illustration: null,
    hint: `En punto: ${en("o'clock")}. Y media: ${en('half past')}. Y cuarto: ${en('quarter past')}. Menos cuarto: ${en('quarter to')} (con la hora siguiente).`,
    hintFrames: [enFrame(`${en("o'clock")}, ${en('quarter past')}, ${en('half past')}, ${en('quarter to')}.`, { kind: 'calc', lines: [":00 o'clock · :15 quarter past", ':30 half past · :45 quarter to'] })],
    steps: [m > 30 ? `Pasada la media se dice lo que falta para la siguiente hora: ${en('to')}.` : `Hasta la media se dice ${en('past')} (y).`, `${clock} = ${en(answer)}.`],
    frames: [
      enFrame(`${h === 1 ? 'Es la' : 'Son las'} ${clock}.`, { kind: 'calc', lines: [`🕒 ${clock}`] }),
      enFrame(`Se dice: ${en(`It's ${answer}.`)}`, sentenceView([{ text: "It's" }, { text: answer, mark: 'verb' }], `${h === 1 ? 'Es la' : 'Son las'} ${clock}.`)),
    ],
  };
}

function buildFrequency(rng) {
  const a = rng.pick(ADVERBS);
  return {
    id: `frecuencia:${a.en}`,
    form: 'frecuencia',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, a.en, ADVERBS.map((x) => x.en), 3),
    answer: a.en,
    audio: null,
    repeat: a.en,
    story: `📊 ¿Qué adverbio significa “${a.es}” (${a.pct} % de las veces)?`,
    expression: `“${a.es}” = □`,
    theme: null,
    illustration: { kind: 'percent', percent: a.pct, label: `${a.pct} %`, total: null },
    hint: `De más a menos: ${en('always')} (100 %), ${en('usually')}, ${en('often')}, ${en('sometimes')}, ${en('never')} (0 %).`,
    hintFrames: [enFrame('De siempre a nunca.', { kind: 'calc', lines: ['always 100 % · usually 80 %', 'often 60 % · sometimes 40 %', 'never 0 %'] })],
    steps: [`“${a.es}” es ${en(a.en)}.`],
    frames: [
      enFrame(`“${a.es}” es ${en(a.en)}.`, { kind: 'percent', percent: a.pct, label: a.en, total: null }),
      enFrame(`Repite conmigo: ${en(a.en)}.`, sentenceView([{ text: a.en, mark: 'verb' }], a.es)),
    ],
  };
}

function buildPosition(rng) {
  const habit = rng.pick(HABITS);
  const a = rng.pick(ADVERBS);
  const right = `${habit.s} ${a.en} ${habit.v} ${habit.c}`;
  const [first, ...rest] = habit.v.split(' ');
  // (No vale como falsa «Sometimes I…», que también es correcta.)
  const wrong = [`${habit.s} ${habit.v} ${a.en} ${habit.c}`, `${habit.s} ${habit.v} ${habit.c.replace(/\.$/, '')} ${a.en}.`];
  if (rest.length) wrong.push(`${habit.s} ${first} ${a.en} ${rest.join(' ')} ${habit.c}`);
  return {
    id: `posicion:${habit.s}:${a.en}`,
    form: 'posicion',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, right, wrong, 3),
    answer: right,
    audio: null,
    repeat: right,
    story: `🔀 ¿Cuál está bien? Quiere decir: “${[habit.sub, a.es, habit.rest].filter(Boolean).join(' ')}”.`,
    expression: '□',
    theme: null,
    illustration: null,
    hint: `El adverbio va justo delante del verbo (pero detrás de ${en('am')}, ${en('is')}, ${en('are')}): ${en('She always gets up early.')}`,
    hintFrames: [enFrame(`Sujeto + adverbio + verbo: ${en('She always gets up early.')}`, sentenceView([{ text: 'She', mark: 'subject' }, { text: 'always' }, { text: 'gets up', mark: 'verb' }, { text: 'early.' }]))],
    steps: [`El adverbio va delante del verbo ${en(habit.v)}.`, `${en(right)}`],
    frames: [
      enFrame(`El adverbio ${en(a.en)} va delante del verbo ${en(habit.v)}.`, sentenceView([{ text: habit.s, mark: 'subject' }, { text: a.en }, { text: habit.v, mark: 'verb' }, { text: habit.c }])),
      enFrame(`Repite conmigo: ${en(right)}`, sentenceView([{ text: right, mark: 'subject' }])),
    ],
  };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'hora') return buildTime(rng, cfg.minutes);
  if (form === 'frecuencia') return buildFrequency(rng);
  return buildPosition(rng);
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'What time is it? 🕒',
    paragraphs: [
      `En punto: ${en("seven o'clock")}. Y cuarto: ${en('quarter past seven')}. Y media: ${en('half past seven')}. Menos cuarto: ${en('quarter to eight')} (¡con la hora siguiente!).`,
      `Con minutos: hasta la media, ${en('past')} (${en('ten past seven')}); después, ${en('to')} (${en('ten to eight')}).`,
    ],
    words: [[7, 0], [7, 15], [7, 30], [7, 45], [7, 10], [7, 50]].map(([h, m]) => ({ en: timeWords(h, m), es: `${h}:${pad(m)}` })),
    frames: [
      enFrame(`7:30 es ${en('half past seven')}.`, { kind: 'calc', lines: ['🕢 7:30 = half past seven'] }),
      enFrame(`7:45 es ${en('quarter to eight')}: un cuarto para las ocho.`, { kind: 'calc', lines: ['🕣 7:45 = quarter to eight'] }),
    ],
  },
  {
    title: 'Always, sometimes, never 📊',
    paragraphs: [`De más a menos: ${en('always')}, ${en('usually')}, ${en('often')}, ${en('sometimes')}, ${en('never')}. Van delante del verbo: ${en('I always get up at seven.')}`],
    words: ADVERBS.map((a) => ({ en: a.en, es: `${a.es} (${a.pct} %)` })),
    frames: [
      enFrame(`${en('always')} es siempre y ${en('never')} es nunca.`, { kind: 'calc', lines: ['always 100 % · usually 80 %', 'often 60 % · sometimes 40 %', 'never 0 %'] }),
      enFrame(`${en('I always get up at seven.')}`, sentenceView([{ text: 'I', mark: 'subject' }, { text: 'always' }, { text: 'get up', mark: 'verb' }, { text: 'at seven.' }], 'Siempre me levanto a las siete.')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_DAILY,
  title: 'La hora y always, never…',
  emoji: '🕒',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
