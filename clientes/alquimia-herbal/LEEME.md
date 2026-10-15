# Alquimia Herbal · propuesta de sitio

`propuesta.html` — **un solo archivo**, 551 KB, sin librerías, sin CDN, sin
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
- **La pista se acortó a 44vh por producto** (eran 58). La parte fijada
  dura ahora unas dos pantallas en vez de tres: pinchada mucho tiempo, la
  página se siente congelada por mucha meseta que tenga.
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

## El oro, el papel y el grano

Tres arreglos a la misma queja: «no hay degradado, el amarillo no se ve
dorado y todo tiene el mismo perfil de color».

- **El oro es una escala, no un amarillo.** Un color plano no parece metal:
  lo que lo hace metal es el recorrido de bronce a champán **dentro de la
  misma letra**, con una banda clara en medio que hace de reflejo. De ahí
  `--grad-oro`, con seis paradas, recortado contra el texto en los titulares
  y en los botones.
- **Una sección de papel.** Seis secciones oscuras seguidas se leen como una
  sola imagen larga; «El oficio» pasa a fondo claro. Oscuro → claro → oscuro
  es lo que da respiración a una página larga, y de paso es lo que hace que
  el oro de las secciones oscuras se lea como oro, porque ya hay algo claro
  con que compararlo.
- **Grano.** Un SVG de ruido de 300 bytes, fijo y sin animar. Es el detalle
  más barato que separa una página plana de una que parece impresa: rompe
  las bandas de los degradés y le da materia a los planos grandes.

Dos cosas medidas que conviene no deshacer:

- **Sobre papel el oro NO va en degradé.** La parada más clara del bronce
  (`#d8ae45`) se queda en **1,74:1** contra el papel, y un degradé vale lo
  que su peor parada. En la sección clara el oro es bronce sólido, 5,5:1.
- **`background-clip:text` solo pinta sobre el texto del PROPIO elemento.**
  La segunda línea del lema vive en su propio `<span>`, así que necesita su
  propia declaración; sin ella se queda transparente sobre nada, es decir
  invisible, y es justo la línea que el cliente quería resaltar.

## Por qué son láminas y no recortes

El cliente dijo que el carrusel iba pesado y que sospechaba de los recortes.
Tenía razón, y el culpable concreto se pudo medir: **un recorte obliga a
`drop-shadow`**, que es un filtro y se recalcula en cada cuadro mientras la
pieza escala; **una lámina permite `box-shadow`**, que el compositor cachea.

Medido sobre el carrusel girando, con el mismo recorrido y el mismo número de
cuadros:

| | media por cuadro | cuadros > 20 ms |
|---|---|---|
| antes | 47,5 ms | 140 de 145 |
| ahora | ~20 ms | ~50 de 145 |
| solo las piezas, sin ambiente | 16,9 ms | 17 de 145 |

Lo que se quitó, en orden de lo que costaba:

- **El halo de cada pieza**: seis degradés de 700 px promovidos, **20 ms por
  cuadro** ellos solos. Con láminas tampoco aportaba, porque la foto tapa el
  centro: la luz de la pieza del frente la pone el haz y la sombra de caja.
- **`drop-shadow` y el grano se multiplicaban entre sí.** Juntos valían 18 ms:
  una capa fija que se *mezcla* obliga a recomponer toda la pila cada vez que
  algo debajo se mueve. El grano perdió el `mix-blend-mode` y bajó la opacidad;
  sigue rompiendo las bandas de los degradés y ya no cuesta nada.
- **`mix-blend-mode:screen` en el núcleo**, por lo mismo. Sobre fondo oscuro
  screen es casi pintar encima, así que se cambió por alfa normal —subida de
  .44 a .60 para devolver por alfa la luz que daba la mezcla.
- **Escribir las variables de color en `:root` en cada cuadro.** Eso invalida
  todo lo que las usa: el cielo entero con sus cuatro degradés a pantalla
  completa. Ahora solo se escriben cuando el color cambia más de tres niveles.
