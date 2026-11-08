// Tema de inglés: animales y profesiones (Comparar y el futuro).

import { enFrame } from '../explain/storyboard.js';
import { BLOCK_FUTURE, cardsView, en, makeVocabTopic } from './ingles-comun.js';

export const ANIMALS = [
  { en: 'monkey', es: 'mono', emoji: '🐒' }, { en: 'elephant', es: 'elefante', emoji: '🐘' }, { en: 'lion', es: 'león', emoji: '🦁' },
  { en: 'tiger', es: 'tigre', emoji: '🐅' }, { en: 'giraffe', es: 'jirafa', emoji: '🦒' }, { en: 'snake', es: 'serpiente', emoji: '🐍' },
  { en: 'horse', es: 'caballo', emoji: '🐴' }, { en: 'rabbit', es: 'conejo', emoji: '🐰' }, { en: 'bird', es: 'pájaro', emoji: '🐦' },
  { en: 'shark', es: 'tiburón', emoji: '🦈' }, { en: 'bear', es: 'oso', emoji: '🐻' }, { en: 'mouse', es: 'ratón', emoji: '🐭' },
];
export const JOBS = [
  { en: 'doctor', es: 'médico o médica', emoji: '🩺' }, { en: 'teacher', es: 'profesor o profesora', emoji: '👩‍🏫' },
  { en: 'vet', es: 'veterinario o veterinaria', emoji: '🐾' }, { en: 'chef', es: 'cocinero o cocinera', emoji: '👩‍🍳' },
  { en: 'artist', es: 'artista', emoji: '🎨' }, { en: 'singer', es: 'cantante', emoji: '🎤' }, { en: 'police officer', es: 'policía', emoji: '👮‍♀️' },
  { en: 'firefighter', es: 'bombero o bombera', emoji: '🚒' }, { en: 'nurse', es: 'enfermero o enfermera', emoji: '💉' },
  { en: 'engineer', es: 'ingeniero o ingeniera', emoji: '⚙️' },
];

export const topic = makeVocabTopic({
  id: 'ingles-animals-jobs',
  block: BLOCK_FUTURE,
  title: 'Animals y jobs',
  emoji: '🐒',
  pools: [ANIMALS, JOBS],
  contexts: ['🌍 En un documental de la BBC sale:', '🎤 En una entrevista, una youtuber cuenta lo que quiere ser:', '🦁 En el zoo de Londres hay:'],
  intro: [
    {
      title: 'Animals 🐒',
      paragraphs: ['Animales. ¿Cuál es tu favorito?'],
      words: ANIMALS,
      frames: [
        enFrame(`${en('monkey')}, ${en('elephant')}, ${en('lion')}, ${en('tiger')}.`, cardsView(ANIMALS.slice(0, 4))),
        enFrame(`${en('giraffe')}, ${en('snake')}, ${en('horse')}, ${en('rabbit')}.`, cardsView(ANIMALS.slice(4, 8))),
      ],
    },
    {
      title: 'Jobs 🩺',
      paragraphs: [`Profesiones. Para decir lo que quieres ser: ${en('I want to be a vet.')}`],
      words: JOBS,
      frames: [
        enFrame(`${en('doctor')}, ${en('teacher')}, ${en('vet')}, ${en('chef')}.`, cardsView(JOBS.slice(0, 4))),
        enFrame(`${en('I want to be a singer.')}`, cardsView([JOBS[5]])),
      ],
    },
  ],
});
