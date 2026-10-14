# Alquimia Herbal · propuesta de sitio

`propuesta.html` — **un solo archivo**, 61 KB, sin librerías, sin CDN, sin
build. Se abre con doble clic y anda, también desde un correo o un USB.

## La mecánica

Diez piezas girando alrededor de un eje vertical de luz. El scroll mueve un
ángulo; de ese ángulo salen la posición, el tamaño, la opacidad y el orden de
apilado de cada frasco, y **la pieza que llega al frente decide el color de la
habitación** —el haz, el halo y el polvo se tiñen con ella—. Es el primo
hermano de la rueda de Rescoldo, pero en vez de un círculo plano hay una
proyección con fuga, y en vez de brasa hay luz.

Tres cosas que sostienen la sensación y que conviene no tocar sin saber:

- **La proyección con fuga.** `fuga = 2,2 / (3,2 − cos θ)`. El 2,2 es la
  distancia del punto de vista medida en radios. Más cerca da más profundidad
  pero comprime las equis: a 1,5 radios las piezas de 36° y 72° caen una
  encima de otra. Más lejos aplana el giro hasta que parece una fila.
  Sin la división —con el seno a secas— θ y 180−θ caen en la **misma** equis y
  la pieza del fondo queda exactamente detrás de la del frente: se ve como una
  doble exposición, un cristal fantasma dentro del frasco.
- **El muelle.** Críticamente amortiguado, respuesta 0,42 s, en forma
  semi-implícita para que la velocidad sobreviva a los cambios de objetivo.
  Eso es lo que deja frenar el giro a media vuelta sin que pegue un salto.
- **El reposo.** Cuando el scroll calla 120 ms, el objetivo se redondea al
  paso más cercano y el muelle lleva la pieza al frente él solo. La corrección
  nunca pasa de medio paso, así que no pelea con el scroll: se lee como que la
  rueda se asienta. Está medido: en reposo la pieza del frente llega a
  opacidad 1 exacta.

El polvo es un lienzo con 70 motas (38 en móvil), más brillantes dentro de la
columna de luz que fuera —es lo que hace que el haz se lea como un volumen y
no como un degradé pegado al fondo—. **El scroll las revuelve**: el impulso
entra con la velocidad del scroll y se amortigua solo.

## El color, que es la decisión que hay que defender primero

La identidad es clara —crema, verde medio, verde claro— y las referencias que
llegaron son oscuras y con mucha luz dorada. No se pueden tener las dos, así
que la luz se hace **con** la paleta en vez de traer un dorado ajeno:

- el fondo es un verde tan oscuro que lee casi negro (sigue siendo la familia
  verde, no un azul ni un gris neutro),
- la crema pasa a ser el color del texto,
- el **verde claro `#c2eaaa` pasa a ser el color de la luz**, que es lo que ese
  verde hace mejor,
- el rojo `#a31111` no aparece: sobre este fondo se queda en 2,4:1. El acento
  es su versión encendida.

Dos excursiones fuera de la paleta, a propósito: el violeta de la lavanda y el
azul frío de la selenita. Son tintes de **luz**, no colores de marca, y son
los dos únicos momentos en que la habitación cambia de temperatura. Si se
permiten diez, deja de ser un gesto.

## Lo que hay que saber antes de tocarla

- **El estado por defecto es el legible.** El catálogo vive en el HTML, no en
  el script: con JavaScript apagado la página se lee entera, las diez piezas
  con su descripción, sus componentes y su formato. El JS lee ese HTML para
  armar la rueda, que es lo único que de verdad necesita JavaScript. (Antes el
  catálogo estaba en un array y la mesa se construía sola: sin script quedaba
  el rótulo «diez piezas» y ni una pieza debajo. Está arreglado; conviene que
  siga así.)
- **`prefers-reduced-motion` no monta la rueda.** Queda la mesa, con el color
  y el contenido intactos, y el polvo apagado. Apagar el movimiento no es
  castigar a quien lo pidió.
- **La rueda se desmonta sola** si no queda banda para una pieza legible, y
  vuelve si la ventana crece. Es deliberado.
- **La banda de la rueda se mide, no se calcula.** El orbe es el hijo flexible
  de la columna, así que su alto es lo que la ficha dejó libre. Por eso
  `geometria()` se vuelve a llamar cada vez que la ficha cambia: la
  descripción pasa de dos líneas a cinco según el ancho y la pieza.
- **Los glifos van dentro de un `<use>`, o sea en un árbol sombra.** Un
  selector no entra ahí: lo único que cruza esa frontera es la herencia. Por
  eso `fill` y `stroke` se declaran en el propio `.glifo` y las manchas de
  relleno van como atributo de presentación en el símbolo. Si alguien mueve
  esas declaraciones a `.glifo g`, los diez frascos vuelven a salir como
  siluetas negras.
- **Contraste medido, no supuesto**, sobre el compuesto real (degradé vivo +
  lienzo de partículas), elemento por elemento: lo más justo es la pista de
  «baja» a 5,05:1 y los pendientes a 5,09:1, sobre 4,5 que pide el texto
  pequeño. Los puntos del índice pasaron de .3 a .44 de alfa porque a .3 se
  quedaban en 2,31:1 y un control pide 3:1.

## Lo que falta para que esto deje de ser una propuesta

1. **El número de WhatsApp.** Es lo único que hoy no hace nada: el botón avisa
   «falta el número» en vez de inventarlo. Con el número queda el enlace
   directo con el mensaje ya escrito.
2. **Las fotos.** Los diez frascos están dibujados a línea, en el mismo idioma
   que la marca —que ya es línea—. Ocupan exactamente el sitio y el tamaño
   donde van las fotos, así que cada dibujo se reemplaza por su foto sin tocar
   nada más. **No se pudieron sacar del Instagram**: el proxy de este entorno
   bloquea `instagram.com`, así que el catálogo se armó con las dos capturas
   de la cuadrícula que mandaste. Los nombres y la gama son los reales; el
   resto es de muestra.
3. **Las cifras.** Mililitros, gramos, centímetros y días de curado de cada
   ficha hay que confirmarlos uno por uno antes de publicar. Hoy son
   verosímiles, no verificados.
4. **El logotipo.** El ojo vectorizado es la marca; el nombre va hoy en
   Georgia porque no hay tipografía propia montada. Cuando esté compuesto el
   wordmark, entra en su lugar.
5. **La tipografía.** Letra del sistema a propósito: así el archivo no pide
   nada a la red. Si se quiere una familia propia, se bajan los `.woff2` a una
   carpeta y se cambia por un `@font-face`; mientras tanto no se rompe nada.

## Lo que decidí dejar fuera, y por qué conviene hablarlo

En la cuadrícula del Instagram hay **rapés, mambe, microdosis de Wachuma y
pomada de coca y cannabis**. No están en el catálogo abierto. No es pudor: es
que un catálogo público con precios y botón de pedido sobre esos productos es
otra conversación —legal, de plataforma y de pasarela de pago—, y la mezcla
con los cosméticos arrastra a los cosméticos. En la página hay una sección
corta que los nombra sin venderlos y manda al directo.

Lo mismo con las afirmaciones: ninguna ficha dice que algo prevenga, alivie o
cure nada, ni el tónico, que en el Instagram se llama «anti-acné». La ficha
dice qué lleva y cómo se usa. El recuadro «Lo que esta página no dice» está
puesto a la vista y no en letra chica, que es lo que corresponde cuando se
venden preparados hechos a mano. **Esto es criterio de diseño, no asesoría
legal**: si la marca va a facturar, conviene que alguien de Invima mire la
rotulación de los cosméticos.
