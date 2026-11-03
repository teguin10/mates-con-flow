import { topic as comparar } from './comparar.js';
import { topic as enterosSumaResta } from './enteros-suma-resta.js';
import { topic as multiplicarDividir } from './multiplicar-dividir.js';
import { topic as combinadas } from './combinadas.js';
import { topic as fraccionesQueEs } from './fracciones-que-es.js';
import { topic as fraccionesDeUnNumero } from './fracciones-de-un-numero.js';
import { topic as fraccionesSumaResta } from './fracciones-suma-resta.js';
import { topic as fraccionesMultDiv } from './fracciones-mult-div.js';

// En el orden aconsejado para aprenderlos, agrupados por bloque.
export const TOPICS = [
  comparar, enterosSumaResta, multiplicarDividir, combinadas,
  fraccionesQueEs, fraccionesDeUnNumero, fraccionesSumaResta, fraccionesMultDiv,
];

/** Los bloques en orden, cada uno con sus temas: [{ name, topics }]. */
export const BLOCKS = TOPICS.reduce((blocks, t) => {
  const last = blocks.at(-1);
  if (last?.name === t.block) last.topics.push(t);
  else blocks.push({ name: t.block, topics: [t] });
  return blocks;
}, []);

export const UPCOMING = [
  { title: 'Decimales', emoji: '🎧' },
  { title: 'Proporcionalidad y porcentajes', emoji: '📊' },
  { title: 'Repaso de primaria', emoji: '✏️' },
];

export function getTopic(id) {
  return TOPICS.find((t) => t.id === id) ?? null;
}

// El tema aconsejado entre los dados (por defecto, todos): el primero que aún
// no llega al nivel 2; si todos llegan, el primero sin dominar; si todos
// están dominados, ninguno. La portada lo pide por bloque.
export function recommendedTopic(doc, topics = TOPICS) {
  const progress = (t) => doc.topics[t.id] ?? { level: 1, mastered: false };
  return topics.find((t) => progress(t).level < 2 && !progress(t).mastered)
    ?? topics.find((t) => !progress(t).mastered)
    ?? null;
}
