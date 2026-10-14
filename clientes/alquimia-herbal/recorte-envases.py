"""Recorta UN solo envase de una foto donde hay varios.

   Tres cosas que hay que resolver y que el recorte por inundación no
   resuelve solo:

   1. El fondo tiene textura —mármol, lino, pasto, tela—, así que no hay
      un color de fondo al que parecerse. Lo que sí distingue al envase
      es una REGLA de color propia de cada foto: el vidrio ámbar tiene
      saturación alta, la copalera tiene más rojo que verde, el jabón es
      claro sobre tela roja.
   2. La etiqueta es casi del color del fondo, así que la regla le abre
      un agujero en mitad del frasco. Se tapa rellenando huecos: fondo es
      solo lo que está CONECTADO con el borde del recorte; lo de dentro,
      aunque se parezca al fondo, es envase.
   3. Queda una orla de píxeles de fondo pegada al contorno —las «partes
      blancas extras»—. Se come erosionando la máscara un par de píxeles
      antes de difuminar el canto.
"""
from PIL import Image, ImageFilter
import numpy as np

def _dilata(m, n=1):
    for _ in range(n):
        d = m.copy()
        d[1:,:] |= m[:-1,:]; d[:-1,:] |= m[1:,:]
        d[:,1:] |= m[:,:-1]; d[:,:-1] |= m[:,1:]
        m = d
    return m

def _erosiona(m, n=1):
    return ~_dilata(~m, n)

def _conectado_al_borde(cand):
    """La parte de cand que toca el borde del lienzo."""
    h, w = cand.shape
    alc = np.zeros((h,w), bool)
    alc[0,:] |= cand[0,:]; alc[-1,:] |= cand[-1,:]
    alc[:,0] |= cand[:,0]; alc[:,-1] |= cand[:,-1]
    while True:
        n = alc.sum()
        alc = _dilata(alc) & cand
        if alc.sum() == n: return alc

def _mayor(m):
    """La componente conexa más grande, etiquetando de verdad.

       La versión anterior buscaba una semilla «interior» con una
       transformada de distancia falsa —sumaba seis veces la MISMA
       erosión, así que todos los píxeles interiores empataban— y
       argmax devolvía el primero en orden de barrido. Con la regla del
       rodillo ampliada, ese primero caía en una mota oscura suelta del
       borde de arriba y la componente «mayor» salía de cuatro píxeles.
       Aquí se etiqueta por filas con unión-búsqueda y se devuelve la
       etiqueta con más píxeles, que es lo que decía el nombre."""
    h, w = m.shape
    pad = {}
    def raiz(x):
        while pad[x] != x: pad[x] = pad[pad[x]]; x = pad[x]
        return x
    def une(x, y):
        rx, ry = raiz(x), raiz(y)
        if rx != ry: pad[max(rx,ry)] = min(rx,ry)
    etq = np.zeros((h,w), np.int32); sig = 1
    for y in range(h):
        if not m[y].any(): continue
        for x in np.flatnonzero(m[y]):
            izq = etq[y, x-1] if x > 0 else 0
            arr = etq[y-1, x] if y > 0 else 0
            if izq and arr: etq[y,x] = izq; une(izq, arr)
            elif izq: etq[y,x] = izq
            elif arr: etq[y,x] = arr
            else: etq[y,x] = sig; pad[sig] = sig; sig += 1
    if sig == 1: return np.zeros_like(m)
    mapa = np.zeros(sig, np.int32)
    for k in range(1, sig): mapa[k] = raiz(k)
    etq = mapa[etq]
    cuentas = np.bincount(etq.ravel()); cuentas[0] = 0
    return etq == int(np.argmax(cuentas))

def recorta(path, caja, regla, cerrar=3, come=2, suaviza=0.9, margen=0.06):
    im = Image.open(path).convert('RGB').crop(caja)
    a = np.asarray(im).astype(np.int16)
    m = regla(a)
    m = _erosiona(_dilata(m, cerrar), cerrar)       # sella grietas finas
    m = ~_conectado_al_borde(~m)                    # rellena la etiqueta
    m = _mayor(m)
    if come: m = _erosiona(m, come)                 # se come la orla de fondo
    alf = Image.fromarray(np.where(m, 255, 0).astype(np.uint8))
    if suaviza: alf = alf.filter(ImageFilter.GaussianBlur(suaviza))
    out = im.convert('RGBA'); out.putalpha(alf)
    ys, xs = np.where(m)
    if not len(ys): return out, None
    return out.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1)), (len(ys), m.size)

