// Tema de inglés: contables e incontables; a/an o some; how much / how many;
// much, many y a lot of.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_FOOD, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, pickForm, sentenceView,
} from './ingles-comun.js';
import { FOOD, DRINKS } from './ingles-food.js';

const TOPIC_ID = 'ingles-countable';
const ALL = [...FOOD, ...DRINKS];

// Plural de las contables de la lista.
const plural = (w) => (w.endsWith('y') ? `${w.slice(0, -1)}ies` : w.endsWith('o') ? `${w}es` : w.endsWith('ch') ? `${w}es` : `${w}s`);
const article = (w) => (/^[aeiou]/.test(w) ? 'an' : 'a');
// Género en español, para «una manzana», «cuánta leche».
const FEMININE = new Set(['manzana', 'fresa', 'galleta', 'tortita', 'leche', 'agua', 'pasta', 'ensalada']);
const fem = (es) => FEMININE.has(es.split(' ')[0]);

export const FORMS = {
  contable: '¿Contable o incontable?',
  'a-some': 'A/an o some',
  'how-much': 'How much o how many',
  'much-many': 'Much, many o a lot of',
};

const LEVELS = {
  1: { forms: [['contable', 4], ['a-some', 3]] },
  2: { forms: [['contable', 1], ['a-some', 2], ['how-much', 4]] },
  3: { forms: [['how-much', 2], ['much-many', 5]] },
};

const RULE = `Contables (se cuentan: ${en('one apple, two apples')}) e incontables (no se cuentan: ${en('milk')}, ${en('bread')}, ${en('rice')}). Las incontables no tienen plural ni llevan ${en('a')}.`;
const RULE_LINES = ['🍎 contable: an apple · two apples', '🥛 incontable: some milk (no «a milk»)'];

function buildCountable(rng) {
  const item = rng.pick(ALL);
  const answer = item.count ? 'Contable' : 'Incontable';
  return {
    id: `contable:${item.en}`,
    form: 'contable',
    answerType: 'choice',
    choices: ['Contable', 'Incontable'],
    answer,
    audio: item.en,
    repeat: item.count ? `${article(item.en)} ${item.en}, two ${plural(item.en)}` : `some ${item.en}`,
    story: `${item.emoji} En inglés, ${en(item.en)} (${item.es}), ¿es contable o incontable?`,
    expression: `${en(item.en)} → □`,
    theme: null,
    illustration: null,
    hint: `Pregúntate si en inglés se dice ${en(`one ${item.en}, two ${plural(item.en)}`)}. Las cosas que son masa o líquido (leche, arroz, pan, queso) son incontables.`,
    hintFrames: [enFrame(RULE, { kind: 'calc', lines: RULE_LINES })],
    steps: [item.count ? `Se cuenta: ${en(`one ${item.en}, two ${plural(item.en)}`)}. Es contable.` : `No se cuenta (no se dice ${en(`two ${plural(item.en)}`)}): es incontable. Se dice ${en(`some ${item.en}`)}.`],
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(item.count ? `${en(item.en)} se puede contar: ${en(`one ${item.en}, two ${plural(item.en)}`)}.` : `${en(item.en)} no se cuenta: ${en(`some ${item.en}`)}.`, { kind: 'cards', items: [item], highlight: 0, hide: null }),
    ],
  };
}

function buildArticle(rng) {
  const item = rng.pick(ALL.filter((x) => !x.en.includes(' ')));
  const answer = item.count ? article(item.en) : 'some';
  return gapExercise({
    id: `a-some:${item.en}`,
    form: 'a-some',
    before: "I'd like",
    after: `${item.en}, please.`,
    answer,
    choices: ['a', 'an', 'some'],
    es: item.count ? `Quiero ${fem(item.es) ? 'una' : 'un'} ${item.es}, por favor.` : `Quiero ${item.es}, por favor.`,
    story: `🍽️ Pides en una cafetería de Londres: “${item.es}”. ¿Qué palabra va?`,
    rule: `Con una cosa contable: ${en('a')} (o ${en('an')} delante de vocal). Con incontables: ${en('some')}.`,
    ruleLines: ['a banana · an apple', 'some milk · some bread'],
    why: item.count ? `${en(item.en)} es contable${answer === 'an' ? ' y empieza por vocal' : ''}: ${en(answer)}.` : `${en(item.en)} es incontable: ${en('some')}.`,
  });
}

