# Auditoría de precios — dónde está cada número y cuál se contradice

Fecha del barrido: 11 de agosto de 2026.
Alcance: `index.html`, los doce `mundos/*.html`, `propuestas/automatizacion.html`,
`propuestas/catalogos.html`, `propuestas/distrito-peru-automatizacion.html` y la
tabla `paquetes` de Supabase (proyecto `lqs`, `blzzzklljdvsyudlrvbt`).

**Esto es solo la auditoría.** No se unificó ningún precio: el dueño decide con
esta tabla en la mano. Nada de lo que sigue se aplicó al código.

Dos exclusiones a propósito:

- `propuestas/distrito-peru-automatizacion.html` tiene precio de lanzamiento
  (**$3.400.000 único + $390.000/mes**) y ya se envió al cliente. Queda fuera de
  cualquier unificación; se anota aquí solo para que nadie lo «corrija».
- `propuestas/catalogos.html` va sin precios a propósito. Está limpia: los cinco
  `$` que aparecen son ceros de la calculadora (`$0`) y un ejemplo de copy
  («flete incluido desde $2.000.000»). No hay nada que unificar ahí.

---

## 1. El resumen en una línea

Hay **nueve contradicciones duras** — el mismo servicio con dos o más precios
incompatibles — y **una regla rota**: si se mezclan dos listas del repo, un combo
sale más caro que la suma de sus partes.

| # | Qué | Rango encontrado | Gravedad |
| --- | --- | --- | --- |
| C1 | Reel | $120.000 – $920.000 | **crítica** (7,6×) |
| C2 | Video del local / institucional | $950.000 – $1.900.000 | **crítica** (2×) |
| C3 | Foto suelta | $14.000 – $22.000 | alta (rompe la regla del combo) |
| C4 | Paquete de 20 fotos | $320.000 – $360.000 | alta |
| C5 | Automatización · plan Multicanal | $2.100.000 – $2.400.000 | alta |
| C6 | Automatización · mensualidad | $180.000 – $650.000 | **crítica** |
| C7 | Carga del catálogo | $280.000 – $460.000 | alta (en la misma página) |
| C8 | Anillo de Mercury | $180.000 – $280.000 | media (en la misma página) |
| C9 | Menú / carta digital | $180.000 – $1.290.000 | alta |
| R1 | Combo > suma de partes | ver §4 | **rompe la regla dura** |

---

## 2. Tabla completa: cada precio y dónde vive

### 2.1 Producción audiovisual

| Servicio | Precio | Archivo · sitio |
| --- | --- | --- |
| Reel suelto | **$140.000** | `propuestas/automatizacion.html` · armable (`data-p2="140000"`) |
| Combo · 4 reels | **$480.000** ($120.000 c/u) | `propuestas/automatizacion.html` · armable |
| Reel adicional | **$340.000** | `mundos/productora.html` · extras |
| Reel profesional | **desde $340.000** | `mundos/productora.html` · comparativa de mercado |
| Pack Reels · 4 reels | **$1.290.000** ($322.500 c/u) | `mundos/productora.html` · planes |
| Pack Reels · 4 reels | **$1.290.000** | Supabase `paquetes`, universo `productora` |
| Edición de reel | **$120.000 c/u** | `mundos/creadores.html` · extras (solo edición) |
| Reel · desglose de rodaje | base $420.000 + equipo $210.000 + post $290.000 = **$920.000** | `mundos/productora-calculadora.html` |
| Video del local · hasta 90 s | **$950.000** | `propuestas/automatizacion.html` · armable |
| Video Institucional · hasta 90 s | **$1.900.000** | `mundos/productora.html` · planes |
| Video institucional | **$1.900.000** | Supabase `paquetes` |
| Video institucional · desglose | 780.000 + 240.000 + 520.000 = **$1.540.000** | `mundos/productora-calculadora.html` |
| Video institucional · mercado | $2.500.000 – $6.000.000 | `mundos/productora.html` · comparativa |
| Cobertura de evento · 4 h | **$650.000** | `mundos/productora.html` · extras |
| Cobertura de evento · 4 h | **$650.000** | `propuestas/automatizacion.html` · armable |
| Cobertura de evento · desglose | 340.000 + 200.000 + 230.000 = **$770.000** | `mundos/productora-calculadora.html` |
| Jornada completa de rodaje | **$2.400.000** | `mundos/productora.html` · extras |
| Spot publicitario · desglose | 1.250.000 + 290.000 + 760.000 = **$2.300.000** | `mundos/productora-calculadora.html` |
| Locución profesional | **$180.000** | `mundos/productora.html` · `propuestas/automatizacion.html` · calculadora |
| Recargos de la calculadora | Medellín $0 · área metropolitana +$90.000/día · oriente +$220.000/día + viáticos $72.000 · otra ciudad +$650.000 + viáticos $185.000 | `mundos/productora-calculadora.html` |
| Extras de la calculadora | luz $240.000/día · dron $380.000 · locución $180.000 · maquillaje $220.000/día · segunda cámara $320.000/día · música $150.000 | `mundos/productora-calculadora.html` |
| Entrega express 48 h | +35 % | `mundos/productora.html` |

