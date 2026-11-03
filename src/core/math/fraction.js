// Fracciones positivas con aritmética exacta de enteros (ADR 0003).
// Una fracción es { n, d } con d > 0. Las operaciones devuelven el resultado
// sin simplificar; simplify() da la irreducible.

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

export function lcm(a, b) {
  return (Math.abs(a) / gcd(a, b)) * Math.abs(b);
}

export const fr = (n, d) => ({ n, d });

export function simplify({ n, d }) {
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
}

export const isIrreducible = (f) => gcd(f.n, f.d) === 1;
export const equals = (a, b) => a.n * b.d === b.n * a.d;
export const compare = (a, b) => Math.sign(a.n * b.d - b.n * a.d);
export const isWhole = (f) => f.n % f.d === 0;

export const mul = (a, b) => ({ n: a.n * b.n, d: a.d * b.d });
export const inverse = (a) => ({ n: a.d, d: a.n });
export const div = (a, b) => mul(a, inverse(b));

/** Las dos fracciones con el mínimo común denominador. */
export function toCommon(a, b) {
  const d = lcm(a.d, b.d);
  return [{ n: a.n * (d / a.d), d }, { n: b.n * (d / b.d), d }];
}

export function add(a, b) {
  const [x, y] = toCommon(a, b);
  return { n: x.n + y.n, d: x.d };
}

export function sub(a, b) {
  const [x, y] = toCommon(a, b);
  return { n: x.n - y.n, d: x.d };
}

/** «3/4»; un entero (d = 1) se escribe sin barra. */
export function formatFraction({ n, d }) {
  return d === 1 ? String(n) : `${n}/${d}`;
}

/** Lee «3/4» o «5» (entero). Devuelve null si no es una fracción válida. */
export function parseFraction(text) {
  const s = typeof text === 'string' ? text.replace(/\s+/g, '') : '';
  const match = /^(\d{1,4})(?:\/(\d{1,4}))?$/.exec(s);
  if (!match) return null;
  const n = Number(match[1]);
  const d = match[2] === undefined ? 1 : Number(match[2]);
  if (d === 0) return null;
  return { n, d };
}
