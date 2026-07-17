import type { Metadata } from 'next'
import { PlanesTabs }  from '@/components/sections/PlanesTabs'
import { CTAFinal }    from '@/components/sections/CTAFinal'

export const metadata: Metadata = {
  title: 'Planes y Precios | LQS Studio',
  description: 'Planes de branding, web, video, fotografía, redes sociales, eventos y marketing digital para tu empresa.',
}

export default function PlanesPage() {
  return (
    <>
      {/* Hero de planes */}
      <section className="section-compact py-24 px-6 flex items-center" style={{ background: '#000', borderBottom: '1px solid #111' }}>
        <div className="max-w-7xl mx-auto w-full">
          <p className="font-mono-data text-xs tracking-[0.3em] uppercase mb-6" style={{ color: '#FF4600' }}>
            // SERVICIOS Y PRECIOS
          </p>
          <h1 className="font-authority text-[clamp(3.5rem,11vw,9rem)] leading-none mb-6" style={{ color: '#fff' }}>
            PLANES<br />
            <span style={{ color: '#FF4600' }}>LQS.</span>
          </h1>
          <p className="font-readability text-lg max-w-lg" style={{ color: '#666' }}>
            Cada servicio diseñado para resultados concretos. Elige el plan que se adapta a tu negocio, o combínalos con descuento.
          </p>
        </div>
      </section>

      <PlanesTabs />
      <CTAFinal />
    </>
  )
}
