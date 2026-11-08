// Respuestas escritas en inglés (ADR 0003). No cuentan las mayúsculas, los
// apóstrofos (decisión del usuario: «Im» vale por «I'm»), los guiones, los
// espacios de sobra ni el punto final.
// Una sola letra mal (cambiada, de más, de menos o dos seguidas cruzadas) en
// una respuesta de 4 letras o más es "almost": ni acierto ni fallo.

const TYPO_MIN_LENGTH = 4;

export function normalizeText(text) {
  if (typeof text !== 'string') return '';
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/['‘’`´]/g, '')
    .replace(/[-‐‑–—_]/g, ' ')
    .replace(/[.,!?¡¿;:"«»“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Distancia de edición con trasposición de dos letras seguidas (Damerau, versión OSA). */
export function editDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[rows - 1][cols - 1];
}

/**
 * expected: la respuesta principal; accept: otras formas que también valen
 * (I'm / I am, grey / gray). Devuelve { status, value }.
 */
export function checkText(text, expected, accept = []) {
  const value = normalizeText(text);
  if (value === '' || !/[a-z]/.test(value)) return { status: 'invalid' };
  const candidates = [expected, ...accept].map(normalizeText);
  if (candidates.includes(value)) return { status: 'correct', value };
  const close = candidates.some((c) => c.replace(/ /g, '').length >= TYPO_MIN_LENGTH && editDistance(value, c) === 1);
  return { status: close ? 'almost' : 'incorrect', value };
}