# ── reglas de color, una por foto ──────────────────────────────────────
def sat(a):
    mx, mn = a.max(2), a.min(2)
    return np.where(mx > 0, (mx-mn) / np.maximum(mx,1), 0)
def lum(a):
    return (a[:,:,0]*0.299 + a[:,:,1]*0.587 + a[:,:,2]*0.114)

AMBAR  = lambda a: (sat(a) > 0.30) | (lum(a) < 120)      # vidrio ámbar y tapa negra
BARRO  = lambda a: (a[:,:,0] - a[:,:,1] > 14) & (lum(a) > 55)
CLARO  = lambda a: (a[:,:,1] > 118) & (sat(a) < 0.52)    # jabón claro sobre tela roja

def pon(rgba, lado=640, margen=0.07, alto=True):
    """Centra la pieza en un lienzo 4:5 sin deformarla."""
    W, H = lado, round(lado*1.25)
    dw, dh = round(W*(1-2*margen)), round(H*(1-2*margen))
    w, h = rgba.size
    e = min(dw/w, dh/h)
    r = rgba.resize((max(1,round(w*e)), max(1,round(h*e))), Image.LANCZOS)
    cap = Image.new('RGBA', (W,H), (0,0,0,0))
    cap.paste(r, ((W-r.width)//2, (H-r.height)//2), r)
    return cap

def relleno_por_filas(m, minimo=3):
    """Rellena cada fila entre su primer y su último píxel de máscara.

       En el desodorante la etiqueta blanca llega hasta el canto del
       vidrio, así que la regla del ámbar deja un anillo con un boquete
       lateral y el relleno de huecos no lo cierra: el hueco está
       conectado con el fondo. Pero un frasco es CONVEXO en cada fila
       —de su borde izquierdo al derecho todo es frasco—, y eso sí lo
       cierra. Vale para frascos; no valdría para un asa o un manojo."""
    out = np.zeros_like(m)
    for y in range(m.shape[0]):
        xs = np.flatnonzero(m[y])
        if len(xs) >= minimo:
            out[y, xs.min():xs.max()+1] = True
    return out

def recorta_frasco(path, caja, regla, cerrar=3, come=2, suaviza=0.9):
    im = Image.open(path).convert('RGB').crop(caja)
    a = np.asarray(im).astype(np.int16)
    m = regla(a)
    m = _erosiona(_dilata(m, cerrar), cerrar)
    m = _mayor(m)                       # el frasco, no los pétalos sueltos
    m = relleno_por_filas(m)
    m = ~_conectado_al_borde(~m)
    m = _mayor(m)
    if come: m = _erosiona(m, come)
    alf = Image.fromarray(np.where(m, 255, 0).astype(np.uint8))
    if suaviza: alf = alf.filter(ImageFilter.GaussianBlur(suaviza))
    out = im.convert('RGBA'); out.putalpha(alf)
    ys, xs = np.where(m)
    if not len(ys): return out, None
    return out.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1)), (int(xs.max()-xs.min()), int(ys.max()-ys.min()))

def poda_filas_anchas(m, tope=1.3):
    """Quita las filas desproporcionadamente anchas.

       Medido sobre las fotos: la mesa y el fondo que se cuelan por el
       borde del recorte producen filas mucho más anchas que el cuerpo
       del frasco, y como tocan la base quedan unidas a él, así que ni
       la componente mayor ni el relleno de huecos las sueltan. El
       cuerpo de un frasco tiene ancho casi constante: la mediana manda
       y lo que pase de 1,3 veces esa mediana no es frasco."""
    anchos = [(y, int(m[y].sum())) for y in range(m.shape[0]) if m[y].any()]
    if not anchos: return m
    med = np.median([a for _, a in anchos])
    out = m.copy()
    for y, a in anchos:
        if a > med * tope: out[y] = False
    return out

def recorta_frasco2(path, caja, regla, cerrar=3, come=2, suaviza=0.9, poda=1.3):
    im = Image.open(path).convert('RGB').crop(caja)
    a = np.asarray(im).astype(np.int16)
    m = regla(a)
    m = _erosiona(_dilata(m, cerrar), cerrar)
    m = _mayor(m)
    m = relleno_por_filas(m)
    m = poda_filas_anchas(m, poda)
    m = _mayor(m)
    m = ~_conectado_al_borde(~m)
    if come: m = _erosiona(m, come)
    alf = Image.fromarray(np.where(m,255,0).astype(np.uint8))
    if suaviza: alf = alf.filter(ImageFilter.GaussianBlur(suaviza))
    out = im.convert('RGBA'); out.putalpha(alf)
    ys, xs = np.where(m)
    if not len(ys): return out, None
    return out.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1)), (int(xs.max()-xs.min()+1), int(ys.max()-ys.min()+1))

