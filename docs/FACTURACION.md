# Facturación y control de cobros en LQS

Fecha: 11 de agosto de 2026.
Qué es esto: una investigación y un plan. **No se construyó nada todavía.**

---

## 1. Qué hay hoy: nada

Lo buscamos antes de proponer. El resultado es corto y conviene decirlo sin
rodeos: **en LQS no existe ningún sistema de facturación ni de cobros.**

Lo que se revisó y lo que apareció:

| Dónde se buscó | Qué se encontró |
| --- | --- |
| Todo el repo (`factura`, `cobro`, `recibo`, `invoice`, `billing`, `DIAN`, `NIT`) | Solo **texto**: condiciones de pago en `legal.html` y en las fichas de `mundos/`. Ninguna función, ninguna pantalla, ningún dato. |
| Las 10 tablas de Supabase (`blzzzklljdvsyudlrvbt`) | `universos`, `paquetes`, `perfiles`, `solicitudes`, `proyectos`, `hitos`, `citas`, `suscriptores`, `eventos`, `lqs_registros`. **Ninguna tabla de facturas, cobros ni pagos.** |
| El portal del cliente (`cargarPortal`, `index.html`) | Muestra «Valor» y «Pagado» de cada proyecto. Nada más. |

**Lo más parecido que existe** —y probablemente lo que recuerdas— son dos
columnas en la tabla `proyectos`:

- `precio_cop` — cuánto vale el proyecto.
- `pagado_cop` — cuánto se ha pagado, **como un solo número acumulado**.

Eso no es un sistema de cobros. Es un marcador. No sabe **cuándo** se pagó, ni
**por qué medio**, ni **cuánto falta**, ni **desde cuándo está vencido**, ni deja
rastro de un abono si alguien lo edita. Si hoy escribes `pagado_cop = 500000`, no
queda registro de si fueron dos abonos o uno, ni de qué día. Sirve como punto de
partida, pero hay que reemplazarlo, no ampliarlo.

Un detalle que bloquea todo lo legal: **`legal.html` tiene el NIT en «POR
COMPLETAR»** (línea 101). Sin NIT no hay factura de ninguna clase.

---

## 2. La facturación electrónica en Colombia

### Advertencia sobre las fuentes

**El sandbox donde se hizo esta investigación bloquea la lectura directa de
todos los dominios consultados** — `dian.gov.co`, `micrositios.dian.gov.co`,
`normograma.dian.gov.co`, `gerencie.com`, `siemprealdia.co`, `incp.org.co`. Se
pudo buscar y leer los resúmenes de resultados, pero **no se pudo abrir ni una
sola fuente oficial para verificarla palabra por palabra.** Todo lo de abajo está
al nivel de «resultado de búsqueda», no de «norma leída». Antes de tomar
cualquier decisión de plata, **confírmalo con un contador o en el portal de la
DIAN directamente.**

### Qué exige la DIAN

El marco vigente es la **Resolución 000165 de 2023**, que rige desde el 1 de
noviembre de 2023 y reemplazó el esquema anterior. Define la habilitación, la
numeración, la transmisión y validación de los documentos electrónicos, y el
anexo técnico de la factura electrónica de venta (versión 1.9).

El circuito, en corto: te **habilitas** en el portal de la DIAN → pides una
**resolución de numeración** → emites la factura → se **transmite a la DIAN para
validación** → validada, se le entrega al cliente. Una factura sin validar no
existe fiscalmente.

### ¿Está obligado un estudio pequeño?

Depende de tu RUT, y **no lo puedo determinar desde aquí** porque no sé cómo está
constituida LQS ni qué responsabilidades tiene inscritas.

La regla general para **personas naturales** en 2026:

- Obligadas si los ingresos brutos anuales superan **3.500 UVT**.
- La UVT 2026 es de **$52.374** (Resolución DIAN 000238 del 15 de diciembre de
  2025), así que el tope está en unos **$183.309.000 al año**.

Pero hay causales que obligan **sin importar cuánto factures**:

- Ser **responsable de IVA** (código 11 en el RUT).
- Estar en el **Régimen Simple de Tributación (SIMPLE)**.
- Tener más de un establecimiento de comercio, u operar bajo franquicia.

Y si LQS está constituida como **sociedad** (SAS o similar), la obligación es
directa: las personas jurídicas facturan electrónicamente, punto.

> **Lo que esto significa para ti, en la práctica:** los servicios creativos
> —diseño, publicidad, producción audiovisual— son servicios **gravados con
> IVA** en el caso general. Si en algún momento pasas el tope y quedas como
> responsable de IVA, la obligación de facturar electrónicamente entra contigo.
> Si hoy estás por debajo y como no responsable, es posible que no estés
> obligado. **Cuál de los dos casos es el tuyo lo resuelve un contador mirando
> tu RUT, no este documento.**

### Qué es un proveedor tecnológico autorizado

Un **proveedor tecnológico (PT)** es una empresa autorizada por la DIAN para
generar, transmitir y validar los documentos electrónicos por ti. Hay más de 80
habilitados en Colombia (Alegra, Siigo, Factus, Gosocket y otros).

