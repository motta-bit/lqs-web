# -*- coding: utf-8 -*-
"""Funde presentacion.html y propuesta.html en un solo archivo.

El catálogo deja de ser un archivo aparte y pasa a HABITAR la presentación:
se recorre en la misma página, donde el argumento lo pide.

Las dos hojas de estilo comparten 18 nombres de clase y casi todos los
selectores de elemento desnudo, así que fundirlas a pelo las pisa. Cada una
se encierra en su espacio de nombres —.propuesta y .muestra— y lo único que
queda global es lo que de verdad es común: la tipografía incrustada, la
paleta base, el telón y el grano.

Tres cosas que no son mecánicas y hay que resolver a mano:

  · El .cielo del catálogo NO es un telón: lleva el haz teñido con el color
    de la pieza del frente. Fundirlo con el de la presentación habría teñido
    el documento entero. Va como capa propia, encendida solo mientras la
    muestra está en pantalla.
  · El grano del catálogo sobra: con los dos puestos el ruido se dobla.
  · Las capturas de pantalla del catálogo dejan de tener sentido cuando el
    catálogo está ahí abajo. Fuera, y el enlace pasa a ser un ancla.
"""
import base64, pathlib, re, sys

B = pathlib.Path('/home/user/lqs-web/clientes/alquimia-herbal')

# ── partidor de CSS que respeta las llaves anidadas ──────────────────
def avanza(css, i):
    """Salta comentarios y cadenas. Sin esto, una llave dentro de un
    comentario en prosa descuadra el conteo y media hoja sale sin acotar."""
    n = len(css)
    if css.startswith('/*', i):
        f = css.find('*/', i + 2)
        return n if f == -1 else f + 2
    if css[i] in '"\'':
        q, k = css[i], i + 1
        while k < n:
            if css[k] == '\\':
                k += 2; continue
            if css[k] == q:
                return k + 1
            k += 1
        return n
    return i + 1


def bloques(css):
    i, n = 0, len(css)
    while i < n:
        # buscar la '{' de apertura saltando comentarios y cadenas
        j, k = -1, i
        while k < n:
            if css.startswith('/*', k) or css[k] in '"\'':
                k = avanza(css, k); continue
            if css[k] == '{':
                j = k; break
            k += 1
        if j == -1:
            resto = css[i:].strip()
            if resto:
                yield ('suelto', resto, '')
            return
        prel = css[i:j]
        k, prof = j + 1, 1
        while k < n and prof:
            if css.startswith('/*', k) or css[k] in '"\'':
                k = avanza(css, k); continue
            if css[k] == '{':
                prof += 1
            elif css[k] == '}':
                prof -= 1
            k += 1
        yield ('regla', prel.strip(), css[j + 1:k - 1])
        i = k


def corta_lista(sel):
    """Parte una lista de selectores por comas sin romper :not(), [a,b]."""
    out, act, prof = [], [], 0
    for c in sel:
        if c in '([':
            prof += 1
        elif c in ')]':
            prof -= 1
        if c == ',' and prof == 0:
            out.append(''.join(act)); act = []
        else:
            act.append(c)
    if act:
        out.append(''.join(act))
    return [s.strip() for s in out if s.strip()]


def corta_cabeza(s):
    """Separa el compuesto inicial (html:not(:has(…)).rueda) del resto."""
    i, n, prof = 0, len(s), 0
    while i < n:
        c = s[i]
        if c == '(':
            prof += 1
        elif c == ')':
            prof -= 1
        elif prof == 0 and (c.isspace() or c in '>+~'):
            break
        i += 1
    return s[:i], s[i:].strip()


def transforma(sel, pref, intactos):
    s = sel.strip()
    if not s:
        return None
    if s in intactos:
        return s
    if s.startswith('*'):
        return None                      # el reinicio universal ya está puesto
    if s in ('html', 'body', ':root'):
        return pref                      # su tipografía y sus variables, al envoltorio
    if s.startswith('html') or s.startswith(':root'):
        cab, resto = corta_cabeza(s)
        if resto and resto[0] in '>+~':
            sys.exit('combinador pegado a html, hay que mirarlo: ' + s)
        return (cab + ' ' + pref + (' ' + resto if resto else '')).strip()
    return pref + ' ' + s


