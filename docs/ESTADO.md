# Estado del proyecto LQS

Qué existe, qué falta, qué hay que decidir. Actualizado tras la auditoría de
seguridad de Supabase.

---

## 1. Seguridad — auditoría corrida y resultado

### Lo bueno: las diez tablas tienen RLS activo

Ese era el riesgo grande y **está descartado**. Nadie con la clave pública
puede leer los datos de tus clientes. Las políticas están bien pensadas:

| Tabla | Quién puede leer | Quién puede escribir |
| --- | --- | --- |
| `solicitudes` | solo su dueño o el equipo | cualquiera puede crear *(es el formulario)* |
| `perfiles` | solo el propio o el equipo | el propio |
| `proyectos` · `hitos` · `citas` | su cliente o el equipo | solo el equipo |
| `suscriptores` | solo el equipo | cualquiera puede suscribirse |
| `eventos` | solo el equipo | — |
| `paquetes` · `universos` | público, solo lo activo | solo el equipo |

Que `solicitudes` acepte inserciones de cualquiera es correcto: es el formulario
de cotización. Lo que importa es que **nadie puede leerlas**, y eso está bien.

### Lo que estaba mal y ya se corrigió

**`lqs_registros`** tenía una política llamada «equipo» cuya condición era
literalmente `true`. Permitía leer, escribir, modificar **y borrar** a cualquiera
con la clave pública. Es un almacén genérico (`id`, `coleccion`, `datos` jsonb)
que el sitio no usa y estaba vacío, así que no hubo exposición — pero cualquier
cosa guardada ahí habría sido pública y borrable por cualquiera.

Corregido con la migración `cierra_lqs_registros_solo_equipo`: ahora exige
`es_equipo()` para todo. Verificado.

### Lo que queda como advertencia, sin urgencia

- **Tres funciones `SECURITY DEFINER` invocables sin sesión**: `crear_perfil()`,
  `es_equipo()` y `registrar_evento()`. Las tres tienen sentido siendo públicas
  —`registrar_evento` recibe analítica del sitio, `crear_perfil` corre al
  registrarse, `es_equipo` devuelve `false` a un anónimo— pero conviene revisar
  que ninguna acepte parámetros que permitan escalar. Hoy ninguna recibe
  argumentos, así que el riesgo es bajo.
- **Protección de contraseñas filtradas desactivada.** Supabase puede comparar
  contra HaveIBeenPwned al registrarse. Se activa con un clic en el panel y no
  cuesta nada: *Authentication → Policies → Leaked password protection*.

### Dónde viven los datos

Servidor en **Canadá** (ver `docs/DATOS-Y-SEGURIDAD.md`). Implica transferencia
internacional de datos personales, que la Ley 1581 permite pero exige declarar
en la política de privacidad. Hoy `legal.html` no lo dice.

### Frontend: qué se expone y por qué es correcto

La clave publicable de Supabase **está en el HTML del sitio y debe estarlo** —
así funciona el modelo: la clave identifica el proyecto, y quien protege es RLS.
La clave de servicio (`service_role`), que sí salta RLS, **no aparece en ningún
archivo del repositorio**. Verificado.

---

## 2. Lo que existe hoy

### El sitio

- `index.html` — una sola página con router por hash. Portada de cuatro puertas
  (Soy empresa · Tengo un local · Soy creador · Tengo una marca) con mini-filtro
  de nichos, hero de lienzo con las letras LQS vivas, clima de color por sección,
  claro/oscuro, y el filtro por tipo de cliente en `?soy=` y `?busco=`.
- **Nueve áreas** agrupadas en tres familias, en composición asimétrica: se ven
  en 2,4 pantallas de scroll.
- **Doce fichas y muestras** en `mundos/`, todas con el lenguaje visual nuevo.
- **Galería** en Muestras: 22 enlaces a propuestas, muestras, fichas y la guía.
- Sistema visual: la esquina ancla, las siete formas orgánicas, los cinco
  universos, tipografía variable.

### Las propuestas

| Archivo | Qué es | Estado |
| --- | --- | --- |
| `propuestas/distrito-peru-automatizacion.html` | Propuesta cerrada para Distrito Perú, precio de lanzamiento | **Enviada** |
| `propuestas/automatizacion.html` | Pública, adaptable a empresa/restaurante/hotel | Lista, no publicada |
| `propuestas/catalogos.html` | Pública, catálogos inteligentes para almacenes/eventos/ropa | Lista, sin precios a propósito |
| `propuestas/catalogos-propuesta.pdf` | El PDF de la anterior, 497 KB | Listo |

Las propuestas **no aparecen sueltas navegando**: se entregan al pedir cotización.

### La documentación