- **El `z-index` de cada pieza en cada cuadro**, que reordena la pila sesenta
  veces por segundo para nada: el orden de las seis cambia unas pocas veces
  por vuelta.
- **El polvo repintaba la pantalla entera** con un relleno `source-atop` por
  cuadro, solo para teñir setenta puntitos. Ahora la mota se re-tiñe cuando
  cambia el color, no cuando cambia el cuadro; el lienzo va a un píxel por
  punto y las motas bajaron de 70 a 48.
- **Las tres capas de ambiente** —cielo, núcleo y grano— cubren la pantalla y
  casi nunca cambian, pero sin promover se repintaban con todo lo demás. Un
  `translateZ(0)` las deja como lámina propia.

**Y el cambio tuvo un efecto lateral bueno:** como ya no hay que recortar,
entran al carrusel las dos fichas que antes eran imposibles —copaleras y
jabón, planos cenitales donde no se puede separar jabón de jabón por color— y
salen los dos envases de muestra, que como lámina habrían sido un bloque
blanco. **Las seis piezas son ahora fotografía real suya**, sin una sola
sustitución.

## Los recortes: la silueta hacia dentro

*(El procedimiento de recorte se conserva en `recorte-envases.py` y descrito
aquí abajo: sigue valiendo si algún día hace falta una pieza sin fondo.)*

La primera versión rellenaba entre los bordes **suavizados** por la mediana,
así que allí donde el contorno real era más estrecho que la mediana metía
fondo: de ahí el halo rectangular del rodillo y la orla del desodorante.
Sobre fondo oscuro casi no se notaba; sobre claro saltaba a la vista, y por
eso ahora **todo recorte se revisa sobre los dos fondos**.

Ahora, para cada fila, el borde es *inward-only*:

- si el borde real está cerca de la mediana, manda el real y se toma el más
  interior de los dos —así una concavidad de verdad, como el cuello, se
  conserva;
- si el borde real se dispara —un bulto de fondo que coló la regla, o la
  muesca que deja la etiqueta al llegar al canto del vidrio—, manda la
  mediana.

Y el bloque pálido al pie era **la mesa**: la regla de color la deja pasar y,
como toca la base del frasco, ni la componente mayor ni el relleno la
sueltan. Se corta por arriba y por abajo usando el **núcleo oscuro** —vidrio
ámbar o tapa negra—, que la mesa no tiene.

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

---

# `presentacion.html` · la propuesta para Mariana

Segundo archivo, **197 KB**, mismas reglas que el catálogo: un solo archivo,
sin librerías, sin CDN, sin red. Es la pieza que se muestra **mientras se
habla con ella**, y el catálogo es lo que se enseña dentro.

**Los dos archivos viajan juntos y en la misma carpeta.** El botón «abrir el
catálogo» es un enlace relativo a `propuesta.html`; si se manda solo uno, ese
botón no lleva a ninguna parte. Está dicho en el pie de la página para que no
sea una sorpresa delante del cliente.

## El argumento, que es lo que importa

La página existe para sostener una conversación incómoda sin tratarla de boba:
**ella pidió una página de catálogo; lo que necesita es llegar a más gente.**
Ella ya reconoce el problema, así que la página no se lo explica: lo nombra,
lo separa en dos cosas distintas —atraer y convertir— y pasa directo a qué
módulo resuelve cuál.

El orden de las secciones es el orden de esa conversación:

1. **Portada** — «Esto no es el resultado final. Es la base.» Primero, antes
   que nada, para que no se lea como una entrega.
2. **Dónde estamos** — lo que ya está bien (el producto y la fotografía) y
   tres cifras **suyas, reales**: 44 publicaciones, 1.160 seguidores, 1 canal.
   No hay una sola estadística inventada en toda la página, ni porcentajes de
   conversión, ni promesas de alcance.
