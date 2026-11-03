// Piezas comunes de los temas de fracciones: dibujos para los vídeos,
// el paso de simplificar y el mínimo común múltiplo explicado.

import { formatFraction, gcd, isIrreducible, lcm, simplify } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';

export const BLOCK = 'Fracciones';
export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };
export const F = formatFraction;

/** Vista de fracciones: items { n, d, shape: 'crepe'|'bar'|'groups', total?, label? }. */
export function fractionView(items, ops = [], note = null) {
  return { kind: 'fraction', items, ops, note };
}

export const crepe = (f, extra = {}) => ({ n: f.n, d: f.d, shape: 'crepe', ...extra });
export const bar = (f, extra = {}) => ({ n: f.n, d: f.d, shape: 'bar', ...extra });

/** Fotograma de simplificar (si hace falta) y el texto del paso. */
export function simplifyStep(f) {
  if (isIrreducible(f)) return { frames: [], step: null };
  const g = gcd(f.n, f.d);
  const s = simplify(f);
  return {
    frames: [frame(`Simplificamos: ${f.n} y ${f.d} se pueden dividir entre ${g}. Queda ${F(s)}.`,
      { kind: 'calc', lines: [`${f.n} ÷ ${g} = ${s.n}`, `${f.d} ÷ ${g} = ${s.d}`, `${F(f)} = ${F(s)}`] })],
    step: `Simplifica dividiendo arriba y abajo entre ${g}: ${F(f)} = ${F(s)}.`,
  };
}

function multiplesUntil(d, m) {
  const list = [];
  for (let k = d; k <= m; k += d) list.push(k);
  return list.join(', ');
}

/** Fotograma del mínimo común múltiplo de dos denominadores. */
export function lcmFrame(d1, d2) {
  const m = lcm(d1, d2);
  return frame(`Buscamos el mínimo común múltiplo de ${d1} y ${d2}: el primer número que está en las dos tablas. Es ${m}.`,
    { kind: 'calc', lines: [`Múltiplos de ${d1}: ${multiplesUntil(d1, m)}`, `Múltiplos de ${d2}: ${multiplesUntil(d2, m)}`, `m.c.m. = ${m}`] });
}

/** Repite el generador hasta que el id no esté entre los recientes. */
export function generator(build) {
  return (rng, level, recentIds = []) => {
    let exercise = build(rng, level);
    for (let tries = 0; tries < 30 && recentIds.includes(exercise.id); tries += 1) exercise = build(rng, level);
    return exercise;
  };
}
