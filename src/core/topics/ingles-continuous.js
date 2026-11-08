// Tema de inglés: el presente continuo (am / is / are + -ing): formarlo,
// ortografía del -ing, negativa y pregunta.

import { enFrame } from '../explain/storyboard.js';
import {
  BLOCK_NOW, LEVEL_NAMES, SUBJECT, choicesFor, en, gapExercise, generator, listenExercise, pickForm, sentenceView,
} from './ingles-comun.js';

const TOPIC_ID = 'ingles-continuous';

// Verbos con su -ing y la regla de ortografía.
export const VERBS = [
  { base: 'play', ing: 'playing', rule: 'add' }, { base: 'watch', ing: 'watching', rule: 'add' }, { base: 'read', ing: 'reading', rule: 'add' },
  { base: 'eat', ing: 'eating', rule: 'add' }, { base: 'sing', ing: 'singing', rule: 'add' }, { base: 'study', ing: 'studying', rule: 'add' },
  { base: 'dance', ing: 'dancing', rule: 'e' }, { base: 'write', ing: 'writing', rule: 'e' }, { base: 'make', ing: 'making', rule: 'e' },
  { base: 'ride', ing: 'riding', rule: 'e' }, { base: 'swim', ing: 'swimming', rule: 'double' }, { base: 'run', ing: 'running', rule: 'double' },
  { base: 'sit', ing: 'sitting', rule: 'double' }, { base: 'get', ing: 'getting', rule: 'double' },
];
const ING_RULES = {
  add: `Casi todos añaden ${en('-ing')}: ${en('play')} → ${en('playing')}.`,
  e: `Si acaba en ${en('-e')}, la ${en('e')} se va: ${en('dance')} → ${en('dancing')}.`,
  double: `Consonante + vocal + consonante: se dobla la última: ${en('swim')} → ${en('swimming')}.`,
};

const SENTENCES = [
  { s: 'I', be: 'am', v: 'watch', c: 'a horror film.', es: 'Estoy viendo una peli de terror.', no: 'No estoy viendo una peli de terror.' },
  { s: 'She', be: 'is', v: 'dance', c: 'to trap music.', es: 'Ella está bailando música trap.', no: 'Ella no está bailando música trap.' },
  { s: 'We', be: 'are', v: 'play', c: 'volleyball.', es: 'Estamos jugando al vóley.', no: 'No estamos jugando al vóley.' },
  { s: 'My dog', be: 'is', v: 'run', c: 'in the park.', es: 'Mi perro está corriendo en el parque.', no: 'Mi perro no está corriendo en el parque.' },
  { s: 'They', be: 'are', v: 'eat', c: 'pancakes.', es: 'Están comiendo tortitas.', no: 'No están comiendo tortitas.' },
  { s: 'He', be: 'is', v: 'write', c: 'a letter.', es: 'Él está escribiendo una carta.', no: 'Él no está escribiendo una carta.' },
  { s: 'My friends', be: 'are', v: 'swim', c: 'in the pool.', es: 'Mis amigas están nadando en la piscina.', no: 'Mis amigas no están nadando en la piscina.' },
  { s: 'You', be: 'are', v: 'read', c: 'my message.', es: 'Estás leyendo mi mensaje.', no: 'No estás leyendo mi mensaje.' },
  { s: 'My mum', be: 'is', v: 'make', c: 'crepes.', es: 'Mi madre está haciendo crepes.', no: 'Mi madre no está haciendo crepes.' },
  { s: 'It', be: 'is', v: 'sing', c: 'a song.', es: 'Está cantando una canción.', no: 'No está cantando una canción.' },
];

export const FORMS = {
  be: 'Am, is o are',
  ing: 'La forma -ing',
  'escribir-ing': 'Escribir la forma -ing',
  negativa: "Negativa (isn't, aren't…)",
  escuchar: 'Escuchar la frase y entenderla',
};

const LEVELS = {
  1: { forms: [['be', 4], ['ing', 3]] },
  2: { forms: [['ing', 2], ['escribir-ing', 3], ['negativa', 2], ['escuchar', 2]] },
  3: { forms: [['escribir-ing', 3], ['negativa', 3], ['be', 1]] },
};