3. **La pregunta de fondo** — el diagrama de caminos. Ver abajo.
4. **La base** — las dos capturas del catálogo, lo que ya hace y **lo que
   falta, que es suyo**, dicho sin rodeos.
5. **Los módulos** — el tablero, sobre papel claro.
6. **Si tuviera que elegir** — tres pasos en orden, con el porqué de cada uno.
7. **Lo que salió en el camino** — el sello, los vectores, la tipografía, la
   línea ceremonial, Invima, los dos idiomas.
8. **Cierre** — «lo que falta para arrancar no es un presupuesto».

## El diagrama de caminos

Es lo único interactivo de la página, y lo es a propósito: se enciende con un
botón, en vivo, justo en la frase que lo necesita. Tres grifos arriba
—Instagram, Google, un enlace que circula—, el catálogo abajo. De entrada solo
Instagram está abierto; el botón abre los otros dos y el caudal **se ve
engordar**, porque sube con un muelle de 0,75 s y no de un salto: lo que
convence es ver el cambio ocurrir.

Sin la animación la frase se sigue entendiendo —está escrita encima y debajo—,
así que el dibujo explica, no sustituye.

Tres cosas que costaron y conviene no deshacer:

- **El poso de luz se pinta sobre todo el lienzo.** Recortarlo a la mitad
  inferior cortaba el degradado antes de llegar a cero y dejaba una costura
  gris atravesada de lado a lado.
- **El canto inferior del lienzo va enmascarado** (`mask-image`). El charco de
  luz es más ancho que el alto que le queda, así que contra el borde volvía a
  dibujar una raya recta. Enmascarado, los chorros se deshacen dentro del
  rótulo, que además es lo que se quiere contar.
- **Cada gota aterriza con un desvío propio.** Cayendo todas al mismo punto se
  amontonaban en un grumo; con desvío y apagándose en los últimos centímetros,
  leen como caudal.

Con movimiento reducido no hay gotas: los cauces engordan y el poso crece
igual, así que el botón sigue diciendo lo mismo (medido: 35 % → 76 % del
lienzo pintado).

## Lo que está medido

| | |
|---|---|
| contraste | **32 de 32 elementos pasan AA**, medidos sobre el compuesto real |
| coste por cuadro | mediana **16,7 ms**, 1 cuadro de 149 por encima de 20 ms |
| scroll completo | mediana **16,7 ms**, 0 cuadros por encima de 20 ms |
| sin JavaScript | **41 de 41 bloques visibles**, 7.093 caracteres legibles |
| a 320 px | sin desbordamiento horizontal |

El contraste se mide renderizando cada elemento **dos veces**, con y sin
texto, y comparando píxel contra su propio fondo, quedándose con el peor. El
método de percentiles que se usó primero daba 13 falsos fallos: cuando el
texto es escaso, los dos percentiles caen sobre fondo. El texto en degradado
necesita además que se le quite el `background-image`, porque volver
transparente el color no lo borra.

Dos correcciones salieron de ahí y las dos eran reales, no de método:
«Lo que falta, y es tuyo» medía 3,67:1, y la chapa «DESPUÉS» 4,38:1.

## Detalles de composición que ya se corrigieron

- **Eagle Lake tiene descendentes largas.** Con `line-height:1.06` la cola de
  la «y» de «ya puede» se metía en el párrafo de abajo. Está en 1,14.
- **El resplandor del sello se cuajaba en un cuadrado**, porque los rayos del
  trazo llegan a las esquinas y un desenfoque corto los une. Más abierto y más
  tenue, lee como halo. El trazo en sí está limpio: se comprobó aislado.
- **La costura entre el papel y la noche daba un escalón**, porque el velo
  solo llegaba al 50 % de oscuridad y chocaba con la sección negra. Ahora los
  dos velos llegan a `--noche` opaca en el canto: el papel emerge y se vuelve
  a hundir sin junta.

