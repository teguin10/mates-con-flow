// Tema de inglés: el verbo «to be» (ser y estar) con los pronombres
// (nivel cero). Afirmativa, contracciones y, en el nivel Pro, negativa y
// pregunta.

import { enFrame } from '../explain/storyboard.js';
import { BLOCK, LEVEL_NAMES, SUBJECT, choicesFor, en, generator, pickForm, sentenceView, shuffle } from './ingles-comun.js';

const TOPIC_ID = 'ingles-to-be';

export const PRONOUNS = {
  I: { es: 'yo', verb: 'am', short: "I'm" },
  you: { es: 'tú (o vosotros)', verb: 'are', short: "you're" },
  he: { es: 'él', verb: 'is', short: "he's" },
  she: { es: 'ella', verb: 'is', short: "she's" },
  it: { es: 'ello (una cosa o un animal)', verb: 'is', short: "it's" },
  we: { es: 'nosotros o nosotras', verb: 'are', short: "we're" },
  they: { es: 'ellos o ellas', verb: 'are', short: "they're" },
};

// s: sujeto; p: el pronombre que le corresponde; c: el resto de la frase.
export const SENTENCES = [
  { s: 'I', p: 'I', c: 'thirteen', es: 'Tengo trece años.', no: 'No tengo trece años.', q: '¿Tengo trece años?' },
  { s: 'I', p: 'I', c: 'happy', es: 'Estoy contenta.', no: 'No estoy contenta.', q: '¿Estoy contenta?' },
  { s: 'I', p: 'I', c: 'from Spain', es: 'Soy de España.', no: 'No soy de España.', q: '¿Soy de España?' },
  { s: 'You', p: 'you', c: 'my best friend', es: 'Eres mi mejor amiga.', no: 'No eres mi mejor amiga.', q: '¿Eres mi mejor amiga?' },
  { s: 'He', p: 'he', c: 'tired', es: 'Él está cansado.', no: 'Él no está cansado.', q: '¿Él está cansado?' },
  { s: 'She', p: 'she', c: 'a volleyball player', es: 'Ella es jugadora de vóley.', no: 'Ella no es jugadora de vóley.', q: '¿Ella es jugadora de vóley?' },
  { s: 'It', p: 'it', c: 'a cute monkey', es: 'Es un mono adorable.', no: 'No es un mono adorable.', q: '¿Es un mono adorable?' },
  { s: 'We', p: 'we', c: 'in the same class', es: 'Estamos en la misma clase.', no: 'No estamos en la misma clase.', q: '¿Estamos en la misma clase?' },
  { s: 'They', p: 'they', c: 'zombies', es: 'Son zombis.', no: 'No son zombis.', q: '¿Son zombis?' },
  { s: 'My cat', p: 'it', c: 'black', es: 'Mi gato es negro.', no: 'Mi gato no es negro.', q: '¿Mi gato es negro?' },
  { s: 'My dogs', p: 'they', c: 'hungry', es: 'Mis perros tienen hambre.', no: 'Mis perros no tienen hambre.', q: '¿Mis perros tienen hambre?' },
  { s: 'The film', p: 'it', c: 'scary', es: 'La peli da miedo.', no: 'La peli no da miedo.', q: '¿La peli da miedo?' },
  { s: 'The crepes', p: 'they', c: 'delicious', es: 'Las crepes están riquísimas.', no: 'Las crepes no están riquísimas.', q: '¿Las crepes están riquísimas?' },
  { s: 'Sara', p: 'she', c: 'at the gym', name: true, es: 'Sara está en el gimnasio.', no: 'Sara no está en el gimnasio.', q: '¿Sara está en el gimnasio?' },
  { s: 'You and I', p: 'we', c: 'a great team', es: 'Tú y yo somos un gran equipo.', no: 'Tú y yo no somos un gran equipo.', q: '¿Tú y yo somos un gran equipo?' },
];

export const FORMS = {
  pronombre: 'Los pronombres (yo → I)',
  completar: 'Completar con am, is o are',
  contraccion: 'Contracciones (I am → I\'m)',
  escuchar: 'Escuchar la frase y entenderla',
  escribir: 'Escribir am, is o are',
  negativa: 'Negativa (isn\'t, aren\'t)',
  pregunta: 'Preguntas (Are you…?)',
};

