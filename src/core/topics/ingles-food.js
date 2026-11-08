// Tema de inglés: la comida y la bebida (Comida y habilidades).

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_FOOD, cardsView, en, makeVocabTopic } from './ingles-comun.js';

// count: si se puede contar (para el tema de contables e incontables).
export const FOOD = [
  { en: 'apple', es: 'manzana', emoji: '🍎', count: true }, { en: 'banana', es: 'plátano', emoji: '🍌', count: true },
  { en: 'strawberry', es: 'fresa', emoji: '🍓', count: true }, { en: 'egg', es: 'huevo', emoji: '🥚', count: true },
  { en: 'sandwich', es: 'bocadillo', emoji: '🥪', count: true }, { en: 'pancake', es: 'tortita', emoji: '🥞', count: true },
  { en: 'biscuit', es: 'galleta', emoji: '🍪', count: true, accept: ['cookie'] }, { en: 'tomato', es: 'tomate', emoji: '🍅', count: true },
  { en: 'bread', es: 'pan', emoji: '🍞', count: false }, { en: 'cheese', es: 'queso', emoji: '🧀', count: false },
  { en: 'chicken', es: 'pollo', emoji: '🍗', count: false }, { en: 'rice', es: 'arroz', emoji: '🍚', count: false },
  { en: 'pasta', es: 'pasta', emoji: '🍝', count: false }, { en: 'chocolate', es: 'chocolate', emoji: '🍫', count: false },
  { en: 'fish', es: 'pescado', emoji: '🐟', count: false }, { en: 'salad', es: 'ensalada', emoji: '🥗', count: false },
];
export const DRINKS = [
  { en: 'water', es: 'agua', emoji: '💧', count: false }, { en: 'milk', es: 'leche', emoji: '🥛', count: false },
  { en: 'orange juice', es: 'zumo de naranja', emoji: '🧃', count: false }, { en: 'hot chocolate', es: 'chocolate caliente', emoji: '☕', count: false },
  { en: 'milkshake', es: 'batido', emoji: '🥤', count: true },
];

export const topic = makeVocabTopic({
  id: 'ingles-food',
  block: BLOCK_FOOD,
  title: 'Food: comida y bebida',
  emoji: '🍕',
  pools: [FOOD, DRINKS],
  contexts: ['🥞 En la receta de tortitas en inglés pone:', '🛒 En la lista de la compra de tu amiga inglesa:', '🍽️ En el menú de una cafetería de Londres:'],
  intro: [
    {
      title: 'Food 🍕',
      paragraphs: ['La comida. Toca cada palabra, escúchala y repítela. ¿Cuál es tu favorita?'],
      words: FOOD,
      frames: [
        enFrame(`${en('apple')}, ${en('banana')}, ${en('strawberry')}, ${en('egg')}.`, cardsView(FOOD.slice(0, 4))),
        enFrame(`${en('bread')}, ${en('cheese')}, ${en('chicken')}, ${en('rice')}.`, cardsView(FOOD.slice(8, 12))),
        enFrame(`Y lo mejor: ${en('pancakes')} y ${en('chocolate')}.`, cardsView([FOOD[5], FOOD[13]])),
      ],
    },
    {
      title: 'Drinks 🥤',
      paragraphs: ['Las bebidas.'],
      words: DRINKS,
      frames: [enFrame(`${en('water')}, ${en('milk')}, ${en('orange juice')}, ${en('milkshake')}.`, cardsView([DRINKS[0], DRINKS[1], DRINKS[2], DRINKS[4]]))],
    },
  ],
});
