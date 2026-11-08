// Escenas dibujadas en SVG para las explicaciones: la recta numérica como
// edificio, termómetro, obby de bloques o recta horizontal, con un personaje
// que salta paso a paso; y la escena de «signos juntos».
// Cada escena devuelve { el, play(done), finish(), stop() }.

import { h, s } from './dom.js';
import { mathText } from './math-text.js';
import { shapeSvg } from './shapes.js';
import { planeSvg } from './plane.js';
import { formatInteger as f } from '../core/math/answer.js';
import { orientationOf } from '../core/explain/storyboard.js';

const MARKERS = {
  edificio: '🏃‍♀️', obby: '🤸‍♀️', voley: '🏐', cartas: '✉️', boxeo: '🥊', estrellas: '⭐', codigo: '🔐', recta: '📍',
};
const HOP_MS = 420;
const SMOOTH_MS = 1600;
const MAX_HOPS = 12;

export function renderView(view, options = {}) {
  if (view.kind === 'fraction') return fractionScene(view, options);
  if (view.kind === 'signs') return signsScene(view);
  if (view.kind === 'calc') return calcScene(view);
  if (view.kind === 'reduce') return reduceScene(view);
  if (view.kind === 'bars') return barsScene(view);
  if (view.kind === 'plane') return timed(h('div', { class: 'scene scene-plane' }, planeSvg(view)), 1200);
  if (view.kind === 'shape') return timed(h('div', { class: 'scene scene-shape' }, shapeSvg(view)), 1100);
  if (view.kind === 'balance') return balanceScene(view);
  if (view.kind === 'factor') return factorScene(view);
  if (view.kind === 'table') return tableScene(view);
  if (view.kind === 'percent') return percentScene(view);
  if (view.kind === 'places') return placesScene(view);
  if (view.kind === 'columns') return columnsScene(view);
  if (view.kind === 'round') return roundScene(view);
  if (view.kind === 'shift') return shiftScene(view);
  if (view.kind === 'cards') return cardsScene(view);
  if (view.kind === 'sentence') return sentenceScene(view);
  if (view.kind === 'spell') return spellScene(view);
  return lineScene(view, options);
}

// Estadística: diagrama de barras con el valor encima de cada barra.
function barsScene(view) {
  const max = Math.max(1, ...view.bars.map((b) => b.value));
  const el = h('div', { class: 'scene scene-bars' },
    h('div', { class: 'bars', role: 'img', 'aria-label': view.bars.map((b) => `${b.label}: ${b.value}`).join(', ') }, view.bars.map((b, i) => {
      const bar = h('span', { class: 'bar-col' });
      bar.style.height = `${(b.value / max) * 100}%`;
      return h('div', { class: `bar-item ${view.highlight === i ? 'is-focus' : ''}` },
        h('span', { class: 'bar-value' }, String(b.value)),
        h('div', { class: 'bar-track' }, bar),
        h('span', { class: 'bar-label' }, b.label));
    })),
    view.note ? h('p', { class: 'scene-note' }, view.note) : null);
  return timed(el, 1300);
}

// Álgebra: la ecuación como una balanza, con lo de cada lado en un plato.
function balanceScene(view) {
  const el = h('div', { class: 'scene scene-balance' },
    h('div', { class: 'bal-pans' },
      h('span', { class: 'bal-pan' }, view.left),
      h('span', { class: 'bal-eq', 'aria-hidden': 'true' }, '='),
      h('span', { class: 'bal-pan' }, view.right)),
    h('div', { class: 'bal-beam', 'aria-hidden': 'true' }),
    h('div', { class: 'bal-stand', 'aria-hidden': 'true' }),
    view.note ? h('p', { class: 'scene-note' }, view.note) : null);
  return timed(el, 1300);
}

// Divisibilidad: divisiones sucesivas entre primos (60 | 2, 30 | 2…), una o dos columnas.
function factorScene(view) {
  const column = (rows) => h('table', { class: 'factor-table' }, h('tbody', {}, rows.map(([value, prime]) => h('tr', {},
    h('td', { class: 'fa-value' }, String(value)),
    h('td', { class: 'fa-prime' }, prime === null ? '' : String(prime))))));
  const el = h('div', { class: 'scene scene-factor' }, column(view.rows), view.rows2 ? column(view.rows2) : null);
  [...el.querySelectorAll('tr')].forEach((row, i) => { row.style.animationDelay = `${(i % 8) * 0.25}s`; });
  return timed(el, 900 + view.rows.length * 250);
}

