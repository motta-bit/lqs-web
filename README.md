# 🛸 Galaxia LQS — Super matriz del ecosistema

Hub inmersivo del **ecosistema creativo LQS** (Medellín, Colombia): una galaxia pixel-art
donde cada planeta es una rama de la marca. Todo es HTML estático autocontenido —
funciona en GitHub Pages, local o cualquier hosting, sin build.

## Estructura

```
index.html                    ← Sitio LQS (landing editorial: estudio, capacidades,
                                 automatización, universos, muestras, precios, proceso)
galaxia.html                  ← Experiencia inmersiva pixel art (los mundos isométricos)
automatizacion-guia.html      ← Guía técnica interna de Meta Cloud API

mundos/
  ├─ Servicios y paquetes
  │   empresas.html · express.html · creadores.html
  │   productora.html · mercury.html · foma.html
  ├─ Muestras interactivas (demos funcionales)
  │   empresas-muestras.html    generador de identidad, mockup web, chat
  │   express-muestras.html     galería SVG + configurador de pedido
  │   productora-muestras.html  reel simulado, antes/después, formatos
  │   marcas-muestras.html      catálogo joyería + previsualizador de merch
  └─ automatizacion.html        chatbot funcional + paquetes
```

Mundos ya en vivo en repos propios:

| Planeta | Rama | Sitio |
|---|---|---|
| 🛎️ Aloja | Hoteles | https://motta-bit.github.io/Vita-Nova/ |
| 🍽️ Carta | Restaurantes | https://motta-bit.github.io/vitanova/ |

## Publicar (GitHub Pages)

Settings → Pages → *Deploy from a branch* → elegir la rama y carpeta `/ (root)`.
La galaxia queda en `https://motta-bit.github.io/lqs-web/` y los mundos en
`https://motta-bit.github.io/lqs-web/mundos/<planeta>.html` (links relativos, sin config).

## Contacto

WhatsApp **+57 333 279 1710** · cdparravargas@gmail.com

---
*Los archivos de Next.js del scaffold original se conservan pero no se usan para el sitio estático.*
