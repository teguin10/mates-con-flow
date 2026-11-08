// Voces del propio aparato: una española para narrar y una inglesa para el
// inglés (en-GB si la hay, como el libro; si no, cualquier en-*). Solo usa
// voces locales (localService) para que el texto no salga del aparato
// (ADR 0001). Sin voz española, `available` es false y la interfaz no muestra
// el botón de voz; sin voz inglesa, `hasEnglish` es false y no salen los
// ejercicios de escuchar.

const ES_RATE = 0.95;
const EN_RATE = 0.85;
const EN_SLOW_RATE = 0.6;

export function createVoice() {
  const synth = globalThis.speechSynthesis ?? null;
  const listeners = new Set();
  const voices = { es: null, en: null };
  let fallback = null;
  let current = 0;
  const speakingListeners = new Set();
  const setSpeaking = (on) => speakingListeners.forEach((cb) => cb(on));

  function pick() {
    if (!synth) return;
    const local = synth.getVoices().filter((v) => v.localService);
    const of = (lang, preferred) => {
      const all = local.filter((v) => new RegExp(`^${lang}`, 'i').test(v.lang));
      return all.find((v) => preferred.test(v.lang)) ?? all[0] ?? null;
    };
    const next = { es: of('es', /^es[-_]ES/i), en: of('en', /^en[-_]GB/i) };
    const changed = next.es?.voiceURI !== voices.es?.voiceURI || next.en?.voiceURI !== voices.en?.voiceURI;
    Object.assign(voices, next);
    if (changed) listeners.forEach((cb) => cb());
  }

  if (synth) {
    pick();
    synth.addEventListener?.('voiceschanged', pick);
  }

  function stop() {
    current += 1;
    clearTimeout(fallback);
    synth?.cancel();
    setSpeaking(false);
  }

  /**
   * input: texto en español o lista de partes [{ lang: 'es' | 'en', text }].
   * Las partes de un idioma sin voz se saltan. slow: el inglés, más despacio.
   */
  function speak(input, onEnd = () => {}, { slow = false } = {}) {
    const parts = (typeof input === 'string' ? [{ lang: 'es', text: input }] : input)
      .filter((p) => p.text?.trim() && voices[p.lang]);
    if (parts.length === 0) { onEnd(); return; }
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
    const length = parts.reduce((sum, p) => sum + p.text.length, 0);
    // Algunos navegadores no avisan del final: no dejamos el vídeo parado.
    fallback = setTimeout(end, (2500 + length * 90) * (slow ? 1.6 : 1));
    parts.forEach((part, i) => {
      const utterance = new SpeechSynthesisUtterance(part.text);
      utterance.voice = voices[part.lang];
      utterance.lang = voices[part.lang].lang;
      utterance.rate = part.lang === 'en' ? (slow ? EN_SLOW_RATE : EN_RATE) : ES_RATE;
      if (i === parts.length - 1) {
        utterance.onend = end;
        utterance.onerror = end;
      }
      synth.speak(utterance);
    });
  }

  return {
    get available() { return Boolean(voices.es); },
    get hasEnglish() { return Boolean(voices.en); },
    onChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    // Avisa cuando empieza y termina de hablar (para bajar la música).
    onSpeaking(cb) {
      speakingListeners.add(cb);
      return () => speakingListeners.delete(cb);
    },
    speak,
    /** Lee un texto en inglés (escuchar y repetir). */
    speakEnglish(text, onEnd = () => {}, options = {}) {
      speak([{ lang: 'en', text }], onEnd, options);
    },
    stop,
  };
}
