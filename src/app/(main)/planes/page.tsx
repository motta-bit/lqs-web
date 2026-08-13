import { redirect } from 'next/navigation'

/**
 * /planes traía precios hardcodeados viejos que contradicen el modelo
 * comercial D-11 (el cotizador del Ayuntamiento es la única fuente de precios).
 * Se redirige ahí para no mostrar tarifas obsoletas. La cotización real vive
 * en la conversación guiada, sin catálogo frontal (regla 2 del brief).
 */
export default function PlanesRedirect() {
  redirect('/ayuntamiento')
}
