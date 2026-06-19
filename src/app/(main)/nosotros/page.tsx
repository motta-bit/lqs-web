import type { Metadata } from 'next'
import { AttributeGrid }    from '@/components/sections/AttributeGrid'
import { ManifestoSection } from '@/components/sections/ManifestoSection'

export const metadata: Metadata = { title: 'Nosotros | LQS' }

export default function Nosotros() {
  return (
    <>
      <AttributeGrid />
      <ManifestoSection />
    </>
  )
}
