// Tema de inglés: can / can't (saber, poder), preguntas y respuestas cortas.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_FOOD, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, listenExercise, pickForm, sentenceView,
} from './ingles-comun.js';
import { ACTIVITIES } from './ingles-abilities.js';

const TOPIC_ID = 'ingles-can';

const PEOPLE = [
  { s: 'I', es: 'Yo', p: 'I' }, { s: 'My sister', es: 'Mi hermana', p: 'she' }, { s: 'Leo', es: 'Leo', p: 'he', name: true },
  { s: 'We', es: 'Nosotras', p: 'we' }, { s: 'My cat', es: 'Mi gato', p: 'it' }, { s: 'They', es: 'Ellos', p: 'they' },
];

export const FORMS = {
  completar: "Can o can't",
  pregunta: 'Preguntas (Can you…?)',
  respuesta: 'Respuestas cortas (Yes, I can.)',
  escribir: "Escribir can o can't",
  escuchar: 'Escuchar la frase y entenderla',
};

const LEVELS = {
  1: { forms: [['completar', 5], ['escuchar', 2]] },
  2: { forms: [['completar', 2], ['pregunta', 3], ['respuesta', 3], ['escuchar', 1]] },
  3: { forms: [['escribir', 3], ['respuesta', 3], ['pregunta', 2]] },
};

