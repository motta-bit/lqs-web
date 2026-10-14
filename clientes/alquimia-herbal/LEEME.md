# Alquimia Herbal · propuesta de sitio

`propuesta.html` — **un solo archivo**, 431 KB, sin librerías, sin CDN, sin
build y **sin red**: las dos tipografías y las trece imágenes van incrustadas
en base64, así que abre desde un correo, un USB o un doble clic.

> Si el carrusel no aparece, la página se está viendo en una vista previa que
> capa el JavaScript. Doble clic al archivo, en Chrome o Safari.

## El carrusel

Cinco envases flotando alrededor de un eje de luz. **El que llega al frente
tiñe la luz de toda la página con su color**, sacado de su propia foto: de ahí
salen los amarillos, los violetas, los rojos y los verdes.

Tres entradas, no una:

- **Scroll.** La pista mide cinco pantallas, repartidas en cinco posiciones.
- **Arrastre**, con el dedo o el ratón, 1:1. El arrastre **no mueve un ángulo
  propio: mueve el scroll.** Con ángulo propio habría dos fuentes de verdad
  peleándose —el dedo dice una cosa y la posición de la página otra— y al
  soltar pegaría un salto. Moviendo el scroll, el muelle, los puntos y el tinte
  siguen saliendo todos del mismo sitio. Al soltar se proyecta la inercia con
  la caída exponencial del scroll y se cae al paso más cercano a *ese* punto:
  por eso un golpe seco pasa dos piezas y un roce pasa una (medido). Hay 10 px
  de histéresis y, si el dedo va claramente en vertical, se cede el gesto.
- **Los puntos del índice**, que además dicen cuántas piezas hay.

Y encima, cada pieza **flota por su cuenta**: fase, periodo y amplitud propios,
con el balanceo apagándose con la distancia para que el fondo no tiemble.

### Lo que sostiene la sensación

- **La proyección con fuga.** `fuga = 2,2 / (3,2 − cos θ)`. El 2,2 es la
  distancia del punto de vista en radios. Sin la división —con el seno a secas—
  θ y 180−θ caen en la **misma** equis y la pieza del fondo queda justo detrás
  de la del frente: doble exposición.
- **El muelle**, críticamente amortiguado, respuesta 0,42 s, en forma
  semi-implícita para que la velocidad sobreviva al cambio de objetivo.
- **El reposo.** A los 120 ms de silencio el objetivo se redondea al paso y el
  muelle asienta la pieza; la corrección nunca pasa de medio paso. Mientras hay
  un dedo encima no se asienta nada. Medido: en reposo la pieza del frente
  llega a opacidad 1 exacta.

## Los recortes, que es lo que había que arreglar

Cada pieza es **un solo envase, recortado del fondo**. Antes eran láminas
rectangulares con la foto entera: tres frascos a la vez, los de los lados
cortados por el marco y medio encuadre de mármol o lino alrededor. Eso es lo
que se veía como «mal recortado» y «partes blancas extras».

El recorte (`unico.py` en el andamio) resuelve tres cosas que la inundación
por color no resuelve sola:

1. **El fondo tiene textura** —mármol, lino, mesa—, así que no hay un color de
   fondo al que parecerse. Lo que distingue al envase es una **regla de color
   propia de cada foto, medida y no supuesta**: en el desodorante el vidrio
   está a luminancia 40 y el fondo a 208, así que separa la luz; en el tónico
   la etiqueta es dorada y lo que separa es la saturación; en el roll on todo
   el envase es neutro o frío (azul−rojo entre −2 y +5) y la mesa entera es
   cálida (−23), así que separa la temperatura.
2. **La etiqueta es casi del color del fondo** y la regla le abre un boquete en
   mitad del frasco. El contorno de un frasco es una función suave de la
   altura, así que se toma el borde izquierdo y el derecho de cada fila y se
   les pasa una **mediana por el eje y**: rellenar entre ambos tapa la etiqueta
   y, de paso, la mediana se lleva las púas (un pétalo, una ramita, la sombra
   entre dos frascos) sin tocar el cuerpo. Un cierre normal no servía: rellena
   el triángulo entre la púa y el frasco y deja un reborde.
3. **La orla de píxeles de fondo pegada al contorno** se come erosionando la
   máscara dos o tres píxeles antes de difuminar el canto.

