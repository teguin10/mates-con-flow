// Tema de inglés: la casa, las habitaciones y los muebles (Mi casa y mi ciudad).

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_PLACES, cardsView, en, makeVocabTopic } from './ingles-comun.js';

export const ROOMS = [
  { en: 'kitchen', es: 'cocina', emoji: '🍳' }, { en: 'bathroom', es: 'baño', emoji: '🛁' },
  { en: 'bedroom', es: 'dormitorio', emoji: '🛏️' }, { en: 'living room', es: 'salón', emoji: '🛋️' },
  { en: 'garden', es: 'jardín', emoji: '🌷' }, { en: 'dining room', es: 'comedor', emoji: '🍽️' },
  { en: 'garage', es: 'garaje', emoji: '🚗' }, { en: 'balcony', es: 'balcón', emoji: '🪴' },
];
export const FURNITURE = [
  { en: 'bed', es: 'cama', emoji: '🛏️' }, { en: 'sofa', es: 'sofá', emoji: '🛋️' }, { en: 'table', es: 'mesa', emoji: '🪵' },
  { en: 'chair', es: 'silla', emoji: '🪑' }, { en: 'fridge', es: 'nevera', emoji: '🧊' }, { en: 'wardrobe', es: 'armario', emoji: '🚪' },
  { en: 'lamp', es: 'lámpara', emoji: '💡' }, { en: 'mirror', es: 'espejo', emoji: '🪞' }, { en: 'shower', es: 'ducha', emoji: '🚿' },
  { en: 'window', es: 'ventana', emoji: '🪟' }, { en: 'door', es: 'puerta', emoji: '🚪' }, { en: 'shelf', es: 'estantería', emoji: '📚' },
];

export const topic = makeVocabTopic({
  id: 'ingles-house',
  block: BLOCK_PLACES,
  title: 'My house: casa y muebles',
  emoji: '🏠',
  pools: [ROOMS, FURNITURE],
  contexts: ['🏠 Tu amiga de Londres te enseña su casa por videollamada:', '🧱 En tu casa de Roblox hay:', '🎬 En la casa encantada de la peli de terror:'],
  intro: [
    {
      title: 'Rooms 🏠',
      paragraphs: ['Las habitaciones de la casa. Toca cada una, escúchala y repítela.'],
      words: ROOMS,
      frames: [
        enFrame(`${en('kitchen')}, ${en('bathroom')}, ${en('bedroom')}, ${en('living room')}.`, cardsView(ROOMS.slice(0, 4))),
        enFrame(`${en('garden')}, ${en('dining room')}, ${en('garage')}, ${en('balcony')}.`, cardsView(ROOMS.slice(4))),
      ],
    },
    {
      title: 'Furniture 🛋️',
      paragraphs: [`Los muebles y cosas de casa. Ojo: ${en('furniture')} (muebles) no tiene plural en inglés.`],
      words: FURNITURE,
      frames: [
        enFrame(`${en('bed')}, ${en('sofa')}, ${en('table')}, ${en('chair')}.`, cardsView(FURNITURE.slice(0, 4))),
        enFrame(`${en('fridge')}, ${en('wardrobe')}, ${en('lamp')}, ${en('mirror')}.`, cardsView(FURNITURE.slice(4, 8))),
      ],
    },
  ],
});
