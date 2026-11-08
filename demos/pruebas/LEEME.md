# Pruebas de las muestras

    node demos/pruebas/probar-restaurantes.mjs
    node demos/pruebas/probar-tiendas.mjs
    node demos/pruebas/probar-bodegas.mjs

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
más de una vez: el ayudante leía la posición del desplazamiento antes de que
arrancara el desplazamiento suave y lo daba por quieto. Eso se arregla en el
ayudante, no tapándolo con una espera fija.
