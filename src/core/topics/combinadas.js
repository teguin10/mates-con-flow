// Tema: operaciones combinadas con enteros. Se resuelven por orden:
// paréntesis, después × y ÷, después + y −, de izquierda a derecha.

import { formatInteger as f } from '../math/answer.js';
import { evaluate, format, leaves, nextStep, num, op, RULES, solveSteps } from '../math/expression.js';
import { frame } from '../explain/storyboard.js';

const TOPIC_ID = 'enteros-combinadas';
const MINUS = '−';

export const FORMS = {
  'sin-parentesis': `Sin paréntesis (${MINUS}3 + 4 × (${MINUS}2))`,
  'con-parentesis': `Con paréntesis ((5 ${MINUS} 8) × 2)`,
  'tres-operaciones': `Tres operaciones ((${MINUS}12) ÷ (5 ${MINUS} 8) + 2 × (${MINUS}3))`,
};

const LEVELS = { 1: 'sin-parentesis', 2: 'con-parentesis', 3: 'tres-operaciones' };
export const LEVEL_NAMES = { 1: 'Calentamiento', 2: 'En racha', 3: 'Modo pro' };
const MAX_RESULT = 100;

const STORIES = [
  '🔐 La puerta de la mansión zombi pide un código. Respeta el orden de las operaciones:',
  '🎤 Contraseña para entrar al concierto de trap (el orden importa):',
  '🧁 Receta secreta de la crepería: calcula en el orden correcto:',
  '🏐 Puntuación final del torneo de vóley:',
];

const v = (rng, max) => rng.int(1, max) * (rng.next() < 0.5 ? -1 : 1);

// Cada plantilla devuelve un árbol; las divisiones se construyen exactas.
const TEMPLATES = {
  'sin-parentesis': [
    (r) => op('+', num(v(r, 10)), op('*', num(v(r, 6)), num(v(r, 6)))),
    (r) => op('-', num(v(r, 10)), op('*', num(v(r, 6)), num(v(r, 6)))),
    (r) => op('+', op('*', num(v(r, 6)), num(v(r, 6))), num(v(r, 10))),
    (r) => op('-', op('*', num(v(r, 6)), num(v(r, 6))), num(v(r, 10))),
    (r) => { const c = v(r, 5); return op('+', num(v(r, 10)), op('/', num(c * v(r, 6)), num(c))); },
  ],
  'con-parentesis': [
    (r) => op('*', op('+', num(v(r, 9)), num(v(r, 9)), true), num(v(r, 5))),
    (r) => op('*', op('-', num(v(r, 9)), num(v(r, 9)), true), num(v(r, 5))),
    (r) => op('*', num(v(r, 5)), op('+', num(v(r, 9)), num(v(r, 9)), true)),
    (r) => op('-', num(v(r, 10)), op('+', num(v(r, 9)), num(v(r, 9)), true)),
    (r) => { const c = v(r, 5); const total = c * v(r, 6); const a = v(r, 9); return op('/', op('+', num(a), num(total - a), true), num(c)); },
  ],
  'tres-operaciones': [
    (r) => op('+', op('*', op('-', num(v(r, 9)), num(v(r, 9)), true), num(v(r, 4))), num(v(r, 10))),
    (r) => { const b = v(r, 6); let c = v(r, 6); if (b + c === 0) c += 1; const s = b + c; return op('-', op('/', num(s * v(r, 5)), op('+', num(b), num(c), true)), op('*', num(v(r, 5)), num(v(r, 5)))); },
    (r) => { const e = v(r, 5); return op('-', op('*', num(v(r, 5)), op('-', num(v(r, 9)), num(v(r, 9)), true)), op('/', num(e * v(r, 5)), num(e))); },
    (r) => op('*', op('+', num(v(r, 6)), num(v(r, 6)), true), op('-', num(v(r, 6)), num(v(r, 6)), true)),
  ],
};

function valid(tree) {
  const value = evaluate(tree);
  return value !== null && Math.abs(value) <= MAX_RESULT && leaves(tree).some((x) => x < 0);
}