def parte_comentarios(prel):
    """Separa los comentarios de cabecera del preludio.

    Sin esto, una regla precedida de comentario llega como
    '/* … */ @media (…)' y deja de reconocerse como arroba: su interior
    salía entero sin acotar, que es justo lo que se quiere evitar."""
    coms, resto = [], prel
    while True:
        r = resto.lstrip()
        if r.startswith('/*'):
            f = r.find('*/')
            if f == -1:
                break
            coms.append(r[:f + 2])
            resto = r[f + 2:]
        else:
            resto = r
            break
    return '\n'.join(coms), resto


def acota(css, pref, intactos=frozenset()):
    out = []
    for tipo, prel, cuerpo in bloques(css):
        if tipo == 'suelto':
            out.append(prel)
            continue
        coms, prel = parte_comentarios(prel)
        if coms:
            out.append(coms)
        low = prel.lower()
        if low.startswith('@font-face'):
            continue                                   # ya van una vez, arriba
        if low.startswith('@keyframes') or low.startswith('@-webkit-keyframes'):
            out.append(prel + '{' + cuerpo + '}')
            continue
        if low.startswith(('@media', '@supports', '@container')):
            dentro = acota(cuerpo, pref, intactos)
            if dentro.strip():
                out.append(prel + '{' + dentro + '}')
            continue
        if low.startswith('@'):
            out.append(prel + '{' + cuerpo + '}')
            continue
        sels = [transforma(s, pref, intactos) for s in corta_lista(prel)]
        sels = [s for s in sels if s]
        if sels:
            out.append(','.join(sels) + '{' + cuerpo + '}')
    return '\n'.join(out)


def trozos(nombre):
    h = (B / nombre).read_text(encoding='utf-8')
    css = h[h.index('<style>') + len('<style>'):h.index('</style>')]
    cuerpo = h[h.index('<body>') + len('<body>'):h.rindex('</body>')]
    return h, css, cuerpo


hr, css_r, cue_r = trozos('presentacion.html')
hp, css_p, cue_p = trozos('propuesta.html')

# ── la tipografía, una sola vez ──────────────────────────────────────
caras = re.findall(r'@font-face\{[^}]*\}', css_r)
if len(caras) != 3:
    sys.exit('esperaba tres @font-face en la presentación, hay %d' % len(caras))
FUENTES = '\n'.join(caras)

# ── el símbolo del ojo, una sola vez ────────────────────────────────
m = re.search(r'<svg width="0" height="0"[^>]*>.*?</svg>', cue_r, re.S)
if not m:
    sys.exit('no encuentro el bloque <defs> del ojo')
SIMBOLO = m.group(0)
cue_r = cue_r.replace(SIMBOLO, '')
cue_p = re.sub(r'<svg width="0" height="0"[^>]*>.*?</svg>', '', cue_p, flags=re.S)

# ── los guiones, fuera de sus cuerpos ───────────────────────────────
def saca_script(cuerpo):
    m = re.search(r'<script>(.*?)</script>', cuerpo, re.S)
    if not m:
        sys.exit('falta el script')
    return cuerpo.replace(m.group(0), ''), m.group(1)

cue_r, js_r = saca_script(cue_r)
cue_p, js_p = saca_script(cue_p)

# ── lo que se queda global ──────────────────────────────────────────
GLOBAL = frozenset({'.cielo', '.grano', 'img,svg,canvas', 'a', ':focus-visible',
                    'main', '*', 'html', 'body', ':root'})
css_r_ac = acota(css_r, '.propuesta', GLOBAL)
css_p_ac = acota(css_p, '.muestra')

# la presentación conserva de verdad los globales; .propuesta solo envuelve
# lo suyo, así que hay que reponer el bloque base tal cual venía
base = []
for tipo, prel, cuerpo in bloques(css_r):
    if tipo != 'regla':
        continue
    if prel.lower().startswith('@font-face'):
        continue
    if prel.strip() in GLOBAL:
        base.append(prel.strip() + '{' + cuerpo + '}')
BASE = '\n'.join(base)

# ══ cirugía del cuerpo ═══════════════════════════════════════════════
VITRINA_NUEVA = """<p class="grande sep tenue sube" style="max-width:56ch">No hace
        falta imaginárselo: el catálogo está en esta misma página, más abajo. Se
        recorre entero, el carrusel se arrastra con el dedo y cambia de idioma
        con un botón.</p>"""

