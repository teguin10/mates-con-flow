// Tema de inglés: deportes y actividades (Comida y habilidades).

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_FOOD, cardsView, en, makeVocabTopic } from './ingles-comun.js';

export const ACTIVITIES = [
  { en: 'swim', es: 'nadar', emoji: '🏊‍♀️' }, { en: 'dance', es: 'bailar', emoji: '💃' }, { en: 'sing', es: 'cantar', emoji: '🎤' },
  { en: 'cook', es: 'cocinar', emoji: '🧑‍🍳' }, { en: 'draw', es: 'dibujar', emoji: '✏️' }, { en: 'ride a bike', es: 'montar en bici', emoji: '🚲' },
  { en: 'play the guitar', es: 'tocar la guitarra', emoji: '🎸' }, { en: 'skate', es: 'patinar', emoji: '🛹' }, { en: 'run', es: 'correr', emoji: '🏃‍♀️' },
  { en: 'jump', es: 'saltar', emoji: '🦘' }, { en: 'climb', es: 'escalar', emoji: '🧗‍♀️' }, { en: 'speak English', es: 'hablar inglés', emoji: '💬' },
];
export const SPORTS = [
  { en: 'volleyball', es: 'vóley', emoji: '🏐' }, { en: 'football', es: 'fútbol', emoji: '⚽' }, { en: 'basketball', es: 'baloncesto', emoji: '🏀' },
  { en: 'tennis', es: 'tenis', emoji: '🎾' }, { en: 'boxing', es: 'boxeo', emoji: '🥊' }, { en: 'gymnastics', es: 'gimnasia', emoji: '🤸‍♀️' },
  { en: 'cycling', es: 'ciclismo', emoji: '🚴‍♀️' }, { en: 'swimming', es: 'natación', emoji: '🏊' },
];

export const topic = makeVocabTopic({
  id: 'ingles-abilities',
  block: BLOCK_FOOD,
  title: 'Sports: deportes y actividades',
  emoji: '🏐',
  pools: [ACTIVITIES, SPORTS],
  contexts: ['🏐 En el campamento de verano en Inglaterra preguntan:', '📱 Tu amiga te cuenta lo que sabe hacer:', '🎬 En un vídeo de un youtuber inglés:'],
  intro: [
    {
      title: 'Activities 💃',
      paragraphs: ['Cosas que se pueden saber hacer. Las vas a usar con can: «I can swim».'],
      words: ACTIVITIES,
      frames: [
        enFrame(`${en('swim')}, ${en('dance')}, ${en('sing')}, ${en('cook')}.`, cardsView(ACTIVITIES.slice(0, 4))),
        enFrame(`${en('draw')}, ${en('ride a bike')}, ${en('play the guitar')}, ${en('skate')}.`, cardsView(ACTIVITIES.slice(4, 8))),
      ],
    },
    {
      title: 'Sports 🏐',
      paragraphs: [`Los deportes. Ojo: ${en('play volleyball')}, ${en('play football')}… pero ${en('do gymnastics')} y ${en('go swimming')}.`],
      words: SPORTS,
      frames: [
        enFrame(`${en('volleyball')}, ${en('football')}, ${en('basketball')}, ${en('tennis')}.`, cardsView(SPORTS.slice(0, 4))),
        enFrame(`${en('boxing')}, ${en('gymnastics')}, ${en('cycling')}, ${en('swimming')}.`, cardsView(SPORTS.slice(4))),
      ],
    },
  ],
});
