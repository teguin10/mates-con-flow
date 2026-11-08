// Tema de inglés: la ropa (Ahora mismo).

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_NOW, cardsView, en, makeVocabTopic } from './ingles-comun.js';

export const CLOTHES = [
  { en: 'T-shirt', es: 'camiseta', emoji: '👕', accept: ['tshirt', 't shirt'] }, { en: 'jeans', es: 'vaqueros', emoji: '👖' },
  { en: 'trainers', es: 'zapatillas de deporte', emoji: '👟', accept: ['sneakers'] }, { en: 'hoodie', es: 'sudadera con capucha', emoji: '🧥' },
  { en: 'dress', es: 'vestido', emoji: '👗' }, { en: 'skirt', es: 'falda', emoji: '🩱' }, { en: 'jacket', es: 'chaqueta', emoji: '🧥' },
  { en: 'cap', es: 'gorra', emoji: '🧢' }, { en: 'shorts', es: 'pantalón corto', emoji: '🩳' }, { en: 'socks', es: 'calcetines', emoji: '🧦' },
  { en: 'jumper', es: 'jersey', emoji: '🧶', accept: ['sweater'] }, { en: 'boots', es: 'botas', emoji: '🥾' },
];
export const ACCESSORIES = [
  { en: 'glasses', es: 'gafas', emoji: '👓' }, { en: 'bag', es: 'bolso', emoji: '👜' }, { en: 'scarf', es: 'bufanda', emoji: '🧣' },
  { en: 'gloves', es: 'guantes', emoji: '🧤' }, { en: 'watch', es: 'reloj', emoji: '⌚' }, { en: 'earrings', es: 'pendientes', emoji: '💎' },
];

export const topic = makeVocabTopic({
  id: 'ingles-clothes',
  block: BLOCK_NOW,
  title: 'Clothes: la ropa',
  emoji: '👗',
  pools: [CLOTHES, ACCESSORIES],
  contexts: ['🛍️ En una tienda de Londres:', '📸 Tu amiga describe su look en Instagram:', '🏐 Para el entrenamiento de vóley necesitas:'],
  intro: [
    {
      title: 'Clothes 👕',
      paragraphs: [`La ropa. Fíjate: ${en('jeans')}, ${en('shorts')} y ${en('trainers')} siempre van en plural.`],
      words: CLOTHES,
      frames: [
        enFrame(`${en('T-shirt')}, ${en('jeans')}, ${en('trainers')}, ${en('hoodie')}.`, cardsView(CLOTHES.slice(0, 4))),
        enFrame(`${en('dress')}, ${en('skirt')}, ${en('jacket')}, ${en('cap')}.`, cardsView(CLOTHES.slice(4, 8))),
      ],
    },
    {
      title: 'Accessories 👓',
      paragraphs: ['Los complementos.'],
      words: ACCESSORIES,
      frames: [enFrame(`${en('glasses')}, ${en('bag')}, ${en('scarf')}, ${en('watch')}.`, cardsView([ACCESSORIES[0], ACCESSORIES[1], ACCESSORIES[2], ACCESSORIES[4]]))],
    },
  ],
});