// Proporcionalidad: tabla de dos filas; null es la casilla que falta.
function tableScene(view) {
  const cell = (v) => h('td', { class: v === null ? 'is-missing' : '' }, v === null ? '?' : String(v).replace('.', ','));
  const named = view.rowNames.some(Boolean);
  const el = h('div', { class: 'scene scene-table' },
    h('table', { class: 'ratio-table' }, h('tbody', {},
      h('tr', {}, named ? h('th', { scope: 'row' }, view.rowNames[0]) : null, view.top.map(cell)),
      h('tr', {}, named ? h('th', { scope: 'row' }, view.rowNames[1]) : null, view.bottom.map(cell)))),
    view.factor ? h('p', { class: 'scene-note' }, `↓ ${view.factor}`) : null);
  return timed(el, 1200);
}

// Porcentajes: barra del 100 % con la parte rellena (se pasa de 100 en las subidas).
function percentScene(view) {
  const fill = h('span', { class: 'pc-fill' });
  fill.style.width = `${Math.min(view.percent, 100)}%`;
  const extra = view.percent > 100 ? h('span', { class: 'pc-extra' }) : null;
  if (extra) extra.style.width = `${Math.min(view.percent - 100, 60)}%`;
  const el = h('div', { class: 'scene scene-percent' },
    h('div', { class: 'pc-row' }, h('div', { class: 'pc-bar', 'aria-hidden': 'true' }, fill), extra),
    h('p', { class: 'scene-note' }, view.label ?? `${view.percent} %`),
    view.total !== null && view.total !== undefined ? h('p', { class: 'pc-total' }, `100 % = ${String(view.total).replace('.', ',')}`) : null);
  return timed(el, 1400);
}

// Decimales: tabla de posiciones (D U , d c m) con una columna resaltada.
const PLACE_HEADS = [[-1, 'D'], [0, 'U'], [1, 'd'], [2, 'c'], [3, 'm']];
function placesScene(view) {
  const cells = (text) => {
    const [whole, frac = ''] = text.split(',');
    const digit = (place) => (place <= 0 ? whole[whole.length - 1 + place] ?? '' : frac[place - 1] ?? '');
    return PLACE_HEADS.map(([place]) => digit(place));
  };
  const used = PLACE_HEADS.filter(([place]) => place >= 0 || view.rows.some((r) => r.split(',')[0].length > 1));
  const maxPlace = Math.max(0, ...view.rows.map((r) => (r.split(',')[1] ?? '').length));
  const columns = used.filter(([place]) => place <= Math.max(maxPlace, 1));
  const head = h('tr', {}, columns.map(([place, label], i) => [
    place === 1 ? h('th', { class: 'pl-comma' }, ',') : null,
    h('th', { class: view.highlight === place ? 'is-focus' : '' }, label),
  ]));
  const body = view.rows.map((row) => {
    const all = cells(row);
    return h('tr', {}, columns.map(([place]) => [
      place === 1 ? h('td', { class: 'pl-comma' }, row.includes(',') ? ',' : '') : null,
      h('td', { class: view.highlight === place ? 'is-focus' : '' }, all[PLACE_HEADS.findIndex(([p]) => p === place)]),
    ]));
  });
  const el = h('div', { class: 'scene scene-places' },
    h('table', { class: 'places', 'aria-label': view.rows.join(', ') }, h('thead', {}, head), h('tbody', {}, body)),
    view.note ? h('p', { class: 'scene-note' }, view.note) : null);
  return timed(el, 900 + view.rows.length * 300);
}

// Decimales: cuenta en columna con las comas alineadas y el resultado debajo.
function columnsScene(view) {
  const rows = [...view.lines, ...(view.result ? [view.result] : [])];
  const intWidth = Math.max(...rows.map((r) => r.split(',')[0].length));
  const fracWidth = Math.max(...rows.map((r) => (r.split(',')[1] ?? '').length));
  const align = (text) => {
    const [whole, frac] = text.split(',');
    return `${whole.padStart(intWidth, ' ')}${frac !== undefined ? `,${frac.padEnd(fracWidth, ' ')}` : ' '.repeat(fracWidth ? fracWidth + 1 : 0)}`;
  };
  const el = h('div', { class: 'scene scene-columns' },
    h('pre', { class: 'columns', 'aria-label': `${view.lines.join(` ${view.op} `)}${view.result ? ` = ${view.result}` : ''}` },
      view.lines.map((line, i) => h('span', { class: 'col-line' }, `${i === view.lines.length - 1 ? view.op : ' '} ${align(line)}`)),
      view.result ? h('span', { class: 'col-line col-result' }, `  ${align(view.result)}`) : null),
    view.note ? h('p', { class: 'scene-note' }, view.note) : null);
  return timed(el, 900 + rows.length * 350);
}

