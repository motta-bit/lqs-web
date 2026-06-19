import type { Metadata } from 'next'
import { AutoDiagnosis }   from '@/components/sections/AutoDiagnosis'
import { ServicesGrid }    from '@/components/sections/ServicesGrid'
import { PackagesSection } from '@/components/sections/PackagesSection'

export const metadata: Metadata = { title: 'Servicios | LQS' }

export default function Servicios() {
  return (
    <>
      <AutoDiagnosis />
      <ServicesGrid />
      <PackagesSection />
    </>
  )
}
