// Piezas comunes de proporcionalidad y porcentajes: dibujos para los vídeos
// (tabla de proporcionalidad y barra de porcentaje).

export { generator, shuffle } from './decimales-comun.js';
export { formatDecimal as D } from '../math/decimal.js';

export const BLOCK = 'Proporcionalidad y porcentajes';
export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };

/**
 * Tabla de proporcionalidad: dos filas (con su nombre) y las columnas de
 * valores; null es la casilla que falta. factor: «× 3» entre filas, si se enseña.
 */
export function tableView(rowNames, top, bottom, factor = null) {
  return { kind: 'table', rowNames, top, bottom, factor };
}

/** Barra del 100 % con una parte rellena: percent (0-100+), label. */
export function percentView(percent, label = null, total = null) {
  return { kind: 'percent', percent, label, total };
}

/** Un entero «bonito» para historias de dinero o cantidades. */
export const nice = (rng, values) => rng.pick(values);
