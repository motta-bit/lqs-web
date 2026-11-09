# Muestras

Las cinco muestras de marca —Atelier Norte, Rescoldo, Tendido, Casa Tepemete y
Turno— salieron de aquí: **ya viven en la página principal**, en
`mundos/*-muestras.html`, que es lo que abre el visor interno. Tenerlas también
aquí era una segunda copia que nadie abría, con 4,8 MB de imágenes detrás.

Lo que queda es lo que se cuelga para compartir por enlace.

| Archivo | Qué es |
|---|---|
| `alquimia-herbal.html` | **Alquimia Herbal** · la propuesta de trabajo con el catálogo de muestra dentro |
| `restaurantes.html` | **Restaurantes** · muestra de estilo y propuesta de digitalización, para enseñar en reunión |
| `tiendas.html` | **Tiendas y almacenes** · la misma propuesta con catálogo, tallas y existencias en vez de carta |
| `bodegas.html` | **Bodegas y tiendas de productos** · catálogo por presentación, precio por unidad calculado y existencias reales |
| `catalogos.html` | **Maquetación de catálogo** · cuatro maneras de maquetar una carta o un catálogo, rehechas en español desde las referencias del cliente |
| `pruebas/` | Las comprobaciones de las cuatro muestras, con su propio LEEME |
| `index.html` | Salto a Alquimia, para que la URL de la carpeta abra sin escribir el nombre |

## `restaurantes.html`

Muestra de rubro, no de cliente: sirve para cualquier restaurante. **El
recorrido es el armado** — bajando, la página del restaurante se monta pieza
por pieza y cada módulo se explica justo al lado, hasta quedar completa y
funcionando al final.

Lo que de verdad funciona, porque es el argumento entero:

- La carta filtra por categoría y suma el pedido en pesos.
- **Las cuatro formas de acomodarla**, en el riel de al lado: tarjetas,
  carrusel, bento y libre. Se escogen y la carta se rearma de verdad; el
  marcado de cada plato es el mismo en las cuatro y solo cambia el CSS, por
  eso el «+» y el carrito siguen sirviendo igual. En carrusel se arma una tira
  por categoría, que es como se ve una carta así de verdad.
- El mensaje de WhatsApp **se escribe solo** con los platos, el total y la
  dirección si es domicilio.
- El recorrido de pago entero: resumen, medio de pago y confirmación.
- El cambio español/inglés, que funciona **también sin JavaScript** (anclas
  `#es`/`#en` y `:has`, no un guion).
- La franja de temporada, con su vigencia. El tercer plato de cada temporada
  también está en la carta, al mismo precio y a propósito: así es como se usa
  una franja así, y el carrito los junta porque se agrupan por nombre.

Cierra con el checklist **con y sin LQS**, la línea del dominio, **el resumen**
—siete ganancias, una línea cada una, escritas desde lo que gana el restaurante
y no desde el nombre del módulo— y la pregunta de cierre con la firma. Abajo del
todo, un solo botón: volver al inicio. Desde la portada se salta ahí con «Ir al
resumen»; son los dos únicos saltos de la página.

**Está escrita para enseñarla a un cliente, no para leerla puertas adentro.**
No lleva sellos de «maqueta» ni de «listo», ni notas técnicas, ni el detalle de
lo que falta por conectar en Wompi: eso se cuenta hablando, no en la página. Lo
único que queda escrito es una línea de «demostración · no se cobra» dentro de
la pantalla de pago aprobado, porque una confirmación de pago sin esa línea es
un recibo falso aunque nadie lo pretenda.

### Nada con fecha

Es una muestra abierta, para llevarla a cualquier restaurante el día que sea,
así que **no lleva nada que envejezca**: ni mes en la insignia de la portada,
ni «un martes cualquiera» en el checklist —es un día cualquiera—, ni un año
escrito en la ficha vieja de Google, que ahora dice «desde hace dos años».

La vigencia de la temporada **sale del reloj del aparato**, no está escrita a
mano: la primera franja vence el último día de este mes y la segunda el del
siguiente, con los bisiestos bien. Era justo la frase que más envejecía, y en
la sección que presume de vencerse sola: «hasta el 30 de noviembre» leído en
marzo dice lo contrario de lo que se vende. Hay una prueba que lo comprueba
adelantando el reloj, y otra que falla si vuelve a aparecer un año escrito a
mano en cualquier parte de la página.

### Las fotos