UMBRAL = """
  <div class="umbral">
    <div class="centro">
      <div class="marco">
        <p class="que">Aquí empieza el catálogo de muestra</p>
        <p>Lo que sigue es la pieza funcionando, no una imagen de ella: el
          carrusel se arrastra, la página se enciende con el color de cada
          producto, hay español e inglés y el pedido sale por WhatsApp.
          <b>Las fotos y los textos son de muestra</b> — ahí es donde entran
          los tuyos.</p>
      </div>
    </div>
  </div>
"""

PIE = """
<footer class="pie-lqs">
  <div class="centro">
    <p><b>LQS</b> · propuesta para Alquimia Herbal · Medellín</p>
    <p>Un solo archivo, sin librerías ni dependencias: las tipografías y las
      imágenes van dentro, así que abre sin conexión y se guarda o se reenvía
      como cualquier otro archivo.</p>
    <p>Todo lo que se ve aquí —la propuesta y el catálogo— es una base para
      decidir juntos. Nada de esto es definitivo.</p>
  </div>
</footer>
"""


def unica(txt, a, b, que):
    if txt.count(a) != 1:
        sys.exit('%s: esperaba 1, hay %d' % (que, txt.count(a)))
    return txt.replace(a, b)


# 1 · el pie de la propuesta se va. Ahora hay uno solo, al final de todo, y
#     lo que decía —«son dos archivos sueltos que viajan juntos»— dejó de
#     ser verdad en el momento en que se fundieron.
_i = cue_r.index('<footer>')
_j = cue_r.index('</footer>') + len('</footer>')
cue_r = cue_r[:_i] + cue_r[_j:]

# 2 · las capturas sobran: el catálogo está ahí abajo, vivo. Son 54 KB de
#     imagen que además envejecían mal, porque retrataban una versión.
_k = cue_r.index('<div class="vitrina sube">')
_f = cue_r.index('</div>', cue_r.index('alt="El mismo catálogo')) + len('</div>')
cue_r = cue_r[:_k] + VITRINA_NUEVA + cue_r[_f:]

# 2b · el telón, el grano y el <main> de la presentación los repone la
#      plantilla, que ahora es la dueña del documento. Dejarlos aquí daba
#      tres .cielo, dos .grano y dos <main> anidados.
cue_r, _n = re.subn(r'<div class="cielo"[^>]*></div>\s*', '', cue_r, count=1)
if _n != 1:
    sys.exit('no encontré el cielo de la presentación')
cue_r, _n = re.subn(r'<div class="grano"[^>]*></div>\s*', '', cue_r, count=1)
if _n != 1:
    sys.exit('no encontré el grano de la presentación')
cue_r = unica(cue_r, '<main>', '', 'main de la presentación')
cue_r = unica(cue_r, '</main>', '', 'cierre de main de la presentación')
css_r_ac = re.sub(r'\.propuesta main\b', '.propuesta', css_r_ac)

# 3 · los enlaces al otro archivo pasan a ser anclas dentro de este
cue_r = unica(cue_r, '<a class="bot lleno" href="propuesta.html">Abrir el catálogo</a>',
              '<a class="bot lleno" href="#muestra">Bajar al catálogo</a>', 'enlace 1')
cue_r = unica(cue_r, '<a class="bot" href="propuesta.html">Volver a abrir el catálogo</a>',
              '<a class="bot" href="#muestra">Volver al catálogo</a>', 'enlace 2')
if 'propuesta.html' in cue_r:
    sys.exit('queda alguna referencia al archivo viejo')

# 4 · el grano del catálogo sobra: con los dos puestos, el ruido se dobla
cue_p, _n = re.subn(r'<div class="grano"[^>]*></div>\s*', '', cue_p, count=1)
if _n != 1:
    sys.exit('no encontré el grano del catálogo')

# 5 · <main> anidado es HTML inválido. El del catálogo pasa a div, y su
#     regla ya acotada se renombra con él.
cue_p = unica(cue_p, '<main>', '<div class="main-m">', 'main del catálogo')
cue_p = unica(cue_p, '</main>', '</div>', 'cierre de main del catálogo')
css_p_ac = re.sub(r'\.muestra main\b', '.muestra .main-m', css_p_ac)


