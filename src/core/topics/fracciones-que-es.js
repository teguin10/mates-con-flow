// Tema: qué es una fracción. Leerla en un dibujo, fracciones equivalentes,
// simplificar y comparar.

import { compare, equals, fr, gcd, simplify, toCommon } from '../math/fraction.js';
import { frame } from '../explain/storyboard.js';
import { bar, BLOCK, crepe, F, fractionView, generator, LEVEL_NAMES } from './fracciones-comun.js';

const TOPIC_ID = 'fracciones-que-es';

export const FORMS = {
  'leer-dibujo': 'Leer la fracción de un dibujo',
  equivalente: 'Completar fracciones equivalentes (3/4 = □/12)',
  simplificar: 'Simplificar (12/18 → 2/3)',
  comparar: 'Comparar fracciones (<, =, >)',
};

const LEVELS = {
  1: { forms: [['leer-dibujo', 2], ['equivalente', 1]], maxD: 8, maxK: 3 },
  2: { forms: [['equivalente', 1], ['simplificar', 2], ['comparar', 1]], maxD: 10, maxK: 4 },
  3: { forms: [['simplificar', 1], ['comparar', 2], ['equivalente', 1]], maxD: 12, maxK: 6 },
};

const SIGNS = ['<', '=', '>'];
const signOf = (a, b) => SIGNS[compare(a, b) + 1];
const word = { '<': 'menor que', '=': 'igual que', '>': 'mayor que' };

// Una fracción propia n/d con 1 ≤ n < d.
function proper(rng, minD, maxD) {
  const d = rng.int(minD, maxD);
  return fr(rng.int(1, d - 1), d);
}

function leerDibujo(rng, { maxD }) {
  const f = proper(rng, 2, maxD);
  const story = rng.pick([
    `🥞 Has hecho un crepe y lo has cortado en ${f.d} trozos iguales. Los trozos con chocolate son los coloreados. ¿Qué fracción tiene chocolate?`,
    `🎀 Una pegatina de Hello Kitty dividida en ${f.d} partes: ¿qué fracción has pintado de rosa?`,
    `🍕 En la fiesta de pijamas, ¿qué fracción de la pizza os habéis comido?`,
  ]);
  const frames = [
    frame(`El crepe está partido en ${f.d} partes iguales. Eso es el denominador, el número de abajo: ${f.d}.`,
      fractionView([crepe(fr(0, f.d), { label: `?/${f.d}` })])),
    frame(`Están coloreadas ${f.n}. Eso es el numerador, el número de arriba: ${f.n}.`,
      fractionView([crepe(f)])),
    frame(`Se escribe ${F(f)}: ${f.n} de ${f.d} partes.`, { kind: 'calc', lines: [`${F(f)}`, `${f.n} coloreadas de ${f.d} partes`] }),
  ];
  return {
    id: `dibujo ${F(f)}`,
    form: 'leer-dibujo',
    answerType: 'fraction',
    expression: '□',
    answer: simplify(f),
    story,
    illustration: fractionView([crepe(f, { noLabel: true })]),
    hint: 'Abajo va el número de partes iguales que tiene el dibujo; arriba, cuántas están coloreadas.',
    steps: [`Partes iguales en total (denominador): ${f.d}.`, `Partes coloreadas (numerador): ${f.n}.`, `Fracción: ${F(f)}.`],
    frames,
    hintFrames: [frames[0]],
  };
}

function equivalente(rng, { maxD, maxK }) {
  const f = simplify(proper(rng, 2, Math.min(maxD, 8)));
  const k = rng.int(2, maxK);
  const big = fr(f.n * k, f.d * k);
  const story = rng.pick([
    `🍫 Te comes ${F(f)} de una tableta. Si la tableta tuviera ${big.d} onzas, ¿cuántas serían?`,
    `⭐ ${F(f)} de tus estrellas de papel son rosas. Si tuvieras ${big.d} estrellas, ¿cuántas serían rosas?`,
    '🧩 Completa para que las dos fracciones sean equivalentes (valen lo mismo):',
  ]);
  const frames = [
    frame(`Mira ${F(f)} en una tableta de ${f.d} onzas.`, fractionView([bar(f)])),
    frame(`Para pasar de ${f.d} a ${big.d} onzas, partimos cada onza en ${k}: ${f.d} × ${k} = ${big.d}.`,
      { kind: 'calc', lines: [`${f.d} × ${k} = ${big.d}`] }),
    frame(`Si multiplicamos el denominador por ${k}, el numerador también: ${f.n} × ${k} = ${big.n}. Valen lo mismo.`,
      fractionView([bar(f), bar(big)], ['='], `${F(f)} = ${F(big)}`)),
  ];
  return {
    form: 'equivalente',
    answerType: 'integer',
    expression: `${F(f)} = □/${big.d}`,
    answer: big.n,
    story,
    illustration: null,
    hint: `¿Por cuánto hay que multiplicar ${f.d} para llegar a ${big.d}? Multiplica el numerador por lo mismo.`,
    steps: [`${f.d} × ${k} = ${big.d}, así que se multiplica por ${k}.`, `${f.n} × ${k} = ${big.n}.`, `${F(f)} = ${F(big)}.`],
    frames,
    hintFrames: [frames[0], frames[1]],
  };
}

