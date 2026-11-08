// Tema de inglés: «have got» (tener) en afirmativa, negativa, pregunta y
// respuesta corta (Starter 2).

import {
  BLOCK_STARTER2, LEVEL_NAMES, SUBJECT, en, gapExercise, generator, listenExercise, pickForm, sentenceView,
} from './ingles-comun.js';
import { enFrame } from '../explain/storyboard.js';

const TOPIC_ID = 'ingles-have-got';

// s: sujeto; p: pronombre; c: lo que se tiene; es / no / q: traducciones.
export const SENTENCES = [
  { s: 'I', p: 'I', c: 'a black cat', es: 'Tengo un gato negro.', no: 'No tengo un gato negro.', q: '¿Tengo un gato negro?' },
  { s: 'You', p: 'you', c: 'a new phone', es: 'Tienes un móvil nuevo.', no: 'No tienes un móvil nuevo.', q: '¿Tienes un móvil nuevo?' },
  { s: 'She', p: 'she', c: 'long hair', es: 'Ella tiene el pelo largo.', no: 'Ella no tiene el pelo largo.', q: '¿Ella tiene el pelo largo?' },
  { s: 'He', p: 'he', c: 'two sisters', es: 'Él tiene dos hermanas.', no: 'Él no tiene dos hermanas.', q: '¿Él tiene dos hermanas?' },
  { s: 'We', p: 'we', c: 'a volleyball match today', es: 'Tenemos partido de vóley hoy.', no: 'No tenemos partido de vóley hoy.', q: '¿Tenemos partido de vóley hoy?' },
  { s: 'They', p: 'they', c: 'a big dog', es: 'Tienen un perro grande.', no: 'No tienen un perro grande.', q: '¿Tienen un perro grande?' },
  { s: 'My cousin', p: 'she', c: 'a pink bike', es: 'Mi prima tiene una bici rosa.', no: 'Mi prima no tiene una bici rosa.', q: '¿Mi prima tiene una bici rosa?' },
  { s: 'Leo', p: 'he', c: 'boxing gloves', name: true, es: 'Leo tiene guantes de boxeo.', no: 'Leo no tiene guantes de boxeo.', q: '¿Leo tiene guantes de boxeo?' },
  { s: 'The monkey', p: 'it', c: 'a banana', es: 'El mono tiene un plátano.', no: 'El mono no tiene un plátano.', q: '¿El mono tiene un plátano?' },
  { s: 'My parents', p: 'they', c: 'a red car', es: 'Mis padres tienen un coche rojo.', no: 'Mis padres no tienen un coche rojo.', q: '¿Mis padres tienen un coche rojo?' },
];

export const FORMS = {
  completar: 'Have got o has got',
  negativa: "Negativa (haven't got, hasn't got)",
  pregunta: 'Preguntas (Have you got…?)',
  respuesta: 'Respuestas cortas (Yes, I have.)',
  escribir: 'Escribir have o has',
  escuchar: 'Escuchar la frase y entenderla',
};

const LEVELS = {
  1: { forms: [['completar', 5], ['escuchar', 2]] },
  2: { forms: [['completar', 2], ['negativa', 3], ['escribir', 3], ['escuchar', 2]] },
  3: { forms: [['pregunta', 3], ['respuesta', 3], ['negativa', 2], ['escribir', 1]] },
};

const third = (x) => ['he', 'she', 'it'].includes(x.p);
const RULE = `Con ${en('he')}, ${en('she')} o ${en('it')} se usa ${en('has got')}. Con los demás, ${en('have got')}.`;
const RULE_LINES = ['I · you · we · they → have got', 'he · she · it → has got'];
const lower = (x) => (x.s === 'I' || x.name ? x.s : x.s[0].toLowerCase() + x.s.slice(1));
const why = (x, word) => (x.s.toLowerCase() === x.p.toLowerCase()
  ? `Con ${en(x.p)} va ${en(word)}.`
  : `${en(x.s)} es como ${en(x.p)}, así que va ${en(word)}.`);