const LEVELS = {
  1: { choices: 3, forms: [['pronombre', 3], ['completar', 5]] },
  2: { choices: 3, forms: [['completar', 3], ['contraccion', 3], ['escuchar', 2], ['escribir', 3], ['pronombre', 1]] },
  3: { choices: 3, forms: [['negativa', 3], ['pregunta', 3], ['escribir', 2], ['escuchar', 2], ['contraccion', 1]] },
};

const VERBS = ['am', 'is', 'are'];
const NEGATIVES = { am: 'am not', is: "isn't", are: "aren't" };
const RULE = `Con ${en('I')} va ${en('am')}. Con ${en('he')}, ${en('she')} o ${en('it')} va ${en('is')}. Con ${en('you')}, ${en('we')} o ${en('they')} va ${en('are')}.`;
const RULE_LINES = ['I → am', 'he · she · it → is', 'you · we · they → are'];
const ruleFrame = () => enFrame(RULE, { kind: 'calc', lines: RULE_LINES });

const verbOf = (x) => PRONOUNS[x.p].verb;
const sentence = (x, verb) => `${x.s} ${verb} ${x.c}.`;
const lowerSubject = (x) => (x.s === 'I' || x.name ? x.s : x.s[0].toLowerCase() + x.s.slice(1));

/** Por qué va ese verbo: el sujeto y su pronombre. */
function whyFrame(x) {
  const verb = verbOf(x);
  const say = x.s.toLowerCase() === x.p.toLowerCase()
    ? `Con ${en(x.p)} va ${en(verb)}.`
    : `${en(x.s)} es como ${en(x.p)}, así que va ${en(verb)}.`;
  return enFrame(say, sentenceView([{ text: x.s, mark: 'subject' }, { text: verb, mark: 'verb' }, { text: `${x.c}.` }], x.es));
}

function whyStep(x) {
  const verb = verbOf(x);
  return x.s.toLowerCase() === x.p.toLowerCase()
    ? `El sujeto es ${en(x.p)}: va ${en(verb)}.`
    : `${en(x.s)} se puede cambiar por ${en(x.p)}: va ${en(verb)}.`;
}

function buildSentence(rng, form, count) {
  const x = rng.pick(form === 'negativa' || form === 'pregunta' ? SENTENCES.filter((y) => y.c !== 'thirteen') : SENTENCES);
  const verb = verbOf(x);
  const base = {
    id: `${form}:${x.s}:${x.c}`,
    form,
    theme: null,
    illustration: null,
    hint: x.s.toLowerCase() === x.p.toLowerCase() ? RULE : `Piensa: ${en(x.s)} es como ${en(x.p)}. ${RULE}`,
    hintFrames: [ruleFrame()],
  };
  if (form === 'completar' || form === 'escribir') {
    const full = sentence(x, verb);
    return {
      ...base,
      ...(form === 'completar'
        ? { answerType: 'choice', choicesLang: 'en', choices: VERBS }
        : { answerType: 'text', accept: [] }),
      answer: verb,
      repeat: full,
      story: `Completa con el verbo ${en('to be')} (ser o estar): “${x.es}”`,
      expression: `${en(x.s)} □ ${en(`${x.c}.`)}`,
      steps: [whyStep(x), `Queda ${en(full)}`],
      frames: [ruleFrame(), whyFrame(x), enFrame(`Repite conmigo: ${en(full)}`, sentenceView([{ text: x.s, mark: 'subject' }, { text: verb, mark: 'verb' }, { text: `${x.c}.` }], x.es))],
    };
  }
  if (form === 'escuchar') {
    const full = sentence(x, verb);
    const pool = SENTENCES.filter((y) => y !== x).map((y) => y.es);
    return {
      ...base,
      answerType: 'choice',
      choices: choicesFor(rng, x.es, pool, count),
      answer: x.es,
      listen: full,
      repeat: full,
      story: 'Escucha 🔊 la frase y elige qué significa.',
      expression: '🔊 = □',
      hint: 'Escúchala otra vez, despacio con 🐢. Fíjate primero en quién (el sujeto).',
      hintFrames: [enFrame(`Escucha: ${en(full)}`, sentenceView([{ text: '?', mark: 'subject' }, { text: verb, mark: 'verb' }, { text: '…' }]))],
      steps: [`${en(full)} significa “${x.es}”`],
      frames: [whyFrame(x), enFrame(`${en(full)} significa: ${x.es}`, sentenceView([{ text: x.s, mark: 'subject' }, { text: verb, mark: 'verb' }, { text: `${x.c}.` }], x.es))],
    };
  }
  if (form === 'negativa') {
    const neg = NEGATIVES[verb];
    const full = sentence(x, neg);
    return {
      ...base,
      answerType: 'choice',
      choicesLang: 'en',
      choices: Object.values(NEGATIVES),
      answer: neg,
      repeat: full,
      story: `Ponlo en negativo: “${x.no}”`,
      expression: `${en(x.s)} □ ${en(`${x.c}.`)}`,
      hint: `Para decir que no, se añade ${en('not')} detrás del verbo: ${en('is not')} = ${en("isn't")}, ${en('are not')} = ${en("aren't")}, ${en('am not')}.`,
      steps: [whyStep(x), `En negativo: ${en(`${verb} not`)}${neg.includes("'") ? ` = ${en(neg)}` : ''}.`, `Queda ${en(full)}`],
      frames: [
        whyFrame(x),
        enFrame(`Para decir que no, se pone ${en('not')} detrás: ${en(`${verb} not`)}${neg.includes("'") ? `, que se junta en ${en(neg)}` : ''}.`,
          sentenceView([{ text: x.s, mark: 'subject' }, { text: neg, mark: 'verb' }, { text: `${x.c}.` }], x.no)),
      ],
    };
  }
  // pregunta: el verbo pasa delante.
  const Verb = verb[0].toUpperCase() + verb.slice(1);
  const full = `${Verb} ${lowerSubject(x)} ${x.c}?`;
  return {
    ...base,
    answerType: 'choice',
    choicesLang: 'en',
    choices: VERBS.map((v) => v[0].toUpperCase() + v.slice(1)),
    answer: Verb,
    repeat: full,
    story: `Haz la pregunta: “${x.q}”`,
    expression: `□ ${en(`${lowerSubject(x)} ${x.c}?`)}`,
    hint: `Para preguntar, el verbo pasa delante del sujeto. ${RULE}`,
    steps: [whyStep(x), 'Para preguntar, el verbo va delante.', `Queda ${en(full)}`],
    frames: [
      whyFrame(x),
      enFrame(`Para preguntar, el verbo salta delante: ${en(full)}`, sentenceView([{ text: Verb, mark: 'verb' }, { text: lowerSubject(x), mark: 'subject' }, { text: `${x.c}?` }], x.q)),
    ],
  };
}

