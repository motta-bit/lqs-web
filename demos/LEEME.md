# Muestras

Las cinco muestras de marca —Atelier Norte, Rescoldo, Tendido, Casa Tepemete y
Turno— salieron de aquí: **ya viven en la página principal**, en
`mundos/*-muestras.html`, que es lo que abre el visor interno. Tenerlas también
aquí era una segunda copia que nadie abría, con 4,8 MB de imágenes detrás.

Lo que queda es lo que se cuelga para compartir por enlace.

| Archivo | Qué es |
|---|---|
| `alquimia-herbal.html` | **Alquimia Herbal** · la propuesta de trabajo con el catálogo de muestra dentro |
| `index.html` | Salto a la anterior, para que la URL de la carpeta abra sin escribir el nombre |

## `alquimia-herbal.html`

Un solo archivo de 1,0 MB. **Sin librerías, sin CDN y sin red**: las dos
tipografías y todas las imágenes van incrustadas, así que abre igual desde un
enlace, desde un correo o desde un USB, y funciona sin conexión.

Tiene dos partes en el mismo documento:

1. **La propuesta** — dónde está la marca hoy, qué vemos que necesita, la
   dirección visual propuesta y los once módulos de hasta dónde puede escalar.
2. **El catálogo de muestra**, funcionando: el carrusel se arrastra, la página
   se enciende con el color de cada producto, hay español e inglés y el pedido
   sale por WhatsApp.

**No se edita aquí.** Se construye desde `clientes/alquimia-herbal/`:

    cd clientes/alquimia-herbal
    python3 construir-pagina.py alquimia-herbal.html
    cp alquimia-herbal.html ../../demos/

El porqué del constructor, y las dos trampas del acotador de CSS, están en
`clientes/alquimia-herbal/LEEME.md`.

## Antes de pasar el enlace

La página lleva **datos reales de la clienta**: sus cifras de Instagram, su
número de WhatsApp y el análisis de su negocio. Una URL pública es pública
aunque no esté enlazada desde ningún sitio. Si el enlace va a circular más allá
de ella, conviene cambiar el WhatsApp por el de LQS y quitar las cifras — es un
cambio de dos líneas en `presentacion.html` y se reconstruye.
