// Música de fondo estilo trap y sonidos, sintetizados con Web Audio: sin
// archivos, sin red y sin copyright. El navegador solo deja empezar a sonar
// tras un toque de la usuaria, así que todo arranca desde un gesto.

const BPM = 140;
const STEP = 60 / BPM / 4; // semicorchea
const STEPS = 64; // 4 compases
const LOOKAHEAD = 0.12;
const MUSIC_LEVEL = 0.32;
const DUCKED_LEVEL = 0.08;

// La menor: La, Fa, Sol, Mi (graves del 808) y una campanita pentatónica.
const BASS = [55, 43.65, 49, 41.2];
const BELL = [440, 523.25, 659.25, 587.33, 523.25, 440, 392, 440];

export function createAudio() {
  let ctx = null;
  let master;
  let musicGain;
  let sfxGain;
  let noise;
  let timer = null;
  let nextTime = 0;
  let step = 0;
  let playing = false;
  let ducked = false;

  function ensure() {
    if (!ctx) {
      const AudioCtx = globalThis.AudioContext ?? globalThis.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0;
      musicGain.connect(master);
      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.45;
      sfxGain.connect(master);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function envelope(gainNode, t, peak, decay) {
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.exponentialRampToValueAtTime(peak, t + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  }

  function tone(t, freq, { type = 'sine', peak = 0.3, decay = 0.3, out = musicGain, slideTo = null } = {}) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + 0.08);
    envelope(g, t, peak, decay);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + decay + 0.05);
  }

  function noiseHit(t, { filter = 'highpass', freq = 7000, peak = 0.2, decay = 0.05 } = {}) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = filter;
    f.frequency.value = freq;
    const g = ctx.createGain();
    envelope(g, t, peak, decay);
    src.connect(f).connect(g).connect(musicGain);
    src.start(t);
    src.stop(t + decay + 0.05);
  }

  function schedule(i, t) {
    const bar = Math.floor(i / 16);
    const s = i % 16;
    // 808: golpe con caída de tono y cola grave.
    if (s === 0 || s === 10 || (bar === 3 && s === 14)) {
      tone(t, BASS[bar] * 3, { peak: 0.9, decay: 0.6, slideTo: BASS[bar] });
    }
    // Palmada en el tiempo 3 (medio tiempo).
    if (s === 8) {
      noiseHit(t, { filter: 'bandpass', freq: 1800, peak: 0.5, decay: 0.18 });
      tone(t, 190, { type: 'triangle', peak: 0.15, decay: 0.08 });
    }
    // Charles en corcheas, con redobles al final de los compases 2 y 4.
    const roll = (bar === 1 || bar === 3) && s >= 12;
    if (s % 2 === 0 || roll) noiseHit(t, { peak: roll ? 0.12 : 0.18, decay: 0.04 });
    // Campanita.
    if (s === 0 || s === 3 || s === 6 || s === 11) {
      tone(t, BELL[(bar * 2 + Math.floor(s / 6)) % BELL.length], { peak: 0.09, decay: 0.45 });
    }
  }

  function tick() {
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      schedule(step, nextTime);
      nextTime += STEP;
      step = (step + 1) % STEPS;
    }
  }

  function setMusicLevel(level, time = 0.15) {
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setTargetAtTime(level, ctx.currentTime, time);
  }

  return {
    get musicPlaying() { return playing; },
    startMusic() {
      if (playing || !ensure()) return;
      playing = true;
      step = 0;
      nextTime = ctx.currentTime + 0.05;
      setMusicLevel(ducked ? DUCKED_LEVEL : MUSIC_LEVEL, 0.4);
      timer = setInterval(tick, 25);
    },
    stopMusic() {
      if (!playing) return;
      playing = false;
      clearInterval(timer);
      timer = null;
      setMusicLevel(0, 0.05);
    },
    duck(on) {
      ducked = on;
      if (playing) setMusicLevel(on ? DUCKED_LEVEL : MUSIC_LEVEL);
    },
    sfx(kind) {
      if (!ensure()) return;
      const t = ctx.currentTime + 0.01;
      const out = sfxGain;
      if (kind === 'correct') {
        tone(t, 783.99, { peak: 0.35, decay: 0.25, out });
        tone(t + 0.1, 1046.5, { peak: 0.35, decay: 0.4, out });
      } else if (kind === 'wrong') {
        tone(t, 220, { type: 'triangle', peak: 0.3, decay: 0.25, out, slideTo: 160 });
      } else if (kind === 'fanfare') {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(t + i * 0.09, f, { peak: 0.3, decay: 0.5, out }));
      }
    },
  };
}
