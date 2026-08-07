# Propuesta de rediseño — Sitio LQS

Documento de trabajo. Se escribe para ejecutarse: cada sección dice qué se hace,
por qué, y con qué. Léelo con `.claude/skills/protocolo-lqs/SKILL.md` al lado —
ese archivo es el criterio, este es el plan.

---

## 1. El diagnóstico

No es opinión. Es conteo sobre `index.html` antes de empezar.

| Síntoma | Medida |
| --- | --- |
| Bloques de contenido que son rejillas de cajas iguales | **11 de 13** |
| Variantes del mismo rectángulo redondeado | **6** (`.pt` `.area` `.card` `.fase` `.proj` `.bi`) |
| Secciones con padding, ancho y densidad idénticos | **todas** |
| Patrón repetido en cada sección | título → párrafo → fila de cajas |

Eso es la estructura de una diapositiva. Por eso se siente plano por más que
mejore la piel: **el problema nunca fue el color ni la tipografía, fue el
esqueleto.**

Segundo problema, el que tú señalaste: **la pantalla principal es un catálogo**.
Entras y lo primero que ves son seis portales y nueve áreas. Eso obliga al
visitante a elegir antes de saber quién eres. Un estudio creativo que abre con
un menú de productos se lee como un proveedor, no como un aliado.

---

## 2. El concepto

**«Cada letra, un universo.»**

El caos no se dibuja: se estructura. LQS son tres letras que se niegan a
pertenecer al mismo sistema visual y aun así forman un logo. Cinco universos
incompatibles entre sí —flujo, brasa, trama, hielo, pulso— y cada letra habita
uno, mudándose cada 3,4 segundos con una sola regla: **nunca coinciden**.

Eso ya está construido y funciona. Lo que falta es **extenderlo a todo el
sitio**: hoy el concepto vive solo en el hero y el resto sigue siendo una
plantilla ordenada.

La traducción a arquitectura es directa: si el caos organizado es "tres sistemas
que no combinan sostenidos en un mismo encuadre", entonces **ninguna sección del
sitio puede parecerse a la anterior**. Esa es la regla estructural de todo lo que
sigue.

---

## 3. Arquitectura nueva

### 3.1 El cambio que pediste: los servicios salen de la portada

Hoy: **Inicio** es un catálogo de 6 portales + 9 áreas.
Propuesta: **Inicio no vende nada.** Presenta el estudio y abre una sola puerta.

Los servicios pasan a vivir dentro de las secciones, agrupados. Y aquí está la
decisión de arquitectura de información más importante del rediseño:

### 3.2 Nueve áreas planas → tres familias de tres

Nueve cosas en fila es una lista que nadie lee. Tres familias sí se recuerdan, y
además coinciden con cómo la gente busca:

| Familia | Qué contiene | A quién le habla |
| --- | --- | --- |
| **Marca** | Empresas · Creadores · Ropa y Merch | "Necesito verme serio" |
| **Presencia** | Sitios web · Restaurantes (Carta) · Hoteles (Aloja) | "Necesito que me encuentren y me compren" |
| **Producción** | Productora · Express · Automatización | "Necesito piezas y que responda solo" |

Cada familia es una sección con su propio universo visual y su propio clima de
color. Adentro, las tres áreas se recorren apiladas — el patrón que ya está
construido y funcionando.

Ventaja secundaria: los precios dejan de ser una lista larga al final y pasan a
vivir dentro de su familia, en contexto.

### 3.3 Mapa de navegación

```
INICIO          quién es LQS · la prueba · una puerta
QUÉ RESOLVEMOS  Marca → Presencia → Producción
TRABAJO         casos reales y muestras que se tocan
ESTUDIO         cómo trabajamos · el equipo · el proceso
HABLEMOS        cotizar · agendar · WhatsApp
CUENTA          seguimiento de proyectos (privado)
```

Seis destinos en vez de siete, ordenados por lo que el visitante quiere, no por
lo que LQS vende.

---

## 4. Diseño sección por sección

La regla de ritmo: **ninguna sección repite la densidad de la anterior.**

### INICIO

| Momento | Densidad | Qué es |
| --- | --- | --- |
| Hero | vacío, respiración larga | LQS con sus universos. Ya está construido |
| Manifiesto | media, editorial | Dos frases a tamaño de titular, tipografía variable que se aprieta con el scroll |
| Prueba | alta | Tres casos reales, en recorrido horizontal atado al scroll vertical |
| Puerta | vacío | Una sola pregunta: *¿Qué necesitas resolver?* y tres destinos |

