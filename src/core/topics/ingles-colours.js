// Tema de inglés: los colores y las cosas de clase (nivel cero). En el nivel
// Pro se juntan: el color va delante de la cosa («a pink pencil»).

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK, LEVEL_NAMES, SUBJECT, VOCAB_FORMS, cardsView, choicesFor, en, generator, pickForm, sentenceView, vocabExercise,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-colours';

// es / esF: masculino y femenino, para concordar con la cosa en español.
export const COLOURS = [
  { en: 'red', es: 'rojo', esF: 'roja', swatch: '#e53935' },
  { en: 'blue', es: 'azul', esF: 'azul', swatch: '#1e88e5' },
  { en: 'yellow', es: 'amarillo', esF: 'amarilla', swatch: '#fdd835' },
  { en: 'green', es: 'verde', esF: 'verde', swatch: '#43a047' },
  { en: 'pink', es: 'rosa', esF: 'rosa', swatch: '#ff5fa2' },
  { en: 'black', es: 'negro', esF: 'negra', swatch: '#141216' },
  { en: 'white', es: 'blanco', esF: 'blanca', swatch: '#fafafa' },
  { en: 'orange', es: 'naranja', esF: 'naranja', swatch: '#fb8c00' },
  { en: 'purple', es: 'morado', esF: 'morada', swatch: '#8e24aa' },
  { en: 'grey', es: 'gris', esF: 'gris', swatch: '#9e9e9e', accept: ['gray'], note: `En inglés británico se escribe ${en('grey')}; en americano, ${en('gray')}.` },
  { en: 'brown', es: 'marrón', esF: 'marrón', swatch: '#6d4c41' },
];

// g: género en español (para «un lápiz rosa», «una regla roja»).
export const THINGS = [
  { en: 'pencil', es: 'lápiz', g: 'm', emoji: '✏️' },
  { en: 'pen', es: 'boli', g: 'm', emoji: '🖊️' },
  { en: 'book', es: 'libro', g: 'm', emoji: '📕' },
  { en: 'notebook', es: 'cuaderno', g: 'm', emoji: '📓' },
  { en: 'ruler', es: 'regla', g: 'f', emoji: '📏' },
  { en: 'schoolbag', es: 'mochila', g: 'f', emoji: '🎒', accept: ['school bag', 'bag'] },
  { en: 'chair', es: 'silla', g: 'f', emoji: '🪑' },
  { en: 'computer', es: 'ordenador', g: 'm', emoji: '💻' },
  { en: 'scissors', es: 'tijeras', g: 'f', emoji: '✂️' },
];

export const FORMS = { ...VOCAB_FORMS, orden: 'Color y cosa juntos (a pink pencil)' };

const LEVELS = {
  1: { choices: 3, colours: 6, things: 0, forms: [['significado', 4], ['traducir', 3], ['escuchar', 3]] },
  2: { choices: 3, colours: 11, things: 9, forms: [['significado', 2], ['traducir', 3], ['escuchar', 3], ['escribir', 3]] },
  3: { choices: 4, colours: 11, things: 9, forms: [['orden', 4], ['escribir', 3], ['dictado', 2], ['escuchar', 1]] },
};

const CONTEXTS = [
  '🎨 Estás pintando una carta para tu amiga.',
  '🛍️ Estás comprando material en una papelería de Londres.',
  '💅 Estás eligiendo colores para decorar tu estuche.',
];

const article = (word) => (/^[aeiou]/.test(word) ? 'an' : 'a');

