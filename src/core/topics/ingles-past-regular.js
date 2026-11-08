// Tema de inglés: pasado simple de los verbos regulares (-ed) y su
// ortografía, con expresiones de tiempo pasado.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_PAST, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, listenExercise, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-past-regular';

export const VERBS = [
  { base: 'play', past: 'played', rule: 'add', es: 'jugó' }, { base: 'watch', past: 'watched', rule: 'add', es: 'vio' },
  { base: 'walk', past: 'walked', rule: 'add', es: 'paseó' }, { base: 'visit', past: 'visited', rule: 'add', es: 'visitó' },
  { base: 'listen', past: 'listened', rule: 'add', es: 'escuchó' }, { base: 'cook', past: 'cooked', rule: 'add', es: 'cocinó' },
  { base: 'dance', past: 'danced', rule: 'e', es: 'bailó' }, { base: 'love', past: 'loved', rule: 'e', es: 'le encantó' },
  { base: 'arrive', past: 'arrived', rule: 'e', es: 'llegó' }, { base: 'study', past: 'studied', rule: 'y', es: 'estudió' },
  { base: 'cry', past: 'cried', rule: 'y', es: 'lloró' }, { base: 'stop', past: 'stopped', rule: 'double', es: 'paró' },
  { base: 'chat', past: 'chatted', rule: 'double', es: 'chateó' },
];
const RULES = {
  add: `Casi todos añaden ${en('-ed')}: ${en('play')} → ${en('played')}.`,
  e: `Si acaba en ${en('-e')}, solo se añade ${en('-d')}: ${en('dance')} → ${en('danced')}.`,
  y: `Consonante + ${en('-y')}: la ${en('y')} cambia a ${en('-ied')}: ${en('study')} → ${en('studied')}.`,
  double: `Consonante + vocal + consonante: se dobla la última: ${en('stop')} → ${en('stopped')}.`,
};

const SENTENCES = [
  { s: 'I', v: 'play', c: 'volleyball yesterday.', es: 'Jugué al vóley ayer.' },
  { s: 'She', v: 'watch', c: 'a horror film last night.', es: 'Ella vio una peli de terror anoche.' },
  { s: 'We', v: 'dance', c: 'at the party.', es: 'Bailamos en la fiesta.' },
  { s: 'They', v: 'visit', c: 'London last summer.', es: 'Visitaron Londres el verano pasado.' },
  { s: 'My brother', v: 'study', c: 'for the exam.', es: 'Mi hermano estudió para el examen.' },
  { s: 'The bus', v: 'stop', c: 'near my school.', es: 'El autobús paró cerca de mi insti.' },
  { s: 'My mum', v: 'cook', c: 'pancakes on Sunday.', es: 'Mi madre hizo tortitas el domingo.' },
  { s: 'I', v: 'chat', c: 'with my friends for hours.', es: 'Chateé con mis amigas durante horas.' },
  { s: 'He', v: 'arrive', c: 'late two days ago.', es: 'Él llegó tarde hace dos días.' },
  { s: 'The baby', v: 'cry', c: 'all night.', es: 'El bebé lloró toda la noche.' },
];

export const FORMS = {
  elegir: 'Elegir el pasado',
  escribir: 'Escribir el pasado (-ed)',
  escuchar: 'Escuchar la frase y entenderla',
};

const LEVELS = {
  1: { forms: [['elegir', 5], ['escuchar', 2]] },
  2: { forms: [['elegir', 2], ['escribir', 4], ['escuchar', 1]] },
  3: { forms: [['escribir', 5], ['elegir', 1]] },
};

const verbOf = (base) => VERBS.find((v) => v.base === base);
const wrongPasts = (v) => [`${v.base}ed`, `${v.base}d`, `${v.base.replace(/y$/, 'i')}ed`, `${v.base}${v.base.at(-1)}ed`, v.base].filter((w) => w !== v.past);

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  const x = rng.pick(SENTENCES);
  const v = verbOf(x.v);
  if (form === 'escuchar') {
    return listenExercise(rng, { id: `escuchar:${x.s}:${x.v}`, sentence: `${x.s} ${v.past} ${x.c}`, es: x.es, pool: SENTENCES.filter((y) => y !== x).map((y) => y.es) });
  }
  return gapExercise({
    id: `${form}:${x.s}:${x.v}`,
    form,
    before: x.s,
    after: x.c,
    answer: v.past,
    ...(form === 'escribir' ? { text: true } : { choices: choicesFor(rng, v.past, wrongPasts(v), 3) }),
    es: x.es,
    cue: v.base,
    story: `Pon el verbo ${en(v.base)} en pasado: “${x.es}”`,
    rule: RULES[v.rule],
    ruleLines: ['play → played', 'dance → danced', 'study → studied', 'stop → stopped'],
    why: `${RULES[v.rule]} El pasado es igual para todos (${en(`I ${v.past}`)}, ${en(`she ${v.past}`)}).`,
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Past simple: -ed ⏪',
    paragraphs: [
      `El pasado simple cuenta lo que pasó y terminó: ${en('I played volleyball yesterday.')} Es igual para todos: ${en('I played')}, ${en('she played')}, ${en('they played')}.`,
      `Palabras de pasado: ${en('yesterday')} (ayer), ${en('last night')} (anoche), ${en('last week')} (la semana pasada), ${en('two days ago')} (hace dos días).`,
    ],
    words: [{ en: 'yesterday', es: 'ayer' }, { en: 'last night', es: 'anoche' }, { en: 'last weekend', es: 'el finde pasado' }, { en: 'two days ago', es: 'hace dos días' }],
    frames: [
      enFrame(`${en('She watched a horror film last night.')}`, sentenceView([{ text: 'She', mark: 'subject' }, { text: 'watched', mark: 'verb' }, { text: 'a horror film last night.' }], 'Ella vio una peli de terror anoche.')),
    ],
  },
  {
    title: 'Ortografía del -ed ✍️',
    paragraphs: [RULES.add, RULES.e, RULES.y, RULES.double],
    words: VERBS.filter((v) => v.rule !== 'add').map((v) => ({ en: `${v.base} → ${v.past}`, es: v.es })),
    frames: [
      enFrame(RULES.y, sentenceView([{ text: 'study', mark: 'subject' }, { text: '→' }, { text: 'studied', mark: 'verb' }])),
      enFrame(RULES.double, sentenceView([{ text: 'stop', mark: 'subject' }, { text: '→' }, { text: 'stopped', mark: 'verb' }])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_PAST,
  title: 'Past simple: -ed',
  emoji: '⏪',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
