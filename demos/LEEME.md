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
- La franja de temporada, con su vigencia.

Cierra con el checklist **con y sin LQS**, la línea del dominio y la pregunta
de cierre con la firma.

**Está escrita para enseñarla a un cliente, no para leerla puertas adentro.**
No lleva sellos de «maqueta» ni de «listo», ni notas técnicas, ni el detalle de
lo que falta por conectar en Wompi: eso se cuenta hablando, no en la página. Lo
único que queda escrito es una línea de «demostración · no se cobra» dentro de
la pantalla de pago aprobado, porque una confirmación de pago sin esa línea es
un recibo falso aunque nadie lo pretenda.

Tres decisiones que conviene no deshacer sin medir:

1. **Los huecos de foto se ven como huecos.** No hay fotografía de comida con
   licencia, y meter la de otro en una muestra de venta es el mismo problema
   que ya se señaló con las fotos de ambiente de Alquimia. Cada hueco dice «tu
   foto» y el cambio por las del restaurante es mecánico.
2. **Los dos tonos medios están fijados por medición.** `--tinta-66` y
   `--tinta-70` salen de medir contraste sobre el compuesto real, elemento por
   elemento; con la opacidad que tenían antes (.52) el texto pequeño se
   quedaba en 3,2:1. Lo mismo con `--arcilla-h`, `--verde-texto` y
   `--ambar-fuerte`, y con la etiqueta del hueco, que va en tinta porque el
   blanco sobre el ámbar da 2,3:1.
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