function buildOrder(rng, count) {
  const colour = rng.pick(COLOURS);
  const thing = rng.pick(THINGS.filter((t) => t.en !== 'scissors'));
  const a = article(colour.en);
  const right = `${a} ${colour.en} ${thing.en}`;
  const wrong = [`${article(thing.en)} ${thing.en} ${colour.en}`, `${colour.en} ${a} ${thing.en}`, `${a} ${thing.en} ${colour.en}`];
  const es = `${thing.g === 'f' ? 'una' : 'un'} ${thing.es} ${thing.g === 'f' ? colour.esF : colour.es}`;
  const parts = [{ text: a }, { text: colour.en, mark: 'verb' }, { text: thing.en, mark: 'subject' }];
  return {
    id: `orden:${colour.en}:${thing.en}`,
    form: 'orden',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, right, wrong, count),
    answer: right,
    audio: null,
    repeat: right,
    story: `${rng.pick(CONTEXTS)} ¿Cómo se dice “${es}”?`,
    expression: `“${es}” = □`,
    theme: null,
    illustration: cardsView([{ emoji: thing.emoji, swatch: colour.swatch }]),
    hint: 'En inglés, el color va delante de la cosa, al revés que en español.',
    hintFrames: [enFrame(`En español decimos “${thing.es} ${thing.g === 'f' ? colour.esF : colour.es}”, pero en inglés el color va primero.`, sentenceView([{ text: colour.en, mark: 'verb' }, { text: '+' }, { text: thing.en, mark: 'subject' }]))],
    steps: [
      `El color va delante: ${en(`${colour.en} ${thing.en}`)}.`,
      a === 'an' ? `Delante de un sonido de vocal se pone ${en('an')} en vez de ${en('a')}.` : `Delante se pone ${en('a')} (un, una).`,
      `Queda ${en(right)}.`,
    ],
    frames: [
      enFrame(`${en(colour.en)} es ${colour.es} y ${en(thing.en)} es ${thing.es}.`, cardsView([colour, thing])),
      enFrame(`En inglés el color va delante de la cosa: ${en(right)}.`, sentenceView(parts, es)),
      enFrame(`Repite conmigo: ${en(right)}.`, sentenceView(parts, es)),
    ],
  };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'orden') return buildOrder(rng, cfg.choices);
  const things = rng.next() < 0.5 && cfg.things > 0;
  const pool = things ? THINGS.slice(0, cfg.things) : COLOURS.slice(0, cfg.colours);
  const item = rng.pick(pool);
  return vocabExercise(rng, form, item, pool, { context: rng.next() < 0.4 ? rng.pick(CONTEXTS) : '', choices: cfg.choices });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Colours 🎨',
    paragraphs: ['Ojo: en inglés británico (el de tu libro) se escribe «colour», con u. Toca cada color y repítelo.'],
    words: COLOURS,
    frames: [
      enFrame(`${en('red')}, ${en('blue')}, ${en('yellow')}, ${en('green')}.`, cardsView(COLOURS.slice(0, 4))),
      enFrame(`${en('pink')}, ${en('black')}, ${en('white')}, ${en('orange')}.`, cardsView(COLOURS.slice(4, 8))),
      enFrame(`${en('purple')}, ${en('grey')} y ${en('brown')}.`, cardsView(COLOURS.slice(8))),
    ],
  },
  {
    title: 'In my schoolbag 🎒',
    paragraphs: ['Las cosas de clase que más vas a oír.'],
    words: THINGS,
    frames: [
      enFrame(`${en('pencil')}, ${en('pen')}, ${en('book')}, ${en('notebook')}.`, cardsView(THINGS.slice(0, 4))),
      enFrame(`${en('ruler')}, ${en('schoolbag')}, ${en('chair')}, ${en('computer')}, ${en('scissors')}.`, cardsView(THINGS.slice(4))),
    ],
  },
  {
    title: 'El color, delante 🔁',
    paragraphs: [`En español decimos “un lápiz rosa”, pero en inglés el color va primero: ${en('a pink pencil')}.`],
    words: [{ en: 'a pink pencil', es: 'un lápiz rosa' }, { en: 'a black schoolbag', es: 'una mochila negra' }, { en: 'an orange book', es: 'un libro naranja' }],
    frames: [
      enFrame(`Un lápiz rosa: ${en('a pink pencil')}.`, sentenceView([{ text: 'a' }, { text: 'pink', mark: 'verb' }, { text: 'pencil', mark: 'subject' }], 'un lápiz rosa')),
      enFrame(`Con vocal delante se usa ${en('an')}: ${en('an orange book')}.`, sentenceView([{ text: 'an' }, { text: 'orange', mark: 'verb' }, { text: 'book', mark: 'subject' }], 'un libro naranja')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK,
  title: 'Colours y cosas de clase',
  emoji: '🎨',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
