// Service worker: guarda los archivos propios para usar la web sin conexión.
// Sirve lo guardado al momento y lo actualiza en segundo plano, así que cada
// versión nueva se ve en la siguiente apertura. Solo atiende al mismo origen.

const CACHE = 'mates-con-flow-v19';
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
  './src/core/math/decimal.js',
  './src/core/math/numbers.js',
  './src/core/lang/text-answer.js',
  './src/core/lang/numbers.js',
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
  './src/core/topics/decimales-comun.js',
  './src/core/topics/decimales-leer.js',
  './src/core/topics/decimales-suma-resta.js',
  './src/core/topics/decimales-mult-div.js',
  './src/core/topics/decimales-fraccion-redondeo.js',
  './src/core/topics/proporcion-comun.js',
  './src/core/topics/proporcion-razon.js',
  './src/core/topics/proporcion-directa.js',
  './src/core/topics/porcentajes.js',
  './src/core/topics/porcentajes-repartos.js',
  './src/core/topics/potencias.js',
  './src/core/topics/raices.js',
  './src/core/topics/divisibilidad.js',
  './src/core/topics/mcd-mcm.js',
  './src/core/topics/algebra-comun.js',
  './src/core/topics/algebra-lenguaje.js',
  './src/core/topics/monomios.js',
  './src/core/topics/ecuaciones.js',
  './src/core/topics/ecuaciones-problemas.js',
  './src/core/topics/geometria-comun.js',
  './src/core/topics/angulos.js',
  './src/core/topics/poligonos.js',
  './src/core/topics/areas.js',
  './src/core/topics/circulo-pitagoras.js',
  './src/core/topics/cuerpos.js',
  './src/core/topics/funciones-comun.js',
  './src/core/topics/coordenadas.js',
  './src/core/topics/graficas.js',
  './src/core/topics/funciones-tabla.js',
  './src/core/topics/rectas.js',
  './src/core/topics/estadistica-comun.js',
  './src/core/topics/estadistica-variables.js',
  './src/core/topics/frecuencias.js',
  './src/core/topics/media-moda-mediana.js',
  './src/core/topics/probabilidad.js',
  './src/core/topics/ingles-comun.js',
  './src/core/topics/ingles-hello.js',
  './src/core/topics/ingles-numbers.js',
  './src/core/topics/ingles-colours.js',
  './src/core/topics/ingles-to-be.js',
  './src/core/topics/ingles-alphabet.js',
  './src/core/topics/ingles-dates.js',
  './src/core/topics/ingles-family.js',
  './src/core/topics/ingles-have-got.js',
  './src/core/topics/ingles-this-that.js',
  './src/core/topics/ingles-routines.js',
  './src/core/topics/ingles-present-simple.js',
  './src/core/topics/ingles-present-questions.js',
  './src/core/topics/ingles-time-frequency.js',
  './src/core/topics/ingles-house.js',
  './src/core/topics/ingles-town.js',
  './src/core/topics/ingles-there-is.js',
  './src/core/topics/ingles-prepositions.js',
  './src/core/topics/ingles-food.js',
  './src/core/topics/ingles-countable.js',
  './src/core/topics/ingles-abilities.js',
  './src/core/topics/ingles-can.js',
  './src/core/topics/ingles-clothes.js',
  './src/core/topics/ingles-weather.js',
  './src/core/topics/ingles-continuous.js',
  './src/core/topics/ingles-simple-continuous.js',
  './src/core/topics/ingles-was-were.js',
  './src/core/topics/ingles-past-regular.js',
  './src/core/topics/ingles-past-irregular.js',
  './src/core/topics/ingles-past-questions.js',
  './src/core/topics/ingles-animals-jobs.js',
  './src/core/topics/ingles-comparatives.js',
  './src/core/topics/ingles-superlatives.js',
  './src/core/topics/ingles-future.js',
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
  './src/ui/text-input.js',
  './src/ui/en-text.js',
  './src/ui/mascot.js',
  './src/ui/explainer.js',
  './src/ui/scene.js',
  './src/ui/shapes.js',
  './src/ui/plane.js',
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