# reglas medidas sobre cada foto, no supuestas
TONICO = lambda a: (lum(a) < 120) | (sat(a) > 0.45)
DESOD  = lambda a: (lum(a) < 130)

def recorta_envase(path, caja, regla, cerrar=3, sella=8, abre=5, come=2, suaviza=0.9):
    """La buena. Vista la máscara etapa por etapa, el relleno por filas y
       la poda sobraban y además cortaban el frasco: la regla de color ya
       da la silueta. Lo que faltaba era

         sella — un cierre grande: el hueco de la etiqueta se escapaba al
                 exterior por un canalillo de 6 px y por eso el relleno
                 de huecos no lo tapaba;
         abre  — una apertura: quita las púas que deja la regla (un
                 pétalo, una ramita de la etiqueta) sin tocar el cuerpo;
         come  — una erosión final que se lleva la orla de píxeles de
                 fondo pegada al contorno, las «partes blancas extras».
    """
    im = Image.open(path).convert('RGB').crop(caja)
    a = np.asarray(im).astype(np.int16)
    m = regla(a)
    m = _erosiona(_dilata(m, cerrar), cerrar)
    m = _mayor(m)
    m = _erosiona(_dilata(m, sella), sella)
    m = ~_conectado_al_borde(~m)
    m = _dilata(_erosiona(m, abre), abre)
    m = _mayor(m)
    if come: m = _erosiona(m, come)
    alf = Image.fromarray(np.where(m,255,0).astype(np.uint8))
    if suaviza: alf = alf.filter(ImageFilter.GaussianBlur(suaviza))
    out = im.convert('RGBA'); out.putalpha(alf)
    ys, xs = np.where(m)
    if not len(ys): return out, None
    return out.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1)), (int(xs.max()-xs.min()+1), int(ys.max()-ys.min()+1))

def silueta_suave(m, ventana=41):
    """Silueta de frasco a partir de los bordes izquierdo y derecho.

       El reborde que salía a media altura venía del cierre: la etiqueta
       asoma un par de píxeles del vidrio, y un cierre con radio grande
       rellena el triángulo entre esa púa y el cuerpo. Rellenar huecos no
       lo quita —es exterior— y una apertura que sí lo quita corta de
       paso las franjas de vidrio de 4 px que quedan a los lados de la
       etiqueta, y desconecta la base.

       El contorno de un frasco es una función SUAVE de la altura, así
       que basta con tomar el borde izquierdo y el derecho de cada fila y
       pasarles una mediana por el eje y: la púa es un pico local de unas
       decenas de filas y la mediana se la lleva, mientras que el salto
       del hombro sobrevive, porque una mediana conserva los escalones
       largos. Rellenar entre los dos bordes tapa la etiqueta de paso."""
    h, w = m.shape
    filas = [y for y in range(h) if m[y].any()]
    if not filas: return m
    L = np.full(h, -1); R = np.full(h, -1)
    for y in filas:
        xs = np.flatnonzero(m[y]); L[y] = xs.min(); R[y] = xs.max()
    y0, y1 = filas[0], filas[-1]
    def mediana(v):
        s = v.copy()
        k = ventana // 2
        for y in range(y0, y1+1):
            a, b = max(y0, y-k), min(y1, y+k)+1
            t = v[a:b]; t = t[t >= 0]
            if len(t): s[y] = int(np.median(t))
        return s
    L, R = mediana(L), mediana(R)
    out = np.zeros_like(m)
    for y in range(y0, y1+1):
        if L[y] >= 0 and R[y] >= L[y]: out[y, L[y]:R[y]+1] = True
    return out

def recorta_envase2(path, caja, regla, cerrar=3, ventana=41, come=2, suaviza=0.9):
    im = Image.open(path).convert('RGB').crop(caja)
    a = np.asarray(im).astype(np.int16)
    m = regla(a)
    m = _erosiona(_dilata(m, cerrar), cerrar)
    m = _mayor(m)
    m = silueta_suave(m, ventana)
    if come: m = _erosiona(m, come)
    alf = Image.fromarray(np.where(m,255,0).astype(np.uint8))
    if suaviza: alf = alf.filter(ImageFilter.GaussianBlur(suaviza))
    out = im.convert('RGBA'); out.putalpha(alf)
    ys, xs = np.where(m)
    if not len(ys): return out, None
    return out.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1)), (int(xs.max()-xs.min()+1), int(ys.max()-ys.min()+1))
