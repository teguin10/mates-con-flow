// Decimales positivos con aritmética exacta (ADR 0003): un decimal es una
// fracción { n, d } (3,45 = 345/100), así que se suma, resta, multiplica y
// divide con fraction.js sin errores de coma flotante. Se escriben con coma.

import { simplify } from './fraction.js';

const pow10 = (k) => 10 ** k;

/** «3,45» o «3.45» (también «5», «,5» y «5,»). Devuelve null si no es un decimal válido. */
export function parseDecimal(text) {
  const s = typeof text === 'string' ? text.replace(/\s+/g, '') : '';
  const match = /^(\d{0,7})(?:[.,](\d{0,6}))?$/.exec(s);
  if (!match || (match[1] === '' && !match[2])) return null;
  const decimals = match[2] ?? '';
  return { n: Number(`${match[1] || '0'}${decimals}`), d: pow10(decimals.length) };
}

/** Atajo para escribir decimales en el código: dec('3,45'). */
export function dec(text) {
  const value = parseDecimal(text);
  if (!value) throw new RangeError(`No es un decimal: ${text}`);
  return value;
}

/** Cifras decimales que hacen falta para escribirlo exacto, o null si es periódico. */
export function decimalPlaces(f) {
  const s = simplify(f);
  for (let k = 0; k <= 12; k += 1) if ((s.n * pow10(k)) % s.d === 0) return k;
  return null;
}

/** «3,45»; null si la fracción no da un decimal exacto. */
export function formatDecimal(f) {
  const k = decimalPlaces(f);
  if (k === null) return null;
  const s = simplify(f);
  const digits = String((s.n * pow10(k)) / s.d).padStart(k + 1, '0');
  return k === 0 ? digits : `${digits.slice(0, -k)},${digits.slice(-k)}`;
}

/** 'exacto', 'periodico-puro' o 'periodico-mixto'. */
export function decimalType(f) {
  const { d } = simplify(f);
  let rest = d;
  while (rest % 2 === 0) rest /= 2;
  while (rest % 5 === 0) rest /= 5;
  if (rest === 1) return 'exacto';
  return rest === d ? 'periodico-puro' : 'periodico-mixto';
}

/** Redondeo a `places` cifras decimales (desde 5, hacia arriba). */
export function roundTo(f, places) {
  const scaled = f.n * pow10(places);
  const whole = Math.floor(scaled / f.d);
  const up = (scaled - whole * f.d) * 2 >= f.d ? 1 : 0;
  return simplify({ n: whole + up, d: pow10(places) });
}

/** Cifra que ocupa una posición: place 0 = unidades, 1 = décimas, 2 = centésimas… -1 = decenas. */
export function digitAt(f, place) {
  const scaled = Math.floor((f.n * pow10(Math.max(place, 0))) / f.d / pow10(Math.max(-place, 0)));
  return scaled % 10;
}

/** Valor absoluto de la diferencia (para el error absoluto). */
export function distance(a, b) {
  const n = a.n * b.d - b.n * a.d;
  return simplify({ n: Math.abs(n), d: a.d * b.d });
}

export const PLACE_NAMES = { '-1': 'decenas', 0: 'unidades', 1: 'décimas', 2: 'centésimas', 3: 'milésimas' };
