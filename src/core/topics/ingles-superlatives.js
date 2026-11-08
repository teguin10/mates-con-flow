// Tema de inglés: superlativos (the tallest, the most expensive, the best).

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_FUTURE, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, pickForm, sentenceView,
} from './ingles-comun.js';
import { ADJECTIVES } from './ingles-comparatives.js';

const TOPIC_ID = 'ingles-superlatives';

const SUP_RULES = {
  short: `Cortos: ${en('the')} + ${en('-est')} (${en('tall')} → ${en('the tallest')}).`,
  e: `Acaba en ${en('-e')}: ${en('the')} + ${en('-st')} (${en('nice')} → ${en('the nicest')}).`,
  double: `Se dobla la consonante: ${en('big')} → ${en('the biggest')}.`,
  y: `Acaba en ${en('-y')}: ${en('-iest')} (${en('funny')} → ${en('the funniest')}).`,
  long: `Largos: ${en('the most')} + adjetivo (${en('the most expensive')}).`,
  irr: `Irregulares: ${en('good')} → ${en('the best')}, ${en('bad')} → ${en('the worst')}.`,
};

const SENTENCES = [
  { s: 'The giraffe', adj: 'tall', c: 'animal in the zoo.', es: 'La jirafa es el animal más alto del zoo.' },
  { s: 'The cheetah', adj: 'fast', c: 'animal in the world.', es: 'El guepardo es el animal más rápido del mundo.' },
  { s: 'The blue whale', adj: 'big', c: 'animal in the sea.', es: 'La ballena azul es el animal más grande del mar.' },
  { s: 'August', adj: 'hot', c: 'month of the year.', es: 'Agosto es el mes más caluroso del año.' },
  { s: 'This', adj: 'scary', c: 'film I know!', es: '¡Esta es la peli que más miedo da que conozco!' },
  { s: 'She', adj: 'funny', c: 'girl in my class.', es: 'Ella es la chica más divertida de mi clase.' },
  { s: 'That', adj: 'expensive', c: 'phone in the shop.', es: 'Ese es el móvil más caro de la tienda.' },
  { s: 'You', adj: 'good', c: 'player in the team!', es: '¡Eres la mejor jugadora del equipo!' },
  { s: 'Monday', adj: 'bad', c: 'day of the week.', es: 'El lunes es el peor día de la semana.' },
  { s: 'Crepes', adj: 'nice', c: 'dessert ever.', es: 'Las crepes son el postre más rico del mundo.' },
  { s: 'This', adj: 'interesting', c: 'book in the library.', es: 'Este es el libro más interesante de la biblioteca.' },
];

export const FORMS = {
  superlativo: 'Elegir el superlativo',
  escribir: 'Escribir el superlativo',
  comparar: '¿Comparativo o superlativo?',
};

const LEVELS = {
  1: { forms: [['superlativo', 4], ['comparar', 2]] },
  2: { forms: [['superlativo', 2], ['escribir', 3], ['comparar', 2]] },
  3: { forms: [['escribir', 4], ['comparar', 2]] },
};

const adjOf = (adj) => ADJECTIVES.find((x) => x.adj === adj);
const verbFor = (s) => (s === 'You' ? 'are' : s === 'Crepes' ? 'are' : 'is');
const wrongSups = (x) => [`the ${x.adj}est`, `the most ${x.adj}`, x.comp, `the ${x.comp}`, `the most ${x.sup.replace(/^the /, '')}`].filter((w) => w !== x.sup);

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'comparar') {
    const x = rng.pick(ADJECTIVES);
    const two = rng.next() < 0.5;
    return {
      id: `comparar:${x.adj}:${two}`,
      form,
      answerType: 'choice',
      choicesLang: 'en',
      choices: [x.comp, x.sup],
      answer: two ? x.comp : x.sup,
      audio: null,
      repeat: two ? x.comp : x.sup,
      story: two ? `⚖️ Comparas dos cosas (${x.es}). ¿Qué forma va?` : `🏆 Es el más ${x.es} de todo un grupo. ¿Qué forma va?`,
      expression: `${en(x.adj)} → □`,
      cue: x.adj,
      theme: null,
      illustration: null,
      hint: `Para dos cosas, comparativo (${en('taller than')}); para destacar una entre todas, superlativo (${en('the tallest')}).`,
      hintFrames: [enFrame('Dos cosas: comparativo. Una entre todas: superlativo.', { kind: 'calc', lines: ['2 → taller than', 'todas → the tallest'] })],
      steps: [two ? `Dos cosas: comparativo, ${en(x.comp)}.` : `Una entre todas: superlativo, ${en(x.sup)}.`],
      frames: [enFrame(two ? `Son dos cosas: ${en(x.comp)}.` : `Es una entre todas: ${en(x.sup)}.`, sentenceView([{ text: x.adj, mark: 'subject' }, { text: '→' }, { text: two ? x.comp : x.sup, mark: 'verb' }]))],
    };
  }
  const st = rng.pick(SENTENCES);
  const x = adjOf(st.adj);
  return gapExercise({
    id: `${form}:${st.s}:${st.adj}`,
    form,
    before: `${st.s} ${verbFor(st.s)}`,
    after: st.c,
    answer: x.sup,
    ...(form === 'escribir' ? { text: true } : { choices: choicesFor(rng, x.sup, wrongSups(x), 3) }),
    es: st.es,
    cue: x.adj,
    story: `Pon ${en(x.adj)} en superlativo: “${st.es}”`,
    rule: SUP_RULES[x.rule],
    ruleLines: ['tall → the tallest', 'funny → the funniest', 'expensive → the most expensive', 'good → the best'],
    why: SUP_RULES[x.rule],
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'The tallest 🏆',
    paragraphs: [
      `El superlativo destaca una cosa entre todas: ${en('The giraffe is the tallest animal in the zoo.')}`,
      `${SUP_RULES.short} ${SUP_RULES.y} ${SUP_RULES.long} ${SUP_RULES.irr}`,
    ],
    words: ADJECTIVES.slice(0, 8).map((x) => ({ en: `${x.adj} → ${x.sup}`, es: x.es })),
    frames: [
      enFrame(`${en('The giraffe is the tallest animal in the zoo.')}`, sentenceView([{ text: 'The giraffe is' }, { text: 'the tallest', mark: 'verb' }, { text: 'animal in the zoo.', mark: 'subject' }], 'La jirafa es el animal más alto del zoo.')),
      enFrame(SUP_RULES.long, sentenceView([{ text: 'expensive', mark: 'subject' }, { text: '→' }, { text: 'the most expensive', mark: 'verb' }])),
    ],
  },
  {
    title: 'The best, the worst ⭐',
    paragraphs: [SUP_RULES.irr, `${en('You are the best player in the team!')}`],
    words: ADJECTIVES.slice(8).map((x) => ({ en: `${x.adj} → ${x.sup}`, es: x.es })),
    frames: [enFrame(`${en('You are the best player in the team!')}`, sentenceView([{ text: 'You are' }, { text: 'the best', mark: 'verb' }, { text: 'player in the team!', mark: 'subject' }], '¡Eres la mejor jugadora del equipo!'))],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_FUTURE,
  title: 'Superlativos: the best',
  emoji: '🏆',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