// Redondeo: un tramo entre dos valores con el número y hacia cuál se acerca.
function roundScene(view) {
  const num = (t) => Number(String(t).replace(',', '.'));
  const lo = num(view.low);
  const hi = num(view.high);
  const pos = hi === lo ? 50 : Math.min(100, Math.max(0, ((num(view.value) - lo) / (hi - lo)) * 100));
  const marker = h('span', { class: 'round-mark' }, view.value);
  marker.style.left = `${pos}%`;
  const el = h('div', { class: 'scene scene-round' },
    h('div', { class: 'round-track' },
      h('span', { class: `round-end round-low ${view.closest === view.low ? 'is-focus' : ''}` }, view.low),
      h('span', { class: 'round-mid' }),
      marker,
      h('span', { class: `round-end round-high ${view.closest === view.high ? 'is-focus' : ''}` }, view.high)),
    view.closest ? h('p', { class: 'scene-note' }, `≈ ${view.closest}`) : null);
  return timed(el, 1400);
}

// Por 10, 100 y 1000: la coma salta de sitio.
function shiftScene(view) {
  const el = h('div', { class: 'scene scene-shift' },
    h('span', { class: 'shift-from' }, view.from),
    h('span', { class: 'shift-arrow', 'aria-hidden': 'true' }, view.dir > 0 ? `la coma salta ${view.places} →` : `← la coma salta ${view.places}`),
    h('span', { class: 'shift-to' }, view.to ?? '?'));
  return timed(el, 1600);
}

// Inglés: tarjetas con dibujo (emoji o muestra de color), la palabra en
// inglés y su traducción. hide oculta una de las dos.
function cardsScene(view) {
  const el = h('div', { class: 'scene scene-cards' }, view.items.map((item, i) => {
    let art = null;
    if (item.swatch) {
      art = h('span', { class: 'card-swatch', 'aria-hidden': 'true' });
      art.style.background = item.swatch;
    } else if (item.emoji) art = h('span', { class: 'card-emoji', 'aria-hidden': 'true' }, item.emoji);
    return h('div', { class: `word-card ${view.highlight === i ? 'is-focus' : ''}` },
      art,
      item.en && view.hide !== 'en' ? h('span', { class: 'card-en', lang: 'en' }, item.en) : null,
      item.es && view.hide !== 'es' ? h('span', { class: 'card-es' }, item.es) : null);
  }));
  return timed(el, 700 + view.items.length * 350);
}

// Inglés: una frase con el sujeto y el verbo resaltados, y su traducción.
function sentenceScene(view) {
  const el = h('div', { class: 'scene scene-sentence' },
    h('p', { class: 'sentence-line', lang: 'en' }, view.parts.map((part) => h('span', { class: `part ${part.mark ? `part-${part.mark}` : ''}` }, part.text))),
    view.es ? h('p', { class: 'sentence-es' }, view.es) : null);
  return timed(el, 900 + view.parts.length * 300);
}

// Inglés: las letras de una palabra, una a una (only: cuántas enseñar).
function spellScene(view) {
  const letters = [...view.word];
  const shown = view.only ?? letters.length;
  const el = h('div', { class: 'scene scene-spell', lang: 'en' }, letters.map((ch, i) => (ch === ' '
    ? h('span', { class: 'spell-gap' })
    : h('span', { class: `spell-letter ${i < shown ? '' : 'is-hidden'}` }, i < shown ? ch : '?'))));
  [...el.children].forEach((child, i) => { child.style.animationDelay = `${i * 0.18}s`; });
  return timed(el, 600 + letters.length * 180);
}

function timed(el, ms) {
  let timer = null;
  return {
    el,
    play(done) {
      el.classList.add('playing');
      timer = setTimeout(() => { el.classList.add('done'); done(); }, ms);
    },
    finish() { clearTimeout(timer); el.classList.add('done'); },
    stop() { clearTimeout(timer); },
  };
}

