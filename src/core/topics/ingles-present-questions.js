// Tema de inglés: presente simple en negativa (don't, doesn't), preguntas
// (Do you…? Does she…?) y respuestas cortas.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_DAILY, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-present-questions';

const SENTENCES = [
  { s: 'I', p: 'I', v: 'like', c: 'horror films.', no: 'No me gustan las pelis de terror.', q: '¿Me gustan las pelis de terror?' },
  { s: 'You', p: 'you', v: 'play', c: 'volleyball.', no: 'No juegas al vóley.', q: '¿Juegas al vóley?' },
  { s: 'She', p: 'she', v: 'eat', c: 'meat.', no: 'Ella no come carne.', q: '¿Ella come carne?' },
  { s: 'He', p: 'he', v: 'watch', c: 'TV in the morning.', no: 'Él no ve la tele por la mañana.', q: '¿Él ve la tele por la mañana?' },
  { s: 'We', p: 'we', v: 'have', c: 'PE on Tuesdays.', no: 'No tenemos Educación Física los martes.', q: '¿Tenemos Educación Física los martes?' },
  { s: 'They', p: 'they', v: 'live', c: 'near the school.', no: 'No viven cerca del insti.', q: '¿Viven cerca del insti?' },
  { s: 'My sister', p: 'she', v: 'get up', c: 'early at the weekend.', no: 'Mi hermana no se levanta temprano el fin de semana.', q: '¿Mi hermana se levanta temprano el fin de semana?' },
  { s: 'The dog', p: 'it', v: 'sleep', c: 'in my room.', no: 'El perro no duerme en mi habitación.', q: '¿El perro duerme en mi habitación?' },
  { s: 'My friends', p: 'they', v: 'go', c: 'to the gym.', no: 'Mis amigas no van al gimnasio.', q: '¿Mis amigas van al gimnasio?' },
  { s: 'Leo', p: 'he', v: 'do', c: 'boxing.', name: true, no: 'Leo no hace boxeo.', q: '¿Leo hace boxeo?' },
];

export const FORMS = {
  negativa: "Negativa (don't, doesn't)",
  pregunta: 'Preguntas (Do, Does)',
  respuesta: 'Respuestas cortas (Yes, she does.)',
  'escribir-negativa': 'Escribir la negativa',
};

const LEVELS = {
  1: { forms: [['negativa', 4], ['pregunta', 3]] },
  2: { forms: [['negativa', 2], ['pregunta', 3], ['respuesta', 3]] },
  3: { forms: [['escribir-negativa', 3], ['respuesta', 3], ['pregunta', 2]] },
};

const third = (x) => ['he', 'she', 'it'].includes(x.p);
const lower = (x) => (x.s === 'I' || x.name ? x.s : x.s[0].toLowerCase() + x.s.slice(1));
const NEG_RULE = `Negativa: ${en("don't")} + verbo. Con ${en('he')}, ${en('she')} o ${en('it')}: ${en("doesn't")} + verbo, y el verbo pierde la ${en('-s')}.`;
const NEG_LINES = ["I · you · we · they → don't play", "he · she · it → doesn't play"];
const Q_RULE = `Pregunta: ${en('Do')} + sujeto + verbo. Con ${en('he')}, ${en('she')} o ${en('it')}: ${en('Does')}, y el verbo va sin ${en('-s')}.`;
const Q_LINES = ['Do + I · you · we · they + play…?', 'Does + he · she · it + play…?'];
const who = (x, word) => (x.s.toLowerCase() === x.p.toLowerCase() ? `Con ${en(x.p)} va ${en(word)}.` : `${en(x.s)} es como ${en(x.p)}: va ${en(word)}.`);

function buildNegative(rng, typed) {
  const x = rng.pick(SENTENCES);
  const answer = third(x) ? "doesn't" : "don't";
  return gapExercise({
    id: `${typed ? 'escribir-negativa' : 'negativa'}:${x.s}:${x.v}`,
    form: typed ? 'escribir-negativa' : 'negativa',
    before: x.s,
    after: `${x.v} ${x.c}`,
    answer,
    ...(typed ? { text: true, accept: [third(x) ? 'does not' : 'do not'] } : { choices: ["don't", "doesn't"] }),
    es: x.no,
    story: `Ponlo en negativo: “${x.no}”`,
    rule: NEG_RULE,
    ruleLines: NEG_LINES,
    why: `${who(x, answer)} El verbo se queda sin ${en('-s')}: ${en(x.v)}.`,
  });
}

