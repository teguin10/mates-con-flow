// Ayudantes mínimos para crear elementos sin innerHTML (los textos del usuario,
// como el apodo, nunca se interpretan como HTML).

const SVG_NS = 'http://www.w3.org/2000/svg';

function appendAll(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : String(child));
  }
}

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key in el && typeof value !== 'string') el[key] = value;
    else el.setAttribute(key, value === true ? '' : value);
  }
  appendAll(el, children);
  return el;
}

export function s(tag, attrs = {}, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs ?? {})) {
    if (value !== null && value !== undefined) el.setAttribute(key, value);
  }
  appendAll(el, children);
  return el;
}

export function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}
