// PIN disuasorio del panel para padres: 4 dígitos guardados como hash.
// No es seguridad real: quien tenga el aparato puede borrar los datos.

export function isValidPin(pin) {
  return typeof pin === 'string' && /^\d{4}$/.test(pin);
}

export function hashPin(pin) {
  let hash = 0x811c9dc5;
  for (const ch of `mates-con-flow:${pin}`) {
    hash ^= ch.codePointAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export function withPin(doc, pin) {
  if (!isValidPin(pin)) throw new Error('El PIN tiene que tener 4 cifras');
  return { ...structuredClone(doc), pinHash: hashPin(pin) };
}

export function pinMatches(doc, pin) {
  return Boolean(doc.pinHash) && isValidPin(pin) && hashPin(pin) === doc.pinHash;
}
