// Premios: pegatinas que se ganan por logros y estilos de color que se
// desbloquean con puntos. Funciones puras sobre el progreso.

export const STICKERS = [
  { id: 'primer-acierto', name: '¡Primer paso!', how: 'Acierta tu primer ejercicio', art: 'estrella' },
  { id: 'racha-5', name: 'En llamas', how: 'Haz una racha de 5 aciertos seguidos', art: 'llama' },
  { id: 'racha-10', name: 'Rally de 10', how: 'Haz una racha de 10', art: 'voley' },
  { id: 'racha-20', name: 'K.O. de 20', how: 'Haz una racha de 20', art: 'guante' },
  { id: 'nivel-2', name: 'Subidón', how: 'Sube a nivel 2 en un tema', art: 'micro' },
  { id: 'nivel-3', name: 'Modo pro', how: 'Llega al nivel 3 en un tema', art: 'cascos' },
  { id: 'dominio', name: 'Lo dominas', how: 'Domina un tema', art: 'corona' },
  { id: 'dominio-todos', name: 'Reina de los enteros', how: 'Domina todos los temas de enteros', art: 'diamante' },
  { id: 'dominio-fracciones', name: 'Reina de las fracciones', how: 'Domina todos los temas de fracciones', art: 'crepe-porciones' },
  { id: 'puntos-100', name: 'Crepe de 100', how: 'Consigue 100 puntos', art: 'crepe' },
  { id: 'puntos-250', name: 'Torre de tortitas', how: 'Consigue 250 puntos', art: 'tortitas' },
  { id: 'puntos-500', name: 'Zombi kawaii', how: 'Consigue 500 puntos', art: 'zombi' },
  { id: 'puntos-1000', name: 'Gata con flow', how: 'Consigue 1000 puntos', art: 'gata' },
];

export const STYLES = [
  { id: 'clasico', name: 'Rosa clásico', points: 0 },
  { id: 'neon', name: 'Rosa neón', points: 150 },
  { id: 'crema', name: 'Crema', points: 300 },
  { id: 'plata', name: 'Gris plata', points: 600 },
  { id: 'voley', name: 'Vóley', points: 1000 },
];

export const DEFAULT_STYLE = 'clasico';

// Pegatina por dominar todos los temas de un bloque. 'dominio-todos' conserva
// su id de cuando solo había enteros: ya está guardada en progresos reales.
export const BLOCK_STICKERS = { 'dominio-todos': 'Números enteros', 'dominio-fracciones': 'Fracciones' };

/**
 * Ids de todas las pegatinas que el progreso merece ahora mismo.
 * topics: los temas de la web, [{ id, block }].
 */
export function deservedStickers(doc, topics) {
  const progress = Object.values(doc.topics);
  const ids = [];
  if (progress.some((t) => t.stats.solved > 0)) ids.push('primer-acierto');
  for (const n of [5, 10, 20]) if (doc.bestStreak >= n) ids.push(`racha-${n}`);
  if (progress.some((t) => t.level >= 2 || t.mastered)) ids.push('nivel-2');
  if (progress.some((t) => t.level >= 3 || t.mastered)) ids.push('nivel-3');
  if (progress.some((t) => t.mastered)) ids.push('dominio');
  for (const [id, block] of Object.entries(BLOCK_STICKERS)) {
    const inBlock = topics.filter((t) => t.block === block);
    if (inBlock.length > 0 && inBlock.every((t) => doc.topics[t.id]?.mastered)) ids.push(id);
  }
  for (const n of [100, 250, 500, 1000]) if (doc.points >= n) ids.push(`puntos-${n}`);
  return ids;
}

/** Añade las pegatinas nuevas. Devuelve { doc, granted } sin tocar el original. */
export function grantStickers(doc, topics, now) {
  const owned = doc.rewards.stickers;
  const granted = deservedStickers(doc, topics).filter((id) => !owned[id]);
  if (granted.length === 0) return { doc, granted };
  const next = structuredClone(doc);
  for (const id of granted) next.rewards.stickers[id] = now;
  return { doc: next, granted };
}

export function unlockedStyles(doc) {
  return STYLES.filter((style) => doc.points >= style.points);
}

/** El estilo activo, o el clásico si el guardado no existe o no está desbloqueado. */
export function activeStyle(doc) {
  const id = doc.settings.style;
  return unlockedStyles(doc).some((s) => s.id === id) ? id : DEFAULT_STYLE;
}

export function withStyle(doc, styleId) {
  if (!unlockedStyles(doc).some((s) => s.id === styleId)) return doc;
  const next = structuredClone(doc);
  next.settings.style = styleId;
  return next;
}
