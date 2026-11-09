#!/usr/bin/env node
/* Saca las hojas de demos/catalogos.html a JPG y PDF, en las dos versiones.
 *
 *     node clientes/muestra-catalogos/exportar.mjs [carpeta-de-salida]
 *
 * Exporta SÓLO las hojas: ni la entrada, ni los pies de cada muestra, ni el
 * cierre. Lo que se le enseña a un cliente es la maquetación, no lo que
 * nosotros contamos sobre ella.
 *
 * Las dos versiones —con fotografía y con los huecos marcados— salen del
 * mismo archivo, encendiendo y apagando una clase en <html>. Dos archivos
 * en paralelo es la forma segura de que uno se quede atrás.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { mkdirSync } from 'node:fs';

const AQUI = new URL('.', import.meta.url).pathname;
const ARCHIVO = 'file://' + AQUI + '../../demos/catalogos.html';
const SALIDA = process.argv[2] || (AQUI + 'entrega');
mkdirSync(SALIDA, { recursive: true });

const NOMBRES = ['1-carta-oscura', '2-parrilla-densa',
                 '3-catalogo-claro', '4-bloques-de-color'];
// 3× sobre una hoja de 1180 px da 3540 px de ancho: a 300 ppp son 30 cm,
// que es el ancho real de una página doble impresa.
const ESCALA = 3;

const navegador = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await navegador.newContext({ viewport:{width:1500,height:1000},
                                         deviceScaleFactor: ESCALA });
const p = await ctx.newPage();
await p.goto(ARCHIVO, { waitUntil:'load' });
// La chapa es pegajosa: en la captura de un elemento sale lo que hay en
// pantalla, así que se monta encima de la hoja y se lleva media fila.
await p.addStyleTag({ content: '.chapa,.pista{display:none !important}' });
await p.waitForTimeout(700);

for (const version of ['con-fotos', 'sin-fotos']) {
  await p.evaluate(v => {
    document.documentElement.classList.toggle('sin-fotos', v === 'sin-fotos');
  }, version);
  await p.waitForTimeout(500);
  for (let i = 0; i < 4; i++) {
    const hoja = p.locator('.hoja').nth(i);
    const archivo = SALIDA + '/catalogo-' + NOMBRES[i] + '-' + version + '.jpg';
    await hoja.screenshot({ path: archivo, type:'jpeg', quality: 92,
                            animations:'disabled' });
    const c = await hoja.boundingBox();
    console.log('  %s  %d × %d px', archivo.split('/').pop(),
                Math.round(c.width*ESCALA), Math.round(c.height*ESCALA));
  }
}
await navegador.close();
console.log('\nJPG listos en ' + SALIDA);
