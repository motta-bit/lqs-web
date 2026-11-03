#!/usr/bin/env python3
"""Incrusta las fotos de la muestra de restaurantes dentro del HTML.

    python3 construir-fotos.py ../../demos/restaurantes.html

La muestra es un solo archivo: tiene que abrir desde un correo, un USB o un
doble clic, sin red. Así que las fotos van en base64 dentro del propio CSS,
como variables de :root, y no como archivos al lado.

Variables, no <img>: el mismo cuadrado se ve a 72 px en la carta, a 150 en
el carrusel y a 300 de ancho en la disposición libre. Con background-size:
cover una sola copia sirve para las cuatro, y la del local —que es la única
apaisada— funciona igual. Además la foto del local queda visible aunque el
guion no corra, porque su marcado es estático.

El bloque se reemplaza entre marcas, así que el script se puede volver a
correr encima del archivo ya construido cuantas veces haga falta.
"""
import base64
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
FOTOS = os.path.join(AQUI, 'fotos')

INICIO = '/* ══ FOTOS ══ generado por clientes/muestra-restaurantes/construir-fotos.py */'
FIN = '/* ══ FIN FOTOS ══ */'


def uri(ruta):
    with open(ruta, 'rb') as f:
        return 'data:image/webp;base64,' + base64.b64encode(f.read()).decode('ascii')


def bloque():
    nombres = sorted(n[:-5] for n in os.listdir(FOTOS) if n.endswith('.webp'))
    if not nombres:
        sys.exit('No hay fotos en ' + FOTOS)
    lineas = [INICIO, ':root{']
    for n in nombres:
        lineas.append('--f-%s:url("%s");' % (n, uri(os.path.join(FOTOS, n + '.webp'))))
    lineas.append('}')
    lineas.append(FIN)
    return '\n'.join(lineas), nombres


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    destino = sys.argv[1]
    html = open(destino, encoding='utf-8').read()
    nuevo, nombres = bloque()

    if INICIO in html:
        i = html.index(INICIO)
        j = html.index(FIN, i) + len(FIN)
        html = html[:i] + nuevo + html[j:]
        accion = 'reemplazado'
    else:
        # primera vez: entra justo antes de que cierre el <style>
        marca = '</style>'
        if marca not in html:
            sys.exit('No encuentro </style> en ' + destino)
        i = html.index(marca)
        html = html[:i] + nuevo + '\n' + html[i:]
        accion = 'insertado'

    open(destino, 'w', encoding='utf-8').write(html)

    # Avisar de variables declaradas que nadie usa, y al revés. Hay que mirar
    # dos sitios: el CSS/HTML donde el nombre está escrito entero —la foto del
    # local— y los datos de la carta, donde el guion arma «var(--f-» + foto.
    usadas = set(re.findall(r'var\(--f-([a-z0-9-]+)\)', html))
    usadas |= set(re.findall(r"foto:'([a-z0-9-]+)'", html))
    sobran = sorted(set(nombres) - usadas)
    faltan = sorted(usadas - set(nombres))
    print('%s: %d fotos, %d KB en el archivo' %
          (accion, len(nombres), len(nuevo) // 1024))
    if sobran:
        print('  · declaradas y sin usar: ' + ', '.join(sobran))
    if faltan:
        print('  · usadas y sin archivo: ' + ', '.join(faltan))
        sys.exit(1)


if __name__ == '__main__':
    main()
