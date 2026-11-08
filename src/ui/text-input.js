// Respuesta escrita en inglés: un campo de texto con el teclado del sistema
// (sin autocorrector, que daría la respuesta hecha) y el botón Comprobar.
// display repite lo que escribe en el hueco de la frase.

import { h } from './dom.js';

export function createTextInput({ onSubmit, maxLength = 40 }) {
  let disabled = false;
  const display = h('output', { class: 'answer answer-text empty', lang: 'en', 'aria-live': 'polite', 'aria-label': 'Tu respuesta' }, '?');
  const field = h('input', {
    type: 'text',
    class: 'text-answer',
    lang: 'en',
    maxlength: String(maxLength),
    autocomplete: 'off',
    autocapitalize: 'off',
    autocorrect: 'off',
    spellcheck: 'false',
    enterkeyhint: 'done',
    placeholder: 'Escribe en inglés…',
    'aria-label': 'Escribe tu respuesta en inglés',
    onInput: () => render(),
  });

  function render() {
    const value = field.value.trim();
    display.textContent = value === '' ? '?' : value;
    display.classList.toggle('empty', value === '');
  }

  const pad = h('form', {
    class: 'text-pad',
    onSubmit: (event) => {
      event.preventDefault();
      onSubmit(field.value);
    },
  }, field, h('button', { type: 'submit', class: 'key key-submit' }, 'Comprobar ✓'));

  // Al pintar la pantalla, el campo vuelve a cogerse el foco si lo tenía.
  requestAnimationFrame(() => field.focus({ preventScroll: true }));

  return {
    display,
    pad,
    clear() { field.value = ''; render(); },
    markWrong() { field.select(); },
    focus() { if (!disabled) field.focus({ preventScroll: true }); },
    setDisabled(next) {
      disabled = next;
      field.disabled = next;
      pad.classList.toggle('disabled', next);
    },
    destroy() {},
  };
}
