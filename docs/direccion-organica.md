# Dirección orgánica — el sistema de formas de LQS

Documento ejecutable. No es un moodboard: cada forma trae su código listo para
copiar, cada composición trae su regla numérica y cada capa trae su velocidad.
Se lee con `.claude/skills/protocolo-lqs/SKILL.md` al lado.

Lectura del encargo: **rediseño de interfaz completo (overhaul) para un estudio
creativo colombiano, público de dueños de negocio y encargados de marca, con un
lenguaje orgánico e inmersivo, ejecutado en CSS nativo — máscaras SVG en
`objectBoundingBox`, scroll suave propio y parallax por capas, sin una sola
librería.**

Diales: `DESIGN_VARIANCE 9` · `MOTION_INTENSITY 8` · `VISUAL_DENSITY 3`.

Prototipo que demuestra todo esto: `prototipos/organico.html`.

---

## 0. La decisión técnica de fondo

Hay cuatro maneras de recortar contenido con una forma no rectangular y solo una
sirve para un sitio responsivo:

| Técnica | Curvas reales | Se estira con el elemento | Veredicto |
| --- | --- | --- | --- |
| `clip-path: polygon()` | ✗ solo rectas | ✓ (acepta %) | acentos angulares, nada más |
| `clip-path: path()` | ✓ | ✗ **coordenadas en px fijos** | inservible: la forma no acompaña al contenedor |
| `clip-path: shape()` | ✓ | ✓ | correcto, pero llegó a Baseline apenas en febrero de 2026 |
| **`<clipPath clipPathUnits="objectBoundingBox">`** | ✓ | ✓ | **el que usamos** |

`objectBoundingBox` significa que el `<path>` se dibuja en un espacio de 0 a 1 y
el navegador lo estira al tamaño real del elemento. Una sola definición sirve
para una foto de 320px en móvil y de 900px en escritorio. Soporte total desde
hace años, cero JavaScript, cero peso.

El SVG de definiciones va una vez, al principio del documento, escondido:

```html
<svg class="formas" aria-hidden="true" focusable="false"
     width="0" height="0" style="position:absolute">
  <defs>
    <clipPath id="f-gota" clipPathUnits="objectBoundingBox"><path d="…"/></clipPath>
    <!-- … el resto del léxico … -->
  </defs>
</svg>
```

Y se aplica así:

```css
.pieza-gota{ clip-path: url(#f-gota); }
```

**La excepción deliberada:** el *Guijarro* no usa máscara SVG sino
`border-radius` de ocho valores. Esa sintaxis sí se puede animar y transicionar
en CSS puro, y el Guijarro es la única forma del léxico que respira en bucle.

**Regla de respaldo.** El estado por defecto de todo elemento es el **visible**.
La máscara y el movimiento se suman encima. Si `clip-path` no aplica, queda un
rectángulo con esquinas suaves — feo, pero legible. Nunca al revés.

---

## 1. El léxico — siete formas propias

Ninguna se llama "blob". Cada una tiene un oficio y no hace el del vecino.

### 1.1 Gota — el retrato

Redonda arriba, con la tensión bajando hacia la derecha y **un borde inferior
recto**. Ese borde recto es el ancla que la amarra a la retícula; sin él sería un
manchón.

```html
<clipPath id="f-gota" clipPathUnits="objectBoundingBox">
  <path d="M.4 0C.73 0 1 .19 1 .46C1 .73 .93 .9 .78 1L.26 1C.09 .92 0 .74 0 .48C0 .18 .13 0 .4 0Z"/>
</clipPath>
```

- **Oficio:** foto de persona, retrato de equipo, plano de taller vertical.
- **Proporción nativa:** 4:5. Fuera de 3:4–4:5 se deforma y pierde el carácter.
- **Tensión:** alta arriba-izquierda, se resuelve abajo-derecha.

### 1.2 Losa — la pieza apaisada

Borde izquierdo casi vertical (segunda ancla del sistema), borde superior con una
ondulación mínima, esquina inferior derecha desbordada.

```html
<clipPath id="f-losa" clipPathUnits="objectBoundingBox">
  <path d="M0 .16C.16 0 .44 .13 .64 .06C.86 0 1 .12 1 .4C1 .68 .96 .87 .86 .95C.74 1 .48 .92 .26 .97C.08 1 0 .9 0 .66Z"/>
</clipPath>
```

