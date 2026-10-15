# Alquimia Herbal · propuesta de sitio

`propuesta.html` — **un solo archivo**, 446 KB, sin librerías, sin CDN, sin
build y **sin red**: las dos tipografías, las dos lenguas y las ocho imágenes van incrustadas
en base64, así que abre desde un correo, un USB o un doble clic.

## El carrusel: dos formas de lo mismo

**La de por defecto no necesita JavaScript.** Las cinco piezas están escritas
en el HTML dentro de una tira con `scroll-snap` nativo: se desliza con el dedo
y funciona en cualquier parte, también en la vista previa de archivo de iOS
—Quick Look—, que no ejecuta scripts. Antes el carrusel se armaba desde el
script y en esa vista previa la sección salía vacía: la página saltaba del
titular a la mesa. Ese era el fallo.

Cuando el script sí corre, añade `html.rueda` y **las mismas piezas** pasan a
girar alrededor del eje de luz. El JS no crea ninguna: solo las coloca. Por eso
hay un `desmonta()` que limpia los estilos en línea que dejó el giro —si no,
al volver a ser tira las piezas se quedan apiladas y transparentes.

En la tira, el color lo pone cada tarjeta desde su propio `--t`, porque sin
JavaScript no hay quién mueva el haz central; en el giro, **el que llega al
frente tiñe la luz de toda la página**. La promesa de «cada uno enciende la
página con su color» se cumple en las dos versiones.

Con el giro montado hay tres entradas, no una:

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

## El reparto del scroll

Iba lineal y el cliente lo describió como «rígido y congelado por partes».
Eran dos cosas distintas y las dos están arregladas:

- **Lo robótico era el asentamiento automático.** A los 120 ms de callar el
  scroll, la rueda se redondeaba al paso más cercano y se movía **sola**. Con
  rueda de ratón los eventos llegan en muescas sueltas, así que entre muesca y
  muesca se metía siempre el asentamiento y la rueda peleaba con el siguiente
  empujón. Fuera. Ahora la rueda solo se mueve cuando uno la mueve: está medido
  —se la deja en un punto y a los tres segundos sigue exactamente ahí.
- **Lo rígido era el reparto.** Ahora cada tramo tiene una **meseta** al
  principio y otra al final donde la rueda no gira: ahí la pieza se queda
  quieta y se lee, y en medio gira de corrido. Medido en pasos de 4 %, el
  recorrido de cada tramo va 0 → 119 → 234 → 123 → 41 → 0 píxeles: una pausa,
  una vuelta, otra pausa. La meseta es el 30 % del tramo, repartido entre los
  dos extremos; más larga y volvería a sentirse congelado, que es la otra
  mitad de la queja.

El muelle pasa de 0,42 a 0,55 s de respuesta: con la meseta, el giro de en
medio es más rápido por píxel de scroll, y un muelle más lento lo convierte en
maquinaria pesada en vez de en un seguimiento 1:1 que delata el mecanismo.

## Las dos lenguas

**Sin una línea de JavaScript.** Cada texto lleva sus dos versiones en dos
spans y el `:has(#en:target)` del `html` decide cuál se ve, con dos anclas
fijas de tamaño cero —fijas para que al pulsarlas el navegador no tenga a
dónde desplazarse y no salte al principio de la página.

Dos trampas que costaron sangre y conviene no volver a pisar:

- **Conmuta una clase, no el atributo `lang`.** Con `[lang="es"]` el selector
  cogería también al `<html lang="es">`, y un `display:none` ahí deja la
  página en blanco. El atributo `lang` se queda donde corresponde —en los dos
  enlaces del selector— para que un lector de pantalla los anuncie bien.
- **La ficha del carrusel CLONA el bloque de texto de la pieza**, en vez de
  reconstruirlo leyendo sus cadenas con `textContent`. Con dos lenguas dentro,
  leer el texto devolvía el español y el inglés pegados: «Tónico facial anti
  acnéAnti-acne facial toner». Clonando, la ficha hereda los dos spans y el
  CSS esconde el que toca. Lo mismo con los títulos de la mesa: se sacan los
  hijos del botón en vez de copiar su texto.

## La paleta

Dos acentos, y cada uno con su oficio. El **oro** es la luz: la marca, los
titulares, los rótulos, el botón, el haz. El **verde** de la identidad se
queda para lo botánico —los ingredientes—, que es donde significa algo. Oro
sobre un negro cálido es lo que da la sensación de realeza; el verde al lado
es lo que la mantiene primaveral y no de ópera.

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

- **El estado por defecto es el legible y además es usable.** Sin JavaScript
  no solo se lee: el carrusel se desliza. Las cinco piezas están en la tira y
  los otros tres productos en la mesa, todos con foto, descripción,
  componentes y formato.
- **`prefers-reduced-motion` no monta el giro.** Queda la tira, que no tiene
  movimiento propio: es la versión suave perfecta, y se sigue pudiendo
  recorrer.
- **El carrusel se desmonta solo** si no queda banda para una pieza legible.
- **La banda se mide, no se calcula.** El orbe es el hijo flexible de la
  columna, así que su alto es lo que la ficha dejó libre; por eso
  `geometria()` se vuelve a llamar cuando la ficha cambia.
- **El selector de lengua lleva la cadena entera en el selector CSS**
  (`.chapa nav .leng a`). `.chapa nav a` es (0,2,1) y le ganaba a `.leng a`
  (0,1,1), así que el relleno que le puse nunca se aplicaba y a 320 px la
  chapa desbordaba 63 px.
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