**Lo que desaparece de aquí:** los seis portales, las nueve áreas, la lista de
áreas en pastillas.

### QUÉ RESOLVEMOS

Tres actos. Cada uno entra con un barrido a pantalla completa que declara la
familia, y adentro las tres áreas se apilan y se recorren.

- **Entrada de acto**: pantalla completa, el nombre de la familia a tamaño
  máximo, el clima cambia al color de la familia.
- **Los paneles**: sticky, dos columnas desiguales, el campo con la trama del
  universo. *(Ya construido.)*
- **Precios**: cabecera fija con barra de progreso que se llena mientras cruzas
  la sección.

### TRABAJO

Contra-ritmo deliberado: después de tres actos densos, esta sección es lenta y
grande. Cada caso ocupa pantalla completa con la imagen fija y el texto
subiendo encima.

El antes/después (**A2** del plan de producción) es la pieza estrella y merece
un tratamiento propio: divisor arrastrable sobre la misma foto.

### ESTUDIO

La única sección sin movimiento fuerte, a propósito. Editorial a dos columnas
desiguales: texto ancho contra una columna estrecha fija con los datos.

El proceso —Diagnóstico → Propuesta → Producción → Lanzamiento— pasa a recorrido
horizontal. Es la única secuencia del sitio donde el orden sí carga información,
así que es la única que puede ir numerada.

### HABLEMOS

Formulario a pantalla completa, una pregunta a la vez. Nada de un muro de
campos. El clima se calienta a medida que avanzas.

---

## 5. El sistema inmersivo

Cinco capas, de atrás hacia adelante:

1. **Clima** — tres masas de color a la deriva que toman la paleta de la sección.
   *Construido.*
2. **Grano** — ruido SVG que rompe la perfección digital. *Construido.*
3. **Universos** — las cinco tramas, hoy solo en el hero. **Falta extenderlas.**
4. **Movimiento por scroll** — `animation-timeline: view()` nativo.
   *Construido en las áreas; falta en el resto.*
5. **Tipografía viva** — Bricolage Grotesque es variable: los ejes de ancho y
   peso responden al scroll. **Falta.**

### La decisión técnica que sostiene todo

**Animaciones dirigidas por scroll nativas de CSS. Sin librerías.**

No GSAP, no Lenis, no Framer. Corren fuera del hilo principal, van por GPU, y
sobre todo mantienen la promesa de que el sitio es **un archivo que subes y ya**.
Meter una librería externa rompería eso, y ya nos mordió una vez cuando el SDK
de Supabase por CDN dejó la página en blanco.

**La trampa a evitar:** el estado por defecto de cada animación tiene que ser el
**visible**. Si se escribe al revés, un navegador sin soporte muestra una página
en blanco. Todo va dentro de `@supports (animation-timeline: view())`.

### Lo que se descarta a propósito

- **WebGL / WebGPU.** Los sitios premiados de 2026 los usan mucho, pero exigen
  build, peso y GPU decente. LQS vende a restaurantes y hoteles en Colombia: el
  tráfico es móvil de gama media. El degradé cinético en CSS da el 80% de la
  sensación premium con casi cero costo de batería.
- **Secuencias de PNG atadas al scroll.** Se ven increíbles y pesan decenas de
  megas.
- **Precargador con porcentaje.** Es decoración que retrasa el contenido.

---

## 6. Herramientas — qué hay instalado y para qué sirve

### Skills de diseño

| Skill | Cuándo se usa |
| --- | --- |
| **`protocolo-lqs`** | Sola, al tocar cualquier archivo de interfaz. Es el criterio |
| **`taste-skill`** | Dirección y anti-plantilla, **antes** de escribir código |
| **`impeccable`** | Ejecución. Sub-comandos: `bolder` `layout` `polish` `animate` `colorize` `critique` `audit` |
| **`apple-design`** | Gestos, resortes, materiales translúcidos, profundidad |
| **`emil-design-eng`** | Los detalles invisibles que hacen que se sienta bien |

### Skills de movimiento

| Skill | Cuándo se usa |
| --- | --- |
| **`animate`** | Construir una animación desde cero, decidiendo en el orden correcto |
| **`find-animation-opportunities`** | Dónde falta movimiento y dónde sobra |
| **`improve-animations`** | Auditoría de todo el repo → planes ejecutables |
| **`animation-vocabulary`** | Ponerle nombre exacto a un efecto |
| **`/review-animations`** | **Solo la puedes invocar tú.** Revisión del movimiento contra el listón de Emil Kowalski |

