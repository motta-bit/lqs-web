# Dónde viven los datos y qué tan seguros están

Fecha del levantamiento: **11 de agosto de 2026**
Proyecto Supabase: **`lqs`** · ref `blzzzklljdvsyudlrvbt`

---

## ⚠ LO PRIMERO: la auditoría de seguridad NO se pudo correr

Te lo digo sin adornos porque es lo que más te importaba y es justo lo que falló.

**La base de datos de LQS no aceptó ninguna conexión durante todo este levantamiento.**
Lo intenté nueve veces a lo largo de aproximadamente una hora, con dos usuarios
distintos, y siempre falló:

```
get_advisors  → "Project 39602163 is currently hibernated and will wake on next supported request"
list_tables   → FATAL: 28P01: password authentication failed for user "supabase_read_only_user"
list_extensions → FATAL: 28P01: password authentication failed for user "supabase_read_only_user"
list_migrations → FATAL: 28P01: password authentication failed for user "postgres"
execute_sql   → FATAL: 28P01: password authentication failed for user "postgres"
```

También intenté despertarlo por fuera, llamando directamente a la API REST del
proyecto con la clave publicable. Eso tampoco sirvió, pero por otra razón: **el proxy
de este entorno bloquea `supabase.co`** (`CONNECT tunnel failed, response 403`).

O sea: **no corrí `get_advisors`. No tengo ni un solo hallazgo de seguridad real que
reportarte, ni con severidad ni sin ella.** No hay tabla de findings en este documento
porque no la pude generar. Prefiero que te quede claro eso a llenarte una página de
recomendaciones genéricas disfrazadas de auditoría.

Lo que sí puedo darte, verificado, es todo lo que vive fuera de la base de datos: la
región física, las claves, y qué datos personales manda el sitio y a qué tablas.

### Qué falta hacer, y es corto

Cuando el proyecto despierte —basta con entrar al panel de Supabase, eso lo
reactiva— hay que correr esto y traer el resultado:

1. `get_advisors` tipo **security** ← el crítico, es el que dice qué tablas están sin RLS
2. `get_advisors` tipo **performance**
3. `list_tables` con `verbose: true` ← columnas reales y estado de RLS por tabla
4. `list_extensions`
5. Un `select` sobre `pg_policies` para ver las políticas RLS una por una

Hasta que eso no se corra, **nadie puede afirmar que la base de LQS está segura.**
Yo desde luego no lo voy a afirmar.

### Por qué esto importa más de lo que parece

El proyecto estaba **hibernado**. Supabase hiberna los proyectos del plan gratuito
por inactividad. Dos cosas se siguen de ahí:

- **El sitio publicado está caído en su parte de datos.** Si `index.html` está en
  línea y alguien llena el formulario de cotización, el `POST` a `/rest/v1/solicitudes`
  no llega a ninguna parte. **Puedes estar perdiendo solicitudes de clientes ahora
  mismo.** No lo pude comprobar (el proxy bloquea el dominio), pero es lo que la
  hibernación implica.
- **Un proyecto hibernado que nadie nota es un proyecto que nadie está mirando.**
  Si hay una tabla sin RLS ahí adentro, lleva meses así.

---

## 1. Dónde está físicamente la base de datos

Esto sí lo verifiqué. `get_project` responde:

| Dato | Valor |
| --- | --- |
| Nombre del proyecto | `lqs` |
| Referencia | `blzzzklljdvsyudlrvbt` |
| Organización | `utsofdpgtcedamoqgmrz` |
| **Región** | **`ca-central-1`** |
| Estado reportado | `ACTIVE_HEALTHY` |
| Host de la base | `db.blzzzklljdvsyudlrvbt.supabase.co` |
| Postgres | `17.6.1.141` (motor 17, canal `ga`) |
| Creado | 2 de julio de 2026, 19:26 UTC |

