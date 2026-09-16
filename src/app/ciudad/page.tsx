import { redirect } from 'next/navigation'

/**
 * /ciudad quedó como alias histórico: el hub vive ahora en `/` (D-13).
 * Redirección permanente para consolidar SEO y no servir contenido duplicado.
 * Los distritos siguen en /ciudad/[distrito].
 */
export default function CiudadAlias() {
  redirect('/')
}
