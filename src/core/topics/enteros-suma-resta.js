// Tema: suma y resta de números enteros. Genera ejercicios ambientados en los
// gustos de la alumna, con pista, explicación paso a paso y guion animado.

import { formatInteger as f } from '../math/answer.js';
import { buildFrames, buildHintFrames, marksFrame, removeParentheses } from '../explain/storyboard.js';

const MINUS = '−';
const TOPIC_ID = 'enteros-suma-resta';

export const FORMS = {
  'suma-positivo': `Sumar un positivo (${MINUS}3 + 7)`,
  'resta-positivo': `Restar un positivo (2 ${MINUS} 9)`,
  'suma-negativo': `Sumar un negativo (4 + (${MINUS}6))`,
  'resta-negativo': `Restar un negativo (5 ${MINUS} (${MINUS}3))`,
  'tres-terminos': `Tres términos (${MINUS}8 + 5 ${MINUS} (${MINUS}2))`,
};

const LEVELS = {
  1: { range: 10, forms: [['suma-positivo', 3], ['resta-positivo', 3], ['suma-negativo', 2]] },
  2: { range: 20, forms: [['suma-positivo', 2], ['resta-positivo', 2], ['suma-negativo', 2], ['resta-negativo', 3]] },
  3: { range: 50, forms: [['tres-terminos', 1]] },
};

export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const MOVE_STORIES = [
  (a, n, up) => `🧟 Estás en el piso ${f(a)} del instituto (los negativos son sótanos). Huyendo de los zombis ${up ? 'subes' : 'bajas'} ${plural(n, 'piso', 'pisos')}. ¿En qué piso acabas?`,
  (a, n, up) => `🌡️ En la casa encantada de la peli, el termómetro marca ${f(a)} °C. De repente la temperatura ${up ? 'sube' : 'baja'} ${plural(n, 'grado', 'grados')}. ¿Cuánto marca ahora?`,
  (a, n, up) => `🧱 En el obby de Roblox tu avatar está a ${f(a)} metros (bajo cero es bajo tierra). ${up ? 'Salta y sube' : 'Se cae y baja'} ${plural(n, 'metro', 'metros')}. ¿A qué altura queda?`,
  (a, n, up) => `🏐 En el partido de vóley, la diferencia de tu equipo es ${f(a)} (negativo = vais perdiendo). ${up ? `Ganáis ${plural(n, 'punto', 'puntos')} seguidos` : `Os meten ${plural(n, 'punto', 'puntos')} seguidos`}. ¿Cómo queda la diferencia?`,
];

const CARD_STORIES = [
  (a, n, add) => `✉️ Juegas con cartas de números que has hecho tú. Tu total es ${f(a)}. ${add ? `Añades una carta de ${f(-n)}` : `Quitas una carta de ${f(-n)}`}. ¿Cuál es tu total ahora?`,
  (a, n, add) => `🥊 En el juego de boxeo tienes ${f(a)} puntos. ${add ? `El árbitro te pone una penalización de ${f(-n)}` : `El árbitro te quita una penalización de ${f(-n)} que te había puesto por error`}. ¿Cuántos puntos tienes?`,
  (a, n, add) => `⭐ Tu cuenta de estrellas de papel está en ${f(a)}. ${add ? `Te llega una deuda de ${f(-n)} estrellas` : `Te perdonan una deuda de ${f(-n)} estrellas`}. ¿Cómo queda tu cuenta?`,
];

// Escena de cada historia, en el mismo orden que las listas de arriba.
const MOVE_THEMES = ['edificio', 'termometro', 'obby', 'voley'];
const CARD_THEMES = ['cartas', 'boxeo', 'estrellas'];

const CODE_STORIES = [
  '🔐 Para salir de la mansión zombi necesitas el código secreto. Calcula:',
  '🍓 El cofre de la crepería se abre con este código. Calcula:',
  '🎤 Para entrar al concierto de trap necesitas la contraseña. Calcula:',
  '🐾 Tu mascota ha escondido una pista. Calcula:',
];

function formatTerm(value) {
  return value < 0 ? `(${f(value)})` : f(value);
}

export function formatExpression(first, ops) {
  return [f(first), ...ops.map((o) => `${o.op === '+' ? '+' : MINUS} ${formatTerm(o.value)}`)].join(' ');
}

export function evaluate(first, ops) {
  return ops.reduce((acc, o) => (o.op === '+' ? acc + o.value : acc - o.value), first);
}

