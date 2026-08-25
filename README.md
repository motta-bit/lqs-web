# ✦ LQS — Sitio y plataforma

Sitio y plataforma del **estudio creativo LQS** (Medellín, Colombia). Una sola aplicación
que reúne servicios, ejemplos interactivos, WhatsApp automático, cotizaciones y el
portal del cliente. HTML estático + Supabase, sin build.

## Estructura

```
index.html    ← LA APLICACIÓN. Todo se navega aquí dentro:
                 Inicio · Servicios · Muestras · Automatización · Nosotros · Cotizar · Mi cuenta
                 Las muestras se abren en un visor interno, sin salir del sitio.

mundos/       ← Fichas y demos que el visor carga
  empresas · express · creadores · productora · mercury · foma
  *-muestras · marcas-muestras · automatizacion · productora-calculadora

legal.html                 ← Políticas, aviso de privacidad y términos
automatizacion-guia.html   ← Guía técnica de Meta Cloud API
PRODUCCION-3-DIAS.md       ← Brief de producción para el equipo
CONTENIDO-PENDIENTE.md     ← Inventario de material gráfico
```

## Base de datos (Supabase · proyecto `lqs`)

`universos` · `paquetes` · `perfiles` · `solicitudes` · `proyectos` · `hitos`
· `citas` · `suscriptores` · `eventos`

Con RLS por fila (cada cliente ve lo suyo) y triggers que registran un evento
por cada solicitud, cita o suscriptor nuevo.

## Publicar

Settings → Pages → *Deploy from a branch* → rama y carpeta `/ (root)`.
Requiere servirse por HTTP (no abrir con doble clic) para que el visor interno cargue.

## Contacto

WhatsApp **+57 333 279 1710** · loqueseaproductionsp1@gmail.com
