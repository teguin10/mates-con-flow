// Tema de inglés: saludar, despedirse y presentarse (nivel cero).

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK, LEVEL_NAMES, SUBJECT, VOCAB_FORMS, cardsView, choicesFor, en, generator, pickForm, sentenceView, vocabExercise,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-hello';

// Hi y Bye son sinónimos de Hello y Goodbye: solo salen en la explicación,
// para que no haya dos opciones correctas en un ejercicio.
const HI = { en: 'Hi', es: 'hola (más informal)', emoji: '🙌' };
const BYE = { en: 'Bye', es: 'chao', emoji: '✌️' };

export const WORDS = [
  { en: 'Hello', es: 'hola', emoji: '👋' },
  { en: 'Goodbye', es: 'adiós', emoji: '🚪', accept: ['good bye'] },
  { en: 'Good morning', es: 'buenos días', emoji: '🌅', note: 'Se dice por la mañana, hasta la hora de comer.' },
  { en: 'Good afternoon', es: 'buenas tardes', emoji: '☀️', note: 'Se dice por la tarde, después de comer.' },
  { en: 'Good night', es: 'buenas noches (al irse a dormir)', emoji: '🌙', note: 'Solo para despedirse por la noche o al irse a dormir.' },
  { en: 'Thank you', es: 'gracias', emoji: '🙏', accept: ['thanks'] },
  { en: 'Please', es: 'por favor', emoji: '🥺' },
  { en: 'Sorry', es: 'perdón', emoji: '😅' },
  { en: 'Yes', es: 'sí', emoji: '👍' },
  { en: 'No', es: 'no', emoji: '👎' },
  { en: 'See you', es: 'nos vemos', emoji: '👀' },
  { en: 'Friend', es: 'amigo o amiga', emoji: '🫶' },
];

// Para escribir: las palabras cortas y útiles.
const WRITE_WORDS = ['Hello', 'Goodbye', 'Thank you', 'Please', 'Sorry', 'Friend', 'Good morning', 'Good night'];

export const DIALOGS = [
  { q: "What's your name?", es: '¿Cómo te llamas?', a: 'My name is Luna.', aes: 'Me llamo Luna.' },
  { q: 'How are you?', es: '¿Qué tal estás?', a: "I'm fine, thank you.", aes: 'Bien, gracias.' },
  { q: 'How old are you?', es: '¿Cuántos años tienes?', a: "I'm thirteen.", aes: 'Tengo trece años.' },
  { q: 'Where are you from?', es: '¿De dónde eres?', a: "I'm from Spain.", aes: 'Soy de España.' },
  { q: 'Nice to meet you!', es: '¡Encantada de conocerte!', a: 'Nice to meet you too!', aes: '¡Encantada también!' },
  { q: 'Thank you!', es: '¡Gracias!', a: "You're welcome!", aes: '¡De nada!' },
  { q: 'Goodbye!', es: '¡Adiós!', a: 'Bye! See you!', aes: '¡Chao! ¡Nos vemos!' },
];

export const FORMS = { ...VOCAB_FORMS, responder: 'Contestar en una conversación' };

const LEVELS = {
  1: { choices: 3, words: 6, forms: [['significado', 4], ['traducir', 3], ['escuchar', 3]] },
  2: { choices: 3, words: 12, forms: [['significado', 2], ['traducir', 2], ['escuchar', 2], ['responder', 4], ['escribir', 2]] },
  3: { choices: 4, words: 12, forms: [['responder', 3], ['escuchar', 2], ['escribir', 3], ['dictado', 2], ['traducir', 1]] },
};

const CONTEXTS = [
  '📱 Una chica de Londres te escribe en el chat de Roblox.',
  '🏐 Llega una jugadora nueva de Inglaterra a tu equipo de vóley.',
  '🎬 Estás viendo una serie en inglés con subtítulos.',
  '🏫 Hay una alumna de intercambio en tu clase.',
];