Las 14 fotos vienen del cliente y **la carta está escrita contra ellas**: cada
descripción dice lo que se ve en su imagen, no al revés. Por eso Cardamomo pasó
de «cocina colombiana de mercado» a **cocina de autor**: los platos que llegaron
son de ese registro, y dejar la descripción vieja encima de la foto nueva habría
sido mentir en la propia muestra.

**Son de referencia, y el pie de página lo dice.** No están licenciadas para uso
comercial: sirven para enseñar la muestra, no para publicar la página de un
restaurante. En su lugar van las del cliente, y el cambio es mecánico —se
reemplaza el archivo en `fotos/` y se vuelve a construir—.

Viven en `clientes/muestra-restaurantes/fotos/` como WebP de 640 × 640 (la del
local, apaisada, de 1200 × 560) y entran al HTML con:

    cd clientes/muestra-restaurantes
    python3 construir-fotos.py ../../demos/restaurantes.html

El script las mete en base64 como variables `--f-<nombre>` de `:root` y avisa si
alguna sobra o si falta la de algún plato. Son variables y no `<img>` porque el
mismo cuadrado se ve a 72 px en la carta, a 150 en el carrusel y a 300 de ancho
en la disposición libre: con `background-size:cover` una sola copia sirve para
las cuatro. Todo junto son 444 KB dentro de un archivo de 536 KB, que sigue
abriendo sin red.

### Cuatro decisiones que conviene no deshacer sin medir

1. **La foto es un `<span>` con `display:block` explícito.** A un inline no le
   aplican ni `width` ni `height`. En la carta no se notaba, porque el plato es
   un grid y eso blockifica a sus hijos; en las tarjetas de temporada, que son
   bloques normales, la foto salía de 0 × 0. Es el mismo tropiezo del sello de
   Alquimia, y ahora hay una prueba que lo caza.
2. **Los dos tonos medios están fijados por medición.** `--tinta-66` y
   `--tinta-70` salen de medir contraste sobre el compuesto real, elemento por
   elemento; con la opacidad que tenían antes (.52) el texto pequeño se
   quedaba en 3,2:1. Lo mismo con `--arcilla-h`, `--verde-texto` y
   `--ambar-fuerte`: el blanco sobre el ámbar se queda en 2,3:1.
3. **El cambio de idioma cuelga de `:has(#en:target)` a propósito.** Un
   `.en{display:none}` pelado lo tumba cualquier regla local que toque
   `display` —pasó con `.cifras-hero span`— y salen los dos idiomas a la vez.
4. **El padding de sección va en `main > section`, con el hijo directo.** Sin
   él, el `<section>` de cada categoría del carrusel heredaba 90 px y abría un
   hueco de media pantalla. Lo mismo que pasó con el `<main>` anidado de
   Alquimia: una regla de elemento pelada muerde en cuanto se anida algo.

El dominio va en una línea y nada más: que al valor del trabajo se le suma el
del nombre de la página, y que varía según el que se escoja. La cifra exacta se
confirma el día de la compra, hablando, no en la muestra.

## `tiendas.html`

Hermana de la de restaurantes: **mismo sistema y otro rubro**. El vidrio, el
grano, la escala tipográfica, el riel de cuatro disposiciones y el recorrido
—siete módulos, checklist, resumen y cierre— son los mismos. Lo que allá era
la carta aquí es el catálogo.

**La paleta sí cambia, y a propósito**: hueso frío con un solo acento de
arcilla, en vez del ámbar de restaurantes. Se reconoce el mismo estudio y no
se confunden las dos sobre la mesa. El blanco sobre la arcilla sí pasa
contraste —5,0:1—, al revés que sobre el ámbar, así que el botón de pagar
vuelve a texto blanco.

Lo que una tienda tiene y un restaurante no, y que por eso está hecho de
verdad y no descrito:

- **Tallas y colores.** Cada producto trae las suyas, la escogida se marca y
  viaja hasta el mensaje de WhatsApp: «1 × Camisa de lino (Talla M)».
- **Existencias.** La talla agotada se tacha y no se puede escoger; el
  producto agotado del todo lo dice y se queda sin botón de añadir. No se
  esconde: esconderlo haría creer que el catálogo es más corto, y quien ya
  vio la foto en Instagram volvería a preguntar.
- **Envío.** Entra calculado dentro del total, que es la pregunta donde se
  cae la venta de otra ciudad, y el carrito se agrupa por producto **y**
  variante: dos tallas del mismo producto son dos líneas, que es lo que le
  hace falta a quien va a empacar la caja.

