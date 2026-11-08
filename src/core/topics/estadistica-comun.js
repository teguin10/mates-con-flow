// Piezas comunes de estadística: diagrama de barras y cálculos de datos.

export { generator, shuffle } from './decimales-comun.js';
export { formatDecimal as D } from '../math/decimal.js';
export const BLOCK = 'Estadística y probabilidad';
export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };

/** Diagrama de barras: bars [{ label, value }], highlight (índice) y nota. */
export function barsView(bars, highlight = null, note = null) {
  return { kind: 'bars', bars, highlight, note };
}

/** Cuenta cuántas veces sale cada valor, en el orden de `labels`. */
export const countBy = (data, labels) => labels.map((l) => data.filter((d) => d === l).length);