### 2.2 Fotografía

| Servicio | Precio | Archivo · sitio |
| --- | --- | --- |
| Foto de plato / habitación / producto, suelta | **$22.000 c/u** | `propuestas/automatizacion.html` · armable |
| Foto adicional editada | **$14.000 c/u** | `mundos/productora.html` · extras |
| Paquete de 20 fotos | **$360.000** ($18.000 c/u) | `propuestas/automatizacion.html` · armable |
| Foto Producto · 20 fotos | **$320.000** ($16.000 c/u) | `mundos/productora.html` · planes |
| Foto de producto · 20 fotos | **$320.000** | Supabase `paquetes` |
| Foto de producto · 20 fotos | **$320.000** | `index.html` · `RESPALDO_P` |
| Sesión foto producto · mercado | $600.000 – $1.200.000 | `mundos/productora.html` · comparativa |
| Sesión de ambiente del lugar | **desde $320.000** | `propuestas/automatizacion.html` · armable |
| Sesión de fotos para el sitio | **desde $320.000** | `mundos/empresas.html` · extras |
| Sesión de fotos de perfil | **desde $280.000** | `mundos/creadores.html` · extras |
| Foto · desglose de rodaje | 260.000 + 180.000 + 150.000 = **$590.000** | `mundos/productora-calculadora.html` |

### 2.3 Automatización de WhatsApp

| Servicio | Precio | Archivo · sitio |
| --- | --- | --- |
| Plan Básico · montaje | **$780.000** + $180.000/mes | `mundos/automatizacion.html` · paquetes |
| Plan Básico · montaje | **$780.000** + $180.000/mes | `index.html` · `waPlanes` |
| Plan Negocio · montaje | **$1.450.000** + $340.000/mes | `mundos/automatizacion.html` |
| Plan Negocio · montaje | **$1.450.000** + **$180.000/mes** | `index.html` · `waPlanes` |
| Plan Multicanal · montaje | **$2.400.000** + $560.000/mes | `mundos/automatizacion.html` |
| Plan Multicanal · montaje | **$2.100.000** + **$180.000/mes** | `index.html` · `waPlanes` |
| Automatización WhatsApp (extra) | **$780.000** + $180.000/mes | `mundos/empresas.html` · extras |
| Implementación (muestra de empresas) | **$1.850.000** | `mundos/empresas-muestras.html` |
| Acompañamiento mensual | **$260.000/mes** | `mundos/empresas-muestras.html` |
| Soporte y mantenimiento | **$260.000/mes** | `mundos/empresas.html` · extras |
| Sistema base completo | **desde $6.400.000** pago único | `propuestas/automatizacion.html` · precio |
| Mensualidad del sistema | **desde $650.000/mes** con 1.000 conversaciones | `propuestas/automatizacion.html` · precio y `var NUCLEO_MES` |
| Instagram y Facebook en la bandeja | **$950.000** + $220.000/mes | `propuestas/automatizacion.html` · armable |
| Conexión con Booking y Expedia | **$1.250.000** + $180.000/mes | `propuestas/automatizacion.html` · armable |
| Informe mensual de analítica | **$190.000/mes** | `propuestas/automatizacion.html` · `mundos/empresas.html` |

Costos de terceros declarados (no son precio de venta):