function simplificar(rng, { maxD, maxK }) {
  const f = simplify(proper(rng, 2, Math.min(maxD, 9)));
  const k = rng.int(2, maxK);
  const big = fr(f.n * k, f.d * k);
  const g = gcd(big.n, big.d);
  const story = rng.pick([
    `🏐 Tu equipo ha ganado ${big.n} de ${big.d} partidos. Escríbelo con la fracción más sencilla:`,
    `🎧 Has escuchado ${big.n} de las ${big.d} canciones de la lista de trap. Simplifica la fracción:`,
    `🥊 Has acertado ${big.n} de ${big.d} golpes en el saco. Simplifica:`,
  ]);
  const frames = [
    frame(`Buscamos un número que divida a ${big.n} y a ${big.d} a la vez. El más grande es ${g}.`,
      { kind: 'calc', lines: [`${big.n} = ${g} × ${f.n}`, `${big.d} = ${g} × ${f.d}`] }),
    frame(`Dividimos arriba y abajo entre ${g}: queda ${F(f)}.`,
      { kind: 'calc', lines: [`${big.n} ÷ ${g} = ${f.n}`, `${big.d} ÷ ${g} = ${f.d}`, `${F(big)} = ${F(f)}`] }),
    frame(`${F(big)} y ${F(f)} son la misma cantidad. ${F(f)} ya no se puede simplificar más: es irreducible.`,
      fractionView([bar(big), bar(f)], ['='])),
  ];
  return {
    form: 'simplificar',
    answerType: 'fraction',
    mustSimplify: true,
    expression: `${F(big)} = □`,
    answer: f,
    story,
    illustration: null,
    hint: `Divide ${big.n} y ${big.d} entre el mismo número (prueba con 2, 3, 5…) hasta que no se pueda más.`,
    steps: [`El número más grande que divide a ${big.n} y a ${big.d} es ${g}.`, `${big.n} ÷ ${g} = ${f.n} y ${big.d} ÷ ${g} = ${f.d}.`, `Irreducible: ${F(f)}.`],
    frames,
    hintFrames: [frames[0]],
  };
}

function comparar(rng, level, { maxD }) {
  let a;
  let b;
  let kind;
  if (level <= 2) {
    kind = rng.pick(['denominador', 'numerador']);
    if (kind === 'denominador') {
      const d = rng.int(3, maxD);
      a = fr(rng.int(1, d - 1), d);
      do b = fr(rng.int(1, d - 1), d); while (b.n === a.n);
    } else {
      const n = rng.int(1, Math.min(5, maxD - 2));
      a = fr(n, rng.int(n + 1, maxD));
      do b = fr(n, rng.int(n + 1, maxD)); while (b.d === a.d);
    }
  } else {
    kind = 'distinto';
    a = proper(rng, 2, 8);
    if (rng.next() < 0.25) {
      const k = rng.int(2, 3);
      b = fr(a.n * k, a.d * k);
    } else {
      do b = proper(rng, 2, 8); while (b.d === a.d || b.n === a.n);
    }
  }
  const answer = signOf(a, b);
  const story = rng.pick([
    `🥞 ¿Quién come más crepe: tú (${F(a)}) o tu amiga (${F(b)})?`,
    `🎮 En Roblox llevas ${F(a)} del obby y tu primo ${F(b)}. Compara:`,
    `🏐 Compara la parte del entrenamiento que has hecho hoy (${F(a)}) con la de ayer (${F(b)}):`,
  ]);
  let frames;
  let hint;
  let steps;
  if (kind === 'denominador') {
    frames = [
      frame(`Las dos tienen el mismo denominador, ${a.d}: los trozos son iguales.`, fractionView([bar(a), bar(b)], [])),
      frame(`Gana la que tiene más trozos: ${a.n} ${answer === '>' ? 'es mayor que' : 'es menor que'} ${b.n}. Así que ${F(a)} ${answer} ${F(b)}.`,
        { kind: 'calc', lines: [`${F(a)} ${answer} ${F(b)}`] }),
    ];
    hint = 'Con el mismo denominador, los trozos son del mismo tamaño: es mayor la que tiene el numerador mayor.';
    steps = [`Mismo denominador (${a.d}).`, `Compara numeradores: ${a.n} y ${b.n}.`, `${F(a)} ${answer} ${F(b)}.`];
  } else if (kind === 'numerador') {
    frames = [
      frame(`Las dos tienen ${a.n} ${a.n === 1 ? 'trozo' : 'trozos'}, pero de distinto tamaño. Cuantas más partes, más pequeñas.`, fractionView([crepe(a), crepe(b)], [])),
      frame(`Partido en ${a.d} es ${a.d < b.d ? 'más grande' : 'más pequeño'} que partido en ${b.d}. Así que ${F(a)} ${answer} ${F(b)}.`,
        { kind: 'calc', lines: [`${F(a)} ${answer} ${F(b)}`] }),
    ];
    hint = 'Con el mismo numerador, es mayor la que tiene el denominador más pequeño: sus trozos son más grandes.';
    steps = [`Mismo numerador (${a.n}).`, `Trozos más grandes cuanto menor es el denominador: ${a.d} y ${b.d}.`, `${F(a)} ${answer} ${F(b)}.`];
  } else {
    const [x, y] = toCommon(a, b);
    frames = [
      frame(`Tienen distinto denominador: así no se pueden comparar los trozos.`, fractionView([bar(a), bar(b)], [])),
      frame(`Las pasamos a denominador común, ${x.d}: ${F(a)} = ${F(x)} y ${F(b)} = ${F(y)}.`, fractionView([bar(x), bar(y)], [])),
      frame(`Ahora comparamos los numeradores: ${x.n} ${answer} ${y.n}. Así que ${F(a)} ${answer} ${F(b)}${equals(a, b) ? ': son equivalentes' : ''}.`,
        { kind: 'calc', lines: [`${F(x)} ${answer} ${F(y)}`, `${F(a)} ${answer} ${F(b)}`] }),
    ];
    hint = 'Pásalas a denominador común y compara los numeradores.';
    steps = [`Denominador común: ${x.d}.`, `${F(a)} = ${F(x)} y ${F(b)} = ${F(y)}.`, `${x.n} ${answer} ${y.n}, así que ${F(a)} ${answer} ${F(b)} (${word[answer]}).`];
  }
  return {
    form: 'comparar',
    answerType: 'choice',
    choices: SIGNS,
    expression: `${F(a)} □ ${F(b)}`,
    answer,
    story,
    illustration: null,
    hint,
    steps,
    frames,
    hintFrames: [frames[0]],
  };
}

