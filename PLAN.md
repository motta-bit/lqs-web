# PLAN.md — Rediseño LQS "La Ciudad del Pato"

Estado: **esperando OK**. Nada de código hasta aprobación.
Fuente de verdad: `LQS Immersive Website Redesign_ Research, Analysis, and Concept (1).pdf` (informe, 21 jul 2026).
Concepto: **1 — La Ciudad del Pato**, con Concepto 2 (scroll cinematográfico por capítulos) como versión degradada móvil/reduced-motion del mismo producto.

---

## 0. Hallazgos que cambian el brief (leer esto primero)

El brief asume cuatro cosas que el repo **no confirma**. Ninguna es bloqueante, pero cambian alcance y estimación.

| # | El brief asume | La realidad del repo | Impacto |
|---|---|---|---|
| 1 | "La Ciudad del Mercado ya existe, es la base visual del hub" | **No existe.** Cero archivos. La única coincidencia de "Ciudad" en todo `src/` es un placeholder de formulario (`'Medellín, Colombia'` en `QuoterEventFlow.tsx:83`). No hay escena de ciudad, ni mapa, ni distritos. | El hub es **nuevo de cero**, no un reuso. Es el mayor costo oculto del proyecto. |
| 2 | "Las 8 mascotas ya están mapeadas a servicios" | **No existen.** Cero apariciones de REEL / LUMI / BASS / BRAND / FESTA / PIXEL / ARTY / MUSE en el código o en la BD. Lo que hay son 3 ilustraciones de pato genéricas (`DuckIllustration.tsx`: Brand / Creator / Event). | Las 8 mascotas son **nuevas**: identidad, modelo y mapeo a servicios. |
| 3 | "Matriz diagnóstica de 22 servicios" | El seed tiene **11 servicios** (22 apariciones de `slug:` = 11 × `where` + `create`), en 3 categorías: MEDIA (4), GROWTH (4), IDEATION (3). El "diagnóstico" actual (`AutoDiagnosis.tsx`) son **3 tarjetas** que hacen scroll a `#servicios` — no es una matriz. | Faltan ~11 servicios y la matriz real. Hay que definir de dónde salen: ¿los cargó alguien por el admin en producción? |
| 4 | "Next.js 14" | **Next.js 16.2.9 + React 19.2.4.** `AGENTS.md` advierte explícitamente que las APIs difieren de lo conocido y obliga a leer `node_modules/next/dist/docs/` antes de escribir. | A favor nuestro: View Transitions y las APIs de routing modernas están disponibles. Pero nada de código de memoria. |

**Lo que sí existe y es oro:** el cursor de pato, el cotizador de 6 pasos y el motor de precios. Ver §1.

**Pregunta abierta #3** (la respondo con criterio si no me dices lo contrario, ver `DECISIONS.md`): asumiré que los 22 servicios se definen ahora como parte de la Fase 3 y que los 11 del seed son el punto de partida.

---

## 1. Inventario: qué se reusa, qué se reescribe, qué es nuevo

### ✅ REUSAR — existe y sirve

| Activo | Ruta | Nota |
|---|---|---|
| Cotizador 6 pasos (estado) | `src/store/quoterStore.ts` | `totalSteps: 6` ya definido, flujo completo (clientType → servicios → urgencia → moneda → resultado → contacto). Se conserva **la máquina de estados tal cual**; solo cambia la piel. |
| Motor de precios | `src/lib/quote-engine.ts` | Multiplicador por urgencia + descuento por volumen + paquete sugerido. Correcto y aislado. Cumple la regla "el precio vive solo al final". |
| UI del cotizador | `src/components/quoter/{QuoterPanel,QuoterStep,QuoterEventFlow}.tsx` | Se reusa la lógica; el envoltorio pasa a ser "Ayuntamiento" (Nivel 4). |
| API de cotización / leads | `src/app/api/v1/{quote,leads,services}/route.ts` | Sin cambios. |
| Capa de datos | `prisma/schema.prisma` (`Service`, `Lead`, `QuoteItem`, `Package`) | Sin cambios estructurales salvo el mapeo mascota↔servicio (§3). |
| Admin completo | `src/app/admin/**` | Fuera de alcance del rediseño. No se toca. |
| Lenis | `src/components/layout/LenisProvider.tsx` | Base del ritmo de scroll del Nivel 2/3 y del fallback Concepto 2. |
| Detección de viewport | `src/hooks/useMediaQuery.ts` | Base para el hook de capacidad (§4). |

### 🔧 REESCRIBIR — existe pero no aguanta el rediseño

