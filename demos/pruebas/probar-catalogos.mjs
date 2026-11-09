#!/usr/bin/env node
/* Comprobaciones de las muestras de maquetación de catálogo.
 *
 *     node demos/pruebas/probar-catalogos.mjs [carpeta-de-capturas]
 *
 * Esta página no tiene JavaScript: es papel. Así que lo que hay que medir
 * es distinto de las otras muestras —no hay carrito ni filtro que probar—
 * pero es lo mismo de fondo: contraste sobre el compuesto real, que nada
 * se salga de su hoja ni se monte encima de lo de al lado, que la página
 * no desborde en un teléfono y que no haya nada que envejezca.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const AQUI = new URL('.', import.meta.url).pathname;
const ARCHIVO = 'file://' + AQUI + '../catalogos.html';
const SALIDA = process.argv[2] || (AQUI + 'capturas-catalogos');

import { mkdirSync } from 'node:fs';
mkdirSync(SALIDA, { recursive: true });

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const fallos = [];
const ok  = m => console.log('  ok   ' + m);
const mal = m => { fallos.push(m); console.log('  MAL  ' + m); };

/* ── 1. escritorio: consola, desborde, hojas y huecos ─────────────── */
{
  const ctx = await navegador.newContext({ viewport:{width:1440,height:960}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  const errores = [];
  p.on('console', m => { if (m.type()==='error') errores.push(m.text()); });
  p.on('pageerror', e => errores.push('pageerror: ' + e.message));
  await p.goto(ARCHIVO, { waitUntil:'load' });
  await p.waitForTimeout(350);

  console.log('\n— escritorio 1440 —');
  errores.length ? mal('consola: ' + errores.join(' | ')) : ok('sin errores de consola');

  const desb = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  desb > 1 ? mal('desborde horizontal: ' + desb + 'px') : ok('sin desborde horizontal');

  const hojas = await p.locator('.hoja').count();
  hojas === 4 ? ok('las 4 hojas están en la página') : mal('hojas: ' + hojas);

  // Cada hoja dice en qué moneda están sus precios: un «$» a secas se lee
  // como dólares en cuanto la hoja sale de Colombia.
  const moneda = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.hoja')).map(h => {
      const e = h.querySelector('.pie-hoja');
      const r = e && e.getBoundingClientRect();
      return e && /COP/.test(e.innerText) && r.width > 4 && r.height > 4;
    }));
  moneda.every(Boolean) ? ok('las 4 hojas dicen que los precios van en COP')
                        : mal('hojas sin pie de moneda visible: ' + JSON.stringify(moneda));

  // Cada hoja es un contenedor de consulta: si se pierde el
  // container-type, todas las medidas en cqw se van a cero y la hoja
  // queda en blanco sin dar ningún error.
  const contenedores = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.hoja'))
      .filter(e => !/inline-size/.test(getComputedStyle(e).containerType)).length);
  contenedores === 0 ? ok('las 4 hojas siguen siendo contenedores de consulta')
                     : mal(contenedores + ' hoja(s) sin container-type:inline-size');

  // Ningún hueco de foto puede quedar en cero: un <span> en línea no toma
  // alto, y ya mordió una vez en otra muestra.
  const huecos = await p.evaluate(() => {
    const malos = [];
    const todos = Array.from(document.querySelectorAll('.foto'));
    todos.forEach(e => {
      const r = e.getBoundingClientRect();
      if (r.width < 8 || r.height < 8)
        malos.push((e.className||'') + ' ' + Math.round(r.width) + '×' + Math.round(r.height));
      if (!e.dataset.pie) malos.push((e.className||'') + ' sin etiqueta');
    });
    return {malos, n: todos.length};
  });
  huecos.malos.length
    ? mal('huecos mal puestos → ' + huecos.malos.slice(0,4).join(' ; '))
    : ok('los ' + huecos.n + ' huecos de foto están marcados y tienen tamaño');

  // ── hoja 1: las entradas están puestas a mano, en absoluto. Nada
  // impide que se monten entre ellas o que se salgan de la hoja, y ya
  // pasó: «CARBONARA» se salía de su columna y chocaba con el precio
  // de al lado. Esto es lo que lo caza.
  const m1 = await p.evaluate(() => {
    const hoja = document.querySelector('.m1').getBoundingClientRect();
    const cajas = Array.from(document.querySelectorAll('.m1 .plato')).map(e => {
      const r = e.getBoundingClientRect();
      // el ancho real del texto, no el de la caja: una palabra con mucho
      // espaciado se sale de su columna sin que la caja crezca
      let d = 0;
      e.querySelectorAll('h3,p,.pie').forEach(h => {
        const rango = document.createRange(); rango.selectNodeContents(h);
        Array.from(rango.getClientRects()).forEach(c => { if (c.right > d) d = c.right; });
      });
      return {cl:e.className, x:r.x, y:r.y, der:Math.max(r.right, d), ab:r.bottom};
    });
    const fuera = cajas.filter(c => c.der > hoja.right - 2 || c.x < hoja.left - 2
                                 || c.ab > hoja.bottom - 2).map(c => c.cl);
    const choques = [];
    for (let i=0;i<cajas.length;i++) for (let j=i+1;j<cajas.length;j++){
      const a = cajas[i], b = cajas[j];
      if (a.x < b.der && b.x < a.der && a.y < b.ab && b.y < a.ab)
        choques.push(a.cl + ' × ' + b.cl);
    }
    return {fuera, choques, n:cajas.length};
  });
  m1.fuera.length ? mal('hoja 1, entrada fuera de la hoja → ' + m1.fuera.join(' ; '))
                  : ok('hoja 1: las ' + m1.n + ' entradas caben en la hoja');
  m1.choques.length ? mal('hoja 1, entradas montadas → ' + m1.choques.join(' ; '))
                    : ok('hoja 1: ninguna entrada se monta sobre otra');

  // ── hoja 2: la pieza grande. Con «1fr» pelado el precio, que no parte
  // por ningún lado, imponía su min-content y dejaba la foto en 57 px.
  const m2 = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.m2 .grande')).map(e => {
      const cols = getComputedStyle(e).gridTemplateColumns.split(' ').map(parseFloat);
      return {cols, foto: Math.round(e.querySelector('.foto').getBoundingClientRect().width)};
    }));
  const grandeMal = m2.filter(g => g.foto < 140 || Math.min(...g.cols) < 140);
  grandeMal.length
    ? mal('hoja 2, la pieza grande se aplastó → ' + JSON.stringify(m2))
    : ok('hoja 2: las piezas grandes reparten la fila (' + m2.map(g=>g.foto+'px').join(', ') + ')');

  // ── ningún texto se puede salir de su hoja, en ninguna de las cuatro
  const salidos = await p.evaluate(() => {
    const malos = [];
    document.querySelectorAll('.hoja').forEach(hoja => {
      const h = hoja.getBoundingClientRect();
      hoja.querySelectorAll('h3,h4,p,span,b,em').forEach(e => {
        if (!e.innerText || !e.innerText.trim()) return;
        const r = e.getBoundingClientRect();
        if (r.width < 1) return;
        if (r.right > h.right + 1 || r.left < h.left - 1)
          malos.push(hoja.className.replace('hoja ','') + ' · ' +
                     e.innerText.trim().slice(0,22));
      });
    });
    return malos;
  });
  salidos.length ? mal('texto fuera de su hoja → ' + salidos.slice(0,5).join(' ; '))
                 : ok('ningún texto se sale de su hoja');

  // ── nada que envejezca: ni un año escrito a mano en toda la página
  const anios = await p.evaluate(() => {
    const t = document.body.innerText;
    return (t.match(/\b(19|20)\d{2}\b/g) || []);
  });
  anios.length ? mal('año escrito a mano en la página: ' + anios.join(', '))
               : ok('no hay ningún año escrito a mano');

  await p.screenshot({ path: SALIDA + '/escritorio.png', fullPage:true });
  await ctx.close();
}

