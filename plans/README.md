# Planes de movimiento — sitio LQS

Auditoría de animación sobre `index.html` en el commit `2bf2c37`, contra el
catálogo de ocho categorías de `improve-animations`.

Resumen honesto: el sitio ya hace bien lo difícil. Los reveals al hacer scroll
tienen escalonado de 60ms limitado a seis elementos (`index.html:1180`), el hero
escalona sus dos líneas, la marquesina usa `linear` que es lo correcto para
movimiento constante, el modal de ingresar arranca en `scale(.97)` y no en
`scale(0)`, y el banner de promociones anima solo `transform`. Nada de eso está
en esta lista porque no hace falta tocarlo.

Lo que sí falla es sistemático más que puntual: ninguna transición declara sus
propiedades, las curvas están escritas a mano siete veces, y el movimiento
reducido está resuelto con un martillazo que produce un spinner estroboscópico.

## Planes

| # | Plan | Severidad | Estado |
| --- | --- | --- | --- |
| 001 | [Consolidar las curvas en tokens](001-tokens-de-movimiento.md) | MEDIA | TODO |
| 002 | [Rehacer `prefers-reduced-motion`](002-movimiento-reducido.md) | **ALTA** | TODO |
| 003 | [Quitar `transition: all` y bajar duraciones de hover](003-transiciones-y-duraciones.md) | **ALTA** | TODO |
| 004 | [Que la lista de precios también se cierre](004-precios-abrir-y-cerrar.md) | MEDIA | TODO |
| 005 | [Dar entrada y salida al visor](005-entrada-del-visor.md) | MEDIA | TODO |
| 006 | [Feedback al pulsar y hovers que no se peguen](006-feedback-tactil.md) | MEDIA | TODO |
| 007 | [Aligerar el cambio de vista y las barras](007-cambio-de-vista-y-barras.md) | MEDIA | TODO |

## Orden de ejecución

```
001  ← primero, sin excepción: crea los tokens que usan todos los demás
 ├── 002   (independiente entre sí a partir de aquí)
 ├── 003 ──┬── 006   (006 necesita que 003 deje transform en las transiciones)
 ├── 004   │
 ├── 005   │
 └── 007 ──┘
```

- **001 es prerrequisito de todos.** Los demás planes escriben `var(--ease-out)`,
  `var(--dur-ui)`, `var(--dur-fast)` y `var(--dur-panel)`; sin 001 esas variables
  no existen y las transiciones se quedan sin curva ni duración.
- **006 va después de 003.** El feedback al pulsar necesita que `transform` esté
  en la lista de propiedades de la transición, que es lo que hace 003.
- **002 y 006 se tocan.** Ambos escriben reglas sobre los mismos `:hover`. Si
  aplicas los dos, el bloque `@media(prefers-reduced-motion:reduce)` tiene que
  quedar **después** del bloque `@media (hover: hover)` en el archivo.
- 004, 005 y 007 son independientes entre sí; se pueden repartir.

## Si hay que priorizar

Con tiempo para tres: **002, 003 y 004**. El 002 arregla un defecto de
accesibilidad real (spinner estroboscópico para quien pidió menos movimiento), el
003 es el que más cambia cómo se siente el sitio al usarlo, y el 004 arregla la
interacción de venta más nueva de la página.

## Qué se revisó y se descartó

No son hallazgos; se citan para que nadie los vuelva a "arreglar":

- `.tick .tr{animation:mv 32s linear infinite}` (`index.html:102`) — `linear` es
  la curva correcta para movimiento constante.
- `.modal` con `transform-origin` implícito al centro (`index.html:236`) — los
  modales aparecen centrados; ahí el origen al centro es correcto.
- `#hero h1 .ln i` a 950ms (`index.html:95`) — entrada de marketing, puede durar
  más que la UI. Ya tiene escalonado de 100ms en la segunda línea.
- `.rv` a 800ms (`index.html:294`) — mismo caso, y su escalonado de 60ms está
  dentro del rango recomendado.
- `<details class="ficha">` sin animación de altura (`index.html:277-283`) — el
  `+` que rota a `×` ya comunica el estado; animar la altura de un `<details>`
  nativo no compensa en un acordeón de documentación técnica.
