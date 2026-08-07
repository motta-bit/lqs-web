# 005 — Dar entrada y salida al visor de muestras

- **Status**: TODO
- **Commit**: 2bf2c37
- **Severity**: MEDIUM
- **Category**: 8 — Oportunidades perdidas · 7 — Cohesión

## Problem

El visor es la interacción insignia del sitio: al pulsar *Ver ficha* o
*Probar muestra*, una capa a pantalla completa se come la página. Hoy aparece y
desaparece sin ninguna transición.

```css
/* index.html:256-257 — actual */
#visor{position:fixed;inset:0;z-index:88;background:var(--bg);display:none;flex-direction:column}
#visor.on{display:flex}
```

`display:none` → `display:flex` es un corte instantáneo. Nada explica de dónde
salió esa pantalla ni a dónde se fue, y el salto es total: el sitio entero
desaparece de golpe.

Es además una incoherencia interna. El modal de ingresar, que es la *misma clase*
de elemento (capa sobre el contenido, con velo), sí está bien resuelto:

```css
/* index.html:234-240 — el exemplar correcto, ya en este archivo */
.scrim{position:fixed;inset:0;z-index:85;background:rgba(4,5,12,.82);backdrop-filter:blur(8px);opacity:0;visibility:hidden;transition:.35s}
.scrim.on{opacity:1;visibility:visible}
.modal{...transform:translate(-50%,-46%) scale(.97);opacity:0;visibility:visible...}
.modal.on{opacity:1;visibility:visible;transform:translate(-50%,-50%) scale(1)}
```

Dos superficies del mismo producto, una con criterio y otra sin nada.

## Target

Mismo patrón que `.modal`: `visibility` + `opacity` + un desplazamiento corto,
todo con transiciones (nunca keyframes, porque el visor se abre y cierra seguido).

```css
/* target — reemplaza index.html:256-257 */
#visor{position:fixed;inset:0;z-index:88;background:var(--bg);display:flex;flex-direction:column;
 opacity:0;visibility:hidden;transform:scale(.985);
 transition:opacity var(--dur-panel) var(--ease-out),transform var(--dur-panel) var(--ease-out),visibility var(--dur-panel)}
#visor.on{opacity:1;visibility:visible;transform:none}
```

Tres decisiones que el ejecutor no debe cambiar:

1. **`scale(.985)`, no `scale(0)` ni un fundido puro.** Nada en el mundo real
   aparece de la nada; una escala casi imperceptible da cuerpo a la entrada sin
   que se lea como un "zoom". El rango correcto es 0.9–0.97 para elementos
   pequeños; para una capa a pantalla completa hay que ir aún más sutil, porque
   el mismo porcentaje sobre 1400px de ancho es un desplazamiento enorme.
2. **`display:flex` permanente + `visibility`.** No se puede animar desde
   `display:none`. Es exactamente lo que hace `.modal` en este archivo.
3. **300ms.** El presupuesto de un panel o drawer es 200–500ms; 300 es el punto
   donde se nota la entrada sin hacer esperar.

**Cuidado con un efecto secundario.** Hoy `#visor` está en `display:none`, lo que
lo saca del árbol de accesibilidad y del tabulador. Con `display:flex` permanente
eso se pierde. `visibility:hidden` lo compensa (no es enfocable), pero hay que
verificarlo en el feel check: con el visor cerrado, tabular por la página **no**
debe entrar nunca en el iframe ni en los botones del visor.

El JS no necesita cambios. `abrirDemo` (index.html:1104) y `cerrarDemo`
(index.html:1124) ya conmutan la clase `.on`, que es todo lo que hace falta.

## Repo conventions to follow

- Los tokens `--dur-panel` y `--ease-out` los crea el **plan 001**. Ejecútalo primero.
- Exemplar a imitar: `.scrim` y `.modal` en `index.html:234-240`. Mismo patrón de
  `opacity` + `visibility` + `transform`, misma forma de conmutar con `.on`.
- CSS denso, en su sitio actual del archivo.

## Steps

1. Ejecuta el plan 001 si no está aplicado.
2. En `index.html`, reemplaza las líneas 256-257 por las dos reglas del target.
3. No toques `#visor .vtop`, `#visor .vbody`, `#visor iframe` ni `#visorFall`
   (líneas 258-267): esos siguen igual.
4. Verifica que `abrirDemo` y `cerrarDemo` siguen conmutando `.on` y nada más.

## Boundaries

- NO toques el JS del visor: ni `abrirDemo`, ni `cerrarDemo`, ni el temporizador
  de respaldo de 5 segundos, ni el `requestAnimationFrame` que fija el `src`.
  Ese orden está así por una razón (si el iframe carga oculto, la muestra no
  arranca sus animaciones) y romperlo devuelve el visor en negro.
- NO cambies `#visorFall` ni su lógica de respaldo.
- NO toques `mundos/*.html`.
- NO añadas dependencias.
- Si las líneas 256-257 no coinciden con lo citado, DETENTE y reporta.

## Verification

- **Mecánica**: `grep -n "#visor{" index.html` debe mostrar `display:flex` y
  `visibility:hidden` en la misma regla.
- **Feel check**: sirve el sitio por HTTP (`python3 -m http.server 8099`) — con
  `file://` el visor no carga y no se puede juzgar.
  - Entra a Servicios y pulsa *Ver ficha* en Empresas: el visor debe entrar
    creciendo apenas y apareciendo, no aparecer de golpe.
  - Pulsa *Cerrar*: debe salir con el mismo gesto invertido.
  - Abre y cierra cinco veces seguidas rápido: nunca debe reiniciarse desde cero
    ni quedarse a medias.
  - **Comprueba que la muestra sigue viéndose.** Este es el riesgo real del plan:
    si el iframe queda en negro, el cambio rompió el orden de carga. Debe verse
    la ficha de Empresas completa.
  - Con el visor cerrado, pulsa Tab repetidamente por toda la página: el foco
    nunca debe entrar en *Abrir aparte*, *Cerrar* ni dentro del iframe.
  - En DevTools → Animations al 10%: la escala debe ser casi imperceptible. Si se
    lee como un zoom, el valor quedó demasiado bajo.
- **Done when**: el visor entra y sale con la misma calidad que el modal de
  ingresar, la muestra se sigue viendo, y el visor cerrado no es tabulable.