function buildPronoun(rng, count) {
  const key = rng.pick(Object.keys(PRONOUNS));
  const p = PRONOUNS[key];
  return {
    id: `pronombre:${key}`,
    form: 'pronombre',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, key, Object.keys(PRONOUNS), count),
    answer: key,
    audio: null,
    repeat: key,
    story: `¿Cómo se dice “${p.es}” en inglés?`,
    expression: `“${p.es.split(' (')[0]}” = □`,
    theme: null,
    illustration: null,
    hint: `${en('I')} = yo (siempre en mayúscula), ${en('you')} = tú o vosotros, ${en('he')} = él, ${en('she')} = ella, ${en('it')} = cosa o animal, ${en('we')} = nosotros, ${en('they')} = ellos.`,
    hintFrames: [enFrame('Los pronombres en inglés.', { kind: 'calc', lines: ['I yo · you tú · he él · she ella', 'it (cosa) · we nosotros · they ellos'] })],
    steps: [`“${p.es}” es ${en(key)}.`, `Con el verbo: ${en(`${key} ${p.verb}`)} (${en(p.short)}).`],
    frames: [
      enFrame(`“${p.es}” en inglés es ${en(key)}.`, sentenceView([{ text: key, mark: 'subject' }], p.es)),
      enFrame(`Y con el verbo ${en('to be')}: ${en(`${key} ${p.verb}`)}.`, sentenceView([{ text: key, mark: 'subject' }, { text: p.verb, mark: 'verb' }])),
    ],
  };
}

