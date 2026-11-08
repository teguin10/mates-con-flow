// Piezas comunes de geometría: la vista de una figura dibujada y π.

import { fr } from '../math/fraction.js';

export { generator, shuffle } from './decimales-comun.js';
export { formatDecimal as D } from '../math/decimal.js';
export const BLOCK = 'Geometría y medida';
export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };

/** π como en 1º ESO: 3,14. */
export const PI = fr(314, 100);

/**
 * Figura: shape ('rect', 'square', 'triangle', 'rhombus', 'trapezoid',
 * 'circle', 'right', 'angle', 'polygon', 'cube', 'prism', 'pyramid',
 * 'cylinder', 'cone', 'sphere'); labels son los textos de cada medida.
 */
export function shapeView(shape, labels = {}, extra = {}) {
  return { kind: 'shape', shape, labels, ...extra };
}