const sign = (n) => (n < 0 ? MINUS : '+');

// El truco de los signos para acc ± n, o null si es una cuenta de primaria.
function signReason(acc, signed) {
  const result = acc + signed;
  if (acc === 0 || signed === 0 || (acc > 0 && signed > 0) || (acc > 0 && result >= 0)) return null;
  const absA = Math.abs(acc);
  const absB = Math.abs(signed);
  if ((acc < 0) === (signed < 0)) {
    return `mismo signo: sumas ${absA} + ${absB} = ${absA + absB} y dejas el signo ${sign(acc)}`;
  }
  if (absA === absB) return 'son opuestos y se anulan';
  const big = Math.max(absA, absB);
  const small = Math.min(absA, absB);
  const winner = absA > absB ? acc : signed;
  return `distinto signo: restas ${big} ${MINUS} ${small} = ${big - small} y pones el signo del más grande (${sign(winner)})`;
}

function combineStep(acc, signed) {
  const text = `${f(acc)} ${signed < 0 ? MINUS : '+'} ${Math.abs(signed)} = ${f(acc + signed)}`;
  const reason = signReason(acc, signed);
  return reason ? `${text} → ${reason}` : text;
}

export function explain(first, ops) {
  const steps = [];
  const simple = removeParentheses(ops);
  const negatives = ops.filter((o) => o.value < 0);
  if (negatives.length > 0) {
    const rules = negatives
      .map((o) => (o.op === '+'
        ? `«+ (${f(o.value)})» pasa a ser «${MINUS} ${-o.value}» (más por menos, menos)`
        : `«${MINUS} (${f(o.value)})» pasa a ser «+ ${-o.value}» (menos por menos, más)`))
      .join('; ');
    steps.push(`Quita los paréntesis: ${rules}. Queda ${formatExpression(first, simple)}`);
  }
  let acc = first;
  for (const o of simple) {
    const signed = o.op === '+' ? o.value : -o.value;
    steps.push(combineStep(acc, signed));
    acc += signed;
  }
  steps.push(`Resultado: ${f(acc)}`);
  return steps;
}

function hintFor(form, first, ops) {
  const o = ops[0];
  switch (form) {
    case 'suma-positivo':
      return `Empieza en ${f(first)} y avanza ${o.value} hacia la derecha en la recta.`;
    case 'resta-positivo':
      return `Empieza en ${f(first)} y retrocede ${o.value} hacia la izquierda en la recta.`;
    case 'suma-negativo':
      return `Sumar un negativo es restar: ${f(first)} + (${f(o.value)}) es lo mismo que ${f(first)} ${MINUS} ${-o.value}.`;
    case 'resta-negativo':
      return `Restar un negativo es sumar (menos por menos, más): ${f(first)} ${MINUS} (${f(o.value)}) es lo mismo que ${f(first)} + ${-o.value}.`;
    default:
      return 'Primero quita los paréntesis (menos por menos, más; más por menos, menos) y después calcula de izquierda a derecha, de dos en dos.';
  }
}

// Devuelve { text, theme }: el enunciado y la escena que lo ilustra.
function storyFor(form, first, ops, rng) {
  const o = ops[0];
  switch (form) {
    case 'suma-positivo':
    case 'resta-positivo': {
      const i = rng.int(0, MOVE_STORIES.length - 1);
      return { text: MOVE_STORIES[i](first, o.value, form === 'suma-positivo'), theme: MOVE_THEMES[i] };
    }
    case 'suma-negativo':
    case 'resta-negativo': {
      const i = rng.int(0, CARD_STORIES.length - 1);
      return { text: CARD_STORIES[i](first, -o.value, form === 'suma-negativo'), theme: CARD_THEMES[i] };
    }
    default:
      return { text: rng.pick(CODE_STORIES), theme: 'codigo' };
  }
}

// Truco de los signos del último paso, para el final del vídeo de dos números.
function finalReason(first, ops) {
  if (ops.length !== 1) return null;
  const [o] = removeParentheses(ops);
  return signReason(first, o.op === '+' ? o.value : -o.value);
}

function randomOp(rng, range) {
  const n = rng.int(1, range);
  return rng.pick([
    { op: '+', value: n },
    { op: '-', value: n },
    { op: '+', value: -n },
    { op: '-', value: -n },
  ]);
}