**Todavía no hay fotos de la tienda.** Cada hueco se ve como lo que es —el
sitio donde va la suya, con su tono de categoría y su etiqueta «tu foto»—. El
tono por categoría no es decoración: hace que la cuadrícula lea como un
catálogo y no como diez rectángulos iguales en blanco. Cuando lleguen las
fotos se cambia `background-image` y el marcado no se toca.

Dos cosas que salieron al armarlo y conviene no repetir:

1. **El carrito de arranque se siembra por id, no por posición.** Meter un
   producto en medio del arreglo corría los índices y la muestra abría con
   «Chaqueta de lona (Talla Miel)».
2. **En tarjetas la ficha va a dos columnas, no a tres.** Con el precio en su
   propia columna —y los precios de una tienda son más largos que los de una
   carta— «Camisa de lino» se partía en dos líneas y la descripción caía a
   cuatro. El precio y el «+» bajan a su propia fila.

## `bodegas.html`

La tercera del juego, y **la que cambia de mecánica**. En restaurantes se pide
un plato; en la tienda de ropa, una talla; en una bodega se pide una
**presentación** —la unidad, el six-pack, la caja de 24— y lo que decide la
compra es el precio por unidad y cuántos quedan.

Tercera paleta, para que las tres se distingan sobre la mesa: papel frío con
un acento de oliva. El oliva se escogió por medición: pasa contraste en los
dos sentidos —blanco encima, 7,2:1; encima de la nata, 7,0:1— así que un solo
tono hace de acento y de texto, sin fabricar una segunda versión como tocó en
las otras dos.

Lo que hace de verdad y no describe:

- **El precio por unidad lo calcula la página.** Es la cuenta que decide si se
  llevan la caja y la que nadie hace en el chat. Se toca una presentación y
  debajo aparece: la caja de 24 del atún sale a $8.167 c/u frente a $9.800 la
  unidad.
- **Las existencias son un número, no un sí o un no.** Del tomate quedan 9, así
  que la caja de 12 se bloquea sola. De ahí sale todo: una presentación se
  puede pedir si sus unidades caben en lo que queda, y nadie tiene que
  acordarse de desmarcar nada. La pasta está en cero: lo dice y no tiene botón.
- **El carrito cuenta unidades, no líneas.** «3 productos» no dice nada si uno
  de ellos es una caja de 24; la barra dice «28 unidades».
- **El mínimo de bodega se llena mientras arman el pedido.** Hoy eso se
  resuelve con un «es que el pedido mínimo son cuatrocientos» por chat, cuando
  el cliente ya armó la lista, y ahí se cae la venta.

Tres decisiones que conviene no deshacer sin mirar:

1. **El mínimo está por encima del pedido con el que arranca la muestra.** Con
   324.000 de 400.000 la barra abre a medias y dice «faltan $76.000»; añadir
   una caja la completa. Puesto por debajo, abría llena y no demostraba nada.
2. **El pie de cada ficha va en una sola línea y cruza las dos columnas.**
   Encerrado en la segunda tenía 179 px y el «+» se caía a un renglón suyo.
   Probé también darle al «+» una tercera columna: al quitarle 42 px al
   contenido, las presentaciones se apilaban una por renglón.
3. **El nombre del archivo viejo del módulo 7 no lleva mes.** `lista_precios_v4`
   y no `lista_precios_marzo`: la prueba de fechas solo caza años escritos a
   mano, pero un mes envejece igual.

## `catalogos.html`

No es una propuesta: es un **muestrario de maquetación**. Llegaron once
referencias de catálogo y carta, y el encargo era pasarlas al español
manteniendo el diseño. Lo que no se puede hacer es retocar el texto dentro
del JPG: se nota siempre. Así que están **rehechas**, no traducidas encima
de la imagen, conservando la composición, la paleta y la jerarquía
tipográfica de cada una.

Las once se repiten entre sí, así que lo honrado era una de cada familia y
no once casi iguales:

1. **Carta oscura con título grande** — pocos platos, mucho aire, los platos
   entrando por los bordes.
2. **Parrilla densa** — veinte productos en una página doble, con el precio
   primero y grande y la ficha en gris diminuto.
3. **Catálogo claro de producto** — blanco, serif para la sección, la
   cuadrícula con su referencia al lado de cada pieza.
