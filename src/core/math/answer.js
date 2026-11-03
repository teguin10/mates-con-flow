// Interpretación y comprobación de respuestas numéricas (ADR 0003).
// Una respuesta correcta escrita de otra forma se acepta; una incorrecta
// nunca. Lo que no es un número se marca como "invalid" y no cuenta como fallo.

import { equals, formatFraction, isIrreducible, parseFraction, simplify } from './fraction.js';

const MINUS_SIGNS = /[−‒–—﹣－]/g;
const MINUS = '−';

export function normalizeAnswer(text) {
  if (typeof text !== 'string') return '';
  let s = text.replace(MINUS_SIGNS, '-').replace(/\s+/g, '');
  const wrapped = /^\((.*)\)$/.exec(s);
  if (wrapped) s = wrapped[1];
  return s;
}

export function parseInteger(text) {
  const s = normalizeAnswer(text);
  if (!/^[+-]?\d{1,9}$/.test(s)) return null;
  const value = Number(s);
  return value === 0 ? 0 : value;
}

export function checkInteger(text, expected) {
  const value = parseInteger(text);
  if (value === null) return { status: 'invalid' };
  return { status: value === expected ? 'correct' : 'incorrect', value };
}

export function formatInteger(n) {
  return n < 0 ? `${MINUS}${Math.abs(n)}` : String(n);
}

/**
 * Fracciones: vale cualquier equivalente (6/8 por 3/4, o 2 por 4/2). Si no
 * está simplificada, el resultado lleva simplified con la irreducible para
 * enseñársela. Con mustSimplify (ejercicios de simplificar), una equivalente
 * que aún se puede simplificar es "almost": ni acierto ni fallo.
 */
export function checkFraction(text, expected, { mustSimplify = false } = {}) {
  const value = parseFraction(normalizeAnswer(text));
  if (value === null) return { status: 'invalid' };
  if (!equals(value, expected)) return { status: 'incorrect', value };
  if (isIrreducible(value)) return { status: 'correct', value };
  if (mustSimplify) return { status: 'almost', value };
  return { status: 'correct', value, simplified: simplify(value) };
}

// Comprueba la respuesta de un ejercicio según su tipo: 'integer' (teclado),
// 'fraction' (teclado de fracción) o 'choice' (botones: la respuesta tiene que
// ser una de las opciones).
export function checkExerciseAnswer(exercise, input) {
  if (exercise.answerType === 'choice') {
    if (!exercise.choices.includes(input)) return { status: 'invalid' };
    return { status: input === exercise.answer ? 'correct' : 'incorrect', value: input };
  }
  if (exercise.answerType === 'fraction') {
    return checkFraction(input, exercise.answer, { mustSimplify: exercise.mustSimplify === true });
  }
  return checkInteger(input, exercise.answer);
}

/** La respuesta correcta como texto, para enseñarla. */
export function formatAnswer(exercise) {
  if (exercise.answerType === 'fraction') return formatFraction(exercise.answer);
  if (typeof exercise.answer === 'number') return formatInteger(exercise.answer);
  return String(exercise.answer);
}
