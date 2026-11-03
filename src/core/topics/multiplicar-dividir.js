// Tema: multiplicar y dividir enteros con la regla de los signos.

import { formatInteger as f } from '../math/answer.js';
import { evaluate, format, leaves, num, op } from '../math/expression.js';
import { frame, rangeOf } from '../explain/storyboard.js';

const TOPIC_ID = 'enteros-multiplicar-dividir';
const MINUS = '−';

export const FORMS = {
  'mult-signos': `Multiplicar con signos ((${MINUS}3) × 4)`,
  'div-signos': `Dividir con signos ((${MINUS}12) ÷ 4)`,
  'tres-factores': `Tres factores ((${MINUS}2) × 3 × (${MINUS}4))`,
};

const LEVELS = {
  1: { max: 5, forms: [['mult-signos', 1]] },
  2: { max: 10, forms: [['mult-signos', 2], ['div-signos', 2]] },
  3: { max: 6, forms: [['tres-factores', 2], ['div-signos', 1], ['mult-signos', 1]] },
};

export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };

const signOf = (n) => (n < 0 ? MINUS : '+');
const pattern = (values) => values.map((v) => (v < 0 ? `(${MINUS})` : '(+)'));

function signRule(values, symbol) {
  const negatives = values.filter((v) => v < 0).length;
  if (values.length === 2) {
    const word = symbol === '÷' ? 'entre' : 'por';
    const [x, y] = values.map((v) => (v < 0 ? 'menos' : 'más'));
    return {
      before: pattern(values).join(` ${symbol} `),
      after: negatives === 1 ? MINUS : '+',
      rule: `${x} ${word} ${y}, ${negatives === 1 ? 'menos' : 'más'}`,
    };
  }
  return {
    before: pattern(values).join(` ${symbol} `),
    after: negatives % 2 === 0 ? '+' : MINUS,
    rule: `${negatives} ${negatives === 1 ? 'signo menos: impar' : 'signos menos: par'} → ${negatives % 2 === 0 ? 'más' : 'menos'}`,
  };
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function multStory(a, b, rng) {
  if (a > 0 && b < 0) {
    return rng.pick([
      `🥊 Cada golpe del rival te quita ${plural(-b, 'punto', 'puntos')} (${f(b)}). Recibes ${plural(a, 'golpe', 'golpes')}. ¿Cuántos puntos cambian?`,
      `⭐ Prometes ${plural(-b, 'estrella', 'estrellas')} de papel (${f(b)}) a cada una de tus ${a} amigas. ¿Cuántas debes en total?`,
    ]);
  }
  if (a < 0 && b > 0) {
    return `🌡️ En la casa encantada la temperatura cambia ${f(a)} grados cada hora. ¿Cuánto ha cambiado en ${plural(b, 'hora', 'horas')}?`;
  }
  return `🧟 El ascensor de la mansión zombi baja ${plural(-a, 'piso', 'pisos')} cada minuto (${f(a)}). ¿Cuántos pisos más arriba estaba hace ${plural(-b, 'minuto', 'minutos')} (${f(b)})? Menos por menos…`;
}

function divStory(dividend, divisor) {
  if (dividend < 0 && divisor > 0) {
    return `⭐ Debes ${-dividend} estrellas de papel (${f(dividend)}) y lo repartís a partes iguales entre ${divisor}. ¿Cuánto debe cada una?`;
  }
  if (dividend < 0 && divisor < 0) {
    return `🥊 ¿Cuántas penalizaciones de ${f(divisor)} hacen falta para llegar a ${f(dividend)} puntos?`;
  }
  return '🔐 La caja fuerte de la mansión zombi se abre con el resultado de:';
}

function magnitudeFrame(values, symbol) {
  const abs = values.map(Math.abs);
  if (symbol === '÷') {
    const [D, d] = abs;
    const q = D / d;
    return frame(`Ahora los números: ${D} ÷ ${d} = ${q}, porque ${q} × ${d} = ${D}.`,
      { kind: 'calc', lines: [`${D} ÷ ${d} = ${q}`, `porque ${q} × ${d} = ${D}`], grid: d * q <= 60 ? { rows: d, cols: q } : null });
  }
  const product = abs.reduce((x, y) => x * y, 1);
  return frame(`Ahora los números: ${abs.join(' × ')} = ${product}.`,
    { kind: 'calc', lines: [`${abs.join(' × ')} = ${product}`], grid: abs.length === 2 && product <= 60 ? { rows: abs[0], cols: abs[1] } : null });
}

function framesFor(tree, values, symbol, answer, expression) {
  const sign = signRule(values, symbol);
  const frames = [
    frame(`Primero el signo: ${sign.before} da ${sign.after}. ${sign.rule[0].toUpperCase()}${sign.rule.slice(1)}.`, { kind: 'signs', before: sign.before, after: sign.after, rule: sign.rule }),
  ];
  const [a, b] = values;
  if (symbol === '×' && values.length === 2 && a > 0 && b < 0 && a * -b <= 30) {
    frames.push(frame(`${a} saltos de ${f(b)} desde el cero: llegamos a ${f(answer)}.`,
      { kind: 'line', theme: 'recta', ...rangeOf([0, answer]), phase: 'jumps', from: 0, step: b, count: a, to: answer }));
  } else {
    frames.push(magnitudeFrame(values, symbol));
  }
  frames.push(frame(`Juntamos signo y número: ${expression} = ${f(answer)}.`, { kind: 'calc', lines: [`${expression} = ${f(answer)}`] }));
  return { frames, sign };
}

function nonZero(rng, max, negative) {
  const n = rng.int(1, max);
  return negative ? -n : n;
}

function build(rng, level) {
  const { max, forms } = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(forms);
  let tree;
  let symbol = '×';
  if (form === 'div-signos') {
    symbol = '÷';
    const divisor = rng.int(2, 10) * (rng.next() < 0.5 ? -1 : 1);
    let quotient = nonZero(rng, 10, rng.next() < 0.5);
    if (divisor > 0 && quotient > 0) quotient = -quotient;
    tree = op('/', num(divisor * quotient), num(divisor));
  } else if (form === 'tres-factores') {
    const vals = [0, 0, 0].map(() => nonZero(rng, max, rng.next() < 0.5));
    if (vals.every((v) => v > 0)) vals[rng.int(0, 2)] *= -1;
    tree = op('*', op('*', num(vals[0]), num(vals[1])), num(vals[2]));
  } else {
    const a = nonZero(rng, max, rng.next() < 0.5);
    let b = nonZero(rng, max, rng.next() < 0.5);
    if (a > 0 && b > 0) b = -b;
    tree = op('*', num(a), num(b));
  }
  const values = leaves(tree);
  const answer = evaluate(tree);
  const expression = format(tree, { parenFirst: true });
  const { frames, sign } = framesFor(tree, values, symbol, answer, expression);
  const abs = values.map(Math.abs);
  const magnitude = Math.abs(answer);
  const story = form === 'div-signos' ? divStory(values[0], values[1])
    : form === 'tres-factores' ? rng.pick(['🔐 El código de la mansión zombi es:', '🎤 La contraseña del concierto de trap es:', '🧁 La receta secreta de la crepería dice:'])
      : multStory(values[0], values[1], rng);
  return {
    id: expression,
    topicId: TOPIC_ID,
    level,
    form,
    answerType: 'integer',
    expression: `${expression} = □`,
    answer,
    story,
    theme: 'recta',
    hint: values.length === 3
      ? 'Cuenta los signos menos: si hay un número par, el resultado es positivo; si es impar, negativo. Después multiplica los números como siempre.'
      : 'Primero el signo (más por más y menos por menos: más; más por menos: menos). Después multiplica o divide los números como siempre.',
    steps: [
      `Signo: ${sign.before} → ${sign.after} (${sign.rule}).`,
      symbol === '÷' ? `Números: ${abs[0]} ÷ ${abs[1]} = ${magnitude}.` : `Números: ${abs.join(' × ')} = ${magnitude}.`,
      `Resultado: ${f(answer)}`,
    ],
    illustration: null,
    frames,
    hintFrames: [frames[0]],
  };
}

export function generate(rng, level, recentIds = []) {
  let exercise = build(rng, level);
  for (let tries = 0; tries < 30 && recentIds.includes(exercise.id); tries += 1) exercise = build(rng, level);
  return exercise;
}

export const INTRO = [
  {
    title: 'La regla de los signos',
    paragraphs: [
      'Para multiplicar o dividir enteros, primero decides el signo y después haces la cuenta de siempre.',
      'Más por más, más. Menos por menos, más. Más por menos o menos por más, menos.',
    ],
    frames: [
      frame('Menos por menos, más.', { kind: 'signs', before: `(${MINUS}) × (${MINUS})`, after: '+', rule: 'menos por menos, más' }),
      frame('Más por menos, menos.', { kind: 'signs', before: `(+) × (${MINUS})`, after: MINUS, rule: 'más por menos, menos' }),
    ],
  },
  {
    title: 'Multiplicar es repetir',
    paragraphs: [
      '3 × (−2) es dar 3 saltos de −2 en la recta: llegas a −6.',
      'Como en el boxeo: si cada golpe te quita 2 puntos y recibes 3 golpes, pierdes 6.',
    ],
    frames: [
      frame('3 saltos de −2 desde el cero: llegamos a −6.', { kind: 'line', theme: 'recta', min: -8, max: 2, phase: 'jumps', from: 0, step: -2, count: 3, to: -6 }),
    ],
  },
  {
    title: 'Dividir es repartir',
    paragraphs: [
      'Dividir también sigue la regla de los signos: (−12) ÷ 4 = −3 y (−12) ÷ (−4) = 3.',
      'Para comprobarlo, multiplica al revés: (−3) × 4 = −12.',
    ],
    frames: [
      frame('Primero el signo: menos entre más, menos.', { kind: 'signs', before: `(${MINUS}) ÷ (+)`, after: MINUS, rule: 'menos entre más, menos' }),
      frame('Ahora los números: 12 ÷ 4 = 3, porque 3 × 4 = 12.', { kind: 'calc', lines: ['12 ÷ 4 = 3', 'porque 3 × 4 = 12'], grid: { rows: 4, cols: 3 } }),
      frame('Juntamos signo y número: (−12) ÷ 4 = −3.', { kind: 'calc', lines: [`(${MINUS}12) ÷ 4 = ${MINUS}3`] }),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: 'Números enteros',
  title: 'Multiplicar y dividir',
  emoji: '🥊',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
