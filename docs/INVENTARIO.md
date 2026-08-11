# Inventario de lo publicado

Fecha del levantamiento: **11 de agosto de 2026**
Cuenta de GitHub: **motta-bit** (creada el 25 de mayo de 2026, 4 repos públicos)

---

## Antes de leer: qué NO pude comprobar

Esto es importante y va de primero para que no te lleves una idea equivocada.

**No pude abrir ninguna URL pública.** El proxy de este entorno bloquea `github.io`
y también bloquea el endpoint de la API de GitHub que informa la configuración de
Pages:

```
GET https://api.github.com/repos/motta-bit/<repo>/pages
→ HTTP 403 "Access to this GitHub API path is not permitted through this proxy."
```

Lo probé en los cuatro repos y en los cuatro dio el mismo 403. La CLI `gh` no está
instalada en esta máquina.

Consecuencia concreta: **cuando digo que una página "debería estar" en una URL, es
una deducción, no una comprobación.** No verifiqué que ninguna de esas direcciones
cargue. Lo que sí verifiqué, por la API de contenidos y por clonado directo, es qué
archivos existen en cada repo y en qué rama.

Lo que puedo afirmar con certeza está marcado como **verificado**. Lo demás va como
**deducido** o **sin confirmar**.

---

## 1. Los cuatro repos de motta-bit

Los cuatro son **públicos** y con permiso de escritura para la cuenta.

| Repo | Último push | Rama por defecto | Qué es |
| --- | --- | --- | --- |
| `motta-bit/lqs-web` | 11 ago 2026, 13:23 | `master` | Sitio y plataforma de LQS |
| `motta-bit/distrito-peru` | 11 ago 2026, 01:21 | `main` | Carta digital de Distrito Perú |
| `motta-bit/aloja` | 11 ago 2026, 00:41 | `main` | Demo del producto Aloja + copias de otros sitios |
| `motta-bit/vitanova-site` | 27 jul 2026, 17:28 | `master` | Sitio de Vita Nova Colombia |

**Ninguno de los cuatro tiene rama `gh-pages`** (verificado por `list_branches`).
Si Pages está activo, sirve desde la rama por defecto, carpeta raíz — que es
exactamente lo que dice el README de `lqs-web`:

> Settings → Pages → *Deploy from a branch* → rama y carpeta `/ (root)`.

---

### 1.1 `motta-bit/lqs-web`

**Qué contiene** (verificado, rama `master`, commit `26a4d3b`):

Archivos HTML que se servirían:

- `index.html` — 78.472 bytes en `master`
- `legal.html` — 16.535 bytes
- `servicios.html` — 58.693 bytes
- `automatizacion-guia.html` — 53.151 bytes
- `mundos/` — 12 archivos HTML