PUENTE = """
/* ══ la costura ══════════════════════════════════════════════════════
   Dos documentos en uno. Cada hoja vive dentro de su nombre —.propuesta
   y .muestra— porque comparten dieciocho nombres de clase y casi todos
   los selectores de elemento: sin acotarlas se pisan.

   El .cielo de la muestra no es un telón, es el HAZ teñido con el color
   de la pieza que está al frente. Por eso no se funde con el de arriba y
   por eso solo se enciende cuando la muestra está en pantalla: si no, el
   documento entero se teñía de lavanda mientras se lee la propuesta. */
.muestra{position:relative;display:block}
.muestra>.cielo{opacity:0;transition:opacity .7s ease}
.muestra.viva>.cielo{opacity:1}
.muestra>.polvo{opacity:0;transition:opacity .7s ease}
.muestra.viva>.polvo{opacity:1}
@media (prefers-reduced-motion:reduce){
  .muestra>.cielo,.muestra>.polvo{transition:none}
}

/* el paso de la propuesta a la muestra, anunciado */
.umbral{padding:clamp(40px,8vh,88px) var(--margen) 0;position:relative;z-index:2}
.umbral .centro{max-width:1120px;margin:0 auto}
.umbral p{max-width:56ch;color:var(--tenue)}
.umbral .marco{border:1px solid var(--linea);border-left:2px solid var(--oro);
  border-radius:0 16px 16px 0;padding:clamp(16px,2.6vw,24px) clamp(18px,3vw,28px);
  background:linear-gradient(100deg,rgba(227,178,60,.09),transparent 62%)}
.umbral b{color:var(--crema);font-weight:700}
.umbral .que{font-family:var(--disp);font-weight:400;letter-spacing:.015em;
  font-size:clamp(1.15rem,2.8vw,1.6rem);color:var(--crema);margin-bottom:9px}

/* el pie queda fuera de los dos espacios de nombres, así que se viste aquí */
.pie-lqs{position:relative;z-index:2;border-top:1px solid var(--linea);
  padding:clamp(30px,5vh,56px) var(--margen) clamp(38px,6.5vh,70px);
  font-size:.84rem;color:rgba(253,249,238,.72)}
.pie-lqs .centro{max-width:1120px;margin:0 auto;display:grid;gap:12px}
.pie-lqs p{max-width:66ch}
.pie-lqs b{color:var(--crema);font-weight:700}
"""

SALIDA = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Alquimia Herbal · Propuesta y catálogo de muestra</title>
<meta name="description" content="Propuesta de trabajo de LQS para Alquimia Herbal, con el catálogo de muestra dentro: dónde está la marca hoy, qué necesita y hasta dónde puede escalar.">
<meta name="theme-color" content="#0e1109">
<style>
{FUENTES}
{BASE}
{PUENTE}
{css_r_ac}
{css_p_ac}
</style>
</head>
<body>

<div class="cielo" aria-hidden="true"></div>
<div class="grano" aria-hidden="true"></div>

<main>
__PROPUESTA__
__UMBRAL__
<div class="muestra" id="muestra">
__MUESTRA__
</div>
</main>

__PIE__

{SIMBOLO}

<script>
{js_r}
</script>
<script>
{js_p}
</script>
<script>
/* El haz y el polvo se encienden con el CARRUSEL, no con la muestra entera.
   El haz existe para teñir la habitación con el color de la pieza que está
   al frente, así que fuera del carrusel no significa nada: colgado de la
   muestra completa lavaba el cierre de la propuesta, que está justo encima,
   y seguía encendido en la sección de papel, que está justo debajo. */
(function(){{
  var m = document.getElementById('muestra');
  var r = document.getElementById('rueda');
  if (!m) return;
  if (!r || !('IntersectionObserver' in window)){{ m.classList.add('viva'); return; }}
  new IntersectionObserver(function(es){{
    es.forEach(function(e){{ m.classList.toggle('viva', e.isIntersecting); }});
  }}, {{rootMargin:'-8% 0px -8% 0px'}}).observe(r);
}})();
</script>
</body>
</html>
"""

pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/fundido.html').write_text(
    SALIDA.replace('__PROPUESTA__', '<div class="propuesta">' + cue_r + '</div>')
          .replace('__MUESTRA__', cue_p)
          .replace('__UMBRAL__', UMBRAL)
          .replace('__PIE__', PIE),
    encoding='utf-8')
print('armado en bruto ·', round(len(SALIDA.encode()) / 1024), 'KB de plantilla')
print('css propuesta acotado:', round(len(css_r_ac) / 1024), 'KB')
print('css muestra acotado  :', round(len(css_p_ac) / 1024), 'KB')
