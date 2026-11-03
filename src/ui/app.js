// Pantallas y navegación por hash (#/, #/bienvenida, #/tema/<id>,
// #/tema/<id>/explicacion, #/album, #/panel). Solo traduce el estado del núcleo a la
// pantalla: las reglas viven en src/core.

import { h, pickRandom } from './dom.js';
import { createKeypad } from './keypad.js';
import { createChoices } from './choices.js';
import { createFractionKeypad } from './fraction-keypad.js';
import { mathText } from './math-text.js';
import { createAudio } from './audio.js';
import { renderAlbum } from './album.js';
import { stickerSvg } from './stickers.js';
import { MASCOT_OPTIONS, MESSAGES, mascotSvg, mascotView } from './mascot.js';
import { createPlayer, illustration } from './explainer.js';
import { createVoice } from './voice.js';
import { renderPanel } from './panel.js';
import { BLOCKS, TOPICS, UPCOMING, getTopic, recommendedTopic } from '../core/topics/index.js';
import { activeStyle, grantStickers, STICKERS, STYLES, unlockedStyles, withStyle } from '../core/game/rewards.js';
import { applyExerciseResult, hitsInWindow, LEVEL_UP_HITS } from '../core/game/rules.js';
import { checkExerciseAnswer, formatAnswer } from '../core/math/answer.js';
import { formatFraction } from '../core/math/fraction.js';
import { createTopicProgress, defaultMascotName, withProfile, withSettings } from '../core/progress/schema.js';
import { createRng } from '../core/random.js';

const RECENT_LIMIT = 5;

export function parseRoute(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'bienvenida') return { name: 'onboarding' };
  if (parts[0] === 'panel') return { name: 'panel' };
  if (parts[0] === 'album') return { name: 'album' };
  if (parts[0] === 'tema' && parts[1]) return { name: parts[2] === 'explicacion' ? 'intro' : 'practice', topicId: parts[1] };
  return { name: 'home' };
}

