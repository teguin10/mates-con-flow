// Expresiones con enteros como árbol: formato, cálculo exacto y resolución
// paso a paso respetando la jerarquía (paréntesis, después × y ÷, después
// + y −, siempre de izquierda a derecha). Funciones puras.

import { formatInteger as f } from './answer.js';

export const SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

export const num = (value) => ({ type: 'num', value });
export const op = (symbol, left, right, paren = false) => ({ type: 'op', op: symbol, left, right, paren });

// Valor exacto, o null si hay una división entre cero o no exacta.
export function evaluate(node) {
  if (node.type === 'num') return node.value;
  const a = evaluate(node.left);
  const b = evaluate(node.right);
  if (a === null || b === null) return null;
  switch (node.op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    default: return b !== 0 && a % b === 0 ? a / b : null;
  }
}

function parts(node, focus, first, parenFirst) {
  let out;
  if (node.type === 'num') {
    const text = node.value < 0 && (!first || parenFirst) ? `(${f(node.value)})` : f(node.value);
    out = [{ text, focus: false }];
  } else {
    out = [
      // Al abrir un paréntesis, su primer número vuelve a ir sin paréntesis propios.
      ...parts(node.left, focus, node.paren ? true : first, parenFirst),
      { text: ` ${SYMBOLS[node.op]} `, focus: false },
      ...parts(node.right, focus, false, parenFirst),
    ];
    if (node.paren) out = [{ text: '(', focus: false }, ...out, { text: ')', focus: false }];
  }
  return node === focus ? out.map((p) => ({ ...p, focus: true })) : out;
}

/** Texto de la expresión. parenFirst: también el primer número negativo entre paréntesis. */
export function format(node, { parenFirst = false } = {}) {
  return parts(node, null, true, parenFirst).map((p) => p.text).join('');
}

/** La expresión partida en { before, focus, after } alrededor del nodo focus. */
export function formatAround(node, focus, { parenFirst = false } = {}) {
  const list = parts(node, focus, true, parenFirst);
  const start = list.findIndex((p) => p.focus);
  const end = list.length - [...list].reverse().findIndex((p) => p.focus);
  const join = (a) => a.map((p) => p.text).join('');
  return { before: join(list.slice(0, start)), focus: join(list.slice(start, end)), after: join(list.slice(end)) };
}

function readyNodes(node, insideParen = false, acc = []) {
  if (node.type === 'num') return acc;
  const inside = insideParen || node.paren;
  readyNodes(node.left, inside, acc);
  if (node.left.type === 'num' && node.right.type === 'num') acc.push({ node, insideParen: inside });
  readyNodes(node.right, inside, acc);
  return acc;
}

export const RULES = {
  paren: 'Primero, lo que hay dentro de los paréntesis',
  mult: 'Después, multiplicaciones y divisiones, de izquierda a derecha',
  add: 'Por último, sumas y restas, de izquierda a derecha',
};

/** La siguiente operación que toca hacer, o null si ya es un número. */
export function nextStep(tree) {
  if (tree.type === 'num') return null;
  const ready = readyNodes(tree);
  const pick = ready.find((r) => r.insideParen)
    ?? ready.find((r) => r.node.op === '*' || r.node.op === '/')
    ?? ready[0];
  const kind = pick.insideParen ? 'paren' : pick.node.op === '*' || pick.node.op === '/' ? 'mult' : 'add';
  return { focus: pick.node, result: evaluate(pick.node), kind, rule: RULES[kind] };
}

export function replace(node, target, replacement) {
  if (node === target) return replacement;
  if (node.type === 'num') return node;
  const left = replace(node.left, target, replacement);
  const right = replace(node.right, target, replacement);
  return left === node.left && right === node.right ? node : { ...node, left, right };
}

/** Todos los pasos hasta el resultado. */
export function solveSteps(tree, options = {}) {
  const steps = [];
  let current = tree;
  for (let step = nextStep(current); step; step = nextStep(current)) {
    const around = formatAround(current, step.focus, options);
    current = replace(current, step.focus, num(step.result));
    steps.push({ ...around, result: step.result, kind: step.kind, rule: step.rule, after_expression: format(current, options) });
  }
  return steps;
}

export function countOps(node) {
  return node.type === 'num' ? 0 : 1 + countOps(node.left) + countOps(node.right);
}

export function leaves(node) {
  return node.type === 'num' ? [node.value] : [...leaves(node.left), ...leaves(node.right)];
}
