# DECISIONS.md — Rediseño LQS

Decisiones tomadas con criterio para no frenar el trabajo. Cada una es reversible; si alguna no te cuadra, vétala y se ajusta.

---

### D-01 — Paleta: gana el brief, se retiran los alias "Cyber Aero"
**Fecha:** 2026-07-21 · **Estado:** propuesta, requiere tu visto bueno

**Contexto.** `globals.css` tiene dos paletas en conflicto. El bloque `@theme` declara la del brief (`#000`, `#FF4600` naranja, `#008080` teal, `#0055FF` azul), pero los alias `:root --imi-*` de más abajo la sobrescriben con otra ("Cyber Aero": fondo `#040a1a`, teal→`#00E5FF`, azul→`#9B59FF`), y **los componentes consumen los `--imi-*`**. Lo que se ve hoy no es la paleta del brief.

**Decisión.** La paleta del brief es la fuente de verdad: negro `#000` absoluto, naranja `#FF4600`, teal `#008080`, azul `#0055FF`. Los `--imi-*` se mantienen como nombres pero **reapuntados** a los tokens del brief, para no romper los ~40 componentes que ya los usan. La familia neón (`--neon-*`) y el glassmorphism se retiran del hub y los niveles nuevos.

**Por qué.** El brief dice "no inventar" sobre el sistema de diseño, y el negro absoluto es un requisito del concepto (referencia Zentry, paleta de un solo color). Reapuntar en vez de renombrar evita un refactor masivo en el commit 1.

**Impacto.** El sitio actual cambia de aspecto **el primer día**: se va el azul noche y el cian, entra el negro puro. Es la decisión más visible de la lista.

---

### D-02 — Tipografía: Archivo Expanded Black no está en Google Fonts
**Fecha:** 2026-07-21 · **Estado:** decidida

**Contexto.** El brief pide Archivo Expanded Black para display; hoy hay Bebas Neue. Google Fonts sirve `Archivo` (con eje `wdth` variable), no la familia "Archivo Expanded" como tal.

**Decisión.** Usar **Archivo variable** vía `next/font/google` con el eje de anchura al máximo y peso 900, expuesto como `--font-display`. Si LQS tiene licencia del corte Expanded real, se cambia a `next/font/local` sin tocar ningún consumidor.

**Por qué.** Cumple la intención tipográfica sin bloquear la Fase 0 por un tema de licencias, y deja la puerta abierta al archivo real.

**Impacto.** Bebas Neue sale de los niveles nuevos. Inter se conserva para texto. JetBrains Mono se conserva solo para el contador del preloader y datos.

---

### D-03 — El cursor de pato se reescribe por dentro, no por fuera
**Fecha:** 2026-07-21 · **Estado:** decidida

**Contexto.** `useCursorDuck.ts` llama a `setDuck()` (estado de React) dentro de un `requestAnimationFrame`: un re-render por frame, más un `setInterval` de 28 ms para el aleteo. Sobre un canvas WebGL eso destruye el INP, que es una de las métricas innegociables.

**Decisión.** El motor pasa a refs + escritura directa de `transform`, con un solo rAF compartido y cero re-renders. **El SVG, las proporciones, las botas, el aleteo y la personalidad se conservan idénticos** — es la firma de marca y no se toca. Se le añaden estados de contexto (magnético, entrar-a-distrito, CTA) y una vía de escape: `cursor: none` solo cuando el pato está activo, nunca sobre inputs ni en modo `static`.

**Por qué.** El brief lo declara firma de marca *y* exige INP <200ms. Ambas cosas solo conviven si se conserva la forma y se cambia el motor.

---

### D-04 — El fallback es un render, no un producto aparte
**Fecha:** 2026-07-21 · **Estado:** decidida

**Decisión.** Un solo hook `useCapability()` resuelve `full | lite | static`. Las tres salidas comparten copy, rutas y capa DOM; solo cambia la capa de presentación. Ninguna PR de feature se da por cerrada sin sus tres modos.

**Por qué.** Es literalmente la recomendación #1 del informe: el Concepto 2 *es* la versión degradada del 1, no un segundo producto. Y la regla innegociable 5 exige que el fallback viaje en la misma PR.

---