**`ca-central-1` es Canadá central — región de Montreal / Toronto.** Los datos
personales de los clientes colombianos de LQS están almacenados en centros de datos
en **Canadá**, no en Colombia ni en Estados Unidos.

Nota de coherencia: el estado dice `ACTIVE_HEALTHY` pero la base rechaza conexiones y
la API de advisors dice "hibernated". El estado que reporta el panel y lo que hace la
base no coinciden. No te fíes del semáforo verde.

### Qué implica Canadá, legalmente

Bien: **Canadá está en la lista de países con nivel adecuado de protección de datos
de la Superintendencia de Industria y Comercio** (Circular Externa 005 de 2017, que
modificó el Título V de la Circular Única). Eso significa que la transferencia
internacional de datos a Canadá **no requiere autorización previa de la SIC ni un
contrato de transmisión con cláusulas especiales**. Es de los mejores sitios donde
podían haber quedado.

Mal: **`legal.html` no lo dice.** Hoy el texto solo dice, vagamente, *"Algunos de
estos proveedores procesan información fuera de Colombia"*. El Decreto 1377 de 2013
te obliga a informar la finalidad y las condiciones del tratamiento; nombrar el país
es lo correcto y además aquí te favorece. Debería decir, con nombre y apellido:
*"La base de datos está alojada en Supabase, en centros de datos ubicados en Canadá,
país reconocido por la SIC como de nivel adecuado de protección."*

Esto está desarrollado en `docs/POLITICAS-PENDIENTES.md`.

---

## 2. Qué tablas hay

**No las pude listar.** Lo que sigue viene de dos fuentes indirectas, y las separo
para que sepas de dónde sale cada cosa.

### 2.1 Lo que el sitio realmente toca (verificado leyendo `index.html`)

Estas ocho llamadas están en el código, línea por línea. Es lo que el sitio hace de
verdad:

| Tabla | Operación | Dónde |
| --- | --- | --- |
| `universos` | lectura | Poblar el selector de área del formulario |
| `paquetes` | lectura | Vista de servicios y precios |
| `perfiles` | lectura | Portal del cliente |
| `proyectos` | lectura | Portal del cliente |
| `hitos` | lectura | Portal del cliente |
| `solicitudes` | **lectura y escritura** | Formulario de cotización + portal |
| `suscriptores` | **escritura** | Banner de novedades |
| `eventos` | — | No lo toca el sitio directamente |

### 2.2 Lo que dicen el README y el protocolo (documental, no verificado)

Nueve tablas: `universos`, `paquetes`, `perfiles`, `solicitudes`, `proyectos`,
`hitos`, `citas`, `suscriptores`, `eventos`.

El README de `lqs-web` afirma además:

> Con RLS por fila (cada cliente ve lo suyo) y triggers que registran un evento
> por cada solicitud, cita o suscriptor nuevo.

**Esa frase es una afirmación escrita en un README, no una comprobación.** Puede ser
cierta, puede haber sido cierta y haber dejado de serlo, o puede cubrir solo algunas
tablas. Que un README diga "con RLS" no es una auditoría. Es exactamente lo que
`get_advisors` existe para contrastar.

Observa además que `citas` está en la documentación pero **el sitio nunca la llama**.
O el agendamiento no está conectado, o se hace por otro lado.

### 2.3 Las columnas

**No las pude listar.** Lo único verificado son los campos que el sitio escribe, que
salen del código del formulario:

```js
const row = {
  nombre:      f.nombre.value.trim(),
  email:       f.email.value.trim() || null,
  telefono:    f.telefono.value.trim() || null,
  universo_id: f.universo_id.value || null,
  detalle:     f.detalle.value.trim(),
  presupuesto: f.presupuesto.value ? Number(f.presupuesto.value) : null,
  cliente_id:  sesion ? sesion.id : null,
  origen:      'web'
};
await API.crear('solicitudes', row);
```

Y para el banner de novedades:

