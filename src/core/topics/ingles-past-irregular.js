// Tema de inglés: verbos irregulares en pasado (went, had, saw…).

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_PAST, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, listenExercise, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-past-irregular';

export const IRREGULAR = [
  { base: 'go', past: 'went', es: 'ir' }, { base: 'have', past: 'had', es: 'tener' }, { base: 'see', past: 'saw', es: 'ver' },
  { base: 'eat', past: 'ate', es: 'comer' }, { base: 'buy', past: 'bought', es: 'comprar' }, { base: 'make', past: 'made', es: 'hacer' },
  { base: 'get', past: 'got', es: 'conseguir' }, { base: 'come', past: 'came', es: 'venir' }, { base: 'do', past: 'did', es: 'hacer' },
  { base: 'take', past: 'took', es: 'coger, tomar' }, { base: 'write', past: 'wrote', es: 'escribir' }, { base: 'swim', past: 'swam', es: 'nadar' },
  { base: 'drink', past: 'drank', es: 'beber' }, { base: 'sleep', past: 'slept', es: 'dormir' }, { base: 'meet', past: 'met', es: 'conocer, quedar' },
  { base: 'win', past: 'won', es: 'ganar' }, { base: 'say', past: 'said', es: 'decir' }, { base: 'sing', past: 'sang', es: 'cantar' },
];

const SENTENCES = [
  { s: 'I', v: 'go', c: 'to the cinema yesterday.', es: 'Fui al cine ayer.' },
  { s: 'We', v: 'win', c: 'the volleyball match!', es: '¡Ganamos el partido de vóley!' },
  { s: 'She', v: 'see', c: 'a ghost in the old house.', es: 'Ella vio un fantasma en la casa vieja.' },
  { s: 'They', v: 'eat', c: 'pizza last night.', es: 'Comieron pizza anoche.' },
  { s: 'My mum', v: 'buy', c: 'new trainers for me.', es: 'Mi madre me compró zapatillas nuevas.' },
  { s: 'I', v: 'make', c: 'crepes for breakfast.', es: 'Hice crepes para desayunar.' },
  { s: 'He', v: 'have', c: 'a boxing class on Monday.', es: 'Él tuvo clase de boxeo el lunes.' },
  { s: 'We', v: 'meet', c: 'a famous YouTuber!', es: '¡Conocimos a un youtuber famoso!' },
  { s: 'My cat', v: 'sleep', c: 'on my bed.', es: 'Mi gato durmió en mi cama.' },
  { s: 'You', v: 'write', c: 'a nice letter.', es: 'Escribiste una carta bonita.' },
  { s: 'The singer', v: 'sing', c: 'my favourite song.', es: 'La cantante cantó mi canción favorita.' },
];

export const FORMS = {
  significado: 'El pasado de un verbo',
  completar: 'Completar con el pasado',
  escribir: 'Escribir el pasado irregular',
  escuchar: 'Escuchar la frase y entenderla',
};

const LEVELS = {
  1: { forms: [['significado', 4], ['completar', 3]], verbs: 8 },
  2: { forms: [['completar', 3], ['escribir', 3], ['escuchar', 2], ['significado', 1]], verbs: 14 },
  3: { forms: [['escribir', 5], ['completar', 2]], verbs: 18 },
};

const RULE = `Los irregulares no llevan ${en('-ed')}: cada uno tiene su pasado y hay que aprendérselo. ${en('go')} → ${en('went')}, ${en('have')} → ${en('had')}, ${en('see')} → ${en('saw')}.`;
const verbOf = (base) => IRREGULAR.find((v) => v.base === base);
const fakePasts = (v) => [`${v.base}ed`, `${v.base}d`, v.base, ...IRREGULAR.filter((w) => w !== v).map((w) => w.past)];

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'significado') {
    const v = rng.pick(IRREGULAR.slice(0, cfg.verbs));
    return {
      id: `significado:${v.base}`,
      form,
      answerType: 'choice',
      choicesLang: 'en',
      choices: choicesFor(rng, v.past, fakePasts(v).slice(0, 3).concat(fakePasts(v).slice(3, 6)), 3),
      answer: v.past,
      audio: null,
      repeat: `${v.base}, ${v.past}`,
      story: `⏪ ¿Cuál es el pasado de ${en(v.base)} (${v.es})?`,
      expression: `${en(v.base)} → □`,
      cue: v.base,
      theme: null,
      illustration: null,
      hint: RULE,
      hintFrames: [enFrame(RULE, { kind: 'calc', lines: ['go → went · have → had', 'see → saw · eat → ate'] })],
      steps: [`${en(v.base)} es irregular: su pasado es ${en(v.past)}.`],
      frames: [
        enFrame(`${en(v.base)} en pasado es ${en(v.past)}.`, sentenceView([{ text: v.base, mark: 'subject' }, { text: '→' }, { text: v.past, mark: 'verb' }], v.es)),
        enFrame(`Repite conmigo: ${en(`${v.base}, ${v.past}`)}.`, sentenceView([{ text: `${v.base} – ${v.past}`, mark: 'verb' }])),
      ],
    };
  }
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
    ...(form === 'escribir' ? { text: true } : { choices: choicesFor(rng, v.past, fakePasts(v).slice(0, 3), 3) }),
    es: x.es,
    cue: v.base,
    story: `Pon ${en(v.base)} en pasado: “${x.es}”`,
    rule: RULE,
    ruleLines: ['go → went · have → had', 'see → saw · eat → ate', 'buy → bought · win → won'],
    why: `${en(v.base)} es irregular: ${en(v.past)}.`,
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Irregulares: went, had, saw… 📚',
    paragraphs: [RULE, 'Toca cada pareja, escúchala y repítela en voz alta varias veces: así se quedan.'],
    words: IRREGULAR.slice(0, 9).map((v) => ({ en: `${v.base} – ${v.past}`, es: v.es })),
    frames: [
      enFrame(RULE, { kind: 'calc', lines: ['go → went · have → had', 'see → saw · eat → ate'] }),
      enFrame(`${en('We won the volleyball match!')}`, sentenceView([{ text: 'We', mark: 'subject' }, { text: 'won', mark: 'verb' }, { text: 'the volleyball match!' }], '¡Ganamos el partido de vóley!')),
    ],
  },
  {
    title: 'Más irregulares 🎤',
    paragraphs: ['Otros muy usados.'],
    words: IRREGULAR.slice(9).map((v) => ({ en: `${v.base} – ${v.past}`, es: v.es })),
    frames: [enFrame(`${en('take')} → ${en('took')}, ${en('write')} → ${en('wrote')}, ${en('sleep')} → ${en('slept')}.`, { kind: 'calc', lines: ['take → took · write → wrote', 'sleep → slept · meet → met'] })],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_PAST,
  title: 'Irregulares: went, had, saw',
  emoji: '📚',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
