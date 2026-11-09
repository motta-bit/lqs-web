# Pruebas de las muestras

    node demos/pruebas/probar-restaurantes.mjs
    node demos/pruebas/probar-tiendas.mjs
    node demos/pruebas/probar-bodegas.mjs
    node demos/pruebas/probar-catalogos.mjs

Necesitan Playwright y un Chromium. Cada una abre su archivo de `demos/`,
lo recorre y escribe capturas en `demos/pruebas/capturas-<rubro>/` (o en la
carpeta que se les pase como argumento). Salen con código 1 si algo falla.

**No son pruebas de humo.** Están para medir lo que no se puede mirar a ojo
y para que nadie deshaga sin darse cuenta una decisión que costó medirla:

- **Contraste sobre el compuesto real**, elemento por elemento. Cada uno se
  fotografía dos veces, con texto y sin él, y se compara cada píxel contra su
  propio fondo; el valor se lee en los píxeles de cobertura total, porque en
  los del borde el antialias da razones falsamente bajas. Así salieron los
  tonos medios de las dos paletas: con la opacidad que tenían a ojo, el texto
  pequeño se quedaba en 3,2:1.
- **Desborde horizontal a 320 y 390 px**, y en las cuatro disposiciones del
  catálogo. Aquí se cazó que un `1fr` pelado arrastra el mínimo `auto` del
  teléfono y estira la columna a 457 px dentro de 284.
- **Que nada se salga de su hoja ni se monte encima de lo de al lado**, en las
  muestras de maquetación, donde las entradas van puestas a mano en absoluto.
  Se mide el ancho real del texto, no el de la caja: una palabra en versales
  muy espaciadas se sale de su columna sin que la caja crezca.
- **La página sin JavaScript**: cuántos caracteres quedan legibles, que nada
  quede invisible y que el cambio de idioma siga funcionando.
- **Que no envejezca**: que la vigencia de la franja salga del reloj y que no
  haya ningún año escrito a mano en toda la página.
- **Que lo prometido funcione**: el filtro, el carrito, el mensaje de WhatsApp
  escribiéndose solo, el recorrido de pago entero, las cuatro disposiciones y
  —en tiendas— que la talla agotada esté bloqueada y que la escogida llegue al
  mensaje; y —en bodegas— que el precio por unidad se calcule y cambie con la
  presentación, que la caja que ya no cabe en las existencias se bloquee sola,
  que el producto en cero no se pueda añadir y que el mínimo de bodega abra a
  medias y se complete al añadir una caja.

Cuando una falla, **mirar primero si el error está en la prueba**. Ha pasado
más de una vez:

- El ayudante leía la posición del desplazamiento antes de que arrancara el
  desplazamiento suave y lo daba por quieto.
- El parámetro del `evaluate` que calcula la caja se desestructuraba como
  `{i}` y se le pasaba `{id}`. El selector no casaba con nada, la caja salía
  nula, **todos** los elementos se saltaban en silencio y las cuatro pruebas
  cantaban «todos los elementos medidos pasan 4,5:1» sin haber medido uno. De
  ahí la guardia que ahora falla si no se pudo medir el 80 %: una prueba que
  no mide nada tiene que decirlo, no aprobar.
- Dos fotogramas iguales no bastan para dar algo por quieto. Mientras corre el
  **retardo** de la animación de aparición no se mueve nada, así que la foto
  «con texto» salía sobre el hueco todavía vacío y la de «sin texto» pillaba el
  texto a medio aparecer: contraste de 1,1:1 sobre un negro sobre crema que de
  verdad da 14:1. Ahora se pregunta si queda alguna animación en marcha —y se
  le pregunta también a los **antepasados**, porque la aparición vive en el
  bloque de arriba, no en el texto, y `getAnimations({subtree:true})` mira
  hacia abajo y nunca hacia arriba: por ahí se colaba—. Y se vuelve a medir la
  caja después de la segunda foto, por si se movió entre las dos.
- El primer intento de arreglar eso miraba la **opacidad acumulada** del
  elemento y sus padres, exigiendo que llegara a 1. Dejó sin medir los
  veinticuatro textos de la carta de bloques de color, que tienen opacidad de
  diseño 0,86 y nunca van a llegar a 1. Una condición que no distingue la
  opacidad de una animación de la opacidad de un diseño no sirve.

Todo eso se arregla en el ayudante, no tapándolo con una espera fija. Lo que
de verdad no se queda quieto se lista aparte como «sin medir», que es lo que
es: ni bueno ni malo, sin medir.
