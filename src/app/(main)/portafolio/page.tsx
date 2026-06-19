import type { Metadata } from 'next'
import { PortfolioGrid }    from '@/components/sections/PortfolioGrid'
import { BeforeAfterSlider } from '@/components/sections/BeforeAfterSlider'

export const metadata: Metadata = { title: 'Portafolio | LQS' }

export default function Portafolio() {
  return (
    <>
      <PortfolioGrid />
      <BeforeAfterSlider />
    </>
  )
}
