# 004 — Que la lista de precios también se cierre, y sea interrumpible

- **Status**: HECHO
- **Commit**: 2bf2c37
- **Severity**: MEDIUM
- **Category**: 4 — Interrumpibilidad · 8 — Oportunidades perdidas
- **Estimated scope**: 1 archivo (`index.html`), 1 regla CSS + 1 función JS

## Problem

La lista de precios de Servicios abre con una animación y cierra teletransportándose.

```css
/* index.html:159-161 — actual */
#precios{display:none;margin-top:34px}
#precios.on{display:block;animation:baja .45s cubic-bezier(.2,.75,.3,1) both}
@keyframes baja{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
```

```js
/* index.html:900-909 — actual */
function verPrecios(abrir,sinScroll){
 const box=document.getElementById('precios'),b=document.getElementById('btnPrecios');
 box.classList.toggle('on',abrir);b.classList.toggle('abierto',abrir);
 ...
}
```

Dos problemas:

1. **Al cerrar no hay nada.** `display:block` → `display:none` es instantáneo. El
   usuario abre con una transición cuidada de 450ms y cierra con un corte seco.
   Ese contraste se lee como un error, no como una decisión.
2. **Los keyframes no son interrumpibles.** `@keyframes` siempre reinicia desde
   cero; las transiciones CSS retoman desde el estado actual. Este botón es un
   toggle: si alguien lo pulsa dos veces rápido, la segunda apertura arranca de
   nuevo desde abajo en vez de continuar desde donde iba. Todo lo que sea
   reversible a media animación debe usar transiciones, no keyframes.

Este es además el momento de pago de la sección: es la interacción donde el
visitante decide mirar los precios. Es la que menos debería sentirse rota.

## Target

Cambiar keyframes por transición sobre `grid-template-rows`, que sí anima y sí
es interrumpible, sin altura fija ni JS midiendo nada:

```css
/* target — reemplaza index.html:159-161 */
#precios{display:grid;grid-template-rows:0fr;opacity:0;margin-top:0;
 transition:grid-template-rows var(--dur-panel) var(--ease-out),opacity var(--dur-panel) var(--ease-out),margin-top var(--dur-panel) var(--ease-out)}
#precios>*{overflow:hidden;min-height:0}
#precios.on{grid-template-rows:1fr;opacity:1;margin-top:34px}
```

El keyframe `baja` queda sin uso: **elimínalo** (`index.html:161`).

Ojo con la estructura: `#precios` tiene tres hijos directos (`#uniChips`,
`.cards#paks` y un `<p>`). La técnica `grid-template-rows: 0fr → 1fr` requiere
que haya **un solo** hijo directo con `overflow:hidden`. Envuélvelos:

```html
<!-- target — index.html, dentro de <div id="precios"> -->
<div id="precios">
 <div class="precios-in">
  <div id="uniChips" style="display:flex;flex-wrap:wrap;gap:8px;margin:0 0 30px"></div>
  <div class="cards" id="paks"><div class="empty"><span class="load"></span></div></div>
  <p style="color:var(--faint);font-size:.84rem;margin-top:26px">...</p>
 </div>
</div>
```

y el CSS de los hijos pasa a ser:

```css
#precios .precios-in{overflow:hidden;min-height:0}
```

El JS no necesita cambios: `classList.toggle('on',abrir)` ya hace lo correcto —
ahora dispara una transición en ambas direcciones en vez de un keyframe en una.

Un detalle que sí hay que ajustar en `verPrecios` (`index.html:907`): el scroll
hacia `#todo` se dispara con `setTimeout(...,460)`, un número atado a los 450ms
del keyframe viejo. Cámbialo a `320` para que acompañe a `--dur-panel` (300ms).

## Repo conventions to follow

- Los tokens `--dur-panel` y `--ease-out` los crea el **plan 001**. Ejecútalo primero.
- El sitio ya usa el patrón "clase `.on` conmutada desde JS" en `#promo`
  (index.html:222-223), `.modal` (238-240) y `.scrim` (234-235). Todos ellos usan
  `transition`, no keyframes. Este cambio alinea `#precios` con esa convención;
  imita `.modal` como exemplar.
- CSS denso, en el mismo sitio del archivo. No muevas las reglas de lugar.

## Steps

1. Ejecuta el plan 001 si no está aplicado.
2. En `index.html`, en el HTML de la vista Servicios, envuelve los tres hijos de
   `<div id="precios">` en un `<div class="precios-in">`. No cambies el contenido
   de esos hijos, solo añade el contenedor.
3. Reemplaza las líneas 159-161 por el CSS del target (las cuatro reglas nuevas),
   eliminando `@keyframes baja`.
4. En `verPrecios` (index.html:907), cambia el `460` del `setTimeout` por `320`.
5. Comprueba que `baja` ya no aparece: `grep -c "baja" index.html` → `0`.

## Boundaries

- NO cambies el texto, los precios ni el contenido de las tarjetas.
- NO toques `cargarPaquetes()` ni la carga desde Supabase.
- NO cambies el comportamiento del botón (`btnPrecios.onclick`) ni el enlace
  profundo `#precios` del router (`index.html:797`).
- NO toques `mundos/*.html`.
- NO añadas dependencias.
- Si el HTML de `#precios` no tiene exactamente tres hijos directos, DETENTE y
  reporta.

## Verification

- **Mecánica**: `grep -c "baja" index.html` → `0`.
  `grep -c "precios-in" index.html` → `2` (la regla CSS y el div).
- **Feel check**: sirve el sitio, entra a Servicios y baja hasta el bloque
  "¿Ya sabes qué necesitas?".
  - Pulsa *Ver todos los servicios*: la lista se despliega empujando el pie de
    página hacia abajo, sin saltos.
  - Pulsa *Ocultar precios*: la lista **se pliega**, no desaparece de golpe.
    Este es el punto entero del plan.
  - Pulsa el botón cinco veces seguidas rápido: la lista debe cambiar de
    dirección desde donde iba, sin reiniciarse ni parpadear.
  - En DevTools → Animations al 10%, abre y cierra: la flecha del botón gira al
    mismo ritmo que se despliega la lista.
  - Entra directo a `index.html#precios`: debe abrir con la lista ya desplegada y
    hacer scroll hasta ella, sin doble movimiento.
- **Done when**: abrir y cerrar son simétricos, y machacar el botón nunca
  reinicia la animación desde cero.
