# Tito Tintao · la escena de la aguja

**Trabajo en pausa.** Se paró a mitad de la primera revisión. Lo que hay
funciona y abre, pero no está dado por bueno.

## Qué hay

`escena.html` — un solo archivo, 289 KB, sin librerías ni red. La zarigüeya
actuando la escena que dibujaste: plano blanco → corre → ve la aguja enterrada
→ la jala → la aguja se suelta y sube → se clava en mitad de la cabeza → logo.

## Cómo está hecho

**El muñeco es tu propio dibujo, recortado y articulado.** Seis piezas sacadas
de la pose de brazos abiertos de la hoja de giro: cabeza, torso, dos brazos y
dos piernas. Los cortes van generosos por donde se solapan, y el orden de
pintado —piernas y brazos primero, torso encima, cabeza al final— esconde los
cantos rectos del recorte.

**Comprobado: las seis piezas vuelven a montar el original con cero píxeles de
diferencia** sobre 118.778. La pose de reposo es exactamente la que dibujaste,
así que toda la articulación parte del sitio correcto.

**La animación entera es una función del tiempo.** No hay estado acumulado en
ningún sitio: `pose(t)` pinta el instante `t` y nada más. Por eso la barra de
abajo se puede arrastrar a cualquier punto, hacia delante o hacia atrás, y
parar en un fotograma concreto para mirarlo. Con animaciones por CSS eso no se
puede hacer.

**La aguja va en vector**, no recortada: tiene que poder girar, crecer y
clavarse limpia a cualquier tamaño, y así además casa con la del logotipo, que
es la misma forma. Está anclada por la PUNTA, que es lo único que importa —
girando sobre su punta se comporta como una aguja clavada de verdad.

**El cambio al logo va tapado con un fogonazo blanco.** El muñeco articulado y
el logotipo son dos dibujos distintos; el corte en blanco de dos fotogramas los
cose sin que se note el salto.

## Dónde se quedó

La última tanda de arreglos se aplicó sin errores pero **no se llegó a revisar
el resultado**:

- la aguja reanclada por la punta,
- el suelo como bloque de papel que tapa lo enterrado (en vez de recortar el
  SVG, que obligaba a cuadrar el largo del vástago a mano),
- el logo centrado contra la cámara en vez de contra el mundo.

Antes de seguir, lo primero es sacar el pliego de contacto de los once golpes y
mirarlo. El banco de pruebas está en el raspador de la sesión.

## Lo que ya se sabe que falta

- El logo no tiene letras todavía, solo la imagen. Era lo acordado.
- El frenazo no lee como frenazo: hace falta una pose de derrape, y con las
  piezas que hay no sale. Probablemente pida un dibujo nuevo.
- La cola no está articulada. Va dentro del torso, quieta.