| Concepto | Cifra | Dónde |
| --- | --- | --- |
| Mensaje de utilidad de Meta | ≈ $3 c/u | `index.html`, `mundos/automatizacion.html`, `propuestas/automatizacion.html` |
| Mensaje de marketing de Meta | ≈ $45 – $56 c/u (una fuente dice ≈ $50) | `mundos/automatizacion.html` vs `index.html` |
| Mensaje de autenticación | ≈ $3 (una fuente) / ≈ $10 (otra) | `mundos/automatizacion.html` vs `index.html` |
| Dominio propio | ≈ $70.000 / año | `propuestas/automatizacion.html` |
| Supabase | gratis al inicio · ≈ $110.000 / mes al crecer | `propuestas/automatizacion.html` |
| Comisión de pasarela | 2,8 % – 3,5 % por venta | `propuestas/automatizacion.html` |

### 2.4 Marca, web y piezas

| Servicio | Precio | Archivo · sitio |
| --- | --- | --- |
| Identidad Esencial | **$890.000** | `mundos/empresas.html` · Supabase · `propuestas/automatizacion.html` · `index.html` `RESPALDO_P` |
| Presencia Digital | **$1.850.000** | `mundos/empresas.html` · Supabase |
| Despegue Total | **$3.900.000** | `mundos/empresas.html` · Supabase · `index.html` `RESPALDO_P` |
| Tienda online (e-commerce) | desde $3.600.000 | `mundos/empresas.html` · extras |
| Sección extra en el sitio | **$260.000** | `mundos/empresas.html` · `propuestas/automatizacion.html` |
| Pieza suelta (flyer) | **$45.000** | `mundos/express.html` · Supabase · `index.html` hero y `RESPALDO_P` |
| «Precios desde $35.000» | **$35.000** | `mundos/express.html` · dos `<meta>` (description y og:description) |
| Flyer | **$45.000** | `mundos/express-muestras.html` · configurador |
| Post para redes | **$32.000** | `mundos/express.html` · `express-muestras` · `propuestas/automatizacion.html` |
| Tarjeta personal | **$65.000** | `mundos/express.html` · `express-muestras` |
| Logo básico | **$220.000** | `mundos/express.html` · `express-muestras` |
| Combo Emprendedor | **$390.000** | `mundos/express.html` · Supabase · `index.html` `RESPALDO_P` |
| Pack Contenido · 12 piezas/mes | **$290.000/mes** | `mundos/express.html` · Supabase · `propuestas/automatizacion.html` |
| Ronda extra de ajustes | $25.000 | `mundos/express.html` |
| Adaptación a otro formato | $18.000 | `mundos/express.html` |
| Archivos editables (fuente) | $60.000 | `mundos/express.html` |
| Menú digital de 1 página | **$180.000** | `mundos/express.html` · extras |
| Menú digital | **$690.000** | Supabase `paquetes`, universo `carta` |
| Carta + fotos | **$1.290.000** | Supabase `paquetes`, universo `carta` |
| Carta impresa / directorio / portafolio | **$380.000** | `propuestas/automatizacion.html` · armable |
| Urgencia 24 h | +40 % | `mundos/express.html` · `express-muestras` |
| Descuento por volumen (≥5 piezas) | −10 % | `mundos/express-muestras.html` |

### 2.5 Creadores

| Servicio | Precio | Archivo · sitio |
| --- | --- | --- |
| Kit Arranque | **$450.000** | `mundos/creadores.html` · Supabase · `index.html` `RESPALDO_P` · `creadores-muestras` |
| Kit Pro | **$980.000** | `mundos/creadores.html` · Supabase |
| Contenido Mensual | **$690.000/mes** | `mundos/creadores.html` · Supabase |
| Plantillas adicionales (x10) | **$180.000** | `mundos/creadores.html` · `creadores-muestras` |
| Miniaturas YouTube (x5) | **$150.000** | `mundos/creadores.html` · `creadores-muestras` |
| Media kit para marcas | **$260.000** | `mundos/creadores.html` · `creadores-muestras` |
| Asesoría 1:1 (1 hora) | **$150.000** | `mundos/creadores.html` · `creadores-muestras` |

`mundos/creadores-muestras.html` (nuevo) toma sus precios de `creadores.html`;
no introduce ninguna cifra propia.

