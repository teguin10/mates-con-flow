// Tema de inglés: comparativos (taller, more expensive, better… than).

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_FUTURE, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-comparatives';

// Adjetivos con su comparativo, su superlativo y la regla.
export const ADJECTIVES = [
  { adj: 'tall', comp: 'taller', sup: 'the tallest', rule: 'short', es: 'alto' },
  { adj: 'fast', comp: 'faster', sup: 'the fastest', rule: 'short', es: 'rápido' },
  { adj: 'small', comp: 'smaller', sup: 'the smallest', rule: 'short', es: 'pequeño' },
  { adj: 'old', comp: 'older', sup: 'the oldest', rule: 'short', es: 'mayor' },
  { adj: 'big', comp: 'bigger', sup: 'the biggest', rule: 'double', es: 'grande' },
  { adj: 'hot', comp: 'hotter', sup: 'the hottest', rule: 'double', es: 'caluroso' },
  { adj: 'funny', comp: 'funnier', sup: 'the funniest', rule: 'y', es: 'divertido' },
  { adj: 'easy', comp: 'easier', sup: 'the easiest', rule: 'y', es: 'fácil' },
  { adj: 'scary', comp: 'scarier', sup: 'the scariest', rule: 'y', es: 'que da miedo' },
  { adj: 'nice', comp: 'nicer', sup: 'the nicest', rule: 'e', es: 'bonito' },
  { adj: 'expensive', comp: 'more expensive', sup: 'the most expensive', rule: 'long', es: 'caro' },
  { adj: 'beautiful', comp: 'more beautiful', sup: 'the most beautiful', rule: 'long', es: 'precioso' },
  { adj: 'interesting', comp: 'more interesting', sup: 'the most interesting', rule: 'long', es: 'interesante' },
  { adj: 'good', comp: 'better', sup: 'the best', rule: 'irr', es: 'bueno' },
  { adj: 'bad', comp: 'worse', sup: 'the worst', rule: 'irr', es: 'malo' },
];

export const RULES = {
  short: `Adjetivos cortos: + ${en('-er')} (${en('tall')} → ${en('taller')}).`,
  e: `Si acaba en ${en('-e')}, solo + ${en('-r')} (${en('nice')} → ${en('nicer')}).`,
  double: `Consonante + vocal + consonante: se dobla (${en('big')} → ${en('bigger')}).`,
  y: `Acaba en ${en('-y')}: ${en('-ier')} (${en('funny')} → ${en('funnier')}).`,
  long: `Adjetivos largos: ${en('more')} + adjetivo (${en('more expensive')}).`,
  irr: `Irregulares: ${en('good')} → ${en('better')}, ${en('bad')} → ${en('worse')}.`,
};

// es: la frase en español, escrita a mano para que concuerde.
const PAIRS = [
  { a: 'A giraffe', b: 'a horse', adj: 'tall', es: 'Una jirafa es más alta que un caballo.' },
  { a: 'A lion', b: 'a snake', adj: 'fast', es: 'Un león es más rápido que una serpiente.' },
  { a: 'A mouse', b: 'a rabbit', adj: 'small', es: 'Un ratón es más pequeño que un conejo.' },
  { a: 'An elephant', b: 'a bear', adj: 'big', es: 'Un elefante es más grande que un oso.' },
  { a: 'Summer', b: 'spring', adj: 'hot', es: 'El verano es más caluroso que la primavera.' },
  { a: 'This film', b: 'that film', adj: 'scary', es: 'Esta peli da más miedo que esa.' },
  { a: 'Maths', b: 'History', adj: 'easy', es: 'Mates es más fácil que Historia.' },
  { a: 'My trainers', b: 'your trainers', adj: 'expensive', verb: 'are', es: 'Mis zapatillas son más caras que las tuyas.' },
  { a: 'Pancakes', b: 'salad', adj: 'good', verb: 'are', es: 'Las tortitas son mejores que la ensalada.' },
  { a: 'My cousin', b: 'me', adj: 'old', es: 'Mi prima es mayor que yo.' },
  { a: 'This YouTuber', b: 'that one', adj: 'funny', es: 'Esta youtuber es más divertida que esa.' },
];

export const FORMS = {
  comparativo: 'Elegir el comparativo',
  escribir: 'Escribir el comparativo',
  than: 'Comparar dos cosas (… than …)',
};

