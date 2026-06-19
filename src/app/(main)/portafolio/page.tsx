import type { Metadata }    from 'next'
import { PortfolioGrid }    from '@/components/sections/PortfolioGrid'
import { MuestrasEmpresas } from '@/components/sections/MuestrasEmpresas'
import { BeforeAfterSlider } from '@/components/sections/BeforeAfterSlider'

export const metadata: Metadata = { title: 'Portafolio | LQS' }

export default function Portafolio() {
  return (
    <>
      <MuestrasEmpresas />
      <PortfolioGrid />
      <BeforeAfterSlider />
    </>
  )
}
