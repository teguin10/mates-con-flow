import { createStore } from './storage.js';
import { startApp } from './ui/app.js';

startApp(document.getElementById('app'), {
  store: createStore(),
  now: () => new Date().toISOString(),
  seed: (Date.now() ^ Math.floor(Math.random() * 2 ** 31)) >>> 0,
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
