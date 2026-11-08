// Tema de inglés: there is / there are (hay), en afirmativa, negativa y
// pregunta, con some y any.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_PLACES, LEVEL_NAMES, SUBJECT, en, gapExercise, generator, listenExercise, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-there-is';

// one: singular con a/an; many: plural; place: dónde.
const THINGS = [
  { one: 'a cinema', many: 'two cinemas', some: 'some cafés', any: 'any cafés', es1: 'un cine', es2: 'dos cines', esSome: 'algunas cafeterías', place: 'in my town', esPlace: 'en mi ciudad' },
  { one: 'a sofa', many: 'three chairs', some: 'some books', any: 'any books', es1: 'un sofá', es2: 'tres sillas', esSome: 'algunos libros', place: 'in the living room', esPlace: 'en el salón' },
  { one: 'a big park', many: 'four supermarkets', some: 'some shops', any: 'any shops', es1: 'un parque grande', es2: 'cuatro supermercados', esSome: 'algunas tiendas', place: 'near my school', esPlace: 'cerca de mi insti' },
  { one: 'a cat', many: 'two dogs', some: 'some posters', any: 'any posters', es1: 'un gato', es2: 'dos perros', esSome: 'algunos pósteres', place: 'in my bedroom', esPlace: 'en mi habitación' },
  { one: 'a zombie', many: 'ten zombies', some: 'some ghosts', any: 'any ghosts', es1: 'un zombi', es2: 'diez zombis', esSome: 'algunos fantasmas', place: 'in the house', esPlace: 'en la casa' },
  { one: 'an apple', many: 'six eggs', some: 'some milk', any: 'any milk', es1: 'una manzana', es2: 'seis huevos', esSome: 'algo de leche', place: 'in the fridge', esPlace: 'en la nevera' },
];

export const FORMS = {
  'is-are': 'There is o there are',
  'some-any': 'Some o any',
  pregunta: 'Is there…? Are there…?',
  negativa: "There isn't / there aren't",
  escuchar: 'Escuchar la frase y entenderla',
};

const LEVELS = {
  1: { forms: [['is-are', 5], ['escuchar', 2]] },
  2: { forms: [['is-are', 2], ['some-any', 3], ['negativa', 2], ['escuchar', 2]] },
  3: { forms: [['some-any', 3], ['pregunta', 3], ['negativa', 2]] },
};

