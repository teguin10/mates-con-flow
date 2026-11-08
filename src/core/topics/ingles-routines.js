// Tema de inglés: la rutina diaria y las asignaturas (Mi día a día).

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_DAILY, LEVEL_NAMES, SUBJECT, VOCAB_FORMS, cardsView, en, generator, pickForm, vocabExercise } from './ingles-comun.js';

const TOPIC_ID = 'ingles-routines';

export const ROUTINES = [
  { en: 'get up', es: 'levantarse', emoji: '⏰' }, { en: 'have a shower', es: 'ducharse', emoji: '🚿' },
  { en: 'have breakfast', es: 'desayunar', emoji: '🥣' }, { en: 'brush my teeth', es: 'lavarme los dientes', emoji: '🪥' },
  { en: 'go to school', es: 'ir al instituto', emoji: '🏫' }, { en: 'have lunch', es: 'comer', emoji: '🍝' },
  { en: 'do my homework', es: 'hacer los deberes', emoji: '📝' }, { en: 'watch TV', es: 'ver la tele', emoji: '📺' },
  { en: 'have dinner', es: 'cenar', emoji: '🍽️' }, { en: 'go to bed', es: 'irse a la cama', emoji: '🛏️' },
  { en: 'play volleyball', es: 'jugar al vóley', emoji: '🏐' }, { en: 'listen to music', es: 'escuchar música', emoji: '🎧' },
];
export const SUBJECTS = [
  { en: 'Maths', es: 'Matemáticas', emoji: '➗', accept: ['math'] }, { en: 'English', es: 'Inglés', emoji: '💬' },
  { en: 'Spanish', es: 'Lengua', emoji: '📖' }, { en: 'Science', es: 'Ciencias', emoji: '🔬' },
  { en: 'History', es: 'Historia', emoji: '🏛️' }, { en: 'Geography', es: 'Geografía', emoji: '🗺️' },
  { en: 'PE', es: 'Educación Física', emoji: '🤸‍♀️', accept: ['physical education'] }, { en: 'Art', es: 'Plástica', emoji: '🎨' },
  { en: 'Music', es: 'Música', emoji: '🎵' }, { en: 'Technology', es: 'Tecnología', emoji: '💻' },
];

export const FORMS = VOCAB_FORMS;

const LEVELS = {
  1: { choices: 3, forms: [['significado', 4], ['traducir', 3], ['escuchar', 3]] },
  2: { choices: 3, forms: [['traducir', 3], ['escuchar', 2], ['escribir', 3], ['significado', 1]] },
  3: { choices: 4, forms: [['escribir', 4], ['dictado', 3], ['traducir', 1]] },
};

const CONTEXTS = ['📱 Una amiga de Londres te cuenta su día:', '📒 En tu agenda en inglés pone:', '🎬 En una serie británica dicen:'];

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  const pool = rng.next() < 0.6 ? ROUTINES : SUBJECTS;
  return vocabExercise(rng, form, rng.pick(pool), pool, { context: rng.next() < 0.3 ? rng.pick(CONTEXTS) : '', choices: cfg.choices });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'My day ⏰',
    paragraphs: [`Lo que haces cada día. Muchas acciones usan ${en('have')}: ${en('have breakfast')} (desayunar), ${en('have a shower')} (ducharse), ${en('have lunch')} (comer).`],
    words: ROUTINES,
    frames: [
      enFrame(`${en('get up')}, ${en('have a shower')}, ${en('have breakfast')}.`, cardsView(ROUTINES.slice(0, 3))),
      enFrame(`${en('go to school')}, ${en('have lunch')}, ${en('do my homework')}.`, cardsView(ROUTINES.slice(4, 7))),
      enFrame(`${en('have dinner')} y ${en('go to bed')}.`, cardsView(ROUTINES.slice(8, 10))),
    ],
  },
  {
    title: 'School subjects 🏫',
    paragraphs: ['Las asignaturas. En inglés van con mayúscula: Maths, English, Science…'],
    words: SUBJECTS,
    frames: [
      enFrame(`${en('Maths')}, ${en('English')}, ${en('Science')}, ${en('History')}.`, cardsView([SUBJECTS[0], SUBJECTS[1], SUBJECTS[3], SUBJECTS[4]])),
      enFrame(`${en('PE')} es Educación Física, ${en('Art')} es Plástica.`, cardsView([SUBJECTS[6], SUBJECTS[7]])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_DAILY,
  title: 'My day: rutinas y asignaturas',
  emoji: '⏰',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
