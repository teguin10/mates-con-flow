// Reglas del juego (ADR 0003): puntos que nunca se pierden, rachas, bonus,
// subir y bajar de nivel y dominio. Funciones puras sobre el progreso.

import { createTopicProgress, WINDOW_SIZE } from '../progress/schema.js';

export const POINTS = { firstTry: 10, afterHint: 5, afterExplanation: 2 };
export const STREAK_BONUS = { every: 5, points: 5 };
export const LEVEL_UP_HITS = 8;
export const LEVEL_DOWN_FAILS = 3;

export function pointsFor(attemptsUsed) {
  if (attemptsUsed <= 1) return POINTS.firstTry;
  if (attemptsUsed === 2) return POINTS.afterHint;
  return POINTS.afterExplanation;
}

export function hitsInWindow(topicProgress) {
  return topicProgress.recentResults.filter(Boolean).length;
}

/**
 * Registra un ejercicio terminado.
 * result: { form, attemptsUsed, solved, helpViewed } — attemptsUsed cuenta
 * todos los intentos válidos (los fallidos y, si lo resolvió, el bueno);
 * helpViewed: vio la explicación («¿Cómo se hace?») antes de responder bien,
 * así que el acierto vale como tras la explicación y no cuenta a la primera.
 * now: fecha ISO inyectada.
 * Devuelve { doc, events } sin modificar el documento recibido.
 */
export function applyExerciseResult(doc, topicId, maxLevel, result, now) {
  const next = structuredClone(doc);
  const topic = next.topics[topicId] ?? createTopicProgress();
  next.topics[topicId] = topic;

  const { form, attemptsUsed, solved, helpViewed = false } = result;
  const firstTry = solved && attemptsUsed === 1 && !helpViewed;
  const wrongAttempts = Math.max(0, attemptsUsed - (solved ? 1 : 0));
  const events = { points: 0, bonus: 0, streak: 0, levelUp: false, levelDown: false, mastered: false };

  if (solved) events.points = helpViewed ? POINTS.afterExplanation : pointsFor(attemptsUsed);
  if (firstTry) {
    next.streak += 1;
    if (next.streak % STREAK_BONUS.every === 0) events.bonus = STREAK_BONUS.points;
    next.bestStreak = Math.max(next.bestStreak, next.streak);
  } else {
    next.streak = 0;
  }
  next.points += events.points + events.bonus;
  events.streak = next.streak;

  const { stats } = topic;
  stats.exercises += 1;
  if (solved) stats.solved += 1;
  if (firstTry) stats.firstTry += 1;
  stats.wrongAttempts += wrongAttempts;
  if (wrongAttempts >= 1) stats.hints += 1;
  if (wrongAttempts >= 2 || helpViewed) stats.explanations += 1;
  const byForm = stats.byForm[form] ?? { seen: 0, firstTry: 0 };
  byForm.seen += 1;
  if (firstTry) byForm.firstTry += 1;
  stats.byForm[form] = byForm;
  stats.lastPracticedAt = now;

  topic.recentResults = [...topic.recentResults, firstTry].slice(-WINDOW_SIZE);
  topic.failStreak = firstTry ? 0 : topic.failStreak + 1;

  if (hitsInWindow(topic) >= LEVEL_UP_HITS) {
    if (topic.level < maxLevel) {
      topic.level += 1;
      events.levelUp = true;
    } else if (!topic.mastered) {
      topic.mastered = true;
      events.mastered = true;
    }
    topic.recentResults = [];
    topic.failStreak = 0;
  } else if (topic.failStreak >= LEVEL_DOWN_FAILS) {
    if (topic.level > 1) {
      topic.level -= 1;
      events.levelDown = true;
      topic.recentResults = [];
    }
    topic.failStreak = 0;
  }

  return { doc: next, events };
}
