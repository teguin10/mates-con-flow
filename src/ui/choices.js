// Respuesta con botones (comparar con <, =, >, elegir un número o una
// palabra). Un toque responde. Las opciones falladas se tachan para no
// repetirlas. lang: el idioma de las opciones si no es español ('en').

import { h } from './dom.js';

export function createChoices({ choices, onSubmit, lang = null }) {
  let disabled = false;
  const display = h('output', { class: 'answer empty', 'aria-live': 'polite', 'aria-label': 'Tu respuesta' }, '?');
  const signs = choices.every((c) => c.length === 1);
  const words = choices.some((c) => c.length > 4);
  const buttons = new Map();

  function press(choice) {
    if (disabled || buttons.get(choice)?.disabled) return;
    display.textContent = choice;
    display.classList.remove('empty');
    onSubmit(choice);
  }

  const kind = signs ? 'choices-signs' : words ? 'choices-words' : 'choices-numbers';
  const pad = h('div', { class: `choices ${kind}` },
    choices.map((choice) => {
      const button = h('button', { type: 'button', class: 'choice', lang, onClick: () => press(choice) }, choice);
      buttons.set(choice, button);
      return button;
    }));

  function onKeydown(event) {
    if (event.target instanceof HTMLInputElement || event.ctrlKey || event.metaKey || event.altKey) return;
    if (document.querySelector('.modal')) return;
    if (event.key === 'Enter') { event.preventDefault(); onSubmit(null); return; }
    if (choices.includes(event.key)) { press(event.key); return; }
    const index = Number(event.key) - 1;
    if (!signs && Number.isInteger(index) && index >= 0 && index < choices.length) press(choices[index]);
  }
  document.addEventListener('keydown', onKeydown);

  return {
    display,
    pad,
    clear() { display.textContent = '?'; display.classList.add('empty'); },
    markWrong(choice) {
      const button = buttons.get(choice);
      if (button) { button.disabled = true; button.classList.add('wrong'); }
    },
    setDisabled(next) { disabled = next; pad.classList.toggle('disabled', next); },
    destroy() { document.removeEventListener('keydown', onKeydown); },
  };
}
