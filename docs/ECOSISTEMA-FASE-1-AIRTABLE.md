# Fase 1 · Arquitectura de datos en Airtable

Estructura para crear ahora mismo. Una base, diez tablas.

**Nombre de la base:** `LQS · Operación`

---

## Antes de crear nada: la frontera con Supabase

LQS ya tiene Supabase en producción alimentando el sitio web. Si Airtable
duplica lo que ya está allá, en tres semanas tendrás dos verdades distintas y
ninguna confiable.

La regla que sigue este diseño:

| Vive en **Supabase** | Vive en **Airtable** |
| --- | --- |
| Lo que el **cliente** ve o toca: solicitudes del formulario, catálogo público de paquetes, seguimiento de proyecto, citas agendadas desde la web | Lo que solo ve **el equipo**: inventario físico, préstamos de equipo, costos internos, agenda de producción, cotizaciones en borrador, SG-SST |

**Los tres puntos donde se tocan, y cómo se resuelven:**

1. **Proyectos.** Supabase tiene `proyectos` porque el cliente ve su avance en
   el sitio. Airtable tiene `Proyectos` porque el equipo necesita costos,
   equipo asignado y rentabilidad — cosas que el cliente nunca debe ver.
   **Se enlazan por un campo `id_supabase`**, no se duplican. Make.com escribe
   en los dos: lo público allá, lo interno acá.
2. **Tarifario.** `paquetes` en Supabase es el **precio de venta** que se
   publica. `Tarifario` en Airtable guarda además el **piso de costo** y las
   horas — eso jamás sale del equipo. Ya está calculado en `docs/PRECIOS.md`.
3. **Clientes.** Supabase tiene `perfiles` para quien se registra en el sitio.
   Airtable tiene `Clientes` para todos, incluidos los que llegaron por
   WhatsApp y nunca tocaron la web. Se enlazan con `id_supabase` cuando existe.

---

## Tabla 1 · `Áreas`

La columna vertebral. Casi todo enlaza aquí. Créala primero.

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Área` | Single line text | *Campo primario.* Empresas, Express, Productora, Creadores, Ropa y merch, Automatización, Restaurantes, Hoteles, Joyería |
| `Clave` | Single line text | `empresas`, `express`… Debe coincidir con `FICHAS` del sitio |
| `Familia` | Single select | Marca · Presencia · Producción |
| `Color` | Single line text | El hex del área. Ej. `#5b8def` |
| `Canal Discord` | Single line text | `#cotizaciones-foto`, `#cotizaciones-diseño`, `#web-dev` |
| `Activa` | Checkbox | Restaurantes y Hoteles van sin marcar por ahora |

**Nueve registros.** Los colores están en `index.html`, constante `FICHAS`.

---

## Tabla 2 · `Personas`

Quién trabaja en qué. Necesaria para asignar equipos y para SG-SST.

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Nombre` | Single line text | *Primario* |
| `Rol` | Single select | Dirección · Diseño · Audiovisual · Desarrollo · Producción |
| `Áreas` | Link to `Áreas` | Permitir varios |
| `Discord ID` | Single line text | El ID numérico, no el nombre de usuario. **Con esto el bot sabe quién ejecutó el comando** |
| `Correo` | Email | |
| `Teléfono` | Phone | |
| `Tipo de vínculo` | Single select | Socio · Empleado · Contratista · Freelance |
| `Documento` | Single line text | Cédula. Requerido para SG-SST |
| `EPS` | Single line text | SG-SST |
| `ARL` | Single line text | SG-SST |
| `Activa` | Checkbox | |

> **Discord ID:** en Discord activa *Configuración → Avanzado → Modo
> desarrollador*, luego clic derecho sobre la persona → *Copiar ID*.

---

## Tabla 3 · `Clientes`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Cliente` | Single line text | *Primario.* Nombre comercial |
| `Razón social` | Single line text | Para facturar |
| `NIT o cédula` | Single line text | |
| `Contacto` | Single line text | Nombre de la persona |
| `WhatsApp` | Phone | |
| `Correo` | Email | |
| `Ciudad` | Single line text | |
| `Cómo llegó` | Single select | Formulario web · WhatsApp · Referido · Frío · Redes |
| `Estado` | Single select | Prospecto · Cotizado · Activo · Cerrado · Perdido |
| `id_supabase` | Single line text | UUID de `perfiles` si se registró en el sitio. Vacío si no |
| `Notas` | Long text | |
| `Creado` | Created time | |