```js
await API.crear('suscriptores', { email: ..., origen: 'banner' });
```

---

## 3. Qué datos personales se guardan hoy

Verificado leyendo el código, no la base.

### Tabla `solicitudes` — el formulario de cotización

Es la que más datos personales concentra:

| Campo | Dato personal | Obligatorio en el formulario |
| --- | --- | --- |
| `nombre` | **Nombre de la persona** | Sí (`required`) |
| `telefono` | **Número de WhatsApp** | No |
| `email` | **Correo electrónico** | No |
| `detalle` | Texto libre del proyecto — máx. 1200 caracteres | Sí (`required`) |
| `presupuesto` | Rango de presupuesto en COP | No |
| `universo_id` | Área de interés | No |
| `cliente_id` | Vínculo con la cuenta si hay sesión | Automático |
| `origen` | `'web'` | Automático |

Dos cosas que hay que decir en voz alta:

- **`detalle` es un campo libre de 1200 caracteres.** Ahí el cliente escribe lo que
  quiera. Puede meter la dirección de su local, el nombre de sus socios, cifras de
  ventas, o datos de terceros. Formalmente no es un campo de dato sensible, pero en
  la práctica es el campo con más riesgo del formulario porque nadie controla qué
  entra. Vale la pena revisar el contenido real cuando la base vuelva.
- **Ni el correo ni el teléfono son obligatorios.** Se puede mandar una solicitud sin
  ninguna forma de contacto más allá del nombre. Eso no es un problema de datos, es
  un problema de negocio: son solicitudes que no puedes responder.

### Tabla `suscriptores` — el banner de novedades

