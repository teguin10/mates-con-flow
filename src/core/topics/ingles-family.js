// Tema de inglés: la familia, el genitivo sajón (Sara's dog) y los
// posesivos (my, your, his, her, its, our, their). Starter 2.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_STARTER2, LEVEL_NAMES, SUBJECT, VOCAB_FORMS, choicesFor, en, gapExercise, generator, pickForm, vocabExercise,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-family';

export const FAMILY = [
  { en: 'mother', es: 'madre', emoji: '👩', accept: ['mum', 'mom'] }, { en: 'father', es: 'padre', emoji: '👨', accept: ['dad'] },
  { en: 'sister', es: 'hermana', emoji: '👧' }, { en: 'brother', es: 'hermano', emoji: '👦' },
  { en: 'grandmother', es: 'abuela', emoji: '👵', accept: ['grandma', 'granny'] }, { en: 'grandfather', es: 'abuelo', emoji: '👴', accept: ['grandpa'] },
  { en: 'aunt', es: 'tía', emoji: '👩‍🦰' }, { en: 'uncle', es: 'tío', emoji: '🧔' },
  { en: 'cousin', es: 'primo o prima', emoji: '🧒' }, { en: 'parents', es: 'padres (papá y mamá)', emoji: '👫' },
  { en: 'daughter', es: 'hija', emoji: '👶' }, { en: 'son', es: 'hijo', emoji: '🍼' },
];

// Posesivos: del pronombre al adjetivo.
export const POSSESSIVES = { I: 'my', you: 'your', he: 'his', she: 'her', it: 'its', we: 'our', they: 'their' };

const OWNERS = [
  { who: 'Sara', p: 'she', es: 'Sara' }, { who: 'Leo', p: 'he', es: 'Leo' }, { who: 'my cousin Ana', p: 'she', es: 'mi prima Ana' },
  { who: 'my uncle Tom', p: 'he', es: 'mi tío Tom' }, { who: 'my parents', p: 'they', es: 'mis padres' }, { who: 'the cat', p: 'it', es: 'el gato' },
];
const THINGS = [
  { en: 'dog', es: 'perro', art: 'el' }, { en: 'phone', es: 'móvil', art: 'el' }, { en: 'bike', es: 'bici', art: 'la' },
  { en: 'room', es: 'habitación', art: 'la' }, { en: 'favourite series', es: 'serie favorita', art: 'la' },
];

export const FORMS = {
  ...VOCAB_FORMS,
  genitivo: "De quién es (Sara's dog)",
  posesivo: 'Posesivos (my, his, her, their…)',
};

const LEVELS = {
  1: { choices: 3, words: 8, forms: [['significado', 3], ['traducir', 3], ['escuchar', 3]] },
  2: { choices: 3, words: 12, forms: [['traducir', 2], ['genitivo', 3], ['posesivo', 3], ['escribir', 2], ['escuchar', 1]] },
  3: { choices: 4, words: 12, forms: [['posesivo', 3], ['genitivo', 2], ['escribir', 2], ['dictado', 2]] },
};

const POSS_RULE = `${en('I')} → ${en('my')}, ${en('you')} → ${en('your')}, ${en('he')} → ${en('his')}, ${en('she')} → ${en('her')}, ${en('it')} → ${en('its')}, ${en('we')} → ${en('our')}, ${en('they')} → ${en('their')}.`;
const POSS_LINES = ['I → my · you → your', 'he → his · she → her · it → its', 'we → our · they → their'];

function buildGenitive(rng, count) {
  const owner = rng.pick(OWNERS.filter((o) => o.p !== 'they' && o.p !== 'it'));
  const thing = rng.pick(THINGS);
  const name = owner.who.split(' ').at(-1);
  const prefix = owner.who.split(' ').slice(0, -1).join(' ');
  const right = `${owner.who}'s ${thing.en}`;
  const wrong = [`${owner.who} ${thing.en}`, `${thing.en} of ${owner.who}`, `${owner.who}s ${thing.en}`, `the ${thing.en} ${owner.who}'s`];
  return {
    id: `genitivo:${owner.who}:${thing.en}`,
    form: 'genitivo',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, right, wrong, count),
    answer: right,
    audio: null,
    repeat: right,
    story: `📸 ¿Cómo se dice “${thing.art} ${thing.es} de ${owner.es}”?`,
    expression: `“${thing.art} ${thing.es} de ${owner.es}” = □`,
    theme: null,
    illustration: null,
    hint: `Primero el dueño con ${en("'s")} y después la cosa: ${en("Sara's dog")} = el perro de Sara.`,
    hintFrames: [enFrame(`Dueño + ${en("'s")} + cosa.`, { kind: 'sentence', parts: [{ text: "Sara's", mark: 'subject' }, { text: 'dog', mark: 'verb' }], es: 'el perro de Sara' })],
    steps: [`El dueño va primero con ${en("'s")}: ${en(`${prefix ? `${prefix} ` : ''}${name}'s`)}.`, `Queda ${en(right)}.`],
    frames: [
      enFrame(`En inglés, el dueño va delante con apóstrofo y s: ${en(right)}.`, { kind: 'sentence', parts: [{ text: `${owner.who}'s`, mark: 'subject' }, { text: thing.en, mark: 'verb' }], es: `${thing.art} ${thing.es} de ${owner.es}` }),
      enFrame(`Repite conmigo: ${en(right)}.`, { kind: 'sentence', parts: [{ text: right, mark: 'subject' }], es: null }),
    ],
  };
}