Además arrastra un esqueleto de Next.js que **no se sirve y no hace nada**:
`src/app/**` (unas 25 rutas `.tsx` y `.ts`), `prisma/schema.prisma`, `prisma/seed.ts`,
`next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `package.json`,
`package-lock.json` (359.520 bytes), `messages/es.json`, `messages/en.json`,
`public/*.svg`. GitHub Pages no ejecuta build: ese código está muerto en el repo.
Vale la pena decidir si se borra o se archiva aparte.

**Pages:** sin confirmar. No hay `CNAME` ni `.nojekyll` ni workflow en
`.github/workflows`. El README afirma que se publica desde rama + raíz, pero eso
es una instrucción escrita, no la configuración leída.

**URL deducida:** `https://motta-bit.github.io/lqs-web/` — **sin confirmar.**

**Ojo con esto:** la rama `master` está atrasada frente a la rama de trabajo.

| | `master` (`26a4d3b`) | rama de trabajo `claude/peru-restaurant-interactive-page-jpv3j7` (`d92e53c`) |
| --- | --- | --- |
| `index.html` | 78.472 bytes | 153.832 bytes |
| `propuestas/` | **no existe** | 2 archivos |
| `prototipos/` | **no existe** | 1 archivo |
| `assets/` | **no existe** | sí |

O sea: **si Pages sirve `master`, lo que hay publicado hoy es una versión del sitio
que pesa la mitad, y las propuestas públicas y el prototipo orgánico no están
publicados en absoluto.** Existe también una tercera rama, `redesign/ciudad-del-pato`.

---

### 1.2 `motta-bit/distrito-peru`

**Qué contiene** (verificado, rama `main`, commit `0d8e9fb`) — solo tres archivos:

- `index.html` — 181.405 bytes
- `carta-interactiva.html` — 579.101 bytes
- `README.md` — 416 bytes

El README dice, textual:

> Muestra de propuesta (LQS) para **Distrito Perú · Gastronomía Peruana** — Laureles,
> Medellín. […] **Sitio:** `index.html` (autocontenido). Publicado con GitHub Pages.

**Pages:** el README afirma que sí. No pude leer la configuración (403).

**URL deducida:** `https://motta-bit.github.io/distrito-peru/` — **sin confirmar.**

---

### 1.3 `motta-bit/aloja`

**Qué contiene** (verificado, rama `main`, commit `9eeb2a1`) — seis archivos en raíz:

- `index.html` — 76.595 bytes (el demo de Aloja propiamente)
- `distrito-peru.html` — 174.441 bytes
- `lqs-sitio.html` — 153.937 bytes
- `lqs-organico.html` — 39.700 bytes
- `DIRECCION-ORGANICA.md` — 23.337 bytes
- `README.md` — 399 bytes

README, textual:

> Demo navegable del producto **Aloja by LQS**: reservas directas, integraciones API,
> canales automatizados, check-in con QR, personalización, **llave digital
> (PIN / tarjeta / celular)** y universalización de marca. […] Sitio autocontenido en
> `index.html`. Publicado con GitHub Pages.

**Esto hay que mirarlo:** `aloja` está sirviendo copias de cosas que viven en otros
repos. `lqs-sitio.html` pesa 153.937 bytes — prácticamente el mismo tamaño que el
`index.html` de la rama de trabajo de `lqs-web` (153.832). `lqs-organico.html` pesa
39.700, exactamente lo mismo que `prototipos/organico.html` local. Y `distrito-peru.html`
duplica el sitio del repo `distrito-peru`. `DIRECCION-ORGANICA.md` (23.337 bytes) es
el mismo archivo que `docs/direccion-organica.md` de este repo (23.337 bytes).

Son copias, no enlaces. **Cada vez que se toque el sitio de LQS, esta copia queda
desactualizada en silencio** y sigue publicada. Es un riesgo real: hay una versión
de LQS y una de Distrito Perú viviendo en una URL que nadie está manteniendo.

**Pages:** el README afirma que sí. Sin confirmar por API.

**URL deducida:** `https://motta-bit.github.io/aloja/` — **sin confirmar.**

---

### 1.4 `motta-bit/vitanova-site`

Este repo no estaba adjunto a la sesión, así que lo cloné para poder mirarlo.

**Qué contiene** (verificado, rama `master`, commit `add4abe` —
*"feat: switch ES/EN, teaser Casa Raiz y contacto simplificado"*):

- `CNAME` → **`vitanovacolombia.org`**
- `index.html` (10.983 b), `nosotros.html` (8.754 b), `programas.html` (6.454 b),
  `nucleos.html` (6.410 b), `apoyar.html` (9.465 b), `legal.html` (8.987 b),
  `contacto.html` (4.872 b), `eventos.html` (3.158 b), `galeria.html` (2.975 b),
  `mapa.html` (2.932 b)
- carpeta `assets/`
- sin README

**Este es el único de los cuatro donde tengo evidencia dura de que Pages está
activo:** el archivo `CNAME` en la raíz solo lo escribe GitHub cuando configuras un
dominio propio en Pages. No es prueba de que el sitio esté cargando hoy, pero sí de
que Pages se configuró con dominio propio.

**URL deducida:** `https://vitanovacolombia.org` — **sin confirmar que cargue.**
No pude comprobar el DNS ni el certificado.

Notar que es el único proyecto que **no** es de LQS como cliente propio: es un sitio
de organización (Vita Nova Colombia), con `legal.html` propio y estructura de ONG
(programas, núcleos, apoyar, eventos).

---

## 2. Los HTML dentro de `lqs-web`, uno por uno

Esto es sobre la **rama de trabajo** (`claude/peru-restaurant-interactive-page-jpv3j7`),
que es la que tiene todo. Marco cuáles no están en `master`.

### 2.1 Raíz

| Archivo | Peso | Qué es | Enlazado desde |
| --- | --- | --- | --- |
| `index.html` | 153.832 b | La aplicación. Router SPA por hash, todas las vistas dentro | Es la entrada. Huérfano por definición |
| `legal.html` | 16.768 b | Políticas, aviso de privacidad, términos, derechos | **8 enlaces desde `index.html`** (formulario, pie, banner, modal) |
| `automatizacion-guia.html` | 53.351 b | Guía técnica de implementación de Meta Cloud API | `mundos/automatizacion.html` y `servicios.html`. **No está enlazado desde `index.html`** |
| `servicios.html` | 58.939 b | Página suelta "Servicios y precios". Sistema visual anterior | **Huérfano.** Nadie lo enlaza. Está en `master`, o sea publicado y sin puerta de entrada |

`servicios.html` es un caso claro de deuda: 58 KB publicados que duplican la vista
de Servicios del `index.html` y que solo se alcanzan escribiendo la URL a mano.
O se enlaza, o se borra, o se deja como página de aterrizaje deliberada — pero hoy
no es ninguna de las tres.

### 2.2 `mundos/` — 12 archivos, los 12 enlazados

Son las fichas y muestras que abre el visor interno (`abrirDemo`). Todos están en
`master`.

| Archivo | Peso | Enlaces desde `index.html` |
| --- | --- | --- |
| `automatizacion.html` | 60.240 b | 3 |
| `empresas.html` | 20.681 b | 3 |
| `productora.html` | 20.774 b | 2 |
| `productora-muestras.html` | 45.344 b | 2 |
| `productora-calculadora.html` | 48.437 b | 2 |
| `marcas-muestras.html` | 22.592 b | 2 |
| `foma.html` | 20.417 b | 2 |
| `express.html` | 20.241 b | 2 |
| `express-muestras.html` | 49.317 b | 2 |
| `empresas-muestras.html` | 40.517 b | 2 |
| `creadores.html` | 20.184 b | 2 |
| `mercury.html` | 20.770 b | 1 |

**Ninguno es huérfano.** Pero hay el problema inverso:

> ### ⚠ Dos enlaces rotos en `index.html`
>
> `index.html` enlaza a **`mundos/carta.html`** y **`mundos/carta-muestras.html`**.
> **Esos dos archivos no existen** — ni en la rama de trabajo, ni en `master`, ni en
> ninguna de las copias de trabajo del repo.
>
> Quien haga clic ahí, el visor interno le abre un iframe vacío o un 404 embebido.
> Hay que crear los dos archivos o quitar los dos enlaces. Es lo más urgente de este
> documento después de lo de seguridad.

Recordar además lo que ya dice el protocolo: Restaurantes y Hoteles son áreas **sin
ficha a propósito** (ruta vacía en `FICHAS`, la tarjeta dice "Ficha en camino"). Eso
es distinto de un enlace roto: ahí no hay enlace, hay un aviso.

### 2.3 `propuestas/` — 2 archivos, ambos huérfanos, ninguno en `master`

| Archivo | Peso | Qué es |
| --- | --- | --- |
| `automatizacion.html` | 262.219 b | *"Automatización, pagos y catálogo — LQS"*. Propuesta pública genérica: contiene al menos las variantes de restaurante (*"Tu carta, tus pedidos y tu caja, en un solo sitio"*) y hotel (*"Tus habitaciones, tus reservas y tu caja, en un solo sitio"*) |
| `distrito-peru-automatizacion.html` | 181.424 b | *"Distrito Perú · Carta, pedidos y pagos — Propuesta LQS"*. La versión con el cliente puesto |

Huérfanos **a propósito**: son propuestas que se mandan por enlace directo al cliente,
no piezas de navegación. Eso está bien. Lo que no está bien es que **no están en
`master`**, así que si Pages sirve `master`, esas dos URLs no existen todavía y el
enlace que le mandes a un cliente da 404.

`propuestas/catalogos.html` (almacenes, eventos, ropa) **no existe en la rama de
trabajo**. Existe en una copia de trabajo de otro agente, o sea que está en
construcción ahora mismo por otro equipo.

### 2.4 `prototipos/` — 1 archivo, huérfano, no está en `master`

| Archivo | Peso | Qué es |
| --- | --- | --- |
| `organico.html` | 39.700 b | *"LQS · prototipo orgánico"*, hero *"Creamos lo que sea. Resolvemos lo que venga."* Exploración de dirección visual, no producción |

Huérfano y correcto que lo sea: es un prototipo. Pero ojo que **ese mismo archivo,
byte por byte, sí está publicado** en `motta-bit/aloja` como `lqs-organico.html`.
Un prototipo interno vive hoy en una URL pública.

### 2.5 `assets/`

Solo `assets/generado/README.md`. **No hay una sola imagen real en el repo.**
Concuerda con la deuda conocida: no hay logo, ni fotos, ni portafolio. Todo lo visual
del sitio hoy es SVG generado en línea dentro de `index.html` (la constante `ART`).

---

## 3. Resumen de lo que hay que decidir

1. **Enlaces rotos:** `mundos/carta.html` y `mundos/carta-muestras.html` no existen y
   están enlazados desde `index.html`.
2. **`master` está atrasado.** Si Pages sirve `master`, lo publicado es un `index.html`
   de 78 KB contra 153 KB de la rama de trabajo, y sin `propuestas/` ni `prototipos/`.
3. **`aloja` publica copias desactualizables** de LQS, del prototipo orgánico y de
   Distrito Perú. Hay que decidir si `aloja` es solo el demo de Aloja o un cajón de
   sastre.
4. **`servicios.html`** está publicado y huérfano.
5. **El esqueleto de Next.js** (`src/`, `prisma/`, `package-lock.json`) ocupa el repo
   sin servir para nada en Pages.
6. **Confirmar Pages a mano.** Entra a Settings → Pages de los cuatro repos y anota
   rama y carpeta. Yo no pude leerlo y no lo voy a inventar.