### 2.6 Ropa, merch y joyería

| Servicio | Precio | Archivo · sitio |
| --- | --- | --- |
| Merch de Marca (camiseta) | **desde $46.000/u**, mín. 20 | `mundos/foma.html` · Supabase · `propuestas/automatizacion.html` · `marcas-muestras` |
| Uniformes | **desde $68.000/u**, mín. 15 | `mundos/foma.html` · Supabase · `propuestas/automatizacion.html` |
| Prenda de Cápsula | desde $89.000 | `mundos/foma.html` |
| Hoodie / gorra / tote / delantal | $98.000 / $39.000 / $26.000 / $52.000 | `mundos/marcas-muestras.html` (no existen en `foma.html`) |
| Diseño de estampado original | **$180.000** | `mundos/foma.html` · `propuestas/automatizacion.html` |
| Muestra física previa | **$60.000** | `mundos/foma.html` · `propuestas/automatizacion.html` |
| Etiqueta cosida / empaque / bordado | $6.000 · $4.500 · +$12.000 c/u | `mundos/foma.html` |
| Descuento por volumen de prendas | −11 % desde 50 u · −19 % desde 100 u | `mundos/marcas-muestras.html` |
| Pieza de Colección | desde $95.000 | `mundos/mercury.html` |
| Pieza por Encargo | desde $280.000 | `mundos/mercury.html` |
| Línea Corporativa (pin) | desde $38.000/u, mín. 20 | `mundos/mercury.html` · Supabase (inactivo) |
| Catálogo Mercury | anillo $180.000 · dije $145.000 · aretes $126.000 · pin $38.000 · pulsera $210.000 · gemelos $168.000 | `mundos/marcas-muestras.html` · galería |
| Configurador Mercury | anillo $280.000 · dije $210.000 · aretes $190.000 · pin $38.000 · pulsera $260.000 · gemelos $240.000 · oro ×1,28 | `mundos/marcas-muestras.html` · configurador |
| Grabado personalizado | **$35.000** | `mundos/mercury.html` · `marcas-muestras` |

### 2.7 Supabase · tabla `paquetes`

20 filas, 18 activas. Coinciden con los HTML salvo lo anotado:

| universo | paquete | precio | ¿coincide? |
| --- | --- | --- | --- |
| `empresas` | Identidad Esencial / Presencia Digital / Despegue Total | 890.000 / 1.850.000 / 3.900.000 | sí |
| `express` | Pieza suelta / Pack Contenido / Combo Emprendedor | 45.000 / 290.000 / 390.000 | sí |
| `creadores` | Kit Arranque / Contenido mensual / Kit Pro | 450.000 / 690.000 / 980.000 | sí |
| `foma` | Merch de marca / Uniformes | 46.000 / 68.000 | sí |
| `productora` | Foto de producto / Pack Reels / Video institucional | 320.000 / 1.290.000 / 1.900.000 | sí con `productora.html`, **no** con la propuesta |
| `mercury` | Regalos corporativos / Pieza por encargo | 38.000 / 280.000 | inactivos (`activo=false`) |
| `carta` | Menú digital / Carta + fotos | 690.000 / 1.290.000 | **sin respaldo en ningún HTML** |
| `aloja` | Aloja Base / Aloja Completo | 2.400.000 / 4.600.000 | **sin respaldo en ningún HTML** |

`index.html` trae `RESPALDO_P`, una copia de emergencia con 7 de los 18
paquetes. No contradice ningún precio, pero está incompleta: si Supabase cae, el
visitante ve menos de la mitad del catálogo.

---

## 3. Las nueve contradicciones, en detalle

**C1 · El reel.** Es la peor. La misma unidad vale $120.000 (combo de la
propuesta), $140.000 (suelto en la propuesta), $322.500 (dentro del Pack Reels),
$340.000 (extra de Productora) y $920.000 si se arma en la calculadora de rodaje.
De extremo a extremo son **7,6 veces**. Un cliente que abra la propuesta y la
ficha de Productora en dos pestañas ve las dos cifras.

**C2 · El video del local.** $950.000 en la propuesta contra $1.900.000 en la
ficha de Productora y en Supabase, para la misma descripción («hasta 90 s,
jornada completa, edición, color y música con licencia»). La calculadora da
$1.540.000, que no es ninguno de los dos.

