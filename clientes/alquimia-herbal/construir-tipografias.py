"""Deja Legrand y Glacial Indifference listas para incrustar.

Ninguna de las dos cubre entero el castellano tal como vienen:

  Legrand  tiene el punto medio DIBUJADO pero sin mapear  → basta mapearlo,
           así se usa el punto del propio diseñador y no una invención mía.
  Glacial  no trae ¿ ¡ ·  de ninguna forma               → se construyen a
           partir de glifos que la fuente ya tiene: ¿ es ? girado 180°, ¡ es
           ! girado 180°, y · es el punto subido. Girar es exactamente lo
           que son esos signos, no una aproximación.

Las guillas « » no están en ninguna de las dos y no se pueden derivar de
nada: esas se cambian en el texto por “ ”, que ambas sí tienen y que son
igual de correctas en castellano.

Van enteras a woff2, sin recortar por caracteres: las tres suman poco y así
no falta un glifo el día que alguien edite una frase.
"""
from fontTools.ttLib import TTFont
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.misc.transform import Transform
import os, subprocess

D = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(D, 'tipos')
OUT = os.path.join(D, 'tipos-listos')
os.makedirs(OUT, exist_ok=True)

# codepoint, nombre estándar, de qué glifo sale, cómo se transforma
RECETA = [
    (0x00BF, 'questiondown',   0x003F, 'giro'),
    (0x00A1, 'exclamdown',     0x0021, 'giro'),
    (0x00B7, 'periodcentered', 0x002E, 'sube'),
]


def mapea(f, cp, nombre):
    for t in f['cmap'].tables:
        if t.isUnicode():
            t.cmap[cp] = nombre


def dibuja(f, cp, nombre, origen, modo, cap):
    """Añade el glifo transformado. Solo se llama si no está ya dibujado."""
    cff = 'CFF ' in f
    gs = f.getGlyphSet()
    w = gs[origen].width
    tr = (Transform().translate(w, cap).scale(-1, -1) if modo == 'giro'
          else Transform().translate(0, cap * 0.42))
    rec = RecordingPen()
    gs[origen].draw(rec)
    pen = T2CharStringPen(w, None) if cff else TTGlyphPen(gs)
    rec.replay(TransformPen(pen, tr))

    if cff:
        top = f['CFF '].cff.topDictIndex[0]
        cs = pen.getCharString(private=top.Private)
        ch = top.CharStrings
        if getattr(ch, 'charStringsAreIndexed', False):
            ch.charStringsIndex.append(cs)
            ch.charStrings[nombre] = len(ch.charStringsIndex) - 1
        else:
            ch.charStrings[nombre] = cs
        if nombre not in top.charset:
            top.charset.append(nombre)
        f.setGlyphOrder(list(dict.fromkeys(f.getGlyphOrder() + [nombre])))
    else:
        # glyf.__setitem__ ya mantiene su propio orden, que además es la misma
        # lista que la de la fuente: tocarla otra vez la descuadra.
        f['glyf'][nombre] = pen.glyph()

    f['hmtx'][nombre] = (w, 0)
    f['maxp'].numGlyphs = len(f.getGlyphOrder())
    mapea(f, cp, nombre)


informe = []
for arch, fam, peso in [
    ('glacial/GlacialIndifference-Regular.otf', 'Glacial Indifference', 400),
    ('glacial/GlacialIndifference-Bold.otf',    'Glacial Indifference', 700),
    ('legrand/Legrand Regular.ttf',             'Legrand',              400),
]:
    ruta = os.path.join(T, arch)
    f = TTFont(ruta)
    cmap = f.getBestCmap()
    orden = set(f.getGlyphOrder())
    try:
        cap = f['OS/2'].sCapHeight or 0
    except Exception:
        cap = 0
    if not cap:
        cap = int(f['head'].unitsPerEm * 0.68)

    mapeados, dibujados = [], []
    for cp, nombre, orig_cp, modo in RECETA:
        if cp in cmap:
            continue
        if nombre in orden:                 # ya está dibujado: solo mapear
            mapea(f, cp, nombre)
            mapeados.append(nombre)
            continue
        og = cmap.get(orig_cp)
        if not og:
            raise SystemExit(f'{arch}: no hay de dónde sacar {nombre}')
        dibuja(f, cp, nombre, og, modo, cap)
        dibujados.append(nombre)

    ext = '.otf' if 'CFF ' in f else '.ttf'
    tmp = os.path.join(OUT, '_tmp' + ext)
    f.save(tmp)
    f.close()
    destino = os.path.join(OUT, f'{fam.replace(" ", "")}-{peso}.woff2')
    subprocess.run(['python3', '-m', 'fontTools.ttLib.woff2', 'compress',
                    '-o', destino, tmp], check=True,
                   stdout=subprocess.DEVNULL)
    os.remove(tmp)

    # comprobación: lo guardado abre y tiene de verdad los tres signos
    v = TTFont(destino, lazy=True)
    cm = v.getBestCmap()
    falta = [hex(cp) for cp, _, _, _ in RECETA if cp not in cm]
    v.close()
    informe.append((os.path.basename(arch), peso, round(os.path.getsize(ruta) / 1024),
                    round(os.path.getsize(destino) / 1024), mapeados, dibujados, falta))

print(f'{"archivo":42}{"peso":>5}{"orig":>6}{"woff2":>7}  mapeados / dibujados')
tot = 0
for a, p, o, w, m, d, falta in informe:
    tot += w
    assert not falta, (a, falta)
    print(f'{a:42}{p:>5}{o:>5}K{w:>6}K  {"+".join(m) or "—"} / {"+".join(d) or "—"}')
print(f'\ntotal woff2 {tot} KB · en base64 ≈ {round(tot * 1.34)} KB')
print('las tres abren y las tres tienen ¿ ¡ ·')