// Cuentas en grande, con una cuadrícula de puntos opcional (filas × columnas).
function calcScene(view) {
  const grid = view.grid
    ? s('svg', { viewBox: `0 0 ${view.grid.cols * 16 + 8} ${view.grid.rows * 16 + 8}`, class: 'calc-grid', 'aria-hidden': 'true' },
      ...Array.from({ length: view.grid.rows * view.grid.cols }, (_, i) => s('circle', {
        cx: 12 + (i % view.grid.cols) * 16, cy: 12 + Math.floor(i / view.grid.cols) * 16, r: 5, class: 'calc-dot',
      })))
    : null;
  const el = h('div', { class: 'scene scene-calc' },
    view.lines.map((line, i) => h('div', { class: `calc-line calc-line-${i}` }, /\d\/\d/.test(line) ? mathText(line) : line)),
    grid);
  return timed(el, 900 + view.lines.length * 500);
}

// Jerarquía: resalta la operación que toca y la sustituye por su resultado.
function reduceScene(view) {
  const expression = h('div', { class: 'reduce-expr' },
    view.before ? h('span', {}, view.before) : null,
    view.focus ? h('span', { class: 'reduce-focus' }, view.focus) : null,
    view.focus && view.result !== null ? h('span', { class: 'reduce-result' }, view.result) : null,
    view.after ? h('span', {}, view.after) : null);
  const el = h('div', { class: `scene scene-reduce ${view.result === null ? 'is-question' : ''}` },
    h('div', { class: 'reduce-rule' }, view.rule),
    expression);
  return timed(el, view.result === null ? 900 : 1700);
}

function signsScene(view) {
  const el = h('div', { class: 'scene scene-signs' },
    h('div', { class: 'signs-row' },
      h('span', { class: 'signs-before' }, view.before),
      h('span', { class: 'signs-arrow', 'aria-hidden': 'true' }, '→'),
      h('span', { class: 'signs-after' }, view.after)),
    h('div', { class: 'signs-rule' }, view.rule));
  let timer = null;
  return {
    el,
    play(done) {
      el.classList.add('playing');
      timer = setTimeout(() => { el.classList.add('done'); done(); }, 1500);
    },
    finish() { clearTimeout(timer); el.classList.add('done'); },
    stop() { clearTimeout(timer); },
  };
}

// ---------- Fracciones ----------
// Cada pieza es un crepe en porciones, una tableta en onzas o un grupo de
// objetos repartidos. Las partes de la fracción se colorean una a una.

const FILL_MS = 260;
const MAX_UNITS = 4;

function sectorPath(cx, cy, r, i, d) {
  const a0 = (i / d) * 2 * Math.PI - Math.PI / 2;
  const a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p = (a) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  return `M${cx} ${cy} L${p(a0)} A${r} ${r} 0 ${large} 1 ${p(a1)} Z`;
}

// Devuelve { svg, parts } con las partes en el orden en que se colorean.
function crepeShape({ n, d }) {
  const units = Math.min(MAX_UNITS, Math.max(1, Math.ceil(n / d)));
  const R = 38;
  const W = units * 92;
  const parts = [];
  const nodes = [];
  for (let u = 0; u < units; u += 1) {
    const cx = 46 + u * 92;
    nodes.push(s('circle', { cx, cy: 46, r: R + 3, class: 'fr-plate' }));
    for (let i = 0; i < d; i += 1) {
      const part = d === 1
        ? s('circle', { cx, cy: 46, r: R, class: 'fr-part' })
        : s('path', { d: sectorPath(cx, 46, R, i, d), class: 'fr-part' });
      nodes.push(part);
      parts.push(part);
    }
  }
  const svg = s('svg', { viewBox: `0 0 ${W} 92`, class: 'fr-svg fr-crepe' }, ...nodes);
  // La CSP no deja atributos style: el ancho va por CSSOM.
  svg.style.width = `${units * 96}px`;
  return { svg, parts };
}

function barShape({ n, d }) {
  const units = Math.min(MAX_UNITS, Math.max(1, Math.ceil(n / d)));
  const BW = 150;
  const parts = [];
  const nodes = [];
  for (let u = 0; u < units; u += 1) {
    const y = 6 + u * 44;
    for (let i = 0; i < d; i += 1) {
      const part = s('rect', { x: 6 + (i * BW) / d, y, width: BW / d, height: 36, class: 'fr-part fr-cell' });
      nodes.push(part);
      parts.push(part);
    }
    nodes.push(s('rect', { x: 6, y, width: BW, height: 36, rx: 4, class: 'fr-outline' }));
  }
  return { svg: s('svg', { viewBox: `0 0 ${BW + 12} ${units * 44 + 4}`, class: 'fr-svg fr-bar' }, ...nodes), parts };
}