`docs/PRECIOS.md` (piso de costo, precio y margen de cada servicio) ·
`docs/FACTURACION.md` (plan por fases) · `docs/INVENTARIO.md` ·
`docs/DATOS-Y-SEGURIDAD.md` · `docs/PROPUESTA-REDISENO.md` ·
`docs/referencias.md` · `docs/direccion-organica.md` ·
`.claude/skills/protocolo-lqs/` (el criterio, se carga solo).

### Dónde está publicado

- **Copia de revisión** → `https://motta-bit.github.io/aloja/lqs/`
- **Distrito Perú** → `https://motta-bit.github.io/distrito-peru/`
- **`lqs-web`** → sirve `master`, que **todavía no tiene ninguno de estos
  cambios**. Están en `claude/peru-restaurant-interactive-page-jpv3j7`.

---

## 3. Lo que falta

### Depende solo de ti

1. **Mezclar a `master`.** Sin eso, el sitio real no cambia.
2. **Activar la protección de contraseñas filtradas** en el panel de Supabase.
3. **El NIT y la razón social** — `legal.html` los tiene en «POR COMPLETAR», y
   eso bloquea la Fase 2 de facturación y las políticas legales.
4. **El material del bloque bloqueante**: logo en SVG, tres casos de portafolio,
   un antes/después real, fotos del taller. Sin eso hay un techo que ningún
   diseño rompe.
5. **Recordatorio para el 9 de septiembre**: bajar la propuesta de Distrito Perú
   a los 29 días. No se programa solo.

### Trabajo pendiente

| Qué | Esfuerzo | Bloqueado por |
| --- | --- | --- |
| Unión con Meta / WhatsApp Business | ver §4 | número ya disponible |
| Facturación interna, Fase 1 | 24 h | nada |
| Hojas de impresión para los PDF de automatización y Distrito Perú | 4 h | nada |
| Actualizar Notion con las tareas | 2 h | nada |
| Declarar la transferencia a Canadá en `legal.html` | 1 h | datos legales |
| Propuestas para Creador y Joyería | 8 h | nada |

---

## 4. La unión con Meta / WhatsApp Business

Esto es lo siguiente y conviene entenderlo antes de empezar, porque tiene un
punto de no retorno.

### Lo que hay que saber primero

**La app de WhatsApp Business y la API de WhatsApp Business son cosas
distintas.** La app es la que usas en el celular. La API es la que permite que
un sistema conteste solo. **Un número no puede estar en las dos a la vez**: al
registrarlo en la API, deja de funcionar en la app del celular. Es reversible,
pero toma días.

Por eso la primera decisión es: **¿el número que tienes es el que quieres
automatizar, o conviene uno nuevo?** Si es el que le das a tus clientes hoy y lo
contestas a mano, migrarlo significa que dejas de contestar desde el celular.

### Lo que se necesita

- Cuenta de **Meta Business** verificada — verificación de empresa con documento
  legal, y aquí vuelve a hacer falta el NIT.
- Un **proveedor** (360dialog, Wati, Twilio) o conexión directa con Meta. El
  proveedor cuesta entre $180.000 y $250.000 al mes y es el costo duro que ya
  está metido en la mensualidad de $650.000.
- **Plantillas de mensaje aprobadas** por Meta para escribir primero. Las
  respuestas dentro de 24 h de que el cliente escribió son libres.
- Un endpoint público con HTTPS para el webhook. Supabase Edge Functions sirve.

### Cómo lo haría

**Fase 1 — cuenta y número.** Meta Business verificado, número registrado,
plantillas básicas enviadas a aprobación. Sin escribir código. Aquí decides lo
del número.

**Fase 2 — el puente.** Una Edge Function en Supabase que reciba el webhook,
guarde los mensajes y responda. Las tablas de `docs/FACTURACION.md` y las del
esquema de Distrito Perú ya sirven de base.

**Fase 3 — los flujos.** Lo que ya está simulado en `mundos/automatizacion.html`
—pedido, reserva, plato al detalle— conectado de verdad.

**Lo que no se puede saltar:** la verificación de empresa de Meta tarda entre
días y semanas y depende de ellos. Conviene arrancarla antes que el código.

---

## 5. Lo que hay que decidir

1. **¿Ese número o uno nuevo?** Es la decisión con consecuencia real.
2. **¿Se mezcla a `master` ya**, o se sigue revisando en la copia?
3. **¿Los precios se quedan como están** o se hace la actualización global que
   quedó anotada en `docs/PRECIOS.md`?
4. **¿Creador y Joyería llevan propuesta propia** o siguen yendo a cotizar?
5. **¿Se borra `lqs_registros`?** Está vacía, sin usar y ya cerrada. Mantenerla
   sin uso es superficie de ataque sin beneficio.
