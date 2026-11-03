// Esquema versionado del progreso (ADR 0002). Funciones puras: interpretar,
// migrar y normalizar. Quien guarda y lee el almacenamiento es src/storage.js.

export const CURRENT_VERSION = 3;
export const MASCOT_KINDS = ['gato', 'perro', 'mono'];
export const DEFAULT_NICKNAME = 'crack';
export const WINDOW_SIZE = 10;

// MIGRATIONS[n] convierte un documento de la versión n a la n + 1.
const MIGRATIONS = {
  // v2 añade los ajustes; la voz de las explicaciones empieza activada.
  1: (doc) => ({ ...doc, version: 2, settings: { voice: true } }),
  // v3 añade las pegatinas y los ajustes de música, sonidos y estilo.
  2: (doc) => ({
    ...doc,
    version: 3,
    rewards: { stickers: {} },
    settings: { ...DEFAULT_SETTINGS, ...(isObject(doc.settings) ? doc.settings : {}) },
  }),
};

const DEFAULT_SETTINGS = { voice: true, music: false, sounds: true, style: 'clasico' };

export function createEmptyProgress() {
  return {
    version: CURRENT_VERSION,
    profile: { nickname: DEFAULT_NICKNAME, mascot: null },
    points: 0,
    streak: 0,
    bestStreak: 0,
    pinHash: null,
    topics: {},
    settings: { ...DEFAULT_SETTINGS },
    rewards: { stickers: {} },
  };
}

export function createTopicProgress() {
  return {
    level: 1,
    recentResults: [],
    failStreak: 0,
    mastered: false,
    stats: {
      exercises: 0,
      solved: 0,
      firstTry: 0,
      wrongAttempts: 0,
      hints: 0,
      explanations: 0,
      byForm: {},
      lastPracticedAt: null,
    },
  };
}

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const count = (v) => (Number.isInteger(v) && v >= 0 ? v : 0);
const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function normalizeMascot(raw) {
  if (!isObject(raw) || !MASCOT_KINDS.includes(raw.kind)) return null;
  return { kind: raw.kind, name: text(raw.name, 20) || defaultMascotName(raw.kind) };
}

export function defaultMascotName(kind) {
  return { gato: 'Miau', perro: 'Toby', mono: 'Coco' }[kind] ?? 'Coco';
}

function normalizeTopic(raw) {
  const base = createTopicProgress();
  if (!isObject(raw)) return base;
  const stats = isObject(raw.stats) ? raw.stats : {};
  const byForm = {};
  if (isObject(stats.byForm)) {
    for (const [form, entry] of Object.entries(stats.byForm)) {
      if (isObject(entry)) byForm[form] = { seen: count(entry.seen), firstTry: count(entry.firstTry) };
    }
  }
  return {
    level: Number.isInteger(raw.level) && raw.level >= 1 ? raw.level : 1,
    recentResults: Array.isArray(raw.recentResults) ? raw.recentResults.filter((v) => typeof v === 'boolean').slice(-WINDOW_SIZE) : [],
    failStreak: count(raw.failStreak),
    mastered: raw.mastered === true,
    stats: {
      exercises: count(stats.exercises),
      solved: count(stats.solved),
      firstTry: count(stats.firstTry),
      wrongAttempts: count(stats.wrongAttempts),
      hints: count(stats.hints),
      explanations: count(stats.explanations),
      byForm,
      lastPracticedAt: typeof stats.lastPracticedAt === 'string' ? stats.lastPracticedAt : null,
    },
  };
}

export function normalizeProgress(raw) {
  const profile = isObject(raw.profile) ? raw.profile : {};
  const topics = {};
  if (isObject(raw.topics)) {
    for (const [id, topic] of Object.entries(raw.topics)) topics[id] = normalizeTopic(topic);
  }
  return {
    version: CURRENT_VERSION,
    profile: {
      nickname: text(profile.nickname, 20) || DEFAULT_NICKNAME,
      mascot: normalizeMascot(profile.mascot),
    },
    points: count(raw.points),
    streak: count(raw.streak),
    bestStreak: count(raw.bestStreak),
    pinHash: typeof raw.pinHash === 'string' && raw.pinHash ? raw.pinHash : null,
    topics,
    settings: normalizeSettings(raw.settings),
    rewards: { stickers: normalizeStickers(raw.rewards) },
  };
}

function normalizeSettings(raw) {
  const settings = isObject(raw) ? raw : {};
  return {
    voice: settings.voice !== false,
    music: settings.music === true,
    sounds: settings.sounds !== false,
    style: text(settings.style, 20) || DEFAULT_SETTINGS.style,
  };
}

function normalizeStickers(raw) {
  const stickers = {};
  if (isObject(raw) && isObject(raw.stickers)) {
    for (const [id, at] of Object.entries(raw.stickers)) if (typeof at === 'string') stickers[id] = at;
  }
  return stickers;
}

// Devuelve { ok: true, doc } o { ok: false, reason: 'corrupt' | 'future' }.
export function migrateProgress(raw) {
  if (!isObject(raw) || !Number.isInteger(raw.version) || raw.version < 1) {
    return { ok: false, reason: 'corrupt' };
  }
  if (raw.version > CURRENT_VERSION) return { ok: false, reason: 'future' };
  let doc = structuredClone(raw);
  while (doc.version < CURRENT_VERSION) {
    const step = MIGRATIONS[doc.version];
    if (!step) return { ok: false, reason: 'corrupt' };
    doc = step(doc);
  }
  return { ok: true, doc: normalizeProgress(doc) };
}

// text: el contenido guardado, o null si no hay nada guardado todavía.
export function parseProgress(saved) {
  if (saved === null || saved === undefined) return { ok: true, doc: createEmptyProgress(), fresh: true };
  let raw;
  try {
    raw = JSON.parse(saved);
  } catch {
    return { ok: false, reason: 'corrupt' };
  }
  return migrateProgress(raw);
}

export function withSettings(doc, settings) {
  const current = normalizeProgress(structuredClone(doc));
  return normalizeProgress({ ...current, settings: { ...current.settings, ...settings } });
}

export function withProfile(doc, { nickname, mascot }) {
  return normalizeProgress({ ...structuredClone(doc), profile: { nickname, mascot } });
}