| Activo | Ruta | Por qué |
|---|---|---|
| **Cursor de pato** | `src/hooks/useCursorDuck.ts` + `src/components/layout/DuckCursor.tsx` | **El SVG y la personalidad se conservan íntegros — es la firma de marca.** Lo que se reescribe es el motor: hoy hace `setDuck()` (estado de React) **dentro de un `requestAnimationFrame`**, o sea un re-render de React por frame, más un `setInterval` de 28 ms para el contador de alas. A 60 fps sobre un canvas WebGL eso es un asesinato de INP. Pasa a refs + `transform` directo sin re-render. Además: hoy fuerza `cursor: none` globalmente sin escape, y no tiene estados de contexto (magnético, "entrar al distrito", CTA). |
| **Preloader** | `src/components/layout/Preloader.tsx` | El progreso es **falso** (`[20,45,70,90,100]` por `setInterval`) y se salta con `localStorage`. El informe exige contador **real** de assets (§D). Se reescribe contra `THREE.LoadingManager` + el pato ensamblándose. |
| **Tokens de diseño** | `src/app/globals.css` | Conflicto real: el bloque `@theme` sí tiene la paleta del brief (`#000`, `#FF4600`, `#008080`, `#0055FF`), pero justo debajo los alias `:root --imi-*` la **sobrescriben** con una paleta "Cyber Aero" distinta (`--imi-bgAbsolute: #040a1a`, teal→`#00E5FF`, azul→`#9B59FF`) — y los componentes consumen los `--imi-*`. **Lo que se renderiza hoy no es la paleta del brief.** Ver decisión D-01. |
| **Tipografía** | `src/app/layout.tsx` | Hoy Bebas Neue + Inter + JetBrains Mono. El brief pide **Archivo Expanded Black** para display. Ver D-02. |
| Canvas 3D | `src/components/three/HeroCanvas.tsx` | Hoy es un `<Canvas>` de hero con `OrbitControls` y un nodo abstracto. La ciudad necesita otra arquitectura (cámara dirigida, instancing, carga por nivel). Se conserva como referencia de integración R3F. |

### 🆕 NUEVO — no existe nada

- **Motion system** (curvas, duraciones, reglas de reacción) — definido *antes* del diseño visual, estilo Zentry. Es el entregable central de Fase 0.
- **Presupuesto CWV en CI** — no hay `.github/` en absoluto. Cero CI hoy.
- **Soporte `prefers-reduced-motion`** — **cero apariciones en todo `src/`**. Hoy el sitio ignora la preferencia por completo.
- **Hub / Ciudad** (Nivel 1): escena, cámara, 8 distritos, grey-box.
- **Las 8 mascotas**: identidad, modelo, mapeo a servicios.
- **Nivel 2 (Distrito)** y **Nivel 3 (Local / deep-dive)** + sus rutas.
- **Sistema de transiciones** (clip-path GSAP hub↔distrito, zoom-morph a Nivel 3, View Transitions + prerender).
- **Capa DOM sobre canvas**: títulos/CTA en HTML real, superpuestos, nunca dentro del canvas.
- **Fallback Concepto 2** (scroll por capítulos) como render alternativo del mismo contenido.
- **Sonido opt-in** con toggle visible.
- **Matriz diagnóstica real** + propuesta navegable de salida.
- **Easter eggs / Whispers** (Fase 2).

---

## 2. Arquitectura objetivo

```
src/
  app/
    (city)/
      layout.tsx              # provider de nivel + capa DOM + toggle sonido
      page.tsx                # Nivel 1 — Hub (SSR: h1 + 8 enlaces reales a distritos)
      [distrito]/
        page.tsx              # Nivel 2 — 1 frase + 2-3 casos
        [caso]/page.tsx       # Nivel 3 — deep-dive, aquí vive el texto largo
    ayuntamiento/page.tsx     # Nivel 4 — cotizador + matriz
  city/                       # dominio de la ciudad (nuevo)
    districts.ts              # las 8 mascotas: id, color, frase, servicios, posición
    scene/                    # R3F: City, District, Buildings (grey-box → arte)
    dom/                      # overlays DOM: títulos, CTA, breadcrumb
    transitions/              # clip-path, zoom-morph, view-transitions
  motion/                     # NUEVO — sistema de motion
    tokens.ts                 # curvas, duraciones, escalas
    rules.ts                  # reglas de reacción (hover/enter/exit/idle)
    useReducedMotion.ts       # + useCapability(): full | lite | static
  components/duck/            # cursor reescrito (SVG intacto) + estados de contexto
```

**Regla estructural que hace cumplir el punto 3 del brief:** el canvas nunca renderiza texto. Cada nivel expone un componente `<LevelCopy>` en DOM real, server-rendered, posicionado sobre el canvas. Si JS falla, el `<noscript>` y el HTML del servidor siguen dando headline + CTA. Esto es lo que salva SEO, a11y y LCP a la vez.

---

## 3. Las 8 mascotas → servicios

Del informe (§Textos propuestos), con el mapeo a los 11 servicios que **sí** existen en el seed:

| Mascota | Frase (Nivel 2) | Servicios actuales en BD |
|---|---|---|
| REEL | *Lo tuyo en movimiento.* | `video-produccion`, `contenido-redes` |
| LUMI | *Que se vea bien.* | `fotografia-corporativa`, `fotografia-producto` |
| BASS | *Que suene.* | — **sin servicio en BD** |
| BRAND | *Que se reconozca.* | `branding-identidad`, `naming-copywriting` |
| FESTA | *Que se sienta.* | — **sin servicio en BD** (existe flujo de eventos en el cotizador) |
| PIXEL | *Que funcione.* | `diseno-web`, `seo-analitica` |
| ARTY | *Que sorprenda.* | — **sin servicio en BD** |
| MUSE | *De dónde sale todo.* | `gestion-redes`, `pauta-digital`, `email-marketing` |

Tres distritos (BASS, FESTA, ARTY) **no tienen servicio que vender todavía**. En Fase 0 se construyen igual en grey-box; en Fase 3 hay que poblarlos o el distrito queda vacío al llegar al cotizador. Lo anoto como riesgo, no lo resuelvo solo.

---

## 4. Estrategia de degradación (una sola implementación, tres salidas)

Un único hook `useCapability()` resuelve a tres modos, y **cada feature se entrega con los tres desde su propia PR** (regla innegociable 5):

| Modo | Cuándo | Qué se sirve |
|---|---|---|
| `full` | desktop, sin `prefers-reduced-motion`, WebGL2 ok | Ciudad 3D navegable completa |
| `lite` | móvil / tablet / GPU débil | **Concepto 2**: scroll cinematográfico por capítulos, mismo contenido y mismas rutas, sin mundo 3D |
| `static` | `prefers-reduced-motion: reduce` | Mismo DOM, imágenes estáticas de alta calidad, transiciones a `opacity` simple, cero parallax, cero autoplay |

Los tres consumen **el mismo copy y las mismas rutas**. No son tres productos: es un render distinto del mismo árbol.

---

## 5. Fases

**Fase 0 — Fundaciones** *(empieza al recibir OK)*
1. CI con presupuesto CWV que **rompe el build**: Lighthouse CI (LCP <2.5s, INP <200ms, CLS <0.1) + `size-limit` sobre el bundle 3D. Se instala en el commit 1, antes que cualquier feature.
2. Tokens de diseño reconciliados (resuelve D-01/D-02) — una sola fuente, sin alias en conflicto.
3. **Motion system antes del diseño visual**: curvas, duraciones y reglas de reacción documentadas y tipadas.
4. `useCapability()` + `useReducedMotion()` + los tres modos cableados y verificables.
5. Grey-box de la ciudad y las 8 mascotas (primitivas, sin arte) con la capa DOM ya encima.
6. Cursor de pato reescrito a refs (SVG y personalidad intactos).
**Cierra con:** commit + medición Lighthouse del grey-box como línea base.

**Fase 1 — Hub + 2 distritos piloto** · preloader real, hub navegable, transición clip-path, 2 mascotas completas. Medir LCP/INP/CLS reales.
**Fase 2 — 8 distritos + deep-dives + sonido** · completar mascotas, Nivel 3, sonido opt-in, easter eggs, Whispers.
**Fase 3 — Conversión** · Ayuntamiento: cotizador reformulado como conversación, matriz diagnóstica, propuesta navegable.
**Fase 4 — Optimización y lanzamiento** · auditoría, QA de a11y, A/B del CTA del pato.

**Regla de corte del informe, adoptada:** si tras Fase 1 el móvil no pasa LCP <2.5s / INP <200ms, se recorta el 3D en móvil al modo `lite` **antes** de escalar a 8 distritos.

---

## 6. Riesgos

1. **El hub es nuevo, no un reuso.** El brief presupone la Ciudad del Mercado construida; no lo está. Es el riesgo de cronograma número uno.
2. **Performance móvil** (riesgo principal según el informe). Mitigado por CI desde el commit 1 y por el modo `lite` construido en paralelo, no después.
3. **Next 16 ≠ Next 14.** `AGENTS.md` obliga a leer los docs locales. Se acata: nada de APIs de memoria.
4. **Tres distritos sin servicio** que vender (BASS, FESTA, ARTY).
5. **Conflicto de paleta sin resolver** entre lo que dice el brief y lo que renderiza el sitio hoy (D-01).
6. **Trabajo sin commitear** en `master`: `package.json`/`package-lock.json` modificados y `anillo_3d/` sin trackear. Hay que limpiar antes de empezar; y el trabajo va en rama, no en `master`.

---

## 7. Lo que necesito de ti

Solo el **OK para arrancar Fase 0**. Las decisiones que puedo tomar con criterio ya están tomadas y anotadas en `DECISIONS.md` — revísalas y vétame las que no te cuadren, sobre todo **D-01 (paleta)**, que es la única que cambia lo que se ve en pantalla desde el primer día.