## Lo que falta aquí

Lo mismo que en el catálogo —las fotos de cámara, las cifras, las dos
tipografías— más una cosa propia: **los precios de cada módulo**. La página
dice deliberadamente en qué orden conviene hacerlos y qué resuelve cada uno,
pero no cuánto cuestan. Eso se habla, no se manda por correo.

---

# Las tipografías definitivas

Dentro de los dos archivos van ahora **Legrand** en los títulos y **Glacial
Indifference** en el resto, incrustadas en woff2: 56 KB las tres caras.
Fuera Eagle Lake y Jost, que eran las sustitutas.

No fue cambiar el nombre de la familia. Dos hechos de las fuentes obligaron a
recomponer:

**Legrand es una fuente de capitales.** La minúscula sale en versalita, así
que un título en caja baja se lee como capitales con la inicial más alta.
Queda muy bien y es muy Art Nouveau, pero las capitales no tienen bajadas:
todo el interlineado que dejaba sitio a la cola de la «y» de Eagle Lake
sobraba. Y las capitales piden tracking **positivo**, al revés que una redonda
grande. Títulos, pies y rótulos de los dos archivos están recompuestos con eso
en cuenta.

**Glacial Indifference solo trae 400 y 700.** Los pesos 300 y 500 que usaban
las dos páginas no existen: el navegador los fingía adelgazando y engordando
a ojo. Ahora son 400 y 700 de verdad, que además se leen mejor.

## Los glifos que faltaban

Ninguna de las dos cubre entero el castellano tal como viene. Se hizo el censo
exacto —qué carácter cae en qué fuente, recorriendo el DOM de los dos
archivos— en vez de suponerlo, y salieron tres:

| | |
|---|---|
| `·` en Legrand | **estaba dibujado y sin mapear**. Basta mapearlo: así se usa el punto del propio diseñador, no una invención. |
| `¿` `¡` `·` en Glacial | no están de ninguna forma. Se construyen girando `?` y `!` 180° y subiendo el `.`. Girar es exactamente lo que son esos signos. |
| `«` `»` | no están en ninguna y no se derivan de nada. Se cambiaron en el texto por `“ ”`, igual de correctas en castellano. |

`¿` y `¡` **hoy no se usan** en ninguna de las dos páginas. Se añadieron igual:
una página en castellano cuyo cuerpo no puede escribir una pregunta es una
mina para la primera persona que edite una frase.

El constructor es `construir_tipos.py` en el raspador. Si llegan versiones
nuevas de las fuentes, se vuelve a pasar.

## Todo el contraste hubo que volver a medirlo

Cambiar de fuente cambia el grosor del trazo, y el grosor del trazo cambia el
contraste medido. Las cifras viejas quedaron caducadas en el momento del
cambio. Repetido entero, en cuatro estados:

| estado | resultado |
|---|---|
| presentacion, con JS | **32 de 32** |
| presentacion, sin JS | **32 de 32** |
| propuesta, con JS | **12 de 12** |
| propuesta, sin JS | **14 de 14** |
| pie vivo de la rueda, en los **seis** tintes | todo pasa |

El estado sin JavaScript se mide sobre una copia a la que se le quita el
`<script>`, porque con `javaScriptEnabled:false` el propio `page.evaluate` de
Playwright deja de ser fiable.

Seis correcciones reales salieron de ahí: el marcador del idioma activo
(4,35), la pista de scroll (4,29), la firma del héroe (4,40), el formato de la
tarjeta sin JS (4,15), el formato del pie vivo (4,33) y la familia del pie
vivo (3,64).

## El color vivo que no podía ganar

La familia de cada ficha iba con el color del producto. Se intentó conservarlo
aclarándolo por luminancia; no funciona, y el motivo es estructural: **detrás
de ese pie está el haz teñido con ese mismo color**, así que es dorado sobre
dorado. Medido en los seis tintes, el vivo caía a **2,97:1** en el rosa del
kit. Con oro suave fijo, el peor de los seis es **4,93**.

