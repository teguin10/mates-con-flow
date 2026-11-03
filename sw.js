// Service worker: guarda los archivos propios para usar la web sin conexión.
// Sirve lo guardado al momento y lo actualiza en segundo plano, así que cada
// versión nueva se ve en la siguiente apertura. Solo atiende al mismo origen.

const CACHE = 'mates-con-flow-v4';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './src/main.js',
  './src/storage.js',
  './src/core/random.js',
  './src/core/pin.js',
  './src/core/math/answer.js',
  './src/core/math/expression.js',
  './src/core/math/fraction.js',
  './src/core/explain/storyboard.js',
  './src/core/topics/index.js',
  './src/core/topics/enteros-suma-resta.js',
  './src/core/topics/comparar.js',
  './src/core/topics/multiplicar-dividir.js',
  './src/core/topics/combinadas.js',
  './src/core/topics/fracciones-comun.js',
  './src/core/topics/fracciones-que-es.js',
  './src/core/topics/fracciones-de-un-numero.js',
  './src/core/topics/fracciones-suma-resta.js',
  './src/core/topics/fracciones-mult-div.js',
  './src/core/game/rules.js',
  './src/core/game/rewards.js',
  './src/core/progress/schema.js',
  './src/ui/app.js',
  './src/ui/album.js',
  './src/ui/audio.js',
  './src/ui/choices.js',
  './src/ui/stickers.js',
  './src/ui/dom.js',
  './src/ui/keypad.js',
  './src/ui/fraction-keypad.js',
  './src/ui/math-text.js',
  './src/ui/mascot.js',
  './src/ui/explainer.js',
  './src/ui/scene.js',
  './src/ui/voice.js',
  './src/ui/panel.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(async (cache) => {
    const cached = await cache.match(request, { ignoreSearch: true });
    const network = fetch(request)
      .then((response) => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
      .catch(() => cached);
    event.waitUntil(network.then(() => undefined, () => undefined));
    return cached ?? network;
  }));
});
