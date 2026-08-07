# 006 — Feedback al pulsar, y hovers que no se peguen en móvil

- **Status**: HECHO
- **Commit**: 2bf2c37
- **Severity**: MEDIUM
- **Category**: 6 — Accesibilidad · 3 — Fisicidad

## Problem

### 6a. El sitio no tiene ni una sola regla `:active`

`grep -c ":active" index.html` devuelve **0**. Todo lo pulsable —`.btn`, `.pt`,
`.card`, `.area .lk`, `.tira a`, `.chip`, `#btnPrecios`— no da ninguna respuesta
al ser pulsado.

En escritorio eso es una carencia. En móvil es el problema entero: **no hay
hover**, así que `:active` es el único canal de respuesta que existe. Un
visitante que toca *Ver ficha* en el celular no recibe ninguna señal de que el
toque se registró hasta que la pantalla cambia. Este sitio se comparte por
WhatsApp en Colombia: la mayoría de las visitas van a ser táctiles.

### 6b. Los hovers con movimiento no están detrás de `@media (hover:hover)`

```css
/* index.html:76 */  .btn.p:hover{transform:translateY(-2px);box-shadow:0 16px 38px -14px rgba(242,239,232,.42)}
/* index.html:114 */ .pt:hover{transform:translateY(-7px);border-color:transparent;background:#0d1020}
/* index.html:117 */ .pt:hover .art{opacity:1;transform:scale(1.045)}
/* index.html:136 */ .area:hover{border-color:var(--line2);transform:translateY(-3px)}
/* index.html:173 */ .card:hover{border-color:var(--line2);transform:translateY(-3px)}
```

En pantallas táctiles, tocar un elemento dispara un `:hover` falso que **se queda
pegado** hasta que se toca otra cosa. Resultado: después de tocar un portal y
volver atrás, el portal sigue levantado 7px, con el borde de color encendido,
como si estuviera seleccionado. Parece un error de la página.

## Target

### Encerrar el movimiento de hover tras la media query

```css
/* target */
@media (hover: hover) and (pointer: fine){
 .btn.p:hover{transform:translateY(-2px);box-shadow:0 16px 38px -14px rgba(242,239,232,.42)}
 .pt:hover{transform:translateY(-7px);border-color:transparent;background:#0d1020}
 .pt:hover::after{box-shadow:inset 0 0 0 1px var(--pc),0 0 56px -14px var(--pc)}
 .pt:hover .art{opacity:1;transform:scale(1.045)}
 .pt:hover .go svg{transform:translateX(6px)}
 .area:hover{border-color:var(--line2);transform:translateY(-3px)}
 .card:hover{border-color:var(--line2);transform:translateY(-3px)}
}
```

Los hovers que **solo** cambian color se quedan fuera de la media query: no se
pegan de forma molesta y en escritorio siguen funcionando. Es decir, NO muevas
`.nlinks a:hover`, `.nbtn:hover`, `.fc a:hover`, `.area .lk:hover`, `.tira a:hover`,
`#promo .x:hover` ni `.ficha>summary:hover`.

### Añadir respuesta al pulsar

```css
/* target — añadir junto a las reglas de cada componente */
.btn:active{transform:scale(.97)}
.pt:active{transform:scale(.99)}
.card:active,.area:active{transform:scale(.99)}
.area .lk:active,.tira a:active,.chip:active{transform:scale(.96)}
```

Y la transición que las hace sentir físicas — el plan 003 ya deja `transform` en
la lista de transiciones de estos elementos, así que basta con que `--dur-fast`
(160ms) los cubra. Si ejecutas este plan sin el 003, añade a cada uno:
`transition:transform 160ms var(--ease-out)`.

Escalas distintas a propósito: 0.97 en botones (elementos pequeños, el gesto se
tiene que notar), 0.99 en tarjetas grandes (el mismo porcentaje sobre 400px de
ancho sería un desplome). El rango sano es 0.95–0.98 para controles.

## Repo conventions to follow

- Los tokens `--ease-out` y `--dur-fast` los crea el **plan 001**.
- El archivo ya usa media queries agrupadas al final de cada bloque temático,
  por ejemplo `index.html:111` (`@media(max-width:960px)`) justo debajo de las
  reglas de `.pt`. Pon el bloque `@media (hover: hover)` con el mismo criterio:
  cerca de las reglas que agrupa, no todo al final del archivo.
- Las reglas `:active` van pegadas a la regla base de cada componente.

## Steps

1. Ejecuta antes los planes 001 y 003.
2. En `index.html`, mueve las cinco reglas `:hover` con `transform` (líneas 76,
   114, 115, 117, 125-126, 136, 173) dentro de un bloque
   `@media (hover: hover) and (pointer: fine){...}`. Incluye también
   `.pt:hover::after` y `.pt:hover .go svg` porque son parte del mismo gesto.
3. Añade las cuatro reglas `:active` del target.
4. Comprueba: `grep -c ":active" index.html` → al menos `4`.
   `grep -c "hover: hover" index.html` → `1`.
5. Revisa que el bloque `@media(prefers-reduced-motion:reduce)` (plan 002) siga
   anulando estos `transform` — si el plan 002 ya está aplicado, sus reglas
   `.pt:hover,.card:hover,.area:hover,.btn.p:hover{transform:none}` deben ir
   **después** en el archivo para ganar en especificidad.

## Boundaries

- NO cambies los hovers que solo alteran color o borde.
- NO cambies valores de color, sombra ni tamaño; solo se mueven de sitio.
- NO añadas `:active` a elementos no interactivos (`.fase`, `.bi`, `.proj`).
- NO toques `mundos/*.html`.
- NO añadas dependencias.
- Si alguna línea no coincide con lo citado, DETENTE y reporta.

## Verification

- **Mecánica**: `grep -c ":active" index.html` ≥ `4`;
  `grep -c "hover: hover" index.html` = `1`.
- **Feel check en escritorio**: nada debe haber cambiado en el hover. Pasa el
  mouse por los portales, las tarjetas y los botones: idéntico a antes.
  - Mantén pulsado un botón sin soltar: debe hundirse levemente y volver al
    soltar. Si no se mueve, la regla `:active` no está llegando.
- **Feel check en móvil** (lo importante): DevTools → *Toggle device toolbar* →
  iPhone, o mejor un teléfono real contra `http://<tu-ip>:8099`.
  - Toca un portal del inicio y vuelve atrás: el portal **no** debe quedarse
    levantado ni con el borde encendido. Este es el punto entero del plan.
  - Toca *Ver ficha* en un área: debe hundirse mientras el dedo está encima.
  - Recorre la página tocando tarjetas: ninguna debe quedar en estado "elegida".
- **Done when**: en táctil ningún elemento queda pegado en hover, y todo lo
  pulsable responde al dedo antes de que cambie la pantalla.