Se quitó la función que lo aclaraba en vez de dejarla ahí sin usar. El tinte
sigue vivo donde sí se distingue: el haz, la línea y el punto del índice.

Nota de método: el punto activo del índice da **1,13** con la medición A/B
—es un artefacto, el elemento es diminuto—. Sondeado directo da **9,82:1**
contra la página, y además el estado activo no depende solo del color: escala
1,55×.

# El material de ambiente

Tres imágenes en `presentacion.html`, de doce que llegaron. Van **siempre al
fondo, apagadas y sin pie**, para que no se confundan nunca con la fotografía
de producto de ella:

1. **Portada** — textura de verdes oscuros detrás del titular.
2. **Banda** entre «la pregunta» y «la base», que es donde el documento gira
   del problema a lo que ya está hecho.
3. **Banda** antes del cierre: la línea de atados sobre el valle, que abre.

Las bandas se funden por los cuatro lados. Con cantos rectos leen como una
foto pegada encima; fundidas, como un respiro del propio documento.

**En el catálogo no va ninguna**, a propósito: ahí la fotografía es la de ella
y meter ambiente de archivo al lado invita a confundir qué es suyo.

## Cuatro descartadas, con motivo

- La del mortero lleva **la firma visible de otra fotógrafa** («Гусарова В.»).
  El trabajo firmado de otra persona no va en una propuesta de cliente.
- La del sahumerio con torso descubierto y la del cráneo entre lavanda y
  cuarzos son **la línea ceremonial**, que esta marca decidió dejar fuera de
  lo público. Meterlas contradice la propia propuesta.
- La del taller con velas **parece generada**: los objetos se deshacen y la
  perspectiva no cierra. En un documento que defiende el oficio, resta.

## Lo que hay que decidir sobre ellas

Las tres que quedan **no son de la marca ni de LQS**. Para un documento que se
le enseña a una persona es un riesgo; si alguna vez esto se publica, es otro.
Antes de que salga de la conversación con Mariana conviene o comprar licencia,
o sustituirlas por fotografía propia, o quitarlas: el documento funciona sin
ellas, que para eso el argumento está en el texto.

# Encontrado y no hecho

`propuesta.html` arrastra **unas 25 líneas de CSS muerto**: todo el bloque
`.item` (y sus dos menciones en el `@media (prefers-contrast:more)`). No queda
ni un elemento con esa clase en el cuerpo ni el script crea ninguno —está
comprobado—. Es resto de cuando el catálogo era una lista antes de pasar a
`.ficha` / `.pieza`. No estorba, pero confunde a quien lea el archivo y me
costó un rato de medición creyendo que medía algo.

---

# `alquimia-herbal.html` · el archivo único

El catálogo dejó de ser un archivo aparte y pasó a **habitar** la propuesta.
Un solo archivo, 1,0 MB, con todo dentro: la propuesta, el catálogo de muestra
funcionando, las dos tipografías y todas las imágenes.

## Se construye, no se edita a mano

**La fuente editable siguen siendo `presentacion.html` y `propuesta.html`.**
El archivo único es la salida:

    python3 construir-pagina.py alquimia-herbal.html

Editar a mano un archivo de 1 MB con tres bloques de base64 dentro es pedir un
error. Se toca la parte que corresponda y se vuelve a construir.

## Por qué hacía falta un constructor y no un copiar-pegar

Las dos hojas comparten **18 nombres de clase** (`bot`, `centro`, `claro`,
`firma`, `portada`, `rotulo`, `sello`, `num`, `paso`…) y casi todos los
selectores de elemento desnudo (`h1`, `h2`, `section`, `footer`, `p`, `img`).
Pegadas una debajo de otra se pisan sin avisar.

