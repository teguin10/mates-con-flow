// Textos de los temas de inglés: lo que va entre «» se pinta como inglés
// (lang="en", para que los lectores de pantalla lo pronuncien bien) y sin las
// comillas. Lo demás queda tal cual.

import { h } from './dom.js';

export function enText(text) {
  return text.split(/(«[^»]*»)/).filter((piece) => piece !== '').map((piece) => (piece.startsWith('«')
    ? h('span', { class: 'en', lang: 'en' }, piece.slice(1, -1))
    : piece));
}