export function startApp(root, { store, now, seed }) {
  const state = {
    doc: store.load(now()),
    rng: createRng(seed),
    recent: {},
    panelUnlocked: false,
    cleanup: null,
    voice: createVoice(),
    audio: createAudio(),
    players: new Set(),
  };
  state.voice.onSpeaking((on) => state.audio.duck(on));
  // El navegador solo deja sonar tras un gesto: si la música estaba puesta,
  // arranca con el primer toque o tecla.
  const resumeMusic = () => { if (state.doc.settings.music) state.audio.startMusic(); };
  document.addEventListener('pointerdown', resumeMusic, { once: true });
  document.addEventListener('keydown', resumeMusic, { once: true });
  const toastBox = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' });
  document.body.append(toastBox);
  let toastTimer;

  function toast(message) {
    toastBox.textContent = message;
    toastBox.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastBox.classList.remove('show'), 2600);
  }

  function save(doc) {
    state.doc = doc;
    if (!store.save(doc)) toast('No he podido guardar tu progreso 😕');
  }

  const nickname = () => state.doc.profile.nickname;
  const sfx = (kind) => { if (state.doc.settings.sounds) state.audio.sfx(kind); };

  function audioToggles() {
    const { music, sounds } = state.doc.settings;
    const el = h('div', { class: 'audio-toggles' },
      h('button', {
        type: 'button',
        class: `toggle ${music ? 'on' : 'off'}`,
        'aria-pressed': String(music),
        'aria-label': music ? 'Quitar la música' : 'Poner la música',
        title: 'Música',
        onClick: () => {
          save(withSettings(state.doc, { music: !music }));
          if (state.doc.settings.music) state.audio.startMusic(); else state.audio.stopMusic();
          el.replaceWith(audioToggles());
        },
      }, '🎵'),
      h('button', {
        type: 'button',
        class: `toggle ${sounds ? 'on' : 'off'}`,
        'aria-pressed': String(sounds),
        'aria-label': sounds ? 'Quitar los sonidos' : 'Poner los sonidos',
        title: 'Sonidos',
        onClick: () => {
          save(withSettings(state.doc, { sounds: !sounds }));
          if (state.doc.settings.sounds) state.audio.sfx('correct');
          el.replaceWith(audioToggles());
        },
      }, sounds ? '🔔' : '🔕'));
    return el;
  }

  // Si ya hay un aviso abierto, se junta con el nuevo en uno solo.
  let shownStickers = [];
  function showStickers(ids) {
    const open = document.querySelector('.modal');
    if (open) open.remove();
    else shownStickers = [];
    shownStickers = [...shownStickers, ...ids];
    const list = shownStickers.map((id) => STICKERS.find((st) => st.id === id)).filter(Boolean);
    if (list.length === 0) return;
    const close = () => { overlay.remove(); shownStickers = []; };
    const overlay = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Pegatina nueva' },
      h('div', { class: 'modal-card' },
        h('p', { class: 'modal-kicker' }, list.length > 1 ? `¡${list.length} pegatinas nuevas!` : '¡Pegatina nueva!'),
        h('div', { class: 'modal-stickers' }, list.map((st) => h('figure', {}, stickerSvg(st.art), h('figcaption', {}, st.name)))),
        h('div', { class: 'actions' },
          h('a', { href: '#/album', class: 'btn btn-ghost', onClick: close }, 'Ver álbum'),
          h('button', { type: 'button', class: 'btn btn-primary', onClick: close }, '¡Genial!'))));
    document.body.append(overlay);
    overlay.querySelector('.btn-primary').focus({ preventScroll: true });
  }
  const topicProgress = (id) => state.doc.topics[id] ?? createTopicProgress();

  // Reproductor de explicación animada; al cambiar de pantalla se paran todos.
  function player(frames, options = {}) {
    const created = createPlayer({
      frames,
      voice: state.voice,
      getVoiceOn: () => state.doc.settings.voice,
      setVoiceOn: (on) => save(withSettings(state.doc, { voice: on })),
      ...options,
    });
    state.players.add(created);
    return created;
  }

  function stopPlayer(created) {
    if (!created) return;
    created.stop();
    state.players.delete(created);
  }

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function render() {
    state.cleanup?.();
    state.cleanup = null;
    state.players.forEach((p) => p.stop());
    state.players.clear();
    document.documentElement.dataset.style = activeStyle(state.doc);
    const route = parseRoute(location.hash);
    if (route.name !== 'panel') state.panelUnlocked = false;
    let screen;
    if (!state.doc.profile.mascot && route.name !== 'panel') screen = renderOnboarding();
    else if (route.name === 'onboarding') screen = renderOnboarding();
    else if (route.name === 'panel') screen = renderPanelScreen();
    else if (route.name === 'album') screen = renderAlbum({ doc: state.doc, onStyle: (id) => { save(withStyle(state.doc, id)); render(); } });
    else if (route.name === 'intro' || route.name === 'practice') {
      const topic = getTopic(route.topicId);
      if (!topic) { go('#/'); return; }
      screen = route.name === 'intro' ? renderIntro(topic) : renderPractice(topic);
    } else screen = renderHome();
    root.replaceChildren(screen);
    window.scrollTo(0, 0);
  }

  // ---------- Bienvenida ----------
  function renderOnboarding() {
    const current = state.doc.profile.mascot;
    let kind = current?.kind ?? null;
    const nameInput = h('input', { type: 'text', maxlength: '20', value: current?.name ?? '', autocomplete: 'off', enterkeyhint: 'next' });
    const nickInput = h('input', {
      type: 'text', maxlength: '20', value: current ? nickname() : '', placeholder: 'Tu nombre o apodo', autocomplete: 'off', enterkeyhint: 'done',
    });
    const suggestions = h('div', { class: 'chips' });
    const choices = h('div', { class: 'mascot-choices' });

    function drawChoices() {
      choices.replaceChildren(...MASCOT_OPTIONS.map((option) => h('button', {
        type: 'button',
        class: `mascot-choice ${kind === option.kind ? 'selected' : ''}`,
        'aria-pressed': String(kind === option.kind),
        onClick: () => { kind = option.kind; drawChoices(); },
      }, mascotSvg(option.kind, kind === option.kind ? 'happy' : 'neutral'), h('span', {}, option.label))));
      const option = MASCOT_OPTIONS.find((o) => o.kind === kind);
      nameInput.placeholder = option ? option.names[0] : 'Elige primero una mascota';
      suggestions.replaceChildren(...(option?.names ?? []).map((name) => h('button', {
        type: 'button', class: 'chip', onClick: () => { nameInput.value = name; },
      }, name)));
    }
    drawChoices();

    const form = h('form', {
      class: 'screen onboarding',
      onSubmit: (event) => {
        event.preventDefault();
        if (!kind) { toast('Elige una mascota 🙂'); return; }
        if (!nickInput.value.trim()) { toast('Escribe cómo quieres que te llame 🙂'); nickInput.focus(); return; }
        save(withProfile(state.doc, {
          nickname: nickInput.value,
          mascot: { kind, name: nameInput.value || defaultMascotName(kind) },
        }));
        go('#/');
      },
    },
    h('h1', {}, current ? 'Cambia tu mascota' : '¡Hola! 👋'),
    h('p', { class: 'lead' }, 'Elige quién te va a acompañar mientras practicas.'),
    choices,
    h('label', { class: 'field' }, '¿Cómo se llama tu mascota?', nameInput),
    suggestions,
    h('label', { class: 'field' }, '¿Y cómo quieres que te llame?', nickInput),
    h('button', { type: 'submit', class: 'btn btn-primary btn-big' }, '¡Vamos! ✨'),
    current ? h('a', { href: '#/', class: 'btn btn-ghost' }, 'Cancelar') : null);
    return form;
  }

  // ---------- Inicio ----------
  function statChips({ streakOverride } = {}) {
    const streak = streakOverride ?? state.doc.streak;
    return h('div', { class: 'chips stats-chips' },
      h('span', { class: 'chip chip-stat', title: 'Puntos' }, `⭐ ${state.doc.points}`),
      h('span', { class: 'chip chip-stat', title: 'Racha' }, `🔥 ${streak}`),
      h('span', { class: 'chip chip-stat', title: 'Mejor racha' }, `🏆 ${state.doc.bestStreak}`));
  }

  function levelProgress(topic) {
    const tp = topicProgress(topic.id);
    if (tp.mastered && tp.level === topic.maxLevel) {
      return h('div', { class: 'level-progress' }, h('span', { class: 'level-label' }, `👑 Dominado · Nivel ${tp.level}`));
    }
    const hits = Math.min(hitsInWindow(tp), LEVEL_UP_HITS);
    const bar = h('div', { class: 'bar-fill' });
    bar.style.width = `${(hits / LEVEL_UP_HITS) * 100}%`;
    const goal = tp.level === topic.maxLevel ? 'para dominarlo' : 'para subir';
    return h('div', { class: 'level-progress' },
      h('span', { class: 'level-label' }, `Nivel ${tp.level} · ${topic.levelNames[tp.level]} — ${hits}/${LEVEL_UP_HITS} ${goal}`),
      h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(LEVEL_UP_HITS), 'aria-valuenow': String(hits) }, bar));
  }

  // Tarjetas de los temas de un bloque, con «⭐ Siguiente» en el aconsejado del bloque.
  function topicCards(topics) {
    const recommended = recommendedTopic(state.doc, topics);
    return topics.map((topic) => {
      const never = topicProgress(topic.id).stats.exercises === 0;
      const next = recommended === topic;
      return h('article', { class: `card topic-card ${next ? 'is-next' : ''}` },
        h('div', { class: 'topic-head' }, h('span', { class: 'emoji' }, topic.emoji),
          h('div', {}, h('h3', {}, topic.title)),
          next ? h('span', { class: 'badge' }, '⭐ Siguiente') : null),
        levelProgress(topic),
        h('div', { class: 'actions' },
          h('a', { class: 'btn btn-primary', href: never ? `#/tema/${topic.id}/explicacion` : `#/tema/${topic.id}` }, never ? '¡Empezar!' : '¡A practicar!'),
          h('a', { class: 'btn btn-ghost', href: `#/tema/${topic.id}/explicacion` }, 'Ver explicación')));
    });
  }

  function renderHome() {
    const { mascot } = state.doc.profile;
    return h('div', { class: 'screen home' },
      h('header', { class: 'hero' },
        mascotView(mascot, 'happy', 'big'),
        h('div', { class: 'bubble' }, h('strong', {}, mascot.name), h('span', {}, pickRandom(MESSAGES.greet(nickname()))))),
      h('div', { class: 'home-bar' },
        statChips(),
        h('a', { href: '#/album', class: 'chip chip-link' }, `🎨 Álbum ${Object.keys(state.doc.rewards.stickers).length}/${STICKERS.length}`),
        audioToggles()),
      BLOCKS.map((block) => [h('h2', {}, block.name), topicCards(block.topics)]),
      h('h2', {}, 'Muy pronto'),
      h('div', { class: 'upcoming' }, UPCOMING.map((u) => h('div', { class: 'card locked' },
        h('span', { class: 'emoji' }, u.emoji), h('span', {}, u.title), h('span', { class: 'lock', 'aria-label': 'Bloqueado' }, '🔒')))),
      h('footer', { class: 'footer' },
        h('a', { href: '#/bienvenida' }, `Cambiar mascota o apodo`),
        h('a', { href: '#/panel' }, 'Zona padres 🔒')));
  }

  // ---------- Explicación ----------
  function renderIntro(topic) {
    let index = 0;
    let video = null;
    const screen = h('div', { class: 'screen intro' });
    function draw() {
      const slide = topic.intro[index];
      stopPlayer(video);
      video = slide.frames ? player(slide.frames, { title: '🎬 Míralo en vídeo' }) : null;
      const last = index === topic.intro.length - 1;
      screen.replaceChildren(
        h('div', { class: 'topbar' }, h('a', { href: '#/', class: 'btn btn-ghost' }, '← Inicio'),
          h('span', { class: 'muted' }, `${index + 1} / ${topic.intro.length}`)),
        h('article', { class: 'card slide' },
          h('h2', {}, slide.title),
          slide.paragraphs.map((p) => h('p', {}, p)),
          video?.el),
        h('div', { class: 'row' },
          index > 0 ? h('button', { type: 'button', class: 'btn btn-ghost', onClick: () => { index -= 1; draw(); } }, '← Anterior') : h('span'),
          last
            ? h('a', { class: 'btn btn-primary', href: `#/tema/${topic.id}` }, '¡A practicar! 🚀')
            : h('button', { type: 'button', class: 'btn btn-primary', onClick: () => { index += 1; draw(); } }, 'Siguiente →')));
    }
    draw();
    return screen;
  }

  // ---------- Práctica ----------
  function renderPractice(topic) {
    const screen = h('div', { class: 'screen practice' });
    const recent = (state.recent[topic.id] ??= []);
    let input = null;
    state.cleanup = () => input?.destroy();

    let exercise;
    let wrong;
    let finished;
    let mood;
    let message;
    let effect;
    let helpViewed;
    let hintVideo;
    let explainVideo;
    let picture;
    let scrollTo;
    let simplifiedNote;

    function showExplanation() {
      if (explainVideo) return;
      stopPlayer(hintVideo);
      hintVideo = null;
      explainVideo = player(exercise.frames, { title: '🎬 Así se hace' });
      scrollTo = explainVideo.el;
    }

    function askHow() {
      if (finished) return;
      helpViewed = true;
      mood = 'happy';
      message = 'Mira el vídeo y luego responde 💡 (este valdrá 2 puntos)';
      showExplanation();
      draw();
    }

    function newExercise() {
      exercise = topic.generate(state.rng, topicProgress(topic.id).level, recent);
      recent.push(exercise.id);
      if (recent.length > RECENT_LIMIT) recent.shift();
      stopPlayer(hintVideo);
      stopPlayer(explainVideo);
      hintVideo = null;
      explainVideo = null;
      helpViewed = false;
      picture = exercise.illustration ? illustration(exercise.illustration) : null;
      input?.destroy();
      if (exercise.answerType === 'choice') input = createChoices({ choices: exercise.choices, onSubmit: submit });
      else if (exercise.answerType === 'fraction') input = createFractionKeypad({ onSubmit: submit });
      else input = createKeypad({ onSubmit: submit });
      simplifiedNote = null;
      wrong = 0;
      finished = null;
      effect = null;
      mood = 'neutral';
      message = pickRandom(MESSAGES.start(nickname()));
      draw();
    }

    function finish(solved) {
      const attemptsUsed = wrong + (solved ? 1 : 0);
      const result = applyExerciseResult(state.doc, topic.id, topic.maxLevel, { form: exercise.form, attemptsUsed, solved, helpViewed }, now());
      const stylesBefore = unlockedStyles(state.doc).length;
      const rewarded = grantStickers(result.doc, TOPICS, now());
      save(rewarded.doc);
      finished = { solved, events: result.events, stickers: rewarded.granted };
      input.setDisabled(true);
      const { events } = result;
      const newStyles = STYLES.filter((st) => st.points <= state.doc.points).slice(stylesBefore);
      if (newStyles.length > 0) toast(`🎨 Nuevo estilo desbloqueado: ${newStyles.map((st) => st.name).join(', ')}`);
      if (events.levelUp || events.mastered || rewarded.granted.length > 0) sfx('fanfare');
      if (rewarded.granted.length > 0) setTimeout(() => showStickers(rewarded.granted), 900);
      if (events.mastered) message = pickRandom(MESSAGES.mastered(nickname()));
      else if (events.levelUp) message = pickRandom(MESSAGES.levelUp(nickname()));
      else if (events.levelDown) message = pickRandom(MESSAGES.levelDown());
    }

    function submit(value) {
      if (finished) { newExercise(); return; }
      const result = value === null ? { status: 'invalid' } : checkExerciseAnswer(exercise, value);
      if (result.status === 'almost') {
        mood = 'happy';
        effect = null;
        message = '¡Casi! Vale lo mismo, pero aún se puede simplificar más 😉';
        draw();
        return;
      }
      if (result.status === 'invalid') {
        message = exercise.answerType === 'choice' ? 'Toca una de las opciones 😉' : pickRandom(MESSAGES.invalid());
        effect = null;
        draw();
        return;
      }
      if (result.status === 'correct') {
        mood = 'party';
        effect = 'win';
        message = pickRandom(wrong === 0 && !helpViewed ? MESSAGES.correct(nickname()) : MESSAGES.correctLate(nickname()));
        if (result.simplified) simplifiedNote = formatFraction(result.simplified);
        sfx('correct');
        finish(true);
      } else {
        wrong += 1;
        effect = 'shake';
        sfx('wrong');
        input.clear();
        input.markWrong?.(value);
        if (wrong === 1) {
          mood = 'oops';
          message = pickRandom(MESSAGES.wrong1());
          if (!explainVideo) { hintVideo = player(exercise.hintFrames, { title: '💡 Pista en vídeo' }); scrollTo = hintVideo.el; }
        } else if (wrong === 2) {
          mood = 'oops';
          message = pickRandom(MESSAGES.wrong2());
          showExplanation();
        }
        else { mood = 'neutral'; message = pickRandom(MESSAGES.reveal()); finish(false); }
      }
      draw();
    }

    function skip() {
      if (finished) return;
      mood = 'neutral';
      effect = null;
      message = pickRandom(MESSAGES.reveal());
      finish(false);
      draw();
    }

    function resultBanner() {
      if (!finished) return null;
      const { solved, events } = finished;
      const lines = [];
      if (solved) lines.push(h('p', { class: 'points-pop' }, `+${events.points} ⭐`));
      else lines.push(h('p', {}, `La respuesta era ${formatAnswer(exercise)}.`));
      if (solved && simplifiedNote) lines.push(h('p', { class: 'simplified' }, '¡Bien! Y simplificada sería ', h('span', { class: 'math' }, mathText(simplifiedNote)), ' ✨'));
      if (events.bonus) lines.push(h('p', { class: 'bonus' }, `+${events.bonus} de bonus por racha de ${events.streak} 🔥`));
      const level = topicProgress(topic.id).level;
      if (events.mastered) lines.push(h('p', { class: 'level-up' }, `👑 ¡Has dominado ${topic.title}!`));
      else if (events.levelUp) lines.push(h('p', { class: 'level-up' }, `🎉 ¡Subes a Nivel ${level} · ${topic.levelNames[level]}!`));
      else if (events.levelDown) lines.push(h('p', { class: 'level-down' }, `Ahora en Nivel ${level} para coger carrerilla 💪`));
      for (const id of finished.stickers) {
        const sticker = STICKERS.find((st) => st.id === id);
        if (sticker) lines.push(h('p', { class: 'level-up' }, `🏷️ ¡Pegatina nueva: ${sticker.name}!`));
      }
      return h('div', { class: `result ${solved ? 'is-win' : 'is-miss'}` }, lines);
    }

    // La expresión con el hueco de la respuesta (□) en su sitio.
    function expressionView(ex, display) {
      const size = ex.expression.length > 22 ? ' is-long' : '';
      if (/\d\/\d|□\/|\/□/.test(ex.expression) || ex.answerType === 'fraction') {
        return h('p', { class: `expression has-fractions${size}` }, mathText(ex.expression, display));
      }
      if (ex.expression.includes('□')) {
        const [before, after] = ex.expression.split('□').map((t) => t.trim());
        return h('p', { class: `expression${size}` }, before ? h('span', {}, before) : null, display, after ? h('span', {}, after) : null);
      }
      if (ex.answerType === 'choice') return h('p', { class: `expression is-question${size}` }, h('span', {}, ex.expression), display);
      return h('p', { class: `expression${size}` }, h('span', {}, `${ex.expression} =`), display);
    }

    function draw() {
      const level = topicProgress(topic.id).level;
      const brokenStreak = wrong > 0 && !finished;
      const card = h('article', { class: `card exercise ${effect === 'shake' ? 'shake' : ''} ${effect === 'win' ? 'win' : ''}` },
        h('p', { class: 'story' }, exercise.story),
        picture ? h('div', { class: 'illustration' }, picture) : null,
        expressionView(exercise, input.display),
        !finished && !explainVideo
          ? h('button', { type: 'button', class: 'btn btn-ghost how', onClick: askHow }, '¿Cómo se hace? 🎬')
          : null);
      const feedback = [];
      if (wrong >= 1) {
        feedback.push(h('div', { class: 'card hint' }, h('strong', {}, '💡 Pista'), h('p', {}, exercise.hint), explainVideo ? null : hintVideo?.el));
      }
      if (explainVideo) {
        feedback.push(h('div', { class: 'card explanation' },
          explainVideo.el,
          h('strong', {}, '📒 Paso a paso'),
          h('ol', {}, exercise.steps.map((step) => h('li', {}, step)))));
      }
      // replaceChildren escribiría «null» por cada hueco vacío: se filtran.
      screen.replaceChildren(...[
        h('div', { class: 'topbar' },
          h('a', { href: '#/', class: 'btn btn-ghost' }, '← Inicio'),
          h('span', { class: 'chip' }, `Nv ${level}`),
          statChips({ streakOverride: brokenStreak ? 0 : undefined }),
          audioToggles()),
        levelProgress(topic),
        h('div', { class: 'coach' }, mascotView(state.doc.profile.mascot, mood, 'small'), h('div', { class: 'bubble' }, message)),
        card,
        resultBanner(),
        ...feedback,
        finished
          ? h('button', { type: 'button', class: 'btn btn-primary btn-big next', onClick: newExercise }, 'Siguiente →')
          : input.pad,
        !finished && wrong >= 2 ? h('button', { type: 'button', class: 'btn btn-ghost', onClick: skip }, 'Pasar a otro ejercicio') : null,
      ].filter(Boolean));
      if (effect === 'win') burst(screen);
      effect = null;
      if (scrollTo) {
        const target = scrollTo;
        scrollTo = null;
        requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
      }
      if (finished) screen.querySelector('.next')?.focus({ preventScroll: true });
    }

    newExercise();
    return screen;
  }

  function burst(container) {
    const layer = h('div', { class: 'burst', 'aria-hidden': 'true' });
    for (let i = 0; i < 14; i += 1) {
      const star = h('span', {}, pickRandom(['⭐', '💖', '✨', '🔥']));
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 0.3}s`;
      layer.append(star);
    }
    container.append(layer);
    setTimeout(() => layer.remove(), 1600);
  }

  // ---------- Zona padres ----------
  function renderPanelScreen() {
    return renderPanel({
      doc: state.doc,
      warning: store.warning,
      topics: TOPICS,
      unlocked: state.panelUnlocked,
      onSave: (doc) => { save(doc); state.panelUnlocked = true; toast('PIN guardado'); render(); },
      onUnlock: () => { state.panelUnlocked = true; render(); },
      onLock: () => { state.panelUnlocked = false; go('#/'); },
    });
  }

  window.addEventListener('hashchange', render);
  render();
}