- **Oficio:** video, reel, foto apaisada, captura de un sitio web.
- **Proporción nativa:** 16:9. Aguanta hasta 2:1.
- **Tensión:** el peso cae a la derecha; se compensa poniendo texto a la izquierda.

### 1.3 Hoja — la secundaria que se solapa

Una cúspide **afilada** arriba a la derecha y todo lo demás curvo. Es la única
forma del léxico con un vértice de verdad, y por eso solo puede haber una por
pantalla.

```html
<clipPath id="f-hoja" clipPathUnits="objectBoundingBox">
  <path d="M1 0C1 .4.8 .74.5 .92C.3 1 .08.94.03 .78C0 .58.16.34.44 .16C.66.03.86 0 1 0Z"/>
</clipPath>
```

- **Oficio:** la foto que se monta encima de otra pieza. Detalle, producto, mano.
- **Proporción nativa:** 3:4.
- **Regla dura:** siempre solapada (mínimo 12% de su ancho por encima de otra
  pieza). Suelta se ve como un error de recorte.

### 1.4 Cresta — la masa de fondo

Ondulación arriba, base recta a sangre. No lleva contenido: lleva color, trama
de universo o degradé. Es lo que hace que una sección se sienta como un estrato
y no como un `div`.

```html
<clipPath id="f-cresta" clipPathUnits="objectBoundingBox">
  <path d="M0 .26C.16.08.34.2.52 .14C.7 .08.85 0 1 .05L1 1L0 1Z"/>
</clipPath>
```

- **Oficio:** fondo de sección, corte entre secciones, campo de color.
- **Proporción:** cualquiera. Es a sangre por definición.
- **Regla dura:** nunca dos Crestas seguidas con la onda en el mismo sentido.
  Se voltea con `transform: scaleX(-1)`.

### 1.5 Cuña — el panel de texto

Borde izquierdo recto (ancla), lado derecho que se inclina, esquinas de abajo
comidas. Es el contenedor que reemplaza a la tarjeta.

```html
<clipPath id="f-cuna" clipPathUnits="objectBoundingBox">
  <path d="M0 .06C.3 0 .62.02.82 .07C.96.1 1 .22.99 .4C.98.62.94.83.86 .94C.77 1 .3 1 .12 .98C.02.96 0 .88 0 .76Z"/>
</clipPath>
```

- **Oficio:** panel con texto, lista de lo que incluye, precio.
- **Proporción:** libre, pero el texto necesita `padding` desigual —
  `padding: 9% 14% 11% 8%` — porque los bordes no son paralelos.
- **Regla dura:** el texto nunca toca la curva. Si la última línea se acerca a
  menos de 24px del borde derecho, sobra copy.
- **Cómo se monta:** la máscara **no** va sobre el panel sino sobre una capa de
  fondo. Así el copy no se puede recortar nunca por accidente, y de paso se gana
  un filo de universo de 1,4px que ninguna caja rectangular puede tener:

```css
.cuna{position:relative;padding:9% 14% 11% 8%}
.cuna::before{                      /* el cuerpo */
  content:"";position:absolute;inset:0;z-index:-1;clip-path:url(#f-cuna);
  background:linear-gradient(148deg,rgba(255,255,255,.085),rgba(255,255,255,.018) 58%),var(--bg2);
}
.cuna::after{                       /* el filo, 1,4px del universo activo */
  content:"";position:absolute;inset:-1.4px;z-index:-2;clip-path:url(#f-cuna);
  background:linear-gradient(148deg,color-mix(in srgb,var(--u1) 46%,transparent),transparent 62%);
}
```

### 1.6 Guijarro — el acento que respira

La única forma animable, por eso va en `border-radius` de ocho valores y no en
SVG. Nunca lleva contenido: es peso visual puro.

```css
.guijarro{
  border-radius:
    calc(50% + 24% * var(--curva)) calc(50% - 24% * var(--curva))
    calc(50% + 9%  * var(--curva)) calc(50% - 9%  * var(--curva)) /
    calc(50% + 11% * var(--curva)) calc(50% - 5%  * var(--curva))
    calc(50% + 5%  * var(--curva)) calc(50% - 11% * var(--curva));
  animation: respira 15s var(--ease-in-out) infinite alternate;
}
@keyframes respira{
  to{ border-radius:
    calc(50% - 20% * var(--curva)) calc(50% + 20% * var(--curva))
    calc(50% - 13% * var(--curva)) calc(50% + 13% * var(--curva)) /
    calc(50% - 8%  * var(--curva)) calc(50% + 14% * var(--curva))
    calc(50% - 14% * var(--curva)) calc(50% + 8%  * var(--curva)); }
}
@media (prefers-reduced-motion: reduce){ .guijarro{ animation: none; } }
```