function buildShort(rng, count) {
  const key = rng.pick(Object.keys(PRONOUNS));
  const p = PRONOUNS[key];
  const long = `${key} ${p.verb}`;
  const wrong = shuffle(rng, ["'m", "'re", "'s"].map((end) => `${key}${end}`)).filter((v) => v !== p.short);
  return {
    id: `contraccion:${key}`,
    form: 'contraccion',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, p.short, wrong, count),
    answer: p.short,
    audio: long,
    repeat: p.short,
    story: `Al hablar, ${en(long)} se junta en una sola palabra. ¿Cuál es?`,
    expression: `${en(long)} = □`,
    theme: null,
    illustration: null,
    hint: `Se quita la primera letra del verbo y se pone un apóstrofo: ${en('am')} → ${en("'m")}, ${en('is')} → ${en("'s")}, ${en('are')} → ${en("'re")}.`,
    hintFrames: [enFrame('El apóstrofo sustituye a la letra que se va.', { kind: 'calc', lines: ["am → 'm", "is → 's", "are → 're"] })],
    steps: [`${en(p.verb)} se convierte en ${en(p.short.slice(p.short.indexOf("'")))}.`, `${en(long)} = ${en(p.short)}.`],
    frames: [
      enFrame(`${en(long)} se junta: ${en(p.short)}.`, { kind: 'calc', lines: [`${long} → ${p.short}`] }),
      enFrame(`Repite conmigo: ${en(p.short)}.`, sentenceView([{ text: p.short, mark: 'subject' }])),
    ],
  };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'pronombre') return buildPronoun(rng, cfg.choices);
  if (form === 'contraccion') return buildShort(rng, cfg.choices);
  return buildSentence(rng, form, cfg.choices);
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Los pronombres 🙋‍♀️',
    paragraphs: [
      `Antes del verbo, quién: ${en('I')} (yo, siempre en mayúscula), ${en('you')} (tú o vosotros), ${en('he')} (él), ${en('she')} (ella), ${en('it')} (una cosa o un animal), ${en('we')} (nosotros), ${en('they')} (ellos o ellas).`,
      `En inglés el sujeto no se puede quitar: “soy de España” es ${en('I am from Spain')}.`,
    ],
    words: Object.entries(PRONOUNS).map(([key, p]) => ({ en: key, es: p.es })),
    frames: [
      enFrame(`${en('I')} es yo. ${en('you')} es tú.`, sentenceView([{ text: 'I', mark: 'subject' }, { text: '·' }, { text: 'you', mark: 'subject' }], 'yo · tú')),
      enFrame(`${en('he')} es él, ${en('she')} es ella, ${en('it')} es una cosa o un animal.`, sentenceView([{ text: 'he', mark: 'subject' }, { text: 'she', mark: 'subject' }, { text: 'it', mark: 'subject' }], 'él · ella · cosa o animal')),
      enFrame(`${en('we')} es nosotros y ${en('they')} es ellos.`, sentenceView([{ text: 'we', mark: 'subject' }, { text: '·' }, { text: 'they', mark: 'subject' }], 'nosotros · ellos')),
    ],
  },
  {
    title: 'Am, is, are 💥',
    paragraphs: [
      `${en('to be')} significa ser y también estar: ${en('I am happy')} (estoy contenta), ${en('I am Spanish')} (soy española).`,
      RULE,
      `Y para la edad también se usa: ${en('I am thirteen')} = tengo trece años.`,
    ],
    words: [{ en: 'I am', es: 'yo soy / estoy' }, { en: 'you are', es: 'tú eres / estás' }, { en: 'she is', es: 'ella es / está' }, { en: 'we are', es: 'nosotros somos' }, { en: 'they are', es: 'ellos son' }],
    frames: [ruleFrame(), whyFrame(SENTENCES[0]), whyFrame(SENTENCES[9])],
  },
  {
    title: "I'm, she's, they're ✂️",
    paragraphs: [`Al hablar se junta todo: ${en("I'm")}, ${en("you're")}, ${en("he's")}, ${en("she's")}, ${en("it's")}, ${en("we're")}, ${en("they're")}.`, `Para decir que no: ${en("I'm not")}, ${en("she isn't")}, ${en("they aren't")}. Para preguntar, el verbo va delante: ${en('Are you thirteen?')}`],
    words: Object.entries(PRONOUNS).map(([key, p]) => ({ en: p.short, es: `${key} ${p.verb}` })),
    frames: [
      enFrame(`${en('I am')} se junta en ${en("I'm")}.`, { kind: 'calc', lines: ["I am → I'm", "she is → she's", "they are → they're"] }),
      enFrame(`Para preguntar: ${en('Are you thirteen?')}`, sentenceView([{ text: 'Are', mark: 'verb' }, { text: 'you', mark: 'subject' }, { text: 'thirteen?' }], '¿Tienes trece años?')),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK,
  title: 'To be: am, is, are',
  emoji: '💥',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
