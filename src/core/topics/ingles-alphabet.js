// Tema de inglés: el alfabeto y deletrear (Starter 2). Las letras se dicen
// distinto que en español: la guía «cómo suena» ayuda sin voz, y con voz se
// escuchan letras y palabras deletreadas.

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_STARTER2, LEVEL_NAMES, SUBJECT, choicesFor, en, generator, pickForm, sentenceView, shuffle } from './ingles-comun.js';

const TOPIC_ID = 'ingles-alphabet';

// Cómo suena cada letra en inglés británico, escrito a la española.
export const LETTERS = {
  A: 'ei', B: 'bi', C: 'si', D: 'di', E: 'i', F: 'ef', G: 'yi', H: 'eich', I: 'ai', J: 'yei', K: 'kei', L: 'el', M: 'em',
  N: 'en', O: 'ou', P: 'pi', Q: 'kiu', R: 'ar', S: 'es', T: 'ti', U: 'iu', V: 'vi', W: 'dabliu', X: 'eks', Y: 'uai', Z: 'zed',
};

// Las que más se confunden quien habla español.
const TRAPS = [['A', 'E', 'I'], ['E', 'I', 'Y'], ['G', 'J', 'Y'], ['I', 'E', 'A'], ['J', 'G', 'H'], ['U', 'W', 'Q'], ['K', 'Q', 'C'], ['R', 'A', 'H'], ['V', 'B', 'W'], ['Y', 'I', 'U']];

const WORDS = ['cat', 'dog', 'pink', 'happy', 'friend', 'yellow', 'Luna', 'Jack', 'pizza', 'volley', 'June', 'quiz', 'jeans', 'giraffe', 'wow'];

export const FORMS = {
  sonido: 'Qué letra suena así (guía de sonidos)',
  escuchar: 'Escuchar una letra',
  dictado: 'Escuchar una palabra deletreada y escribirla',
  deletrear: 'Cómo se deletrea (elegir)',
};

const LEVELS = {
  1: { forms: [['sonido', 4], ['escuchar', 4]] },
  2: { forms: [['sonido', 2], ['escuchar', 3], ['deletrear', 3], ['dictado', 2]] },
  3: { forms: [['dictado', 4], ['deletrear', 3], ['escuchar', 2]] },
};

const spelled = (word) => [...word.toUpperCase()].join('-');
const spokenLetters = (word) => `${[...word.toUpperCase()].join(', ')}.`;
const sounds = (word) => [...word.toUpperCase()].map((l) => LETTERS[l]).join(' - ');

function trapChoices(rng, letter) {
  const group = TRAPS.find((g) => g[0] === letter) ?? [letter, ...shuffle(rng, Object.keys(LETTERS).filter((l) => l !== letter)).slice(0, 2)];
  return shuffle(rng, group);
}

function letterFrames(letter) {
  return [
    enFrame(`La letra ${letter} en inglés suena “${LETTERS[letter]}”: ${en(letter)}.`, { kind: 'spell', word: letter }),
    enFrame(`Repite conmigo: ${en(letter)}.`, { kind: 'spell', word: letter }),
  ];
}

function buildLetter(rng, form) {
  const letter = rng.pick(form === 'sonido' ? Object.keys(LETTERS) : TRAPS.map((g) => g[0]));
  return {
    id: `${form}:${letter}`,
    form,
    answerType: 'choice',
    choicesLang: 'en',
    choices: form === 'sonido' ? choicesFor(rng, letter, Object.keys(LETTERS), 3) : trapChoices(rng, letter),
    answer: letter,
    ...(form === 'escuchar' ? { listen: letter } : {}),
    repeat: letter,
    story: form === 'sonido' ? `🔤 ¿Qué letra se dice “${LETTERS[letter]}” en inglés?` : '🔤 Escucha 🔊 la letra. ¿Cuál es?',
    expression: form === 'sonido' ? `“${LETTERS[letter]}” = □` : '🔊 = □',
    theme: null,
    illustration: null,
    hint: 'Cuidado con las trampas: la E suena “i”, la I suena “ai”, la A suena “ei”, la G suena “yi” y la J suena “yei”.',
    hintFrames: [enFrame('A, E, I: “ei”, “i”, “ai”. G y J: “yi” y “yei”.', { kind: 'calc', lines: ['A = ei · E = i · I = ai', 'G = yi · J = yei · Y = uai'] })],
    steps: [`${letter} suena “${LETTERS[letter]}”.`, 'Escúchala con 🔊 y repítela.'],
    frames: letterFrames(letter),
  };
}