---

## Tabla 4 · `Equipos`

El inventario físico. Cámaras, lentes, luces, trípodes, computadores.

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Equipo` | Single line text | *Primario.* Ej. «Canon R6 · cuerpo» |
| `Código` | Autonumber | |
| `Etiqueta` | Formula | `"EQ-" & RIGHT("000" & {Código}, 4)` → `EQ-0007`. **Esta es la que pegas físicamente en el equipo** |
| `Categoría` | Single select | Cámara · Lente · Iluminación · Audio · Soporte · Cómputo · Accesorio |
| `Marca` | Single line text | |
| `Serial` | Single line text | Para el seguro y para reclamar si se pierde |
| `Estado` | Single select | Disponible · Prestado · En mantenimiento · Dañado · De baja |
| `Condición` | Single select | Nuevo · Bueno · Con detalles · Delicado |
| `Valor de compra` | Currency (COP, 0 decimales) | |
| `Fecha de compra` | Date | |
| `Áreas` | Link to `Áreas` | Qué áreas lo usan |
| `Responsable` | Link to `Personas` | Quién responde por él |
| `Foto` | Attachment | Foto real, para reclamos y para el seguro |
| `Préstamos` | Link to `Préstamos` | Se crea sola al hacer la Tabla 5 |
| `Notas` | Long text | Golpes, manías, qué accesorio le falta |

> **Por qué `Estado` y `Condición` van separados:** *Estado* dice dónde está
> ahora; *Condición* dice en qué estado físico se encuentra. Un lente puede
> estar Disponible y Con detalles al mismo tiempo. Mezclarlos te obliga a
> elegir cuál pierdes.

---

## Tabla 5 · `Préstamos`

Quién se llevó qué, cuándo, y si volvió. Esta tabla es la que evita que un
lente desaparezca sin que nadie sepa cuándo.

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Préstamo` | Formula | `{Equipo} & " → " & {Persona} & " · " & DATETIME_FORMAT({Sale}, "DD/MM")`. *Primario* |
| `Equipo` | Link to `Equipos` | Solo uno |
| `Persona` | Link to `Personas` | Quién se lo lleva |
| `Proyecto` | Link to `Proyectos` | Para qué. Opcional |
| `Sale` | Date with time | |
| `Vuelve (previsto)` | Date | |
| `Volvió` | Date | Vacío = sigue afuera |
| `Estado al salir` | Single select | Nuevo · Bueno · Con detalles · Delicado |
| `Estado al volver` | Single select | Igual, más *No volvió* |
| `Días fuera` | Formula | `IF({Volvió}, DATETIME_DIFF({Volvió}, {Sale}, 'days'), DATETIME_DIFF(TODAY(), {Sale}, 'days'))` |
| `Atrasado` | Formula | `IF(AND(NOT({Volvió}), IS_AFTER(TODAY(), {Vuelve (previsto)})), "⚠ ATRASADO", "")` |
| `Observaciones` | Long text | |

**Vista que debes crear aquí:** filtra `Volvió` está vacío, ordena por
`Vuelve (previsto)` ascendente. Llámala **«Afuera ahora»**. Esa es la vista que
Make.com consulta para avisar en Discord los lunes.

---

## Tabla 6 · `Tarifario`

