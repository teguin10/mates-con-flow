// Piezas comunes de los temas de inglés. En sus textos, lo que va entre «»
// está en inglés: la interfaz lo marca con lang="en" y la voz lo lee con la
// voz inglesa (enFrame). El español va sin comillas o con “ ”.
//
// Un ejercicio de inglés es como uno de mates, con tres campos más:
// - listen: texto en inglés que suena solo al empezar (no se ve escrito);
// - audio: texto en inglés que se puede escuchar con 🔊;
// - repeat: lo que se pide repetir en voz alta al terminar (escuchar y repetir).
// Las formas de NEEDS_VOICE solo salen si el aparato tiene voz inglesa.

import { enFrame } from '../explain/storyboard.js';

export const SUBJECT = 'ingles';
export const BLOCK = 'Nivel cero · Starter';
export const BLOCK_STARTER2 = 'Nivel básico · Starter 2';
export const BLOCK_DAILY = 'Mi día a día';
export const BLOCK_PLACES = 'Mi casa y mi ciudad';
export const BLOCK_FOOD = 'Comida y habilidades';
export const BLOCK_NOW = 'Ahora mismo';
export const BLOCK_PAST = 'El pasado';
export const BLOCK_FUTURE = 'Comparar y el futuro';
export const LEVEL_NAMES = { 1: 'Warm-up', 2: 'On fire', 3: 'Pro' };
export const NEEDS_VOICE = new Set(['escuchar', 'dictado']);

/** Marca un texto como inglés. */
export const en = (text) => `«${text}»`;

/** Tarjetas con dibujo: items { emoji?, swatch?, en?, es? }; hide: 'en' | 'es' | null. */
export function cardsView(items, { highlight = null, hide = null } = {}) {
  return { kind: 'cards', items, highlight, hide };
}

/** Frase con partes resaltadas: parts [{ text, mark?: 'subject' | 'verb' }], es: traducción. */
export function sentenceView(parts, es = null) {
  return { kind: 'sentence', parts, es };
}

/** Deletreo letra a letra: el texto en español y las letras en inglés. */
export function spellFrame(word) {
  const letters = [...word.toUpperCase()].filter((ch) => /[A-Z]/.test(ch));
  return {
    say: `Se escribe así: ${letters.join(' - ')}.`,
    voice: [{ lang: 'es', text: 'Se escribe así:' }, { lang: 'en', text: `${letters.join(', ')}.` }],
    view: { kind: 'spell', word },
  };
}