const LEVELS = {
  1: { forms: [['comparativo', 4], ['than', 2]] },
  2: { forms: [['comparativo', 2], ['than', 3], ['escribir', 2]] },
  3: { forms: [['escribir', 4], ['than', 2]] },
};

const adjOf = (adj) => ADJECTIVES.find((x) => x.adj === adj);
const wrongComps = (x) => [`${x.adj}er`, `more ${x.adj}`, `${x.adj}${x.adj.at(-1)}er`, `more ${x.comp}`, `${x.adj.replace(/y$/, 'i')}er`].filter((w) => w !== x.comp);

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  const p = rng.pick(PAIRS);
  const x = adjOf(p.adj);
  const verb = p.verb ?? 'is';
  const { es } = p;
  if (form === 'than') {
    const right = `${p.a} ${verb} ${x.comp} than ${p.b}.`;
    const wrong = [`${p.a} ${verb} ${x.comp} that ${p.b}.`, `${p.a} ${verb} more ${x.adj} that ${p.b}.`, `${p.a} ${verb} ${x.adj} than ${p.b}.`].filter((w) => w !== right);
    return {
      id: `than:${p.a}:${p.adj}`,
      form: 'than',
      answerType: 'choice',
      choicesLang: 'en',
      choices: choicesFor(rng, right, wrong, 3),
      answer: right,
      audio: null,
      repeat: right,
      story: `⚖️ ¿Cómo se dice “${es}”?`,
      expression: '□',
      theme: null,
      illustration: null,
      hint: `Comparativo + ${en('than')} (que): ${en('taller than')}. Ojo: ${en('than')}, no ${en('that')}.`,
      hintFrames: [enFrame(RULES[x.rule], { kind: 'calc', lines: ['tall → taller than', 'expensive → more expensive than'] })],
      steps: [RULES[x.rule], `${en(right)}`],
      frames: [
        enFrame(RULES[x.rule], sentenceView([{ text: x.adj, mark: 'subject' }, { text: '→' }, { text: x.comp, mark: 'verb' }])),
        enFrame(`${en(right)}`, sentenceView([{ text: p.a, mark: 'subject' }, { text: verb }, { text: `${x.comp} than`, mark: 'verb' }, { text: `${p.b}.` }], es)),
      ],
    };
  }
  return gapExercise({
    id: `${form}:${p.a}:${p.adj}`,
    form,
    before: `${p.a} ${verb}`,
    after: `than ${p.b}.`,
    answer: x.comp,
    ...(form === 'escribir' ? { text: true } : { choices: choicesFor(rng, x.comp, wrongComps(x), 3) }),
    es,
    cue: x.adj,
    story: `Pon ${en(x.adj)} (${x.es}) en comparativo: “${es}”`,
    rule: RULES[x.rule],
    ruleLines: ['tall → taller', 'big → bigger · funny → funnier', 'expensive → more expensive', 'good → better · bad → worse'],
    why: RULES[x.rule],
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Taller than 🦒',
    paragraphs: [
      `Para comparar dos cosas: comparativo + ${en('than')}. ${en('A giraffe is taller than a horse.')}`,
      `${RULES.short} ${RULES.y} ${RULES.long} ${RULES.irr}`,
    ],
    words: ADJECTIVES.slice(0, 8).map((x) => ({ en: `${x.adj} → ${x.comp}`, es: x.es })),
    frames: [
      enFrame(`${en('A giraffe is taller than a horse.')}`, sentenceView([{ text: 'A giraffe', mark: 'subject' }, { text: 'is' }, { text: 'taller than', mark: 'verb' }, { text: 'a horse.' }], 'Una jirafa es más alta que un caballo.')),
      enFrame(RULES.long, sentenceView([{ text: 'expensive', mark: 'subject' }, { text: '→' }, { text: 'more expensive', mark: 'verb' }])),
    ],
  },
  {
    title: 'Better y worse ⭐',
    paragraphs: [RULES.irr, `${en('Pancakes are better than salad!')}`],
    words: ADJECTIVES.slice(8).map((x) => ({ en: `${x.adj} → ${x.comp}`, es: x.es })),
    frames: [enFrame(`${en('Pancakes are better than salad!')}`, sentenceView([{ text: 'Pancakes', mark: 'subject' }, { text: 'are' }, { text: 'better than', mark: 'verb' }, { text: 'salad!' }], '¡Las tortitas son mejores que la ensalada!'))],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_FUTURE,
  title: 'Comparativos: taller than',
  emoji: '🦒',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
