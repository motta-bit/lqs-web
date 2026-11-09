#!/usr/bin/env node
/* Comprobaciones de la muestra de tiendas.
 *
 *     node demos/pruebas/probar-tiendas.mjs [carpeta-de-capturas]
 *
 * Necesita Playwright y un Chromium. Mide lo que no se puede mirar a ojo:
 * contraste sobre el compuesto real elemento por elemento, desborde a 320 y
 * 390 px, la página sin JavaScript, el movimiento reducido, y que lo que se
 * promete en la propuesta de verdad funcione.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const AQUI = new URL('.', import.meta.url).pathname;
const ARCHIVO = 'file://' + AQUI + '../tiendas.html';
const SALIDA = process.argv[2] || (AQUI + 'capturas-tiendas');

import { mkdirSync } from 'node:fs';
mkdirSync(SALIDA, { recursive: true });

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const fallos = [];
const ok = m => console.log('  ok   ' + m);
// Espera a que la página deje de desplazarse. Hacer clic en mitad de un
// desplazamiento suave da resultados que no significan nada.
const quietud = async p => p.evaluate(async () => {
  // El primer respiro no es opcional: justo después del clic el
  // desplazamiento suave todavía no ha arrancado, y dos lecturas seguidas
  // darían el valor viejo como si ya estuviera quieto.
  await new Promise(r => setTimeout(r, 260));
  let antes = -1, ahora = scrollY, v = 0;
  while (antes !== ahora && v++ < 50){
    antes = ahora;
    await new Promise(r => setTimeout(r, 110));
    ahora = scrollY;
  }
  return ahora;
});
const mal = m => { fallos.push(m); console.log('  MAL  ' + m); };

/* ── 1. escritorio: errores de consola, desborde, idioma ─────────── */
{
  const ctx = await navegador.newContext({ viewport:{width:1440,height:960}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  const errores = [];
  p.on('console', m => { if (m.type()==='error') errores.push(m.text()); });
  p.on('pageerror', e => errores.push('pageerror: ' + e.message));
  await p.goto(ARCHIVO, { waitUntil:'load' });
  await p.waitForTimeout(400);

  console.log('\n— escritorio 1440 —');
  const pagoArranque = await p.locator('#resumenPago .tot span:last-child').textContent();
  pagoArranque !== '$0' ? ok('el pago no arranca en $0 (' + pagoArranque + ')') : mal('el pago arranca en $0');
  errores.length ? mal('consola: ' + errores.join(' | ')) : ok('sin errores de consola');

  const desb = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  desb > 1 ? mal('desborde horizontal: ' + desb + 'px') : ok('sin desborde horizontal');

  // la carta se pintó
  // los enlaces del hero no pueden dejar el título debajo de la chapa
  await p.locator('.portada .hero-botones a[href="#armado"]').click();
  await p.waitForTimeout(900);
  const tapado = await p.evaluate(() => {
    const ch = document.querySelector('.chapa').getBoundingClientRect();
    const r = document.querySelector('#armado .rotulo').getBoundingClientRect();
    return Math.round(ch.bottom - r.top);
  });
  tapado <= 0 ? ok('el ancla #armado no queda bajo la chapa')
              : mal('#armado queda ' + tapado + 'px bajo la chapa');
  await p.evaluate(() => scrollTo(0,0));
  await p.waitForTimeout(500);

  // ninguna sección anidada puede traer el padding de las de página
  const anidadas = await p.evaluate(() => {
    const malas = [];
    document.querySelectorAll('main section section, main section > div section').forEach(e => {
      const pt = parseFloat(getComputedStyle(e).paddingTop);
      if (pt > 8) malas.push((e.className || e.tagName) + ' padding-top ' + pt);
    });
    return malas;
  });
  anidadas.length ? mal('sección anidada con padding de página → ' + anidadas.join(' ; '))
                  : ok('ninguna sección anidada hereda el padding de página');

  // Todavía no hay fotos de la tienda: lo que se comprueba es que cada
  // hueco se vea como un sitio reservado —con su tono de categoría y su
  // etiqueta— y no como un rectángulo roto.
  const huecos = await p.evaluate(() => {
    const malos = [];
    const todos = Array.from(document.querySelectorAll('.hueco'));
    todos.forEach(e => {
      const cs = getComputedStyle(e);
      if (!e.dataset.pie) malos.push('sin etiqueta');
      if (cs.backgroundColor === 'rgba(0, 0, 0, 0)') malos.push('sin tono de fondo');
    });
    return {malos, n: todos.length};
  });
  huecos.malos.length
    ? mal('huecos mal puestos → ' + huecos.malos.slice(0,3).join(' ; '))
    : ok('los ' + huecos.n + ' huecos de foto están marcados');

  // y ninguna puede quedarse en 0 × 0: un <span> inline no toma alto
  const aplastadas = await p.evaluate(() => {
    const malas = [];
    document.querySelectorAll('.hueco').forEach(e => {
      const r = e.getBoundingClientRect();
      if (r.width < 8 || r.height < 8)
        malas.push(Math.round(r.width) + '×' + Math.round(r.height) +
                   ' (' + getComputedStyle(e).display + ')');
    });
    return malas;
  });
  aplastadas.length ? mal('fotos aplastadas → ' + aplastadas.slice(0,3).join(' ; '))
                    : ok('ninguna foto queda en cero');

  // ── tallas y existencias, que es lo que una carta no tiene ──
  const stock = await p.evaluate(() => {
    const r = {};
    const porNombre = n => Array.from(document.querySelectorAll('#prods .prod'))
      .find(e => e.innerText.indexOf(n) === 0);
    const camisa = porNombre('Camisa de lino');
    const chaqueta = porNombre('Chaqueta de lona');
    r.camisaTallas = camisa.querySelectorAll('.tallas button').length;
    r.xlBloqueada = !!camisa.querySelector('.tallas button[data-op="XL"][disabled]');
    r.chaquetaAgotada = chaqueta.classList.contains('agotado');
    r.chaquetaSinMas = !chaqueta.querySelector('.mas');
    r.chaquetaDice = !!chaqueta.querySelector('.sin-stock');
    return r;
  });
  stock.camisaTallas === 4 ? ok('la camisa enseña sus 4 tallas')
                           : mal('tallas de la camisa: ' + stock.camisaTallas);
  stock.xlBloqueada ? ok('la talla agotada está bloqueada, no escondida')
                    : mal('la XL agotada se puede escoger');
  (stock.chaquetaAgotada && stock.chaquetaSinMas && stock.chaquetaDice)
    ? ok('el producto agotado lo dice y no se puede añadir')
    : mal('el agotado no está bien marcado: ' + JSON.stringify(stock));

  // escoger una talla tiene que llegar hasta el mensaje
  await p.evaluate(() => {
    const camisa = Array.from(document.querySelectorAll('#prods .prod'))
      .find(e => e.innerText.indexOf('Camisa de lino') === 0);
    camisa.querySelector('.tallas button[data-op="L"]').click();
    camisa.querySelector('.mas').click();
  });
  await p.waitForTimeout(2400);
  const conTalla = await p.locator('#globoWa').textContent();
  /Camisa de lino \(Talla L\)/.test(conTalla)
    ? ok('la talla escogida viaja hasta el mensaje')
    : mal('la talla no llega al mensaje: ' + JSON.stringify(conTalla.slice(0,120)));
  await p.reload({waitUntil:'load'});
  await p.waitForTimeout(500);

  const nPlatos = await p.locator('#prods .prod').count();
  nPlatos === 10 ? ok('10 productos pintados') : mal('platos pintados: ' + nPlatos);

  // filtro
  await p.locator('#pestanas button').nth(2).click();   // accesorios
  await p.waitForTimeout(120);
  const nAcc = await p.locator('#prods .prod').count();
  nAcc === 3 ? ok('filtro «accesorios» deja 3') : mal('filtro accesorios deja ' + nAcc);
  await p.locator('#pestanas button').nth(0).click();
  await p.waitForTimeout(120);

  // ── las cuatro formas de acomodar la carta ──
  const formas = ['tarjetas','carrusel','bento','libre'];
  for (let i = 0; i < formas.length; i++){
    await p.locator('#rail button').nth(i).click();
    await p.waitForTimeout(220);
    const cls = await p.locator('#prods').getAttribute('class');
    const esperada = 'prods ' + formas[i];
    cls === esperada ? ok('forma «' + formas[i] + '» aplicada')
                     : mal('forma ' + formas[i] + ' → class="' + cls + '"');
    const nP = await p.locator('#prods .prod').count();
    nP === 10 ? ok('  ' + formas[i] + ': los 10 productos siguen ahi')
              : mal(formas[i] + ': ' + nP + ' productos');
    const antesTot = await p.locator('#carritoTot').textContent();
    await p.locator('#prods .prod').nth(1).locator('.mas').click();
    await p.waitForTimeout(140);
    const despuesTot = await p.locator('#carritoTot').textContent();
    antesTot !== despuesTot ? ok('  ' + formas[i] + ': el «+» suma al carrito')
                            : mal(formas[i] + ': el «+» no hace nada');
    const fuga = await p.evaluate(() => {
      const t = document.querySelector('.tel-pantalla').getBoundingClientRect();
      const rueda = e => {
        let a = e.parentElement;
        while (a && a !== document.body){
          const o = getComputedStyle(a).overflowX;
          if (o === 'auto' || o === 'scroll') return true;
          a = a.parentElement;
        }
        return false;
      };
      const malos = [];
      document.querySelectorAll('#prods .prod').forEach(e => {
        const r = e.getBoundingClientRect();
        if ((r.right > t.right + 1.5 || r.left < t.left - 1.5) && !rueda(e))
          malos.push(Math.round(r.left) + '→' + Math.round(r.right));
      });
      return malos;
    });
    fuga.length === 0
      ? ok('  ' + formas[i] + ': nada se sale del telefono')
      : mal(formas[i] + ': se salen ' + fuga.slice(0,3).join(' ; '));
    if (formas[i] === 'carrusel' || formas[i] === 'bento'){
      const desalineados = await p.evaluate(() => {
        // los precios de una misma fila deben quedar a la misma altura
        const filas = {};
        document.querySelectorAll('#prods .precio').forEach(e => {
          const t = e.closest('.prod').getBoundingClientRect().top.toFixed(0);
          (filas[t] = filas[t] || []).push(e.getBoundingClientRect().bottom);
        });
        let n = 0;
        Object.keys(filas).forEach(k => {
          const v = filas[k];
          if (Math.max.apply(null, v) - Math.min.apply(null, v) > 2) n++;
        });
        return n;
      });
      desalineados === 0 ? ok('  ' + formas[i] + ': los precios cuadran en su fila')
                         : mal(formas[i] + ': ' + desalineados + ' filas con precios desalineados');
    }
  }
  await p.locator('#rail button').nth(0).click();
  await p.waitForTimeout(200);
  await p.reload({waitUntil:'load'});
  await p.waitForTimeout(450);

  // carrito
  // arranca con camisa 189.000 + bolso 480.000 = 669.000
  const totIni = await p.locator('#carritoTot').textContent();
  totIni === '$669.000' ? ok('arranca con pedido puesto: $669.000') : mal('total inicial: ' + totIni);
  await p.locator('#prods .prod').nth(0).locator('.mas').click();  // +camisa talla S
  await p.locator('#prods .prod').nth(3).locator('.mas').click();  // +vestido 265000
  await p.waitForTimeout(150);
  const tot = await p.locator('#carritoTot').textContent();
  tot === '$1.123.000' ? ok('total del carrito $1.123.000') : mal('total del carrito: ' + tot);
  const n = await p.locator('#carritoN').textContent();
  /4 productos/.test(n) ? ok('conteo «4 productos»') : mal('conteo: ' + n);
  const visible = await p.locator('#barraCarrito').evaluate(e => e.classList.contains('visible'));
  visible ? ok('la barra del carrito subió') : mal('la barra del carrito no subió');

  // whatsapp se escribe
  await p.waitForTimeout(3000);
  const wa = await p.locator('#globoWa').textContent();
  /Camisa de lino \(Talla M\)/.test(wa) && /\$1\.123\.000/.test(wa)
    ? ok('el mensaje de WhatsApp trae platos y total')
    : mal('mensaje de WhatsApp: ' + JSON.stringify(wa.slice(0,160)));
  /recogerlo a la tienda/.test(wa) ? ok('por defecto, recoge en tienda') : mal('falta el estado «recoger»');

  // domicilio
  await p.locator('#btnEnvio').click();
  await p.waitForTimeout(3200);
  const wa2 = await p.locator('#globoWa').textContent();
  /Envío a:/.test(wa2) ? ok('el botón de envío cambia el mensaje') : mal('el envío no cambia el mensaje');
  const pagoTot = await p.locator('#resumenPago .tot span:last-child').textContent();
  pagoTot === '$1.139.000' ? ok('el pago suma el envío: $1.139.000') : mal('total de pago: ' + pagoTot);

  // medios de pago
  await p.locator('.medio[data-medio="pse"]').click();
  const marcado = await p.locator('.medio[data-medio="pse"]').getAttribute('aria-checked');
  marcado === 'true' ? ok('PSE queda seleccionado') : mal('PSE no se selecciona');

  // pagar → aprobado → volver
  await p.locator('#btnPagar').click();
  await p.waitForTimeout(250);
  const aprob = await p.locator('#zonaAprobado').isVisible();
  aprob ? ok('la pantalla de aprobado aparece') : mal('no aparece el aprobado');
  const ocultoPago = await p.locator('#zonaPago').isHidden();
  ocultoPago ? ok('el formulario de pago se esconde') : mal('el formulario de pago sigue visible');
  const dice = await p.locator('#zonaAprobado p').innerText();
  /no se cobra/i.test(dice) ? ok('el aprobado dice que no se cobra') : mal('el aprobado no lo aclara: ' + JSON.stringify(dice));
  await p.locator('#btnVolverPago').click();
  await p.waitForTimeout(200);
  const volvio = await p.locator('#zonaPago').isVisible();
  volvio ? ok('«Volver» devuelve el pago') : mal('«Volver» no devuelve el pago');
  // y el botón sigue sirviendo una segunda vez
  await p.locator('#btnPagar').click();
  await p.waitForTimeout(200);
  const otra = await p.locator('#zonaAprobado').isVisible();
  otra ? ok('el pago funciona una segunda vez') : mal('el pago no funciona la segunda vez');
  await p.locator('#btnVolverPago').click();
  await p.waitForTimeout(150);

  // temporada
  const antes = await p.locator('#vigencia').textContent();
  await p.locator('#btnTanda').click();
  await p.waitForTimeout(200);
  const despues = await p.locator('#vigencia').textContent();
  antes !== despues ? ok('la temporada cambia: ' + despues.trim().slice(0,40)) : mal('la temporada no cambia');
  // la vigencia sale del reloj: no puede haber una fecha escrita a mano,
  // y las dos temporadas tienen que caer en este mes y en el siguiente
  const fechas = await p.evaluate(() => {
    const leer = () => document.querySelector('#vigencia .es').textContent;
    const a = leer();
    document.querySelector('#btnTanda').click();
    const b = leer();
    document.querySelector('#btnTanda').click();
    const h = new Date();
    const mes = i => new Date(h.getFullYear(), h.getMonth() + i + 1, 0);
    const MES = ['enero','febrero','marzo','abril','mayo','junio','julio',
                 'agosto','septiembre','octubre','noviembre','diciembre'];
    const esperada = i => mes(i).getDate() + ' de ' + MES[mes(i).getMonth()];
    return {a, b, ea: esperada(0), eb: esperada(1)};
  });
  // sin dar por hecho cuál de las dos temporadas está puesta: para cuando
  // esta prueba corre, un paso anterior ya pudo haber cambiado la franja
  const par = [fechas.a, fechas.b].join(' | ');
  (par.indexOf(fechas.ea) > -1 && par.indexOf(fechas.eb) > -1)
    ? ok('la vigencia sale del reloj: «' + fechas.a.trim() + '»')
    : mal('vigencia fija → ' + par + '  (esperaba ' + fechas.ea + ' y ' + fechas.eb + ')');

  // y nada en la página puede llevar un año escrito a mano
  const fechasFijas = await p.evaluate(() => {
    const t = document.body.innerText;
    return (t.match(/\b20\d\d\b/g) || []).filter(x => x !== '');
  });
  fechasFijas.length ? mal('años escritos a mano en la página → ' + fechasFijas.join(', '))
                     : ok('ningún año escrito a mano en la página');

  const nTemp = await p.locator('#tiraNov .nov').count();
  nTemp === 3 ? ok('3 productos en la franja') : mal('platos de temporada: ' + nTemp);

  // resumen final
  const nMod = await p.locator('#resumenFinal .ficha').count();
  nMod === 7 ? ok('las 7 ganancias en el resumen') : mal('ganancias en el resumen: ' + nMod);
  // el resumen tiene que ser corto: una línea por ficha
  const largas = await p.evaluate(() => {
    const malas = [];
    document.querySelectorAll('#resumenFinal .ficha').forEach(e => {
      const t = e.querySelector('h3').innerText.trim();
      const d = e.querySelector('.desc').innerText.trim();
      if (t.length > 30) malas.push('título largo: ' + t);
      if (d.length > 72) malas.push('línea larga: ' + d.slice(0,40) + '…');
    });
    return malas;
  });
  largas.length ? mal('el resumen se alarga → ' + largas.slice(0,3).join(' ; '))
                : ok('el resumen cabe en una línea por ficha');

  // los dos saltos: al resumen desde arriba, y de vuelta al inicio
  await p.evaluate(() => scrollTo(0,0));
  await quietud(p);
  await p.locator('.portada .hero-botones a[href="#resumen"]').click();
  await quietud(p);
  const enResumen = await p.evaluate(() => {
    const ch = document.querySelector('.chapa').getBoundingClientRect();
    const r = document.querySelector('#resumen .rotulo').getBoundingClientRect();
    return Math.round(ch.bottom - r.top);
  });
  enResumen <= 0 ? ok('«Ir al resumen» deja el título a la vista')
                 : mal('el resumen queda ' + enResumen + 'px bajo la chapa');
  await p.locator('.volver').click();
  const arriba = await quietud(p);
  arriba < 80 ? ok('«Volver al inicio» sube del todo (' + arriba + 'px)')
              : mal('«Volver al inicio» deja la página en ' + arriba + 'px');

  // ── idioma ──
  // Ningún bloque puede enseñar los dos idiomas a la vez: basta una regla
  // local que toque display para que el otro se cuele.
  const dobles = await p.evaluate(() => {
    const malos = [];
    document.querySelectorAll('.es,.en').forEach(e => {
      const oculto = getComputedStyle(e).display === 'none';
      const debe = e.classList.contains('en');   // en modo ES, el inglés se oculta
      if (oculto !== debe)
        malos.push((e.className) + ' «' + e.textContent.trim().slice(0,28) + '»');
    });
    return malos;
  });
  dobles.length ? mal('ES: idioma visible de más → ' + dobles.slice(0,4).join(' ; '))
                : ok('ES: ningún bloque enseña los dos idiomas');

  await p.locator('.leng a[href="#en"]').click();
  await p.waitForTimeout(300);
  const h1 = await p.locator('h1').innerText();
  /open to the whole country/i.test(h1) ? ok('EN: el titular cambia') : mal('EN: titular = ' + JSON.stringify(h1));
  const hayEs = await p.locator('h1 .es').isVisible().catch(()=>false);
  !hayEs ? ok('EN: el español queda oculto') : mal('EN: el español sigue visible');
  const cuerpoVisible = await p.evaluate(() => document.body.getBoundingClientRect().height > 1000);
  cuerpoVisible ? ok('EN: la página no se vacía') : mal('EN: la página quedó vacía');
  const nEn = await p.locator('#carritoN').textContent();
  /items|item/.test(nEn) ? ok('EN: el conteo del carrito se traduce') : mal('EN: conteo = ' + nEn);
  const waEn = await p.locator('#globoWa').textContent();
  await p.waitForTimeout(3200);
  const waEn2 = await p.locator('#globoWa').textContent();
  /I would like to order/.test(waEn2) ? ok('EN: el mensaje se reescribe en inglés') : mal('EN: mensaje = ' + JSON.stringify(waEn2.slice(0,90)));
  const platoEn = await p.locator('#prods .prod').nth(0).innerText();
  /Linen shirt/.test(platoEn) ? ok('EN: los productos se traducen') : mal('EN: plato = ' + JSON.stringify(platoEn.slice(0,60)));
  const dobles2 = await p.evaluate(() => {
    const malos = [];
    document.querySelectorAll('.es,.en').forEach(e => {
      const oculto = getComputedStyle(e).display === 'none';
      const debe = e.classList.contains('es');
      if (oculto !== debe) malos.push(e.className + ' «' + e.textContent.trim().slice(0,28) + '»');
    });
    return malos;
  });
  dobles2.length ? mal('EN: idioma visible de más → ' + dobles2.slice(0,4).join(' ; '))
                 : ok('EN: ningún bloque enseña los dos idiomas');

  await p.locator('.leng a[href="#es"]').click();
  await p.waitForTimeout(250);
  const h1es = await p.locator('h1').innerText();
  /abierta a todo el país/.test(h1es) ? ok('ES: vuelve al español') : mal('ES: titular = ' + JSON.stringify(h1es));

  // captura
  await p.evaluate(() => scrollTo(0,0));
  await p.waitForTimeout(500);
  await p.screenshot({ path: SALIDA + '/escritorio-portada.png' });
  await p.evaluate(() => document.querySelector('#armado').scrollIntoView());
  await p.waitForTimeout(900);
  await p.screenshot({ path: SALIDA + '/escritorio-carta.png' });
  await p.evaluate(() => document.querySelector('#resumen').scrollIntoView());
  await p.waitForTimeout(900);
  await p.screenshot({ path: SALIDA + '/escritorio-completa.png' });
  await ctx.close();
}

/* ── 2. móvil 320 y 390 ──────────────────────────────────────────── */
for (const w of [320, 390]) {
  const ctx = await navegador.newContext({ viewport:{width:w,height:780}, deviceScaleFactor:1, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  await p.goto(ARCHIVO, { waitUntil:'load' });
  await p.waitForTimeout(500);
  console.log('\n— móvil ' + w + ' —');
  const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  d > 1 ? mal(w + ': desborde ' + d + 'px') : ok(w + ': sin desborde');
  // ningún bloque se sale
  const anchos = await p.evaluate(() => {
    const malos = [];
    const rueda = e => {                 // ¿vive dentro de algo que rueda de lado?
      let a = e.parentElement;
      while (a && a !== document.body){
        const o = getComputedStyle(a).overflowX;
        if (o === 'auto' || o === 'scroll') return true;
        a = a.parentElement;
      }
      return false;
    };
    document.querySelectorAll('section, .vidrio, .solido, .tel, .tabla, h1, h2, .lienzo').forEach(e=>{
      const r = e.getBoundingClientRect();
      if ((r.right > innerWidth + 1.5 || r.left < -1.5) && !rueda(e))
        malos.push((e.className||e.tagName) + ' ' + Math.round(r.left) + '→' + Math.round(r.right));
    });
    return malos;
  });
  anchos.length ? mal(w + ': se salen → ' + anchos.slice(0,5).join(' ; ')) : ok(w + ': nada se sale del ancho');
  // cada disposición tiene que aguantar este ancho
  for (let i = 0; i < 4; i++){
    await p.locator('#rail button').nth(i).click();
    await p.waitForTimeout(200);
    const d2 = await p.evaluate(() => document.documentElement.scrollWidth -
                                      document.documentElement.clientWidth);
    const nom = await p.locator('#rail button').nth(i).innerText();
    d2 > 1 ? mal(w + ': desborde ' + d2 + 'px con «' + nom.trim() + '»')
           : ok(w + ': ' + nom.trim().toLowerCase() + ' sin desborde');
  }
  await p.locator('#rail button').nth(0).click();
  await p.waitForTimeout(200);
  if (w === 390) {
    await p.evaluate(() => scrollTo(0,0)); await p.waitForTimeout(400);
    await p.screenshot({ path: SALIDA + '/movil-portada.png', fullPage:false });
    await p.evaluate(() => document.querySelector('#armado').scrollIntoView());
    await p.waitForTimeout(800);
    await p.screenshot({ path: SALIDA + '/movil-carta.png' });
  }
  await ctx.close();
}

/* ── 3. sin JavaScript: ¿queda legible? ──────────────────────────── */
{
  const ctx = await navegador.newContext({ viewport:{width:1280,height:900}, javaScriptEnabled:false, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  await p.goto(ARCHIVO, { waitUntil:'load' });
  await p.waitForTimeout(300);
  console.log('\n— sin JavaScript —');
  const txt = await p.evaluate(() => document.body.innerText.replace(/\s+/g,' ').trim());
  txt.length > 3000 ? ok('texto legible sin JS: ' + txt.length + ' caracteres') : mal('solo ' + txt.length + ' caracteres sin JS');
  const invis = await p.evaluate(() => {
    let n = 0;
    document.querySelectorAll('.sube').forEach(e => { if (getComputedStyle(e).opacity !== '1') n++; });
    return n;
  });
  invis === 0 ? ok('nada queda invisible sin JS') : mal(invis + ' bloques invisibles sin JS');
  // el cambio de idioma funciona sin JS
  await p.locator('.leng a[href="#en"]').click();
  await p.waitForTimeout(250);
  const h1 = await p.locator('h1').innerText();
  /open to the whole country/i.test(h1) ? ok('sin JS: el cambio de idioma funciona') : mal('sin JS: idioma = ' + JSON.stringify(h1));
  const alto = await p.evaluate(() => document.body.scrollHeight);
  alto > 2000 ? ok('sin JS en inglés: la página sigue entera (' + alto + 'px)') : mal('sin JS en inglés: alto ' + alto);
  await p.screenshot({ path: SALIDA + '/sin-js.png' });
  await ctx.close();
}

/* ── 4. movimiento reducido ──────────────────────────────────────── */
{
  const ctx = await navegador.newContext({ viewport:{width:1280,height:900}, reducedMotion:'reduce', deviceScaleFactor:1 });
  const p = await ctx.newPage();
  await p.goto(ARCHIVO, { waitUntil:'load' });
  await p.waitForTimeout(400);
  console.log('\n— movimiento reducido —');
  await p.locator('#prods .prod').nth(0).locator('.mas').click();
  await p.waitForTimeout(120);
  const wa = await p.locator('#globoWa').textContent();
  /Total/.test(wa) ? ok('el mensaje sale completo de inmediato') : mal('el mensaje no sale completo: ' + JSON.stringify(wa.slice(0,80)));
  const ops = await p.evaluate(() => {
    let n = 0; document.querySelectorAll('.sube').forEach(e=>{ if (getComputedStyle(e).opacity !== '1') n++; }); return n;
  });
  ops === 0 ? ok('nada oculto con movimiento reducido') : mal(ops + ' bloques ocultos');
  await ctx.close();
}

/* ── 5. contraste medido sobre el compuesto real ─────────────────── */
{
  const ctx = await navegador.newContext({ viewport:{width:1280,height:900}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  await p.goto(ARCHIVO, { waitUntil:'load' });
  // scroll-behavior:smooth seguía animando entre las dos capturas y el diff
  // comparaba fotogramas desalineados: de ahí razones de 1,1:1 imposibles.
  await p.addStyleTag({ content: '*,*::before,*::after{scroll-behavior:auto !important}' });
  await p.waitForTimeout(500);
  console.log('\n— contraste —');
  const sel = ['h1','h2','h3','p.grande','.tenue','.rotulo','.pastilla','.cifras-hero span',
               '.prod h5','.prod .desc','.prod .precio','.rail button','.dicho .lista li','.nota-maqueta',
               '.buscador .bajada','.buscador .url','.buscador .tit','.estrellas',
               '.ficha .d','.ficha .d .no','.ficha .cab','.carta-cab p','footer p','.vigencia','.medio',
               '.pregunta','.firma-lqs','.lema','.dominio','.pd-tit','.pd-papel p',
               '.pd-fichas b','.pd-fichas i','.aprobado p small',
               '.pago .resumen .l','.barra-carrito .n','.tel-barra','.nav-falsa','.hueco span'];
  const objetivos = await p.evaluate((sels) => {
    const out = [];
    sels.forEach(s => {
      const els = Array.from(document.querySelectorAll(s)).filter(e => {
        const r = e.getBoundingClientRect();
        return r.width > 4 && r.height > 4 && e.innerText.trim().length > 0;
      }).slice(0,3);
      els.forEach((e,i) => {
        if (e.dataset.ctId) return;      // ya lo mide otro selector
        e.dataset.ctId = s + '#' + i; out.push(s + '#' + i);
      });
    });
    return out;
  }, sel);

  const lum = c => { const s = c/255; return s <= .03928 ? s/12.92 : Math.pow((s+.055)/1.055, 2.4); };
  const L = (r,g,b) => .2126*lum(r) + .7152*lum(g) + .0722*lum(b);

  async function capta(id, conTexto) {
    return await p.evaluate(async ({id, conTexto}) => {
      const e = document.querySelector('[data-ct-id="' + CSS.escape(id) + '"]');
      if (!conTexto) {
        e.dataset.ctGuarda = JSON.stringify({c:e.style.color, bi:e.style.backgroundImage, wtfc:e.style.webkitTextFillColor});
        e.style.setProperty('color','transparent','important');
        e.style.setProperty('-webkit-text-fill-color','transparent','important');
        e.style.setProperty('background-image','none','important');
        e.querySelectorAll('*').forEach(h=>{
          h.style.setProperty('color','transparent','important');
          h.style.setProperty('-webkit-text-fill-color','transparent','important');
        });
      }
      return true;
    }, {id, conTexto});
  }

  const malos = [];
  let medidos = 0;
  const cola = objetivos.slice(), intentos = {}, sinMedir = [];
  while (cola.length) {
    const id = cola.shift();
    // La barra pegajosa lleva backdrop-filter: lo que pasa por debajo cambia
    // su desenfoque, así que la franja de arriba no se mide nunca.
    const BANDA = 86;
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
    await capta(id, false);
    await p.waitForTimeout(140);
    const b = await p.screenshot({ clip: caja });   // sin texto
    await p.evaluate(i => {
      const e = document.querySelector('[data-ct-id="' + CSS.escape(i) + '"]');
      const g = JSON.parse(e.dataset.ctGuarda || '{}');
      e.style.removeProperty('color'); e.style.removeProperty('-webkit-text-fill-color');
      e.style.removeProperty('background-image');
      if (g.c) e.style.color = g.c; if (g.bi) e.style.backgroundImage = g.bi;
      e.querySelectorAll('*').forEach(h=>{ h.style.removeProperty('color'); h.style.removeProperty('-webkit-text-fill-color'); });
    }, id);
    // comparar cada píxel con su propio fondo
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
      async function img(d){ const i=new Image(); i.src='data:image/png;base64,'+d; await i.decode(); const c=document.createElement('canvas'); c.width=i.width;c.height=i.height; const x=c.getContext('2d'); x.drawImage(i,0,0); return x.getImageData(0,0,c.width,c.height).data; }
      const A = await img(a), B = await img(b);
      function lm(c){const s=c/255;return s<=.03928?s/12.92:Math.pow((s+.055)/1.055,2.4);}
      function Lu(r,g,bb){return .2126*lm(r)+.7152*lm(g)+.0722*lm(bb);}
      // Un glifo antialiasado tiene el color declarado SOLO en los píxeles
      // de cobertura total; los del borde son mezcla y dan razones falsamente
      // bajas. Así que se mide donde el texto cubre del todo: los píxeles
      // cuya diferencia con el fondo llega al 97 % de la máxima.
      let mx = 0, difs = [];
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
    if (razon === null) { continue; }
    medidos++;
    if (razon < 4.5) malos.push(id + ' = ' + razon.toFixed(2));
  }
  // Guardia contra la prueba rota: si el apagado del texto deja de
  // funcionar, el diff sale vacío, todo devuelve null y la prueba canta
  // «bien» sin haber medido nada. Pasó, y nadie se enteró.
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