**C3 · La foto suelta.** $22.000 en la propuesta, $14.000 en Productora. La
diferencia es del 57 %.

**C4 · El paquete de 20 fotos.** $360.000 en la propuesta, $320.000 en Productora
y en Supabase.

**C5 · El plan Multicanal.** $2.400.000 en `mundos/automatizacion.html`,
$2.100.000 en `index.html`. Es el mismo plan con la misma lista de incluidos.

**C6 · La mensualidad de automatización.** `index.html` imprime «+ $180.000 al
mes» **fijo para los tres planes**, mientras la ficha dice 180.000 / 340.000 /
560.000 según el plan. Y la propuesta cobra $650.000/mes por el sistema completo.
Un mismo visitante puede ver $180.000 y $650.000 en dos clics.

**C7 · La carga del catálogo, dentro de la misma página.**
`propuestas/automatizacion.html` la cobra a **$280.000** en el armable (o gratis
con plantilla de Excel) y a **$460.000** en el desglose del sistema base
(«Carga del catálogo y capacitación»). Están a unos 300 renglones de distancia.

**C8 · El anillo de Mercury, dentro de la misma página.**
`mundos/marcas-muestras.html` lo muestra a **$180.000** en la galería y a
**$280.000** en el configurador de abajo. Igual con dije ($145.000 / $210.000),
aretes ($126.000 / $190.000), pulsera ($210.000 / $260.000) y gemelos
($168.000 / $240.000). El pin es el único que coincide ($38.000).

**C9 · La carta digital.** Supabase vende «Menú digital» a $690.000 y «Carta +
fotos» a $1.290.000; `mundos/express.html` vende «Menú digital de 1 página» a
$180.000 como extra. Además los universos `carta` y `aloja` de Supabase no
tienen ninguna página que los respalde — son precios que solo existen en la base
de datos.

**Menor · el «desde $35.000» de Express.** Las dos etiquetas `<meta>` de
`mundos/express.html` prometen «precios claros desde $35.000», pero la pieza más
barata de la página cuesta $45.000. Es lo que sale en Google y al compartir el
enlace.

**Menor · las tarifas de Meta.** `index.html` dice marketing ≈ $50 y
autenticación ≈ $10; `mundos/automatizacion.html` dice marketing ≈ $45–$56 y
autenticación ≈ $3.

---

## 4. La regla dura: ¿algún combo cuesta más que sus partes?

Se sumaron uno por uno. **Dentro de una misma lista, ningún combo falla.** Al
cruzar dos listas del repo, dos fallan:

| Combo | Precio | Suma de las partes | Veredicto |
| --- | --- | --- | --- |
| Combo · 4 reels (propuesta) | $480.000 | 4 × $140.000 = $560.000 | ✅ 14 % menos |
| Paquete de 20 fotos (propuesta) | $360.000 | 20 × $22.000 = $440.000 | ✅ 18 % menos |
| Combo Emprendedor (Express) | $390.000 | logo $220.000 + 6 posts $192.000 + tarjeta $65.000 = $477.000 | ✅ 18 % menos |
| Kit Pro (Creadores) | $980.000 | Kit Arranque $450.000 + 30 plantillas $540.000 + miniaturas $150.000 + asesoría $150.000 = $1.290.000 | ✅ 24 % menos |
| Despegue Total (Empresas) | $3.900.000 | Identidad $890.000 + Presencia $1.850.000 + Automatización $780.000 + 3 meses soporte $780.000 = $4.300.000 | ✅ 9 % menos |
| Núcleo del sistema (propuesta) | $6.400.000 | $6.830.000, declarado en la propia página | ✅ 6 % menos |
| Pack Reels (Productora) | $1.290.000 | 4 × $340.000 = $1.360.000 | ✅ apenas 5 % menos |
| **Paquete de 20 fotos (propuesta)** | **$360.000** | **20 × $14.000 (foto adicional de Productora) = $280.000** | ❌ **$80.000 más caro** |
| **Foto Producto (Productora)** | **$320.000** | **20 × $14.000 = $280.000** | ❌ **$40.000 más caro** |

