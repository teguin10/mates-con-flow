// Tema de inglés: el presente simple en afirmativa. Con he, she, it el
// verbo lleva -s (plays), -es (watches) o -ies (studies); has, goes y does.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_DAILY, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, listenExercise, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-present-simple';

// Verbos con su forma de 3.ª persona y la regla que sigue.
export const VERBS = [
  { base: 'play', third: 'plays', rule: 's', es: 'jugar' }, { base: 'like', third: 'likes', rule: 's', es: 'gustar' },
  { base: 'get up', third: 'gets up', rule: 's', es: 'levantarse' }, { base: 'eat', third: 'eats', rule: 's', es: 'comer' },
  { base: 'love', third: 'loves', rule: 's', es: 'encantar' }, { base: 'live', third: 'lives', rule: 's', es: 'vivir' },
  { base: 'watch', third: 'watches', rule: 'es', es: 'ver' }, { base: 'brush', third: 'brushes', rule: 'es', es: 'cepillar' },
  { base: 'finish', third: 'finishes', rule: 'es', es: 'terminar' }, { base: 'go', third: 'goes', rule: 'es', es: 'ir' },
  { base: 'do', third: 'does', rule: 'es', es: 'hacer' }, { base: 'study', third: 'studies', rule: 'ies', es: 'estudiar' },
  { base: 'fly', third: 'flies', rule: 'ies', es: 'volar' }, { base: 'have', third: 'has', rule: 'irr', es: 'tener' },
];

// Frases: sujeto (si es 3.ª persona), verbo y el resto.
const SENTENCES = [
  { s: 'She', third: true, v: 'play', c: 'volleyball after school.', es: 'Ella juega al vóley después de clase.' },
  { s: 'I', third: false, v: 'watch', c: 'horror films at the weekend.', es: 'Veo pelis de terror el fin de semana.' },
  { s: 'My brother', third: true, v: 'watch', c: 'YouTube videos every day.', es: 'Mi hermano ve vídeos de YouTube cada día.' },
  { s: 'We', third: false, v: 'have', c: 'English on Mondays.', es: 'Tenemos inglés los lunes.' },
  { s: 'Leo', third: true, v: 'have', c: 'boxing class on Fridays.', es: 'Leo tiene clase de boxeo los viernes.' },
  { s: 'My mum', third: true, v: 'go', c: 'to work by bus.', es: 'Mi madre va a trabajar en autobús.' },
  { s: 'They', third: false, v: 'live', c: 'in Fuenlabrada.', es: 'Viven en Fuenlabrada.' },
  { s: 'My cousin', third: true, v: 'study', c: 'in the library.', es: 'Mi prima estudia en la biblioteca.' },
  { s: 'He', third: true, v: 'do', c: 'his homework in the afternoon.', es: 'Él hace los deberes por la tarde.' },
  { s: 'You', third: false, v: 'love', c: 'trap music.', es: 'Te encanta la música trap.' },
  { s: 'The cat', third: true, v: 'eat', c: 'fish.', es: 'El gato come pescado.' },
  { s: 'My dad', third: true, v: 'finish', c: 'work at six.', es: 'Mi padre termina de trabajar a las seis.' },
  { s: 'Sara', third: true, v: 'brush', c: 'her teeth after dinner.', es: 'Sara se lava los dientes después de cenar.' },
  { s: 'My friends', third: false, v: 'get up', c: 'at seven.', es: 'Mis amigas se levantan a las siete.' },
];

const RULES = {
  s: `Casi todos añaden ${en('-s')}: ${en('play')} → ${en('plays')}.`,
  es: `Si acaba en ${en('-sh')}, ${en('-ch')}, ${en('-o')}, ${en('-s')} o ${en('-x')}, añade ${en('-es')}: ${en('watch')} → ${en('watches')}, ${en('go')} → ${en('goes')}.`,
  ies: `Consonante + ${en('-y')} cambia a ${en('-ies')}: ${en('study')} → ${en('studies')}.`,
  irr: `${en('have')} es especial: con ${en('he')}, ${en('she')} o ${en('it')} es ${en('has')}.`,
};
const MAIN_RULE = `En presente simple, con ${en('he')}, ${en('she')} o ${en('it')} el verbo lleva ${en('-s')}. Con los demás, se queda igual.`;
const MAIN_LINES = ['I · you · we · they → play', 'he · she · it → plays'];

export const FORMS = {
  completar: 'Elegir la forma del verbo',
  escribir: 'Escribir la forma del verbo',
  'tercera-persona': 'Reglas de la -s (watches, studies, has)',
  escuchar: 'Escuchar la frase y entenderla',
};

const LEVELS = {
  1: { forms: [['completar', 5], ['escuchar', 2]] },
  2: { forms: [['completar', 2], ['tercera-persona', 3], ['escribir', 3], ['escuchar', 2]] },
  3: { forms: [['escribir', 4], ['tercera-persona', 3], ['escuchar', 1]] },
};

const verbOf = (base) => VERBS.find((v) => v.base === base);

/** Le pone una terminación a la primera palabra («get up» + s → «gets up»). */
const inflect = (base, end) => {
  const [first, ...rest] = base.split(' ');
  return [`${first}${end}`, ...rest].join(' ');
};

