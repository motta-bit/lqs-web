import { redirect } from 'next/navigation'

/**
 * /servicios traía PackagesSection con precios viejos (contradicen D-11) y
 * duplica lo que la ciudad ya hace: los servicios SON los distritos ahora.
 * Redirige a la home (la ciudad), donde se exploran como distritos y de ahí
 * al cotizador del Ayuntamiento.
 */
export default function ServiciosRedirect() {
  redirect('/')
}
