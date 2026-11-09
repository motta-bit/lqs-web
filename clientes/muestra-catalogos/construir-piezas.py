#!/usr/bin/env python3
"""Incrusta las piezas recortadas dentro de demos/catalogos.html.

    python3 construir-piezas.py ../../demos/catalogos.html

Las piezas son los productos recortados de las propias referencias que mandó
el cliente —los platos, no el texto—, cada uno con su canal alfa. Van en
base64 dentro del CSS, como variables de :root, porque la muestra es un solo
archivo: tiene que abrir desde un correo, un USB o un doble clic, sin red.

Variables y no <img> por lo mismo de siempre: el mismo recorte se usa a un
tamaño en la hoja y a otro si mañana cambia la maquetación, y con
background-size una sola copia sirve.

El bloque se reemplaza entre marcas, así que se puede volver a correr encima
del archivo ya construido cuantas veces haga falta.

Cómo se sacaron las piezas está en LEEME.md, con las coordenadas de cada una.
"""
import base64
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
PIEZAS = os.path.join(AQUI, 'piezas')

INICIO = '/* ══ PIEZAS ══ generado por clientes/muestra-catalogos/construir-piezas.py */'
FIN = '/* ══ FIN PIEZAS ══ */'


def uri(ruta):
    with open(ruta, 'rb') as f:
        return 'data:image/webp;base64,' + base64.b64encode(f.read()).decode('ascii')


def bloque():
    nombres = sorted(n[:-5] for n in os.listdir(PIEZAS) if n.endswith('.webp'))
    if not nombres:
        sys.exit('No hay piezas en ' + PIEZAS)
    lineas = [INICIO, ':root{']
    for n in nombres:
        lineas.append('--f-%s:url("%s");' % (n, uri(os.path.join(PIEZAS, n + '.webp'))))
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
        marca = '</style>'
        if marca not in html:
            sys.exit('No encuentro </style> en ' + destino)
        i = html.index(marca)
        html = html[:i] + nuevo + '\n' + html[i:]
        accion = 'insertado'

    open(destino, 'w', encoding='utf-8').write(html)

    # Avisar de variables declaradas que nadie usa, y al revés: una pieza que
    # se queda fuera engorda el archivo sin que se note, y una que falta deja
    # un hueco vacío que tampoco da ningún error.
    usadas = set(re.findall(r'var\(--f-([a-z0-9-]+)\)', html))
    sobran = sorted(set(nombres) - usadas)
    faltan = sorted(usadas - set(nombres))
    print('%s: %d piezas, %d KB en el archivo' %
          (accion, len(nombres), len(nuevo) // 1024))
    if sobran:
        print('  · declaradas y sin usar: ' + ', '.join(sobran))
    if faltan:
        print('  · usadas y sin archivo: ' + ', '.join(faltan))
        sys.exit(1)


if __name__ == '__main__':
    main()