function buildHow(rng) {
  const item = rng.pick(ALL.filter((x) => !x.en.includes(' ') || !x.count));
  const answer = item.count ? 'How many' : 'How much';
  const noun = item.count ? plural(item.en) : item.en;
  return gapExercise({
    id: `how-much:${item.en}`,
    form: 'how-much',
    before: '',
    after: `${noun} do we need?`,
    answer,
    choices: ['How much', 'How many'],
    es: `¿Cuánt${fem(item.es) ? 'a' : 'o'}${item.count ? 's' : ''} ${item.count ? `${item.es}s` : item.es} necesitamos?`,
    story: `🛒 Hacéis la lista para las tortitas. ¿Qué pregunta va?`,
    illustration: { kind: 'cards', items: [item], highlight: null, hide: 'en' },
    rule: `${en('How many')} con contables en plural (${en('How many eggs?')}); ${en('How much')} con incontables (${en('How much milk?')}).`,
    ruleLines: ['How many eggs? 🥚🥚', 'How much milk? 🥛'],
    why: item.count ? `${en(item.en)} es contable: ${en('How many')}.` : `${en(item.en)} es incontable: ${en('How much')}.`,
  });
}

function buildMuchMany(rng) {
  const item = rng.pick(ALL.filter((x) => !x.en.includes(' ') || !x.count));
  const kind = rng.pick(['negative', 'question', 'positive']);
  const noun = item.count ? plural(item.en) : item.en;
  const answer = kind === 'positive' ? 'a lot of' : item.count ? 'many' : 'much';
  const before = kind === 'positive' ? `There ${item.count ? 'are' : 'is'}` : kind === 'negative' ? `There ${item.count ? "aren't" : "isn't"}` : `Are there`;
  const after = kind === 'question' ? `${noun}?` : `${noun} in the fridge.`;
  const fixedBefore = kind === 'question' ? (item.count ? 'Are there' : 'Is there') : before;
  return gapExercise({
    id: `much-many:${item.en}:${kind}`,
    form: 'much-many',
    before: fixedBefore,
    after,
    answer,
    choices: choicesFor(rng, answer, ['much', 'many', 'a lot of'], 3),
    es: null,
    story: `🧊 ¿Qué palabra va? (${kind === 'positive' ? 'frase afirmativa: hay mucho' : kind === 'negative' ? 'frase negativa: no hay mucho' : 'pregunta: ¿hay mucho?'})`,
    illustration: { kind: 'cards', items: [item], highlight: null, hide: null },
    rule: `${en('a lot of')} en afirmativas (con todo). En negativas y preguntas: ${en('many')} con contables y ${en('much')} con incontables.`,
    ruleLines: ['✔ There are a lot of eggs.', "✘ There aren't many eggs. · There isn't much milk.", '? Are there many eggs? · Is there much milk?'],
    why: kind === 'positive' ? `Es afirmativa: ${en('a lot of')}.` : `Es ${kind === 'negative' ? 'negativa' : 'una pregunta'} y ${en(item.en)} es ${item.count ? `contable: ${en('many')}` : `incontable: ${en('much')}`}.`,
  });
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'contable') return buildCountable(rng);
  if (form === 'a-some') return buildArticle(rng);
  if (form === 'how-much') return buildHow(rng);
  return buildMuchMany(rng);
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Contables e incontables 🍎🥛',
    paragraphs: [RULE, `Con contables: ${en('an apple')}, ${en('two apples')}. Con incontables: ${en('some milk')}, ${en('some bread')}.`],
    words: [{ en: 'an apple', es: 'una manzana' }, { en: 'two apples', es: 'dos manzanas' }, { en: 'some milk', es: 'leche' }, { en: 'some bread', es: 'pan' }],
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en('some milk')}, nunca ${en('a milk')}.`, sentenceView([{ text: 'some', mark: 'verb' }, { text: 'milk', mark: 'subject' }], 'leche')),
    ],
  },
  {
    title: 'How much? How many? 🛒',
    paragraphs: [`${en('How many')} + contables en plural; ${en('How much')} + incontables. En afirmativas, ${en('a lot of')}; en negativas y preguntas, ${en('many')} o ${en('much')}.`],
    words: [{ en: 'How many eggs?', es: '¿Cuántos huevos?' }, { en: 'How much milk?', es: '¿Cuánta leche?' }, { en: 'There are a lot of strawberries.', es: 'Hay muchas fresas.' }, { en: "There isn't much cheese.", es: 'No hay mucho queso.' }],
    frames: [
      enFrame(`${en('How many eggs?')} ${en('How much milk?')}`, { kind: 'calc', lines: ['How many eggs? 🥚🥚', 'How much milk? 🥛'] }),
      enFrame(`${en('There are a lot of strawberries.')}`, sentenceView([{ text: 'There are' }, { text: 'a lot of', mark: 'verb' }, { text: 'strawberries.', mark: 'subject' }], 'Hay muchas fresas.')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_FOOD,
  title: 'Much, many y contables',
  emoji: '🥛',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