function build(rng, level) {
  const { range, forms } = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(forms);
  let first;
  let ops;
  if (form === 'tres-terminos') {
    first = rng.int(-range, range) || -1;
    ops = [randomOp(rng, range), randomOp(rng, range)];
  } else {
    first = rng.int(-range, range);
    const n = rng.int(1, range);
    ops = [{
      'suma-positivo': { op: '+', value: n },
      'resta-positivo': { op: '-', value: n },
      'suma-negativo': { op: '+', value: -n },
      'resta-negativo': { op: '-', value: -n },
    }[form]];
  }
  const expression = formatExpression(first, ops);
  const answer = evaluate(first, ops);
  const story = storyFor(form, first, ops, rng);
  const frames = buildFrames({ first, ops, theme: story.theme, reason: finalReason(first, ops) });
  return {
    answerType: 'integer',
    id: expression,
    topicId: TOPIC_ID,
    level,
    form,
    expression,
    first,
    ops,
    answer,
    story: story.text,
    theme: story.theme,
    hint: hintFor(form, first, ops),
    steps: explain(first, ops),
    frames,
    illustration: frames[0].view,
    hintFrames: buildHintFrames({ first, ops, theme: story.theme }),
  };
}

// En este tema siempre aparece algún negativo: en un número o en el resultado.
const hasNegative = (ex) => ex.first < 0 || ex.answer < 0 || ex.ops.some((o) => o.value < 0);

// recentIds: ejercicios recientes que no deben repetirse.
export function generate(rng, level, recentIds = []) {
  let exercise = build(rng, level);
  for (let tries = 0; tries < 50 && (recentIds.includes(exercise.id) || !hasNegative(exercise)); tries += 1) {
    exercise = build(rng, level);
  }
  return exercise;
}


export const INTRO = [
  {
    title: 'Los números enteros',
    paragraphs: [
      'Son los números sin decimales: los positivos (1, 2, 3…), el cero y los negativos (−1, −2, −3…).',
      'Los negativos están por todas partes: el sótano −2 de la mansión zombi, −5 °C en una noche de terror o deberle 3 estrellas a tu amiga (−3).',
    ],
    frames: [
      marksFrame('Esta es la recta de los enteros: a la derecha del cero, los positivos; a la izquierda, los negativos.', 'recta', -6, 6),
      marksFrame('Los negativos son como los sótanos del instituto: por debajo de la planta baja, que es el cero.', 'edificio', -5, 5),
    ],
  },
  {
    title: 'Sumar es subir, restar es bajar',
    paragraphs: [
      'Imagina la recta como el ascensor del instituto. Sumar es subir (ir a la derecha) y restar es bajar (ir a la izquierda).',
      'Estás en el sótano −3 y subes 7 pisos: −3 + 7 = 4. ¡Acabas en el piso 4!',
    ],
    frames: buildFrames({ first: -3, ops: [{ op: '+', value: 7 }], theme: 'edificio' }),
  },
  {
    title: 'Signos juntos',
    paragraphs: [
      'Cuando un signo va pegado a un paréntesis con un negativo, se juntan: más por menos, menos; menos por menos, más.',
      '4 + (−6) = 4 − 6 = −2 (te ponen una penalización de −6).',
      '5 − (−3) = 5 + 3 = 8 (te quitan una penalización de −3: ¡ganas puntos!).',
    ],
    frames: [
      ...buildFrames({ first: 4, ops: [{ op: '+', value: -6 }], theme: 'boxeo' }),
      ...buildFrames({ first: 5, ops: [{ op: '-', value: -3 }], theme: 'cartas' }),
    ],
  },
  {
    title: 'El truco rápido',
    paragraphs: [
      'Mismo signo: sumas los números y dejas ese signo. −4 − 3 = −7.',
      'Distinto signo: restas el grande menos el pequeño y pones el signo del más grande. −9 + 4 = −5.',
      'Si te lías, dibuja la recta. Y si fallas, te doy una pista. ¡Vamos!',
    ],
    frames: [
      ...buildFrames({ first: -4, ops: [{ op: '-', value: 3 }], theme: 'termometro', reason: signReason(-4, -3) }),
      ...buildFrames({ first: -9, ops: [{ op: '+', value: 4 }], theme: 'voley', reason: signReason(-9, 4) }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: 'Números enteros',
  title: 'Suma y resta de enteros',
  emoji: '🧟',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