/** Terceras personas falsas típicas: la regla equivocada. */
function wrongThirds(verb) {
  const first = verb.base.split(' ')[0];
  const list = [inflect(verb.base, 's'), inflect(verb.base, 'es')];
  if (first.endsWith('y')) list.push(inflect(verb.base.replace(/y(\b|$)/, ''), 'ies'));
  if (verb.rule === 'irr') list.push('haves');
  return [...new Set(list)].filter((w) => w !== verb.third);
}

function buildSentence(rng, form) {
  const x = rng.pick(SENTENCES);
  const verb = verbOf(x.v);
  const answer = x.third ? verb.third : verb.base;
  const why = x.third
    ? `${en(x.s)} es ${en('he')}, ${en('she')} o ${en('it')}: el verbo lleva ${en('-s')}. ${RULES[verb.rule]}`
    : `${en(x.s)} no es ${en('he')}, ${en('she')} ni ${en('it')}: el verbo se queda igual, ${en(verb.base)}.`;
  return gapExercise({
    id: `${form}:${x.s}:${x.v}`,
    form,
    before: x.s,
    after: x.c,
    answer,
    ...(form === 'escribir' ? { text: true } : { choices: choicesFor(rng, answer, [verb.base, verb.third, ...wrongThirds(verb)], 3) }),
    es: x.es,
    story: form === 'escribir' ? `Escribe el verbo ${en(verb.base)} en presente: “${x.es}”` : `Elige el verbo en presente: “${x.es}”`,
    cue: verb.base,
    rule: MAIN_RULE,
    ruleLines: MAIN_LINES,
    why,
  });
}

function buildThird(rng, level) {
  const pool = VERBS.filter((v) => level === 2 ? true : v.rule !== 's');
  const verb = rng.pick(pool);
  const wrong = [...wrongThirds(verb), verb.base];
  const subject = rng.pick(['She', 'He', 'My friend']);
  return {
    id: `tercera:${verb.base}`,
    form: 'tercera-persona',
    answerType: 'choice',
    choicesLang: 'en',
    choices: choicesFor(rng, verb.third, wrong, 3),
    answer: verb.third,
    audio: null,
    repeat: `${subject} ${verb.third}.`,
    story: `✍️ ${en(`I ${verb.base}`)} (${verb.es}). ¿Y con ${en(subject)}?`,
    expression: `${en(subject)} □`,
    theme: null,
    illustration: null,
    hint: `${RULES.s} ${RULES.es} ${RULES.ies}`,
    hintFrames: [enFrame(RULES[verb.rule], sentenceView([{ text: verb.base, mark: 'subject' }, { text: '→' }, { text: '?', mark: 'verb' }]))],
    steps: [RULES[verb.rule], `${en(verb.base)} → ${en(verb.third)}.`],
    frames: [
      enFrame(RULES[verb.rule], sentenceView([{ text: verb.base, mark: 'subject' }, { text: '→' }, { text: verb.third, mark: 'verb' }])),
      enFrame(`Repite conmigo: ${en(`${subject} ${verb.third}`)}.`, sentenceView([{ text: subject, mark: 'subject' }, { text: verb.third, mark: 'verb' }])),
    ],
  };
}

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  if (form === 'escuchar') {
    const x = rng.pick(SENTENCES);
    const verb = verbOf(x.v);
    return listenExercise(rng, { id: `escuchar:${x.s}:${x.v}`, sentence: `${x.s} ${x.third ? verb.third : verb.base} ${x.c}`, es: x.es, pool: SENTENCES.filter((y) => y !== x).map((y) => y.es) });
  }
  if (form === 'tercera-persona') return buildThird(rng, level);
  return buildSentence(rng, form);
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Present simple 🔁',
    paragraphs: [
      'El presente simple sirve para lo que haces siempre o a menudo: rutinas, gustos, horarios.',
      MAIN_RULE,
    ],
    words: [{ en: 'I play volleyball.', es: 'Juego al vóley.' }, { en: 'She plays volleyball.', es: 'Ella juega al vóley.' }, { en: 'They live in Spain.', es: 'Viven en España.' }],
    frames: [
      enFrame(MAIN_RULE, { kind: 'calc', lines: MAIN_LINES }),
      enFrame(`${en('She plays volleyball after school.')}`, sentenceView([{ text: 'She', mark: 'subject' }, { text: 'plays', mark: 'verb' }, { text: 'volleyball after school.' }], 'Ella juega al vóley después de clase.')),
    ],
  },
  {
    title: '-s, -es, -ies ✍️',
    paragraphs: [RULES.s, RULES.es, RULES.ies, RULES.irr],
    words: VERBS.filter((v) => v.rule !== 's').map((v) => ({ en: `${v.base} → ${v.third}`, es: v.es })),
    frames: [
      enFrame(RULES.es, sentenceView([{ text: 'watch', mark: 'subject' }, { text: '→' }, { text: 'watches', mark: 'verb' }])),
      enFrame(RULES.ies, sentenceView([{ text: 'study', mark: 'subject' }, { text: '→' }, { text: 'studies', mark: 'verb' }])),
      enFrame(RULES.irr, sentenceView([{ text: 'have', mark: 'subject' }, { text: '→' }, { text: 'has', mark: 'verb' }])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_DAILY,
  title: 'Present simple: she plays',
  emoji: '🔁',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
