// Tema de inglés: el tiempo atmosférico y las estaciones (Ahora mismo).

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_NOW, cardsView, en, makeVocabTopic, sentenceView } from './ingles-comun.js';

export const WEATHER = [
  { en: 'sunny', es: 'soleado', emoji: '☀️' }, { en: 'rainy', es: 'lluvioso', emoji: '🌧️' }, { en: 'cloudy', es: 'nublado', emoji: '☁️' },
  { en: 'windy', es: 'con viento', emoji: '💨' }, { en: 'snowy', es: 'con nieve', emoji: '❄️' }, { en: 'foggy', es: 'con niebla', emoji: '🌫️' },
  { en: 'stormy', es: 'con tormenta', emoji: '⛈️' }, { en: 'hot', es: 'calor', emoji: '🥵' }, { en: 'cold', es: 'frío', emoji: '🥶' },
  { en: 'warm', es: 'templado', emoji: '🌤️' },
];
export const SEASONS = [
  { en: 'spring', es: 'primavera', emoji: '🌸' }, { en: 'summer', es: 'verano', emoji: '🏖️' },
  { en: 'autumn', es: 'otoño', emoji: '🍂', accept: ['fall'] }, { en: 'winter', es: 'invierno', emoji: '⛄' },
];

export const topic = makeVocabTopic({
  id: 'ingles-weather',
  block: BLOCK_NOW,
  title: 'Weather: el tiempo',
  emoji: '🌦️',
  pools: [WEATHER, SEASONS],
  contexts: ['📺 En el parte del tiempo de la tele inglesa:', '📱 Tu amiga de Londres te escribe:', '🏐 Antes del partido al aire libre:'],
  intro: [
    {
      title: "What's the weather like? 🌦️",
      paragraphs: [`Para preguntar qué tiempo hace: ${en("What's the weather like?")} Y se contesta con ${en("It's")}: ${en("It's sunny.")} ${en("It's cold.")}`],
      words: WEATHER,
      frames: [
        enFrame(`${en("What's the weather like?")}`, sentenceView([{ text: "What's the weather like?", mark: 'verb' }], '¿Qué tiempo hace?')),
        enFrame(`${en('sunny')}, ${en('rainy')}, ${en('cloudy')}, ${en('windy')}.`, cardsView(WEATHER.slice(0, 4))),
        enFrame(`${en("It's sunny and hot.")}`, sentenceView([{ text: "It's", mark: 'subject' }, { text: 'sunny and hot.', mark: 'verb' }], 'Hace sol y calor.')),
      ],
    },
    {
      title: 'Seasons 🍂',
      paragraphs: [`Las estaciones. En británico, otoño es ${en('autumn')}; en americano, ${en('fall')}.`],
      words: SEASONS,
      frames: [enFrame(`${en('spring')}, ${en('summer')}, ${en('autumn')}, ${en('winter')}.`, cardsView(SEASONS))],
    },
  ],
});
