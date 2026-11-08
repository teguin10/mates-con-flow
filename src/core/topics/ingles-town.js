// Tema de inglés: los sitios de la ciudad (Mi casa y mi ciudad).

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_PLACES, cardsView, en, makeVocabTopic } from './ingles-comun.js';

export const PLACES = [
  { en: 'park', es: 'parque', emoji: '🌳' }, { en: 'cinema', es: 'cine', emoji: '🎬' },
  { en: 'library', es: 'biblioteca', emoji: '📚' }, { en: 'supermarket', es: 'supermercado', emoji: '🛒' },
  { en: 'hospital', es: 'hospital', emoji: '🏥' }, { en: 'bank', es: 'banco', emoji: '🏦' },
  { en: 'café', es: 'cafetería', emoji: '☕', accept: ['cafe'] }, { en: 'sports centre', es: 'polideportivo', emoji: '🏐', accept: ['sports center'] },
  { en: 'shopping centre', es: 'centro comercial', emoji: '🛍️', accept: ['shopping center', 'mall'] }, { en: 'bus station', es: 'estación de autobuses', emoji: '🚌' },
  { en: 'museum', es: 'museo', emoji: '🏛️' }, { en: 'chemist’s', es: 'farmacia', emoji: '💊', accept: ["chemist's", 'chemists', 'pharmacy'] },
];
export const STREET = [
  { en: 'street', es: 'calle', emoji: '🛣️' }, { en: 'square', es: 'plaza', emoji: '⛲' }, { en: 'bridge', es: 'puente', emoji: '🌉' },
  { en: 'traffic lights', es: 'semáforo', emoji: '🚦' }, { en: 'corner', es: 'esquina', emoji: '↩️' }, { en: 'zebra crossing', es: 'paso de cebra', emoji: '🦓' },
];

export const topic = makeVocabTopic({
  id: 'ingles-town',
  block: BLOCK_PLACES,
  title: 'My town: la ciudad',
  emoji: '🏙️',
  pools: [PLACES, STREET],
  contexts: ['🗺️ Estás de viaje en Londres y buscas:', '📱 Tu amiga te dice dónde quedar:', '🚌 En el autobús anuncian la parada:'],
  intro: [
    {
      title: 'In my town 🏙️',
      paragraphs: ['Los sitios de la ciudad. Fíjate: en inglés británico se escribe «centre» (sports centre, shopping centre).'],
      words: PLACES,
      frames: [
        enFrame(`${en('park')}, ${en('cinema')}, ${en('library')}, ${en('supermarket')}.`, cardsView(PLACES.slice(0, 4))),
        enFrame(`${en('sports centre')}, ${en('shopping centre')}, ${en('bus station')}.`, cardsView(PLACES.slice(7, 10))),
      ],
    },
    {
      title: 'In the street 🚦',
      paragraphs: ['Palabras para orientarte por la calle.'],
      words: STREET,
      frames: [enFrame(`${en('street')}, ${en('square')}, ${en('traffic lights')}, ${en('zebra crossing')}.`, cardsView([STREET[0], STREET[1], STREET[3], STREET[5]]))],
    },
  ],
});
