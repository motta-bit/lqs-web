# 001 — Consolidar las curvas de animación en tokens

- **Status**: HECHO
- **Commit**: 2bf2c37
- **Severity**: MEDIUM
- **Category**: 7 — Cohesión y tokens
- **Estimated scope**: 1 archivo (`index.html`), ~10 líneas

## Problem

`index.html` define siete cubic-beziers escritos a mano que intentan ser la misma
curva ("ease-out fuerte"). Ninguna vive como token, así que cada componente nuevo
copia una variante distinta y el movimiento del sitio nunca termina de sentirse
como un solo sistema.

```css
/* index.html:86 */   .view.on{display:block;animation:vin .5s cubic-bezier(.2,.75,.3,1)}
/* index.html:95 */   #hero h1 .ln i{...animation:up .95s cubic-bezier(.2,.8,.25,1) forwards}
/* index.html:109 */  .pt{...transition:.45s cubic-bezier(.2,.75,.3,1);cursor:pointer}
/* index.html:160 */  #precios.on{display:block;animation:baja .45s cubic-bezier(.2,.75,.3,1) both}
/* index.html:209 */  .bar i{...transition:width .9s cubic-bezier(.2,.8,.3,1)}
/* index.html:222 */  #promo{...transition:transform .6s cubic-bezier(.2,.9,.3,1)}
/* index.html:238 */  .modal{...transition:.4s cubic-bezier(.2,.85,.3,1);max-height:90vh;overflow:auto}
/* index.html:294 */  .rv{...transition:opacity .8s cubic-bezier(.2,.7,.3,1),transform .8s cubic-bezier(.2,.7,.3,1)}
```

El archivo ya tiene un bloque `:root` con tokens de color y tipografía
(`index.html:17-24`), así que la convención existe — el movimiento simplemente
quedó fuera de ella.

## Target

Añadir tres curvas y una escala de duraciones al `:root` que ya existe, y
reemplazar las siete variantes por los tokens. Los valores salen del catálogo de
auditoría, no se aproximan:

```css
/* target — dentro del :root existente en index.html:17 */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
--dur-fast: 160ms;
--dur-ui: 200ms;
--dur-panel: 300ms;
```

Mapeo exacto de reemplazos:

| Línea | Antes | Después |
| --- | --- | --- |
| 86 | `cubic-bezier(.2,.75,.3,1)` | `var(--ease-out)` |
| 95 | `cubic-bezier(.2,.8,.25,1)` | `var(--ease-out)` |
| 109 | `cubic-bezier(.2,.75,.3,1)` | `var(--ease-out)` |
| 160 | `cubic-bezier(.2,.75,.3,1)` | `var(--ease-out)` |
| 209 | `cubic-bezier(.2,.8,.3,1)` | `var(--ease-out)` |
| 222 | `cubic-bezier(.2,.9,.3,1)` | `var(--ease-drawer)` |
| 238 | `cubic-bezier(.2,.85,.3,1)` | `var(--ease-out)` |
| 294 | `cubic-bezier(.2,.7,.3,1)` (×2) | `var(--ease-out)` |

`#promo` (222) usa `--ease-drawer` a propósito: entra deslizándose desde fuera de
la pantalla, que es exactamente el caso para el que existe esa curva.

**No cambies ninguna duración en este plan.** Las duraciones se corrigen en el
plan 003; aquí solo se unifican las curvas para que 003 tenga sobre qué apoyarse.

## Repo conventions to follow

- Los tokens viven en el `:root` de `index.html:17-24`, uno por línea, agrupados
  por tema y separados por `;`. Ejemplo a imitar, `index.html:19`:
  ```css
  --gold:#e6c877;--line:rgba(210,215,240,.11);--line2:rgba(210,215,240,.22);
  ```
- El archivo es HTML de un solo fichero con CSS inline en `<style>`. No hay build,
  no hay preprocesador. Los tokens son CSS custom properties nativas.
- El CSS de este proyecto es denso a propósito (varias declaraciones por línea).
  Respeta ese estilo: no reformatees el bloque entero.

## Steps

1. En `index.html`, dentro del bloque `:root` que empieza en la línea 17, añade
   una línea nueva al final del bloque con las seis variables del target.
   Comenta la línea en español, como el resto del archivo:
   `/* movimiento */` seguido de las variables.
2. Reemplaza cada uno de los ocho `cubic-bezier(...)` según la tabla del target.
   Son reemplazos textuales exactos: no toques duración, propiedad ni nada más de
   esas declaraciones.
3. Verifica que no quede ningún `cubic-bezier(` suelto en el archivo:
   `grep -c "cubic-bezier(" index.html` debe devolver `3` (solo las tres
   definiciones del `:root`).

## Boundaries

- NO toques `mundos/*.html`, `legal.html` ni `automatizacion-guia.html`.
- NO cambies duraciones, propiedades de transición ni keyframes.
- NO reformatees CSS que no esté en la tabla.
- NO añadas dependencias.
- Si una línea no coincide con lo que dice este plan (el archivo cambió desde el
  commit 2bf2c37), DETENTE y reporta en vez de improvisar.

## Verification

- **Mecánica**: `grep -c "cubic-bezier(" index.html` → `3`.
  `grep -c "var(--ease-" index.html` → al menos `8`.
- **Feel check**: sirve el sitio (`python3 -m http.server 8099`) y ábrelo.
  - El hero sigue subiendo sus dos líneas al cargar, sin saltos ni cambios de ritmo.
  - Pasa el mouse por los portales del inicio: el movimiento es el mismo de antes.
  - Abre el modal de ingresar: entra igual que antes.
  - Espera 9 segundos: el banner de promociones sube desde abajo — ahora con la
    curva de drawer, debe frenar un poco más suave al final.
- **Done when**: el sitio se ve y se siente idéntico a antes del cambio, y no
  queda ninguna curva escrita a mano fuera del `:root`. Este plan es puramente
  preparatorio: si algo *cambia* visiblemente más allá del banner, algo se hizo mal.
