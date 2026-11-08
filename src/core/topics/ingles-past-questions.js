// Tema de inglés: pasado simple en negativa (didn't) y preguntas (Did…?),
// con respuestas cortas.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_PAST, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-past-questions';

const SENTENCES = [
  { s: 'I', v: 'go', past: 'went', c: 'to the party.', no: 'No fui a la fiesta.', q: '¿Fui a la fiesta?' },
  { s: 'She', v: 'watch', past: 'watched', c: 'the match.', no: 'Ella no vio el partido.', q: '¿Ella vio el partido?' },
  { s: 'We', v: 'win', past: 'won', c: 'the game.', no: 'No ganamos el partido.', q: '¿Ganamos el partido?' },
  { s: 'They', v: 'eat', past: 'ate', c: 'the pancakes.', no: 'No se comieron las tortitas.', q: '¿Se comieron las tortitas?' },
  { s: 'He', v: 'study', past: 'studied', c: 'for the test.', no: 'Él no estudió para el examen.', q: '¿Él estudió para el examen?' },
  { s: 'You', v: 'see', past: 'saw', c: 'the new film.', no: 'No viste la peli nueva.', q: '¿Viste la peli nueva?' },
  { s: 'My friends', v: 'come', past: 'came', c: 'to my house.', no: 'Mis amigas no vinieron a mi casa.', q: '¿Mis amigas vinieron a mi casa?' },
  { s: 'My dad', v: 'make', past: 'made', c: 'dinner.', no: 'Mi padre no hizo la cena.', q: '¿Mi padre hizo la cena?' },
];

export const FORMS = {
  negativa: "Negativa con didn't",
  verbo: "Didn't + verbo sin pasado",
  pregunta: 'Preguntas con Did',
  respuesta: 'Respuestas cortas (Yes, I did.)',
};

const LEVELS = {
  1: { forms: [['negativa', 4], ['pregunta', 3]] },
  2: { forms: [['verbo', 3], ['pregunta', 2], ['respuesta', 3]] },
  3: { forms: [['verbo', 3], ['respuesta', 3], ['negativa', 1]] },
};

const RULE = `Negativa: ${en("didn't")} + verbo normal (sin pasado): ${en("I didn't go")}, no «didn't went». Pregunta: ${en('Did')} + sujeto + verbo normal: ${en('Did you go?')}`;
const RULE_LINES = ["✘ I didn't go to the party.", '? Did you go to the party?', "Yes, I did. / No, I didn't."];
const lower = (x) => (x.s === 'I' ? x.s : x.s[0].toLowerCase() + x.s.slice(1));

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  const x = rng.pick(SENTENCES);
  if (form === 'negativa') {
    return gapExercise({
      id: `negativa:${x.s}:${x.v}`, form, before: x.s, after: `${x.v} ${x.c}`, answer: "didn't", choices: ["didn't", "doesn't", "wasn't"],
      es: x.no, story: `Ponlo en negativo: “${x.no}”`, rule: RULE, ruleLines: RULE_LINES,
      why: `En pasado, la negativa es ${en("didn't")} para todos.`,
    });
  }
  if (form === 'verbo') {
    return gapExercise({
      id: `verbo:${x.s}:${x.v}`, form, before: `${x.s} didn't`, after: x.c, answer: x.v, choices: choicesFor(rng, x.v, [x.past, `${x.v}ed`, `${x.v}s`], 3),
      es: x.no, story: `Elige el verbo: “${x.no}”`, rule: RULE, ruleLines: RULE_LINES,
      why: `Detrás de ${en("didn't")} el verbo va normal, sin pasado: ${en(x.v)} (no ${en(x.past)}).`,
    });
  }
  if (form === 'pregunta') {
    return gapExercise({
      id: `pregunta:${x.s}:${x.v}`, form, before: '', after: `${lower(x) === 'I' ? 'I' : lower(x)} ${x.v} ${x.c.replace(/\.$/, '?')}`, answer: 'Did', choices: ['Did', 'Do', 'Was'],
      es: x.q, story: `Haz la pregunta: “${x.q}”`, rule: RULE, ruleLines: RULE_LINES,
      why: `En pasado, las preguntas empiezan por ${en('Did')} para todos.`,
    });
  }
  const yes = rng.next() < 0.5;
  const pron = x.s === 'You' ? 'I' : x.s === 'I' ? 'you' : x.s === 'My friends' ? 'they' : x.s === 'My dad' ? 'he' : x.s.toLowerCase();
  const subject = x.s === 'I' ? 'I' : lower(x);
  const question = `Did ${subject} ${x.v} ${x.c.replace(/\.$/, '?')}`;
  const answer = yes ? `Yes, ${pron} did.` : `No, ${pron} didn't.`;
  const wrong = [`Yes, ${pron} ${x.past}.`, `No, ${pron} don't.`, `${yes ? 'No' : 'Yes'}, ${pron} ${yes ? "didn't" : 'did'}.`, `Yes, ${pron} was.`];
  return {
    id: `respuesta:${x.s}:${x.v}:${yes}`,
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
    hint: `Se contesta con ${en('did')} o ${en("didn't")}: ${en('Yes, I did.')} ${en("No, she didn't.")}`,
    hintFrames: [enFrame(`${en('Yes, I did.')} ${en("No, I didn't.")}`, { kind: 'calc', lines: ["Yes, I did. / No, I didn't."] })],
    steps: [`Pregunta con ${en('Did')}: se contesta con ${en('did')}.`, `Respuesta: ${en(answer)}`],
    frames: [
      enFrame(`Te preguntan ${en(question)}`, sentenceView([{ text: 'Did', mark: 'verb' }, { text: question.slice(4) }], x.q)),
      enFrame(`Respuesta corta: ${en(answer)}`, sentenceView([{ text: answer, mark: 'subject' }])),
    ],
  };
}

export const generate = generator(build);

const INTRO = [
  {
    title: "Didn't 🙅‍♀️",
    paragraphs: [RULE],
    words: [{ en: "I didn't go to the party.", es: 'No fui a la fiesta.' }, { en: "She didn't watch the match.", es: 'No vio el partido.' }],
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en("I didn't go to the party.")}`, sentenceView([{ text: 'I', mark: 'subject' }, { text: "didn't go", mark: 'verb' }, { text: 'to the party.' }], 'No fui a la fiesta.')),
    ],
  },
  {
    title: 'Did you…? ❓',
    paragraphs: [`${en('Did you see the new film?')} → ${en('Yes, I did.')} / ${en("No, I didn't.")}`],
    words: [{ en: 'Did you see the new film?', es: '¿Viste la peli nueva?' }, { en: 'Yes, I did.', es: 'Sí.' }, { en: "No, I didn't.", es: 'No.' }],
    frames: [enFrame(`${en('Did you see the new film?')}`, sentenceView([{ text: 'Did', mark: 'verb' }, { text: 'you', mark: 'subject' }, { text: 'see the new film?' }], '¿Viste la peli nueva?'))],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_PAST,
  title: "Didn't y Did…?",
  emoji: '❔',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