const RULE = `Presente continuo = ${en('am')} / ${en('is')} / ${en('are')} + verbo con ${en('-ing')}. Es lo que está pasando ahora mismo: ${en("I'm watching TV.")}`;
const RULE_LINES = ['I am watching', 'he · she · it is watching', 'you · we · they are watching'];
const verbOf = (base) => VERBS.find((v) => v.base === base);
const wrongIngs = (v) => [`${v.base}ing`, `${v.base.replace(/e$/, '')}ing`, `${v.base}${v.base.at(-1)}ing`, `${v.base}eing`].filter((w) => w !== v.ing);

function build(rng, level, options) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = pickForm(rng, cfg.forms, options);
  const x = rng.pick(SENTENCES);
  const v = verbOf(x.v);
  if (form === 'escuchar') {
    return listenExercise(rng, { id: `escuchar:${x.s}:${x.v}`, sentence: `${x.s} ${x.be} ${v.ing} ${x.c}`, es: x.es, pool: SENTENCES.filter((y) => y !== x).map((y) => y.es) });
  }
  if (form === 'be') {
    return gapExercise({
      id: `be:${x.s}:${x.v}`, form, before: x.s, after: `${v.ing} ${x.c}`, answer: x.be, choices: ['am', 'is', 'are'], es: x.es,
      story: `Completa: “${x.es}”`, rule: RULE, ruleLines: RULE_LINES,
      why: `Con ${en(x.s)} va ${en(x.be)}.`,
    });
  }
  if (form === 'ing' || form === 'escribir-ing') {
    return gapExercise({
      id: `${form}:${x.s}:${x.v}`, form, before: `${x.s} ${x.be}`, after: x.c, answer: v.ing,
      ...(form === 'escribir-ing' ? { text: true } : { choices: choicesFor(rng, v.ing, wrongIngs(v), 3) }),
      es: x.es, story: `Escribe el verbo ${en(v.base)} con ${en('-ing')}: “${x.es}”`, cue: v.base,
      rule: ING_RULES[v.rule], ruleLines: ['play → playing', 'dance → dancing', 'swim → swimming'],
      why: ING_RULES[v.rule],
    });
  }
  const answer = x.be === 'am' ? 'am not' : x.be === 'is' ? "isn't" : "aren't";
  return gapExercise({
    id: `negativa:${x.s}:${x.v}`, form: 'negativa', before: x.s, after: `${v.ing} ${x.c}`, answer,
    choices: x.be === 'am' ? ['am not', "isn't", "aren't"] : ["isn't", "aren't", "don't"],
    es: x.no,
    story: `Ponlo en negativo: “${x.no}”`,
    rule: `Negativa: ${en("I'm not")}, ${en("she isn't")}, ${en("they aren't")} + ${en('-ing')}.`,
    ruleLines: ["I'm not watching", "she isn't watching", "they aren't watching"],
    why: `Con ${en(x.s)}, la negativa es ${en(answer)}.`,
  });
}

export const generate = generator(build);

const INTRO = [
  {
    title: 'Right now! 📸',
    paragraphs: [RULE, `${en('She is dancing.')} = Ella está bailando. ${en('We are playing volleyball.')} = Estamos jugando al vóley.`],
    words: [{ en: "I'm watching TV.", es: 'Estoy viendo la tele.' }, { en: 'She is dancing.', es: 'Está bailando.' }, { en: 'They are eating pancakes.', es: 'Están comiendo tortitas.' }],
    frames: [
      enFrame(RULE, { kind: 'calc', lines: RULE_LINES }),
      enFrame(`${en('She is dancing to trap music.')}`, sentenceView([{ text: 'She', mark: 'subject' }, { text: 'is dancing', mark: 'verb' }, { text: 'to trap music.' }], 'Está bailando música trap.')),
    ],
  },
  {
    title: '-ing: cuidado con la ortografía ✍️',
    paragraphs: [ING_RULES.add, ING_RULES.e, ING_RULES.double],
    words: VERBS.filter((v) => v.rule !== 'add').map((v) => ({ en: `${v.base} → ${v.ing}`, es: v.rule === 'e' ? 'sin e' : 'doble' })),
    frames: [
      enFrame(ING_RULES.e, sentenceView([{ text: 'dance', mark: 'subject' }, { text: '→' }, { text: 'dancing', mark: 'verb' }])),
      enFrame(ING_RULES.double, sentenceView([{ text: 'swim', mark: 'subject' }, { text: '→' }, { text: 'swimming', mark: 'verb' }])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  subject: SUBJECT,
  block: BLOCK_NOW,
  title: 'Present continuous: -ing',
  emoji: '📸',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