const RULE = `${en('There is')} (hay) con una cosa: ${en('There is a park.')} ${en('There are')} con varias: ${en('There are two parks.')}`;
const RULE_LINES = ['1 → There is a park.', '+ → There are two parks.'];
const SOME_RULE = `${en('some')} en frases afirmativas; ${en('any')} en negativas y preguntas.`;
const SOME_LINES = ['✔ There are some books.', "✘ There aren't any books.", '? Are there any books?'];

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  const x = rng.pick(THINGS);
  const plural = rng.next() < 0.5;
  if (form === 'escuchar') {
    const sentence = plural ? `There are ${x.many} ${x.place}.` : `There is ${x.one} ${x.place}.`;
    const es = `Hay ${plural ? x.es2 : x.es1} ${x.esPlace}.`;
    const pool = THINGS.filter((y) => y !== x).map((y) => `Hay ${plural ? y.es2 : y.es1} ${y.esPlace}.`);
    return listenExercise(rng, { id: `escuchar:${x.place}:${plural}`, sentence, es, pool });
  }
  if (form === 'is-are') {
    const answer = plural ? 'There are' : 'There is';
    return gapExercise({
      id: `is-are:${x.place}:${plural}`, form, before: '', after: `${plural ? x.many : x.one} ${x.place}.`, answer,
      choices: ['There is', 'There are'], es: `Hay ${plural ? x.es2 : x.es1} ${x.esPlace}.`,
      story: `Completa: “Hay ${plural ? x.es2 : x.es1} ${x.esPlace}.”`, rule: RULE, ruleLines: RULE_LINES,
      why: plural ? `Son varias cosas (${en(x.many)}): ${en('There are')}.` : `Es una sola cosa (${en(x.one)}): ${en('There is')}.`,
    });
  }
  if (form === 'some-any') {
    const kind = rng.pick(['positive', 'negative', 'question']);
    const noun = x.some.replace(/^some /, '');
    const verb = noun === 'milk' ? 'is' : 'are';
    const answer = kind === 'positive' ? 'some' : 'any';
    const before = kind === 'positive' ? `There ${verb}` : kind === 'negative' ? `There ${verb}n't` : `${verb === 'is' ? 'Is' : 'Are'} there`;
    const after = `${noun} ${x.place}${kind === 'question' ? '?' : '.'}`;
    const es = kind === 'positive' ? `Hay ${x.esSome} ${x.esPlace}.` : kind === 'negative' ? `No hay ${noun === 'milk' ? 'leche' : x.esSome.replace(/^alg\w+ /, '')} ${x.esPlace}.` : `¿Hay ${noun === 'milk' ? 'leche' : x.esSome.replace(/^alg\w+ /, '')} ${x.esPlace}?`;
    return gapExercise({
      id: `some-any:${x.place}:${kind}`, form, before, after, answer, choices: ['some', 'any'], es,
      story: `Completa con some o any: “${es}”`, rule: SOME_RULE, ruleLines: SOME_LINES,
      why: kind === 'positive' ? `La frase es afirmativa: ${en('some')}.` : `La frase es ${kind === 'negative' ? 'negativa' : 'una pregunta'}: ${en('any')}.`,
    });
  }
  if (form === 'pregunta') {
    const answer = plural ? 'Are there' : 'Is there';
    const thing = plural ? x.many.replace(/^\w+ /, 'any ') : x.one;
    return gapExercise({
      id: `pregunta:${x.place}:${plural}`, form, before: '', after: `${thing} ${x.place}?`, answer,
      choices: ['Is there', 'Are there'], es: `¿Hay ${plural ? x.es2.replace(/^\w+ /, '') : x.es1} ${x.esPlace}?`,
      story: `Haz la pregunta: “¿Hay ${plural ? x.es2.replace(/^\w+ /, '') : x.es1} ${x.esPlace}?”`,
      rule: `Para preguntar se da la vuelta: ${en('Is there a park?')} ${en('Are there any parks?')}`, ruleLines: ['Is there a park?', 'Are there any parks?'],
      why: plural ? `Son varias: ${en('Are there')}.` : `Es una: ${en('Is there')}.`,
    });
  }
  const answer = plural ? "There aren't" : "There isn't";
  const thing = plural ? x.many.replace(/^\w+ /, 'any ') : x.one;
  return gapExercise({
    id: `negativa:${x.place}:${plural}`, form: 'negativa', before: '', after: `${thing} ${x.place}.`, answer,
    choices: ["There isn't", "There aren't"], es: `No hay ${plural ? x.es2.replace(/^\w+ /, '') : x.es1} ${x.esPlace}.`,
    story: `Ponlo en negativo: “No hay ${plural ? x.es2.replace(/^\w+ /, '') : x.es1} ${x.esPlace}.”`,
    rule: `Negativa: ${en("There isn't")} (una) y ${en("There aren't any")} (varias).`, ruleLines: ["There isn't a park.", "There aren't any parks."],
    why: plural ? `Son varias: ${en("There aren't")}, con ${en('any')}.` : `Es una: ${en("There isn't")}.`,
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'There is, there are 🏙️',
    paragraphs: [RULE, `Preguntas: ${en('Is there a cinema?')} ${en('Are there any cafés?')} Negativas: ${en("There isn't a cinema.")} ${en("There aren't any cafés.")}`],
    words: [{ en: 'There is a park.', es: 'Hay un parque.' }, { en: 'There are two cinemas.', es: 'Hay dos cines.' }, { en: 'Is there a library?', es: '¿Hay una biblioteca?' }, { en: "There aren't any shops.", es: 'No hay tiendas.' }],
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en('There are two dogs in my bedroom.')}`, sentenceView([{ text: 'There are', mark: 'verb' }, { text: 'two dogs', mark: 'subject' }, { text: 'in my bedroom.' }], 'Hay dos perros en mi habitación.')),
    ],
  },
  {
    title: 'Some y any 🍎',
    paragraphs: [SOME_RULE, `${en('There are some books.')} ${en("There aren't any books.")} ${en('Are there any books?')}`],
    words: [{ en: 'some', es: 'algunos (afirmativa)' }, { en: 'any', es: 'ningún / algún (negativa y pregunta)' }],
    frames: [enFrame(SOME_RULE, { kind: 'calc', lines: SOME_LINES })],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_PLACES,
  title: 'There is / there are',
  emoji: '🏙️',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