**Tres productos se quedaron fuera del carrusel a propósito.** Copaleras, jabón
y kit son planos cenitales con piezas superpuestas: no hay forma de separar
jabón de jabón, ni copalera de pasto, por color. Están en la mesa con su foto
real, que es donde un cenital funciona bien.

### El tamaño relativo

Un roll on de 10 ml no puede medir lo mismo que un shampoo de 250 ml, pero la
escala real no cabe: **la fuga entre el frente y 72° es 1/0,761 = 1,31**, así
que si los tamaños propios se separan más que eso, un vecino sale más grande
que la pieza del frente y se deshace la profundidad. Los altos van comprimidos
a 0,78–1,00, y el orden del giro evita que el shampoo (el mayor) quede al lado
del roll on (el menor), que era el único par que quedaba justo.

## Las tipografías

**Provisionales, y está dicho en el pie de la página.** Art Nouveau y Glacial
Indifference no se pueden bajar desde este entorno —Google Fonts responde,
GitHub tiene la búsqueda de código cerrada y los demás CDN están bloqueados— y
ninguna de las dos está en Google Fonts. Van las dos más cercanas que sí, y
elegidas comparando nueve candidatas **renderizadas**, no de memoria:

- **Eagle Lake** en los títulos: la A uncial, la q que fluye, el contraste
  alto, el trazo orgánico. Va **subconjuntada** a los caracteres que de verdad
  aparecen (19 KB en vez de la familia entera).
- **Jost** en el resto: geométrica tipo Futura, que es la familia de Glacial
  Indifference. Va en **variable**: un archivo cubre de 300 a 500 (25 KB en vez
  de 75).

Con los dos archivos reales se cambian en una línea: mismo nombre de familia,
otro `src`.

## Lo que hay que saber antes de tocarla

- **El estado por defecto es el legible.** El catálogo vive en el HTML: sin
  JavaScript se leen los ocho productos enteros, con foto, descripción,
  componentes y formato. El JS lo lee para armar el carrusel, y solo monta en
  él los `<article>` marcados con `data-rueda`.
- **`prefers-reduced-motion` no monta el carrusel.** Queda la mesa, con el
  color y el contenido intactos.
- **El carrusel se desmonta solo** si no queda banda para una pieza legible.
- **La banda se mide, no se calcula.** El orbe es el hijo flexible de la
  columna, así que su alto es lo que la ficha dejó libre; por eso
  `geometria()` se vuelve a llamar cuando la ficha cambia.
- **Contraste medido** sobre el compuesto real —degradé vivo más partículas—,
  elemento por elemento y con el tinte más oscuro al frente. Lo más justo es el
  rótulo de familia de la ficha en el rojo: 4,97:1 sobre 4,5. Los puntos del
  índice van a .46 de alfa, con 24×24 de área de toque.

## Lo que falta

1. **Los originales de las fotos.** Las de los tres productos suyos salen de la
   captura del Instagram: cada envase mide entre 50 y 165 px de origen y va
   ampliado entre 1,3× y 2,2×. Aguanta en pantalla, pero para publicar hacen
   falta los archivos de cámara.
2. **Dos envases son de muestra** —el de Sangre de Drago y el de Shampoo— y
   están marcados como tales en su ficha. Son los que mandó el cliente: ámbar
   con tapa negra, del mismo tipo que los suyos. Con una foto real se cambian.
3. **Las cifras de cada ficha.** Las que se leen en las etiquetas son suyas; el
   resto hay que confirmarlo.
4. **Los dos archivos de tipografía** y el logotipo compuesto.

El WhatsApp ya funciona: `wa.me/573152926388`, con el mensaje escrito de
antemano.

## Lo que quedó fuera a propósito

Rapés, mambe y los preparados de uso ceremonial no están en el catálogo
abierto: un catálogo público con precios y botón de pedido sobre esos productos
es otra conversación —legal, de plataforma y de pasarela de pago— y la mezcla
con los cosméticos arrastra a los cosméticos. Hay una sección que los nombra
sin venderlos y manda al directo.

Ninguna ficha dice que algo prevenga, alivie o cure nada, ni el tónico, que se
llama «anti acné» —el nombre se respeta, porque es suyo, pero la descripción no
añade una promesa—. El recuadro «Lo que esta página no dice» está a la vista.
**Es criterio de diseño, no asesoría legal**: si la marca va a facturar,
conviene que alguien mire la rotulación frente a Invima.
