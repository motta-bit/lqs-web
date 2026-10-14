# Alquimia Herbal · propuesta de sitio

`propuesta.html` — **un solo archivo**, 539 KB, sin librerías, sin CDN, sin
build y **sin red**: las dos tipografías y las siete fotos van incrustadas en
base64, así que abre desde un correo, un USB o un doble clic y se ve igual.

## El carrusel, que es lo principal

Seis piezas flotando alrededor de un eje de luz. **La que llega al frente tiñe
la luz de toda la página con su color**, sacado de su propia foto: de ahí salen
los amarillos, los rojos y los verdes. El orden del giro es una progresión de
tono —amarillo → verde → violeta → magenta → rojo → ámbar y vuelta al
amarillo—, no el orden del Instagram, para que el giro se sienta como una rueda
de color y no como seis saltos sueltos.

Tres entradas, no una:

- **Scroll.** La pista mide seis pantallas; el recorrido se reparte en seis
  posiciones exactas.
- **Arrastre.** Con el dedo o el ratón, 1:1. El arrastre **no mueve un ángulo
  propio: mueve el scroll.** Si tuviera su propio ángulo habría dos fuentes de
  verdad peleándose —el dedo dice una cosa y la posición de la página otra— y
  al soltar pegaría un salto. Moviendo el scroll, el muelle, los puntos y el
  tinte siguen saliendo todos del mismo sitio. Al soltar se proyecta hasta
  dónde llegaría el gesto por inercia (caída exponencial, no la fórmula de
  libro) y se cae al paso más cercano a *ese* punto: por eso un golpe seco pasa
  dos piezas y un roce pasa una. Hay 10 px de histéresis, y si el dedo va
  claramente en vertical se cede el gesto: eso es scroll, no arrastre.
- **Los puntos del índice**, que además dicen cuántas piezas hay y en cuál
  estás.

Y encima de todo eso, cada pieza **flota por su cuenta**: fase, periodo y
amplitud propios, con el balanceo apagándose con la distancia para que el fondo
no tiemble.

### Lo que sostiene la sensación y conviene no tocar sin saber

- **La proyección con fuga.** `fuga = 2,2 / (3,2 − cos θ)`. El 2,2 es la
  distancia del punto de vista medida en radios. Más cerca da más profundidad
  pero comprime las equis hasta montar unas piezas sobre otras; más lejos
  aplana el giro hasta que parece una fila. Sin la división —con el seno a
  secas— θ y 180−θ caen en la **misma** equis y la pieza del fondo queda
  exactamente detrás de la del frente: se ve como una doble exposición.
- **El muelle.** Críticamente amortiguado, respuesta 0,42 s, en forma
  semi-implícita para que la velocidad sobreviva a los cambios de objetivo. Eso
  es lo que deja frenar el giro a media vuelta sin que pegue un salto.
- **El reposo.** A los 120 ms de silencio el objetivo se redondea al paso más
  cercano y el muelle asienta la pieza. La corrección nunca pasa de medio paso,
  así que no pelea con el scroll. Mientras hay un dedo encima no se asienta
  nada: mandaría el reposo en vez del dedo. Está medido: en reposo la pieza del
  frente llega a opacidad 1 exacta.
- **El suelo de opacidad está en 0,02.** Son fotos grandes y claras: a 0,06 la
  pieza del fondo todavía se lee como un rectángulo oscuro detrás de la de al
  lado en vez de como distancia.

## Las fotos

Las seis son **las del Instagram**, recortadas de la cuadrícula de la captura
que mandó el cliente: productos reales con etiquetas reales. Cada una mide
403 px de origen y va ampliada a 520×650 con una pasada de nitidez.

**Para publicar hacen falta los originales**, que tienen unas cuatro veces más
resolución. La misma imagen sirve para la miniatura de la mesa y para la pieza
del carrusel, así que cada foto está incrustada una sola vez.

La de **copaleras va entera, con su titular y sus tres pasos**, y es
deliberado: no es una fotografía de producto sino una pieza de contenido
diseñada. Cualquier recorte dejaba un trozo de franja o una palabra cortada, y
el único encuadre limpio de las copaleras mide 210 px de origen —habría que
ampliarlo tres veces—. Entera se lee como lo que es.