### D-05 — CI de performance: Lighthouse CI + size-limit, bloqueante desde el commit 1
**Fecha:** 2026-07-21 · **Estado:** decidida

**Contexto.** No hay `.github/` en el repo. Cero CI hoy.

**Decisión.** GitHub Actions con Lighthouse CI (assertions en LCP <2.5s, CLS <0.1, TBT como proxy de INP en lab) sobre el build de producción, más `size-limit` con presupuesto separado para el bundle 3D. Falla → build rojo. Se instala **antes** de la primera feature.

**Por qué.** Regla innegociable 4. INP no es medible en lab, por eso se usa TBT como proxy en CI y se instrumenta INP real con `web-vitals` en campo (p75) desde Fase 1.

---

### D-06 — Los 11 servicios del seed son el punto de partida de los 22
**Fecha:** 2026-07-21 · **Estado:** propuesta, requiere tu confirmación

**Contexto.** El brief habla de una "matriz diagnóstica de 22 servicios" ya existente. El seed define **11** servicios en 3 categorías (MEDIA, GROWTH, IDEATION). No hay matriz: el `AutoDiagnosis` actual son 3 tarjetas que hacen scroll.

**Decisión.** Asumo que los 22 se definen ahora, en Fase 3, tomando los 11 del seed como base y cubriendo los tres distritos hoy vacíos (BASS, FESTA, ARTY). Las Fases 0-2 no dependen de esto.

**Por qué.** No bloquea el arranque y la ciudad se construye igual. Pero si esos 22 servicios ya existen en la BD de producción cargados por el admin, dímelo: cambia el mapeo mascota↔servicio y me ahorro inventarlos.

---

### D-08 — La ciudad vive en `/ciudad` durante Fases 0-1
**Fecha:** 2026-07-21 · **Estado:** decidida

**Decisión.** El hub se monta en `/ciudad`, no en `/`. Los distritos en `/ciudad/[distrito]` y el Ayuntamiento en `/ayuntamiento`. La home actual queda intacta.

**Por qué.** El grey-box tiene que ser revisable sin tumbar el sitio vivo. Poner primitivas wireframe en `/` el primer día no es una opción. La ciudad reemplaza `/` en Fase 2, cuando los 8 distritos tengan contenido.

**Efecto colateral útil:** el CI mide `/` y `/ciudad` en paralelo, así que cualquier regresión del sitio actual también rompe el build.

---

### D-09 — 8 distritos sobre 3 acentos, asignados por familia
**Fecha:** 2026-07-21 · **Estado:** decidida

**Contexto.** La paleta tiene 3 acentos y hay 8 mascotas. El brief prohíbe inventar colores.

**Decisión.** Naranja = energía/movimiento (REEL, BRAND, FESTA). Teal = luz/imagen (LUMI, ARTY). Azul = sistema/técnica (BASS, PIXEL, MUSE). Sin colores nuevos.

**Por qué.** Agrupar por familia hace legible el mapa desde la vista aérea: el usuario lee tres zonas, no ocho colores sueltos. Un color por mascota habría exigido cinco tonos fuera del sistema.

---

### D-10 — El pato se anima en CSS, no en JavaScript
**Fecha:** 2026-07-21 · **Estado:** decidida

**Contexto.** El aleteo, el balanceo y el paso venían de un contador `frame` en estado de React a 28ms.

**Decisión.** Esos tres movimientos pasan a `@keyframes` con los periodos exactos del original (3.52s / 0.80s / 0.63s, derivados de las frecuencias del seno original). El rAF solo escribe `transform` y dos `data-*`.

**Por qué.** Las animaciones CSS corren en el compositor y sobreviven a un hilo principal ocupado — justo lo que pasa cuando WebGL está compilando shaders. Es lo que hace que la firma de marca no compita con el presupuesto de INP.

---

### D-07 — Se trabaja en rama, no en `master`
**Fecha:** 2026-07-21 · **Estado:** decidida

**Contexto.** El repo está en `master` con `package.json` y `package-lock.json` modificados sin commitear y `anillo_3d/` sin trackear.

**Decisión.** Todo el rediseño va en `redesign/ciudad-del-pato`, con una rama por fase. Antes de arrancar hay que resolver el estado sucio actual — **no lo toco sin tu indicación**, porque no sé si `anillo_3d/` es trabajo tuyo en curso.
