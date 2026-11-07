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
