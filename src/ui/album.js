// Álbum: pegatinas ganadas (y cómo ganar las que faltan) y estilos de color.

import { h } from './dom.js';
import { stickerSvg } from './stickers.js';
import { activeStyle, STICKERS, STYLES } from '../core/game/rewards.js';

function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function renderAlbum({ doc, onStyle }) {
  const owned = doc.rewards.stickers;
  const count = STICKERS.filter((st) => owned[st.id]).length;
  const current = activeStyle(doc);
  return h('div', { class: 'screen album' },
    h('div', { class: 'topbar' }, h('a', { href: '#/', class: 'btn btn-ghost' }, '← Inicio')),
    h('h1', {}, '🎨 Tu álbum'),
    h('p', { class: 'lead' }, `${count} de ${STICKERS.length} pegatinas`),
    h('div', { class: 'sticker-grid' }, STICKERS.map((st) => {
      const at = owned[st.id];
      return h('div', { class: `sticker-card ${at ? 'is-owned' : 'is-locked'}` },
        stickerSvg(st.art, { locked: !at }),
        h('strong', {}, at ? st.name : '???'),
        h('small', { class: 'muted' }, at ? formatDate(at) : st.how));
    })),
    h('h2', {}, 'Estilos de color'),
    h('div', { class: 'style-grid' }, STYLES.map((style) => {
      const unlocked = doc.points >= style.points;
      return h('button', {
        type: 'button',
        class: `style-card style-${style.id} ${style.id === current ? 'is-current' : ''}`,
        disabled: !unlocked,
        'aria-pressed': String(style.id === current),
        onClick: () => onStyle(style.id),
      },
      h('span', { class: 'style-swatch', 'aria-hidden': 'true' }),
      h('span', {}, style.name),
      h('small', {}, unlocked ? (style.id === current ? 'Puesto ✓' : 'Ponerlo') : `🔒 ${style.points} puntos`));
    })));
}