function framesFor(tree, steps, answer) {
  const start = format(tree);
  const frames = [frame('Recuerda el orden: primero paréntesis, después multiplicaciones y divisiones, y por último sumas y restas.',
    { kind: 'reduce', before: start, focus: '', after: '', result: null, rule: '¿Qué hacemos primero?' })];
  for (const s of steps) {
    frames.push(frame(`${s.rule}: ${s.focus} = ${f(s.result)}.`,
      { kind: 'reduce', before: s.before, focus: s.focus, after: s.after, result: f(s.result), rule: s.rule }));
  }
  frames.push(frame(`¡Resultado: ${f(answer)}!`, { kind: 'calc', lines: [`${start} = ${f(answer)}`] }));
  return frames;
}

function build(rng, level) {
  const form = LEVELS[level] ?? LEVELS[1];
  let tree = rng.pick(TEMPLATES[form])(rng);
  for (let tries = 0; tries < 50 && !valid(tree); tries += 1) tree = rng.pick(TEMPLATES[form])(rng);
  const answer = evaluate(tree);
  const expression = format(tree);
  const steps = solveSteps(tree);
  const first = nextStep(tree);
  const firstParts = steps[0];
  const frames = framesFor(tree, steps, answer);
  return {
    id: expression,
    topicId: TOPIC_ID,
    level,
    form,
    answerType: 'integer',
    expression: `${expression} = □`,
    answer,
    story: rng.pick(STORIES),
    theme: 'codigo',
    hint: `${first.rule}. Empieza por ${firstParts.focus}.`,
    steps: steps.map((s) => `${s.rule}: ${s.focus} = ${f(s.result)} → ${s.after_expression}`),
    illustration: null,
    frames,
    hintFrames: [
      frames[0],
      frame(`${first.rule}: ${firstParts.focus}. ¿Cuánto da?`,
        { kind: 'reduce', before: firstParts.before, focus: firstParts.focus, after: firstParts.after, result: null, rule: first.rule }),
    ],
  };
}

export function generate(rng, level, recentIds = []) {
  let exercise = build(rng, level);
  for (let tries = 0; tries < 30 && recentIds.includes(exercise.id); tries += 1) exercise = build(rng, level);
  return exercise;
}

const EXAMPLE = op('-', num(2), op('*', num(3), num(-4)));
const EXAMPLE_STEPS = solveSteps(EXAMPLE);
const PAREN = op('*', op('-', num(5), num(8), true), num(2));
const PAREN_STEPS = solveSteps(PAREN);

export const INTRO = [
  {
    title: 'El orden importa',
    paragraphs: [
      'Cuando hay varias operaciones, no se hacen de izquierda a derecha sin más. Hay un orden:',
      '1) Paréntesis. 2) Multiplicaciones y divisiones. 3) Sumas y restas. Si hay empate, de izquierda a derecha.',
    ],
    frames: [
      frame(`${RULES.paren}.`, { kind: 'calc', lines: ['1) ( )'] }),
      frame(`${RULES.mult}.`, { kind: 'calc', lines: ['2) × ÷'] }),
      frame(`${RULES.add}.`, { kind: 'calc', lines: ['3) + −'] }),
    ],
  },
  {
    title: 'Primero × y ÷',
    paragraphs: [
      `En 2 − 3 × (${MINUS}4) se multiplica primero: 3 × (${MINUS}4) = ${MINUS}12. Después 2 − (${MINUS}12) = 14.`,
      `Si restas primero (2 − 3 = ${MINUS}1) te sale otra cosa: ¡el código no abriría la puerta!`,
    ],
    frames: framesFor(EXAMPLE, EXAMPLE_STEPS, evaluate(EXAMPLE)),
  },
  {
    title: 'Los paréntesis mandan',
    paragraphs: [
      `En (5 − 8) × 2, lo primero es el paréntesis: 5 − 8 = ${MINUS}3. Después ${MINUS}3 × 2 = ${MINUS}6.`,
      'Los paréntesis son como un pase VIP: van antes que nadie.',
    ],
    frames: framesFor(PAREN, PAREN_STEPS, evaluate(PAREN)),
  },
];

export const topic = {
  id: TOPIC_ID,
  block: 'Números enteros',
  title: 'Operaciones combinadas',
  emoji: '🔐',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