Los precios de venta **y el piso de costo**. Lo segundo nunca sale del equipo.

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Servicio` | Single line text | *Primario.* Ej. «Foto de plato · suelta» |
| `Área` | Link to `Áreas` | |
| `Unidad` | Single select | Unidad · Hora · Día · Paquete · Proyecto · Mes |
| `Precio de venta` | Currency (COP) | Lo que se cobra |
| `Horas estimadas` | Number (1 decimal) | |
| `Costo duro` | Currency (COP) | Insumos, transporte, licencias |
| `Piso` | Formula | `{Horas estimadas} * 30000 + {Costo duro}`. Tarifa de ejecución $30.000/h |
| `Margen` | Formula | `IF({Piso} > 0, ROUND(({Precio de venta} - {Piso}) / {Piso} * 100, 0) & "%", "—")` |
| `Alerta` | Formula | `IF({Precio de venta} < {Piso}, "🔴 BAJO EL PISO", "")` |
| `Es combo` | Checkbox | |
| `Compuesto por` | Link to `Tarifario` | Solo si es combo. Permite varios |
| `Activo` | Checkbox | |
| `id_supabase` | Single line text | ID en `paquetes` si es público |
| `Notas` | Long text | |

**Los datos ya existen:** `docs/PRECIOS.md` tiene las ~50 líneas con horas,
costo, piso, precio y margen calculados. Cárgalas desde ahí, no las inventes.

> **La regla dura que este campo `Alerta` protege:** ningún combo puede costar
> más que la suma de sus partes, y ningún precio puede quedar bajo el piso.
> Ya nos pasó dos veces antes de tener esta tabla.

---

## Tabla 7 · `Cotizaciones`

La cabecera. Lo que el bot de Discord crea con `/cotizar`.

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Número` | Autonumber | |
| `Cotización` | Formula | `"COT-" & DATETIME_FORMAT(CREATED_TIME(), "YY") & "-" & RIGHT("000" & {Número}, 4)` → `COT-26-0042`. *Primario* |
| `Cliente` | Link to `Clientes` | |
| `Área` | Link to `Áreas` | |
| `Líneas` | Link to `Líneas` | Se crea sola con la Tabla 8 |
| `Subtotal` | Rollup | Sobre `Líneas` → campo `Total línea` → `SUM(values)` |
| `Descuento` | Currency (COP) | |
| `Total` | Formula | `{Subtotal} - {Descuento}` |
| `Estado` | Single select | Borrador · Enviada · En revisión · Aprobada · Rechazada · Vencida |
| `Vigencia` | Number (entero) | Días. Por defecto 30 |
| `Vence` | Formula | `DATEADD(CREATED_TIME(), {Vigencia}, 'days')` |
| `Creada por` | Link to `Personas` | El bot la llena con el Discord ID |
| `Canal Discord` | Single line text | De dónde salió |
| `Mensaje Discord` | URL | Enlace al mensaje. **Para volver a la conversación desde Airtable** |
| `PDF` | Attachment | Lo sube Make.com |
| `Enlace PDF` | URL | |
| `Proyecto` | Link to `Proyectos` | Se llena si la aprueban |
| `Notas` | Long text | |
| `Creada` | Created time | |

---

## Tabla 8 · `Líneas`

Cada renglón de una cotización. **Aquí está la decisión más importante del
esquema entero.**

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Línea` | Formula | `{Nombre congelado} & " ×" & {Cantidad}`. *Primario* |
| `Cotización` | Link to `Cotizaciones` | |
| `Servicio` | Link to `Tarifario` | Solo referencia |
| `Nombre congelado` | Single line text | **Copia del nombre al cotizar** |
| `Precio congelado` | Currency (COP) | **Copia del precio al cotizar** |
| `Cantidad` | Number (1 decimal) | Decimal para media libra, media jornada |
| `Total línea` | Formula | `{Precio congelado} * {Cantidad}` |
| `Descripción` | Long text | |

> **Por qué «congelado» y no un lookup al Tarifario:** si el precio se lee del
> Tarifario en vivo, el día que subas la foto de plato de $22.000 a $25.000
> **se reescriben todas las cotizaciones del año pasado**. Una cotización
> enviada es un documento histórico: dice lo que dijo el día que se envió.
> El enlace a `Servicio` se queda solo para saber de dónde salió.

Make.com copia `Nombre` y `Precio de venta` del Tarifario a estos dos campos en
el momento de crear la línea. **No uses Lookup aquí.**

---

## Tabla 9 · `Proyectos`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Número` | Autonumber | |
| `Proyecto` | Formula | `"PRY-" & RIGHT("000" & {Número}, 4) & " · " & {Nombre}`. *Primario* |
| `Nombre` | Single line text | |
| `Cliente` | Link to `Clientes` | |
| `Áreas` | Link to `Áreas` | Permitir varias |
| `Cotización` | Link to `Cotizaciones` | De dónde salió |
| `Estado` | Single select | Por arrancar · En curso · En revisión del cliente · Entregado · Pausado · Cancelado |
| `Inicio` | Date | |
| `Entrega comprometida` | Date | |
| `Entrega real` | Date | |
| `Equipo asignado` | Link to `Personas` | Varias |
| `Valor` | Currency (COP) | |
| `Cobrado` | Currency (COP) | |
| `Saldo` | Formula | `{Valor} - {Cobrado}` |
| `Horas presupuestadas` | Number (1 decimal) | |
| `Horas reales` | Rollup | Sobre `Agenda` → `Horas` → `SUM(values)` |
| `Desvío` | Formula | `IF({Horas presupuestadas} > 0, ROUND(({Horas reales} - {Horas presupuestadas}) / {Horas presupuestadas} * 100, 0) & "%", "—")` |
| `Agenda` | Link to `Agenda` | Se crea sola |
| `Préstamos` | Link to `Préstamos` | Se crea sola |
| `Carpeta` | URL | Drive o donde vivan los archivos |
| `Repo` | URL | Si tiene código |
| `id_supabase` | Single line text | UUID en `proyectos` de Supabase |
| `Notas` | Long text | |