function buildSentence(rng, form) {
  const x = rng.pick(SENTENCES);
  const verb = third(x) ? 'has' : 'have';
  if (form === 'completar' || form === 'escribir') {
    return gapExercise({
      id: `${form}:${x.s}:${x.c}`, form, before: x.s, after: `got ${x.c}.`, answer: verb,
      ...(form === 'escribir' ? { text: true } : { choices: ['have', 'has'] }),
      es: x.es, story: `Completa con el verbo ${en('have got')}: “${x.es}”`, rule: RULE, ruleLines: RULE_LINES, why: why(x, `${verb} got`),
    });
  }
  if (form === 'negativa') {
    const neg = third(x) ? "hasn't" : "haven't";
    return gapExercise({
      id: `negativa:${x.s}:${x.c}`, form, before: x.s, after: `got ${x.c}.`, answer: neg, choices: ["haven't", "hasn't"],
      es: x.no, story: `Ponlo en negativo: “${x.no}”`,
      rule: `Negativa: ${en("haven't got")} (= have not got) y, con ${en('he')}, ${en('she')} o ${en('it')}, ${en("hasn't got")}.`,
      ruleLines: ["I · you · we · they → haven't got", "he · she · it → hasn't got"], why: why(x, `${neg} got`),
    });
  }
  if (form === 'pregunta') {
    const Verb = third(x) ? 'Has' : 'Have';
    return gapExercise({
      id: `pregunta:${x.s}:${x.c}`, form, before: '', after: `${lower(x)} got ${x.c}?`, answer: Verb, choices: ['Have', 'Has'],
      es: x.q, story: `Haz la pregunta: “${x.q}”`,
      rule: `Para preguntar, ${en('have')} o ${en('has')} va delante: ${en('Have you got a pet?')} ${en('Has she got a pet?')}`,
      ruleLines: ['Have + I · you · we · they + got…?', 'Has + he · she · it + got…?'], why: why(x, Verb),
    });
  }
  // respuesta corta: Yes, she has. / No, they haven't.
  const yes = rng.next() < 0.5;
  const pron = x.p === 'I' ? 'you' : x.p === 'you' ? 'I' : x.p;
  const pronVerb = ['he', 'she', 'it'].includes(pron) ? 'has' : 'have';
  const answer = yes ? `Yes, ${pron} ${pronVerb}.` : `No, ${pron} ${pronVerb === 'has' ? "hasn't" : "haven't"}.`;
  const Verb = third(x) ? 'Has' : 'Have';
  const question = `${Verb} ${lower(x)} got ${x.c}?`;
  const wrong = [`Yes, ${pron} ${pronVerb === 'has' ? 'have' : 'has'}.`, `${yes ? 'Yes' : 'No'}, ${pron} got.`, `${yes ? 'No' : 'Yes'}, ${pron} ${pronVerb}${yes ? "n't" : ''}.`, `Yes, ${pron} do.`];
  return {
    id: `respuesta:${x.s}:${x.c}:${yes}`,
    form,
    answerType: 'choice',
    choicesLang: 'en',
    choices: [answer, ...wrong.filter((w) => w !== answer).slice(0, 2)].sort(),
    answer,
    audio: question,
    repeat: answer,
    story: `💬 Te preguntan ${en(question)} Contesta que ${yes ? 'sí' : 'no'} con una respuesta corta.`,
    expression: `${en(question)} → □`,
    theme: null,
    illustration: null,
    hint: `En la respuesta corta se repite ${en('have')} o ${en('has')}, sin ${en('got')}: ${en('Yes, I have.')} / ${en("No, she hasn't.")}`,
    hintFrames: [enFrame(`${en('Yes, I have.')} ${en("No, she hasn't.")}`, { kind: 'calc', lines: ['Yes, I have. / No, I haven\'t.', 'Yes, she has. / No, she hasn\'t.'] })],
    steps: [why({ ...x, s: pron, p: pron }, pronVerb), `Respuesta: ${en(answer)}`],
    frames: [
      enFrame(`Te preguntan ${en(question)}`, sentenceView([{ text: Verb, mark: 'verb' }, { text: lower(x), mark: 'subject' }, { text: `got ${x.c}?` }], x.q)),
      enFrame(`Se contesta corto, sin ${en('got')}: ${en(answer)}`, sentenceView([{ text: answer, mark: 'subject' }])),
    ],
  };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'escuchar') {
    const x = rng.pick(SENTENCES);
    return listenExercise(rng, { id: `escuchar:${x.s}:${x.c}`, sentence: `${x.s} ${third(x) ? 'has' : 'have'} got ${x.c}.`, es: x.es, pool: SENTENCES.filter((y) => y !== x).map((y) => y.es) });
  }
  return buildSentence(rng, form);
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Have got = tener 🐱',
    paragraphs: [RULE, `${en('I have got a cat')} = tengo un gato. Al hablar se junta: ${en("I've got")}, ${en("she's got")}.`],
    words: [{ en: "I've got a cat.", es: 'Tengo un gato.' }, { en: "She's got two sisters.", es: 'Tiene dos hermanas.' }, { en: "We've got a match today.", es: 'Tenemos partido hoy.' }],
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en('She has got long hair.')}`, sentenceView([{ text: 'She', mark: 'subject' }, { text: 'has got', mark: 'verb' }, { text: 'long hair.' }], 'Ella tiene el pelo largo.')),
    ],
  },
  {
    title: "Negativa y pregunta ❓",
    paragraphs: [`Negativa: ${en("I haven't got a dog")}, ${en("he hasn't got a dog")}. Pregunta: ${en('Have you got a dog?')} → ${en('Yes, I have.')} / ${en("No, I haven't.")}`],
    words: [{ en: 'Have you got a pet?', es: '¿Tienes mascota?' }, { en: 'Yes, I have.', es: 'Sí.' }, { en: "No, I haven't.", es: 'No.' }],
    frames: [
      enFrame(`${en('Have you got a pet?')}`, sentenceView([{ text: 'Have', mark: 'verb' }, { text: 'you', mark: 'subject' }, { text: 'got a pet?' }], '¿Tienes mascota?')),
      enFrame(`${en('Yes, I have.')} o ${en("No, I haven't.")}`, sentenceView([{ text: 'Yes, I have.', mark: 'subject' }, { text: '/' }, { text: "No, I haven't.", mark: 'verb' }])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_STARTER2,
  title: 'Have got: tener',
  emoji: '🐱',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
