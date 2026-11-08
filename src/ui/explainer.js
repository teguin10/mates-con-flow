// Reproductor de explicaciones animadas («mini-vídeos»): muestra cada
// fotograma con su escena y su texto, lo narra si la voz está activada y pasa
// al siguiente cuando terminan la animación y la voz. Se puede pausar,
// avanzar, retroceder y repetir. Con «reducir movimiento» no arranca solo.

import { h } from './dom.js';
import { renderView } from './scene.js';
import { enText } from './en-text.js';

const MS_PER_CHAR = 60;
const MIN_FRAME_MS = 1800;
const MIN_FRAME_WITH_VOICE_MS = 1200;

export function createPlayer({ frames, voice, getVoiceOn, setVoiceOn, autoplay = true, title = '🎬 Mira cómo se hace' }) {
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let index = 0;
  let playing = false;
  let finished = false;
  let scene = null;
  let token = 0;
  const timers = new Set();

  const stage = h('div', { class: 'player-stage' });
  const caption = h('p', { class: 'player-caption', 'aria-live': 'polite' });
  const dots = h('div', { class: 'player-dots', 'aria-hidden': 'true' });
  const playBtn = h('button', { type: 'button', class: 'pbtn pbtn-main', onClick: togglePlay });
  const prevBtn = h('button', { type: 'button', class: 'pbtn', 'aria-label': 'Paso anterior', onClick: () => step(-1) }, '◀');
  const nextBtn = h('button', { type: 'button', class: 'pbtn', 'aria-label': 'Paso siguiente', onClick: () => step(1) }, '▶');
  const replayBtn = h('button', { type: 'button', class: 'pbtn', 'aria-label': 'Repetir desde el principio', onClick: replay }, '⟲');
  const voiceSlot = h('span', { class: 'voice-slot' });
  const el = h('section', { class: 'player', 'aria-label': title },
    h('div', { class: 'player-head' }, h('strong', {}, title), voiceSlot),
    stage,
    caption,
    h('div', { class: 'player-controls' }, replayBtn, prevBtn, playBtn, nextBtn),
    dots);

  const voiceOn = () => voice.available && getVoiceOn();

  function drawVoiceButton() {
    voiceSlot.replaceChildren(voice.available
      ? h('button', {
        type: 'button',
        class: 'pbtn pbtn-voice',
        'aria-pressed': String(getVoiceOn()),
        'aria-label': getVoiceOn() ? 'Quitar la voz' : 'Poner la voz',
        onClick: () => {
          setVoiceOn(!getVoiceOn());
          if (!getVoiceOn()) voice.stop();
          drawVoiceButton();
        },
      }, getVoiceOn() ? '🔊' : '🔇')
      : '');
  }
  const unsubscribe = voice.onChange(drawVoiceButton);

  function later(fn, ms) {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
  }

  function clear() {
    token += 1;
    timers.forEach(clearTimeout);
    timers.clear();
    scene?.stop();
  }

  function updateControls() {
    playBtn.textContent = playing ? '⏸ Pausa' : finished && index === frames.length - 1 ? '⟲ Otra vez' : '▶ Ver';
    playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === frames.length - 1;
    dots.replaceChildren(...frames.map((_, i) => h('span', { class: `dot ${i === index ? 'on' : ''} ${i < index ? 'seen' : ''}` })));
  }

  function show(i, animate) {
    clear();
    const my = token;
    index = i;
    const frame = frames[i];
    scene = renderView(frame.view);
    stage.replaceChildren(scene.el);
    // Los guiones de inglés (voz en partes) marcan el inglés con «».
    caption.replaceChildren(...(Array.isArray(frame.voice) ? enText(frame.say) : [frame.say]));
    updateControls();
    if (!animate) {
      scene.finish();
      return;
    }
    let animDone = false;
    let speechDone = !voiceOn();
    let dwellDone = false;
    const check = () => {
      if (my !== token || !playing || !animDone || !speechDone || !dwellDone) return;
      if (index < frames.length - 1) show(index + 1, true);
      else { playing = false; finished = true; updateControls(); }
    };
    later(() => { dwellDone = true; check(); }, voiceOn() ? MIN_FRAME_WITH_VOICE_MS : Math.max(MIN_FRAME_MS, frame.say.length * MS_PER_CHAR));
    scene.play(() => { animDone = true; check(); });
    if (voiceOn()) voice.speak(frame.voice, () => { speechDone = true; check(); });
  }

  function togglePlay() {
    if (playing) {
      playing = false;
      clear();
      voice.stop();
      scene?.finish();
      updateControls();
      return;
    }
    if (finished && index === frames.length - 1) { replay(); return; }
    playing = true;
    finished = false;
    show(index, true);
  }

  function replay() {
    playing = true;
    finished = false;
    show(0, true);
  }

  function step(delta) {
    const next = Math.min(frames.length - 1, Math.max(0, index + delta));
    playing = false;
    voice.stop();
    show(next, false);
    if (voiceOn()) voice.speak(frames[next].voice);
    finished = next === frames.length - 1;
    updateControls();
  }

  drawVoiceButton();
  if (autoplay && !reduced) {
    playing = true;
    show(0, true);
  } else {
    show(0, false);
  }

  return {
    el,
    stop() {
      playing = false;
      clear();
      voice.stop();
      unsubscribe();
    },
  };
}

// Ilustración fija de la escena de un ejercicio (el punto de partida).
export function illustration(view) {
  const scene = renderView(view, { compact: true });
  scene.finish();
  return scene.el;
}
