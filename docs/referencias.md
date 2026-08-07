# Referencias — qué copiamos y por qué

Investigación para el rediseño estructural. No es una lista de tendencias: es
qué patrón concreto usamos, de dónde sale y en qué sección de LQS va.

## El diagnóstico que motiva todo esto

Conteo sobre `index.html` antes del rediseño:

- **11 de 13** bloques de contenido eran rejillas de cajas iguales.
- **6** variantes del mismo rectángulo redondeado: `.pt` `.area` `.card`
  `.fase` `.proj` `.bi`.
- Todas las secciones con el mismo `padding`, el mismo ancho de columna y la
  misma densidad.

Patrón repetido en cada sección: *título → párrafo → fila de cajas*. Eso es la
estructura de una diapositiva, y por eso el sitio se sentía a PowerPoint por
más que la piel mejorara.

## Técnica base: animaciones dirigidas por scroll, nativas

La decisión técnica que sostiene todo el rediseño. `animation-timeline` con
`view()` y `scroll()` conecta una animación CSS al scroll **sin una línea de
JavaScript**, corre fuera del hilo principal y va por GPU.

Importa para LQS porque el sitio es un archivo que se sube y ya: no podemos
meter GSAP ni Lenis sin romper esa promesa. Y porque el proxy del sandbox
bloquea CDNs, así que cualquier librería externa es un punto de falla que ya
nos mordió una vez con Supabase.

- `scroll()` — progreso del contenedor. Barras de progreso, parallax.
- `view()` — progreso de **un elemento** entrando y saliendo de pantalla.
  Es el que sirve para que cada sección tenga su propia línea de tiempo.
- `animation-range` acota el tramo: `entry 0% cover 40%`.

Respaldo: donde no haya soporte, la animación simplemente no corre y el
elemento se queda en su estado final. Hay que escribir el CSS para que el
estado por defecto sea el **visible**, no el oculto — si no, sin soporte la
página sale en blanco. Esta es la trampa principal de la técnica.

Fuentes: [Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
· [Smashing Magazine](https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/)
· [Josh Comeau](https://www.joshwcomeau.com/animation/scroll-driven-animations/)

## Patrones a robar, uno por sección

### 1 · Tarjetas que se apilan → **las nueve áreas**

`position: sticky` y cada tarjeta que ya quedó fija se **encoge** mientras la
siguiente se le monta encima; al final la pila entera sale como grupo.

Por qué aquí: las nueve áreas son hoy una rejilla plana de nueve cajas iguales
— el peor síntoma del diagnóstico. Apiladas dejan de ser un catálogo y pasan a
ser un recorrido, y cada una puede llegar con su universo y su clima.

### 2 · Barrido entre secciones → **entrada a cada mundo**

Cada sección tiene su `view-timeline`; la capa anterior escucha la línea de
tiempo de la **siguiente** y se retira con un barrido. Es lo que hace que Apple
se sienta continuo en vez de troceado.

Por qué aquí: el router SPA hace que cada vista sea una lámina a la que saltas.
El barrido cose el corte sin tocar el router.

### 3 · Progreso en cabecera fija → **paquetes y precios**

Una barra dentro de una cabecera `sticky` que se llena con
`animation-range` mientras la sección cruza la pantalla.

Por qué aquí: la lista de precios es larga y hoy no dice dónde estás dentro de
ella.

### 4 · Recorrido horizontal → **el proceso de trabajo**

Los cuatro pasos (Diagnóstico → Propuesta → Producción → Lanzamiento) hoy son
cuatro cajas iguales en fila. Convertidos en recorrido horizontal atado al
scroll vertical, la secuencia deja de ser decorativa y **se camina**.

Por qué aquí: es la única sección donde el orden sí carga información — la
excepción que justifica numerar.

### 5 · Editorial a dos columnas desiguales → **Nosotros**

Ritmo asimétrico: una columna ancha de texto contra una estrecha de datos, con
la estrecha en `sticky`. Rompe la retícula sin efectos.

Por qué aquí: es la sección más textual y la que menos gana con movimiento.

## Ritmo: la regla que ordena la página

Ninguna sección puede tener la misma densidad que la anterior. Alternancia
propuesta para Inicio:

```
hero            pantalla completa, quieto, respiración larga
ticker          franja fina, movimiento constante
áreas           pila sticky, densidad alta
proceso         recorrido horizontal, densidad media
datos           franja fina, quieto
cierre          pantalla completa, respiración larga
```

## Lo que NO copiamos

- **WebGL y WebGPU.** Los sitios premiados de 2026 los usan mucho, pero exigen
  build, peso y una tarjeta gráfica decente. LQS vende a restaurantes y hoteles
  en Colombia: el tráfico es móvil de gama media. El degradé cinético en CSS da
  el 80% de la sensación premium con cerca de cero costo de batería.
- **Secuencias de PNG atadas al scroll.** Se ven increíbles y pesan decenas de
  megas. Descartado por el mismo motivo.
- **Precargador con porcentaje.** Es decoración que retrasa el contenido.
