# 002 — Rehacer `prefers-reduced-motion`: menos movimiento, no cero

- **Status**: TODO
- **Commit**: 2bf2c37
- **Severity**: HIGH
- **Category**: 6 — Accesibilidad
- **Estimated scope**: 1 archivo (`index.html`), 1 bloque `@media`

## Problem

El sitio implementa movimiento reducido con el reset a martillazos: apagar
absolutamente todo con `!important`.

```css
/* index.html:298 — actual */
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}.rv{opacity:1;transform:none}#hero h1 .ln i{transform:none}}
```

Movimiento reducido significa **menos movimiento y más suave, no cero**. Hay que
conservar las transiciones que ayudan a entender qué pasó (opacidad, color) y
quitar solo los desplazamientos. Este reset hace lo contrario: mata también el
feedback que no molesta a nadie.

Además crea dos defectos concretos, peores que el problema que intenta resolver:

```css
/* index.html:296 */ .load{...animation:sp .7s linear infinite}
/* index.html:102 */ .tick .tr{...animation:mv 32s linear infinite}
```

Con `animation-duration:.01ms!important`, ambas animaciones **infinitas** pasan a
completar un ciclo cada centésima de milisegundo. El spinner de carga deja de
girar y se convierte en un parpadeo; la marquesina de palabras hace lo mismo.
Para alguien con sensibilidad vestibular —justo quien activa este ajuste— un
elemento que estroba es más agresivo que uno que gira despacio.

## Target

Sustituir el bloque entero por uno que apaga desplazamiento y bucles, y conserva
opacidad y color:

```css
/* target — reemplaza index.html:298 */
@media(prefers-reduced-motion:reduce){
 /* se conserva opacidad y color; se quita todo desplazamiento */
 .rv{opacity:1;transform:none;transition:opacity 200ms var(--ease-out)}
 #hero h1 .ln i{transform:none;animation:none}
 .view.on{animation:none}
 #precios.on{animation:none}
 .pt:hover,.card:hover,.area:hover,.btn.p:hover{transform:none}
 .pt:hover .art{transform:none}
 #promo{transition:opacity 200ms var(--ease-out)}
 #promo.on{transform:none}
 .modal{transition:opacity 200ms var(--ease-out)}
 .modal.on{transform:translate(-50%,-50%) scale(1)}
 /* los bucles infinitos se detienen, no se aceleran */
 .tick .tr{animation:none}
 .load{animation-duration:1.6s}
}
```

Tres decisiones que el ejecutor no debe cambiar:

1. **`.load` baja a 1.6s, no se apaga.** Un spinner detenido no comunica que algo
   está cargando. Girar despacio sí, y a 1.6s ya no es un estímulo agresivo.
2. **`.tick .tr` se apaga del todo.** Es decorativa y es la única animación
   infinita a pantalla completa del sitio; no comunica nada.
3. **`#promo` y `.modal` conservan el fundido.** Aparecen encima del contenido;
   sin ninguna transición aparecen de golpe, que es justamente el "cambio brusco"
   que el movimiento existe para evitar. Se quita el desplazamiento, se deja el
   fundido de 200ms.

Fíjate que `#promo{transform:translateY(140%)}` (index.html:222) es el estado
*oculto*. En movimiento reducido, `#promo.on{transform:none}` lo deja aparecer
en su sitio con fundido en vez de subir. Como `#promo` sin `.on` sigue
desplazado 140%, hay que anular también el `transform` base: añade
`#promo{transform:none;opacity:0;pointer-events:none}` y
`#promo.on{opacity:1;pointer-events:auto}` dentro del bloque de movimiento
reducido. Igual para `.modal`, que ya tiene `opacity:0;visibility:hidden`
(index.html:239) — ahí basta con neutralizar la escala.

## Repo conventions to follow

- El bloque `@media(prefers-reduced-motion:reduce)` es la última línea del
  `<style>`, justo antes de `</style>` (index.html:298-299). Déjalo ahí.
- El resto del archivo usa CSS denso en una línea; este bloque puede ir
  multilínea porque es el único que agrupa reglas por motivo, no por componente.
- Los tokens `var(--ease-out)` los introduce el **plan 001**. Si no existen
  todavía, ejecuta 001 primero o usa `cubic-bezier(0.23, 1, 0.32, 1)` literal.
- El JS ya lee la preferencia en `index.html:633`:
  ```js
  const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  ```
  y la respeta en los scrolls (`index.html:825`, `index.html:907`). No dupliques
  esa lógica ni la toques: este plan es solo CSS.

## Steps

1. En `index.html`, sustituye la línea 298 completa por el bloque del target.
2. Dentro de ese bloque añade las dos reglas extra descritas al final del target:
   `#promo{transform:none;opacity:0;pointer-events:none}` y
   `#promo.on{opacity:1;pointer-events:auto}`.
3. Confirma que ya no queda ningún `!important` en el archivo:
   `grep -c '!important' index.html` → `0`.

## Boundaries

- NO toques el JS. La constante `RM` y sus usos se quedan como están.
- NO toques `mundos/*.html` ni las demás páginas.
- NO cambies ninguna animación fuera del bloque `@media`.
- NO añadas dependencias.
- Si la línea 298 no coincide con lo citado, DETENTE y reporta.

## Verification

- **Mecánica**: `grep -c '!important' index.html` → `0`.
  `grep -c 'prefers-reduced-motion' index.html` → `1`.
- **Feel check**: en Chrome DevTools → panel Rendering → *Emulate CSS media
  feature prefers-reduced-motion: reduce*. Con eso activo:
  - El hero aparece sin subir desde abajo, pero aparece.
  - Al navegar entre secciones no hay deslizamiento vertical, y el contenido
    tampoco parpadea.
  - La marquesina de palabras está **quieta**, no vibrando.
  - Recarga en la sección Servicios y mira el spinner de los paquetes: gira
    despacio y de forma continua. **Si estroba, el plan está mal aplicado.**
  - Espera 9 segundos: el banner de promociones aparece con fundido, sin subir.
  - Abre el modal de ingresar: aparece con fundido, sin escalar.
  - Pasa el mouse por un portal: cambia el borde y el brillo, no se levanta.
- **Done when**: con movimiento reducido activo, nada se desplaza y nada estroba,
  pero todos los cambios de estado siguen siendo visibles.
