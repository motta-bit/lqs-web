import type { Metadata } from 'next'
import { ContactBlock } from '@/components/sections/ContactBlock'

export const metadata: Metadata = { title: 'Contacto | LQS' }

export default function Contacto() {
  return <ContactBlock />
}