function buildQuestion(rng) {
  const x = rng.pick(SENTENCES.filter((y) => y.p !== 'I'));
  const answer = third(x) ? 'Does' : 'Do';
  return gapExercise({
    id: `pregunta:${x.s}:${x.v}`,
    form: 'pregunta',
    before: '',
    after: `${lower(x)} ${x.v} ${x.c.replace(/\.$/, '?')}`,
    answer,
    choices: ['Do', 'Does'],
    es: x.q,
    story: `Haz la pregunta: “${x.q}”`,
    rule: Q_RULE,
    ruleLines: Q_LINES,
    why: who(x, answer),
  });
}

function buildShort(rng, count) {
  const x = rng.pick(SENTENCES.filter((y) => y.p !== 'I'));
  const yes = rng.next() < 0.5;
  const pron = x.p === 'you' ? 'I' : x.p;
  const aux = ['he', 'she', 'it'].includes(pron) ? 'does' : 'do';
  const neg = aux === 'does' ? "doesn't" : "don't";
  const P = pron === 'I' ? 'I' : pron;
  const answer = yes ? `Yes, ${P} ${aux}.` : `No, ${P} ${neg}.`;
  const question = `${third(x) ? 'Does' : 'Do'} ${lower(x)} ${x.v} ${x.c.replace(/\.$/, '?')}`;
  const wrong = [`Yes, ${P} ${aux === 'does' ? 'do' : 'does'}.`, `${yes ? 'Yes' : 'No'}, ${P} ${x.v}${yes ? '' : ' not'}.`, `${yes ? 'No' : 'Yes'}, ${P} ${yes ? neg : aux}.`, `Yes, ${P} is.`];
  return {
    id: `respuesta:${x.s}:${x.v}:${yes}`,
    form: 'respuesta',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, answer, wrong.filter((w) => w !== answer), count),
    answer,
    audio: question,
    repeat: answer,
    story: `💬 Te preguntan ${en(question)} Contesta que ${yes ? 'sí' : 'no'} con una respuesta corta.`,
    expression: `${en(question)} → □`,
    theme: null,
    illustration: null,
    hint: `Se contesta con ${en('do')} o ${en('does')}: ${en('Yes, I do.')} ${en("No, she doesn't.")}`,
    hintFrames: [enFrame(`${en('Yes, I do.')} ${en("No, she doesn't.")}`, { kind: 'calc', lines: ["Yes, I do. / No, I don't.", "Yes, she does. / No, she doesn't."] })],
    steps: [`Pregunta con ${en(third(x) ? 'Does' : 'Do')}: se contesta con ${en(aux)}.`, `Respuesta: ${en(answer)}`],
    frames: [
      enFrame(`Te preguntan ${en(question)}`, sentenceView([{ text: third(x) ? 'Does' : 'Do', mark: 'verb' }, { text: lower(x), mark: 'subject' }, { text: `${x.v} ${x.c.replace(/\.$/, '?')}` }], x.q)),
      enFrame(`Respuesta corta: ${en(answer)}`, sentenceView([{ text: answer, mark: 'subject' }])),
    ],
  };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'negativa' || form === 'escribir-negativa') return buildNegative(rng, form === 'escribir-negativa');
  if (form === 'pregunta') return buildQuestion(rng);
  return buildShort(rng, 3);
}

export const generate = generator(build);

const INTRO = [
  {
    title: "Don't y doesn't 🙅‍♀️",
    paragraphs: [NEG_RULE, `${en("I don't like horror films.")} ${en("She doesn't eat meat.")} (¡no ${en('eats')}!)`],
    words: [{ en: "I don't like Mondays.", es: 'No me gustan los lunes.' }, { en: "She doesn't eat meat.", es: 'Ella no come carne.' }],
    frames: [
      enFrame(NEG_RULE, { kind: 'calc', lines: NEG_LINES }),
      enFrame(`${en("She doesn't eat meat.")}`, sentenceView([{ text: 'She', mark: 'subject' }, { text: "doesn't", mark: 'verb' }, { text: 'eat meat.' }], 'Ella no come carne.')),
    ],
  },
  {
    title: 'Do you…? Does she…? ❓',
    paragraphs: [Q_RULE, `${en('Do you play volleyball?')} → ${en('Yes, I do.')} / ${en("No, I don't.")}`],
    words: [{ en: 'Do you play volleyball?', es: '¿Juegas al vóley?' }, { en: 'Yes, I do.', es: 'Sí.' }, { en: 'Does she like cats?', es: '¿Le gustan los gatos?' }, { en: "No, she doesn't.", es: 'No.' }],
    frames: [
      enFrame(Q_RULE, { kind: 'calc', lines: Q_LINES }),
      enFrame(`${en('Does she like cats?')} → ${en('Yes, she does.')}`, sentenceView([{ text: 'Does', mark: 'verb' }, { text: 'she', mark: 'subject' }, { text: 'like cats?' }], '¿Le gustan los gatos?')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_DAILY,
  title: "Don't, doesn't, Do…?",
  emoji: '❓',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