`--curva` es lo único que hay que tocar: a `1` (flujo) queda francamente
lopsidado, a `0.2` (hielo) es casi un círculo. Un número gobierna el
temperamento de toda la sección.

- **Oficio:** acento flotante, punto de color, contrapeso de una composición.
- **Tamaño:** entre 4% y 11% del ancho de la sección. Más grande compite.
- **Cantidad:** máximo tres por pantalla, nunca del mismo tamaño.

### 1.7 Astilla — el filamento

Una media luna delgadísima. Es el elemento más rápido del sistema de
profundidad y el único que puede salirse del encuadre.

```html
<clipPath id="f-astilla" clipPathUnits="objectBoundingBox">
  <path d="M.02 .4C.2 .12.58 0 .92 .04C.99.05 1 .12.95 .15C.62.13.28.26.13 .48C.07.58.11.76.21 .88C.24.93.17.97.12 .92C0 .78 0 .56.02 .4Z"/>
</clipPath>
```

- **Oficio:** filamento decorativo en la capa más cercana, marcador de dirección.
- **Proporción:** 3:2 o más ancha.
- **Regla dura:** siempre cortada por el borde de la pantalla. Una Astilla
  entera se lee como un logo perdido.

> Aparte del léxico hay una forma de servicio, `f-barra`, que solo existe para
> la barra de navegación. No entra en composiciones y no cuenta como pieza.

```html
<clipPath id="f-barra" clipPathUnits="objectBoundingBox">
  <path d="M.03 .05C.05 0 .13 .02 .31 .015C.56 .008 .86 0 .95 .025C.99 .06 1 .3 .998 .55C.996 .8 .987 .95 .958 .988C.79 1 .4 1 .18 .994C.058 .988 .012 .9 .006 .64C0 .38 .013 .12 .03 .05Z"/>
</clipPath>
```

---

## 2. Cómo se combinan

### 2.1 Reparto de oficios

| Rol en la composición | Forma | Nunca |
| --- | --- | --- |
| Foto de persona / retrato | **Gota** | como fondo |
| Video / apaisada | **Losa** | en vertical |
| Foto solapada, detalle | **Hoja** | suelta |
| Campo de color, corte de sección | **Cresta** | con texto encima del borde |
| Texto, precio, lista | **Cuña** | como marco de foto |
| Acento de color | **Guijarro** | con contenido dentro |
| Filamento | **Astilla** | completa dentro del encuadre |

### 2.2 Los tres tríos que funcionan

Una composición orgánica de LQS es **siempre** un trío: dominante, subordinada,
acento. Nunca dos piezas del mismo peso.

- **Trío retrato** — Gota (dominante) + Hoja solapada (subordinada) + Guijarro.
  Para hero y para cierre.
- **Trío panel** — Losa (dominante) + Cuña (subordinada) + Astilla.
  Para fichas de área y precios.
- **Trío editorial** — Cuña ancha de texto (dominante) + Hoja (subordinada) +
  dos Guijarros de tamaños distintos.
  Para manifiesto y notas largas.

### 2.3 Solape

Dos piezas que se tocan sin solaparse producen una costura que se ve como un
error. El solape mínimo entre dominante y subordinada es **12% del ancho de la
subordinada**; el máximo es **34%** — más allá, la subordinada deja de leerse.

---

## 3. La regla de asimetría

Lo que separa "orgánico" de "aleatorio" es que la asimetría esté **medida**. Cinco
reglas, todas comprobables con una regla sobre la pantalla.

### 3.1 Regla del ancla única

Cada pieza orgánica alinea **exactamente un** borde con una línea de la retícula.
Los otros tres flotan libres.

Un borde alineado y tres sueltos se lee como decisión. Cero bordes alineados se
lee como error. Dos o más se lee como una caja disfrazada.

Por eso la Gota tiene base recta, la Losa y la Cuña tienen el costado izquierdo
recto y la Cresta tiene la base a sangre: **el ancla está construida dentro de la
forma**, no se improvisa al maquetar.

### 3.2 Regla 60·27·13

Reparto de área visual dentro de un trío:

| Pieza | Área | Tolerancia |
| --- | --- | --- |
| Dominante | 60% | ±6 |
| Subordinada | 27% | ±5 |
| Acento | 13% | ±4 |

