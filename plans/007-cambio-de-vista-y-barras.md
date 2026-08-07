# 007 — Aligerar el cambio de vista y sacar las barras de progreso del layout

- **Status**: TODO
- **Commit**: 2bf2c37
- **Severity**: MEDIUM
- **Category**: 1 — Propósito y frecuencia · 4 — Interrumpibilidad · 5 — Rendimiento

## Problem

### 7a. Cada clic de navegación cuesta medio segundo y compite con el scroll

```css
/* index.html:85-87 — actual */
.view{display:none}
.view.on{display:block;animation:vin .5s cubic-bezier(.2,.75,.3,1)}
@keyframes vin{from{opacity:0;transform:translateY(16px)}}
```

```js
/* index.html:820-827 — actual */
VIEWS.forEach(x=>document.getElementById('v-'+x).classList.toggle('on',x===v));
...
window.scrollTo({top:0,behavior:RM?'auto':'smooth'});
```

Tres cosas mal:

1. **Frecuencia.** Navegar entre secciones es de lo que más se hace en el sitio
   (siete vistas, barra de navegación siempre visible). Lo que se dispara decenas
   de veces por sesión debe reducirse al mínimo o desaparecer. 500ms es el
   presupuesto de un modal, no el de un cambio de pestaña.
2. **Dos movimientos verticales a la vez.** El contenido sube 16px por el
   keyframe mientras la página hace scroll suave al tope. Son dos animaciones
   verticales simultáneas, con curvas distintas, peleándose.
3. **Keyframes en algo reversible.** Clic en Servicios, arrepentirse, clic en
   Inicio: el keyframe reinicia desde cero en vez de continuar.

### 7b. Las barras de progreso animan `width`

```css
/* index.html:209 — actual */
.bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--gold),#3fd0e6);transition:width .9s cubic-bezier(.2,.8,.3,1)}
```

`width` dispara layout + paint + composite en cada cuadro. Solo se deben animar
`transform` y `opacity`. Son las barras de avance del portal del cliente
(`index.html`, vista Mi cuenta): poca frecuencia, pero es el momento en que un
cliente que paga mira su proyecto — conviene que vaya fino.

## Target

### 7a — Cambio de vista: solo fundido, corto, con transición

```css
/* target — reemplaza index.html:85-87 */
.view{display:none}
.view.on{display:block;animation:vin var(--dur-ui) var(--ease-out)}
@keyframes vin{from{opacity:0}}
```

Se quita el `translateY(16px)`: el desplazamiento vertical lo aporta ya el
scroll al tope, y duplicarlo es lo que hace que el cambio se sienta pesado. Se
baja de 500ms a 200ms. El keyframe se conserva aquí —y solo aquí— porque el
cambio de vista no es reversible a media animación: al pulsar otra sección el
elemento anterior pasa a `display:none` y el nuevo empieza limpio, así que el
reinicio desde cero es el comportamiento correcto, no un defecto.

### 7b — Barras: `transform: scaleX()`

```css
/* target — reemplaza index.html:209 */
.bar i{display:block;height:100%;width:100%;transform-origin:left center;transform:scaleX(0);
 border-radius:99px;background:linear-gradient(90deg,var(--gold),#3fd0e6);
 transition:transform var(--dur-panel) var(--ease-out)}
```

Y donde el JS fija el ancho hay que cambiar la propiedad. Busca en `cargarPortal`
el punto donde se escribe el estilo de `.bar i` (un `style="width:NN%"` o
`.style.width=`) y cámbialo por:

```js
/* target */
el.style.transform='scaleX('+(pct/100)+')';
```

`transform-origin:left center` es obligatorio: sin él la barra crece desde el
centro hacia los dos lados.

Nota: `scaleX` deforma el `border-radius` de las puntas. Con una barra de 7px de
alto y radio 99px el efecto es imperceptible; no intentes compensarlo.

## Repo conventions to follow

- Los tokens los crea el **plan 001**.
- El JS del portal usa plantillas de cadena para pintar (`cargarPortal`). Mantén
  ese estilo: cambia la propiedad dentro de la plantilla, no añadas un bucle
  aparte que toque el DOM después.
- Exemplar de transición correcta sobre `transform` en este archivo,
  `index.html:222`:
  ```css
  #promo{...transform:translateY(140%);transition:transform .6s cubic-bezier(.2,.9,.3,1)}
  ```

## Steps

1. Ejecuta el plan 001 si no está aplicado.
2. Reemplaza `index.html:86-87` por las dos líneas del target 7a.
3. Reemplaza `index.html:209` por la regla del target 7b.
4. En `cargarPortal`, localiza dónde se fija el ancho de `.bar i` y cámbialo a
   `transform:scaleX(...)` con el valor entre 0 y 1 (no en porcentaje).
5. Comprueba que no queda `transition:width` en el archivo:
   `grep -c "transition:width" index.html` → `0`.

## Boundaries

- NO toques la función `go()` más allá de lo que dicen los pasos — el router,
  el `pushState` y el `scrollTo` se quedan como están.
- NO quites el `window.scrollTo` de `go()`: es lo que ahora aporta el movimiento
  vertical.
- NO cambies `armar()` ni el IntersectionObserver de los reveals.
- NO toques `mundos/*.html`.
- NO añadas dependencias.
- Si no encuentras dónde el JS fija el ancho de la barra, DETENTE y reporta en
  vez de adivinar.

## Verification

- **Mecánica**: `grep -c "transition:width" index.html` → `0`.
  `grep -n "translateY(16px)" index.html` → sin resultados.
- **Feel check**: sirve el sitio.
  - Navega entre Inicio, Servicios, Muestras y Cotizar varias veces seguidas:
    el cambio debe sentirse inmediato. La página sube al tope; el contenido ya
    no hace su propio movimiento vertical encima.
  - Pulsa dos secciones muy rápido: no debe haber parpadeo ni doble movimiento.
  - Entra a Mi cuenta con una sesión que tenga proyectos: las barras deben crecer
    desde la izquierda, nunca desde el centro. **Si crecen desde el centro, falta
    `transform-origin:left center`.**
  - En DevTools → Performance, graba mientras cargan las barras: no debe aparecer
    *Layout* en cada cuadro, solo *Composite*.
- **Done when**: cambiar de sección se siente instantáneo y las barras crecen
  desde la izquierda sin provocar layout.
