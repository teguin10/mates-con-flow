// Piezas comunes de funciones: la vista del plano cartesiano y escribir
// coordenadas y rectas.

export { generator, shuffle } from './decimales-comun.js';
export { linear, num, MINUS } from './algebra-comun.js';
export const BLOCK = 'Funciones y gráficas';
export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };

/** Plano: points [{ x, y, label?, focus? }], line { a, b }, poly [[x, y]…], min/max de los ejes. */
export function planeView({ points = [], line = null, poly = null, min = -6, max = 6, yMin, yMax, xLabel, yLabel } = {}) {
  return { kind: 'plane', points, line, poly, min, max, yMin: yMin ?? min, yMax: yMax ?? max, xLabel, yLabel };
}

const n = (v) => (v < 0 ? `−${-v}` : String(v));
/** «(3, −2)». */
export const coord = (x, y) => `(${n(x)}, ${n(y)})`;
