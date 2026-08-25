---
name: protocolo-lqs
description: El protocolo de diseño de LQS — marca, voz, paleta, tipografía, los cinco universos, la arquitectura del sitio y la cadena de skills obligatoria. Cárgala antes de tocar cualquier archivo de interfaz de este repo (index.html, mundos/*.html, legal.html): antes de escribir CSS, elegir un color, redactar copy de producto, montar una sección o añadir movimiento. También al revisar o auditar el diseño. No aplica a trabajo que no toque la interfaz.
---

# Protocolo LQS

Esto no es una guía de estilo: es el criterio con el que se decide. Si algo aquí
choca con tu instinto, gana esto. Si algo aquí choca con lo que pidió el cliente,
gana el cliente — y entonces actualiza este archivo.

## 1. Qué es LQS

Estudio creativo en Medellín, Colombia. Resuelve marca, sitio web,
automatización, audiovisual y producto. Vende a empresas, restaurantes, hoteles,
creadores y marcas propias.

- **Contacto:** WhatsApp +57 333 279 1710 · loqueseaproductionsp1@gmail.com
  (correo del negocio; el sitio todavía publica `cdparravargas@gmail.com`)
- **Redes:** Instagram `@loquesea.tv` · TikTok `@loquesea_tv` ·
  YouTube `@LQSloquesea` · X `@LoQueSea_TV_` ·
  Facebook, página ID `1228070560397914`
  Los handles **no son consistentes entre sí**. Al escribirlos, cópialos tal
  cual de esta lista: no son deducibles unos de otros.
- **Tagline:** *Creamos lo que sea. Resolvemos lo que venga.*
- **Concepto central:** Caos Creativo Organizado. El caos es la masa madre —
  energía pura antes de ser idea. LQS es el catalizador que la vuelve solución
  rentable.
- **Arquetipo:** Mago/Creador + Aliado.
- **Valores:** versatilidad todoterreno · transparencia radical · caos vital ·
  evolución continua.

**Tono:** inspirador, dinámico, directo, accesible. Escribe como alguien que
resuelve, no como alguien que vende.

**Lo que LQS nunca es:** rígida, aburrida, conformista, pretenciosa,
burocrática. Si un texto suena a agencia, está mal.

### Reglas de copy

- Español de Colombia, sin regionalismos cerrados. Tuteo.
- Precios siempre en pesos colombianos con separador de miles: `$45.000`.
- Los controles nombran su acción: *Cotizar mi proyecto*, no *Enviar*.
- Los errores nombran el problema y la salida, no piden disculpas.
- Nada de "soluciones innovadoras", "potenciamos", "llevamos tu marca al
  siguiente nivel". Di qué haces y cuánto vale.

## 2. El sistema visual

### Los cinco universos

El caos no se dibuja: se estructura. Las tres letras de LQS habitan universos
**incompatibles entre sí** y se mudan cada 3,4 s con una sola regla — nunca
coinciden. Ese es el concepto, y se extiende a toda la interfaz.

| Universo | Carácter | Colores |
| --- | --- | --- |
| `flujo` | líquido, degradé que respira | `#7c5cff` `#00d4ff` `#ff3d7f` |
| `brasa` | calor, ceniza, ámbar | `#ff8a3d` `#ffd166` `#e0264a` |
| `trama` | rejilla, píxel, sistema | `#4ade80` `#2fb8a3` `#0f5132` |
| `hielo` | corte limpio, líneas duras | `#dff6ff` `#5b8def` `#1b3fb8` |
| `pulso` | anillos concéntricos, radar | `#e6c877` `#d98aa6` `#8b5cf6` |

Están definidos en `index.html` en la constante `UNIV`. **Un universo nunca se
mezcla con otro dentro del mismo elemento.** Conviven en el encuadre, no en la
forma.

### El clima

El color de fondo no es decoración: dice en qué sección estás. Tres masas a la
deriva (`.atmos b`) toman la paleta de la vista activa desde la constante
`CLIMA`, y encima va una capa de grano (`.grano`) que rompe la perfección
digital. Al añadir una vista nueva, añade su clima.

### Tipografía

| Token | Familia | Para qué |
| --- | --- | --- |
| `--disp` | Bricolage Grotesque *(variable: opsz, wdth, wght)* | Títulos. Se aprieta y engorda según el sitio |
| `--sport` | Anton | Masa: las letras del hero, cifras grandes |
| `--edit` | Instrument Serif *(cursiva)* | Quiebres editoriales, énfasis con carácter |
| `--tech` | Chakra Petch | Etiquetas, datos, micro-texto |
| `--sans` | Manrope | Texto corrido |

Bricolage es variable: usa `font-variation-settings` para apretar títulos largos
en vez de bajarles el tamaño. Ese eje es la razón por la que se eligió.

### La esquina ancla

El lenguaje visual del sitio. Cada caja lleva **una esquina mucho más redonda
que las otras tres**, y cuál es **rota con la posición** (`nth-child(4n+1..4n)`).
Eso es lo que impide que un grupo de piezas iguales se lea como rejilla: ninguna
repite la esquina de su vecina.

- El radio lo gobierna `--curva`, el temperamento del universo activo:
  flujo 1,00 · brasa 0,82 · pulso 0,64 · trama 0,34 · hielo 0,20.
- Cuatro escalas, proporción ancla/menor de 2,5:1 — grande 40/16, media 26/10,
  control 16/6, píldora 11/4. Un botón chico con radio de caja grande se
  convierte en pastilla.
- **El acento vive en el borde y en el título**, nunca en un relleno grande:
  `--ac-bd` para el borde, `--ac-tx` para el texto. Esos dos tokens van en `*`
  y no en `:root`, porque `--ac` lo pone cada pieza en su `style`.
- Movimiento contenido: `translate:0 -2px` en hover, `scale:.98` en `:active`.

Quedan fuera a propósito, para que la esquina siga significando algo: las
pastillas de etiqueta (`.tagd`, `.st`, `.badge`), los controles redondos
(`.luz`, `.burger`) y las formas del léxico orgánico en la atmósfera.

Detalle completo en `docs/direccion-organica.md` §7.

### Claro y oscuro

Son **dos paletas**, no un filtro. Se conmutan con `data-tema` en `:root`.
Oscuro es la casa. Al añadir un color, defínelo en ambos bloques. Lo que se
invierte se declara explícitamente (ver `#heroCv`): nada de `filter: invert()`
global.

### Movimiento

Tokens en `:root`: `--ease-out`, `--ease-in-out`, `--ease-drawer`,
`--dur-fast` (160ms), `--dur-ui` (200ms), `--dur-panel` (300ms).

Reglas que ya costaron caro una vez:

- Nunca `transition: .3s` sin lista de propiedades — eso es `transition: all`.
- Hover con movimiento siempre dentro de `@media (hover:hover) and (pointer:fine)`.
- Todo lo pulsable necesita `:active`. En móvil es el único feedback que existe.
- `prefers-reduced-motion` quita desplazamiento y detiene bucles; **conserva**
  opacidad y color. Nada de apagarlo todo con `!important`.
- Solo `transform` y `opacity`. Si necesitas animar alto, `grid-template-rows`.

## 3. Arquitectura

Un solo archivo, `index.html`, con router SPA por hash. Las vistas viven en
`VIEWS`; `mundos/*.html` son fichas y muestras que abre el visor interno
(`abrirDemo`). Base de datos en Supabase con cliente `fetch` propio — **sin SDK
ni CDN**, porque el sitio tiene que seguir funcionando si una CDN cae.

### Lo que no se toca sin pensarlo dos veces

- El orden de carga del visor: `classList.add('on')` → `requestAnimationFrame` →
  `f.src`. Al revés, el iframe carga oculto y la muestra sale en negro.
- Las hojas de fuentes van con `media="print" onload="this.media='all'"`. Si
  bloquean el pintado y la CDN tarda, la página entera sale en blanco.
- El cliente `API` de Supabase y las políticas RLS.

### El pecado estructural

**Las tarjetas son el contenedor perezoso.** El sitio llegó a tener seis
variantes del mismo rectángulo redondeado (`.pt`, `.area`, `.card`, `.fase`,
`.proj`, `.bi`) y once de trece bloques eran rejillas de cajas iguales. Eso es
lo que hacía que pareciera PowerPoint.

Una sección nueva **no** puede ser *título → párrafo → fila de cajas*. Cada
sección gana su propio ritmo: capas con sticky, recorrido horizontal, pantalla
completa, editorial a dos columnas desiguales. Si dos secciones seguidas tienen
la misma densidad, una de las dos está mal.

## 4. Prohibiciones

Heredadas del listón de `impeccable`, ya aplicadas a este repo:

- **Eyebrows / kickers** sobre un titular. Prohibido sin excepción.
- Números de sección (01 / 02 / 03) salvo que la secuencia informe.
- Bordes de color de más de 1px al costado de tarjetas.
- Emoji o glifos Unicode como sistema de iconos.
- Sombras duras sin desenfoque.
- Monoespaciada como disfraz de "técnico".
- Texto con degradé **salvo** en los universos del hero, donde es el concepto.

## 5. La cadena de trabajo

Para cualquier tarea de diseño en este repo, en este orden:

1. **`taste-skill`** — dirección y anti-plantilla, antes de escribir código.
2. **`impeccable`** — ejecución con el sub-comando que corresponda (`bolder`,
   `layout`, `polish`, `animate`, `colorize`).
3. **`node .claude/skills/impeccable/scripts/detect.mjs --json <archivos>`** —
   barrido mecánico. Una vez, al final, no durante.
4. **`/review-animations`** — solo la puede invocar el usuario. Si el cambio
   toca movimiento, **pídeselo explícitamente**; no intentes replicarla.
5. Verificación en navegador: escritorio y móvil en la misma tanda,
   desbordamiento horizontal, contraste, y `prefers-reduced-motion`.

Para auditar movimiento en todo el repo: **`improve-animations`** (esa sí se
puede invocar). Los planes viven en `plans/`.

## 6. Verificación

Chromium está en `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; lánzalo
con `--no-sandbox` y sirve por HTTP (`python3 -m http.server`), nunca `file://`.

**Las fuentes de Google están bloqueadas en el sandbox.** Toda captura sale con
la tipografía de respaldo. Nunca juzgues la tipografía desde aquí y **avísale al
usuario** cuando le muestres capturas.

Comprobaciones que no se saltan:

- `document.documentElement.scrollWidth === innerWidth` en 390px y 1440px.
- Cero errores en `pageerror`.
- Con `prefers-reduced-motion`: nada se desplaza, nada estroba, todo se ve.
- El visor abre con contenido (`contentDocument.body.children.length > 0`).
- Tras un tap en móvil, ningún elemento queda pegado en `:hover`.

## 7. Conectores

- **Supabase** — proyecto `lqs` (`blzzzklljdvsyudlrvbt`). Tablas: `universos`,
  `paquetes`, `perfiles`, `solicitudes`, `proyectos`, `hitos`, `citas`,
  `suscriptores`, `eventos`.
- **GitHub** — solo `motta-bit/lqs-web`. Rama de trabajo
  `claude/peru-restaurant-interactive-page-jpv3j7`. Nunca empujar a `master`
  sin permiso.
- **higgsfield** — imágenes y video de relleno mientras no haya material real.
  Autorizado por el usuario. Ojo: las descargas desde su CDN pueden dar 403 a
  través del proxy; verifica antes de prometer un archivo.
- **Figma** — sistema de diseño y export de piezas.

Canva, HyperFrames y MailerLite requieren que el usuario los autorice desde sus
ajustes de conectores en claude.ai. No se pueden autorizar desde una sesión.

## 8. Deuda conocida

Se mantiene aquí para no volver a descubrirla:

- No hay logo real, ni fotos, ni portafolio. Inventario en `CONTENIDO-PENDIENTE.md`.
- Restaurantes y Hoteles son áreas sin ficha a propósito: la ruta va vacía en
  `FICHAS` y la tarjeta muestra "Ficha en camino".
- `legal.html` tiene datos por completar (razón social, NIT, dirección).
