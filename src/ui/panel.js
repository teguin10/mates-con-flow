// Panel para padres: PIN disuasorio y progreso por tema.

import { h } from './dom.js';
import { isValidPin, pinMatches, withPin } from '../core/pin.js';
import { createTopicProgress } from '../core/progress/schema.js';

const WARNINGS = {
  corrupt: 'El progreso guardado estaba dañado. Se ha hecho una copia de seguridad en este navegador y se ha empezado de cero.',
  future: 'Hay un progreso guardado por una versión más nueva de la web. Recarga la página para actualizarla; mientras tanto no se guarda nada.',
  unavailable: 'Este navegador no deja guardar datos (¿modo incógnito?). El progreso se perderá al cerrar la página.',
  'save-failed': 'No se ha podido guardar el último progreso (¿almacenamiento lleno?).',
};

const KIND_LABEL = { gato: 'gato', perro: 'perro', mono: 'mono' };
const WEAK_MIN_SEEN = 3;
const WEAK_BELOW = 0.7;

function pinInput(label) {
  return h('label', { class: 'field' }, label,
    h('input', { type: 'password', inputmode: 'numeric', pattern: '[0-9]*', maxlength: '4', autocomplete: 'off', class: 'pin' }));
}

function percent(part, total) {
  return total === 0 ? '—' : `${Math.round((part / total) * 100)} %`;
}

function formatDate(iso) {
  if (!iso) return 'Nunca';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? 'Nunca' : date.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
}

function createPinForm({ doc, onSave }) {
  const first = pinInput('PIN nuevo (4 cifras)');
  const second = pinInput('Repite el PIN');
  const error = h('p', { class: 'error', role: 'alert' });
  const form = h('form', {
    class: 'card pin-form',
    onSubmit: (event) => {
      event.preventDefault();
      const a = first.querySelector('input').value;
      const b = second.querySelector('input').value;
      if (!isValidPin(a)) { error.textContent = 'El PIN tiene que tener 4 cifras.'; return; }
      if (a !== b) { error.textContent = 'Los dos PIN no coinciden.'; return; }
      onSave(withPin(doc, a));
    },
  },
  h('h2', {}, 'Crea el PIN de la zona padres'),
  h('p', { class: 'muted' }, 'Sirve para que la zona padres no se abra sin querer. No es una contraseña segura: quien tenga el aparato puede borrar los datos del navegador.'),
  first, second, error,
  h('button', { type: 'submit', class: 'btn btn-primary' }, 'Guardar PIN'));
  return form;
}

function unlockForm({ doc, onUnlock }) {
  const input = pinInput('PIN');
  const error = h('p', { class: 'error', role: 'alert' });
  return h('form', {
    class: 'card pin-form',
    onSubmit: (event) => {
      event.preventDefault();
      if (pinMatches(doc, input.querySelector('input').value)) onUnlock();
      else error.textContent = 'PIN incorrecto.';
    },
  },
  h('h2', {}, 'Zona padres 🔒'),
  input, error,
  h('button', { type: 'submit', class: 'btn btn-primary' }, 'Entrar'));
}

function topicSection(topic, progress) {
  const tp = progress ?? createTopicProgress();
  const { stats } = tp;
  if (stats.exercises === 0) {
    return h('section', { class: 'card' }, h('h3', {}, `${topic.emoji} ${topic.title}`), h('p', { class: 'muted' }, 'Todavía no ha practicado este tema.'));
  }
  const forms = Object.entries(stats.byForm)
    .map(([form, entry]) => ({ form, ...entry, rate: entry.seen ? entry.firstTry / entry.seen : 0 }))
    .sort((a, b) => a.rate - b.rate);
  const weakest = forms.find((f) => f.seen >= WEAK_MIN_SEEN && f.rate < WEAK_BELOW);
  const row = (label, value) => h('tr', {}, h('th', { scope: 'row' }, label), h('td', {}, value));
  return h('section', { class: 'card' },
    h('h3', {}, `${topic.emoji} ${topic.title}`),
    h('table', { class: 'stats' }, h('tbody', {},
      row('Nivel actual', `${tp.level} · ${topic.levelNames[tp.level] ?? ''}${tp.mastered ? ' · 👑 dominado' : ''}`),
      row('Ejercicios hechos', stats.exercises),
      row('Resueltos', `${stats.solved} (${percent(stats.solved, stats.exercises)})`),
      row('A la primera', `${stats.firstTry} (${percent(stats.firstTry, stats.exercises)})`),
      row('Intentos fallidos', stats.wrongAttempts),
      row('Necesitó pista', stats.hints),
      row('Necesitó explicación', stats.explanations),
      row('Última práctica', formatDate(stats.lastPracticedAt)))),
    weakest ? h('p', { class: 'weak' }, `⚠️ Donde más falla: ${topic.forms[weakest.form] ?? weakest.form} (${percent(weakest.firstTry, weakest.seen)} a la primera).`) : null,
    h('table', { class: 'forms' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Tipo de ejercicio'), h('th', {}, 'Hechos'), h('th', {}, 'A la primera'))),
      h('tbody', {}, forms.map((f) => h('tr', { class: f === weakest ? 'is-weak' : '' },
        h('td', {}, topic.forms[f.form] ?? f.form), h('td', {}, f.seen), h('td', {}, percent(f.firstTry, f.seen)))))));
}

export function renderPanel({ doc, warning, topics, unlocked, onSave, onUnlock, onLock }) {
  const back = h('a', { href: '#/', class: 'btn btn-ghost' }, '← Volver');
  if (!doc.pinHash) return h('div', { class: 'screen panel' }, back, createPinForm({ doc, onSave }));
  if (!unlocked) return h('div', { class: 'screen panel' }, back, unlockForm({ doc, onUnlock }));

  const { profile } = doc;
  return h('div', { class: 'screen panel' },
    h('div', { class: 'panel-top' }, back, h('button', { type: 'button', class: 'btn btn-ghost', onClick: onLock }, 'Bloquear 🔒')),
    h('h1', {}, 'Zona padres'),
    warning ? h('p', { class: 'warning', role: 'alert' }, WARNINGS[warning] ?? warning) : null,
    h('section', { class: 'card' },
      h('h3', {}, 'Resumen'),
      h('table', { class: 'stats' }, h('tbody', {},
        h('tr', {}, h('th', { scope: 'row' }, 'Apodo'), h('td', {}, profile.nickname)),
        h('tr', {}, h('th', { scope: 'row' }, 'Mascota'), h('td', {}, profile.mascot ? `${profile.mascot.name} (${KIND_LABEL[profile.mascot.kind]})` : '—')),
        h('tr', {}, h('th', { scope: 'row' }, 'Puntos'), h('td', {}, doc.points)),
        h('tr', {}, h('th', { scope: 'row' }, 'Mejor racha'), h('td', {}, doc.bestStreak))))),
    topics.map((topic) => topicSection(topic, doc.topics[topic.id])),
    h('p', { class: 'muted small' }, 'El progreso se guarda solo en este aparato y en este navegador.'));
}
