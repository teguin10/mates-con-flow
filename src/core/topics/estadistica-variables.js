// Tema: variables estadísticas (cualitativas y cuantitativas discretas o
// continuas) y población o muestra.

import { frame } from '../explain/storyboard.js';
import { BLOCK, generator, LEVEL_NAMES } from './estadistica-comun.js';

const TOPIC_ID = 'estadistica-variables';

export const FORMS = {
  tipo: 'Cualitativa o cuantitativa',
  'discreta-continua': 'Discreta o continua',
  muestra: 'Población o muestra',
};

const LEVELS = {
  1: { forms: [['tipo', 4], ['muestra', 1]] },
  2: { forms: [['tipo', 2], ['discreta-continua', 3]] },
  3: { forms: [['discreta-continua', 3], ['muestra', 3], ['tipo', 1]] },
};

// kind: 'cualitativa', 'discreta' o 'continua'.
const VARIABLES = [
  { text: 'tu deporte favorito', kind: 'cualitativa' }, { text: 'el color de ojos', kind: 'cualitativa' },
  { text: 'tu serie favorita', kind: 'cualitativa' }, { text: 'la mascota que tienes', kind: 'cualitativa' },
  { text: 'el número de hermanos', kind: 'discreta' }, { text: 'los goles de un partido', kind: 'discreta' },
  { text: 'los seguidores de un youtuber', kind: 'discreta' }, { text: 'las notas de un examen (del 1 al 10, sin decimales)', kind: 'discreta' },
  { text: 'tu altura', kind: 'continua' }, { text: 'el tiempo que tardas en llegar al insti', kind: 'continua' },
  { text: 'la temperatura de hoy', kind: 'continua' }, { text: 'el peso de una mochila', kind: 'continua' },
];

const STUDIES = [
  { text: 'Para saber qué música escuchan los alumnos de tu insti, preguntas a 30 alumnos de distintas clases.', answer: 'Muestra', why: 'Solo preguntas a una parte: es una muestra (la población son todos los alumnos del insti).' },
  { text: 'Para saber la nota media de tu clase, recoges las notas de todos tus compañeros.', answer: 'Población', why: 'Estudias a todos: es la población entera.' },
  { text: 'Para saber el deporte favorito de los españoles, se pregunta a 2000 personas.', answer: 'Muestra', why: 'Solo se pregunta a una parte de los españoles: es una muestra.' },
  { text: 'Tu equipo de vóley apunta la altura de todas sus jugadoras.', answer: 'Población', why: 'Se mide a todas las jugadoras del equipo: es la población.' },
];

function buildType(rng) {
  const v = rng.pick(VARIABLES);
  const answer = v.kind === 'cualitativa' ? 'Cualitativa' : 'Cuantitativa';
  return {
    id: `tipo:${v.text}`,
    form: 'tipo',
    answerType: 'choice',
    choices: ['Cualitativa', 'Cuantitativa'],
    answer,
    expression: '□',
    story: `📊 Haces una encuesta en clase sobre ${v.text}. ¿Qué tipo de variable es?`,
    hint: 'Cuantitativa: se mide o se cuenta con números. Cualitativa: es una cualidad (un nombre, un color…).',
    steps: [`${v.text[0].toUpperCase()}${v.text.slice(1)} ${v.kind === 'cualitativa' ? 'no es un número: es una cualidad' : 'es un número'}.`, `Es ${answer.toLowerCase()}.`],
    frames: [frame(`${v.text[0].toUpperCase()}${v.text.slice(1)} ${v.kind === 'cualitativa' ? 'se responde con una palabra, no con un número: es cualitativa' : 'se responde con un número: es cuantitativa'}.`, { kind: 'calc', lines: ['cualitativa → palabras (rojo, vóley…)', 'cuantitativa → números (3, 1,65…)'] })],
    hintFrames: [frame('¿Se responde con un número o con una palabra?', { kind: 'calc', lines: ['número → cuantitativa', 'palabra → cualitativa'] })],
  };
}

function buildDiscrete(rng) {
  const v = rng.pick(VARIABLES.filter((x) => x.kind !== 'cualitativa'));
  const answer = v.kind === 'discreta' ? 'Discreta' : 'Continua';
  return {
    id: `discreta-continua:${v.text}`,
    form: 'discreta-continua',
    answerType: 'choice',
    choices: ['Discreta', 'Continua'],
    answer,
    expression: '□',
    story: `📏 ${v.text[0].toUpperCase()}${v.text.slice(1)} es una variable cuantitativa. ¿Es discreta o continua?`,
    hint: 'Discreta: se cuenta y salen números enteros (0, 1, 2…). Continua: se mide y puede tener cualquier valor con decimales (1,65 m).',
    steps: [`${v.kind === 'discreta' ? 'Se cuenta: valores enteros' : 'Se mide: puede tener decimales'}.`, `Es ${answer.toLowerCase()}.`],
    frames: [frame(v.kind === 'discreta' ? 'Se cuenta y solo puede ser 0, 1, 2…: es discreta.' : 'Se mide y puede valer cualquier número con decimales: es continua.', { kind: 'calc', lines: ['discreta → se cuenta (2 hermanos)', 'continua → se mide (1,63 m)'] })],
    hintFrames: [frame('¿Se cuenta o se mide?', { kind: 'calc', lines: ['contar → discreta', 'medir → continua'] })],
  };
}

function buildSample(rng) {
  const st = rng.pick(STUDIES);
  return {
    id: `muestra:${st.text.slice(0, 30)}`,
    form: 'muestra',
    answerType: 'choice',
    choices: ['Población', 'Muestra'],
    answer: st.answer,
    expression: '□',
    story: `🔎 ${st.text} ¿Se estudia la población entera o una muestra?`,
    hint: 'La población es el grupo entero que se quiere estudiar; la muestra, una parte de ese grupo.',
    steps: [st.why],
    frames: [frame(st.why, { kind: 'calc', lines: ['población → todos', 'muestra → una parte'] })],
    hintFrames: [frame('¿Se pregunta a todos o solo a una parte?', { kind: 'calc', lines: ['todos → población', 'una parte → muestra'] })],
  };
}

function build(rng, level) {
  const cfg = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(cfg.forms);
  const ex = form === 'tipo' ? buildType(rng) : form === 'discreta-continua' ? buildDiscrete(rng) : buildSample(rng);
  return { topicId: TOPIC_ID, level, theme: 'estadistica', illustration: null, ...ex };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Variables estadísticas',
    paragraphs: [
      'Una variable es lo que se pregunta en una encuesta. Es cualitativa si la respuesta es una palabra (el deporte favorito) y cuantitativa si es un número (los hermanos que tienes).',
      'Las cuantitativas son discretas si se cuentan (0, 1, 2 hermanos) y continuas si se miden y pueden tener decimales (1,63 m).',
      'La población es el grupo entero; si solo preguntas a una parte, eso es una muestra.',
    ],
    frames: [
      frame('Deporte favorito: se responde con una palabra. Es cualitativa.', { kind: 'calc', lines: ['vóley · fútbol · boxeo'] }),
      frame('Número de hermanos: se cuenta. Cuantitativa discreta.', { kind: 'calc', lines: ['0 · 1 · 2 · 3'] }),
      frame('Altura: se mide. Cuantitativa continua.', { kind: 'calc', lines: ['1,58 m · 1,63 m · 1,70 m'] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: 'Variables estadísticas',
  emoji: '📊',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