/* ── 2. teléfono: la hoja se desliza, la página no ───────────────── */
for (const ancho of [320, 390]){
  const ctx = await navegador.newContext({ viewport:{width:ancho,height:760},
    deviceScaleFactor:1, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  await p.goto(ARCHIVO, { waitUntil:'load' });
  await p.waitForTimeout(300);
  console.log('\n— teléfono ' + ancho + ' —');

  const desb = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  desb > 1 ? mal(ancho + ': desborde horizontal de ' + desb + 'px')
           : ok(ancho + ': la página no desborda');

  // y la hoja, que es un impreso, sí tiene que poder deslizarse de lado
  const visores = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.visor')).map(v => ({
      corre: v.scrollWidth - v.clientWidth,
      oculto: getComputedStyle(v).overflowX
    })));
  const presos = visores.filter(v => v.corre < 2 || v.oculto === 'hidden');
  presos.length ? mal(ancho + ': hay hojas que no se pueden deslizar → ' + JSON.stringify(visores))
                : ok(ancho + ': las 4 hojas se deslizan de lado');

  // la pista de «desliza» tiene que verse donde no hay ratón
  const pista = await p.evaluate(() => getComputedStyle(document.querySelector('.pista')).display);
  pista !== 'none' ? ok(ancho + ': se ve la pista de deslizar')
                   : mal(ancho + ': la pista de deslizar está oculta');

  await p.screenshot({ path: SALIDA + '/telefono-' + ancho + '.png', fullPage:true });
  await ctx.close();
}

