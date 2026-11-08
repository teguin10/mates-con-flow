// Tema de inglés: presente simple o presente continuo, según la pista de
// tiempo (every day, usually… o now, at the moment, look!).

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_NOW, LEVEL_NAMES, SUBJECT, en, gapExercise, generator, pickForm, sentenceView } from './ingles-comun.js';

const TOPIC_ID = 'ingles-simple-continuous';

// simple / cont: las dos formas del verbo para ese sujeto.
const CASES = [
  { s: 'She', simple: 'plays', cont: 'is playing', c: 'volleyball', es: 'jugar al vóley' },
  { s: 'I', simple: 'watch', cont: 'am watching', c: 'TV', es: 'ver la tele' },
  { s: 'We', simple: 'eat', cont: 'are eating', c: 'pancakes', es: 'comer tortitas' },
  { s: 'My brother', simple: 'reads', cont: 'is reading', c: 'comics', es: 'leer cómics' },
  { s: 'They', simple: 'listen', cont: 'are listening', c: 'to trap music', es: 'escuchar trap' },
  { s: 'My dog', simple: 'sleeps', cont: 'is sleeping', c: 'on the sofa', es: 'dormir en el sofá' },
  { s: 'You', simple: 'wear', cont: 'are wearing', c: 'a hoodie', es: 'llevar sudadera' },
];
const HABIT = ['every day', 'on Saturdays', 'every weekend', 'after school'];
const HABIT_PRE = ['usually', 'always', 'often', 'never'];
const NOW = ['now', 'at the moment', 'right now'];

export const FORMS = {
  elegir: 'Simple o continuo',
  pista: '¿Qué pista de tiempo es?',
};

const LEVELS = {
  1: { forms: [['elegir', 3], ['pista', 3]] },
  2: { forms: [['elegir', 5], ['pista', 1]] },
  3: { forms: [['elegir', 4], ['pista', 1]] },
};

const RULE = `Presente simple para lo habitual (${en('every day')}, ${en('usually')}, ${en('always')}). Presente continuo para lo que pasa ahora (${en('now')}, ${en('at the moment')}, ${en('Look!')}).`;
const RULE_LINES = ['🔁 She plays volleyball every day.', '📸 She is playing volleyball now.'];

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'pista') {
    const habit = rng.next() < 0.5;
    const clue = habit ? rng.pick([...HABIT, ...HABIT_PRE]) : rng.pick([...NOW, 'Look!', 'Listen!']);
    return {
      id: `pista:${clue}`,
      form: 'pista',
      answerType: 'choice',
      choices: ['Presente simple', 'Presente continuo'],
      answer: habit ? 'Presente simple' : 'Presente continuo',
      audio: clue,
      repeat: clue,
      story: `⏱️ Si en la frase aparece ${en(clue)}, ¿qué tiempo verbal va?`,
      expression: `${en(clue)} → □`,
      theme: null,
      illustration: null,
      hint: RULE,
      hintFrames: [enFrame(RULE, { kind: 'calc', lines: RULE_LINES })],
      steps: [`${en(clue)} ${habit ? 'habla de algo habitual' : 'habla de ahora mismo'}: presente ${habit ? 'simple' : 'continuo'}.`],
      frames: [enFrame(RULE, { kind: 'calc', lines: RULE_LINES }), enFrame(`${en(clue)}: presente ${habit ? 'simple' : 'continuo'}.`, sentenceView([{ text: clue, mark: 'verb' }]))],
    };
  }
  const x = rng.pick(CASES);
  const now = rng.next() < 0.5;
  const pre = !now && rng.next() < 0.4;
  const adv = pre ? rng.pick(HABIT_PRE) : null;
  const clue = now ? rng.pick(NOW) : pre ? adv : rng.pick(HABIT);
  const answer = now ? x.cont : x.simple;
  const before = pre ? `${x.s} ${adv}` : x.s;
  const after = now ? `${x.c} ${clue}.` : pre ? `${x.c}.` : `${x.c} ${clue}.`;
  return gapExercise({
    id: `elegir:${x.s}:${clue}`,
    form: 'elegir',
    before,
    after,
    answer,
    choices: [x.simple, x.cont],
    es: null,
    story: `🤔 ¿Simple o continuo? La pista es ${en(clue)}.`,
    rule: RULE,
    ruleLines: RULE_LINES,
    why: now ? `${en(clue)} es ahora mismo: presente continuo, ${en(x.cont)}.` : `${en(clue)} es algo habitual: presente simple, ${en(x.simple)}.`,
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: '¿Siempre o ahora? 🔁📸',
    paragraphs: [RULE, `${en('I usually wear jeans, but today I am wearing a dress.')}`],
    words: [{ en: 'every day', es: 'cada día (simple)' }, { en: 'usually', es: 'normalmente (simple)' }, { en: 'now', es: 'ahora (continuo)' }, { en: 'at the moment', es: 'en este momento (continuo)' }],
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en('I usually wear jeans, but today I am wearing a dress.')}`, sentenceView([{ text: 'I usually' }, { text: 'wear', mark: 'verb' }, { text: 'jeans, but today I' }, { text: 'am wearing', mark: 'verb' }, { text: 'a dress.' }], 'Normalmente llevo vaqueros, pero hoy llevo vestido.')),
    ],
  },
  {
    title: 'Look! Listen! 👀',
    paragraphs: [`${en('Look!')} y ${en('Listen!')} avisan de que algo pasa ahora: ${en('Look! It is snowing!')} ${en('Listen! The baby is crying.')}`],
    words: [{ en: 'Look! It is snowing!', es: '¡Mira! ¡Está nevando!' }, { en: 'Listen! Someone is singing.', es: '¡Escucha! Alguien está cantando.' }],
    frames: [enFrame(`${en('Look! It is snowing!')}`, sentenceView([{ text: 'Look!', mark: 'subject' }, { text: 'It' }, { text: 'is snowing!', mark: 'verb' }], '¡Mira! ¡Está nevando!'))],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_NOW,
  title: 'Simple o continuo',
  emoji: '🔀',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
