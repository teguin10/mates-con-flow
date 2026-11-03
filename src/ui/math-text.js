// Escribe una expresión con las fracciones en vertical (numerador encima del
// denominador, como en el cuaderno). El hueco □ se sustituye por la casilla
// de respuesta, esté suelto o dentro de una fracción.

import { h } from './dom.js';

const TOKEN = /(\d+|□)\/(\d+|□)|□/g;

export function mathText(text, slot = null) {
  const nodes = [];
  const part = (value) => (value === '□' ? slot : String(value));
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const before = text.slice(last, match.index).trim();
    if (before) nodes.push(h('span', { class: 'math-op' }, before));
    if (match[1] === undefined) nodes.push(slot);
    else {
      nodes.push(h('span', { class: 'frac' },
        h('span', { class: 'frac-num' }, part(match[1])),
        h('span', { class: 'frac-den' }, part(match[2]))));
    }
    last = match.index + match[0].length;
  }
  const rest = text.slice(last).trim();
  if (rest) nodes.push(h('span', { class: 'math-op' }, rest));
  return nodes;
}
