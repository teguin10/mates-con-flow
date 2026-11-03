// Narración con la voz en español del propio aparato. Solo usa voces locales
// (localService) para que el texto no salga del aparato (ADR 0001). Si no hay
// ninguna, `available` es false y la interfaz no muestra el botón de voz.

export function createVoice() {
  const synth = globalThis.speechSynthesis ?? null;
  const listeners = new Set();
  let voice = null;
  let fallback = null;
  let current = 0;
  const speakingListeners = new Set();
  const setSpeaking = (on) => speakingListeners.forEach((cb) => cb(on));

  function pick() {
    if (!synth) return;
    const local = synth.getVoices().filter((v) => /^es/i.test(v.lang) && v.localService);
    const next = local.find((v) => /^es[-_]ES/i.test(v.lang)) ?? local[0] ?? null;
    const changed = next?.voiceURI !== voice?.voiceURI;
    voice = next;
    if (changed) listeners.forEach((cb) => cb());
  }

  if (synth) {
    pick();
    synth.addEventListener?.('voiceschanged', pick);
  }

  return {
    get available() { return Boolean(voice); },
    onChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    // Avisa cuando empieza y termina de hablar (para bajar la música).
    onSpeaking(cb) {
      speakingListeners.add(cb);
      return () => speakingListeners.delete(cb);
    },
    speak(text, onEnd = () => {}) {
      if (!voice) { onEnd(); return; }
      synth.cancel();
      clearTimeout(fallback);
      current += 1;
      const id = current;
      let ended = false;
      const end = () => {
        if (ended) return;
        ended = true;
        if (id === current) { clearTimeout(fallback); setSpeaking(false); }
        onEnd();
      };
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.95;
      utterance.onend = end;
      utterance.onerror = end;
      // Algunos navegadores no avisan del final: no dejamos el vídeo parado.
      fallback = setTimeout(end, 2500 + text.length * 90);
      synth.speak(utterance);
    },
    stop() {
      current += 1;
      clearTimeout(fallback);
      synth?.cancel();
      setSpeaking(false);
    },
  };
}
