// Piezas comunes de los temas de decimales: azar de decimales, dibujos para
// los vídeos (tabla de posiciones, cuentas en columna y redondeo).

import { decimalPlaces, formatDecimal } from '../math/decimal.js';

export const BLOCK = 'Decimales';
export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };
export const D = formatDecimal;

/** Decimal al azar entre min y max (enteros) con exactamente `places` cifras decimales. */
export function randomDecimal(rng, min, max, places) {
  const d = 10 ** places;
  for (;;) {
    const n = rng.int(min * d, max * d);
    if (places === 0 || n % 10 !== 0) return { n, d };
  }
}

/**
 * Tabla de posiciones: rows son decimales escritos («23,47»); highlight, la
 * columna resaltada (0 unidades, 1 décimas, -1 decenas…).
 */
export function placesView(rows, highlight = null, note = null) {
  return { kind: 'places', rows, highlight, note };
}

/** Cuenta en columna con las comas alineadas: lines (escritas), op y result. */
export function columnsView(lines, op, result = null, note = null) {
  return { kind: 'columns', lines, op, result, note };
}

/** Redondeo: un tramo de `low` a `high` con el número `value` y a cuál se acerca. */
export function roundView(low, high, value, closest = null) {
  return { kind: 'round', low, high, value, closest };
}

/** Rellena con ceros para que dos decimales tengan las mismas cifras decimales. */
export function padTo(text, places) {
  const [whole, frac = ''] = text.split(',');
  return places === 0 ? whole : `${whole},${frac.padEnd(places, '0')}`;
}

export const placesOf = (f) => decimalPlaces(f) ?? 0;

export function shuffle(rng, items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/** Repite el generador hasta que el id no esté entre los recientes. */
export function generator(build) {
  return (rng, level, recentIds = []) => {
    let exercise = build(rng, level);
    for (let tries = 0; tries < 30 && recentIds.includes(exercise.id); tries += 1) exercise = build(rng, level);
    return exercise;
  };
}