### Verificación

- `node .claude/skills/impeccable/scripts/detect.mjs --json <archivos>` — barrido
  mecánico de anti-patrones. Una vez, al final.
- Chromium + Playwright para capturas y medición en 390px y 1440px.

### Conectores

| Conector | Para qué en este proyecto | Estado |
| --- | --- | --- |
| **Notion** | El plan de producción del material vive ahí | ✅ Conectado |
| **Supabase** | Paquetes, solicitudes, proyectos, citas | ✅ Conectado |
| **GitHub** | `motta-bit/lqs-web` | ✅ Conectado |
| **higgsfield** | Imágenes y video de relleno mientras llega el material real | ✅ Autorizado |
| **Figma** | Sistema de diseño y export de piezas | ✅ Conectado |
| **Vercel** | Alternativa a GitHub Pages, con dominio propio y analítica | ✅ Conectado |
| Canva · HyperFrames · MailerLite | — | ⚠️ **Necesitan que los autorices tú** desde tus ajustes de conectores en claude.ai. No se puede desde una sesión |

---

## 7. Plan de ejecución

Orden pensado para que en cada corte haya algo mostrable, no un sitio a medias.

### Fase A — Arquitectura *(la que más cambia y la que hay que hacer primero)*

1. Reagrupar las nueve áreas en las tres familias.
2. Vaciar Inicio: sacar los seis portales y las nueve áreas.
3. Construir el nuevo Inicio: manifiesto → prueba → puerta.
4. Reescribir el router para seis destinos.

**Riesgo:** toca el router SPA, que es lo que sostiene todo. Se hace primero y
se verifica antes de seguir.

### Fase B — Las tres familias

5. Entrada de acto a pantalla completa, con cambio de clima.
6. Los paneles apilados dentro de cada familia. *(Base construida.)*
7. Precios en contexto, con cabecera de progreso.

### Fase C — Trabajo y Estudio

8. Casos a pantalla completa con imagen fija.
9. Antes/después con divisor arrastrable.
10. Estudio editorial a dos columnas desiguales.
11. Proceso en recorrido horizontal.

### Fase D — Profundidad

12. Extender los cinco universos fuera del hero.
13. Tipografía variable atada al scroll.
14. Barridos entre secciones.
15. Hablemos: formulario de una pregunta a la vez.

### Fase E — Ecosistema

16. Las doce páginas de `mundos/` al sistema nuevo.
17. `legal.html` con los datos reales.

### Fase F — Cierre

18. `detect.mjs` sobre todo.
19. **Pedirte `/review-animations`** — no la puedo invocar yo.
20. Contraste medido, móvil real, peso de página.
21. Publicar.

---

## 8. Lo que falta de tu lado

Del plan de producción que ya tienes en Notion. Sin esto hay un techo que ningún
diseño rompe: **una página premium sin material real se nota.**

### Bloqueante — sin esto no se puede cerrar

| Código | Qué es |
| --- | --- |
| **B1** | Logo en archivos reales (SVG + PNG transparente) |
| **D1** | Tres casos de portafolio con resultados |
| **A2** | Un antes/después real ⭐ |
| **B2** | Imagen para compartir (1200×630) |
| **A1** | Fotos del taller |

### Importante — cambia la calidad, no la viabilidad

**A3** catálogo · **A4** comida · **A5** ropa y merch · **B4** ocho piezas
Express · **B5** muestras tipo revista · **C1** reel del estudio · **D2**
testimonios

### Datos

**D3** redes, dirección, horario, razón social, NIT · **D4** confirmar precios ·
**E1–E4** datos legales

> Mientras tanto puedo generar imágenes de relleno con higgsfield para que el
> diseño se pueda evaluar. **No sirven para publicar** — son andamios.

---

## 9. Cómo arrancar la próxima sesión

El contexto de una sesión se acaba; el protocolo no. Para retomar:

```
Lee docs/PROPUESTA-REDISENO.md y ejecuta la Fase A.
```

`protocolo-lqs` se carga sola al tocar interfaz y trae el criterio completo.
Los planes de movimiento anteriores están en `plans/`, las referencias en
`docs/referencias.md`, y el inventario de material en Notion.
