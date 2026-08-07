# 003 — Quitar `transition: all` y bajar las duraciones de hover al presupuesto

- **Status**: HECHO
- **Commit**: 2bf2c37
- **Severity**: HIGH
- **Category**: 5 — Rendimiento · 2 — Curvas y duración
- **Estimated scope**: 1 archivo (`index.html`), ~24 declaraciones

## Problem

### 3a. Todas las transiciones del sitio son `transition: all`

En CSS, `transition: .45s` sin lista de propiedades equivale a
`transition: all .45s`. El archivo lo hace **24 veces**:

```css
/* index.html:32 */   nav{...transition:.4s}
/* index.html:38 */   .nlinks a{transition:.2s;position:relative;cursor:pointer}
/* index.html:42 */   .nbtn{...transition:.25s;white-space:nowrap}
/* index.html:46 */   .burger span{...transition:.3s}
/* index.html:47 */   .burger span::before,.burger span::after{...transition:.3s}
/* index.html:54 */   ...opacity:0;visibility:hidden;transition:.4s;z-index:-1}
/* index.html:74 */   ...padding:15px 25px;border-radius:999px;transition:.3s;border:1px solid transparent;cursor:pointer}
/* index.html:109 */  .pt{...transition:.45s cubic-bezier(.2,.75,.3,1);cursor:pointer}
/* index.html:113 */  .pt::after{...transition:.45s}
/* index.html:116 */  .pt .art{...transition:.55s}
/* index.html:125 */  .pt .go svg{...transition:.3s}
/* index.html:130 */  .tira a{...transition:.25s;cursor:pointer}
/* index.html:135 */  .area{...transition:.3s}
/* index.html:143 */  .area .lk{...transition:.25s;white-space:nowrap}
/* index.html:172 */  .card{...transition:.3s}
/* index.html:186 */  .inp{...transition:.2s}
/* index.html:198 */  .proj{...transition:.3s}
/* index.html:224 */  #promo .x{...transition:.2s}
/* index.html:234 */  .scrim{...transition:.35s}
/* index.html:238 */  .modal{...transition:.4s cubic-bezier(.2,.85,.3,1);max-height:90vh;overflow:auto}
/* index.html:244 */  .tabs button{...transition:.25s}
/* index.html:251 */  .fc a{...transition:.2s;cursor:pointer}
/* index.html:279 */  .ficha>summary{...transition:.2s}
/* index.html:282 */  .ficha>summary::after{content:'+';...transition:.3s}
```

`all` anima propiedades que nunca quisimos animar y las saca de la GPU. El caso
más caro es `.pt` (los seis portales del inicio): cada uno contiene un SVG a
pantalla completa, y el hover anima a la vez `transform`, `background` y
`border-color`, mientras `.pt::after` anima un `box-shadow` con 56px de
desenfoque. Seis tarjetas grandes repintando en cada pasada del mouse.

### 3b. Los hovers duran el doble de lo que deberían

```css
/* index.html:109 */ .pt{...transition:.45s ...}     → 450ms
/* index.html:113 */ .pt::after{...transition:.45s}  → 450ms
/* index.html:116 */ .pt .art{...transition:.55s}    → 550ms
```

El presupuesto para un hover es 150–250ms. Un hover es de las cosas que más veces
se dispara en una sesión, y a 550ms el portal sigue moviéndose mucho después de
que el mouse llegó — se siente pegajoso y lento, no elegante.

### 3c. Las burbujas del chat entran con `ease`

```js
/* index.html:1169 */
d.style.cssText='max-width:82%;padding:10px 13px;border-radius:15px;font-size:.85rem;line-height:1.45;animation:vin .45s'+
```

`animation: vin .45s` sin función de tiempo usa el `ease` por defecto de CSS. Lo
que entra debe usar ease-out fuerte: empieza rápido, que es cuando el usuario
está mirando.

## Target

Cada `transition` declara sus propiedades y respeta el presupuesto:

```css
/* target — las declaraciones que cambian de duración */
.pt{...transition:transform var(--dur-ui) var(--ease-out),background var(--dur-ui) var(--ease-out),border-color var(--dur-ui) var(--ease-out);cursor:pointer}
.pt::after{...transition:box-shadow var(--dur-ui) var(--ease-out)}
.pt .art{...transition:opacity var(--dur-ui) var(--ease-out),transform var(--dur-ui) var(--ease-out)}
```

Tabla completa. `--dur-ui` = 200ms, `--dur-fast` = 160ms, `--dur-panel` = 300ms
(los define el plan 001):