/* ── 3. sin JavaScript: la página entera tiene que seguir ahí ─────── */
{
  const ctx = await navegador.newContext({ viewport:{width:1280,height:900},
    deviceScaleFactor:1, javaScriptEnabled:false });
  const p = await ctx.newPage();
  await p.goto(ARCHIVO, { waitUntil:'load' });
  await p.waitForTimeout(250);
  console.log('\n— sin JavaScript —');
  const letras = (await p.locator('body').innerText()).replace(/\s+/g,' ').trim().length;
  letras > 2500 ? ok('quedan ' + letras + ' caracteres legibles sin JS')
                : mal('solo quedan ' + letras + ' caracteres sin JS');
  await ctx.close();
}

/* ── 4. contraste medido sobre el compuesto real ──────────────────── */
{
  const ctx = await navegador.newContext({ viewport:{width:1440,height:960}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  await p.goto(ARCHIVO, { waitUntil:'load' });
  // scroll-behavior:smooth animaba entre las dos capturas y el diff
  // comparaba fotogramas desalineados: de ahí razones imposibles.
  await p.addStyleTag({ content: '*,*::before,*::after{scroll-behavior:auto !important}' });
  await p.waitForTimeout(400);
  console.log('\n— contraste —');

  const sel = [
    '.chapa', '.chapa i', 'h1', '.intro p', '.aviso', '.muestra .num',
    '.muestra h2', '.muestra .para', '.pista', 'footer p',
    // hoja 1
    '.m1 .titular', '.m1 .plato h3', '.m1 .plato p', '.m1 .gr', '.m1 .pr', '.m1 .disco',
    '.m1 .pie-hoja',
    // hoja 2
    '.m2 .rotulo', '.m2 .grande .pr', '.m2 .grande h4', '.m2 .it .pr', '.m2 .it h4',
    '.m2 .it p', '.m2 .kcal', '.m2 .marca', '.m2 .it .foto', '.m2 .pie-hoja',
    // hoja 3
    '.m3 .alto', '.m3 .rotulo', '.m3 .sumario b', '.m3 .sumario span', '.m3 .nota',
    '.m3 .it h4', '.m3 .it p', '.m3 .it .pr', '.m3 .it .foto', '.m3 .bloque-foto',
    '.m3 .franja .foto', '.m3 .pie-hoja',
    // hoja 4, bloque por bloque: el fondo cambia en cada uno
    '.m4 .amarillo .lomo', '.m4 .amarillo .it h4', '.m4 .amarillo .it p',
    '.m4 .amarillo .it .pr', '.m4 .amarillo .it .gr', '.m4 .amarillo .it .foto',
    '.m4 .naranja .lomo', '.m4 .naranja .it h4', '.m4 .naranja .it p',
    '.m4 .naranja .it .pr', '.m4 .naranja .it .gr', '.m4 .naranja .it .foto',
    '.m4 .rosa .lomo', '.m4 .rosa .it h4', '.m4 .rosa .it p',
    '.m4 .rosa .it .pr', '.m4 .rosa .it .gr', '.m4 .rosa .it .foto',
    '.m4 .rojo .lomo', '.m4 .rojo .it h4', '.m4 .rojo .it p',
    '.m4 .rojo .it .pr', '.m4 .rojo .it .gr', '.m4 .rojo .it .foto', '.m4 .pie-hoja'
  ];

  const objetivos = await p.evaluate((sels) => {
    const out = [];
    sels.forEach(s => {
      const els = Array.from(document.querySelectorAll(s)).filter(e => {
        const r = e.getBoundingClientRect();
        // los huecos de foto llevan su etiqueta en un ::after: no tienen
        // innerText, pero sí hay texto que medir
        const conLetras = e.innerText.trim().length > 0 || !!e.dataset.pie;
        return r.width > 4 && r.height > 4 && conLetras;
      }).slice(0,3);
      els.forEach((e,i) => {
        if (e.dataset.ctId) return;      // ya lo mide otro selector
        e.dataset.ctId = s + '#' + i; out.push(s + '#' + i);
      });
    });
    return out;
  }, sel);

  const malos = [];
  let medidos = 0;
  const cola = objetivos.slice(), intentos = {}, sinMedir = [];
  while (cola.length) {
    const id = cola.shift();
    // La chapa lleva backdrop-filter: lo que pasa por debajo cambia su
    // desenfoque, así que la franja de arriba no se mide nunca.
    const BANDA = 70;
    // La caja y los píxeles tienen que quedarse quietos los dos. Medir con
    // una caja vieja fue exactamente el fallo: el bloque todavía estaba
    // subiendo con su animación de aparición, se le tomaba la medida antes
    // de que acabara de subir y, para cuando se disparaba la foto, el texto
    // ya no estaba ahí. Salía un recorte de fondo liso y una razón de 1,1:1
    // sobre un negro sobre crema que de verdad da 14:1.
    const mide = () => p.evaluate(({id, BANDA}) => {
      const e = document.querySelector('[data-ct-id="' + CSS.escape(id) + '"]');
      if (!e) return null;
      e.scrollIntoView({block:'center'});
      const r = e.getBoundingClientRect();
      const x = Math.max(0, r.x), y = Math.max(BANDA, r.y);
      // Dos fotogramas iguales NO bastan: mientras corre el retardo de la
      // animación de aparición no se mueve nada, así que la quietud se da
      // por buena antes de que el bloque empiece siquiera a aparecer. Se
      // toma la foto «con texto» sobre un hueco vacío, la de «sin texto»
      // ya pilla el texto a medio aparecer, y sale una razón de 1,1:1.
      //
      // Lo que hay que preguntar es si queda alguna animación en marcha, y
      // hay que preguntárselo también a los ANTEPASADOS: la aparición vive
      // en el bloque de arriba, no en el texto, y `getAnimations` con
      // `subtree` mira hacia abajo, nunca hacia arriba. Por ahí se colaba.
      //
      // Y no vale mirar la opacidad acumulada: hay texto con opacidad de
      // diseño —0,86 en la carta de bloques de color— que nunca llega a 1
      // y se quedaba sin medir para siempre.
      const corre = a => a.playState === 'running' || a.playState === 'pending';
      let moviendo = e.getAnimations({subtree:true}).some(corre);
      for (let n = e.parentElement; n && !moviendo; n = n.parentElement)
        moviendo = n.getAnimations().some(corre);
      return {x, y, width: Math.min(r.right, innerWidth) - x,
                    height: Math.min(r.bottom, innerHeight) - y,
              listo: !moviendo};
    }, {id, BANDA});
    const vale = c => c && c.width > 4 && c.height > 4;
    const igualCaja = (c,d) => Math.abs(c.x-d.x) < .5 && Math.abs(c.y-d.y) < .5 &&
                               Math.abs(c.width-d.width) < .5 && Math.abs(c.height-d.height) < .5;
    let caja = await mide();
    if (!vale(caja)) continue;
    let a = await p.screenshot({ clip: caja }), quieta = false;
    for (let t = 0; t < 26; t++){
      await p.waitForTimeout(120);
      const otra = await mide();
      if (!vale(otra)) { caja = null; break; }
      const foto = await p.screenshot({ clip: otra });
      if (otra.listo && igualCaja(otra, caja) && foto.equals(a)) {
        quieta = true; caja = otra; a = foto; break; }
      caja = otra; a = foto;
    }
    if (!caja) continue;
    if (!quieta) { sinMedir.push(id); continue; }

    // Apagar el texto con una regla, no con estilo en línea: la mitad de
    // las etiquetas de esta página viven en un ::after y el estilo en
    // línea del elemento no las toca.
    await p.evaluate(i => {
      const s = document.createElement('style'); s.id = 'ct-apaga';
      // CSS.escape y nada más: dentro de las comillas del atributo, «\.»
      // ya vale por un punto. Doblar la barra la convierte en una barra
      // de verdad, la regla deja de casar, la captura «sin texto» sale
      // idéntica a la otra y TODAS las medidas salen nulas y se saltan
      // en silencio. Pasó: la primera corrida dio 144 de 144 «bien».
      const q = '[data-ct-id="' + CSS.escape(i) + '"]';
      s.textContent =
        q + ',' + q + ' *{color:transparent !important;' +
        '-webkit-text-fill-color:transparent !important}' +
        q + '::after,' + q + '::before{content:none !important}';
      document.head.appendChild(s);
    }, id);
    await p.waitForTimeout(130);
    const b = await p.screenshot({ clip: caja });   // sin texto
    await p.evaluate(() => document.getElementById('ct-apaga')?.remove());

    // Y una última comprobación, después de revelar el texto otra vez:
    // si la caja se movió entre las dos fotos, lo medido son dos
    // recortes distintos y el número no significa nada. Al final de
    // la cola, que es lo que le da tiempo a la página a asentarse.
    const despues = await mide();

    if (!vale(despues) || !igualCaja(despues, caja)) {
      intentos[id] = (intentos[id] || 0) + 1;
      if (intentos[id] < 4) { cola.push(id); continue; }
      sinMedir.push(id); continue;
    }


    const razon = await p.evaluate(async ({a,b}) => {
      async function img(d){ const i=new Image(); i.src='data:image/png;base64,'+d;
        await i.decode(); const c=document.createElement('canvas');
        c.width=i.width;c.height=i.height; const x=c.getContext('2d');
        x.drawImage(i,0,0); return x.getImageData(0,0,c.width,c.height).data; }
      const A = await img(a), B = await img(b);
      function lm(c){const s=c/255;return s<=.03928?s/12.92:Math.pow((s+.055)/1.055,2.4);}
      function Lu(r,g,bb){return .2126*lm(r)+.7152*lm(g)+.0722*lm(bb);}
      // Un glifo antialiasado tiene el color declarado SOLO en los píxeles
      // de cobertura total; los del borde son mezcla y dan razones
      // falsamente bajas. Se mide donde el texto cubre del todo: los
      // píxeles cuya diferencia con el fondo llega al 97 % de la máxima.
      let mx = 0; const difs = [];
      for (let i=0;i<A.length;i+=4){
        const d = Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2]);
        if (d > 10){ difs.push([i,d]); if (d > mx) mx = d; }
      }
      if (!difs.length || mx < 30) return null;
      let mejor = 0;
      for (const [i,d] of difs){
        if (d < mx*0.97) continue;
        const l1 = Lu(A[i],A[i+1],A[i+2]), l2 = Lu(B[i],B[i+1],B[i+2]);
        const r = (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
        if (r > mejor) mejor = r;
      }
      return mejor;
    }, { a: a.toString('base64'), b: b.toString('base64') });

    if (razon === null) continue;
    medidos++;
    if (razon < 4.5) malos.push(id + ' = ' + razon.toFixed(2));
  }
  // Guardia contra la prueba rota: si el apagado del texto deja de
  // funcionar, el diff sale vacío, todo devuelve null y la prueba canta
  // «bien» sin haber medido nada. Que lo diga.
  if (sinMedir.length)
    console.log('       sin medir (no se quedan quietos): ' + sinMedir.join(', '));
  medidos < objetivos.length * 0.8
    ? mal('solo se pudieron medir ' + medidos + ' de ' + objetivos.length +
          ' elementos: la prueba está rota, no la página')
    : malos.length
      ? mal('contraste bajo 4,5:1 → ' + malos.join('  |  '))
      : ok('los ' + medidos + ' elementos medidos pasan 4,5:1');
  await ctx.close();
}

await navegador.close();
console.log('\n' + (fallos.length ? '✗ ' + fallos.length + ' fallo(s)' : '✓ todo pasa'));
process.exit(fallos.length ? 1 : 0);