Dos piezas que quedan entre 40% y 55% cada una producen empate, y el empate es
exactamente la sensación de "cajas rígidas" que estamos matando. Si al medir dos
piezas quedan a menos de 12 puntos de distancia, una de las dos crece o encoge.

### 3.3 Regla del desfase mínimo

Un desplazamiento menor al **8% del ancho del contenedor** se lee como un
descuadre, no como intención. Todos los desfases del sistema viven entre **12% y
34%**.

Lo mismo con la rotación: **entre 2° y 7°**, jamás 0° dos piezas seguidas, jamás
15° ni 45° (eso es una calcomanía, no una composición).

### 3.4 Regla de la tensión distribuida

Cada forma tiene un punto de máxima curvatura — su "punto de tensión". Los puntos
de tensión de dos piezas vecinas **no pueden caer sobre la misma horizontal ni la
misma vertical** (margen: 15% del alto de la sección).

Si dos tensiones se alinean, el ojo lee un eje y la composición se vuelve
simétrica por accidente.

### 3.5 Regla del silencio

Cada sección reserva **un cuarto largo vacío**: un cuadrante donde no entra
ninguna pieza, ningún texto y ningún acento. La respiración no es lo que sobra
después de acomodar: se separa primero.

En el prototipo ese cuadrante rota por sección — abajo-izquierda en el hero,
arriba-derecha en familia, izquierda completo en editorial. Que rote es lo que
impide que la página tenga un margen fantasma repetido.

---

## 4. Sistema de profundidad

**Cinco capas.** La velocidad se expresa como múltiplo del scroll: 1.00 es el
contenido normal, menos de 1 se queda atrás, más de 1 adelanta.

| # | Capa | Qué vive ahí | Velocidad | Desenfoque | Opacidad |
| --- | --- | --- | --- | --- | --- |
| 0 | **Clima** | masas de color a la deriva, degradé de universo | **0.15** | 60px | .38 |
| 1 | **Estrato** | Crestas, campos de color, tramas | **0.42** | 0 | .55 |
| 2 | **Escena** | Gota, Losa, Hoja, Cuña — todo lo que lleva contenido | **1.00** | 0 | 1 |
| 3 | **Cercana** | Guijarros, cifras sueltas, etiquetas flotantes | **1.16** | 0 | .9 |
| 4 | **Piel** | Astillas, grano | **1.34** | 0 | .5 |

**Por qué esos números.** El salto entre capas vecinas se mantiene entre 0.16 y
0.42. Diferencias por debajo de 0.15 no se perciben (gastas GPU en nada) y por
encima de 0.7 producen mareo. El salto grande está entre Clima y Estrato, que es
donde el ojo espera el vacío: en el mundo real el fondo lejano casi no se mueve.

**La sensación de "sumergirse"** sale de dos refuerzos, no solo de la velocidad:

1. **Escala inversa** — la capa 0 y la 1 arrancan a `scale(1.06)` y bajan a
   `scale(1.00)` en su recorrido. Lo lejano se acerca; eso es lo que hace que la
   pantalla se sienta con fondo.
2. **Contraste decreciente con la distancia** — las capas 0 y 1 nunca superan
   0.55 de opacidad. La perspectiva aérea de un pintor, aplicada a un `div`.

### 4.1 Implementación

Un solo `requestAnimationFrame` calcula el scroll suavizado y lo reparte. Nada
de un listener por capa, nada de `window.addEventListener('scroll')` moviendo
elementos.

```js
const AMORTIGUA = 0.11;               // 0 = rígido, 1 = instantáneo
let objetivo = 0, actual = 0;

function cuadro(){
  objetivo = window.scrollY;
  actual  += (objetivo - actual) * AMORTIGUA;
  if (Math.abs(objetivo - actual) < 0.05) actual = objetivo;

  for (const capa of capas){
    const d = (actual - capa.base) * (capa.vel - 1);
    capa.el.style.transform = `translate3d(0, ${(-d).toFixed(2)}px, 0)`;
  }
  requestAnimationFrame(cuadro);
}
```

`0.11` a 60fps se asienta en unos 400ms después de soltar la rueda: se siente
guiado sin llegar a flotar. Por debajo de 0.07 el sitio se siente pegajoso y el
usuario cree que va lento; por encima de 0.2 deja de notarse el suavizado y no
vale la pena el `transform`.

El scroll suave propio es el mismo lazo: el documento scrollea nativo y un
contenedor fijo se desplaza con el valor amortiguado. Se activa solo con
`(hover:hover) and (pointer:fine)` — en táctil el scroll del sistema ya tiene su
propia inercia y pelear contra ella se siente roto.