| Línea | Selector | Transición nueva |
| --- | --- | --- |
| 32 | `nav` | `transition:background var(--dur-panel) var(--ease-out),border-color var(--dur-panel) var(--ease-out)` |
| 38 | `.nlinks a` | `transition:color var(--dur-fast) ease` |
| 40 | `.nlinks a::after` | ya declara `right .3s` — cambia a `right var(--dur-ui) var(--ease-out)` |
| 42 | `.nbtn` | `transition:background var(--dur-fast) ease,color var(--dur-fast) ease,border-color var(--dur-fast) ease` |
| 46 | `.burger span` | `transition:transform var(--dur-ui) var(--ease-out),opacity var(--dur-ui) var(--ease-out)` |
| 47 | `.burger span::before,::after` | igual que 46 |
| 54 | (menú móvil) | `transition:opacity var(--dur-panel) var(--ease-out),visibility var(--dur-panel)` |
| 74 | `.btn` | `transition:background var(--dur-fast) ease,color var(--dur-fast) ease,border-color var(--dur-fast) ease,transform var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out)` |
| 109 | `.pt` | ver bloque de arriba |
| 113 | `.pt::after` | ver bloque de arriba |
| 116 | `.pt .art` | ver bloque de arriba |
| 125 | `.pt .go svg` | `transition:transform var(--dur-ui) var(--ease-out)` |
| 130 | `.tira a` | `transition:color var(--dur-fast) ease,border-color var(--dur-fast) ease` |
| 135 | `.area` | `transition:transform var(--dur-ui) var(--ease-out),border-color var(--dur-ui) ease` |
| 143 | `.area .lk` | `transition:color var(--dur-fast) ease,border-color var(--dur-fast) ease,background var(--dur-fast) ease` |
| 172 | `.card` | `transition:transform var(--dur-ui) var(--ease-out),border-color var(--dur-ui) ease` |
| 186 | `.inp` | `transition:border-color var(--dur-fast) ease,background var(--dur-fast) ease` |
| 198 | `.proj` | `transition:border-color var(--dur-ui) ease` |
| 224 | `#promo .x` | `transition:color var(--dur-fast) ease,border-color var(--dur-fast) ease` |
| 234 | `.scrim` | `transition:opacity var(--dur-panel) var(--ease-out),visibility var(--dur-panel)` |
| 238 | `.modal` | `transition:opacity var(--dur-panel) var(--ease-out),transform var(--dur-panel) var(--ease-out),visibility var(--dur-panel)` |
| 244 | `.tabs button` | `transition:background var(--dur-fast) ease,color var(--dur-fast) ease` |
| 251 | `.fc a` | `transition:color var(--dur-fast) ease` |
| 279 | `.ficha>summary` | `transition:color var(--dur-fast) ease` |
| 282 | `.ficha>summary::after` | `transition:transform var(--dur-ui) var(--ease-out)` |

Por qué `ease` en los cambios de color y `var(--ease-out)` en el movimiento: el
catálogo de curvas asigna `ease` a hover y cambios de color, y ease-out fuerte a
todo lo que entra, sale o se desplaza.

Y para las burbujas del chat, `index.html:1169`:

```js
/* target */
...;line-height:1.45;animation:vin .28s var(--ease-out)'+
```

280ms porque es un mensaje que aparece, no un panel; y con ease-out fuerte.

## Repo conventions to follow

- CSS denso, varias declaraciones por línea, tal como está. No reformatees.
- Los tokens `--ease-out`, `--dur-fast`, `--dur-ui`, `--dur-panel` los crea el
  **plan 001**. Este plan depende de él: ejecuta 001 primero.
- Ejemplo de una transición ya bien escrita en este mismo archivo,
  `index.html:222` — declara la propiedad, no usa `all`:
  ```css
  #promo{...transform:translateY(140%);transition:transform .6s cubic-bezier(.2,.9,.3,1)}
  ```
- Otro exemplar correcto, `index.html:294`: `.rv` declara `opacity` y `transform`
  por separado. Imita ese estilo.

## Steps

1. Ejecuta primero el plan 001 si aún no está aplicado (`grep -c "var(--ease-out)" index.html` debe ser > 0).
2. En `index.html`, reemplaza las 24 declaraciones `transition` según la tabla.
   Cambia **solo** la declaración `transition`; todo lo demás de cada regla se
   queda igual, incluida la posición dentro de la línea.
3. En `index.html:1169`, cambia `animation:vin .45s` por
   `animation:vin .28s var(--ease-out)`.
4. Comprueba que no queda ninguna transición sin propiedad:
   `grep -nE "transition:\s*\.?[0-9]" index.html` no debe devolver nada.

## Boundaries

- NO toques `mundos/*.html` ni las demás páginas HTML.
- NO cambies keyframes (`@keyframes vin`, `up`, `mv`, `sp`, `baja`).
- NO cambies el bloque `@media(prefers-reduced-motion:reduce)` — eso es el plan 002.
- NO cambies estructura, colores, tamaños ni nada que no sea `transition`.
- NO añadas dependencias.
- Si alguna línea no coincide con lo citado, DETENTE y reporta.

## Verification

- **Mecánica**: `grep -nE "transition:\s*\.?[0-9]" index.html` → sin resultados.
  `grep -c "transition:" index.html` debe seguir dando el mismo número que antes
  del cambio (no se elimina ninguna transición, solo se reescriben).
- **Feel check**: sirve el sitio y ábrelo en `#inicio`.
  - Pasa el mouse por un portal y sácalo rápido: la tarjeta debe alcanzarte, no
    quedarse moviéndose atrás. Antes tardaba medio segundo; ahora debe sentirse
    inmediata pero no brusca.
  - En DevTools → panel Animations, pon la velocidad al 10% y pasa el mouse por
    un portal: comprueba que se mueven `transform`, `background`, `border-color`
    y `box-shadow` — y nada más. Si ves `padding` o `border-radius` animándose,
    quedó un `all` suelto.
  - Abre el chatbot en Automatización y manda un mensaje: la burbuja aparece
    rápido y frena al final; ya no arranca lenta.
  - En la pestaña Performance, graba 3 segundos moviendo el mouse por la rejilla
    de portales: no debe haber cuadros largos de *Recalculate Style*.
- **Done when**: ninguna transición usa `all`, ningún hover pasa de 200ms, y
  mover el mouse por el inicio se siente más rápido sin verse más brusco.