## Las tipografías

**Provisionales, y hay que decirlo.** Art Nouveau y Glacial Indifference no se
pueden bajar desde este entorno: Google Fonts sí responde, GitHub tiene la
búsqueda de código cerrada para esta sesión y los demás CDN están bloqueados.
Ninguna de las dos está en Google Fonts.

Van las dos más cercanas que sí se pueden conseguir, elegidas comparándolas
renderizadas y no de memoria:

- **Eagle Lake** en los títulos. De las nueve candidatas es la que tiene
  carácter Art Nouveau de verdad: la A uncial, la q que fluye, el contraste
  alto, el trazo orgánico. Va **subconjuntada** a los caracteres que de verdad
  aparecen (19 KB en vez de la familia entera).
- **Jost** en el resto. Es una geométrica tipo Futura, que es exactamente la
  familia de Glacial Indifference. Va en su versión **variable**: un solo
  archivo cubre de 300 a 500 en vez de tres estáticas (25 KB en vez de 75).

Con los dos archivos reales se cambian en una línea: se reemplaza el `src` del
`@font-face` y se dejan los mismos nombres de familia.

## Lo que hay que saber antes de tocarla

- **El estado por defecto es el legible.** El catálogo vive en el HTML, no en
  el script: sin JavaScript se leen las seis piezas enteras, con foto,
  descripción, componentes y formato. El JS lee ese HTML para armar el
  carrusel, que es lo único que de verdad necesita JavaScript.
- **`prefers-reduced-motion` no monta el carrusel.** Queda la mesa, con el
  color y el contenido intactos, y el polvo apagado.
- **El carrusel se desmonta solo** si no queda banda para una pieza legible, y
  vuelve si la ventana crece.
- **La banda del carrusel se mide, no se calcula.** El orbe es el hijo flexible
  de la columna, así que su alto es lo que la ficha dejó libre. Por eso
  `geometria()` se vuelve a llamar cada vez que la ficha cambia: la descripción
  pasa de dos líneas a cinco según el ancho y la pieza.
- **`touch-action:pan-y`** en la escena: el dedo sigue haciendo scroll
  vertical y el gesto horizontal es nuestro.
- **Contraste medido, no supuesto**, sobre el compuesto real —degradé vivo más
  lienzo de partículas—, elemento por elemento y con el tinte más oscuro de los
  seis puesto al frente. Lo más justo es el rótulo de familia de la ficha en el
  rojo del jabón: 4,97:1 sobre 4,5 que pide el texto pequeño. Los puntos del
  índice van a .46 de alfa porque a .3 se quedan en 2,3:1 y un control pide
  3:1, con 24×24 de área de toque.

## Lo que falta

1. **Los originales de las fotos.** Es lo único que separa esto de publicable.
2. **Las cifras de cada ficha** (mililitros, gramos, tamaños) hay que
   confirmarlas una por una. Hoy salen de las etiquetas que se leen en las
   fotos; donde no se leía, están puestas como verosímiles.
3. **Los dos archivos de tipografía.**
4. **El logotipo.** El ojo vectorizado es la marca; el nombre va hoy en Eagle
   Lake. Cuando esté compuesto el wordmark Art Nouveau, entra en su lugar.

El WhatsApp ya está puesto y funciona: `wa.me/573152926388`, con el mensaje
escrito de antemano.

## Lo que quedó fuera a propósito

Rapés, mambe y los preparados de uso ceremonial no están en el catálogo
abierto. No es pudor: un catálogo público con precios y botón de pedido sobre
esos productos es otra conversación —legal, de plataforma y de pasarela de
pago— y la mezcla con los cosméticos arrastra a los cosméticos. Hay una sección
que los nombra sin venderlos y manda al directo.

Lo mismo con las afirmaciones: ninguna ficha dice que algo prevenga, alivie o
cure nada, ni el tónico, que en el Instagram se llama «anti acné» —el nombre se
respeta, porque es suyo, pero la descripción no añade una promesa—. El recuadro
«Lo que esta página no dice» está a la vista y no en letra chica. **Esto es
criterio de diseño, no asesoría legal**: si la marca va a facturar, conviene
que alguien mire la rotulación de los cosméticos frente a Invima.
