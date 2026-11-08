// Tema de inglés: this, that, these, those y los plurales (regulares e
// irregulares). Starter 2.

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_STARTER2, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, pickForm, sentenceView } from './ingles-comun.js';

const TOPIC_ID = 'ingles-this-that';

// Plurales: regla y ejemplos.
export const PLURALS = [
  { one: 'cat', many: 'cats', rule: 's', emoji: '🐱', es: 'gato' }, { one: 'book', many: 'books', rule: 's', emoji: '📕', es: 'libro' },
  { one: 'girl', many: 'girls', rule: 's', emoji: '👧', es: 'chica' }, { one: 'bus', many: 'buses', rule: 'es', emoji: '🚌', es: 'autobús' },
  { one: 'box', many: 'boxes', rule: 'es', emoji: '📦', es: 'caja' }, { one: 'watch', many: 'watches', rule: 'es', emoji: '⌚', es: 'reloj' },
  { one: 'dress', many: 'dresses', rule: 'es', emoji: '👗', es: 'vestido' }, { one: 'baby', many: 'babies', rule: 'ies', emoji: '👶', es: 'bebé' },
  { one: 'party', many: 'parties', rule: 'ies', emoji: '🎉', es: 'fiesta' }, { one: 'strawberry', many: 'strawberries', rule: 'ies', emoji: '🍓', es: 'fresa' },
  { one: 'child', many: 'children', rule: 'irr', emoji: '🧒', es: 'niño' }, { one: 'man', many: 'men', rule: 'irr', emoji: '👨', es: 'hombre' },
  { one: 'woman', many: 'women', rule: 'irr', emoji: '👩', es: 'mujer' }, { one: 'foot', many: 'feet', rule: 'irr', emoji: '🦶', es: 'pie' },
  { one: 'tooth', many: 'teeth', rule: 'irr', emoji: '🦷', es: 'diente' }, { one: 'mouse', many: 'mice', rule: 'irr', emoji: '🐭', es: 'ratón' },
  { one: 'person', many: 'people', rule: 'irr', emoji: '🧑', es: 'persona' },
];

const RULES = {
  s: `Casi todos añaden ${en('-s')}: ${en('cat')} → ${en('cats')}.`,
  es: `Si acaba en ${en('-s')}, ${en('-x')}, ${en('-ch')} o ${en('-sh')}, añade ${en('-es')}: ${en('box')} → ${en('boxes')}.`,
  ies: `Si acaba en consonante + ${en('-y')}, la ${en('y')} cambia a ${en('-ies')}: ${en('baby')} → ${en('babies')}.`,
  irr: `Es irregular: hay que aprendérselo. ${en('child')} → ${en('children')}, ${en('man')} → ${en('men')}, ${en('foot')} → ${en('feet')}.`,
};

const DEMONSTRATIVES = {
  'this': { near: true, plural: false, es: 'este / esta (aquí)' },
  that: { near: false, plural: false, es: 'ese / esa / aquel (allí)' },
  these: { near: true, plural: true, es: 'estos / estas (aquí)' },
  those: { near: false, plural: true, es: 'esos / esas / aquellos (allí)' },
};
const DEMO_RULE = `Cerca: ${en('this')} (uno) y ${en('these')} (varios). Lejos: ${en('that')} (uno) y ${en('those')} (varios).`;
const DEMO_LINES = ['👇 aquí: this (1) · these (+)', '👉 allí: that (1) · those (+)'];

export const FORMS = {
  demostrativo: 'This, that, these, those',
  plural: 'Elegir el plural',
  'escribir-plural': 'Escribir el plural',
};

const LEVELS = {
  1: { forms: [['demostrativo', 4], ['plural', 3]], rules: ['s', 'es'] },
  2: { forms: [['demostrativo', 3], ['plural', 3], ['escribir-plural', 2]], rules: ['s', 'es', 'ies', 'irr'] },
  3: { forms: [['escribir-plural', 4], ['demostrativo', 2], ['plural', 2]], rules: ['es', 'ies', 'irr'] },
};

const wrongPlurals = (x) => [`${x.one}s`, `${x.one}es`, `${x.one.replace(/y$/, '')}ies`, `${x.many}s`].filter((w) => w !== x.many);

