// Única lectura y escritura del almacenamiento del navegador (ADR 0002).
// Si lo guardado está dañado, se conserva una copia y se avisa; si es de una
// versión futura, no se sobrescribe.

import { createEmptyProgress, parseProgress } from './core/progress/schema.js';

export const STORAGE_KEY = 'mates-con-flow.progress';

function browserStorage() {
  try {
    const storage = globalThis.localStorage;
    const probe = `${STORAGE_KEY}.probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)); },
    removeItem: (k) => { data.delete(k); },
  };
}

/**
 * warning: null | 'unavailable' | 'corrupt' | 'future' | 'save-failed'
 */
export function createStore(backend = browserStorage()) {
  let warning = backend ? null : 'unavailable';
  const storage = backend ?? memoryStorage();
  let readOnly = false;

  function load(now) {
    let saved;
    try {
      saved = storage.getItem(STORAGE_KEY);
    } catch {
      warning = 'unavailable';
      return createEmptyProgress();
    }
    const parsed = parseProgress(saved);
    if (parsed.ok) return parsed.doc;
    warning = parsed.reason;
    try {
      storage.setItem(`${STORAGE_KEY}.backup.${now}`, saved);
    } catch {
      readOnly = true;
    }
    if (parsed.reason === 'future') readOnly = true;
    return createEmptyProgress();
  }

  function save(doc) {
    if (readOnly) return false;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(doc));
      return true;
    } catch {
      warning = 'save-failed';
      return false;
    }
  }

  return {
    load,
    save,
    get warning() { return warning; },
  };
}
