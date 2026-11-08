// Tema de inglés: el futuro con be going to (planes) y will (predicciones y
// decisiones en el momento).

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_FUTURE, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, listenExercise, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-future';

const PLANS = [
  { s: 'I', be: 'am', v: 'visit', c: 'London next summer.', es: 'Voy a visitar Londres el verano que viene.' },
  { s: 'She', be: 'is', v: 'play', c: 'in the volleyball final.', es: 'Ella va a jugar la final de vóley.' },
  { s: 'We', be: 'are', v: 'make', c: 'pancakes this afternoon.', es: 'Vamos a hacer tortitas esta tarde.' },
  { s: 'They', be: 'are', v: 'watch', c: 'a horror film tonight.', es: 'Van a ver una peli de terror esta noche.' },
  { s: 'My brother', be: 'is', v: 'buy', c: 'a new bike.', es: 'Mi hermano va a comprarse una bici nueva.' },
  { s: 'You', be: 'are', v: 'meet', c: 'my cousin on Saturday.', es: 'Vas a conocer a mi prima el sábado.' },
];
const PREDICTIONS = [
// no: la negativa en español, solo en las que tiene sentido.
  { s: 'I think it', v: 'rain', c: 'tomorrow.', es: 'Creo que mañana lloverá.', no: 'Creo que mañana no lloverá.' },
  { s: 'Robots', v: 'do', c: 'our homework in the future.', es: 'Los robots harán nuestros deberes en el futuro.', no: 'Los robots no harán nuestros deberes en el futuro.' },
  { s: 'You', v: 'pass', c: 'the exam, don\'t worry!', es: '¡Aprobarás el examen, no te preocupes!' },
  { s: 'I', v: 'help', c: 'you with that.', es: 'Te ayudaré con eso.' },
  { s: 'People', v: 'live', c: 'on Mars one day.', es: 'Algún día la gente vivirá en Marte.', no: 'La gente no vivirá en Marte.' },
];

export const FORMS = {
  'going-to': 'Am, is o are going to',
  will: "Will o won't",
  elegir: 'Going to o will',
  escuchar: 'Escuchar la frase y entenderla',
};

const LEVELS = {
  1: { forms: [['going-to', 4], ['will', 3]] },
  2: { forms: [['going-to', 2], ['will', 2], ['elegir', 3], ['escuchar', 1]] },
  3: { forms: [['elegir', 4], ['will', 1], ['going-to', 1]] },
};

const RULE = `Planes: ${en('be going to')} + verbo (${en("I'm going to visit London.")}). Predicciones y decisiones en el momento: ${en('will')} + verbo (${en('It will rain.')} ${en("I'll help you.")}).`;
const RULE_LINES = ['📅 plan → I am going to visit London.', '🔮 predicción → It will rain.', "✘ It won't rain."];

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'escuchar') {
    const x = rng.pick(PLANS);
    return listenExercise(rng, { id: `escuchar:${x.s}:${x.v}`, sentence: `${x.s} ${x.be} going to ${x.v} ${x.c}`, es: x.es, pool: PLANS.filter((y) => y !== x).map((y) => y.es) });
  }
  if (form === 'going-to') {
    const x = rng.pick(PLANS);
    return gapExercise({
      id: `going-to:${x.s}:${x.v}`, form, before: x.s, after: `going to ${x.v} ${x.c}`, answer: x.be, choices: ['am', 'is', 'are'],
      es: x.es, story: `📅 Un plan: “${x.es}”`, rule: RULE, ruleLines: RULE_LINES,
      why: `Con ${en(x.s)} va ${en(x.be)}: ${en(`${x.s} ${x.be} going to`)}.`,
    });
  }
  if (form === 'will') {
    const x = rng.pick(PREDICTIONS);
    const neg = Boolean(x.no) && rng.next() < 0.4;
    const answer = neg ? "won't" : 'will';
    const es = neg ? x.no : x.es;
    return gapExercise({
      id: `will:${x.s}:${neg}`, form, before: x.s, after: `${x.v} ${x.c}`, answer, choices: ['will', "won't", 'is going'],
      es, story: `🔮 Completa: “${es}”`, rule: RULE, ruleLines: RULE_LINES,
      why: neg ? `Es negativa: ${en("won't")} (will not).` : `Es una predicción o una decisión: ${en('will')}.`,
    });
  }
  // elegir: plan (going to) o predicción (will)
  const plan = rng.next() < 0.5;
  const x = plan ? rng.pick(PLANS) : rng.pick(PREDICTIONS);
  const right = plan ? `${x.be} going to` : 'will';
  const wrong = plan ? 'will' : (x.s === 'I' ? 'am going to' : x.s === 'You' || x.s === 'Robots' || x.s === 'People' ? 'are going to' : 'is going to');
  return gapExercise({
    id: `elegir:${x.s}:${x.v}`, form: 'elegir', before: x.s, after: `${x.v} ${x.c}`, answer: right,
    choices: choicesFor(rng, right, [wrong], 2),
    es: x.es, story: plan ? `📅 Es un plan que ya está decidido: “${x.es}”` : `🔮 Es una predicción o algo que decides ahora: “${x.es}”`,
    rule: RULE, ruleLines: RULE_LINES,
    why: plan ? `Es un plan: ${en('going to')}.` : `Es una predicción o una decisión del momento: ${en('will')}.`,
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Going to 📅',
    paragraphs: [`Para planes que ya has decidido: ${en('am')} / ${en('is')} / ${en('are')} + ${en('going to')} + verbo. ${en("I'm going to visit London next summer.")}`],
    words: PLANS.slice(0, 3).map((x) => ({ en: `${x.s} ${x.be} going to ${x.v} ${x.c}`, es: x.es })),
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en('We are going to make pancakes this afternoon.')}`, sentenceView([{ text: 'We', mark: 'subject' }, { text: 'are going to make', mark: 'verb' }, { text: 'pancakes this afternoon.' }], 'Vamos a hacer tortitas esta tarde.')),
    ],
  },
  {
    title: 'Will 🔮',
    paragraphs: [`Para predicciones y decisiones en el momento: ${en('will')} + verbo, igual para todos. Negativa: ${en("won't")}. ${en("Don't worry, you will pass the exam!")}`],
    words: PREDICTIONS.map((x) => ({ en: `${x.s} will ${x.v} ${x.c}`, es: x.es })),
    frames: [enFrame(`${en('People will live on Mars one day.')}`, sentenceView([{ text: 'People', mark: 'subject' }, { text: 'will live', mark: 'verb' }, { text: 'on Mars one day.' }], 'Algún día la gente vivirá en Marte.'))],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_FUTURE,
  title: 'Futuro: going to y will',
  emoji: '🔮',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