function build(rng, level) {
  const config = LEVELS[level] ?? LEVELS[1];
  const form = rng.weighted(config.forms);
  let exercise;
  if (form === 'leer-dibujo') exercise = leerDibujo(rng, config);
  else if (form === 'equivalente') exercise = equivalente(rng, config);
  else if (form === 'simplificar') exercise = simplificar(rng, config);
  else exercise = comparar(rng, level, config);
  return { id: exercise.expression, topicId: TOPIC_ID, level, theme: 'fraccion', ...exercise };
}

export const generate = generator(build);

export const INTRO = [
  {
    title: 'Una fracción es un trozo',
    paragraphs: [
      'Si partes un crepe en 4 trozos iguales y te comes 3, te has comido 3/4 (tres cuartos).',
      'El número de abajo (denominador) dice en cuántas partes iguales se parte. El de arriba (numerador), cuántas coges.',
    ],
    frames: [
      frame('Un crepe partido en 4 trozos iguales: el denominador es 4.', fractionView([crepe(fr(0, 4), { label: '?/4' })])),
      frame('Te comes 3 trozos: el numerador es 3. Te has comido 3/4.', fractionView([crepe(fr(3, 4))])),
    ],
  },
  {
    title: 'Fracciones equivalentes',
    paragraphs: [
      '1/2 y 2/4 son la misma cantidad: media tableta es media tableta, la partas como la partas.',
      'Si multiplicas (o divides) arriba y abajo por el mismo número, la fracción vale lo mismo.',
    ],
    frames: [
      frame('Media tableta: 1/2.', fractionView([bar(fr(1, 2))])),
      frame('Partimos cada trozo en 2: ahora son 2/4, y es la misma cantidad.', fractionView([bar(fr(1, 2)), bar(fr(2, 4))], ['='], '1/2 = 2/4')),
    ],
  },
  {
    title: 'Simplificar',
    paragraphs: [
      'Simplificar es dividir arriba y abajo entre el mismo número hasta que no se pueda más.',
      '6/8: los dos se dividen entre 2 y queda 3/4. 3/4 ya es irreducible.',
    ],
    frames: [
      frame('6 y 8 se pueden dividir entre 2.', { kind: 'calc', lines: ['6 ÷ 2 = 3', '8 ÷ 2 = 4'] }),
      frame('6/8 es lo mismo que 3/4.', fractionView([bar(fr(6, 8)), bar(fr(3, 4))], ['='])),
    ],
  },
  {
    title: 'Comparar',
    paragraphs: [
      'Con el mismo denominador, es mayor la que tiene más trozos: 3/5 > 2/5.',
      'Con distinto denominador, primero se pasan a un denominador común.',
    ],
    frames: [
      frame('3/5 es mayor que 2/5: los trozos son iguales y hay más.', fractionView([bar(fr(3, 5)), bar(fr(2, 5))], ['>'])),
    ],
  },
];

export const topic = {
  id: TOPIC_ID,
  block: BLOCK,
  title: '¿Qué es una fracción?',
  emoji: '🥞',
  maxLevel: 3,
  levelNames: LEVEL_NAMES,
  forms: FORMS,
  intro: INTRO,
  generate,
};
