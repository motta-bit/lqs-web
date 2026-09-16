# HANDOFF — Rediseño "La Ciudad del Pato"

Rama: `redesign/ciudad-del-pato` · 17 commits · CI en verde.
Fases 0–4 del informe completas. Este documento es lo que **necesito de ti**
para llevar el rediseño a producción, en orden de prioridad.

---

## 🔴 Bloqueantes (sin esto no hay datos reales ni deploy)

### 1. Conectar la base de datos (Neon)
El `.env` local tiene un host placeholder (`@host/lqs`), así que no pude sembrar
nada. Sin esto, los **Whispers y los leads no persisten** (el cotizador funciona,
pero los envíos no se guardan).

Qué me debes entregar / hacer tú:
- La `DATABASE_URL` real de Neon en `.env` (y en las env vars de Vercel).
- Correr una vez:
  ```bash
  npm run prisma:push    # crea columnas nuevas: Service.district, campos de Package, tabla Whisper
  npm run prisma:seed    # carga los 22 servicios + 8 paquetes/planes
  ```
- Confirmarme si los 22 servicios **ya existían** cargados por el admin en
  producción. Si es así, el seed hace `upsert` (no duplica), pero conviene
  revisar que los precios nuevos (D-11) sean los que quieres.

### 2. Variables de entorno que faltan (para que todo funcione en prod)
Necesito que confirmes / entregues estas (van en Vercel):
- `DATABASE_URL` — Neon (bloqueante, ver arriba).
- `NEXTAUTH_SECRET` y `NEXTAUTH_URL` — para el admin/login.
- `RESEND_API_KEY` — para los correos de lead (sin esto el lead se guarda pero no
  manda email).
- `NEXT_PUBLIC_APP_URL` — la URL real del sitio (afecta metadata y sitemap).
- `EDGE_CONFIG` / `VERCEL_API_TOKEN` — ya existen en tu `.env.local`; confirmá que
  estén también en Vercel.

---

## 🟠 Activos que solo tú tienes

### 3. Las mascotas definitivas
Me dijiste que las enviarías para intercambiar. Hoy la ciudad usa **grey-box**
(cubos wireframe) y el copy de las 8 mascotas del informe. Cuando las tengas:
- El vínculo mascota↔servicio es el campo `district` (ya en la BD). Cambiar una
  asignación es editar `prisma/seed-data.ts` y re-sembrar.
- La presentación de cada mascota (nombre, frase, color, posición) vive en
  `src/city/districts.ts` — un solo archivo.
- Los modelos 3D reales reemplazan las primitivas en `src/city/scene/`.

Formato ideal para entregarme: modelos `.glb` optimizados (Draco/KTX2) o, si es
ilustración 2D, PNG/SVG con transparencia + la paleta de cada una.

### 4. Casos reales del portafolio
`src/city/cases.ts` tiene **17 casos con contenido placeholder** (inventado por mí,
plausible pero no real). Necesito de ti los casos reales:
- Por distrito: título, una frase, una métrica ("+30% reservas"), y 2-3 párrafos.
- Si tienes video/imágenes de cada caso, dímelo y los integro en el nivel 3.

### 5. Sonidos reales (opcional)
El sonido opt-in funciona con **tonos sintetizados** provisionales. Si quieres
branding sonoro real (jingle, cues de marca), entrégame los archivos de audio
cortos (`.mp3`/`.ogg`) y los enchufo en `src/city/sound/engine.ts`.

---

## 🟡 Decisiones que necesito que confirmes

### 6. Precios (D-11)
Definí precios económicos para emprendedores (COP 280k–1.9M en servicios; planes
mensuales desde $654k/mes; corporativo hasta $4.6M). **Revisa la tabla** en
`DECISIONS.md` (D-11) y dime si los ajusto. Es lo único del modelo comercial que
inventé con criterio y conviene que valides.

### 7. WhatsApp y correo de contacto
En el código quedaron estos valores (de tu sitio actual). Confirmá que siguen
vigentes:
- WhatsApp: `+57 324 768 0413`
- Correo admin de leads: `loqueseaproductionsp1@gmail.com`

### 8. Qué hacer con las páginas legacy que sobreviven
Siguen vivas (con su estética vieja): `/nosotros`, `/contacto`, `/portafolio`,
`/login`, `/registro`, `/mi-proyecto`. ¿Las rediseñamos con el lenguaje de la
ciudad, las dejamos así, o las retiramos? Hoy son alcanzables desde el menú de
escape y el Header legacy.

---

## ✅ Lo que ya está hecho y verificado (no necesitas hacer nada)

- **Fases 0–4**: fundaciones, modelo comercial, hub, preloader real, transición
  cortina, 8 distritos con casos y nivel 3, sonido opt-in, easter egg, Whispers,
  cotizador-conversación (Ayuntamiento) con matriz y propuesta navegable, menú de
  escape, y la ciudad como home (`/`).
- **CI bloqueante en verde**: LCP <2.5s, CLS <0.1, TBT <200ms (proxy INP),
  accesibilidad ≥0.9, sobre `/`, `/ciudad/reel`, `/ayuntamiento`.
- **Presupuestos**: app shell 149 kB, total 482 kB, `three` fuera del arranque.
- **Fallbacks**: móvil/GPU débil (Concepto 2) y `prefers-reduced-motion` en la
  misma implementación (un solo hook, tres modos).
- **Bugs latentes corregidos**: fuga de rAF en Lenis, cursor de pato que mataba el
  INP, API de leads con campos inexistentes, API de servicios ordenando por campo
  inexistente, contraste de color, zoom bloqueado, targets táctiles pequeños.
- Todas las decisiones no obvias están en `DECISIONS.md` (D-01 a D-13).

---

## Cómo revisarlo tú mismo

```bash
git checkout redesign/ciudad-del-pato
npm install
npm run dev
```
Abre `http://localhost:3000` — es la ciudad. Prueba: entrar a un distrito (cortina
de color), un caso (deep-dive), el cotizador (botón menú → Ayuntamiento, o
`/ayuntamiento`), el toggle de sonido, teclear `pato`, y el menú (☰ arriba a la
derecha). En móvil o con "reduce motion" activo verás el fallback 2D.
