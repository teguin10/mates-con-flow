// Teclado de fracciones (escenario uso-tactil): dos casillas, numerador
// arriba y denominador abajo. Las cifras van a la casilla activa; «↓» baja al
// denominador y «↑» vuelve arriba. Se puede tocar cada casilla. Si el
// denominador queda vacío, la respuesta es un número entero.
// También acepta el teclado físico: cifras, «/» o flechas, borrar e Intro.

import { h } from './dom.js';

const MAX_DIGITS = 3;

export function createFractionKeypad({ onSubmit }) {
  const value = { num: '', den: '' };
  let active = 'num';
  let disabled = false;

  const box = (slot, label) => h('button', {
    type: 'button',
    class: `frac-box frac-box-${slot}`,
    'aria-label': label,
    onClick: () => { if (!disabled) { active = slot; render(); } },
  });
  const numBox = box('num', 'Numerador (arriba)');
  const denBox = box('den', 'Denominador (abajo)');
  const display = h('output', { class: 'answer answer-fraction empty', 'aria-live': 'polite', 'aria-label': 'Tu respuesta' },
    numBox, h('span', { class: 'frac-line', 'aria-hidden': 'true' }), denBox);
  const moveKey = h('button', { type: 'button', class: 'key key-move', onClick: () => press('move') });

  function render() {
    numBox.textContent = value.num || '?';
    denBox.textContent = value.den || '?';
    numBox.classList.toggle('is-active', active === 'num');
    denBox.classList.toggle('is-active', active === 'den');
    numBox.classList.toggle('is-empty', value.num === '');
    denBox.classList.toggle('is-empty', value.den === '');
    display.classList.toggle('empty', value.num === '' && value.den === '');
    moveKey.textContent = active === 'num' ? '↓' : '↑';
    moveKey.setAttribute('aria-label', active === 'num' ? 'Bajar al denominador' : 'Subir al numerador');
  }

  function answer() {
    if (value.num === '') return '';
    return value.den === '' ? value.num : `${value.num}/${value.den}`;
  }

  function press(key) {
    if (key === 'enter') { onSubmit(answer()); return; }
    if (disabled) return;
    if (/^\d$/.test(key)) {
      const current = value[active];
      if (current.length >= MAX_DIGITS) return;
      value[active] = current === '0' ? key : current + key;
    } else if (key === 'move') {
      active = active === 'num' ? 'den' : 'num';
    } else if (key === 'down') {
      active = 'den';
    } else if (key === 'up') {
      active = 'num';
    } else if (key === 'back') {
      if (value[active] === '' && active === 'den') active = 'num';
      value[active] = value[active].slice(0, -1);
    }
    render();
  }

  const digit = (d) => h('button', { type: 'button', class: 'key', onClick: () => press(d) }, d);
  const pad = h('div', { class: 'keypad keypad-fraction' },
    ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit),
    moveKey,
    digit('0'),
    h('button', { type: 'button', class: 'key key-back', 'aria-label': 'Borrar', onClick: () => press('back') }, '⌫'),
    h('button', { type: 'button', class: 'key key-submit', onClick: () => press('enter') }, 'Comprobar ✓'));

  function onKeydown(event) {
    if (event.target instanceof HTMLInputElement || event.ctrlKey || event.metaKey || event.altKey) return;
    if (document.querySelector('.modal')) return;
    if (/^\d$/.test(event.key)) press(event.key);
    else if (event.key === '/' || event.key === 'Divide' || event.key === 'ArrowDown') { event.preventDefault(); press('down'); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); press('up'); }
    else if (event.key === 'Backspace') { event.preventDefault(); press('back'); }
    else if (event.key === 'Enter') { event.preventDefault(); press('enter'); }
  }
  document.addEventListener('keydown', onKeydown);
  render();

  return {
    display,
    pad,
    clear() { value.num = ''; value.den = ''; active = 'num'; render(); },
    setDisabled(next) { disabled = next; pad.classList.toggle('disabled', next); },
    destroy() { document.removeEventListener('keydown', onKeydown); },
  };
}