4. **Bloques de color** — cada sección un color plano, con el nombre vertical
   en el lomo.

Dos decisiones de fondo:

- **Las medidas van en `cqw`, no en píxeles.** `cqw` es el porcentaje del
  ancho de la hoja, y cada hoja es un contenedor de consulta. Así la hoja
  entera escala como una sola pieza: la proporción entre el título y el
  precio es la misma a cualquier tamaño, que es justo lo que la hace leerse
  como impresa. Si alguien le quita el `container-type` a `.hoja`, todas las
  medidas se van a cero y la hoja sale en blanco **sin dar ningún error**;
  por eso la prueba lo comprueba aparte.
- **En el teléfono la hoja se desliza, no se desarma.** Cada una tiene su
  ancho mínimo y vive dentro de un visor que rueda de lado, como se desliza
  una página doble de verdad. Partirla en una columna sería enseñar otra
  maquetación distinta de la que se está vendiendo.

Cuatro cosas que costó medir y conviene no deshacer:

1. **La hoja 1 lleva las entradas puestas a mano, en absoluto.** Nada impide
   que se monten: a `3,5cqw` la palabra «CARBONARA», con su espaciado de
   versales, se salía de su columna y chocaba con el precio de al lado. Está
   en `3,1cqw` y la columna en 34 %. La prueba mide el ancho real del texto,
   no el de la caja, porque la caja no crece.
2. **La pieza grande de la hoja 2 va en `minmax(0,1fr)`.** Con `1fr` pelado el
   precio, que no parte por ningún lado, imponía su `min-content` y dejaba la
   foto en 57 px de 242. Es la tercera vez que muerde el mismo `1fr` en estas
   muestras.
3. **El precio de la hoja 3 lleva su color declarado.** Es un
   `<p class="pr">`, así que `.m3 .it p{color:gris}` también lo pintaba de
   gris: la regla de la clase gana en especificidad pero no declaraba color,
   y el precio se iba con los grises secundarios.
4. **El rojo de la hoja 4 es más oscuro que el de la referencia.** Con el rojo
   vivo, el texto crema encima daba 4,1:1 —y la unidad, a opacidad 0,7,
   2,5:1—. Bajado a `#b02a18` el mismo texto da 6,1:1 y la unidad 4,9:1. Los
   grises de la hoja 3 y las etiquetas «tu foto» de las cuatro salieron igual,
   por medición: con el tono que tenían a ojo se quedaban entre 2,9 y 4,1:1.

**Cada hoja dice su moneda.** Los importes ya eran pesos —formato colombiano,
punto de miles—, pero un «$» a secas se lee como dólares en cuanto la hoja
sale de Colombia. Lo dice una vez por hoja y en su propia tipografía, en el
pie, que es donde lo pone un catálogo impreso: pegarle «COP» a cada precio
ensucia la hoja 2, donde el precio es la pieza grande de la composición.

Todavía no hay fotografía: los 49 recuadros dicen «tu foto» y se cambian sin
tocar nada más.

## `alquimia-herbal.html`

Un solo archivo de 1,0 MB. **Sin librerías, sin CDN y sin red**: las dos
tipografías y todas las imágenes van incrustadas, así que abre igual desde un
enlace, desde un correo o desde un USB, y funciona sin conexión.

Tiene dos partes en el mismo documento:

1. **La propuesta** — dónde está la marca hoy, qué vemos que necesita, la
   dirección visual propuesta y los once módulos de hasta dónde puede escalar.
2. **El catálogo de muestra**, funcionando: el carrusel se arrastra, la página
   se enciende con el color de cada producto, hay español e inglés y el pedido
   sale por WhatsApp.

**No se edita aquí.** Se construye desde `clientes/alquimia-herbal/`:

    cd clientes/alquimia-herbal
    python3 construir-pagina.py alquimia-herbal.html
    cp alquimia-herbal.html ../../demos/

El porqué del constructor, y las dos trampas del acotador de CSS, están en
`clientes/alquimia-herbal/LEEME.md`.

## Antes de pasar el enlace

La página lleva **datos reales de la clienta**: sus cifras de Instagram, su
número de WhatsApp y el análisis de su negocio. Una URL pública es pública
aunque no esté enlazada desde ningún sitio. Si el enlace va a circular más allá
de ella, conviene cambiar el WhatsApp por el de LQS y quitar las cifras — es un
cambio de dos líneas en `presentacion.html` y se reconstruye.