const RULE = `${en('can')} es saber o poder, y es igual para todos (${en('I can')}, ${en('she can')}: ¡sin -s!). Negativa: ${en("can't")}. El verbo de detrás va sin ${en('to')}: ${en('I can swim')}.`;
const RULE_LINES = ['✔ I can swim. · She can swim.', "✘ He can't swim.", '? Can you swim?'];
// «saber» conjugado para cada pronombre, en afirmativa o negativa.
const SABER = { I: 'sé', you: 'sabes', we: 'sabemos', they: 'saben' };
const saber = (p, yes) => `${yes ? '' : 'no '}${SABER[p] ?? 'sabe'}`;
const cap = (t) => t[0].toUpperCase() + t.slice(1);
const lower = (x) => (x.s === 'I' || x.name ? x.s : x.s[0].toLowerCase() + x.s.slice(1));

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  const who = rng.pick(PEOPLE);
  const act = rng.pick(ACTIVITIES);
  const yes = rng.next() < 0.5;
  const esSentence = `${who.es} ${saber(who.p, yes)} ${act.es}.`;
  if (form === 'escuchar') {
    const sentence = `${who.s} ${yes ? 'can' : "can't"} ${act.en}.`;
    const pool = ACTIVITIES.filter((a) => a !== act).map((a) => `${who.es} ${saber(who.p, yes)} ${a.es}.`);
    const opposite = `${who.es} ${saber(who.p, !yes)} ${act.es}.`;
    return listenExercise(rng, { id: `escuchar:${who.s}:${act.en}:${yes}`, sentence, es: esSentence, pool: [opposite, ...pool] });
  }
  if (form === 'completar' || form === 'escribir') {
    const answer = yes ? 'can' : "can't";
    return gapExercise({
      id: `${form}:${who.s}:${act.en}:${yes}`,
      form,
      before: who.s,
      after: `${act.en}.`,
      answer,
      ...(form === 'escribir' ? { text: true, accept: yes ? [] : ['cannot', 'can not'] } : { choices: ['can', "can't"] }),
      es: esSentence,
      story: `${act.emoji} Completa: “${esSentence}”`,
      rule: RULE,
      ruleLines: RULE_LINES,
      why: yes ? `Sí sabe: ${en('can')}, igual para todos.` : `No sabe: ${en("can't")}.`,
    });
  }
  if (form === 'pregunta') {
    const subject = who.p === 'I' ? 'you' : lower(who);
    return gapExercise({
      id: `pregunta:${who.s}:${act.en}`,
      form,
      before: '',
      after: `${subject} ${act.en}?`,
      answer: 'Can',
      choices: ['Can', 'Do', 'Does'],
      es: `¿${cap(saber(subject === 'you' ? 'you' : who.p, true))} ${act.es}?`,
      story: `${act.emoji} Haz la pregunta: “¿${cap(saber(subject === 'you' ? 'you' : who.p, true))} ${act.es}?”`,
      rule: `Para preguntar, ${en('can')} va delante: ${en('Can you swim?')} No hace falta ${en('do')}.`,
      ruleLines: ['Can you swim?', 'Can she dance?'],
      why: `Con ${en('can')} la pregunta empieza por ${en('Can')}, sin ${en('do')} ni ${en('does')}.`,
    });
  }
  // respuesta corta
  const pron = who.p === 'I' ? 'you' : who.p;
  const answerPron = pron === 'you' ? 'I' : pron;
  const question = `Can ${pron === 'you' ? 'you' : lower(who)} ${act.en}?`;
  const answer = yes ? `Yes, ${answerPron} can.` : `No, ${answerPron} can't.`;
  const wrong = [`Yes, ${answerPron} do.`, `${yes ? 'No' : 'Yes'}, ${answerPron} ${yes ? "can't" : 'can'}.`, `Yes, ${answerPron} cans.`, `No, ${answerPron} don't.`];
  return {
    id: `respuesta:${who.s}:${act.en}:${yes}`,
    form: 'respuesta',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, answer, wrong.filter((w) => w !== answer), 3),
    answer,
    audio: question,
    repeat: answer,
    story: `💬 Te preguntan ${en(question)} Contesta que ${yes ? 'sí' : 'no'}.`,
    expression: `${en(question)} → □`,
    theme: null,
    illustration: null,
    hint: `Se contesta con ${en('can')} o ${en("can't")}: ${en('Yes, I can.')} ${en("No, she can't.")}`,
    hintFrames: [enFrame(`${en('Yes, I can.')} ${en("No, I can't.")}`, { kind: 'calc', lines: ["Yes, I can. / No, I can't."] })],
    steps: [`Pregunta con ${en('Can')}: se contesta con ${en('can')}.`, `Respuesta: ${en(answer)}`],
    frames: [
      enFrame(`Te preguntan ${en(question)}`, sentenceView([{ text: 'Can', mark: 'verb' }, { text: question.slice(4) }])),
      enFrame(`Respuesta corta: ${en(answer)}`, sentenceView([{ text: answer, mark: 'subject' }])),
    ],
  };
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'I can swim 🏊‍♀️',
    paragraphs: [RULE, `${en('I can dance but I can\'t sing.')} = Sé bailar pero no sé cantar.`],
    words: [{ en: 'I can swim.', es: 'Sé nadar.' }, { en: "She can't cook.", es: 'Ella no sabe cocinar.' }, { en: 'Can you dance?', es: '¿Sabes bailar?' }, { en: 'Yes, I can.', es: 'Sí.' }],
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en('She can play volleyball.')}`, sentenceView([{ text: 'She', mark: 'subject' }, { text: 'can', mark: 'verb' }, { text: 'play volleyball.' }], 'Ella sabe jugar al vóley.')),
    ],
  },
  {
    title: 'Can you…? ❓',
    paragraphs: [`Pregunta: ${en('Can you skate?')} Respuesta corta: ${en('Yes, I can.')} o ${en("No, I can't.")}`],
    words: [{ en: 'Can you skate?', es: '¿Sabes patinar?' }, { en: "No, I can't.", es: 'No.' }],
    frames: [enFrame(`${en('Can you skate?')} ${en("No, I can't.")}`, sentenceView([{ text: 'Can', mark: 'verb' }, { text: 'you', mark: 'subject' }, { text: 'skate?' }], '¿Sabes patinar?'))],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_FOOD,
  title: "Can y can't",
  emoji: '💪',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
