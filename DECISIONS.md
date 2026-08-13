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

### D-11 — Modelo comercial: precios de emprendedor + escalera mensual mejorable
**Fecha:** 2026-07-22 · **Estado:** decidida (indicación del cliente)

**Contexto.** El cliente pidió precios económicos y competitivos, enfocados en emprendedores, personas naturales y encargos pequeños; los paquetes grandes reservados y muy específicos solo para grandes empresas; planes mensuales por pasos de desarrollo de marca, mejorables; y contratos a largo plazo.

**Decisión.**
1. **Servicios repreciados a la baja** como precios de entrada ("desde"), accesibles para emprendedores (COP 280k–1.9M; la mayoría de encargos pequeños bajo 1M). Antes eran tarifas de gran agencia (hasta 5.5M).
2. **Escalera comercial por audiencia** (nuevo enum `Audience`): EMPRENDEDOR → PYME → CORPORATIVO.
3. **Facturación** (nuevo enum `BillingType`): `ONE_TIME` (encargo) vs `MONTHLY` (plan). Los planes mensuales son la columna vertebral del desarrollo de marca por pasos.
4. **Planes mensuales mejorables** ordenados por `tierStep`: Semilla (emprendedor, 1) → Despegue (pyme, 2) → Escala (pyme, 3). El usuario sube de paso mejorando el plan. Cada paso suma "cosas vitales" (campo `perksEs/En`: reportes, rondas, reuniones, SLA).
5. **Corporativo específico y con permanencia** (`commitmentMonths`): Marca Corporativa 360 (encargo grande) y Retainer Corporativo (mensual, 12 meses), reservados a grandes empresas.

**Precios resultantes** (con descuento por volumen aplicado):
- Emprendedor único: Arranque de Marca $873k · Presencia Express $1.32M
- Mensual: Semilla $654k/mes · Despegue $918k/mes · Escala $1.456M/mes
- Corporativo: Marca 360 $4.63M · Retainer $2.0M/mes (12 meses)

**Esquema.** Campos nuevos en `Package` (`billing`, `audience`, `monthlyPrice`, `tierStep`, `commitmentMonths`, `perksEs/En`), todos con default → migración aditiva segura por `db push`. `PackageType` (starter/pro/enterprise) se conserva y se mapea desde la audiencia.

**Pendiente.** Aplicar a Neon con `prisma db push && prisma db seed` (el `.env` local tiene host placeholder). Las páginas legacy de catálogo (`/planes`, PackagesSection) siguen hardcodeadas con precios viejos; se reemplazan cuando la ciudad absorba la conversión (Fase 3), no las sincronizo ahora.

---

### D-12 — Ayuntamiento: reusar la máquina y el motor, cambiar solo la piel
**Fecha:** 2026-07-24 · **Estado:** decidida

**Contexto.** Fase 3 pedía el cotizador de 6 pasos "reformulado como conversación guiada, no formulario", con la matriz diagnóstica alimentando la recomendación.

**Decisión.**
1. **Se reusa `useQuoterStore` y `calculateQuote` tal cual** (mandato del brief: reusar, no reinventar). Lo nuevo es la piel (`AyuntamientoFlow`) y la recomendación.
2. **Flujo de 6 pasos:** quién → distritos → servicios → urgencia → resultado → contacto. El precio aparece por primera y única vez en el paso 5 (regla 2, verificado: cero fuga en pasos previos).
3. **La recomendación** (`suggestPlan`) sale del catálogo D-11: el paquete/plan que más servicios elegidos cubre, filtrado por tipo de cliente; empates los gana el más barato — la escalera empieza por el paso alcanzable, no por el techo. Mínimo 2 servicios cubiertos para no recomendar por ruido.
4. **El catálogo cliente importa `prisma/seed-data` directamente** (objetos planos, una sola fuente de verdad, verificada por check:city). Cuando la BD esté viva, se puede hidratar desde `/api/v1/services` sin cambiar la superficie.
5. **Propuesta navegable:** el cierre re-usa la metáfora de ciudad (distritos visitados con sus servicios) + referencia de lead + WhatsApp. La versión rica (propuesta como mini-mundo explorable) queda para Fase 4/post-lanzamiento.
6. El panel legacy del cotizador (QuoterPanel flotante) sigue intacto en las rutas viejas; se retira cuando la ciudad reemplace la home.

**De paso.** `POST /api/v1/leads` hacía `lead.create` con campos inexistentes en el modelo (`totalEstimate`, `currency`) — habría lanzado con BD real. Mapeado a `budget`/`services` y guardado condicionado a tener name+email (el modelo los exige).

---

### D-13 — La ciudad es la home (Fase 4)
**Fecha:** 2026-07-24 · **Estado:** decidida

**Contexto.** El informe manda que "la ciudad reemplaza `/` una vez que los 8 distritos tengan contenido" (Fase 2/4). Ya lo tienen (17 casos).

**Decisión.**
1. `/` renderiza el hub (`CityHub`, componente compartido). Está fuera del route group `(main)`, así que usa solo el layout raíz: sin Header/Footer legacy.
2. La home legacy (`(main)/page.tsx` → HomeClient) se elimina. HomeClient queda huérfano pero se conserva por si se reusan secciones.
3. `/ciudad` redirige permanente a `/` (consolidación SEO, sin contenido duplicado). Los distritos siguen en `/ciudad/[distrito]`.
4. La navegación tradicional la cubre el **CityMenu** (vía de escape del informe). Las páginas legacy (`/nosotros`, `/contacto`, etc.) siguen accesibles desde ahí.
5. Sitemap reescrito sobre la nueva IA: home + Ayuntamiento + 8 distritos + 17 casos + nosotros/contacto.

**Pendiente / deuda conocida.**
- Las páginas legacy de catálogo con precios viejos hardcodeados (`/planes`/PlanesTabs, PackagesSection) siguen existiendo y **contradicen el modelo D-11**. Ya no están enlazadas desde la home, pero `/planes` es alcanzable por URL. Retirarlas o reescribirlas queda como siguiente paso.
- El Header legacy (en las páginas `(main)`) enlaza a anclas `/#planes` que ya no existen en `/`; inofensivo pero conviene limpiarlo al retirar el chrome legacy.

---

### D-07 — Se trabaja en rama, no en `master`
**Fecha:** 2026-07-21 · **Estado:** decidida

**Contexto.** El repo está en `master` con `package.json` y `package-lock.json` modificados sin commitear y `anillo_3d/` sin trackear.

**Decisión.** Todo el rediseño va en `redesign/ciudad-del-pato`, con una rama por fase. Antes de arrancar hay que resolver el estado sucio actual — **no lo toco sin tu indicación**, porque no sé si `anillo_3d/` es trabajo tuyo en curso.