function buildDialog(rng, count) {
  const d = rng.pick(DIALOGS);
  const context = rng.pick(CONTEXTS);
  return {
    id: `responder:${d.q}`,
    form: 'responder',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, d.a, DIALOGS.map((x) => x.a), count),
    answer: d.a,
    audio: d.q,
    repeat: d.a,
    story: `${context} Te dice ${en(d.q)} (“${d.es}”). ¿Qué le contestas?`,
    expression: `${en(d.q)} → □`,
    theme: null,
    illustration: null,
    hint: `${en(d.q)} quiere decir “${d.es}”. Busca la respuesta que encaja.`,
    hintFrames: [enFrame(`${en(d.q)} quiere decir “${d.es}”.`, sentenceView([{ text: d.q, mark: 'verb' }], d.es))],
    steps: [`${en(d.q)} = “${d.es}”.`, `Se contesta: ${en(d.a)} (“${d.aes}”).`],
    frames: [
      enFrame(`Te preguntan ${en(d.q)}: “${d.es}”.`, sentenceView([{ text: d.q, mark: 'verb' }], d.es)),
      enFrame(`Se contesta así: ${en(d.a)}.`, sentenceView([{ text: d.a, mark: 'subject' }], d.aes)),
      enFrame(`Repite conmigo en voz alta: ${en(d.a)}.`, sentenceView([{ text: d.a, mark: 'subject' }])),
    ],
  };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'responder') return buildDialog(rng, cfg.choices);
  const pool = WORDS.slice(0, cfg.words);
  const written = form === 'escribir' || form === 'dictado';
  const candidates = written ? pool.filter((w) => WRITE_WORDS.includes(w.en)) : pool;
  const item = rng.pick(candidates);
  return vocabExercise(rng, form, item, pool, { context: rng.next() < 0.4 ? rng.pick(CONTEXTS) : '', choices: cfg.choices });
}

export const generate = generator(build);

const INTRO = [
  {
    title: '¡Hello! 👋',
    paragraphs: [
      'Empezamos por lo más útil: saludar y despedirse.',
      'Toca cada palabra para oírla y repítela en voz alta. Nadie te oye, así que ¡sin vergüenza! 🗣️',
    ],
    words: [WORDS[0], HI, WORDS[1], BYE, WORDS[2], WORDS[3], WORDS[4]],
    frames: [
      enFrame(`Para saludar: ${en('Hello')} o ${en('Hi')}.`, cardsView([WORDS[0], HI])),
      enFrame(`Para despedirse: ${en('Goodbye')} o ${en('Bye')}.`, cardsView([WORDS[1], BYE])),
      enFrame(`Por la mañana, ${en('Good morning')}; por la tarde, ${en('Good afternoon')}.`, cardsView([WORDS[2], WORDS[3]])),
      enFrame(`${en('Good night')} es solo para irse a dormir.`, cardsView([WORDS[4]])),
    ],
  },
  {
    title: 'Palabras mágicas ✨',
    paragraphs: ['Con estas quedas genial en cualquier sitio.'],
    words: WORDS.slice(5),
    frames: [
      enFrame(`${en('Please')} es por favor y ${en('Thank you')} es gracias.`, cardsView([WORDS[6], WORDS[5]])),
      enFrame(`${en('Sorry')} es perdón. ${en('See you')} es nos vemos.`, cardsView([WORDS[7], WORDS[10]])),
    ],
  },
  {
    title: 'Preséntate 🙋‍♀️',
    paragraphs: [
      'Las preguntas de siempre cuando conoces a alguien. Escucha la pregunta y su respuesta.',
    ],
    words: DIALOGS.slice(0, 4).flatMap((d) => [{ en: d.q, es: d.es }, { en: d.a, es: d.aes }]),
    frames: [
      enFrame(`${en("What's your name?")} → ${en('My name is Luna.')}`, sentenceView([{ text: "What's your name?", mark: 'verb' }, { text: '→' }, { text: 'My name is Luna.', mark: 'subject' }], '¿Cómo te llamas? → Me llamo Luna.')),
      enFrame(`${en('How are you?')} → ${en("I'm fine, thank you.")}`, sentenceView([{ text: 'How are you?', mark: 'verb' }, { text: '→' }, { text: "I'm fine, thank you.", mark: 'subject' }], '¿Qué tal? → Bien, gracias.')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK,
  title: 'Hello! Saludar y presentarse',
  emoji: '👋',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
