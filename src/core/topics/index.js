import { topic as comparar } from './comparar.js';
import { topic as enterosSumaResta } from './enteros-suma-resta.js';
import { topic as multiplicarDividir } from './multiplicar-dividir.js';
import { topic as combinadas } from './combinadas.js';
import { topic as fraccionesQueEs } from './fracciones-que-es.js';
import { topic as fraccionesDeUnNumero } from './fracciones-de-un-numero.js';
import { topic as fraccionesSumaResta } from './fracciones-suma-resta.js';
import { topic as fraccionesMultDiv } from './fracciones-mult-div.js';
import { topic as decimalesLeer } from './decimales-leer.js';
import { topic as decimalesSumaResta } from './decimales-suma-resta.js';
import { topic as decimalesMultDiv } from './decimales-mult-div.js';
import { topic as decimalesFraccionRedondeo } from './decimales-fraccion-redondeo.js';
import { topic as proporcionRazon } from './proporcion-razon.js';
import { topic as proporcionDirecta } from './proporcion-directa.js';
import { topic as porcentajes } from './porcentajes.js';
import { topic as porcentajesRepartos } from './porcentajes-repartos.js';
import { topic as potencias } from './potencias.js';
import { topic as raices } from './raices.js';
import { topic as divisibilidad } from './divisibilidad.js';
import { topic as mcdMcm } from './mcd-mcm.js';
import { topic as algebraLenguaje } from './algebra-lenguaje.js';
import { topic as monomios } from './monomios.js';
import { topic as ecuaciones } from './ecuaciones.js';
import { topic as ecuacionesProblemas } from './ecuaciones-problemas.js';
import { topic as angulos } from './angulos.js';
import { topic as poligonos } from './poligonos.js';
import { topic as areas } from './areas.js';
import { topic as circuloPitagoras } from './circulo-pitagoras.js';
import { topic as cuerpos } from './cuerpos.js';
import { topic as coordenadas } from './coordenadas.js';
import { topic as graficas } from './graficas.js';
import { topic as funcionesTabla } from './funciones-tabla.js';
import { topic as rectas } from './rectas.js';
import { topic as estadisticaVariables } from './estadistica-variables.js';
import { topic as frecuencias } from './frecuencias.js';
import { topic as mediaModaMediana } from './media-moda-mediana.js';
import { topic as probabilidad } from './probabilidad.js';
import { topic as inglesHello } from './ingles-hello.js';
import { topic as inglesNumbers } from './ingles-numbers.js';
import { topic as inglesColours } from './ingles-colours.js';
import { topic as inglesToBe } from './ingles-to-be.js';
import { topic as inglesAlphabet } from './ingles-alphabet.js';
import { topic as inglesDates } from './ingles-dates.js';
import { topic as inglesFamily } from './ingles-family.js';
import { topic as inglesHaveGot } from './ingles-have-got.js';
import { topic as inglesThisThat } from './ingles-this-that.js';
import { topic as inglesRoutines } from './ingles-routines.js';
import { topic as inglesPresentSimple } from './ingles-present-simple.js';
import { topic as inglesPresentQuestions } from './ingles-present-questions.js';
import { topic as inglesTimeFrequency } from './ingles-time-frequency.js';
import { topic as inglesHouse } from './ingles-house.js';
import { topic as inglesTown } from './ingles-town.js';
import { topic as inglesThereIs } from './ingles-there-is.js';
import { topic as inglesPrepositions } from './ingles-prepositions.js';
import { topic as inglesFood } from './ingles-food.js';
import { topic as inglesCountable } from './ingles-countable.js';
import { topic as inglesAbilities } from './ingles-abilities.js';
import { topic as inglesCan } from './ingles-can.js';
import { topic as inglesClothes } from './ingles-clothes.js';
import { topic as inglesWeather } from './ingles-weather.js';
import { topic as inglesContinuous } from './ingles-continuous.js';
import { topic as inglesSimpleContinuous } from './ingles-simple-continuous.js';
import { topic as inglesWasWere } from './ingles-was-were.js';
import { topic as inglesPastRegular } from './ingles-past-regular.js';
import { topic as inglesPastIrregular } from './ingles-past-irregular.js';
import { topic as inglesPastQuestions } from './ingles-past-questions.js';
import { topic as inglesAnimalsJobs } from './ingles-animals-jobs.js';
import { topic as inglesComparatives } from './ingles-comparatives.js';
import { topic as inglesSuperlatives } from './ingles-superlatives.js';
import { topic as inglesFuture } from './ingles-future.js';

// Los temas de mates no llevan `subject`: sin él, un tema es de mates.
const MATES = [
  comparar, enterosSumaResta, multiplicarDividir, combinadas,
  fraccionesQueEs, fraccionesDeUnNumero, fraccionesSumaResta, fraccionesMultDiv,
  decimalesLeer, decimalesSumaResta, decimalesMultDiv, decimalesFraccionRedondeo,
  proporcionRazon, proporcionDirecta, porcentajes, porcentajesRepartos,
  potencias, raices, divisibilidad, mcdMcm,
  algebraLenguaje, monomios, ecuaciones, ecuacionesProblemas,
  angulos, poligonos, areas, circuloPitagoras, cuerpos,
  coordenadas, graficas, funcionesTabla, rectas,
  estadisticaVariables, frecuencias, mediaModaMediana, probabilidad,
];
const INGLES = [
  inglesHello, inglesNumbers, inglesColours, inglesToBe,
  inglesAlphabet, inglesDates, inglesFamily, inglesHaveGot, inglesThisThat,
  inglesRoutines, inglesPresentSimple, inglesPresentQuestions, inglesTimeFrequency,
  inglesHouse, inglesTown, inglesThereIs, inglesPrepositions,
  inglesFood, inglesCountable, inglesAbilities, inglesCan,
  inglesClothes, inglesWeather, inglesContinuous, inglesSimpleContinuous,
  inglesWasWere, inglesPastRegular, inglesPastIrregular, inglesPastQuestions,
  inglesAnimalsJobs, inglesComparatives, inglesSuperlatives, inglesFuture,
];

// Todos los temas, en el orden aconsejado para aprenderlos.
export const TOPICS = [...MATES, ...INGLES];

/** Agrupa temas seguidos del mismo bloque: [{ name, topics }]. */
export function blocksOf(topics) {
  return topics.reduce((blocks, t) => {
    const last = blocks.at(-1);
    if (last?.name === t.block) last.topics.push(t);
    else blocks.push({ name: t.block, topics: [t] });
    return blocks;
  }, []);
}

/** Las materias de la web, cada una con sus bloques y lo que viene. */
export const SUBJECTS = [
  {
    id: 'mates',
    name: 'Mates',
    emoji: '🔢',
    route: '#/',
    topics: MATES,
    blocks: blocksOf(MATES),
    upcoming: [
      { title: 'Repaso de primaria', emoji: '✏️' },
    ],
  },
  {
    id: 'ingles',
    name: 'English',
    emoji: '🗣️',
    route: '#/ingles',
    topics: INGLES,
    blocks: blocksOf(INGLES),
    upcoming: [
    ],
  },
];

export const subjectOf = (topic) => topic.subject ?? 'mates';

export function getSubject(id) {
  return SUBJECTS.find((s) => s.id === id) ?? SUBJECTS[0];
}

/** Todos los bloques en orden (las dos materias). */
export const BLOCKS = SUBJECTS.flatMap((s) => s.blocks);

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
