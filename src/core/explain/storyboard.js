// Guiones de las explicaciones animadas: una lista de fotogramas con el texto
// que se muestra, el texto que se narra y lo que se dibuja. Son datos puros;
// la interfaz los anima (src/ui/explainer.js y src/ui/scene.js).

import { formatInteger as f } from '../math/answer.js';

const MINUS = '−';

// Escenas en vertical (subir y bajar) y en horizontal (derecha e izquierda).
const VERTICAL_THEMES = new Set(['edificio', 'termometro', 'obby']);

export function orientationOf(theme) {
  return VERTICAL_THEMES.has(theme) ? 'vertical' : 'horizontal';
}

// + (−n) pasa a − n, y − (−n) pasa a + n.
export function removeParentheses(ops) {
  return ops.map((o) => (o.value < 0 ? { op: o.op === '+' ? '-' : '+', value: -o.value } : o));
}

const PARTS = {
  2: ['medio', 'medios'],
  3: ['tercio', 'tercios'],
  4: ['cuarto', 'cuartos'],
  5: ['quinto', 'quintos'],
  6: ['sexto', 'sextos'],
  7: ['séptimo', 'séptimos'],
  8: ['octavo', 'octavos'],
  9: ['noveno', 'novenos'],
  10: ['décimo', 'décimos'],
};
const AVOS = {
  11: 'onceavo', 12: 'doceavo', 13: 'treceavo', 14: 'catorceavo', 15: 'quinceavo', 16: 'dieciseisavo',
  18: 'dieciochoavo', 20: 'veinteavo', 24: 'veinticuatroavo', 30: 'treintavo',
};

/** Cómo se lee una fracción: «3/4» → «3 cuartos», «1/2» → «un medio». */
export function spokenFraction(n, d) {
  if (d === 1) return String(n);
  const one = n === 1;
  const count = one ? 'un' : String(n);
  if (PARTS[d]) return `${count} ${PARTS[d][one ? 0 : 1]}`;
  if (AVOS[d]) return `${count} ${AVOS[d]}${one ? '' : 's'}`;
  return `${n} partido por ${d}`;
}

const SUPERSCRIPTS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const fromSup = (s) => Number([...s].map((c) => SUPERSCRIPTS.indexOf(c)).join(''));

/** Cómo se lee una potencia: «5²» → «5 al cuadrado», «2⁵» → «2 elevado a 5». */
export function spokenPower(base, exp) {
  if (exp === 2) return `${base} al cuadrado`;
  if (exp === 3) return `${base} al cubo`;
  return `${base} elevado a ${exp}`;
}

// Texto para la voz: sin comillas ni paréntesis, con las fracciones y las
// potencias leídas y los signos en palabras.
export function speechText(text) {
  return text
    .replace(/[«»]/g, '')
    .replace(/(\d+|\b[a-z])([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, b, e) => ` ${spokenPower(b, fromSup(e))} `)
    .replace(/ : /g, ' entre ')
    .replace(/√\s?(\d+)/g, ' raíz cuadrada de $1 ')
    .replace(/·/g, ' por ')
    .replace(/≈/g, ' aproximadamente ')
    .replace(/(\d+)\/(\d+)/g, (_, n, d) => spokenFraction(Number(n), Number(d)))
    .replace(/×/g, ' por ')
    .replace(/÷/g, ' entre ')
    .replace(/°C/g, ' grados')
    .replace(/[()]/g, ' ')
    .replace(/−/g, ' menos ')
    .replace(/\+/g, ' más ')
    .replace(/=/g, ' igual a ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function frame(say, view) {
  return { say, voice: speechText(say), view };
}

// Inglés: en los guiones de inglés, lo que va entre «» está en inglés. La voz
// es una lista de partes { lang, text }: el español se narra con la voz
// española y el inglés con la inglesa.
export function bilingualParts(say) {
  return say.split(/(«[^»]*»)/).filter((piece) => piece.trim() !== '').map((piece) => (piece.startsWith('«')
    ? { lang: 'en', text: piece.slice(1, -1) }
    : { lang: 'es', text: speechText(piece) })).filter((part) => part.text !== '');
}

export function enFrame(say, view) {
  return { say, voice: bilingualParts(say), view };
}

export function rangeOf(values) {
  let min = Math.min(...values, 0) - 1;
  let max = Math.max(...values, 0) + 1;
  while (max - min < 10) { min -= 1; max += 1; }
  return { min, max };
}

function pathOf(first, simple) {
  const values = [first];
  for (const o of simple) values.push(values.at(-1) + (o.op === '+' ? o.value : -o.value));
  return values;
}

const steps = (n) => `${n} ${n === 1 ? 'paso' : 'pasos'}`;

// [verbo de la operación, movimiento, dirección]
function moveWords(theme, op) {
  if (orientationOf(theme) === 'vertical') return op === '+' ? ['Sumar', 'subir', ''] : ['Restar', 'bajar', ''];
  return op === '+' ? ['Sumar', 'avanzar', ' hacia la derecha'] : ['Restar', 'retroceder', ' hacia la izquierda'];
}

function signFrames(ops) {
  return ops.filter((o) => o.value < 0).map((o) => {
    const plusMinus = o.op === '+';
    const before = `${plusMinus ? '+' : MINUS} (${f(o.value)})`;
    const after = `${plusMinus ? MINUS : '+'} ${-o.value}`;
    const rule = plusMinus ? 'más por menos, menos' : 'menos por menos, más';
    return frame(`«${before}» se convierte en «${after}»: ${rule}.`, { kind: 'signs', before, after, rule });
  });
}

/**
 * Explicación completa: punto de partida, signos juntos, cada movimiento por
 * la recta y el resultado. reason: el truco de los signos, si lo hay.
 */
export function buildFrames({ first, ops, theme, reason = null }) {
  const simple = removeParentheses(ops);
  const values = pathOf(first, simple);
  const base = { kind: 'line', theme, ...rangeOf(values) };
  const frames = [frame(`Empezamos en ${f(first)}.`, { ...base, phase: 'start', from: first })];
  frames.push(...signFrames(ops));
  simple.forEach((o, i) => {
    const [verb, move, dir] = moveWords(theme, o.op);
    frames.push(frame(`${verb} ${o.value} es ${move} ${steps(o.value)}${dir}: de ${f(values[i])} a ${f(values[i + 1])}.`,
      { ...base, phase: 'move', from: values[i], to: values[i + 1] }));
  });
  const result = values.at(-1);
  frames.push(frame(reason ? `¡Resultado: ${f(result)}! Truco: ${reason}.` : `¡Resultado: ${f(result)}!`,
    { ...base, phase: 'arrive', from: first, to: result }));
  return frames;
}

/** Pista: el principio de la explicación, sin llegar al resultado. */
export function buildHintFrames({ first, ops, theme }) {
  const simple = removeParentheses(ops);
  const values = pathOf(first, simple);
  const base = { kind: 'line', theme, ...rangeOf(values) };
  const o = simple[0];
  const [, move, dir] = moveWords(theme, o.op);
  return [
    frame(`Empezamos en ${f(first)}.`, { ...base, phase: 'start', from: first }),
    ...signFrames(ops),
    frame(`Ahora toca ${move} ${steps(o.value)}${dir}. ¿Dónde llegas?`,
      { ...base, phase: 'direction', from: first, dir: o.op === '+' ? 1 : -1, amount: o.value }),
  ];
}

export function marksFrame(say, theme, min, max) {
  return frame(say, { kind: 'line', theme, min, max, phase: 'marks' });
}
