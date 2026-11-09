# Muestra de maquetación de catálogo

Las piezas de `piezas/` son los **productos recortados de las propias
referencias que mandó el cliente**: los platos, no el texto. Se incrustan en
`demos/catalogos.html` con

    python3 clientes/muestra-catalogos/construir-piezas.py ../../demos/catalogos.html

y las hojas se exportan a JPG con

    node clientes/muestra-catalogos/exportar.mjs [carpeta]

El exportador saca **sólo las hojas** —ni la entrada, ni los pies de cada
muestra, ni el cierre— y las saca **dos veces**: con fotografía y con los
huecos marcados. Las dos versiones salen del mismo archivo, encendiendo una
clase `sin-fotos` en `<html>`; mantener dos archivos en paralelo es la forma
segura de que uno se quede atrás.

## Cómo se sacó cada pieza

Tres situaciones distintas y tres herramientas distintas, y ninguna de las
tres sirve para las otras dos.

**Platos sobre color plano** (la carta de bloques de color). Se recortan por
color, y el método tardó tres intentos:

- Distancia al COLOR del fondo: la sombra del plato queda a media distancia,
  entra con medio alfa, enlaza con el texto de debajo y el recorte se trae
  el pie de foto entero.
- Distancia al RAYO del fondo —el mismo color multiplicado— : la sombra cae
  a cero, pero la comida marrón sobre naranja también, porque es naranja
  oscuro, y el plato sale transparente por dentro.
- **Las dos cosas a la vez**: fondo es lo que está sobre el rayo *y* se
  alcanza desde el borde del recorte. La comida no llega al borde; la sombra
  sí. Eso las separa.

Y después, dos detalles que se notan si faltan: morder un píxel hacia dentro
antes de desvanecer —si no, el plato se lleva un anillo del amarillo de la
referencia y ese anillo canta sobre el bloque rosa— y admitir **varios**
colores de fondo, porque la página rosa tiene un rosa de página y otro de
panel.

**Platos sobre negro con reflejo** (la carta de sushi). Aquí no sirve ningún
umbral: el alga es tan oscura como el papel. Con el umbral flojo se cuela la
página; con el umbral apretado la pieza sale agujereada; inundando desde el
borde, el alga toca el papel y la inundación atraviesa la pieza entera.
También se probó quitar el reflejo por la silueta —ancho, cintura, ancho— y
funciona, pero se lleva por delante las composiciones de dos piezas
apiladas.

Lo que se hace es **encuadrar**: el reflejo y los rótulos rusos se quedan
fuera de cuadro, que es más fiable que cualquier umbral, y de paso la pieza
llena el marco y se aprovecha el poco detalle que hay. El negro de la
referencia está levantado (27 de luminancia, no 11), así que se resta la
diferencia, y lo que quede —la página tiene viñeteado— se reparte en un
desvanecido de marco ancho y deja de verse.

**Platos sobre negro sin reflejo** (la carta de pasta). Se llevan el
alrededor consigo y se desvanecen en redondo: el fondo de la referencia y el
de la hoja son el mismo negro, así que la pieza se funde sin borde. Donde el
círculo se sale de la foto se rellena por reflejo; en el plato que la
referencia corta por el margen, no —el reflejo lo duplicaba en espejo y se
veía a la legua—, y en su lugar el corte se coloca fuera de la hoja.

## Lo que no se pudo

**La hoja 3 se queda con los huecos marcados.** Su referencia es una
maqueta: veinte páginas pequeñas dentro de una sola imagen de 854 px. El
jarrón más grande que hay ahí mide 85 px y el hueco pide 318. Agrandarlo
cuatro veces se ve, y se ve mal.

## Las fotos originales no están aquí

Las once referencias son del cliente y no se guardan en el repositorio. Las
piezas de `piezas/` son recortes suyos: antes de que esto salga de una
reunión y se publique en ningún sitio, hay que resolver de quién es esa
fotografía.