Cada hoja se encierra en su espacio de nombres —`.propuesta` y `.muestra`— con
un acotador que entiende llaves anidadas, `@media`, `@supports`, `@keyframes`,
`:root` y los selectores que empiezan por `html`. Lo único que queda global es
lo que de verdad es común: las tres caras tipográficas, la paleta base, el
telón y el grano.

Dos trampas que costaron un rato:

- **El partidor tiene que entender comentarios.** Una llave dentro de un
  comentario en prosa descuadra el conteo y media hoja sale sin acotar.
- **El preludio arrastra los comentarios de delante.** Con ellos pegados,
  `@media` y `@supports` dejan de reconocerse como arrobas y su interior entero
  sale sin acotar. Se separan antes de mirar de qué tipo es la regla.

## Lo que la fusión arregló por el camino

| | |
|---|---|
| tipografías | iban dos veces · **−75 KB** |
| símbolo del ojo | iba dos veces · **−12 KB** |
| capturas del catálogo | sobran cuando el catálogo está ahí abajo · **−54 KB** |
| grano | iba duplicado: el ruido se doblaba |
| rendimiento de la rueda | de **41 cuadros** sobre 20 ms a **1 de 144** |

**El haz ahora se enciende solo en el carrusel.** Antes seguía encendido en
toda la página. El haz existe para teñir la habitación con el color de la pieza
que está al frente, así que fuera del carrusel no significa nada: colgado de la
muestra entera lavaba el cierre de la propuesta, que está justo encima, y
seguía encendido en la sección de papel, que está justo debajo. Va colgado de
`#rueda`.

## Costuras que hubo que coser a mano

- **`<main>` anidado es HTML inválido.** El del catálogo pasa a `div` y su
  regla ya acotada se renombra con él.
- **El pie de la propuesta decía que eran dos archivos que viajan juntos.** Dejó
  de ser verdad en el momento de fundirlos. Hay un solo pie, al final.
- **Los enlaces al otro archivo** pasaron a anclas: `href="#muestra"`.
- El telón y el grano de la presentación los repone la plantilla, que ahora es
  la dueña del documento.

## Verificado sobre el fundido

| | |
|---|---|
| contraste, con JS | **50 de 50** |
| contraste, sin JS | **50 de 50** |
| a 320 px | sin desbordamiento |
| idioma | cambia la muestra y **no toca** la propuesta |
| rueda | mediana 16,7 ms · 1 cuadro de 144 sobre 20 ms |
| sin JavaScript | 6 tarjetas, 11 módulos, 13.952 caracteres legibles |

# Los módulos, completos

Faltaba **audiovisual**, que es un área entera de LQS y además el mayor
multiplicador de alcance en el único canal que la marca ya tiene. Son once, y
la entrada del tablero nombra ahora el territorio completo —marca, sitio,
automatización, audiovisual y producto— porque si no se nombra, no se ve que
esté.

# El saludo de entrada

El archivo único abre con una bienvenida a nombre de Mariana, que se va en
cuanto ella responde. Tres reglas que no hay que deshacer:

- **Nace oculto y solo el guion lo enseña.** Si el JavaScript no corre —el
  Quick Look de iOS, por ejemplo— no hay telón que apartar y la página empieza
  directamente. Comprobado: sin JS el saludo queda en `display:none` y siguen
  legibles los 13.952 caracteres.
- **No secuestra el scroll.** Un telón que bloquea el scroll en iOS es una
  trampa si algo sale mal. Este se aparta con el botón, con Escape, tocando
  fuera y al primer gesto de scroll.
- **Los oídos del scroll se enganchan con 400 ms de retardo.** Al recargar, el
  navegador restaura la posición y dispara un scroll que lo habría cerrado
  antes de que se llegara a ver.

Medido con el saludo puesto: los cinco elementos pasan contraste —el titular a
13,81:1, el más bajo a 7,39— y la caja cabe entera en 390 y en 320 px.

