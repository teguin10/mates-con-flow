// Divisibilidad y potencias con números naturales (ADR 0003): primos,
// divisores, descomposición en factores y potencias escritas con
// superíndices (2³ · 3).

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** 3 → «³», 12 → «¹²». */
export const sup = (n) => String(n).split('').map((d) => SUP[Number(d)]).join('');

/** «2³»: base con exponente (sin exponente si es 1). */
export const power = (base, exp) => (exp === 1 ? String(base) : `${base}${sup(exp)}`);

export function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
}

/** Divisores de n en orden. */
export function divisors(n) {
  const list = [];
  for (let d = 1; d <= n; d += 1) if (n % d === 0) list.push(d);
  return list;
}

/** Descomposición en factores primos: 60 → [[2, 2], [3, 1], [5, 1]]. */
export function factorize(n) {
  const factors = [];
  let rest = n;
  for (let p = 2; p * p <= rest; p += 1) {
    let e = 0;
    while (rest % p === 0) { rest /= p; e += 1; }
    if (e) factors.push([p, e]);
  }
  if (rest > 1) factors.push([rest, 1]);
  return factors;
}

/** «2² · 3 · 5». */
export const formatFactors = (factors) => factors.map(([p, e]) => power(p, e)).join(' · ');

/** Las filas de la división sucesiva: 60 → [[60, 2], [30, 2], [15, 3], [5, 5], [1, null]]. */
export function divisionSteps(n) {
  const rows = [];
  let rest = n;
  for (const [p, e] of factorize(n)) {
    for (let i = 0; i < e; i += 1) { rows.push([rest, p]); rest /= p; }
  }
  rows.push([1, null]);
  return rows;
}

export const primesUpTo = (max) => Array.from({ length: max - 1 }, (_, i) => i + 2).filter(isPrime);