// total objetos en d grupos; se colorean los n primeros grupos.
function groupsShape({ n, d, total, emoji = '🍓' }) {
  const per = total / d;
  const cols = Math.min(per, 5);
  const rows = Math.ceil(per / cols);
  const GW = cols * 18 + 10;
  const GH = rows * 18 + 10;
  const perRow = Math.min(d, 5);
  const W = perRow * (GW + 6);
  const H = Math.ceil(d / perRow) * (GH + 6);
  const parts = [];
  const nodes = [];
  for (let g = 0; g < d; g += 1) {
    const gx = (g % perRow) * (GW + 6);
    const gy = Math.floor(g / perRow) * (GH + 6);
    const box = s('rect', { x: gx + 1, y: gy + 1, width: GW, height: GH, rx: 8, class: 'fr-part fr-group' });
    nodes.push(box);
    if (g < n) parts.push(box);
    for (let k = 0; k < per; k += 1) {
      nodes.push(s('text', { x: gx + 14 + (k % cols) * 18, y: gy + 16 + Math.floor(k / cols) * 18, class: 'fr-emoji', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, emoji));
    }
  }
  return { svg: s('svg', { viewBox: `0 0 ${W + 2} ${H + 2}`, class: 'fr-svg fr-groups' }, ...nodes), parts };
}

// Debajo del dibujo: su fracción, un texto propio (label, «?/4» deja el
// numerador en interrogación) o nada (noLabel, para no chivar la respuesta).
function fractionLabel(item) {
  if (item.noLabel) return null;
  const unknown = /^\?\/(\d+)$/.exec(item.label ?? '');
  if (unknown) return h('span', { class: 'fr-label frac' }, h('span', { class: 'frac-num' }, '?'), h('span', { class: 'frac-den' }, unknown[1]));
  if (item.label) return h('span', { class: 'fr-label' }, mathText(item.label));
  if (item.d === 1) return h('span', { class: 'fr-label' }, String(item.n));
  return h('span', { class: 'fr-label frac' }, h('span', { class: 'frac-num' }, String(item.n)), h('span', { class: 'frac-den' }, String(item.d)));
}

function describeFraction(view) {
  return view.items.map((it) => {
    if (it.shape === 'groups') return `${it.total} objetos en ${it.d} grupos, ${it.n} marcados`;
    return `dibujo partido en ${it.d} partes iguales, ${it.n} coloreadas`;
  }).join(` ${view.ops?.[0] ?? 'y'} `);
}

function fractionScene(view, { compact = false } = {}) {
  const pieces = view.items.map((item) => {
    const shape = item.shape === 'groups' ? groupsShape(item) : item.shape === 'bar' ? barShape(item) : crepeShape(item);
    const toFill = item.shape === 'groups' ? shape.parts : shape.parts.slice(0, item.n);
    return { item, shape, toFill };
  });
  const row = [];
  pieces.forEach((p, i) => {
    row.push(h('figure', { class: `fr-item ${p.item.highlight ? 'is-hl' : ''}` }, p.shape.svg, fractionLabel(p.item)));
    const symbol = view.ops?.[i];
    if (symbol && i < pieces.length - 1) row.push(h('span', { class: 'fr-op' }, symbol));
  });
  const el = h('div', { class: `scene scene-fraction ${compact ? 'is-compact' : ''}`, role: 'img', 'aria-label': describeFraction(view) },
    h('div', { class: 'fr-row' }, row),
    view.note ? h('p', { class: 'fr-note' }, mathText(view.note)) : null);
  const queue = pieces.flatMap((p) => p.toFill);
  let interval = null;
  let doneTimer = null;

  function finish() {
    clearInterval(interval);
    clearTimeout(doneTimer);
    queue.forEach((part) => part.classList.add('on'));
    el.classList.add('done');
  }
  if (compact) finish();

  return {
    el,
    play(done) {
      el.classList.add('playing');
      let i = 0;
      const step = Math.max(90, Math.min(FILL_MS, 2400 / Math.max(1, queue.length)));
      interval = setInterval(() => {
        if (i >= queue.length) {
          clearInterval(interval);
          el.classList.add('done');
          doneTimer = setTimeout(done, 500);
          return;
        }
        queue[i].classList.add('on');
        i += 1;
      }, step);
    },
    finish,
    stop() { clearInterval(interval); clearTimeout(doneTimer); },
  };
}

function labelStep(span) {
  if (span <= 14) return 1;
  if (span <= 30) return 2;
  return 5;
}

function lineScene(view, { compact = false } = {}) {
  const vertical = orientationOf(view.theme) === 'vertical';
  const { min, max, theme, phase } = view;
  const span = max - min;
  const step = labelStep(span);
  const thermo = theme === 'termometro';

  const W = vertical ? 260 : 340;
  const H = vertical ? (thermo ? 330 : 300) : 116;
  const padA = 18;
  const padB = vertical ? (thermo ? 46 : 18) : 18;
  const AX = vertical ? (thermo ? 120 : 132) : 0;
  const AXY = 72;
  const pos = (v) => (vertical
    ? { x: AX, y: H - padB - ((v - min) * (H - padA - padB)) / span }
    : { x: padA + ((v - min) * (W - 2 * padA)) / span, y: AXY });

  const layers = [];
  const keyValues = new Set([view.from, view.to, ...(view.points ?? [])].filter((v) => v !== undefined));

  // Decorado de fondo.
  if (vertical && !thermo) {
    const top = pos(max).y;
    const ground = pos(0).y;
    const bottom = pos(min).y;
    layers.push(s('rect', { x: 78, y: top - 6, width: 110, height: bottom - top + 12, rx: 6, class: theme === 'obby' ? 'deco-sky' : 'deco-building' }));
    layers.push(s('rect', { x: 78, y: ground, width: 110, height: bottom - ground + 6, class: theme === 'obby' ? 'deco-dirt' : 'deco-basement' }));
    for (let v = min + 1; v < max; v += 1) {
      const { y } = pos(v);
      layers.push(s('line', { x1: 78, y1: y, x2: 188, y2: y, class: 'deco-floor' }));
    }
    layers.push(s('line', { x1: 70, y1: ground, x2: 200, y2: ground, class: theme === 'obby' ? 'deco-grass' : 'deco-ground' }));
    layers.push(s('text', { x: 204, y: ground + 4, class: 'deco-text' }, theme === 'obby' ? 'suelo' : 'planta baja'));
    if (theme === 'edificio') layers.push(s('text', { x: 96, y: bottom - 8, class: 'deco-emoji' }, '🧟'));
    if (theme === 'obby') layers.push(s('text', { x: 170, y: top + 22, class: 'deco-emoji' }, '☁️'));
  }
  if (thermo) {
    const top = pos(max).y - 8;
    const bottom = pos(min).y;
    layers.push(s('rect', { x: AX - 15, y: top, width: 30, height: bottom - top + 14, rx: 15, class: 'thermo-tube' }));
    layers.push(s('circle', { cx: AX, cy: bottom + 22, r: 20, class: 'thermo-bulb' }));
  }
  if (!vertical) {
    if (theme === 'voley') {
      layers.push(s('text', { x: padA, y: 18, class: 'deco-text' }, '← perdiendo'));
      layers.push(s('text', { x: W - padA, y: 18, class: 'deco-text', 'text-anchor': 'end' }, 'ganando →'));
    }
    layers.push(s('line', { x1: padA - 8, y1: AXY, x2: W - padA + 8, y2: AXY, class: 'nl-axis' }));
  }

  // Marcas y números.
  for (let v = min; v <= max; v += 1) {
    const p = pos(v);
    const labeled = v % step === 0 || keyValues.has(v) || v === 0;
    if (vertical) {
      const x0 = thermo ? AX - 22 : 70;
      layers.push(s('line', { x1: x0, y1: p.y, x2: x0 + (labeled ? 8 : 4), y2: p.y, class: 'nl-tick' }));
      if (labeled) layers.push(s('text', { x: x0 - 4, y: p.y + 4, 'text-anchor': 'end', class: labelClass(v, phase, keyValues) }, thermo ? `${f(v)}°` : f(v)));
    } else {
      layers.push(s('line', { x1: p.x, y1: AXY - (labeled ? 6 : 3), x2: p.x, y2: AXY + (labeled ? 6 : 3), class: 'nl-tick' }));
      if (labeled) layers.push(s('text', { x: p.x, y: AXY + 22, 'text-anchor': 'middle', class: labelClass(v, phase, keyValues) }, f(v)));
    }
  }

  // Recorrido, flecha de dirección y personaje.
  const trail = s('line', { class: 'trail' });
  const mercury = thermo ? s('rect', { x: AX - 9, width: 18, rx: 9, class: 'thermo-mercury' }) : null;
  const marker = s('g', { class: 'marker' },
    thermo ? s('text', { x: 26, y: 5, class: 'thermo-value' }) : s('text', { x: 0, y: 0, class: 'marker-emoji', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, MARKERS[theme] ?? '📍'));
  const ring = s('circle', { r: 16, class: 'arrive-ring' });
  const counter = s('text', { x: W - 8, y: vertical ? 16 : 40, 'text-anchor': 'end', class: 'hop-counter' });
  if (mercury) layers.push(mercury);
  layers.push(trail);

  const markerOffset = vertical ? { x: thermo ? 0 : 26, y: 0 } : { x: 0, y: -20 };

  function setPos(v) {
    const p = pos(v);
    marker.style.transform = `translate(${p.x + markerOffset.x}px, ${p.y + markerOffset.y}px)`;
    if (mercury) {
      const bottom = pos(min).y + 14;
      mercury.setAttribute('y', String(p.y));
      mercury.setAttribute('height', String(Math.max(0, bottom - p.y)));
      marker.querySelector('text').textContent = `${f(Math.round(v))} °C`;
    }
  }

  function setTrail(from, to) {
    const a = pos(from);
    const b = pos(to);
    const off = vertical ? (thermo ? 22 : -14) : 0;
    trail.setAttribute('x1', String(a.x + (vertical ? off : 0)));
    trail.setAttribute('x2', String(b.x + (vertical ? off : 0)));
    trail.setAttribute('y1', String(a.y));
    trail.setAttribute('y2', String(b.y));
    trail.classList.toggle('hidden', from === to);
  }

  const arcs = s('g', { class: 'jump-arcs' });
  if (phase === 'marks' || phase === 'points') {
    marker.classList.add('hidden');
    trail.classList.add('hidden');
    for (const v of view.points ?? []) {
      const p = pos(v);
      const cx = p.x + (vertical ? (thermo ? 34 : 26) : 0);
      const cy = p.y + (vertical ? 0 : -14);
      layers.push(s('circle', { cx, cy, r: 7, class: v === view.highlight ? 'pt pt-hl' : 'pt' }));
      if (v === view.highlight) layers.push(s('circle', { cx, cy, r: 13, class: 'arrive-ring' }));
    }
  } else {
    if (phase === 'jumps') layers.push(arcs);
    setPos(phase === 'arrive' ? view.to : view.from);
    setTrail(view.from, phase === 'arrive' ? view.to : view.from);
    layers.push(marker);
  }

  if (phase === 'direction') {
    const p = pos(view.from);
    const len = 46;
    const head = 8;
    let d;
    let tip;
    if (vertical) {
      const x = p.x + (thermo ? 46 : 58);
      const y2 = p.y - view.dir * len;
      d = `M${x} ${p.y} L${x} ${y2}`;
      tip = `${x - head},${y2 + view.dir * head} ${x + head},${y2 + view.dir * head} ${x},${y2}`;
      layers.push(s('text', { x: x + 12, y: (p.y + y2) / 2 + 4, class: 'dir-label' }, `${view.amount} ${view.amount === 1 ? 'paso' : 'pasos'}`));
    } else {
      const x2 = p.x + view.dir * len;
      const y = AXY - 44;
      d = `M${p.x} ${y} L${x2} ${y}`;
      tip = `${x2 - view.dir * head},${y - head} ${x2 - view.dir * head},${y + head} ${x2},${y}`;
      layers.push(s('text', { x: (p.x + x2) / 2, y: y - 10, 'text-anchor': 'middle', class: 'dir-label' }, `${view.amount} ${view.amount === 1 ? 'paso' : 'pasos'}`));
    }
    layers.push(s('path', { d, class: 'dir-arrow' }), s('polygon', { points: tip, class: 'dir-head' }));
    layers.push(s('text', { x: vertical ? p.x + (thermo ? 46 : 58) : p.x + view.dir * (len + 18), y: vertical ? p.y - view.dir * (len + 16) : AXY - 40, 'text-anchor': 'middle', class: 'dir-question' }, '?'));
  }

  if (phase === 'arrive') {
    const p = pos(view.to);
    ring.setAttribute('cx', String(p.x + markerOffset.x));
    ring.setAttribute('cy', String(p.y + markerOffset.y));
    layers.push(ring);
  }
  layers.push(counter);

  const svgEl = s('svg', {
    viewBox: `0 0 ${W} ${H}`,
    class: `scene-svg ${vertical ? 'is-vertical' : 'is-horizontal'}`,
    role: 'img',
    'aria-label': describe(view),
  }, ...layers);
  const el = h('div', { class: `scene scene-line theme-${theme} ${compact ? 'is-compact' : ''}` }, svgEl);

  let interval = null;
  let raf = null;
  let doneTimer = null;

  function stop() {
    clearInterval(interval);
    cancelAnimationFrame(raf);
    clearTimeout(doneTimer);
    interval = null;
    raf = null;
  }

  function finish() {
    stop();
    if (phase === 'jumps') {
      arcs.replaceChildren();
      for (let i = 0; i < view.count; i += 1) jumpArc(view.from + view.step * i, view.from + view.step * (i + 1));
      setPos(view.to);
      setTrail(view.from, view.to);
      counter.textContent = `${view.count} saltos`;
    }
    if (phase === 'move') {
      setPos(view.to);
      setTrail(view.from, view.to);
      counter.textContent = `${Math.abs(view.to - view.from)} pasos`;
    }
  }

  function jumpArc(a, b) {
    const pa = pos(a);
    const pb = pos(b);
    const lift = Math.min(30, 10 + Math.abs(pb.x - pa.x) / 3);
    arcs.append(s('path', { d: `M${pa.x} ${AXY - 4} Q${(pa.x + pb.x) / 2} ${AXY - 4 - lift} ${pb.x} ${AXY - 4}`, class: 'jump-arc' }));
  }

  function play(done) {
    if (phase === 'jumps') {
      let i = 0;
      interval = setInterval(() => {
        const prev = view.from + view.step * i;
        i += 1;
        const v = view.from + view.step * i;
        jumpArc(prev, v);
        setPos(v);
        setTrail(view.from, v);
        counter.textContent = `${i} ${i === 1 ? 'salto' : 'saltos'}`;
        if (i >= view.count) {
          clearInterval(interval);
          interval = null;
          doneTimer = setTimeout(done, 600);
        }
      }, HOP_MS * 1.6);
      return;
    }
    if (phase !== 'move' || view.from === view.to) {
      doneTimer = setTimeout(done, phase === 'arrive' ? 600 : 300);
      return;
    }
    const total = view.to - view.from;
    const n = Math.abs(total);
    const dir = Math.sign(total);
    if (n <= MAX_HOPS) {
      el.classList.add('hopping');
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        const v = view.from + dir * i;
        setPos(v);
        setTrail(view.from, v);
        counter.textContent = `${i} ${i === 1 ? 'paso' : 'pasos'}`;
        if (i >= n) {
          clearInterval(interval);
          interval = null;
          doneTimer = setTimeout(done, 500);
        }
      }, HOP_MS);
    } else {
      el.classList.add('sliding');
      const start = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - start) / SMOOTH_MS);
        const eased = k < 0.5 ? 2 * k * k : 1 - ((-2 * k + 2) ** 2) / 2;
        const v = view.from + total * eased;
        setPos(v);
        setTrail(view.from, v);
        counter.textContent = `${Math.round(Math.abs(v - view.from))} pasos`;
        if (k < 1) raf = requestAnimationFrame(tick);
        else { raf = null; doneTimer = setTimeout(done, 500); }
      };
      raf = requestAnimationFrame(tick);
    }
  }

  return { el, play, finish, stop };
}

function labelClass(v, phase, keyValues) {
  if (phase === 'marks') return v < 0 ? 'nl-neg' : v > 0 ? 'nl-pos' : 'nl-zero';
  return keyValues.has(v) ? 'nl-key' : 'nl-label';
}

function describe(view) {
  if (view.phase === 'marks') return 'Recta numérica con los negativos a un lado del cero y los positivos al otro';
  if (view.phase === 'points') return `Números en la recta: ${view.points.map(f).join(', ')}`;
  if (view.phase === 'jumps') return `${view.count} saltos de ${f(view.step)} desde ${f(view.from)}`;
  if (view.phase === 'move') return `Movimiento de ${f(view.from)} a ${f(view.to)}`;
  if (view.phase === 'arrive') return `Resultado: ${f(view.to)}`;
  if (view.phase === 'direction') return `Desde ${f(view.from)}, ${view.amount} pasos`;
  return `Punto de partida: ${f(view.from)}`;
}