function buildPossessive(rng, level) {
  const owner = rng.pick(OWNERS);
  const thing = rng.pick(THINGS);
  const answer = POSSESSIVES[owner.p];
  const subject = owner.who[0].toUpperCase() + owner.who.slice(1);
  const verb = owner.p === 'they' ? 'love' : 'loves';
  const to = owner.es.startsWith('el ') ? `Al ${owner.es.slice(3)}` : `A ${owner.es}`;
  const es = `${to} le${owner.p === 'they' ? 's' : ''} encanta su ${thing.es}.`;
  return gapExercise({
    id: `posesivo:${owner.who}:${thing.en}`,
    form: 'posesivo',
    before: `${subject} ${verb}`,
    after: `${thing.en}.`,
    answer,
    ...(level === 3 && owner.p !== 'it' ? { text: true } : { choices: choicesFor(rng, answer, Object.values(POSSESSIVES), 3) }),
    es,
    story: `Completa con el posesivo: “${es}”`,
    rule: POSS_RULE,
    ruleLines: POSS_LINES,
    hint: `En español decimos “su” para todo, pero en inglés depende de quién: ${en('his')} (de él), ${en('her')} (de ella), ${en('its')} (de una cosa o animal), ${en('their')} (de ellos).`,
    why: `${en(owner.who)} es ${en(owner.p)}, así que va ${en(answer)}.`,
  });
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'genitivo') return buildGenitive(rng, cfg.choices);
  if (form === 'posesivo') return buildPossessive(rng, level);
  const pool = FAMILY.slice(0, cfg.words);
  return vocabExercise(rng, form, rng.pick(pool), pool, { choices: cfg.choices });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'My family 👨‍👩‍👧',
    paragraphs: ['La familia. Toca cada palabra, escúchala y repítela.'],
    words: FAMILY,
    frames: [
      enFrame(`${en('mother')}, ${en('father')}, ${en('sister')}, ${en('brother')}.`, { kind: 'cards', items: FAMILY.slice(0, 4), highlight: null, hide: null }),
      enFrame(`${en('grandmother')}, ${en('grandfather')}, ${en('aunt')}, ${en('uncle')}, ${en('cousin')}.`, { kind: 'cards', items: FAMILY.slice(4, 9), highlight: null, hide: null }),
    ],
  },
  {
    title: "Sara's dog 🐶",
    paragraphs: [`Para decir de quién es algo, el dueño va primero con ${en("'s")}: ${en("Sara's dog")} = el perro de Sara. ${en("my brother's room")} = la habitación de mi hermano.`],
    words: [{ en: "Sara's dog", es: 'el perro de Sara' }, { en: "my brother's room", es: 'la habitación de mi hermano' }],
    frames: [enFrame(`${en("Sara's dog")}: el perro de Sara.`, { kind: 'sentence', parts: [{ text: "Sara's", mark: 'subject' }, { text: 'dog', mark: 'verb' }], es: 'el perro de Sara' })],
  },
  {
    title: 'My, your, his, her… 💖',
    paragraphs: [POSS_RULE, `Ojo: “su” puede ser ${en('his')}, ${en('her')}, ${en('its')} o ${en('their')}, según de quién sea.`],
    words: Object.entries(POSSESSIVES).map(([p, a]) => ({ en: a, es: `de ${p}` })),
    frames: [enFrame(POSS_RULE, { kind: 'calc', lines: POSS_LINES })],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_STARTER2,
  title: 'Family y posesivos',
  emoji: '👨‍👩‍👧',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