> **`Desvío` es el campo que más te va a servir.** Te dice, proyecto por
> proyecto, si cobraste bien. Después de cinco proyectos tienes datos reales
> para ajustar el Tarifario en vez de estimar.

---

## Tabla 10 · `Agenda`

Calendario por áreas. Una tabla, muchas vistas.

| Campo | Tipo | Notas |
| --- | --- | --- |
| `Bloque` | Formula | `{Título} & " · " & DATETIME_FORMAT({Inicio}, "DD/MM HH:mm")`. *Primario* |
| `Título` | Single line text | |
| `Tipo` | Single select | Rodaje · Reunión · Producción · Entrega · Mantenimiento · Personal |
| `Área` | Link to `Áreas` | |
| `Proyecto` | Link to `Proyectos` | |
| `Personas` | Link to `Personas` | Varias |
| `Inicio` | Date with time | |
| `Fin` | Date with time | |
| `Horas` | Formula | `DATETIME_DIFF({Fin}, {Inicio}, 'minutes') / 60` |
| `Lugar` | Single line text | |
| `Estado` | Single select | Programado · Confirmado · En curso · Hecho · Cancelado |
| `Equipos requeridos` | Link to `Equipos` | Varios |
| `Notas` | Long text | |

**Las vistas son lo que resuelve «calendarios separados por áreas»:**

| Vista | Tipo | Configuración |
| --- | --- | --- |
| Calendario general | Calendar | Sobre `Inicio` |
| Foto y video | Calendar | Filtro: `Área` es Productora o Creadores |
| Diseño | Calendar | Filtro: `Área` es Express o Empresas |
| Desarrollo | Calendar | Filtro: `Área` es Automatización |
| Mi semana | Calendar | Filtro: `Personas` contiene *(cada quien la suya)* |
| Esta semana | Grid | Filtro: `Inicio` está dentro de los próximos 7 días |

> **Una tabla con vistas, no una tabla por área.** Si haces una tabla por área,
> el día que un proyecto cruce dos áreas —que es siempre— vas a duplicar
> registros y ninguna vista te dará el total real de horas.

---

## Orden para crearlas

Los enlaces solo funcionan si la tabla destino ya existe:

**1.** `Áreas` → **2.** `Personas` → **3.** `Clientes` → **4.** `Equipos` →
**5.** `Tarifario` → **6.** `Proyectos` → **7.** `Cotizaciones` →
**8.** `Líneas` → **9.** `Préstamos` → **10.** `Agenda`

Airtable crea el campo recíproco solo. Si al enlazar `Préstamos → Proyectos` te
aparece un campo `Préstamos` en Proyectos, es correcto.

---

## Dos límites del plan gratuito que vas a tocar

- **1.000 registros por base.** Con inventario, clientes, cotizaciones, líneas
  y agenda, llegas en unos seis a ocho meses de operación normal. El plan Team
  cuesta unos **20 USD por usuario al mes** y sube a 50.000 registros.
- **1 GB de adjuntos.** Las fotos de equipo y los PDF lo consumen. Guarda los
  PDF en Drive y en Airtable solo el enlace — el campo `Enlace PDF` ya está
  para eso.

---

## Lo que necesito saber antes de la Fase 2

Cuatro cosas que cambian el código del bot:

1. **¿Cuántas personas hay en el equipo?** Si son dos o tres, varias tablas
   sobran y el bot se simplifica mucho. Si son ocho, los permisos importan.
2. **¿El SG-SST es por empleados propios o por contratistas?** Cambia qué
   documentos hay que generar y qué campos son obligatorios en `Personas`.
3. **¿Dónde viven hoy los archivos de los proyectos?** Drive, Dropbox, disco
   local. Los PDF de Make.com tienen que ir a algún lado.
4. **¿Ya tienes cuenta de Make.com y de qué plan?** El gratuito son 1.000
   operaciones al mes; una cotización con PDF gasta entre 5 y 8. Eso da unas
   120 cotizaciones mensuales, que probablemente alcance — pero conviene
   saberlo antes de diseñar los escenarios.