function buildDemonstrative(rng, rules) {
  const x = rng.pick(PLURALS.filter((p) => rules.includes(p.rule) || p.rule === 's'));
  const near = rng.next() < 0.5;
  const plural = rng.next() < 0.5;
  const word = Object.keys(DEMONSTRATIVES).find((k) => DEMONSTRATIVES[k].near === near && DEMONSTRATIVES[k].plural === plural);
  const noun = plural ? x.many : x.one;
  const verb = plural ? 'are' : 'is';
  const where = near ? '👇 Lo tienes aquí, en la mano.' : '👉 Está allí, lejos.';
  const how = plural ? 'Hay varios' : 'Hay uno';
  return gapExercise({
    id: `demostrativo:${word}:${x.one}`,
    form: 'demostrativo',
    before: '',
    after: `${noun} ${verb} great!`,
    answer: word[0].toUpperCase() + word.slice(1),
    choices: ['This', 'That', 'These', 'Those'],
    es: null,
    story: `${where} ${how}. ¿Qué palabra va?`,
    illustration: { kind: 'cards', items: Array.from({ length: plural ? 3 : 1 }, () => ({ emoji: x.emoji })), highlight: null, hide: null },
    rule: DEMO_RULE,
    ruleLines: DEMO_LINES,
    why: `${near ? 'Está cerca' : 'Está lejos'} y ${plural ? 'son varios' : 'es uno'}: ${en(word)}.`,
  });
}

function buildPlural(rng, rules, typed) {
  const x = rng.pick(PLURALS.filter((p) => rules.includes(p.rule)));
  const base = {
    id: `${typed ? 'escribir-plural' : 'plural'}:${x.one}`,
    form: typed ? 'escribir-plural' : 'plural',
    answer: x.many,
    repeat: `one ${x.one}, two ${x.many}`,
    story: `${x.emoji} ¿Cuál es el plural de ${en(x.one)} (${x.es})?`,
    expression: `${en(`one ${x.one}`)} → ${en('two')} □`,
    theme: null,
    illustration: { kind: 'cards', items: [{ emoji: x.emoji }, { emoji: x.emoji }], highlight: null, hide: null },
    hint: RULES[x.rule],
    hintFrames: [enFrame(RULES[x.rule], sentenceView([{ text: x.one, mark: 'subject' }, { text: '→' }, { text: '?', mark: 'verb' }]))],
    steps: [RULES[x.rule], `${en(x.one)} → ${en(x.many)}.`],
    frames: [
      enFrame(RULES[x.rule], sentenceView([{ text: x.one, mark: 'subject' }, { text: '→' }, { text: x.many, mark: 'verb' }])),
      enFrame(`Repite conmigo: ${en(`one ${x.one}, two ${x.many}`)}.`, sentenceView([{ text: `one ${x.one}`, mark: 'subject' }, { text: `two ${x.many}`, mark: 'verb' }])),
    ],
  };
  return typed
    ? { ...base, answerType: 'text', accept: [] }
    : { ...base, answerType: 'choice', choicesLang: 'en', choices: choicesFor(rng, x.many, wrongPlurals(x), 3) };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'demostrativo') return buildDemonstrative(rng, cfg.rules);
  return buildPlural(rng, cfg.rules, form === 'escribir-plural');
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'This, that, these, those 👇👉',
    paragraphs: [DEMO_RULE, `${en('This is my phone.')} ${en('Those are my friends.')}`],
    words: Object.entries(DEMONSTRATIVES).map(([k, v]) => ({ en: k, es: v.es })),
    frames: [
      enFrame(DEMO_RULE, { kind: 'calc', lines: DEMO_LINES }),
      enFrame(`${en('These are my crepes.')}`, sentenceView([{ text: 'These', mark: 'verb' }, { text: 'are my crepes.' }], 'Estas son mis crepes (aquí).')),
    ],
  },
  {
    title: 'Plurales 🐱🐱',
    paragraphs: [RULES.s, RULES.es, RULES.ies, RULES.irr],
    words: PLURALS.filter((p) => p.rule === 'irr').map((p) => ({ en: `${p.one} → ${p.many}`, es: p.es, emoji: p.emoji })),
    frames: [
      enFrame(RULES.es, sentenceView([{ text: 'box', mark: 'subject' }, { text: '→' }, { text: 'boxes', mark: 'verb' }])),
      enFrame(RULES.ies, sentenceView([{ text: 'baby', mark: 'subject' }, { text: '→' }, { text: 'babies', mark: 'verb' }])),
      enFrame(RULES.irr, sentenceView([{ text: 'child', mark: 'subject' }, { text: '→' }, { text: 'children', mark: 'verb' }])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_STARTER2,
  title: 'This, that y plurales',
  emoji: '👉',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