Para quitarlo o cambiar el nombre: `SALUDO` en `construir-pagina.py`, y se
reconstruye.

# Corrección: de quién es cada cosa

**El ojo, la flor, las cartas y el logotipo en versalitas son propuesta de
LQS.** No son la marca que la clienta tiene. Su marca actual es otra: un
emblema de cinco hojas en línea blanca con el nombre en palo seco, el que se ve
en su Instagram.

El documento llegó a decir «el ojo funciona como sello» y «el ojo, que ya era
de la marca». Las dos frases presentaban trabajo nuestro como patrimonio suyo,
que es exactamente lo que no puede pasar delante de una clienta. Corregido en
los tres sitios donde aparecía, con una comprobación en el constructor que
falla si alguna vuelve a colarse.

De paso la sección ganó el argumento que le faltaba: **su marca de hoy puesta
al lado de la propuesta.** El salto del emblema botánico simétrico a la
dirección Art Nouveau se ve, y ya no hace falta explicarlo en tres párrafos.
El titular pasó de «una propuesta sacada de la propia marca» —que tampoco era
cierto— a «una propuesta completa, no un retoque».

El aviso de maqueta dice ahora dos cosas más: que **nada de esto está en uso
todavía**, y que el catálogo de más abajo va armado con la propuesta puesta,
para verla aplicada y no solo dibujada.

# «Hoy no hay un logo. Hay cinco.»

La sección de dirección visual tenía un argumento flojo —«el logo actual es
genérico»— y resultó que el argumento de verdad era otro, mucho más fuerte y
además comprobable: **la marca usa cinco marcas distintas al mismo tiempo.**

| Dónde | Qué lleva |
|---|---|
| La cuadrícula | emblema de cinco hojas, línea blanca, nombre en palo seco |
| La foto de perfil | escudo dorado sobre corona de flores |
| Desodorante | emblema circular con matraz y luna |
| Roll on | otro emblema, arco y luna, sobre lila |
| Tónico | un tercero, triangular, sobre dorado |

Las cinco van puestas en fila, al mismo tamaño, recortadas de sus propias
fotos. **No hace falta afirmar que no hay sistema: se ve.** Y convierte la
propuesta de identidad completa en algo evidentemente necesario, en vez de un
capricho de diseñador.

El tono importa y está cuidado: *«Es lo normal cuando una marca crece haciendo
—cada cosa se resolvió en su momento, con lo que había a mano—, pero el efecto
es que nada se reconoce entre sí.»* Señala el problema sin reprochar nada.

# La carta animada

Doce fotogramas a 6 fps, dos segundos, el trazo rojo temblando como un dibujo
hecho a mano. El bucle **cierra solo**: la diferencia media entre el primer
fotograma y el último es 0,52 sobre 255, así que no hace falta ni recortar ni
hacer ida y vuelta.

Va en **WebP animado dentro de un `<img>`**, no en vídeo:

- un `<video autoplay>` depende de la política de reproducción automática del
  navegador y puede quedarse quieto;
- un `<img>` con WebP animado se mueve siempre, **también sin JavaScript** —
  comprobado en el estado sin guiones, donde sale a 264 px y animándose;
- y pesa mucho menos que un GIF, que además solo tiene 256 colores.

Recortada a la caja que ocupa el dibujo en **todos** los fotogramas —no en
uno—, para que no haya salto de encuadre. 131 KB.

Con movimiento reducido no hay manera de detener un WebP animado desde CSS.
Queda anotado: si molesta, la salida es duplicar la carta en una versión
estática y conmutarlas con `prefers-reduced-motion`.

# El archivo pesa 1,3 MB

Sigue abriendo sin conexión y sin dependencias, y por enlace o por WhatsApp va
de sobra. Si algún día hace falta adelgazarlo, por orden de lo que más pesa:
el tablero de marca (128 KB), la carta animada (131 KB), la foto de perfil
(34 KB) y las dos bandas de ambiente (71 KB).
