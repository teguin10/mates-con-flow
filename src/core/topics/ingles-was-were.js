// Tema de inglés: was / were (el pasado de to be) con sentimientos, y
// there was / there were.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_PAST, LEVEL_NAMES, SUBJECT, en, gapExercise, generator, listenExercise, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-was-were';

export const FEELINGS = [
  { en: 'happy', es: 'contenta' }, { en: 'tired', es: 'cansada' }, { en: 'bored', es: 'aburrida' }, { en: 'excited', es: 'emocionada' },
  { en: 'scared', es: 'asustada' }, { en: 'nervous', es: 'nerviosa' }, { en: 'angry', es: 'enfadada' }, { en: 'sad', es: 'triste' },
];

// s: sujeto; were: si va con were; when: cuándo; esS: el sujeto en español y su verbo.
const PEOPLE = [
  { s: 'I', were: false, es: 'Estaba' }, { s: 'She', were: false, es: 'Ella estaba' }, { s: 'He', were: false, es: 'Él estaba' },
  { s: 'We', were: true, es: 'Estábamos' }, { s: 'They', were: true, es: 'Estaban' }, { s: 'You', were: true, es: 'Estabas' },
  { s: 'My friends', were: true, es: 'Mis amigas estaban' }, { s: 'My dog', were: false, es: 'Mi perro estaba' },
];
const WHEN = [
  { en: 'yesterday', es: 'ayer' }, { en: 'last night', es: 'anoche' }, { en: 'at the concert', es: 'en el concierto' },
  { en: 'after the match', es: 'después del partido' }, { en: 'in the horror film', es: 'en la peli de terror' },
];
const THERE = [
  { one: 'a zombie', many: 'two ghosts', place: 'in the film', es1: 'un zombi', es2: 'dos fantasmas', esPlace: 'en la peli' },
  { one: 'a big cake', many: 'lots of pancakes', place: 'at the party', es1: 'una tarta grande', es2: 'muchas tortitas', esPlace: 'en la fiesta' },
  { one: 'a cat', many: 'three dogs', place: 'in the park', es1: 'un gato', es2: 'tres perros', esPlace: 'en el parque' },
];

export const FORMS = {
  'was-were': 'Was o were',
  negativa: "Negativa (wasn't, weren't)",
  'there-was': 'There was o there were',
  escuchar: 'Escuchar la frase y entenderla',
};

const LEVELS = {
  1: { forms: [['was-were', 5], ['escuchar', 2]] },
  2: { forms: [['was-were', 2], ['negativa', 3], ['there-was', 3]] },
  3: { forms: [['negativa', 3], ['there-was', 3], ['was-were', 1]] },
};

const RULE = `El pasado de ${en('to be')}: ${en('was')} con ${en('I')}, ${en('he')}, ${en('she')}, ${en('it')}; ${en('were')} con ${en('you')}, ${en('we')}, ${en('they')}.`;
const RULE_LINES = ['I · he · she · it → was', 'you · we · they → were'];
const masc = (who, word) => (/^(He|My dog)$/.test(who.s) || /^(We|They|You)$/.test(who.s) ? word.replace(/a$/, 'o') : word);
const plural = (who, word) => (who.were && who.s !== 'You' ? `${word}s` : word);

function feelingES(who, f) {
  const base = masc(who, f.es);
  return plural(who, base).replace(/es$/, 'es');
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'there-was') {
    const t = rng.pick(THERE);
    const many = rng.next() < 0.5;
    const answer = many ? 'There were' : 'There was';
    return gapExercise({
      id: `there-was:${t.place}:${many}`, form, before: '', after: `${many ? t.many : t.one} ${t.place}.`, answer,
      choices: ['There was', 'There were'], es: `Había ${many ? t.es2 : t.es1} ${t.esPlace}.`,
      story: `Completa: “Había ${many ? t.es2 : t.es1} ${t.esPlace}.”`,
      rule: `${en('There was')} (había) con una cosa; ${en('There were')} con varias.`, ruleLines: ['1 → There was a zombie.', '+ → There were two ghosts.'],
      why: many ? `Son varias: ${en('There were')}.` : `Es una: ${en('There was')}.`,
    });
  }
  const who = rng.pick(PEOPLE);
  const f = rng.pick(FEELINGS);
  const w = rng.pick(WHEN);
  const verb = who.were ? 'were' : 'was';
  const es = `${who.es} ${feelingES(who, f)} ${w.es}.`;
  if (form === 'escuchar') {
    const sentence = `${who.s} ${verb} ${f.en} ${w.en}.`;
    const pool = FEELINGS.filter((g) => g !== f).map((g) => `${who.es} ${feelingES(who, g)} ${w.es}.`);
    return listenExercise(rng, { id: `escuchar:${who.s}:${f.en}`, sentence, es, pool });
  }
  if (form === 'negativa') {
    const answer = who.were ? "weren't" : "wasn't";
    const esNo = es.replace(/(estaba|estábamos|estaban|estabas|Estaba|Estábamos|Estaban|Estabas)/, (m) => (m[0] === m[0].toUpperCase() ? `No ${m.toLowerCase()}` : `no ${m}`));
    return gapExercise({
      id: `negativa:${who.s}:${f.en}`, form, before: who.s, after: `${f.en} ${w.en}.`, answer, choices: ["wasn't", "weren't"],
      es: esNo, story: `Ponlo en negativo: “${esNo}”`, rule: `Negativa: ${en("wasn't")} (was not) y ${en("weren't")} (were not).`,
      ruleLines: ["I · he · she · it → wasn't", "you · we · they → weren't"], why: `Con ${en(who.s)} va ${en(answer)}.`,
    });
  }
  return gapExercise({
    id: `was-were:${who.s}:${f.en}`, form: 'was-were', before: who.s, after: `${f.en} ${w.en}.`, answer: verb, choices: ['was', 'were'],
    es, story: `Completa: “${es}”`, rule: RULE, ruleLines: RULE_LINES, why: `Con ${en(who.s)} va ${en(verb)}.`,
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Was y were 🕰️',
    paragraphs: [RULE, `${en('I was scared in the horror film.')} = Estaba asustada en la peli de terror.`],
    words: FEELINGS.map((f) => ({ en: f.en, es: f.es })),
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en('We were excited at the concert.')}`, sentenceView([{ text: 'We', mark: 'subject' }, { text: 'were', mark: 'verb' }, { text: 'excited at the concert.' }], 'Estábamos emocionadas en el concierto.')),
    ],
  },
  {
    title: 'There was, there were 👻',
    paragraphs: [`${en('There was')} = había (una cosa). ${en('There were')} = había (varias). Negativa: ${en("There wasn't")}, ${en("There weren't")}.`],
    words: [{ en: 'There was a zombie.', es: 'Había un zombi.' }, { en: 'There were two ghosts.', es: 'Había dos fantasmas.' }],
    frames: [enFrame(`${en('There were two ghosts in the film.')}`, sentenceView([{ text: 'There were', mark: 'verb' }, { text: 'two ghosts', mark: 'subject' }, { text: 'in the film.' }], 'Había dos fantasmas en la peli.'))],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_PAST,
  title: 'Was, were y feelings',
  emoji: '🕰️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