Los dos fallos salen del mismo sitio: **el precio de la foto suelta no está
alineado entre la propuesta ($22.000) y Productora ($14.000)**. Con $22.000 los
dos paquetes cumplen; con $14.000 ninguno de los dos tiene sentido. Arreglar C3
arregla R1 de una vez.

Dos casos que no son combos pero apuntan al mismo problema:

- **Video institucional cerrado ($1.900.000) vs. armarlo en la calculadora
  ($1.540.000):** el paquete sale $360.000 más caro que pedir lo mismo suelto.
- **Cobertura de evento de lista ($650.000) vs. calculadora ($770.000):** aquí
  pasa lo contrario, la lista está $120.000 por debajo de lo que la propia
  calculadora dice que cuesta ejecutarla.

---

## 5. Las referencias del dueño, contrastadas con lo que hay

Precios ya decididos, y si el repo los respeta hoy:

| Referencia del dueño | ¿Está en el repo? |
| --- | --- |
| Foto de plato/producto suelta **$22.000** | Sí, en la propuesta. Productora la contradice con $14.000. |
| Paquete de 20 fotos **$360.000** | Sí, en la propuesta. Productora y Supabase dicen $320.000. |
| Reel suelto **$140.000** (grabación y edición) | Solo en la propuesta. Productora dice $340.000. |
| Combo de 4 reels **$480.000** | Solo en la propuesta. Productora vende Pack Reels a $1.290.000. |
| Video del local **$950.000** | Solo en la propuesta. Productora y Supabase dicen $1.900.000. |
| Carga de catálogo **$280.000** o gratis con Excel | Sí, en el armable. El desglose de la misma página dice $460.000. |
| Mensualidad **$650.000** con 1.000 conversaciones | Sí, en la propuesta. `index.html` promete $180.000/mes. |
| **$180 por conversación extra** | **No está escrito en ninguna parte del repo.** La propuesta solo dice «arriba de eso se ajusta por tramos». |

Costos mensuales reales que hay que cubrir (dato del dueño, para calcular el
piso cuando se decida unificar):

| Concepto | Costo real | ¿Declarado en el sitio? |
| --- | --- | --- |
| Proveedor de API de WhatsApp | $180.000 – $250.000 / mes | No aparece en ningún archivo |
| Meta, por conversación | variable | Sí, ≈ $3 utility (con las discrepancias de §3) |
| Supabase | $0 – $100.000 / mes | Sí, la propuesta dice «gratis al inicio · ≈ $110.000 al crecer» |
| Dominio | ≈ $60.000 / año | Sí, la propuesta dice ≈ $70.000 / año |

Dos de los cuatro costos duros están escritos con una cifra distinta a la del
dueño, y el más grande de todos —el proveedor de API, de $180.000 a $250.000 al
mes— **no está declarado en ninguna parte**. Cualquier piso de costo que se
calcule hoy con lo que dice el sitio saldría por debajo del real.

---

## 6. Qué queda por decidir (no se tocó nada)

En orden de cuánto cuesta dejarlo así:

1. **Cuál es el precio del reel** y si el Pack Reels de $1.290.000 sigue
   existiendo al lado de un combo de 4 por $480.000.
2. **Cuál es el precio del video del local**: $950.000 o $1.900.000.
3. **Cuál es la mensualidad de automatización** y cómo se relaciona el
   «+ $180.000 al mes» de `index.html` con los $650.000 de la propuesta. Falta
   escribir en algún lado el precio de la conversación extra ($180).
4. **Foto suelta a $22.000 o $14.000.** De esto depende que los paquetes de foto
   dejen de costar más que sus partes.
5. **Carga del catálogo**: alinear el armable ($280.000) con el desglose
   ($460.000) dentro de `propuestas/automatizacion.html`.
6. **Mercury**: la galería y el configurador de `marcas-muestras.html` tienen que
   contar el mismo precio.
7. **Supabase**: los universos `carta` y `aloja` venden paquetes que no existen
   en ninguna página, y `RESPALDO_P` en `index.html` solo cubre 7 de 18.
8. **El «desde $35.000»** de las etiquetas de Express: o baja el precio o cambia
   el texto, porque es lo que ve Google.
9. **Declarar el costo del proveedor de API de WhatsApp** ($180.000–$250.000/mes)
   donde hoy solo se declaran los de Meta, Supabase y el dominio.
