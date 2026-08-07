# Andamios generados por IA — NO ES MATERIAL REAL

**Nada de lo que se lista aquí sirve para publicar.** Son imágenes generadas con
higgsfield (conector autorizado por el usuario) para que el rediseño se pueda
maquetar y evaluar **mientras llega el material fotográfico real del cliente**.

Reglas de esta carpeta:

- Todo archivo que entre aquí lleva el prefijo **`ANDAMIO-`**. Si un archivo de
  `assets/` no lleva ese prefijo, es material real; si lo lleva, es relleno.
- Ningún andamio se referencia desde una versión publicada del sitio. Sirven
  para maquetar, medir encuadres y decidir composición — nada más.
- Cuando llegue el material real, se borra el andamio, **no se convive con él**.
- Nada de esto retrata personas, lugares ni productos reales de LQS. El plato,
  el taller, las manos y la ropa son inventados.

---

## Estado: generadas, NO descargadas

Las seis imágenes **se generaron correctamente**, pero **no se pudieron
descargar a este repositorio**. La carpeta está vacía de imágenes a propósito.

El CDN de higgsfield (`d8j0ntlcm91z4.cloudfront.net`) está bloqueado por la
política de egreso del entorno: el proxy responde `403` al `CONNECT`
(`connect_rejected — gateway answered 403`). No es un fallo de TLS ni algo que
se arregle reintentando, y el README del proxy indica explícitamente no rodearlo.

**Para bajarlas hay que abrir las URLs desde un navegador normal, fuera de este
entorno**, y guardarlas en esta carpeta con el nombre indicado en cada fila.

---

## Inventario

Formato de origen: PNG. Al guardarlas, conviértelas a JPG o WebP antes de usarlas.

### 1. Taller creativo — reemplaza **A1.1** (espacio de trabajo, horizontal)

- Archivo destino: `ANDAMIO-taller-01.jpg`
- 16:9 · 1376×768 · modelo `nano_banana_2`
- https://d8j0ntlcm91z4.cloudfront.net/user_3FC2MG2g196Sv5wLI3Bzxv5SckO/hf_20260807_145926_a044f85f-d6b9-4aab-b4fa-d5157a8a76c3.png

Mesa de trabajo con herramientas reales, luz natural de ventana, monitores al
fondo, pared de ladrillo. Documental, sin gente posando.

### 2. Antes / después de producto — reemplaza **A2.1 y A2.2** ⭐

Es la pieza más importante del plan de producción. Las dos imágenes son **el
mismo plato** (bandeja paisa): el "después" se generó primero y el "antes" se
derivó de él pasándolo como referencia, así que la comida y el encuadre coinciden.

**Antes** (celular, mal iluminado, fondo desordenado) — `ANDAMIO-antes-01.jpg`

- 4:3 · 1200×896 · modelo `nano_banana_2` (imagen a imagen, referencia = el "después")
- https://d8j0ntlcm91z4.cloudfront.net/user_3FC2MG2g196Sv5wLI3Bzxv5SckO/hf_20260807_150354_fc77f1be-2c92-49b2-b81f-9fd30e57fab1.png

**Después** (buena luz, fondo limpio, calidad de catálogo) — `ANDAMIO-despues-01.jpg`

- 4:3 · 1200×896 · modelo `nano_banana_2`
- https://d8j0ntlcm91z4.cloudfront.net/user_3FC2MG2g196Sv5wLI3Bzxv5SckO/hf_20260807_150006_d1b0c547-a60c-44b3-9b9a-e04fc284f5d3.png

> Verifica a ojo que el plato coincide antes de montarlas en un comparador. Si
> no coincide lo suficiente, hay que regenerar el "antes" — y para eso hacen
> falta créditos (ver más abajo).

### 3. Manos trabajando — reemplaza **A1.2**

- Archivo destino: `ANDAMIO-manos-01.jpg`
- 16:9 · 1376×768 · modelo `nano_banana_2`
- https://d8j0ntlcm91z4.cloudfront.net/user_3FC2MG2g196Sv5wLI3Bzxv5SckO/hf_20260807_150354_d5546c7b-69ae-41ce-823d-d6f2f3833e48.png

Primer plano de manos dibujando con lápiz óptico sobre tableta, luz cálida
lateral, cara fuera de cuadro.

### 4. Ropa y merch — reemplaza **A5.1** (prenda plana sobre fondo neutro)

- Archivo destino: `ANDAMIO-merch-01.jpg`
- 4:3 · 1200×896 · modelo `nano_banana_2`
- https://d8j0ntlcm91z4.cloudfront.net/user_3FC2MG2g196Sv5wLI3Bzxv5SckO/hf_20260807_150354_26287b45-a5de-4dbe-9b53-b10259d9a140.png

Camiseta negra doblada y gorra a juego, cenital, fondo gris claro. El estampado
es una marca abstracta **inventada** — no es el logo de LQS, que todavía no
existe en archivo (pendiente **B1**).

### 5. Textura abstracta de fondo — universo `flujo`

- Archivo destino: `ANDAMIO-textura-flujo-01.jpg`
- 16:9 · 2048×1152 · modelo `z_image`
- https://d8j0ntlcm91z4.cloudfront.net/user_3FC2MG2g196Sv5wLI3Bzxv5SckO/hf_20260807_150333_08c5a32c-0e6f-4a52-a34d-c9ccb9559806.png

Masas de color a la deriva en morado / cian / magenta sobre negro profundo, con
grano. Pedida contra la paleta de `flujo` (`#7c5cff` `#00d4ff` `#ff3d7f`).

> Ojo: esta se generó con un modelo distinto y más barato que las demás, porque
> se acabó el presupuesto de créditos. Es la que más probablemente haya que
> rehacer — y es también la única de las cinco que se puede resolver sin IA,
> con degradados CSS y la capa `.grano` que el sitio ya tiene.

---

## Límites del entorno con los que se topó esto

Anotado para no volver a descubrirlo:

- La cuenta de higgsfield está en **plan gratuito**. Los modelos
  `nano_banana`, `nano_banana_2_lite` y `seedream_v4_5` devuelven
  `403 job_minimum_basic_plan_required` — no se pueden usar sin plan de pago,
  por baratos que salgan en el preflight de costo.
- Los que sí funcionaron en gratuito: **`nano_banana_2`** (1,5 créditos) y
  **`z_image`** (0,15 créditos).
- Se partió de **8 créditos** y quedaron **0,35**. No hay margen para
  regenerar nada sin recargar.
- El CDN de resultados está bloqueado por política de egreso. Cualquier sesión
  futura que genere imágenes aquí tendrá el mismo problema: **genera, pero no
  descarga**.