Con `prefers-reduced-motion: reduce` el amortiguador pasa a 1, todas las
velocidades a 1.00 y las escalas quedan fijas. **El color y la opacidad se
conservan**: no se apaga la página, se apaga el desplazamiento.

### 4.2 Coreografía de entrada

Cada pieza recibe una variable `--p` de 0 a 1 con su progreso de entrada,
calculada en el mismo lazo. El CSS la consume:

```css
.pieza{
  opacity: calc(.15 + var(--p, 1) * .85);
  transform: translate3d(0, calc((1 - var(--p, 1)) * 42px), 0)
             scale(calc(.965 + var(--p, 1) * .035));
}
```

Nótese el `, 1` en cada `var()`: **el estado por defecto es el visible**. Si el
JavaScript no corre, la página se ve completa. Esa es la trampa que ya nos mordió
una vez.

---

## 5. Cómo se conecta con los cinco universos

Los universos ya existen (`UNIV` en `index.html`) y son incompatibles entre sí a
propósito. La regla no cambia: **un universo nunca se mezcla con otro dentro del
mismo elemento**. Lo que se añade es que cada universo también tiene una manera
de curvar.

Se expresa con un token de **tensión de curva** (`--curva`, de 0 a 1), que escala
cuánto se desvía una forma de su versión circular, y una **pareja de formas
propia**.

| Universo | Carácter | `--curva` | Pareja de formas | Cómo se nota |
| --- | --- | --- | --- | --- |
| `flujo` | líquido, degradé que respira | **1.00** | Gota + Guijarro | curvas largas, sin un solo vértice; el Guijarro respira a 14s |
| `brasa` | calor, ceniza, ámbar | **0.82** | Cresta + Astilla | la onda de la Cresta se vuelve irregular, dos crestas por borde |
| `trama` | rejilla, píxel, sistema | **0.34** | Losa + Cuña | radios cortos, las formas se acercan al rectángulo **sin llegar** |
| `hielo` | corte limpio, líneas duras | **0.20** | Hoja + Astilla | la cúspide de la Hoja se afila, aparece el vértice |
| `pulso` | anillos concéntricos, radar | **0.64** | Guijarro + Gota | el Guijarro se repite en tres anillos desfasados |

Aplicación práctica: la sección hereda el universo, no la pieza.

```css
[data-universo="flujo"]{ --curva:1;   --u1:#7c5cff; --u2:#00d4ff; --u3:#ff3d7f; }
[data-universo="brasa"]{ --curva:.82; --u1:#ff8a3d; --u2:#ffd166; --u3:#e0264a; }
[data-universo="trama"]{ --curva:.34; --u1:#4ade80; --u2:#2fb8a3; --u3:#0f5132; }
[data-universo="hielo"]{ --curva:.20; --u1:#dff6ff; --u2:#5b8def; --u3:#1b3fb8; }
[data-universo="pulso"]{ --curva:.64; --u1:#e6c877; --u2:#d98aa6; --u3:#8b5cf6; }
```

La sección declara el universo; las piezas de adentro solo leen `--curva`,
`--u1`, `--u2` y `--u3`. Ninguna pieza elige su propio universo, y por eso dos
universos no se pueden mezclar dentro de la misma forma.

### 5.1 Mapa universo → sección

Se hereda del clima que ya existe en `index.html`, extendido a las familias:

| Sección | Universo | Por qué |
| --- | --- | --- |
| Hero | `flujo` | es el estado antes de la idea: nada tiene borde todavía |
| Familia **Marca** | `pulso` | identidad = anillos que salen de un centro |
| Familia **Presencia** | `hielo` | encontrar y comprar exige corte limpio |
| Familia **Producción** | `brasa` | taller, calor, cosas que salen del horno |
| Panel de área / precios | `trama` | el único momento del sitio donde el sistema manda |
| Editorial / estudio | `flujo` | vuelve al principio, cierra el círculo |
| Cierre | `brasa` | termina caliente, no en frío |

La transición entre secciones interpola `--curva` y los tres colores del
universo, no los cambia de golpe. Una sección se convierte en la siguiente
mientras cruza la pantalla: eso es lo que hace que el recorrido se sienta como
un solo cuerpo y no como siete láminas.

---

## 6. Lo que sigue prohibido

Además de las prohibiciones del protocolo:

- **Ninguna esquina de 90°** en un contenedor con contenido. Cero excepciones.
- **Ninguna forma sin oficio.** Una curva que no enmarca nada ni pesa nada, sobra.
- **Ninguna simetría accidental.** Si al voltear la sección en el eje vertical se
  ve casi igual, está mal compuesta.
- **Ningún parallax sobre texto de párrafo.** El texto que se lee no se mueve a
  velocidad distinta del resto; marea. Solo titulares, medios y acentos.
- **Ningún generador de blobs al azar.** Las siete formas son el léxico. Una
  octava se agrega con oficio declarado o no se agrega.

---

## 7. De dónde sale esto

Investigación hecha para este documento. Se anota qué se pudo leer y qué no,
porque la segunda lista importa para la próxima sesión.

### Patrones que entraron al sistema

| Patrón | Fuente | Dónde aterrizó |
| --- | --- | --- |
| Los blobs se generan repartiendo N puntos sobre un círculo, desplazando cada radio al azar y uniéndolos con bézier cúbicas cuyas manijas son tangentes al círculo. La longitud de la manija es lo que decide si el borde es una ola o un pico | [CSS-Tricks, *Three Ways to Blob with CSS and SVG*](https://css-tricks.com/three-ways-to-blob-with-css-and-svg/) y la mecánica común de los generadores SVG | El léxico no se generó al azar: cada forma tiene 4 a 6 nodos con manijas largas, que es lo que da la curva continua en vez del pico |
| `clip-path: path()` usa píxeles fijos; `shape()` resuelve eso pero llegó a Baseline en febrero de 2026 | [WebKit, *The CSS shape() function*](https://webkit.org/blog/16794/the-css-shape-function/) · [web.dev, *Paths, shapes, clipping and masking*](https://web.dev/learn/css/paths-shapes-clipping-masking) | Por eso el sistema se apoya en `clipPathUnits="objectBoundingBox"`, que es responsivo y tiene años de soporte. `shape()` queda anotado como mejora futura |
| Diferencias de velocidad de 0,2 a 0,5 entre capas se leen como profundidad; por encima de 0,7 marean. Fondo lejano al 25%, capa media al 50% | [Builder.io, *The best way to create a parallax scrolling effect*](https://www.builder.io/blog/parallax-scrolling-effect) · [Webflow, *Parallax scrolling*](https://webflow.com/blog/parallax-scrolling) | Las cinco velocidades del §4: 0,15 · 0,42 · 1,00 · 1,16 · 1,34. Ningún salto entre vecinas pasa de 0,42 |
| Balance asimétrico: una pieza dominante contra varias menores. La dominante es la entrada a la composición; las subordinadas sostienen la atención pero **nunca compiten** | [Smashing Magazine, *Compositional Balance, Symmetry and Asymmetry*](https://www.smashingmagazine.com/2015/06/design-principles-compositional-balance-symmetry-asymmetry/) y *Dominance, Focal Points and Hierarchy* | La regla 60·27·13 del §3.2 y los tres tríos del §2.2 |
| Máscaras SVG animadas por scroll y capas con desenfoque y escala distintos para simular que un sujeto se despega del fondo | [Codrops, *SVG Mask Transitions on Scroll*](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/) · [Codrops, *Layered Zoom Scroll Effect*](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/) | La escala inversa del §4 (las capas lejanas arrancan a 1,06 y bajan a 1,00) y el contraste decreciente con la distancia. Sin GSAP: el mismo efecto sale de un solo `requestAnimationFrame` |
| Obys construye su sistema sobre una retícula declarada y tipografía propia, no sobre efectos sueltos | [Codrops, *Case Study: Design Education Series*](https://tympanus.net/codrops/2024/08/21/case-study-design-education-series/) | La regla del ancla única del §3.1: cada forma trae su borde recto de fábrica. Es lo que impide que "orgánico" se vuelva "sin retícula" |

### Lo que el proxy del sandbox bloqueó

No se pudo abrir ni con `WebFetch` ni con `curl`, así que lo de arriba se
reconstruyó desde resúmenes de búsqueda y no desde el sitio en vivo:

`obys.agency` · `des.obys.agency` · `locomotive.ca` · `hellomonday.com` ·
`immersive-g.com` · `dogstudio.co` · `awwwards.com` · `tympanus.net` ·
`developer.mozilla.org`

Si una sesión futura tiene salida abierta, vale la pena volver por dos cosas
concretas: la retícula declarada de `des.obys.agency/grids/` y el caso de
Immersive Garden en Awwwards.