Solo `email` y `origen: 'banner'`. Correo electrónico, con fines **comerciales y
promocionales** (el banner dice literalmente *"Promos, nuevas cápsulas y cupos
abiertos"*). Ver el punto 5, porque esta es la que peor está desde lo legal.

### Tabla `perfiles` y las cuentas — Supabase Auth

El registro pide correo, contraseña, nombre y WhatsApp. La contraseña la maneja
Supabase Auth (`/auth/v1/signup`), no LQS: **LQS nunca ve ni almacena la contraseña
en claro**, y eso está bien resuelto. Mínimo 6 caracteres, que es poco pero es el
mínimo por defecto.

La sesión se guarda en `localStorage` bajo la clave `lqs_sesion`, con `access_token`
y `refresh_token`. Es lo estándar para un sitio sin servidor propio, y tiene la
contrapartida conocida: si alguna vez entra un XSS en el sitio, esos tokens son
robables. Como todo el HTML es propio y no hay CDN de terceros ejecutando scripts,
el riesgo hoy es bajo.

### WhatsApp

El botón *"Prefiero WhatsApp"* abre `wa.me/573332791710`. Esa conversación **no pasa
por Supabase**: los datos quedan en la infraestructura de Meta. Los datos personales
que un cliente escriba por ese canal están fuera de esta base de datos y fuera de
cualquier control técnico de LQS, pero **LQS sigue siendo responsable de ellos**
frente a la Ley 1581. Está tratado en `docs/POLITICAS-PENDIENTES.md`.

### Lo que NO se recoge (verificado)

- **Ningún dato de tarjeta de crédito.** Verificado: no hay pasarela de pago
  conectada en `index.html`. Cuando la haya, sigue sin haberla — los datos de tarjeta
  los maneja la pasarela, no LQS.
- **Ningún dato sensible** en campos estructurados: no hay campos de salud, origen
  étnico, afiliación política, religiosa ni orientación sexual.
- **Ninguna cookie de publicidad ni de seguimiento de terceros.** Verificado: no hay
  Google Analytics, ni píxel de Meta, ni Hotjar, ni nada parecido en `index.html`.
  Solo `localStorage` propio.

---

## 4. Quién tiene acceso: las dos claves

Esta es la pregunta que hiciste y la respuesta es buena. Te explico primero la
diferencia y después el veredicto.

### La clave publicable

Es la que va **dentro del HTML del sitio**, a la vista de cualquiera que abra el
código fuente. Está diseñada para eso. Cualquier visitante puede leerla, copiarla y
usarla.

Que sea pública no es un descuido: **es que esa clave por sí sola no da acceso a
nada.** Lo que puede hacer alguien con esa clave lo decide, exclusivamente, la
**Row Level Security** de cada tabla. Sin RLS, esa clave lee y escribe la tabla
completa. Con RLS bien puesta, esa clave no puede tocar una fila que no le
corresponda.

Dicho de otra forma: **la clave publicable no es la cerradura. La RLS es la
cerradura.** Por eso la auditoría que no pude correr es la que importa.

En el proyecto `lqs` hay dos claves publicables activas:

| Nombre | Tipo | Valor | Activa |
| --- | --- | --- | --- |
| `default` | publicable (nueva) | `sb_publishable_VFpQh4QhCcc2pxhBkyGDUA_hjyX8gPA` | Sí |
| `anon` | anon heredada (JWT) | `eyJhbGciOiJIUzI1NiIs…` (rol `anon`, expira 2036) | Sí |

### La clave de servicio

Es la otra. La `service_role` (o `sb_secret_…`). Esa clave **se salta la RLS por
completo**: lee, modifica y borra cualquier fila de cualquier tabla como si fuera el
dueño de la base. Es la llave maestra.

Va únicamente en un servidor, en una función de borde, o en una variable de entorno
de un backend. **Nunca en HTML, nunca en JavaScript de navegador, nunca en un repo
público.** Si esa clave se filtra, se acabó: quien la tenga se lleva toda la base de
datos de clientes de LQS, o la borra.

### Veredicto: ¿el sitio expone alguna clave que no debería?

**No.** Verificado.

- La clave que está en `index.html` línea 1177 es
  `sb_publishable_VFpQh4QhCcc2pxhBkyGDUA_hjyX8gPA`, y confirmé contra
  `get_publishable_keys` que **es exactamente la clave publicable del proyecto**.
  Está donde tiene que estar.
- Busqué `service_role`, `sb_secret_`, `SUPABASE_SERVICE` y `secret` en **todos** los
  archivos HTML del repo. **Cero coincidencias.** No hay ninguna clave de servicio
  filtrada en el frontend.
- El cliente `API` usa la clave publicable como `apikey` y, cuando hay sesión, manda
  el `access_token` del usuario como `Authorization`. Ese es el patrón correcto: la
  base distingue al visitante anónimo del cliente autenticado, que es la única forma
  de que la RLS pueda hacer su trabajo.

Esto está bien hecho y hay que decirlo. **Pero no te confíes:** que la clave correcta
esté en el sitio correcto no dice nada sobre si las tablas tienen RLS. Son dos
comprobaciones distintas y la segunda sigue pendiente.

### Una recomendación aparte: la clave `anon` heredada

Hay dos claves publicables activas al tiempo. El sitio solo usa la nueva
(`sb_publishable_…`). La `anon` heredada, formato JWT, **está activa y no la usa
nadie** — y no expira hasta 2036.

Si esa clave nunca se usó en producción, desactívala en el panel de Supabase. Es
gratis y reduce una superficie de ataque que no le sirve a nadie. Si aparece en algún
sitio viejo o en alguna copia publicada en `motta-bit/aloja`, revísalo antes de
apagarla.

---

## 5. Lo que sí encontré, y es un problema legal serio

Esto no salió de la base de datos: salió de leer el código. Y es un hallazgo con
consecuencias reales.

### 5.1 La autorización de tratamiento de datos NO se guarda

El formulario de cotización tiene su casilla de aceptación, obligatoria y sin
premarcar. Bien:

```html
<input type="checkbox" name="acepta" required …>
<span>Autorizo el tratamiento de mis datos personales conforme a la
<a href="legal.html#politica">política de datos</a> de LQS.</span>
```

El problema: **el valor de `acepta` nunca se lee en el JavaScript y nunca se manda a
la base.** Mira el objeto que se envía — no está:

```js
const row = { nombre, email, telefono, universo_id, detalle, presupuesto, cliente_id, origen };
```

El navegador obliga a marcarla, pero **de esa autorización no queda ningún rastro.**
No hay fecha, no hay versión del texto aceptado, no hay registro.

Y el artículo 7 del Decreto 1377 de 2013 obliga a **conservar prueba de la
autorización**. Uno de los derechos del titular (que `legal.html` ya reconoce, en la
sección 6) es *"solicitar prueba de la autorización que nos diste"*. **Hoy LQS no
puede entregar esa prueba de ninguna solicitud recibida.** El sitio promete algo que
no puede cumplir.

**Arreglo:** añadir a `solicitudes` las columnas `acepta_datos boolean not null`,
`acepta_fecha timestamptz not null default now()` y `acepta_version text`, y
mandarlas en el `row`. Es una migración pequeña y cierra el hueco.

### 5.2 La casilla del registro de cuenta no es obligatoria

En el modal de crear cuenta (línea 1149):

```html
<input type="checkbox" name="acepta" …>
```

**Sin `required`.** Y tampoco se valida en el JavaScript — `acepta` no aparece ni una
sola vez en la lógica de envío. O sea: **se puede crear una cuenta en LQS sin aceptar
los términos ni la política de datos.**

Es un descuido de una palabra. Añadir `required` y validarlo en el `submit`.

### 5.3 El banner de novedades no tiene casilla, y es el que más la necesita

El banner recoge correos para **fines comerciales**: *"Promos, nuevas cápsulas y cupos
abiertos"*. No tiene casilla. Solo un texto debajo del botón:

> *"Al suscribirte aceptas nuestra política de datos."*

Ese es el caso donde la ley es **más** exigente, no menos: la finalidad publicitaria
exige autorización expresa y separada. Un texto informativo al pie de un botón no es
una autorización — es exactamente el tipo de consentimiento tácito que la
Superintendencia de Industria y Comercio ha rechazado. Desarrollado en
`docs/POLITICAS-PENDIENTES.md`.

### 5.4 Lo que está bien

- **Ninguna casilla del sitio viene premarcada.** Verificado: cero coincidencias de
  `checked` en cualquier `checkbox` de `index.html`. Esto es correcto y es
  precisamente lo que la SIC exige.
- Las casillas tienen texto propio, enlazan a `legal.html` con el ancla correcta, y
  abren en pestaña nueva sin perder lo que el usuario ya escribió.
- La contraseña nunca pasa por código de LQS.
- Sin rastreadores de terceros.

---

## 6. Resumen: qué hacer, en orden

| # | Qué | Urgencia | Quién |
| --- | --- | --- | --- |
| 1 | **Despertar Supabase y correr `get_advisors` de seguridad.** Hasta entonces nadie sabe si hay tablas sin RLS | **Ya** | Dueño / desarrollo |
| 2 | Confirmar que el sitio publicado está guardando solicitudes. Si la base lleva hibernada, se están perdiendo | **Ya** | Dueño |
| 3 | Guardar la autorización de datos en `solicitudes` (`acepta_datos`, `acepta_fecha`, `acepta_version`) | Alta | Desarrollo |
| 4 | Poner `required` y validación a la casilla del registro de cuenta | Alta | Desarrollo |
| 5 | Poner casilla real al banner de novedades | Alta | Desarrollo |
| 6 | Decir en `legal.html` que los datos están en Canadá, con Supabase nombrado | Media | Desarrollo |
| 7 | Desactivar la clave `anon` heredada si no se usa | Media | Dueño |
| 8 | Revisar el contenido real del campo `detalle` cuando la base vuelva | Baja | Dueño |
