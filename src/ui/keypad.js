// Teclado numérico propio (escenario uso-tactil): en móvil y tablet no se abre
// el teclado del sistema. También acepta el teclado físico. Con decimal, la
// tecla del signo pasa a ser la coma (los decimales son positivos).

import { h } from './dom.js';

const MINUS = '−';
const KEYS = [
  ['1', '1'], ['2', '2'], ['3', '3'],
  ['4', '4'], ['5', '5'], ['6', '6'],
  ['7', '7'], ['8', '8'], ['9', '9'],
  ['-', `+/${MINUS}`], ['0', '0'], ['back', '⌫'],
];
const LABELS = { '-': 'Cambiar signo', ',': 'Coma decimal', back: 'Borrar' };

export function createKeypad({ onSubmit, maxDigits = 4, decimal = false }) {
  let value = '';
  let disabled = false;

  const display = h('output', { class: 'answer empty', 'aria-live': 'polite', 'aria-label': 'Tu respuesta' }, '?');

  function render() {
    display.textContent = value === '' ? '?' : value.replace('-', MINUS);
    display.classList.toggle('empty', value === '');
  }

  function press(key) {
    if (key === 'enter') {
      onSubmit(value);
      return;
    }
    if (disabled) return;
    const negative = value.startsWith('-');
    const digits = negative ? value.slice(1) : value;
    if (decimal) {
      if (/^\d$/.test(key) && value.replace(',', '').length < maxDigits) value = value === '0' ? key : value + key;
      else if (key === ',' && !value.includes(',')) value = `${value || '0'},`;
      else if (key === 'back') value = value.slice(0, -1);
      render();
      return;
    }
    if (/^\d$/.test(key)) {
      if (digits.length >= maxDigits) return;
      value = (negative ? '-' : '') + (digits === '0' ? key : digits + key);
    } else if (key === '-') {
      value = negative ? digits : `-${digits}`;
    } else if (key === 'back') {
      value = value.slice(0, -1);
      if (value === '-') value = '';
    }
    render();
  }

  const keys = decimal ? KEYS.map(([key, label]) => (key === '-' ? [',', ','] : [key, label])) : KEYS;
  const pad = h('div', { class: 'keypad' },
    keys.map(([key, label]) => h('button', {
      type: 'button',
      class: `key ${key === '-' || key === ',' ? 'key-sign' : ''} ${key === 'back' ? 'key-back' : ''}`,
      'aria-label': LABELS[key] ?? label,
      onClick: () => press(key),
    }, label)),
    h('button', { type: 'button', class: 'key key-submit', onClick: () => press('enter') }, 'Comprobar ✓'));

  function onKeydown(event) {
    if (event.target instanceof HTMLInputElement || event.ctrlKey || event.metaKey || event.altKey) return;
    if (document.querySelector('.modal')) return;
    if (/^\d$/.test(event.key)) press(event.key);
    else if (decimal && [',', '.', 'Decimal'].includes(event.key)) press(',');
    else if (!decimal && (event.key === '-' || event.key === 'Subtract')) press('-');
    else if (event.key === 'Backspace') { event.preventDefault(); press('back'); }
    else if (event.key === 'Enter') { event.preventDefault(); press('enter'); }
  }
  document.addEventListener('keydown', onKeydown);

  return {
    display,
    pad,
    clear() { value = ''; render(); },
    setDisabled(next) { disabled = next; pad.classList.toggle('disabled', next); },
    destroy() { document.removeEventListener('keydown', onKeydown); },
  };
}
