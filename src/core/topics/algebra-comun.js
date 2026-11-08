// Piezas comunes de álgebra: escribir monomios y expresiones lineales con el
// signo menos tipográfico, y la balanza de las ecuaciones.

import { sup } from '../math/numbers.js';

export { generator, shuffle } from './decimales-comun.js';
export const BLOCK = 'Álgebra y ecuaciones';
export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };
export const MINUS = '−';

/** Número con signo menos tipográfico: −3. */
export const num = (n) => (n < 0 ? `${MINUS}${-n}` : String(n));

/** Monomio: (3, 'x') → «3x»; (1, 'x') → «x»; (−1, 'x', 2) → «−x²»; (5, '') → «5». */
export function mono(c, v = 'x', e = 1) {
  if (!v || e === 0) return num(c);
  const lit = `${v}${e === 1 ? '' : sup(e)}`;
  if (c === 1) return lit;
  if (c === -1) return `${MINUS}${lit}`;
  return `${num(c)}${lit}`;
}

/** Suma de términos con sus signos: [[3,'x'], [−2,'']] → «3x − 2». Los ceros no salen. */
export function sum(terms) {
  const parts = terms.filter(([c]) => c !== 0);
  if (parts.length === 0) return '0';
  return parts.map(([c, v = '', e = 1], i) => {
    const text = mono(Math.abs(c), v, e);
    if (i === 0) return c < 0 ? `${MINUS}${text}` : text;
    return `${c < 0 ? MINUS : '+'} ${text}`;
  }).join(' ');
}

/** «3x + 2» (a·x + b). */
export const linear = (a, b) => sum([[a, 'x'], [b, '']]);

/** Balanza de una ecuación: lo de cada lado y si está equilibrada. */
export function balanceView(left, right, note = null) {
  return { kind: 'balance', left, right, note };
}
