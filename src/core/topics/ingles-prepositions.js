// Tema de inglés: preposiciones de lugar (in, on, under, next to, between,
// behind, in front of, opposite).

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_PLACES, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-prepositions';

export const PREPOSITIONS = [
  { en: 'in', es: 'dentro de', emoji: '📦' }, { en: 'on', es: 'encima de (tocando)', emoji: '⬆️' },
  { en: 'under', es: 'debajo de', emoji: '⬇️' }, { en: 'next to', es: 'al lado de', emoji: '↔️' },
  { en: 'behind', es: 'detrás de', emoji: '🙈' }, { en: 'in front of', es: 'delante de', emoji: '👀' },
  { en: 'between', es: 'entre', emoji: '↕️' }, { en: 'opposite', es: 'enfrente de', emoji: '🔁' },
];

// Escenas: qué, dónde (preposición) y respecto a qué; con su traducción.
const SCENES = [
  { s: 'The cat', is: 'is', p: 'under', c: 'the table.', es: 'El gato está debajo de la mesa.' },
  { s: 'My phone', is: 'is', p: 'on', c: 'the bed.', es: 'Mi móvil está encima de la cama.' },
  { s: 'The milk', is: 'is', p: 'in', c: 'the fridge.', es: 'La leche está en la nevera.' },
  { s: 'The bank', is: 'is', p: 'next to', c: 'the supermarket.', es: 'El banco está al lado del súper.' },
  { s: 'The zombie', is: 'is', p: 'behind', c: 'the door!', es: '¡El zombi está detrás de la puerta!' },
  { s: 'The bus stop', is: 'is', p: 'in front of', c: 'the school.', es: 'La parada está delante del insti.' },
  { s: 'The café', is: 'is', p: 'between', c: 'the cinema and the bank.', es: 'La cafetería está entre el cine y el banco.' },
  { s: 'The park', is: 'is', p: 'opposite', c: 'the library.', es: 'El parque está enfrente de la biblioteca.' },
  { s: 'My shoes', is: 'are', p: 'under', c: 'the bed.', es: 'Mis zapatillas están debajo de la cama.' },
  { s: 'The books', is: 'are', p: 'on', c: 'the shelf.', es: 'Los libros están en la estantería.' },
  { s: 'My dog', is: 'is', p: 'in', c: 'the garden.', es: 'Mi perro está en el jardín.' },
  { s: 'Sara', is: 'is', p: 'between', c: 'Leo and me.', es: 'Sara está entre Leo y yo.' },
];

export const FORMS = {
  significado: 'Qué significa la preposición',
  completar: 'Completar la frase',
  escribir: 'Escribir la preposición',
};

const LEVELS = {
  1: { forms: [['significado', 4], ['completar', 3]] },
  2: { forms: [['completar', 4], ['significado', 1], ['escribir', 2]] },
  3: { forms: [['escribir', 4], ['completar', 3]] },
};

const RULE = `${en('in')} dentro, ${en('on')} encima, ${en('under')} debajo, ${en('next to')} al lado, ${en('behind')} detrás, ${en('in front of')} delante, ${en('between')} entre, ${en('opposite')} enfrente.`;
const RULE_LINES = ['in 📦 · on ⬆️ · under ⬇️ · next to ↔️', 'behind 🙈 · in front of 👀', 'between ↕️ · opposite 🔁'];

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'significado') {
    const p = rng.pick(PREPOSITIONS);
    return {
      id: `significado:${p.en}`,
      form,
      answerType: 'choice',
      choices: choicesFor(rng, p.es, PREPOSITIONS.map((x) => x.es), 3),
      answer: p.es,
      audio: p.en,
      repeat: p.en,
      story: `📍 ¿Qué significa ${en(p.en)}?`,
      expression: `${en(p.en)} = □`,
      theme: null,
      illustration: null,
      hint: RULE,
      hintFrames: [enFrame(RULE, { kind: 'calc', lines: RULE_LINES })],
      steps: [`${en(p.en)} significa “${p.es}”.`],
      frames: [
        enFrame(`${en(p.en)} significa ${p.es}.`, { kind: 'cards', items: [p], highlight: 0, hide: null }),
        enFrame(`Repite conmigo: ${en(p.en)}.`, { kind: 'cards', items: [p], highlight: 0, hide: 'es' }),
      ],
    };
  }
  const x = rng.pick(SCENES);
  const prep = PREPOSITIONS.find((p) => p.en === x.p);
  return gapExercise({
    id: `${form}:${x.s}:${x.p}`,
    form,
    before: `${x.s} ${x.is}`,
    after: x.c,
    answer: x.p,
    ...(form === 'escribir' ? { text: true } : { choices: choicesFor(rng, x.p, PREPOSITIONS.map((p) => p.en), level === 1 ? 3 : 4) }),
    es: x.es,
    story: `📍 ¿Dónde está? “${x.es}”`,
    illustration: { kind: 'cards', items: [prep], highlight: null, hide: 'en' },
    rule: RULE,
    ruleLines: RULE_LINES,
    why: `“${prep.es}” es ${en(x.p)}.`,
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Where is it? 📍',
    paragraphs: [RULE, `${en('The cat is under the table.')} = El gato está debajo de la mesa.`],
    words: PREPOSITIONS,
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en('The cat is under the table.')}`, sentenceView([{ text: 'The cat is' }, { text: 'under', mark: 'verb' }, { text: 'the table.', mark: 'subject' }], 'El gato está debajo de la mesa.')),
    ],
  },
  {
    title: 'Between y opposite 🏙️',
    paragraphs: [`${en('between')} es entre dos cosas: ${en('The café is between the cinema and the bank.')} ${en('opposite')} es enfrente, al otro lado de la calle: ${en('The park is opposite the library.')}`],
    words: [{ en: 'The café is between the cinema and the bank.', es: 'La cafetería está entre el cine y el banco.' }, { en: 'The park is opposite the library.', es: 'El parque está enfrente de la biblioteca.' }],
    frames: [
      enFrame(`${en('The café is between the cinema and the bank.')}`, sentenceView([{ text: 'The café is' }, { text: 'between', mark: 'verb' }, { text: 'the cinema and the bank.', mark: 'subject' }], 'La cafetería está entre el cine y el banco.')),
      enFrame(`${en('The park is opposite the library.')}`, sentenceView([{ text: 'The park is' }, { text: 'opposite', mark: 'verb' }, { text: 'the library.', mark: 'subject' }], 'El parque está enfrente de la biblioteca.')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_PLACES,
  title: 'In, on, under… dónde está',
  emoji: '📍',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
