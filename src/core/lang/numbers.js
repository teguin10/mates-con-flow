// Números en inglés de 0 a 100 (ADR 0003).

const UNITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = { 2: 'twenty', 3: 'thirty', 4: 'forty', 5: 'fifty', 6: 'sixty', 7: 'seventy', 8: 'eighty', 9: 'ninety' };

/** 21 → «twenty-one»; 100 → «one hundred». */
export function numberWord(n) {
  if (!Number.isInteger(n) || n < 0 || n > 100) throw new RangeError(`Fuera de 0-100: ${n}`);
  if (n === 100) return 'one hundred';
  if (n < 20) return UNITS[n];
  const tens = TENS[Math.floor(n / 10)];
  return n % 10 === 0 ? tens : `${tens}-${UNITS[n % 10]}`;
}

/** Otras formas que también valen al escribirlo. */
export function numberAccepts(n) {
  return n === 100 ? ['a hundred', 'hundred'] : [];
}