No es obligatorio usar uno. Tienes tres caminos:

| Camino | Qué es | Para quién |
| --- | --- | --- |
| **Facturación gratuita DIAN** | El software propio de la DIAN. Gratis, y con él puedes pedir el certificado de firma digital **sin costo**. Se opera a mano desde el navegador. | Volumen bajo (menos de ~50–100 facturas al mes). **Este es el caso de LQS hoy.** |
| **Proveedor tecnológico** | Plataforma de un tercero, con API para integrar. | Cuando el volumen o la integración contable lo justifican. |
| **Software propio habilitado** | Tú desarrollas y te habilitas como facturador con software propio. | Costoso de mantener y de certificar. **No lo recomiendo para LQS.** |

### La resolución de numeración

Es la autorización de un **rango de números** de factura. Se pide en el portal de
la DIAN (menú *Numeración de facturación* → *Autorizar rangos* → tipo *Factura
electrónica de venta*), se firma con la firma electrónica y la autorización es
casi inmediata. Genera el **formato 1876**, que trae el número de resolución, el
prefijo, el rango y las fechas de vigencia.

**Vigencia: máximo 2 años.** Si se te vence o se te agota el rango, dejas de
poder facturar hasta renovarlo. Es un vencimiento que hay que tener en el
calendario.

### Cuánto cuesta

| Opción | Costo |
| --- | --- |
| Facturación gratuita DIAN | **$0**, y el certificado de firma digital también sale gratis por ese camino |
| Alegra · solo facturación electrónica | desde **$17.900/mes**, hasta ~$179.900/mes según el plan |
| Alegra · con contabilidad | desde ~**$69.900/mes** |
| Siigo | del orden de **$140.000 a $208.000/mes**, normalmente en plan anual |
| Contador | aparte, y es el gasto que de verdad importa |

Cifras de comparativas comerciales de 2026, no de tarifarios oficiales; **los
precios de software cambian seguido y hay que confirmarlos.**

---

## 3. El plan por fases

La idea que manda: **primero resuelve saber quién te debe qué.** Eso es lo que
duele hoy y no necesita permiso de nadie. La factura electrónica ante la DIAN es
una fase posterior, y cuando llegue conviene que llegue apoyada en datos que ya
estén ordenados.

Las horas van a **$30.000/hora** (tarifa de ejecución de `docs/PRECIOS.md`).
Son horas de construcción, no precio de venta.

### Fase 1 · Control interno de cobros — 24 h (~$720.000)

Sin DIAN, sin PDF, sin nada legal. Solo saber en qué va la plata.

**Tablas nuevas en Supabase:**

- **`cobros`** — cada cosa que hay que cobrar.
  `id`, `proyecto_id` → `proyectos`, `cliente_id` → `auth.users`, `concepto`,
  `monto_cop`, `tipo` (`anticipo` · `contra_entrega` · `mensualidad` · `extra`),
  `estado` (`borrador` · `enviado` · `vencido` · `pagado` · `anulado`),
  `emitido_en`, `vence_en`, `notas`, `creado_en`.

- **`pagos`** — cada abono real que entra. Un cobro puede tener varios.
  `id`, `cobro_id` → `cobros`, `monto_cop`, `medio` (`transferencia` · `nequi` ·
  `daviplata` · `pse` · `efectivo` · `tarjeta`), `referencia`, `pagado_en`,
  `comprobante_url`, `creado_en`.

- **Una vista `v_saldos`** que calcule cobrado, pagado y saldo por proyecto y por
  cliente. Así `proyectos.pagado_cop` **deja de escribirse a mano** y pasa a ser
  un resultado, no un dato que alguien puede desincronizar.

**RLS obligatorio, y no es un detalle:** un cliente solo puede leer sus propios
cobros y pagos; solo `rol = 'admin'` escribe. Si esto queda mal, un cliente ve lo
que le cobras a otro.

**Pantallas:**

- Panel de admin dentro de la vista `cuenta`: **quién debe qué**, ordenado por lo
  más vencido; total por cobrar; total del mes; y el botón de registrar un abono.
- En el portal del cliente: sus cobros, qué pagó y qué le falta. Reemplaza el
  «Pagado: $X» suelto que hay hoy.

**Qué necesita LQS de su lado:** nada. Esta fase se puede hacer ya.

### Fase 2 · Cuenta de cobro en PDF — 12 h (~$360.000)

Un documento presentable para mandarle al cliente. **Una cuenta de cobro no es
una factura** y no reemplaza la obligación fiscal si existe — es un soporte
comercial mientras tanto.

- Plantilla imprimible (HTML con CSS de impresión, sin librerías externas —
  el sitio no carga CDNs, y esa regla se mantiene).
- Numeración interna propia, separada de cualquier numeración DIAN.
- Datos de LQS en el encabezado.

**Qué necesita LQS de su lado:** razón social, **NIT**, dirección y teléfono. Son
exactamente los mismos datos que hoy están en «POR COMPLETAR» en `legal.html`, así
que esta fase cierra las dos cosas de una.

### Fase 3 · Factura electrónica ante la DIAN — depende del camino