function buildWord(rng, form) {
  const word = rng.pick(WORDS);
  const wrong = [word.slice(0, -1), `${word}${word.at(-1)}`, [...word].reverse().join(''), word.replace(/[aeiou]/i, (v) => ({ a: 'e', e: 'i', i: 'e', o: 'u', u: 'o' })[v.toLowerCase()] ?? v)]
    .filter((w) => w.toLowerCase() !== word.toLowerCase());
  const frames = [
    enFrame(`${en(word)} se deletrea así: ${en(spokenLetters(word))}`, { kind: 'spell', word }),
    enFrame(`Suena: ${sounds(word)}.`, { kind: 'spell', word }),
  ];
  if (form === 'dictado') {
    return {
      id: `dictado:${word}`,
      form,
      answerType: 'text',
      answer: word,
      accept: [],
      listen: spokenLetters(word),
      repeat: word,
      story: '📞 Te deletrean una palabra por teléfono. Escucha 🔊 las letras y escribe la palabra.',
      expression: '🔊 = □',
      theme: null,
      illustration: null,
      hint: `Escucha letra a letra (despacio con 🐢). Tiene ${word.length} letras.`,
      hintFrames: [enFrame(`Tiene ${word.length} letras. La primera es ${en(word[0].toUpperCase())}.`, { kind: 'spell', word, only: 1 })],
      steps: [`Las letras son ${spelled(word)}.`, `La palabra es ${en(word)}.`],
      frames,
    };
  }
  return {
    id: `deletrear:${word}`,
    form,
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, spelled(word), wrong.map(spelled), 3),
    answer: spelled(word),
    audio: word,
    repeat: spokenLetters(word),
    story: `🙋 Te preguntan ${en(`How do you spell “${word}”?`)} ¿Qué contestas?`,
    expression: `${en(word)} = □`,
    theme: null,
    illustration: null,
    hint: 'Mira la palabra escrita letra por letra: ni una de más ni una de menos.',
    hintFrames: [enFrame(`${en('How do you spell…?')} significa “¿cómo se deletrea…?”.`, sentenceView([{ text: 'How do you spell', mark: 'verb' }, { text: `“${word}”?` }], '¿Cómo se deletrea?'))],
    steps: [`${en(word)} se deletrea ${spelled(word)}.`],
    frames,
  };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  return form === 'sonido' || form === 'escuchar' ? buildLetter(rng, form) : buildWord(rng, form);
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'The alphabet 🔤',
    paragraphs: [
      'Las letras en inglés se dicen distinto. Toca cada una, escúchala y repítela.',
      'Las trampas: la A suena “ei”, la E “i”, la I “ai”, la G “yi”, la J “yei” y la Y “uai”.',
    ],
    words: Object.entries(LETTERS).map(([letter, sound]) => ({ en: letter, es: sound })),
    frames: [
      enFrame(`${en('A')}, ${en('E')}, ${en('I')}: “ei”, “i”, “ai”.`, { kind: 'spell', word: 'AEI' }),
      enFrame(`${en('G')} y ${en('J')}: “yi” y “yei”.`, { kind: 'spell', word: 'GJ' }),
    ],
  },
  {
    title: 'How do you spell it? 🙋',
    paragraphs: [`Para preguntar cómo se escribe algo: ${en('How do you spell your name?')} Y se contesta letra a letra: ${en('L-U-N-A')}.`],
    words: [{ en: 'How do you spell your name?', es: '¿Cómo se escribe tu nombre?' }, { en: 'L, U, N, A.', es: 'L-U-N-A' }],
    frames: [
      enFrame(`${en('How do you spell your name?')}`, sentenceView([{ text: 'How do you spell', mark: 'verb' }, { text: 'your name?' }], '¿Cómo se escribe tu nombre?')),
      enFrame(`${en('L, U, N, A.')}`, { kind: 'spell', word: 'Luna' }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_STARTER2,
  title: 'Alphabet: deletrear',
  emoji: '🔤',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