export function shuffle(rng, items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/** La respuesta y `count - 1` opciones falsas distintas, desordenadas. */
export function choicesFor(rng, answer, pool, count) {
  const others = shuffle(rng, [...new Set(pool)].filter((v) => v !== answer)).slice(0, count - 1);
  return shuffle(rng, [answer, ...others]);
}

/** Forma al azar según los pesos del nivel, sin las de escuchar si no hay voz inglesa. */
export function pickForm(rng, forms, { listening }) {
  const usable = forms.filter(([form]) => listening || !NEEDS_VOICE.has(form));
  return rng.weighted(usable);
}

/** Repite el generador hasta que el id no esté entre los recientes. opts.listening: hay voz inglesa. */
export function generator(build) {
  return (rng, level, recentIds = [], opts = {}) => {
    const options = { listening: opts.listening !== false };
    let exercise = build(rng, level, options);
    for (let tries = 0; tries < 30 && recentIds.includes(exercise.id); tries += 1) exercise = build(rng, level, options);
    return exercise;
  };
}

export const VOCAB_FORMS = {
  significado: 'Qué significa (inglés → español)',
  traducir: 'Cómo se dice (español → inglés)',
  escuchar: 'Escuchar y elegir',
  escribir: 'Escribir la palabra',
  dictado: 'Escuchar y escribir',
};

const picture = (item) => ({ emoji: item.emoji, swatch: item.swatch });

/**
 * Ejercicio de vocabulario. item { en, es, emoji?, swatch?, accept?, note? };
 * pool: los demás del mismo grupo (para las opciones falsas); context: frase
 * de ambiente que va delante del enunciado.
 */
export function vocabExercise(rng, form, item, pool, { context = '', choices: count = 3 } = {}) {
  const lead = context ? `${context} ` : '';
  const meaning = enFrame(`${en(item.en)} significa “${item.es}”.`, cardsView([item]));
  const repeatFrame = enFrame(`Ahora repite conmigo en voz alta: ${en(item.en)}.`, cardsView([item], { highlight: 0 }));
  const note = item.note ? [item.note] : [];
  const base = {
    id: `${form}:${item.en}`,
    form,
    repeat: item.en,
    theme: null,
    illustration: null,
    steps: [`${en(item.en)} significa “${item.es}”.`, ...note, `Escúchalo con 🔊 y repítelo en voz alta.`],
    frames: [meaning, ...(item.note ? [enFrame(item.note, cardsView([item]))] : []), repeatFrame],
  };
  const spanishChoices = () => choicesFor(rng, item.es, pool.map((p) => p.es), count);
  const englishChoices = () => choicesFor(rng, item.en, pool.map((p) => p.en), count);
  const firstLetter = item.en[0].toLowerCase();
  const letters = item.en.replace(/[^a-z]/gi, '').length;

  if (form === 'significado') {
    return {
      ...base,
      answerType: 'choice',
      choices: spanishChoices(),
      answer: item.es,
      audio: item.en,
      story: `${lead}¿Qué significa ${en(item.en)}?`,
      expression: `${en(item.en)} = □`,
      hint: item.emoji || item.swatch ? 'Fíjate en el dibujo de la pista: es eso.' : `Piensa en cuándo se dice ${en(item.en)}.`,
      hintFrames: [enFrame(`Mira el dibujo: ${en(item.en)} es esto.`, cardsView([item], { hide: 'es' }))],
    };
  }
  if (form === 'traducir') {
    return {
      ...base,
      answerType: 'choice',
      choicesLang: 'en',
      choices: englishChoices(),
      answer: item.en,
      story: `${lead}¿Cómo se dice “${item.es}” en inglés?`,
      expression: `“${item.es}” = □`,
      illustration: cardsView([picture(item)]),
      hint: `Empieza por ${en(firstLetter)}.`,
      hintFrames: [enFrame(`La palabra empieza por ${en(firstLetter)}.`, { kind: 'spell', word: item.en, only: 1 })],
    };
  }
  if (form === 'escuchar') {
    return {
      ...base,
      answerType: 'choice',
      choices: spanishChoices(),
      answer: item.es,
      listen: item.en,
      story: `${lead}Escucha 🔊 y elige qué significa.`,
      expression: '🔊 = □',
      hint: 'Vuelve a escucharlo, y si hace falta, despacio con 🐢.',
      hintFrames: [enFrame(`Escucha otra vez: ${en(item.en)}.`, cardsView([picture(item)]))],
    };
  }
  const written = {
    ...base,
    answerType: 'text',
    answer: item.en,
    accept: item.accept ?? [],
    hint: `Empieza por ${en(firstLetter)} y tiene ${letters} letras.`,
    hintFrames: [enFrame(`Empieza por ${en(firstLetter)} y tiene ${letters} letras.`, { kind: 'spell', word: item.en, only: 1 })],
    frames: [meaning, spellFrame(item.en), repeatFrame],
    steps: [`${en(item.en)} significa “${item.es}”.`, `Se escribe ${en(item.en)}.`, ...note],
  };
  if (form === 'dictado') {
    return { ...written, listen: item.en, story: `${lead}Escucha 🔊 y escríbelo en inglés.`, expression: '🔊 = □', illustration: cardsView([picture(item)]) };
  }
  return { ...written, story: `${lead}Escribe en inglés: “${item.es}”.`, expression: `“${item.es}” = □`, illustration: cardsView([picture(item)]) };
}

/** Une las partes de una frase sin dejar espacio antes de la puntuación. */
export const joinSentence = (...parts) => parts.filter(Boolean).join(' ').replace(/\s+([?.!,])/g, '$1');

/**
 * Hueco en una frase en inglés: «before □ after». o: { id, form, before,
 * after, answer, choices? (botones) o text: true (escribir), accept?, es
 * (traducción), story, rule (texto con «»), ruleLines (para el vídeo), why
 * (por qué va esa respuesta, con «») }.
 */
export function gapExercise(o) {
  const full = joinSentence(o.before, o.answer, o.after);
  const parts = [{ text: o.before ?? '', mark: 'subject' }, { text: o.answer, mark: 'verb' }, { text: o.after ?? '' }].filter((p) => p.text);
  const ruleFrame = enFrame(o.rule, { kind: 'calc', lines: o.ruleLines });
  return {
    id: o.id,
    form: o.form,
    ...(o.cue ? { cue: o.cue } : {}),
    ...(o.text ? { answerType: 'text', accept: o.accept ?? [] } : { answerType: 'choice', choicesLang: 'en', choices: o.choices }),
    answer: o.answer,
    repeat: full,
    story: o.story,
    expression: `${o.before ? `${en(o.before)} ` : ''}□${o.after ? ` ${en(o.after)}` : ''}`,
    theme: null,
    illustration: o.illustration ?? null,
    hint: o.hint ?? o.rule,
    hintFrames: [ruleFrame],
    steps: [o.why, `Queda ${en(full)}${o.es ? ` (“${o.es}”)` : ''}.`],
    frames: [
      ruleFrame,
      enFrame(o.why, sentenceView(parts, o.es)),
      enFrame(`Repite conmigo: ${en(full)}`, sentenceView(parts, o.es)),
    ],
  };
}

/** Escuchar una frase en inglés y elegir su traducción. pool: otras traducciones. */
export function listenExercise(rng, { id, sentence, es, pool, count = 3, why = null }) {
  const parts = [{ text: sentence, mark: 'subject' }];
  return {
    id,
    form: 'escuchar',
    answerType: 'choice',
    choices: choicesFor(rng, es, pool, count),
    answer: es,
    listen: sentence,
    repeat: sentence,
    story: 'Escucha 🔊 la frase y elige qué significa.',
    expression: '🔊 = □',
    theme: null,
    illustration: null,
    hint: 'Escúchala otra vez, despacio con 🐢. Fíjate primero en quién lo hace y en el verbo.',
    hintFrames: [enFrame(`Escucha otra vez: ${en(sentence)}`, sentenceView([{ text: '…', mark: 'subject' }]))],
    steps: [`${en(sentence)} significa “${es}”.`, ...(why ? [why] : [])],
    frames: [enFrame(`${en(sentence)} significa: ${es}`, sentenceView(parts, es))],
  };
}

const VOCAB_LEVELS = {
  1: { choices: 3, forms: [['significado', 4], ['traducir', 3], ['escuchar', 3]] },
  2: { choices: 3, forms: [['traducir', 3], ['escuchar', 2], ['escribir', 3], ['significado', 1]] },
  3: { choices: 4, forms: [['escribir', 4], ['dictado', 3], ['traducir', 1]] },
};

/**
 * Tema de vocabulario completo: pools son grupos de palabras (las opciones
 * falsas salen del mismo grupo); contexts, frases de ambiente; intro, las
 * diapositivas.
 */
export function makeVocabTopic({ id, block, title, emoji, pools, contexts = [], intro }) {
  const build = (rng, level, options) => {
    const cfg = VOCAB_LEVELS[level] ?? VOCAB_LEVELS[1];
    const form = pickForm(rng, cfg.forms, options);
    const pool = rng.pick(pools);
    const context = contexts.length && rng.next() < 0.3 ? rng.pick(contexts) : '';
    return vocabExercise(rng, form, rng.pick(pool), pool, { context, choices: cfg.choices });
  };
  return { id, subject: SUBJECT, block, title, emoji, maxLevel: 3, levelNames: LEVEL_NAMES, forms: VOCAB_FORMS, intro, generate: generator(build) };
}