Solo cuando un contador confirme que hay obligación, o cuando un cliente empresa
te exija factura (que suele ser el disparador real).

**3a · Arrancar por el portal gratuito de la DIAN — 0 h de código.**
Se emite a mano. Cero costo, cero desarrollo, cero riesgo técnico. Para el
volumen actual de LQS es lo sensato. El trabajo aquí es de trámite, no de
programación.

**3b · Integrar un proveedor tecnológico — 30 a 40 h (~$900.000 a $1.200.000)
más la mensualidad.**
Cuando emitir a mano ya cueste más que pagar la integración. Implica conectar la
API del PT, mapear los cobros de la Fase 1 a facturas, guardar el CUFE y el
estado de validación, y manejar los rechazos de la DIAN (que los hay). Se hace
sobre la Fase 1; por eso la Fase 1 va primero.

**Qué necesita LQS de su lado, y sin esto no arranca:**

1. **NIT** y **RUT actualizado**, con la actividad económica correcta y las
   responsabilidades bien inscritas.
2. **Firma electrónica** (gratis por el camino de la facturación gratuita DIAN).
3. **Habilitación** como facturador electrónico en el portal de la DIAN.
4. **Resolución de numeración** vigente, con su prefijo y su rango. Recuerda:
   **caduca a los 2 años.**
5. **Un contador.** Ver punto 4.

### Resumen

| Fase | Qué resuelve | Horas | Bloqueado por |
| --- | --- | ---: | --- |
| 1 · Control interno de cobros | Quién debe qué, qué se cobró, qué falta | 24 h | nada |
| 2 · Cuenta de cobro en PDF | Un documento para mandar | 12 h | NIT y razón social |
| 3a · Portal gratuito DIAN | Cumplir, a mano | 0 h | RUT, firma, resolución, contador |
| 3b · Integrar un PT | Cumplir, automático | 30–40 h | que la Fase 1 exista |

---

## 4. Lo que no se arregla con código

Hay que decirlo claro porque es la parte que más caro sale si se ignora:

- **Si LQS está obligada o no a facturar electrónicamente, no lo define este
  documento ni lo define el sitio.** Lo define tu RUT y tu nivel de ingresos, y
  quien lo lee es un contador.
- **Si debes cobrar IVA, a qué tarifa, y si aplica retención en la fuente o
  ReteICA de Medellín** — eso es criterio tributario. Programar mal un IVA no es
  un bug: es una declaración mal presentada.
- **Facturar por fuera del plazo, o con la resolución vencida, tiene sanción.**
  El código puede recordarte la fecha; no puede responder por ti.
- **Nada de lo de arriba se pudo verificar contra una fuente oficial abierta**,
  porque el proxy del entorno las bloquea todas. Trátalo como un punto de
  partida bien investigado, no como asesoría.

**La recomendación honesta:** haz la Fase 1 ya, que no depende de nadie y
resuelve el dolor real. Antes de la Fase 3, paga una hora de contador. Es la
hora más barata de todo este plan.

---

## Fuentes

Todas consultadas por búsqueda web el 11 de agosto de 2026. **Ninguna se pudo
abrir directamente** — el proxy del entorno bloquea los dominios.

- [DIAN · Facturación gratuita](https://www.dian.gov.co/impuestos/factura-electronica/facturacion-gratuita/Paginas/default.aspx) *(bloqueada)*
- [DIAN · Cómo puedes facturar electrónicamente](https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/como-puedes-facturar-electronicamente/) *(bloqueada)*
- [DIAN · Numeración y habilitación](https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/numeracion-habilitacion/) *(bloqueada)*
- [DIAN · Resolución 165 de 2023, texto compilado](https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0165_2023.htm) *(bloqueada)*
- [DIAN · Documento soporte en adquisiciones a no obligados](https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/documento-soporte-adquisiciones-no-obligados/) *(bloqueada)*
- [INCP · UVT 2026 fijada en $52.374](https://incp.org.co/publicaciones/infoincp-publicaciones/impuestos/2025/11/dian-fijaria-en-52-374-el-valor-de-la-uvt-para-2026/) *(bloqueada)*
- [Siempre al día · Guía de facturación electrónica 2026](https://siemprealdia.co/colombia/impuestos/sistema-de-facturacion-electronica/) *(bloqueada)*
- [Gerencie · Resolución de facturación](https://www.gerencie.com/resolucion-de-facturacion.html) *(bloqueada)*
- [El País · Personas naturales obligadas a facturar en 2026](https://www.elpais.com.co/economia/la-dian-revelo-cuales-son-las-personas-naturales-que-deben-facturar-electronicamente-en-2026-este-es-el-tope-1153.html)
- [Saphety · Topes DIAN 2026](https://saphety.co/blog/dian-2026-topes-para-facturar-electronicamente/)
- [Alegra · Precios de facturación electrónica](https://www.alegra.com/colombia/facturacion-electronica/)
- [Programas de contabilidad · Precios de software contable 2026](https://programascontabilidad.com/comparativas-de-software/precios-de-software-contable-colombia-2026/)
